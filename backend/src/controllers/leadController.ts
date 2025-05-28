import { Request, Response, NextFunction } from 'express';
import { LeadModel } from '../models/Lead.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateLeadData } from '../types/index.js';

export class LeadController {
  static async getLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leads = await LeadModel.findAll();

      res.status(200).json({
        success: true,
        data: leads
      });
    } catch (error) {
      next(error);
    }
  }

  static async getLeadById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const lead = await LeadModel.findById(id);

      if (!lead) {
        throw new NotFoundError('Lead not found');
      }

      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async createLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const leadData: CreateLeadData = req.body;
      const lead = await LeadModel.create(leadData);

      res.status(201).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateLeadStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const lead = await LeadModel.updateStatus(id, status);

      res.status(200).json({
        success: true,
        data: lead
      });
    } catch (error) {
      next(error);
    }
  }

  static async deleteLead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await LeadModel.delete(id);

      if (!deleted) {
        throw new NotFoundError('Lead not found');
      }

      res.status(200).json({
        success: true,
        message: 'Lead deleted successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}
