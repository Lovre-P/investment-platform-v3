import { pool, isMockMode } from '../database/config.js';
import { mockDb } from '../database/mock.js';
import { Lead, CreateLeadData } from '../types/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

export class LeadModel {
  static async findAll(): Promise<Lead[]> {
    if (isMockMode()) {
      return mockDb.leads.findAll();
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, name, email, phone, message, investment_id as investmentId,
          submission_date as submissionDate, status
        FROM leads
        ORDER BY submission_date DESC
      `);
      return rows as Lead[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch leads');
    }
  }

  static async findById(id: string): Promise<Lead | null> {
    if (isMockMode()) {
      return mockDb.leads.findById(id);
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, name, email, phone, message, investment_id as investmentId,
          submission_date as submissionDate, status
        FROM leads
        WHERE id = ?
      `, [id]);

      return (rows as any[])[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch lead');
    }
  }

  static async create(leadData: CreateLeadData): Promise<Lead> {
    if (isMockMode()) {
      return mockDb.leads.create(leadData);
    }

    try {
      const newId = uuidv4();
      await pool.execute(`
        INSERT INTO leads (id, name, email, phone, message, investment_id, status)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [
        newId,
        leadData.name,
        leadData.email,
        leadData.phone || null,
        leadData.message,
        leadData.investmentId || null,
        'New' // Default status
      ]);

      const created = await this.findById(newId);
      return created as Lead;
    } catch (error) {
      throw new DatabaseError('Failed to create lead');
    }
  }

  static async updateStatus(id: string, status: Lead['status']): Promise<Lead> {
    if (isMockMode()) {
      const existingLead = await this.findById(id);
      if (!existingLead) {
        throw new NotFoundError('Lead not found');
      }
      return mockDb.leads.updateStatus(id, status) as Lead;
    }

    try {
      // Check if lead exists
      const existingLead = await this.findById(id);
      if (!existingLead) {
        throw new NotFoundError('Lead not found');
      }

      await pool.execute(
        `UPDATE leads SET status = ? WHERE id = ?`,
        [status, id]
      );

      const [rows] = await pool.execute(
        `SELECT
          id, name, email, phone, message, investment_id as investmentId,
          submission_date as submissionDate, status
         FROM leads
         WHERE id = ?`,
        [id]
      );

      return (rows as any[])[0];
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw error;
      }
      throw new DatabaseError('Failed to update lead status');
    }
  }

  static async delete(id: string): Promise<boolean> {
    if (isMockMode()) {
      return mockDb.leads.delete(id);
    }

    try {
      const [result] = await pool.execute('DELETE FROM leads WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete lead');
    }
  }

  // Bulk delete leads by IDs. Returns number of deleted rows.
  static async bulkDelete(ids: string[]): Promise<number> {
    if (ids.length === 0) return 0;

    if (isMockMode()) {
      let deletedCount = 0;
      for (const id of ids) {
        const deleted = mockDb.leads.delete(id);
        if (deleted) deletedCount++;
      }
      return deletedCount;
    }

    try {
      // Generate placeholders for prepared statement; mysql2 execute won't expand arrays
      const placeholders = ids.map(() => '?').join(',');
      const sql = `DELETE FROM leads WHERE id IN (${placeholders})`;
      const [result] = await pool.execute(sql, ids);
      return (result as any).affectedRows || 0;
    } catch (error) {
      throw new DatabaseError('Failed to bulk delete leads');
    }
  }

  static async count(): Promise<number> {
    if (isMockMode()) {
      return mockDb.leads.findAll().length;
    }

    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM leads');
      return Number((rows as any[])[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to count leads');
    }
  }

  static async findByInvestmentId(investmentId: string): Promise<Lead[]> {
    if (isMockMode()) {
      return (mockDb.leads.findAll() as Lead[]).filter(l => l.investmentId === investmentId);
    }
    try {
      const [rows] = await pool.execute(
        `SELECT
          id, name, email, phone, message, investment_id as investmentId,
          submission_date as submissionDate, status
         FROM leads
         WHERE investment_id = ?
         ORDER BY submission_date DESC`,
        [investmentId]
      );

      return rows as Lead[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch leads by investment');
    }
  }

  static async getStatusCounts(): Promise<Record<string, number>> {
    try {
      const [rows] = await pool.execute(
        `SELECT status, COUNT(*) as count FROM leads GROUP BY status`
      );

      const counts: Record<string, number> = {
        'New': 0,
        'Contacted': 0,
        'Converted': 0,
        'Rejected': 0
      };

      (rows as any[]).forEach(row => {
        counts[row.status] = parseInt(row.count);
      });

      return counts;
    } catch (error) {
      throw new DatabaseError('Failed to get lead status counts');
    }
  }
}
