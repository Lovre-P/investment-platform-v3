import { pool, isMockMode } from '../database/config.js';
import { mockDb } from '../database/mock.js';
import { User, CreateUserData, UpdateUserData } from '../types/index.js';
import { NotFoundError, ConflictError, DatabaseError } from '../utils/errors.js';
import { hashPassword } from '../utils/auth.js';

export class UserModel {
  static async findAll(): Promise<Omit<User, 'password'>[]> {
    if (isMockMode()) {
      return mockDb.users.findAll();
    }

    try {
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate
        FROM users
        ORDER BY join_date DESC
      `);
      return rows as Omit<User, 'password'>[];
    } catch (error) {
      throw new DatabaseError('Failed to fetch users');
    }
  }

  static async findById(id: string): Promise<Omit<User, 'password'> | null> {
    if (isMockMode()) {
      return mockDb.users.findById(id);
    }

    try {
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate
        FROM users
        WHERE id = ?
      `, [id]);

      return (rows as any[])[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user');
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    if (isMockMode()) {
      return mockDb.users.findByEmail(email);
    }

    try {
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate, password_hash as password
        FROM users
        WHERE email = ?
      `, [email]);

      return (rows as any[])[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user by email');
    }
  }

  static async findByUsername(username: string): Promise<User | null> {
    if (isMockMode()) {
      return mockDb.users.findByUsername(username);
    }

    try {
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate, password_hash as password
        FROM users
        WHERE username = ?
      `, [username]);

      return (rows as any[])[0] || null;
    } catch (error) {
      throw new DatabaseError('Failed to fetch user by username');
    }
  }

  static async create(userData: CreateUserData): Promise<Omit<User, 'password'>> {
    if (isMockMode()) {
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const existingUsername = await this.findByUsername(userData.username);
      if (existingUsername) {
        throw new ConflictError('User with this username already exists');
      }

      return await mockDb.users.create(userData);
    }

    try {
      // Check if user already exists
      const existingUser = await this.findByEmail(userData.email);
      if (existingUser) {
        throw new ConflictError('User with this email already exists');
      }

      const existingUsername = await this.findByUsername(userData.username);
      if (existingUsername) {
        throw new ConflictError('User with this username already exists');
      }

      // Hash password
      const passwordHash = await hashPassword(userData.password);

      const [_result] = await pool.execute(`
        INSERT INTO users (id, username, email, password_hash, role)
        VALUES (UUID(), ?, ?, ?, ?)
      `, [userData.username, userData.email, passwordHash, userData.role]);

      // Get the inserted user
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate
        FROM users
        WHERE username = ? AND email = ?
      `, [userData.username, userData.email]);

      return (rows as any[])[0];
    } catch (error) {
      if (error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to create user');
    }
  }

  static async update(id: string, updates: UpdateUserData): Promise<Omit<User, 'password'>> {
    if (isMockMode()) {
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }
      return mockDb.users.update(id, updates) as Omit<User, 'password'>;
    }

    try {
      // Check if user exists
      const existingUser = await this.findById(id);
      if (!existingUser) {
        throw new NotFoundError('User not found');
      }

      // Build dynamic update query
      const updateFields = [];
      const values = [];

      if (updates.username) {
        updateFields.push(`username = ?`);
        values.push(updates.username);
      }
      if (updates.email) {
        updateFields.push(`email = ?`);
        values.push(updates.email);
      }
      if (updates.role) {
        updateFields.push(`role = ?`);
        values.push(updates.role);
      }

      if (updateFields.length === 0) {
        return existingUser;
      }

      values.push(id);

      await pool.execute(`
        UPDATE users
        SET ${updateFields.join(', ')}
        WHERE id = ?
      `, values);

      // Get the updated user
      const [rows] = await pool.execute(`
        SELECT id, username, email, role, join_date as joinDate
        FROM users
        WHERE id = ?
      `, [id]);

      return (rows as any[])[0];
    } catch (error) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }
      throw new DatabaseError('Failed to update user');
    }
  }

  static async delete(id: string): Promise<boolean> {
    if (isMockMode()) {
      return mockDb.users.delete(id);
    }

    try {
      const [result] = await pool.execute('DELETE FROM users WHERE id = ?', [id]);
      return (result as any).affectedRows > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete user');
    }
  }

  static async count(): Promise<number> {
    if (isMockMode()) {
      return mockDb.users.findAll().length;
    }

    try {
      const [rows] = await pool.execute('SELECT COUNT(*) as count FROM users');
      return parseInt((rows as any[])[0].count);
    } catch (error) {
      throw new DatabaseError('Failed to count users');
    }
  }
}
