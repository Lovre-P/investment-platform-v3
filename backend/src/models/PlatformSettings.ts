import { pool, isMockMode } from '../database/config.js';
import { PlatformSetting, CreatePlatformSettingData, UpdatePlatformSettingData } from '../types/index.js';
import { DatabaseError, NotFoundError } from '../utils/errors.js';
import { v4 as uuidv4 } from 'uuid';

// Mock data for development/testing
const mockSettings: PlatformSetting[] = [
  {
    id: uuidv4(),
    settingKey: 'platform_name',
    settingValue: 'MegaInvest Platform',
    settingType: 'string',
    description: 'The name of the investment platform',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    settingKey: 'default_currency',
    settingValue: 'EUR',
    settingType: 'string',
    description: 'Default currency for investments',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    settingKey: 'admin_email',
    settingValue: 'admin@megainvest.com',
    settingType: 'string',
    description: 'Primary admin email for notifications',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    settingKey: 'maintenance_mode',
    settingValue: 'false',
    settingType: 'boolean',
    description: 'Enable maintenance mode to restrict public access',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: uuidv4(),
    settingKey: 'enable_email_notifications',
    settingValue: 'true',
    settingType: 'boolean',
    description: 'Enable system-wide email notifications',
    isPublic: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

export class PlatformSettingsModel {
  static async findAll(publicOnly = false): Promise<PlatformSetting[]> {
    if (isMockMode()) {
      return publicOnly ? mockSettings.filter(setting => setting.isPublic) : mockSettings;
    }

    try {
      const whereClause = publicOnly ? 'WHERE is_public = TRUE' : '';
      const [rows] = await pool.execute(`
        SELECT
          id, setting_key as settingKey, setting_value as settingValue,
          setting_type as settingType, description, is_public as isPublic,
          created_at as createdAt, updated_at as updatedAt
        FROM platform_settings
        ${whereClause}
        ORDER BY setting_key ASC
      `);

      return rows as PlatformSetting[];
    } catch (error) {
      console.error('PlatformSettings.findAll error:', error);
      throw new DatabaseError('Failed to fetch platform settings');
    }
  }

  static async findByKey(settingKey: string): Promise<PlatformSetting | null> {
    if (isMockMode()) {
      return mockSettings.find(setting => setting.settingKey === settingKey) || null;
    }

    try {
      const [rows] = await pool.execute(`
        SELECT
          id, setting_key as settingKey, setting_value as settingValue,
          setting_type as settingType, description, is_public as isPublic,
          created_at as createdAt, updated_at as updatedAt
        FROM platform_settings
        WHERE setting_key = ?
      `, [settingKey]);

      const row = (rows as any[])[0];
      return row || null;
    } catch (error) {
      console.error('PlatformSettings.findByKey error:', error);
      throw new DatabaseError('Failed to fetch platform setting');
    }
  }

  static async getValue(settingKey: string, defaultValue?: string): Promise<string | null> {
    const setting = await this.findByKey(settingKey);
    return setting ? setting.settingValue : (defaultValue || null);
  }

  static async getTypedValue<T>(settingKey: string, defaultValue?: T): Promise<T | null> {
    const setting = await this.findByKey(settingKey);
    if (!setting) {
      return defaultValue || null;
    }

    switch (setting.settingType) {
      case 'boolean':
        return (setting.settingValue.toLowerCase() === 'true') as unknown as T;
      case 'number':
        return parseFloat(setting.settingValue) as unknown as T;
      case 'json':
        try {
          return JSON.parse(setting.settingValue) as T;
        } catch {
          return defaultValue || null;
        }
      default:
        return setting.settingValue as unknown as T;
    }
  }

  static async create(settingData: CreatePlatformSettingData): Promise<PlatformSetting> {
    if (isMockMode()) {
      const newSetting: PlatformSetting = {
        id: uuidv4(),
        settingKey: settingData.settingKey,
        settingValue: settingData.settingValue,
        settingType: settingData.settingType || 'string',
        description: settingData.description || '',
        isPublic: settingData.isPublic ?? false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockSettings.push(newSetting);
      return newSetting;
    }

    try {
      const id = uuidv4();
      await pool.execute(`
        INSERT INTO platform_settings (
          id, setting_key, setting_value, setting_type, description, is_public
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        id,
        settingData.settingKey,
        settingData.settingValue,
        settingData.settingType || 'string',
        settingData.description || null,
        settingData.isPublic ?? false
      ]);

      const created = await this.findByKey(settingData.settingKey);
      if (!created) {
        throw new DatabaseError('Failed to retrieve created setting');
      }
      return created;
    } catch (error) {
      console.error('PlatformSettings.create error:', error);
      if ((error as any).code === 'ER_DUP_ENTRY') {
        throw new DatabaseError('Setting key already exists');
      }
      throw new DatabaseError('Failed to create platform setting');
    }
  }

  static async update(settingKey: string, updates: UpdatePlatformSettingData): Promise<PlatformSetting> {
    if (isMockMode()) {
      const index = mockSettings.findIndex(setting => setting.settingKey === settingKey);
      if (index === -1) {
        throw new NotFoundError('Platform setting not found');
      }
      mockSettings[index] = {
        ...mockSettings[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      return mockSettings[index];
    }

    try {
      const existing = await this.findByKey(settingKey);
      if (!existing) {
        throw new NotFoundError('Platform setting not found');
      }

      const updateFields = [];
      const updateValues = [];

      if (updates.settingValue !== undefined) {
        updateFields.push('setting_value = ?');
        updateValues.push(updates.settingValue);
      }
      if (updates.settingType !== undefined) {
        updateFields.push('setting_type = ?');
        updateValues.push(updates.settingType);
      }
      if (updates.description !== undefined) {
        updateFields.push('description = ?');
        updateValues.push(updates.description);
      }
      if (updates.isPublic !== undefined) {
        updateFields.push('is_public = ?');
        updateValues.push(updates.isPublic);
      }

      if (updateFields.length === 0) {
        return existing;
      }

      updateValues.push(settingKey);

      await pool.execute(`
        UPDATE platform_settings
        SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
        WHERE setting_key = ?
      `, updateValues);

      const updated = await this.findByKey(settingKey);
      if (!updated) {
        throw new DatabaseError('Failed to retrieve updated setting');
      }
      return updated;
    } catch (error) {
      console.error('PlatformSettings.update error:', error);
      throw new DatabaseError('Failed to update platform setting');
    }
  }

  static async setValue(settingKey: string, value: string): Promise<PlatformSetting> {
    return this.update(settingKey, { settingValue: value });
  }

  static async delete(settingKey: string): Promise<void> {
    if (isMockMode()) {
      const index = mockSettings.findIndex(setting => setting.settingKey === settingKey);
      if (index === -1) {
        throw new NotFoundError('Platform setting not found');
      }
      mockSettings.splice(index, 1);
      return;
    }

    try {
      const existing = await this.findByKey(settingKey);
      if (!existing) {
        throw new NotFoundError('Platform setting not found');
      }

      await pool.execute('DELETE FROM platform_settings WHERE setting_key = ?', [settingKey]);
    } catch (error) {
      console.error('PlatformSettings.delete error:', error);
      throw new DatabaseError('Failed to delete platform setting');
    }
  }

  static async getSettingsAsObject(publicOnly = false): Promise<Record<string, any>> {
    const settings = await this.findAll(publicOnly);
    const result: Record<string, any> = {};

    for (const setting of settings) {
      switch (setting.settingType) {
        case 'boolean':
          result[setting.settingKey] = setting.settingValue.toLowerCase() === 'true';
          break;
        case 'number':
          result[setting.settingKey] = parseFloat(setting.settingValue);
          break;
        case 'json':
          try {
            result[setting.settingKey] = JSON.parse(setting.settingValue);
          } catch {
            result[setting.settingKey] = setting.settingValue;
          }
          break;
        default:
          result[setting.settingKey] = setting.settingValue;
      }
    }

    return result;
  }
}
