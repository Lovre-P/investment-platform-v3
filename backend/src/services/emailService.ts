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
    if (this.transporter) return this.transporter;
    if (!this.validateConfig()) return null;

    try {
      this.transporter = nodemailer.createTransport({
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
      this.transporter = null;
    }

    return this.transporter;
  }

  private static isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private static async sendEmail(options: EmailOptions): Promise<boolean> {
    if (!this.isValidEmail(options.to)) {
      console.error('Invalid recipient email address:', options.to);
      return false;
    }

    const transporter = this.getTransporter();
    if (!transporter) return false;

    const maxRetries = Number(process.env.EMAIL_MAX_RETRIES || 3);
    const delayMs = Number(process.env.EMAIL_RETRY_DELAY || 1000);

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        await transporter.sendMail({
          from: this.FROM_EMAIL,
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

Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads

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
                <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads" class="button">
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

Admin Panel: ${process.env.FRONTEND_URL || 'http://localhost:5173'}/admin/leads

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
