import { Lead, Investment } from '../types/index.js';
import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  text: string;
  html?: string;
}

interface InvestmentLeadEmailData {
  lead: Lead;
  investment?: Investment;
}

export class EmailService {
  private static readonly ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'info@mega-invest.hr';
  private static readonly FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@mega-invest.hr';
  
  /**
   * Send email notification (currently logs to console for development)
   * In production, this should be replaced with actual email service (SendGrid, AWS SES, etc.)
   */
  private static transporter: nodemailer.Transporter | null = null;

  private static validateConfig(): boolean {
    const required = [
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASS',
    ];
    const missing = required.filter((v) => !process.env[v]);
    if (missing.length) {
      console.error(
        `Email configuration missing: ${missing.join(', ')}`,
      );
      return false;
    }
    return true;
  }

  private static getTransporter(): nodemailer.Transporter | null {
    if (EmailService.transporter) return EmailService.transporter;
    if (!EmailService.validateConfig()) return null;

    try {
      EmailService.transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
        connectionTimeout: Number(process.env.SMTP_TIMEOUT || '10000'),
        socketTimeout: Number(process.env.SMTP_TIMEOUT || '10000'),
      });
    } catch (err) {
      console.error('Failed to create email transporter', err);
      EmailService.transporter = null;
    }

    return EmailService.transporter;
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!EmailService.isValidEmail(options.to)) {
      console.error('Invalid recipient email address:', options.to);
      return false;
    }

    const transporter = EmailService.getTransporter();
    if (!transporter) return false;

    const maxRetries = Number(process.env.EMAIL_MAX_RETRIES || 3);
    const delayMs = Number(process.env.EMAIL_RETRY_DELAY || 1000);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await transporter.sendMail({
          from: EmailService.FROM_EMAIL,
          to: options.to,
          subject: options.subject,
          text: options.text,
          html: options.html,
        });
        return true;
      } catch (err: any) {
        const code = err?.code || 'UNKNOWN';
        const message = err?.message || 'Unknown error';
        console.error(`Email send attempt ${attempt} failed`, {
          code,
          message,
        });

        const networkErrors = [
          'ECONNECTION',
          'ETIMEDOUT',
          'EAI_AGAIN',
          'ENOTFOUND',
          'ECONNRESET',
        ];
        if (attempt < maxRetries && networkErrors.includes(code)) {
          await new Promise((r) => setTimeout(r, delayMs));
          continue;
        }
        return false;
      }
    }

    return false;
  }

  /**
   * Send notification for new investment lead
   */
  static async sendInvestmentLeadNotification(data: InvestmentLeadEmailData): Promise<boolean> {
    const { lead, investment } = data;
    
    const subject = investment 
      ? `New Investment Interest: ${investment.title}`
      : 'New Investment Lead Submitted';

    // Extract investment details from the lead message if available
    const leadMessage = lead.message;
    
    const emailText = `
New Investment Lead Submitted
═══════════════════════════════════════

Lead Information:
• Name: ${lead.name}
• Email: ${lead.email}
• Phone: ${lead.phone || 'Not provided'}
• Submission Date: ${new Date(lead.submissionDate).toLocaleString()}
• Status: ${lead.status}
• Lead ID: ${lead.id}

${investment ? `
Investment Details:
• Investment Title: ${investment.title}
• Investment ID: ${investment.id}
• Category: ${investment.category}
• Goal Amount: ${investment.currency} ${investment.amountGoal.toLocaleString()}
• Current Raised: ${investment.currency} ${investment.amountRaised.toLocaleString()}
• Status: ${investment.status}
${investment.apyRange ? `• APY Range: ${investment.apyRange}` : ''}
${investment.minInvestment ? `• Minimum Investment: ${investment.currency} ${investment.minInvestment.toLocaleString()}` : ''}
${investment.term ? `• Term: ${investment.term}` : ''}
` : ''}

Lead Message:
${leadMessage}

═══════════════════════════════════════

Action Required:
1. Contact the lead within 24 hours
2. Update lead status in the admin panel
3. Schedule follow-up if needed

Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/admin/leads

Best regards,
MegaInvest Platform
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>${subject}</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #214b8b; color: white; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; }
        .section { margin-bottom: 20px; }
        .section h3 { color: #214b8b; border-bottom: 2px solid #214b8b; padding-bottom: 5px; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .info-item { background: white; padding: 10px; border-radius: 5px; }
        .info-label { font-weight: bold; color: #214b8b; }
        .message-box { background: white; padding: 15px; border-left: 4px solid #214b8b; margin: 10px 0; }
        .action-box { background: #e8f4f8; padding: 15px; border-radius: 5px; margin-top: 20px; }
        .button { display: inline-block; background: #214b8b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>New Investment Lead</h1>
            <p>${subject}</p>
        </div>
        
        <div class="content">
            <div class="section">
                <h3>Lead Information</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Name:</div>
                        <div>${lead.name}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Email:</div>
                        <div><a href="mailto:${lead.email}">${lead.email}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Phone:</div>
                        <div><a href="tel:${lead.phone || ''}">${lead.phone || 'Not provided'}</a></div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Submitted:</div>
                        <div>${new Date(lead.submissionDate).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            ${investment ? `
            <div class="section">
                <h3>Investment Details</h3>
                <div class="info-grid">
                    <div class="info-item">
                        <div class="info-label">Title:</div>
                        <div>${investment.title}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Category:</div>
                        <div>${investment.category}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Goal:</div>
                        <div>${investment.currency} ${investment.amountGoal.toLocaleString()}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Raised:</div>
                        <div>${investment.currency} ${investment.amountRaised.toLocaleString()}</div>
                    </div>
                </div>
            </div>
            ` : ''}

            <div class="section">
                <h3>Lead Message</h3>
                <div class="message-box">
                    ${leadMessage.replace(/\n/g, '<br>')}
                </div>
            </div>

            <div class="action-box">
                <h3>Action Required</h3>
                <ul>
                    <li>Contact the lead within 24 hours</li>
                    <li>Update lead status in the admin panel</li>
                    <li>Schedule follow-up if needed</li>
                </ul>
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/admin/leads" class="button">
                    View in Admin Panel
                </a>
            </div>
        </div>
    </div>
</body>
</html>
    `.trim();

    return await this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      text: emailText,
      html: emailHtml
    });
  }

  /**
   * Send notification for new investment submission
   */
  static async sendInvestmentSubmissionNotification(investment: Investment): Promise<boolean> {
    const subject = `New Investment Submission: ${investment.title}`;

    const emailText = `
New Investment Submission
═══════════════════════════════════════

Investment Information:
• Title: ${investment.title}
• Category: ${investment.category}
• Funding Goal: ${investment.currency} ${investment.amountGoal.toLocaleString()}
• Submitted By: ${investment.submittedBy}
• Submitter Email: ${investment.submitterEmail || 'Not provided'}
• Submission Date: ${new Date(investment.submissionDate).toLocaleString()}
• Status: ${investment.status}
• Investment ID: ${investment.id}

Description:
${investment.description}

${investment.apyRange ? `Expected APY Range: ${investment.apyRange}` : ''}
${investment.minInvestment ? `Minimum Investment: ${investment.currency} ${investment.minInvestment.toLocaleString()}` : ''}
${investment.term ? `Investment Term: ${investment.term}` : ''}

Action Required:
• Review the investment submission in the admin panel
• Approve or reject the investment
• Contact the submitter if additional information is needed

Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/admin/investments
    `.trim();

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Investment Submission</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #09364D, #214B8B); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
        .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
        .info-section { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border-left: 4px solid #214B8B; }
        .info-section h3 { margin-top: 0; color: #09364D; }
        .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 10px 0; }
        .info-item { padding: 8px 0; }
        .info-label { font-weight: bold; color: #09364D; }
        .action-box { background: #e8f4f8; padding: 15px; border-radius: 6px; margin: 20px 0; }
        .action-box h3 { margin-top: 0; color: #09364D; }
        .button { display: inline-block; background: #214B8B; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        .button:hover { background: #09364D; }
        .description-box { background: white; padding: 15px; margin: 15px 0; border-radius: 6px; border: 1px solid #ddd; }
        .status-pending { color: #f89b21; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🏢 New Investment Submission</h1>
        <p>A new investment has been submitted for review</p>
    </div>

    <div class="content">
        <div class="info-section">
            <h3>Investment Details</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Title:</div>
                    <div>${investment.title}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Category:</div>
                    <div>${investment.category}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Funding Goal:</div>
                    <div>${investment.currency} ${investment.amountGoal.toLocaleString()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Status:</div>
                    <div class="status-pending">${investment.status}</div>
                </div>
            </div>

            ${investment.apyRange ? `
            <div class="info-item">
                <div class="info-label">Expected APY Range:</div>
                <div>${investment.apyRange}</div>
            </div>
            ` : ''}

            ${investment.minInvestment ? `
            <div class="info-item">
                <div class="info-label">Minimum Investment:</div>
                <div>${investment.currency} ${investment.minInvestment.toLocaleString()}</div>
            </div>
            ` : ''}

            ${investment.term ? `
            <div class="info-item">
                <div class="info-label">Investment Term:</div>
                <div>${investment.term}</div>
            </div>
            ` : ''}
        </div>

        <div class="info-section">
            <h3>Submitter Information</h3>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Name:</div>
                    <div>${investment.submittedBy}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email:</div>
                    <div>${investment.submitterEmail || 'Not provided'}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Submission Date:</div>
                    <div>${new Date(investment.submissionDate).toLocaleString()}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Investment ID:</div>
                    <div>${investment.id}</div>
                </div>
            </div>
        </div>

        <div class="description-box">
            <h3>Description</h3>
            <p>${investment.description}</p>
        </div>

        <div class="action-box">
            <h3>Action Required</h3>
            <ul>
                <li>Review the investment submission details</li>
                <li>Approve or reject the investment</li>
                <li>Contact the submitter if additional information is needed</li>
                <li>Update investment status in the admin panel</li>
            </ul>
            <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/admin/investments" class="button">
                View in Admin Panel
            </a>
        </div>
    </div>
</body>
</html>
    `.trim();

    return await this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      text: emailText,
      html: emailHtml
    });
  }

  /**
   * Send notification for general contact form leads
   */
  static async sendContactLeadNotification(lead: Lead): Promise<boolean> {
    const subject = 'New Contact Form Submission';

    const emailText = `
New Contact Form Submission
═══════════════════════════════════════

Contact Information:
• Name: ${lead.name}
• Email: ${lead.email}
• Phone: ${lead.phone || 'Not provided'}
• Submission Date: ${new Date(lead.submissionDate).toLocaleString()}
• Lead ID: ${lead.id}

Message:
${lead.message}

═══════════════════════════════════════

Action Required:
1. Respond to the inquiry within 24 hours
2. Update lead status in the admin panel

Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/admin/leads

Best regards,
MegaInvest Platform
    `.trim();

    return await this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject,
      text: emailText
    });
  }

  /**
   * Test email service configuration
   */
  static async testEmailService(): Promise<boolean> {
    console.log('🧪 Testing email service...');
    
    const testResult = await this.sendEmail({
      to: this.ADMIN_EMAIL,
      subject: 'Email Service Test',
      text: 'This is a test email to verify the email service is working correctly.'
    });

    if (testResult) {
      console.log('✅ Email service test successful');
    } else {
      console.log('❌ Email service test failed');
    }

    return testResult;
  }
}
