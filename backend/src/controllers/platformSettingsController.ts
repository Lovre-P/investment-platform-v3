import { Request, Response } from 'express';
import { PlatformSettingsModel } from '../models/PlatformSettings.js';
import { CreatePlatformSettingData, UpdatePlatformSettingData } from '../types/index.js';
import { NotFoundError, DatabaseError } from '../utils/errors.js';

export class PlatformSettingsController {
  // GET /api/settings
  static async getSettings(req: Request, res: Response) {
    try {
      const publicOnly = req.query.public_only === 'true';
      const asObject = req.query.as_object === 'true';
      
      if (asObject) {
        const settings = await PlatformSettingsModel.getSettingsAsObject(publicOnly);
        res.json({
          success: true,
          data: settings
        });
      } else {
        const settings = await PlatformSettingsModel.findAll(publicOnly);
        res.json({
          success: true,
          data: settings
        });
      }
    } catch (error) {
      console.error('Get settings error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch platform settings',
          code: 'FETCH_SETTINGS_ERROR'
        }
      });
    }
  }

  // GET /api/settings/:key
  static async getSettingByKey(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const setting = await PlatformSettingsModel.findByKey(key);

      if (!setting) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Platform setting not found',
            code: 'SETTING_NOT_FOUND'
          }
        });
        return;
      }

      res.json({
        success: true,
        data: setting
      });
    } catch (error) {
      console.error('Get setting by key error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch platform setting',
          code: 'FETCH_SETTING_ERROR'
        }
      });
    }
  }

  // GET /api/settings/:key/value
  static async getSettingValue(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const defaultValue = req.query.default as string;
      
      const value = await PlatformSettingsModel.getValue(key, defaultValue);
      
      res.json({
        success: true,
        data: {
          key: key,
          value: value
        }
      });
    } catch (error) {
      console.error('Get setting value error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to fetch setting value',
          code: 'FETCH_VALUE_ERROR'
        }
      });
    }
  }

  // POST /api/settings
  static async createSetting(req: Request, res: Response): Promise<void> {
    try {
      const settingData: CreatePlatformSettingData = req.body;

      // Check if setting key already exists
      const existingSetting = await PlatformSettingsModel.findByKey(settingData.settingKey);
      if (existingSetting) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Setting key already exists',
            code: 'DUPLICATE_SETTING_KEY'
          }
        });
        return;
      }

      const setting = await PlatformSettingsModel.create(settingData);
      
      res.status(201).json({
        success: true,
        data: setting,
        message: 'Platform setting created successfully'
      });
    } catch (error) {
      console.error('Create setting error:', error);
      
      if (error instanceof DatabaseError && error.message.includes('already exists')) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Setting key already exists',
            code: 'DUPLICATE_SETTING_KEY'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to create platform setting',
          code: 'CREATE_SETTING_ERROR'
        }
      });
    }
  }

  // PUT /api/settings/:key
  static async updateSetting(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const updates: UpdatePlatformSettingData = req.body;

      const setting = await PlatformSettingsModel.update(key, updates);
      
      res.json({
        success: true,
        data: setting,
        message: 'Platform setting updated successfully'
      });
    } catch (error) {
      console.error('Update setting error:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Platform setting not found',
            code: 'SETTING_NOT_FOUND'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update platform setting',
          code: 'UPDATE_SETTING_ERROR'
        }
      });
    }
  }

  // PUT /api/settings/:key/value
  static async updateSettingValue(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const { value } = req.body;

      if (value === undefined) {
        res.status(400).json({
          success: false,
          error: {
            message: 'Value is required',
            code: 'MISSING_VALUE'
          }
        });
        return;
      }

      const setting = await PlatformSettingsModel.setValue(key, String(value));
      
      res.json({
        success: true,
        data: setting,
        message: 'Setting value updated successfully'
      });
    } catch (error) {
      console.error('Update setting value error:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Platform setting not found',
            code: 'SETTING_NOT_FOUND'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to update setting value',
          code: 'UPDATE_VALUE_ERROR'
        }
      });
    }
  }

  // POST /api/settings/bulk-update
  static async bulkUpdateSettings(req: Request, res: Response): Promise<void> {
    try {
      const { settings } = req.body;

      if (!settings || typeof settings !== 'object') {
        res.status(400).json({
          success: false,
          error: {
            message: 'Settings object is required',
            code: 'INVALID_SETTINGS_DATA'
          }
        });
        return;
      }

      const updatedSettings = [];
      const errors = [];

      for (const [key, value] of Object.entries(settings)) {
        try {
          const setting = await PlatformSettingsModel.setValue(key, String(value));
          updatedSettings.push(setting);
        } catch (error) {
          errors.push({
            key: key,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      res.json({
        success: errors.length === 0,
        data: {
          updated: updatedSettings,
          errors: errors
        },
        message: errors.length === 0 
          ? 'All settings updated successfully' 
          : `${updatedSettings.length} settings updated, ${errors.length} errors occurred`
      });
    } catch (error) {
      console.error('Bulk update settings error:', error);
      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to bulk update settings',
          code: 'BULK_UPDATE_ERROR'
        }
      });
    }
  }

  // DELETE /api/settings/:key
  static async deleteSetting(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      
      await PlatformSettingsModel.delete(key);
      
      res.json({
        success: true,
        message: 'Platform setting deleted successfully'
      });
    } catch (error) {
      console.error('Delete setting error:', error);
      
      if (error instanceof NotFoundError) {
        res.status(404).json({
          success: false,
          error: {
            message: 'Platform setting not found',
            code: 'SETTING_NOT_FOUND'
          }
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          message: 'Failed to delete platform setting',
          code: 'DELETE_SETTING_ERROR'
        }
      });
    }
  }
}
