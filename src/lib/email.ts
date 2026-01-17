/**
 * Email Service using Resend
 * https://resend.com
 */

import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Send an email using Resend
 */
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    // Production mode with Resend
    if (resend) {
      const { data, error } = await resend.emails.send({
        from: 'SplitElite <noreply@intelligenceforall.ai>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true, id: data?.id };
    }

    // Demo mode (no API key)
    console.log('Email sent (demo):', options);
    return { success: true, id: 'demo_' + Date.now() };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}

/**
 * Send a payment reminder email
 */
export async function sendPaymentReminder(params: {
  toEmail: string;
  toName: string;
  fromName: string;
  amount: number;
  groupName: string;
  currency?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { toEmail, toName, fromName, amount, groupName, currency = 'USD' } = params;
  
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Payment Reminder</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #22c55e, #10b981); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">SplitElite</h1>
          </div>
          
          <!-- Content -->
          <div style="padding: 32px;">
            <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 16px;">
              Hi ${toName},
            </p>
            
            <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
              ${fromName} sent you a friendly reminder about a pending payment in <strong style="color: #e2e8f0;">${groupName}</strong>.
            </p>
            
            <!-- Amount Box -->
            <div style="background-color: #0f172a; border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 8px;">Amount due</p>
              <p style="color: #22c55e; font-size: 36px; font-weight: bold; margin: 0;">
                ${formattedAmount}
              </p>
            </div>
            
            <p style="color: #94a3b8; font-size: 14px; margin: 0 0 24px;">
              Once you've paid, mark it as settled in the app to keep everyone's balances up to date.
            </p>
            
            <!-- CTA Button -->
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai'}" 
               style="display: block; background: linear-gradient(135deg, #22c55e, #10b981); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; font-weight: 600; font-size: 16px;">
              Open SplitElite
            </a>
          </div>
          
          <!-- Footer -->
          <div style="padding: 24px 32px; border-top: 1px solid #334155;">
            <p style="color: #64748b; font-size: 12px; margin: 0; text-align: center;">
              You received this email because you're a member of ${groupName} on SplitElite.
              <br><br>
              <a href="#" style="color: #64748b;">Unsubscribe</a> from reminder emails
            </p>
          </div>
        </div>
      </body>
    </html>
  `;

  const text = `
Hi ${toName},

${fromName} sent you a friendly reminder about a pending payment in ${groupName}.

Amount due: ${formattedAmount}

Once you've paid, mark it as settled in the app to keep everyone's balances up to date.

Open SplitElite: ${process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai'}
  `.trim();

  return sendEmail({
    to: toEmail,
    subject: `💰 ${fromName} sent you a payment reminder`,
    html,
    text,
  });
}

/**
 * Send a welcome email to new users
 */
export async function sendWelcomeEmail(params: {
  email: string;
  name: string;
}): Promise<{ success: boolean; error?: string }> {
  const { email, name } = params;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #10b981); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">Welcome to SplitElite!</h1>
          </div>
          
          <div style="padding: 32px;">
            <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 16px;">
              Hi ${name},
            </p>
            
            <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
              Thanks for joining SplitElite! You're now ready to split expenses with friends, roommates, and travel buddies.
            </p>
            
            <h3 style="color: #e2e8f0; font-size: 16px; margin: 0 0 16px;">Get started:</h3>
            
            <ul style="color: #94a3b8; font-size: 14px; padding-left: 20px; margin: 0 0 24px;">
              <li style="margin-bottom: 8px;">Create your first group</li>
              <li style="margin-bottom: 8px;">Add members (they don't need an account)</li>
              <li style="margin-bottom: 8px;">Start adding expenses</li>
              <li>See who owes what instantly</li>
            </ul>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai'}" 
               style="display: block; background: linear-gradient(135deg, #22c55e, #10b981); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; font-weight: 600; font-size: 16px;">
              Open SplitElite
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: '🎉 Welcome to SplitElite!',
    html,
  });
}

/**
 * Send expense notification to group members
 */
export async function sendExpenseNotification(params: {
  toEmail: string;
  toName: string;
  addedBy: string;
  description: string;
  amount: number;
  yourShare: number;
  groupName: string;
  currency?: string;
}): Promise<{ success: boolean; error?: string }> {
  const { toEmail, toName, addedBy, description, amount, yourShare, groupName, currency = 'USD' } = params;

  const formatAmount = (amt: number) => new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amt);

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0f172a; margin: 0; padding: 40px 20px;">
        <div style="max-width: 480px; margin: 0 auto; background-color: #1e293b; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #22c55e, #10b981); padding: 32px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px;">New Expense Added</h1>
          </div>
          
          <div style="padding: 32px;">
            <p style="color: #e2e8f0; font-size: 16px; margin: 0 0 16px;">
              Hi ${toName},
            </p>
            
            <p style="color: #94a3b8; font-size: 16px; margin: 0 0 24px;">
              ${addedBy} added a new expense in <strong style="color: #e2e8f0;">${groupName}</strong>.
            </p>
            
            <div style="background-color: #0f172a; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <p style="color: #e2e8f0; font-size: 18px; font-weight: 600; margin: 0 0 8px;">
                ${description}
              </p>
              <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px;">
                Total: ${formatAmount(amount)}
              </p>
              <div style="border-top: 1px solid #334155; padding-top: 16px;">
                <p style="color: #94a3b8; font-size: 14px; margin: 0 0 4px;">Your share</p>
                <p style="color: #f87171; font-size: 24px; font-weight: bold; margin: 0;">
                  ${formatAmount(yourShare)}
                </p>
              </div>
            </div>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://www.intelligenceforall.ai'}" 
               style="display: block; background: linear-gradient(135deg, #22c55e, #10b981); color: white; text-decoration: none; padding: 16px 24px; border-radius: 12px; text-align: center; font-weight: 600; font-size: 16px;">
              View Details
            </a>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: toEmail,
    subject: `📝 New expense: ${description}`,
    html,
  });
}
