import { pool, isMockMode } from '../database/config.js';
import { mockDb } from '../database/mock.js';
import { Investment, InvestmentStatus, CreateInvestmentData } from '../types/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { TranslationService } from '../services/translationService.js';

export interface InvestmentFilters {
  status?: InvestmentStatus;
  category?: string;
  page?: number;
  limit?: number;
  lang?: string; // Add language parameter
}

export class InvestmentModel {
  static async findAll(filters: InvestmentFilters = {}): Promise<Investment[]> {
    if (isMockMode()) {
      return mockDb.investments.findAll(filters);
    }

    try {
      const { lang, ...otherFilters } = filters;
      const useTranslations = lang && lang !== 'en';

      let query: string;

      if (useTranslations) {
        // Query with LEFT JOIN to get translations, fallback to English
        query = `
          SELECT
            i.id,
            COALESCE(t.title, i.title) as title,
            COALESCE(t.description, i.description) as description,
            COALESCE(t.long_description, i.long_description) as longDescription,
            i.amount_goal as amountGoal,
            i.amount_raised as amountRaised,
            i.currency,
            i.images,
            COALESCE(t.category, i.category) as category,
            i.status,
            i.submitted_by as submittedBy,
            i.submitter_email as submitterEmail,
            i.submission_date as submissionDate,
            i.apy_range as apyRange,
            i.min_investment as minInvestment,
            i.term,
            COALESCE(t.tags, i.tags) as tags
          FROM investments i
          LEFT JOIN investment_translations t ON i.id = t.investment_id AND t.lang = ?
        `;
      } else {
        // Standard query for English or when no language specified
        query = `
          SELECT
            id, title, description, long_description as longDescription,
            amount_goal as amountGoal, amount_raised as amountRaised,
            currency, images, category, status, submitted_by as submittedBy,
            submitter_email as submitterEmail, submission_date as submissionDate,
            apy_range as apyRange, min_investment as minInvestment,
            term, tags
          FROM investments
        `;
      }

      const conditions = [];
      const values = [];

      // Add language parameter if using translations
      if (useTranslations) {
        values.push(lang);
      }

      if (otherFilters.status) {
        conditions.push(`${useTranslations ? 'i.' : ''}status = ?`);
        values.push(otherFilters.status);
      }

      if (otherFilters.category) {
        // For category filtering with translations, we need to check both original and translated
        if (useTranslations) {
          conditions.push(`(COALESCE(t.category, i.category) = ?)`);
        } else {
          conditions.push(`category = ?`);
        }
        values.push(otherFilters.category);
      }

      if (conditions.length > 0) {
        query += ` WHERE ${conditions.join(' AND ')}`;
      }

      query += ` ORDER BY ${useTranslations ? 'i.' : ''}submission_date DESC`;

      // Add pagination
      const limit = parseInt(String(otherFilters.limit || 10));
      const page = parseInt(String(otherFilters.page || 1));
      const offset = (page - 1) * limit;

      query += ` LIMIT ${limit} OFFSET ${offset}`;

      const [rows] = await pool.execute(query, values);

      // Parse JSON fields and ensure numeric fields are numbers
      return (rows as any[]).map(row => ({
        ...row,
        amountGoal: parseFloat(row.amountGoal) || 0,
        amountRaised: parseFloat(row.amountRaised) || 0,
        minInvestment: row.minInvestment ? parseFloat(row.minInvestment) : undefined,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
      }));
    } catch (error) {
      console.error('Investment.findAll error:', error);
      throw new DatabaseError('Failed to fetch investments');
    }
  }

  static async findById(id: string, lang?: string): Promise<Investment | null> {
    if (isMockMode()) {
      return mockDb.investments.findById(id);
    }

    try {
      const useTranslations = lang && lang !== 'en';
      let query: string;
      const values = [id];

      if (useTranslations) {
        // Query with LEFT JOIN to get translations, fallback to English
        query = `
          SELECT
            i.id,
            COALESCE(t.title, i.title) as title,
            COALESCE(t.description, i.description) as description,
            COALESCE(t.long_description, i.long_description) as longDescription,
            i.amount_goal as amountGoal,
            i.amount_raised as amountRaised,
            i.currency,
            i.images,
            COALESCE(t.category, i.category) as category,
            i.status,
            i.submitted_by as submittedBy,
            i.submitter_email as submitterEmail,
            i.submission_date as submissionDate,
            i.apy_range as apyRange,
            i.min_investment as minInvestment,
            i.term,
            COALESCE(t.tags, i.tags) as tags
          FROM investments i
          LEFT JOIN investment_translations t ON i.id = t.investment_id AND t.lang = ?
          WHERE i.id = ?
        `;
        values.unshift(lang); // Add language parameter first
      } else {
        // Standard query for English or when no language specified
        query = `
          SELECT
            id, title, description, long_description as longDescription,
            amount_goal as amountGoal, amount_raised as amountRaised,
            currency, images, category, status, submitted_by as submittedBy,
            submitter_email as submitterEmail, submission_date as submissionDate,
            apy_range as apyRange, min_investment as minInvestment,
            term, tags
          FROM investments
          WHERE id = ?
        `;
      }

      const [rows] = await pool.execute(query, values);

      const row = (rows as any[])[0];
      if (!row) return null;

      // Parse JSON fields and ensure numeric fields are numbers
      return {
        ...row,
        amountGoal: parseFloat(row.amountGoal) || 0,
        amountRaised: parseFloat(row.amountRaised) || 0,
        minInvestment: row.minInvestment ? parseFloat(row.minInvestment) : undefined,
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
      const investment = {
        ...row,
        amountGoal: parseFloat(row.amountGoal) || 0,
        amountRaised: parseFloat(row.amountRaised) || 0,
        minInvestment: row.minInvestment ? parseFloat(row.minInvestment) : undefined,
        images: typeof row.images === 'string' ? JSON.parse(row.images) : row.images,
        tags: typeof row.tags === 'string' ? JSON.parse(row.tags) : row.tags
      };

      // Generate translations asynchronously (don't wait for completion)
      setImmediate(async () => {
        try {
          await TranslationService.createTranslationsForInvestment(investment.id, {
            title: investment.title,
            description: investment.description,
            longDescription: investment.longDescription,
            category: investment.category,
            tags: investment.tags || []
          });
          console.log(`🌐 Generated translations for investment: ${investment.title} (ID: ${investment.id})`);
        } catch (translationError) {
          console.error(`❌ Failed to generate translations for investment ${investment.id}:`, translationError);
        }
      });

      return investment;
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
      const updatedInvestment = {
        ...updatedRow,
        amountGoal: parseFloat(updatedRow.amountGoal) || 0,
        amountRaised: parseFloat(updatedRow.amountRaised) || 0,
        minInvestment: updatedRow.minInvestment ? parseFloat(updatedRow.minInvestment) : undefined,
        images: typeof updatedRow.images === 'string' ? JSON.parse(updatedRow.images) : updatedRow.images,
        tags: typeof updatedRow.tags === 'string' ? JSON.parse(updatedRow.tags) : updatedRow.tags
      };

      // Check if translatable content was updated
      const translatableFields = ['title', 'description', 'longDescription', 'category', 'tags'];
      const hasTranslatableUpdates = translatableFields.some(field =>
        updates[field as keyof Investment] !== undefined
      );

      if (hasTranslatableUpdates) {
        // Update translations asynchronously (don't wait for completion)
        setImmediate(async () => {
          try {
            await TranslationService.updateTranslationsIfNeeded(updatedInvestment.id, {
              title: updatedInvestment.title,
              description: updatedInvestment.description,
              longDescription: updatedInvestment.longDescription,
              category: updatedInvestment.category,
              tags: updatedInvestment.tags || []
            });
            console.log(`🔄 Updated translations for investment: ${updatedInvestment.title} (ID: ${updatedInvestment.id})`);
          } catch (translationError) {
            console.error(`❌ Failed to update translations for investment ${updatedInvestment.id}:`, translationError);
          }
        });
      }

      return updatedInvestment;
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
      const { lang, ...otherFilters } = filters;
      const useTranslations = lang && lang !== 'en';

      let query: string;
      const conditions: string[] = [];
      const values: any[] = [];

      if (useTranslations) {
        query = `
          SELECT COUNT(*) as count
          FROM investments i
          LEFT JOIN investment_translations t ON i.id = t.investment_id AND t.lang = ?
        `;
        values.push(lang);
      } else {
        query = 'SELECT COUNT(*) as count FROM investments';
      }

      if (otherFilters.status) {
        conditions.push(`${useTranslations ? 'i.' : ''}status = ?`);
        values.push(otherFilters.status);
      }

      if (otherFilters.category) {
        if (useTranslations) {
          conditions.push(`(COALESCE(t.category, i.category) = ?)`);
        } else {
          conditions.push('category = ?');
        }
        values.push(otherFilters.category);
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
