import { pool, isMockMode } from '../database/config.js';
import { mockDb } from '../database/mock.js';
import { Investment, InvestmentStatus, CreateInvestmentData } from '../types/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';

export interface InvestmentFilters {
  status?: InvestmentStatus;
  category?: string;
  page?: number;
  limit?: number;
}

export class InvestmentModel {
  static async findAll(filters: InvestmentFilters = {}): Promise<Investment[]> {
    if (isMockMode()) {
      return mockDb.investments.findAll(filters);
    }

    try {
      let query = `
        SELECT
          id, title, description, long_description as longDescription,
          amount_goal as amountGoal, amount_raised as amountRaised,
          currency, images, category, status, submitted_by as submittedBy,
          submitter_email as submitterEmail, submission_date as submissionDate,
          apy_range as apyRange, min_investment as minInvestment,
          term, tags
        FROM investments
      `;

      const conditions = [];
      const values = [];

      if (filters.status) {
        conditions.push(`status = ?`);
        values.push(filters.status);
      }

      if (filters.category) {
        conditions.push(`category = ?`);
        values.push(filters.category);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY submission_date DESC`;

      // Add pagination
      const limit = parseInt(String(filters.limit || 10));
      const page = parseInt(String(filters.page || 1));
      const offset = (page - 1) * limit;

      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const [rows] = await pool.execute(query, values);

      // Parse JSON fields
      return (rows as any[]).map(row => ({
        ...row,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
      }));
    } catch (error) {
      console.error('Investment.findAll error:', error);
      throw new DatabaseError('Failed to fetch investments');
    }
  }

  static async findById(id: string): Promise<Investment | null> {
    if (isMockMode()) {
      return mockDb.investments.findById(id);
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, title, description, long_description as longDescription,
          amount_goal as amountGoal, amount_raised as amountRaised,
          currency, images, category, status, submitted_by as submittedBy,
          submitter_email as submitterEmail, submission_date as submissionDate,
          apy_range as apyRange, min_investment as minInvestment,
          term, tags
        FROM investments
        WHERE id = ?
      `, [id]);

      const row = (rows as any[])[0];
      if (!row) return null;

      // Parse JSON fields
      return {
        ...row,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
      };
    } catch (error) {
      throw new DatabaseError('Failed to fetch investment');
    }
  }

  static async create(investmentData: CreateInvestmentData): Promise<Investment> {
    if (isMockMode()) {
      return mockDb.investments.create(investmentData);
    }

    try {
      await pool.execute(`
        INSERT INTO investments (
          id, title, description, long_description, amount_goal, currency, images,
          category, submitted_by, submitter_email, apy_range, min_investment,
          term, tags, status, amount_raised
        ) VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        investmentData.title,
        investmentData.description,
        investmentData.longDescription,
        investmentData.amountGoal,
        investmentData.currency,
        JSON.stringify(investmentData.images),
        investmentData.category,
        investmentData.submittedBy,
        investmentData.submitterEmail,
        investmentData.apyRange,
        investmentData.minInvestment,
        investmentData.term,
        JSON.stringify(investmentData.tags),
        InvestmentStatus.PENDING, // Default status
        0 // Default amount raised
      ]);

      // Get the inserted investment
      const [rows] = await pool.execute(`
        SELECT
          id, title, description, long_description as longDescription,
          amount_goal as amountGoal, amount_raised as amountRaised,
          currency, images, category, status, submitted_by as submittedBy,
          submitter_email as submitterEmail, submission_date as submissionDate,
          apy_range as apyRange, min_investment as minInvestment,
          term, tags
        FROM investments
        WHERE title = ? AND submitted_by = ?
        ORDER BY created_at DESC
        LIMIT 1
      `, [investmentData.title, investmentData.submittedBy]);

      const row = (rows as any[])[0];
      return {
        ...row,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
      };
    } catch (error) {
      throw new DatabaseError('Failed to create investment');
    }
  }

  static async update(id: string, updates: Partial<Investment>): Promise<Investment> {
    if (isMockMode()) {
      const existingInvestment = await this.findById(id);
      if (!existingInvestment) {
        throw new NotFoundError('Investment not found');
      }
      return mockDb.investments.update(id, updates) as Investment;
    }

    try {
      // Check if investment exists
      const existingInvestment = await this.findById(id);
      if (!existingInvestment) {
        throw new NotFoundError('Investment not found');
      }

      // Build dynamic update query
      const updateFields = [];
      const values = [];

      const fieldMappings = {
        title: 'title',
        description: 'description',
        longDescription: 'long_description',
        amountGoal: 'amount_goal',
        amountRaised: 'amount_raised',
        currency: 'currency',
        images: 'images',
        category: 'category',
        status: 'status',
        submittedBy: 'submitted_by',
        submitterEmail: 'submitter_email',
        apyRange: 'apy_range',
        minInvestment: 'min_investment',
        term: 'term',
        tags: 'tags'
      };

      for (const [key, dbField] of Object.entries(fieldMappings)) {
        if (updates[key as keyof Investment] !== undefined) {
          updateFields.push(`${dbField} = ?`);
          values.push(updates[key as keyof Investment]);
        }
      }

      if (updateFields.length === 0) {
        return existingInvestment;
      }

      values.push(id);

      await pool.execute(
        `UPDATE investments SET ${updateFields.join(', ')} WHERE id = ?`,
        values
      );

      const [rows] = await pool.execute(
        `SELECT
          id, title, description, long_description as longDescription,
          amount_goal as amountGoal, amount_raised as amountRaised,
          currency, images, category, status, submitted_by as submittedBy,
          submitter_email as submitterEmail, submission_date as submissionDate,
          apy_range as apyRange, min_investment as minInvestment,
          term, tags
        FROM investments
        WHERE id = ?`,
        [id]
      );

      const updatedRow = (rows as any[])[0];
      return {
        ...updatedRow,
        images: typeof updatedRow.images === 'string' ? JSON.parse(updatedRow.images) : updatedRow.images,
        tags: typeof updatedRow.tags === 'string' ? JSON.parse(updatedRow.tags) : updatedRow.tags
      };
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update investment');
    }
  }

  static async delete(id: string): Promise<boolean> {
    if (isMockMode()) {
      return mockDb.investments.delete(id);
    }

    try {
      const [result] = await pool.execute('DELETE FROM investments WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete investment');
    }
  }

  static async count(filters: Omit<InvestmentFilters, 'page' | 'limit'> = {}): Promise<number> {
    if (isMockMode()) {
      const investments = mockDb.investments.findAll(filters);
      return investments.length;
    }

    try {
      let query = 'SELECT COUNT(*) as count FROM investments';
      const conditions: string[] = [];
      const values: any[] = [];

      if (filters.status) {
        conditions.push('status = ?');
        values.push(filters.status);
      }

      if (filters.category) {
        conditions.push('category = ?');
        values.push(filters.category);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      const [rows] = await pool.execute(query, values);
      return parseInt((rows as any[])[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to count investments');
    }
  }

  static async getTotalValueLocked(): Promise<number> {
    try {
      const [rows] = await pool.execute(
        `SELECT COALESCE(SUM(amount_raised), 0) as total
         FROM investments
         WHERE status IN ('Open', 'Funded')`
      );
      return parseFloat((rows as any[])[0].total);
    } catch (error) {
      throw new DatabaseError('Failed to calculate total value locked');
    }
  }

  static async getPendingCount(): Promise<number> {
    try {
      const [rows] = await pool.execute(
        `SELECT COUNT(*) as count FROM investments WHERE status = 'Pending Approval'`
      );
      return parseInt((rows as any[])[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to count pending investments');
    }
  }
}
