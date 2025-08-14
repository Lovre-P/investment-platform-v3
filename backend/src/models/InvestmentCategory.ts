import { pool, isMockMode } from '../database/config.js';
import { mockDb } from '../database/mock.js';
import { InvestmentCategory, CreateInvestmentCategoryData, UpdateInvestmentCategoryData } from '../types/index.js';
import { DatabaseError, NotFoundError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development/testing
const mockCategories: InvestmentCategory[] = [
  {
    id: uuidv4(),
    name: 'Real Estate',
    description: 'Property investments, real estate development, and related opportunities',
    isActive: true,
    sortOrder: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Technology',
    description: 'Tech startups, software companies, and technology-related investments',
    isActive: true,
    sortOrder: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Renewable Energy',
    description: 'Solar, wind, and other sustainable energy projects',
    isActive: true,
    sortOrder: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Small Business',
    description: 'Local businesses, franchises, and small-scale commercial ventures',
    isActive: true,
    sortOrder: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    name: 'Other',
    description: 'Miscellaneous investment opportunities not covered by other categories',
    isActive: true,
    sortOrder: 99,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class InvestmentCategoryModel {
  static async findAll(includeInactive = false): Promise<InvestmentCategory[]> {
    if (isMockMode()) {
      return includeInactive ? mockCategories : mockCategories.filter(cat => cat.isActive);
    }

    try {
      const whereClause = includeInactive ? '' : 'WHERE is_active = TRUE';
      const [rows] = await pool.execute(`
        SELECT
          id, name, description, is_active as isActive, sort_order as sortOrder,
          created_at as createdAt, updated_at as updatedAt
        FROM investment_categories
        ${whereClause}
        ORDER BY sort_order ASC, name ASC
      `);

      // Convert id to string and ensure boolean types for consistency with the interface
      const categories = (rows as any[]).map(row => ({
        ...row,
        id: row.id.toString(),
        isActive: typeof row.isActive === 'number' ? row.isActive === 1 : !!row.isActive
      }));

      return categories as InvestmentCategory[];
    } catch (error) {
      console.error('InvestmentCategory.findAll error:', error);
      throw new DatabaseError('Failed to fetch investment categories');
    }
  }

  static async findById(id: string): Promise<InvestmentCategory | null> {
    if (isMockMode()) {
      return mockCategories.find(cat => cat.id === id) || null;
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, name, description, is_active as isActive, sort_order as sortOrder,
          created_at as createdAt, updated_at as updatedAt
        FROM investment_categories
        WHERE id = ?
      `, [parseInt(id)]);

      const row = (rows as any[])[0];
      if (row) {
        // Convert id back to string for consistency with the interface
        row.id = row.id.toString();
        // Ensure boolean type for isActive
        row.isActive = typeof row.isActive === 'number' ? row.isActive === 1 : !!row.isActive;
      }
      return row || null;
    } catch (error) {
      console.error('InvestmentCategory.findById error:', error);
      throw new DatabaseError('Failed to fetch investment category');
    }
  }

  static async findByName(name: string): Promise<InvestmentCategory | null> {
    if (isMockMode()) {
      return mockCategories.find(cat => cat.name.toLowerCase() === name.toLowerCase()) || null;
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, name, description, is_active as isActive, sort_order as sortOrder,
          created_at as createdAt, updated_at as updatedAt
        FROM investment_categories
        WHERE LOWER(name) = LOWER(?)
      `, [name]);

      const row = (rows as any[])[0];
      if (row) {
        row.isActive = typeof row.isActive === 'number' ? row.isActive === 1 : !!row.isActive;
      }
      return row || null;
    } catch (error) {
      console.error('InvestmentCategory.findByName error:', error);
      throw new DatabaseError('Failed to fetch investment category by name');
    }
  }

  static async create(categoryData: CreateInvestmentCategoryData): Promise<InvestmentCategory> {
    if (isMockMode()) {
      const newCategory: InvestmentCategory = {
        id: uuidv4(),
        name: categoryData.name,
        description: categoryData.description || '',
        isActive: categoryData.isActive ?? true,
        sortOrder: categoryData.sortOrder ?? 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockCategories.push(newCategory);
      return newCategory;
    }

    try {
      // Insert without specifying id (let AUTO_INCREMENT handle it)
      const [result] = await pool.execute(`
        INSERT INTO investment_categories (
          name, description, is_active, sort_order
        ) VALUES (?, ?, ?, ?)
      `, [
        categoryData.name,
        categoryData.description || null,
        categoryData.isActive ?? true,
        categoryData.sortOrder ?? 0
      ]);

      // Get the auto-generated ID
      const insertId = (result as any).insertId;
      const created = await this.findById(insertId.toString());
      if (!created) {
        throw new DatabaseError('Failed to retrieve created category');
      }
      return created;
    } catch (error) {
      console.error('InvestmentCategory.create error:', error);
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new DatabaseError('Category name already exists');
      }
      throw new DatabaseError('Failed to create investment category');
    }
  }

  static async update(id: string, updates: UpdateInvestmentCategoryData): Promise<InvestmentCategory> {
    if (isMockMode()) {
      const index = mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        throw new NotFoundError('Investment category not found');
      }
      const oldName = mockCategories[index].name;
      mockCategories[index] = {
        ...mockCategories[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      // Cascade rename in mock investments if name changed
      if (updates.name && updates.name !== oldName) {
        const investments = mockDb.investments.findAll({});
        for (const inv of investments) {
          if (inv.category === oldName) {
            mockDb.investments.update(inv.id, { category: updates.name });
          }
        }
      }
      return mockCategories[index];
    }

    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundError('Investment category not found');
      }

      // Use a transaction to update category and cascade rename in investments
      const connection = await pool.getConnection();
      try {
        await connection.beginTransaction();

        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (updates.name !== undefined) {
          updateFields.push('name = ?');
          updateValues.push(updates.name);
        }
        if (updates.description !== undefined) {
          updateFields.push('description = ?');
          updateValues.push(updates.description);
        }
        if (updates.isActive !== undefined) {
          updateFields.push('is_active = ?');
          updateValues.push(updates.isActive);
        }
        if (updates.sortOrder !== undefined) {
          updateFields.push('sort_order = ?');
          updateValues.push(updates.sortOrder);
        }

        if (updateFields.length > 0) {
          updateValues.push(parseInt(id));
          await connection.execute(`
            UPDATE investment_categories
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, updateValues);
        }

        // Cascade rename if name changed
        if (updates.name && updates.name !== existing.name) {
          await connection.execute(
            'UPDATE investments SET category = ? WHERE category = ?',
            [updates.name, existing.name]
          );
        }

        await connection.commit();
      } catch (txErr) {
        await connection.rollback();
        throw txErr;
      } finally {
        connection.release();
      }

      const updated = await this.findById(id);
      if (!updated) {
        throw new DatabaseError('Failed to retrieve updated category');
      }
      return updated;
    } catch (error) {
      console.error('InvestmentCategory.update error:', error);
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new DatabaseError('Category name already exists');
      }
      throw new DatabaseError('Failed to update investment category');
    }
  }

  static async delete(id: string): Promise<void> {
    if (isMockMode()) {
      const index = mockCategories.findIndex(cat => cat.id === id);
      if (index === -1) {
        throw new NotFoundError('Investment category not found');
      }
      mockCategories.splice(index, 1);
      return;
    }

    try {
      const existing = await this.findById(id);
      if (!existing) {
        throw new NotFoundError('Investment category not found');
      }

      // Check if category is in use by any investments
      const [investmentRows] = await pool.execute(`
        SELECT COUNT(*) as count FROM investments WHERE category = ?
      `, [existing.name]);

      const investmentCount = (investmentRows as any[])[0].count;
      if (investmentCount > 0) {
        throw new DatabaseError(`Cannot delete category "${existing.name}" as it is used by ${investmentCount} investment(s)`);
      }

      await pool.execute('DELETE FROM investment_categories WHERE id = ?', [parseInt(id)]);
    } catch (error) {
      console.error('InvestmentCategory.delete error:', error);
      throw error;
    }
  }

  static async checkCategoryUsage(categoryName: string): Promise<number> {
    if (isMockMode()) {
      // For mock mode, return 0 for simplicity
      return 0;
    }

    try {
      const [rows] = await pool.execute(`
        SELECT COUNT(*) as count FROM investments WHERE category = ?
      `, [categoryName]);

      return (rows as any[])[0].count;
    } catch (error) {
      console.error('InvestmentCategory.checkCategoryUsage error:', error);
      throw new DatabaseError('Failed to check category usage');
    }
  }
}
