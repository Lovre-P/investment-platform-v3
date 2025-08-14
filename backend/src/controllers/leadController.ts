import { Request, Response, NextFunction } from 'express';
import { LeadModel } from '../models/Lead.js';
import { InvestmentModel } from '../models/Investment.js';
import { EmailService } from '../services/emailService.js';
import { NotFoundError } from '../utils/errors.js';
import { CreateLeadData } from '../types/index.js';

export class LeadController {
  static async getLeads(_req: Request, res: Response, next: NextFunction): Promise<void> {
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

      // Send email notification asynchronously (don't wait for it to complete)
      setImmediate(async () => {
        try {
          let investment = null;

          // If this is an investment-specific lead, fetch the investment details
          if (lead.investmentId) {
            investment = await InvestmentModel.findById(lead.investmentId);
          }

          // Send appropriate email notification
          if (investment) {
            await EmailService.sendInvestmentLeadNotification({ lead, investment });
            console.log(`📧 Investment lead notification sent for: ${lead.name} (Investment: ${investment.title})`);
          } else {
            await EmailService.sendContactLeadNotification(lead);
            console.log(`📧 Contact lead notification sent for: ${lead.name}`);
          }
        } catch (emailError) {
          // Log email error but don't fail the lead creation
          console.error('Failed to send email notification for lead:', lead.id, emailError);
        }
      });

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

  static async bulkDeleteLeads(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ids } = req.body as { ids: string[] };
      const deletedCount = await LeadModel.bulkDelete(ids);

      res.status(200).json({
        success: true,
        data: { deletedCount }
      });
    } catch (error) {
      next(error);
    }
  }
}
