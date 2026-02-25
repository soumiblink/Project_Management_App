import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

async function sendEmail({ to, subject, html, text }: SendEmailParams) {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('SMTP credentials not configured. Email not sent.');
      return { success: false, message: 'SMTP not configured' };
    }

    await transporter.sendMail({
      from: `"PRO Project Management" <${process.env.SMTP_USER}>`,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''),
    });

    return { success: true };
  } catch (error) {
    console.error('Email sending error:', error);
    return { success: false, error };
  }
}

export async function sendInvitationEmail({
  to,
  projectName,
  inviterName,
  token,
}: {
  to: string;
  projectName: string;
  inviterName: string;
  token: string;
}) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const acceptUrl = `${appUrl}/invitations/accept?token=${token}`;

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 You're Invited!</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${inviterName}</strong> has invited you to join the project <strong>"${projectName}"</strong> on PRO Project Management.</p>
            <p>Click the button below to accept the invitation and start collaborating:</p>
            <center>
              <a href="${acceptUrl}" class="button">Accept Invitation</a>
            </center>
            <p style="color: #64748b; font-size: 14px;">Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #06b6d4; font-size: 12px;">${acceptUrl}</p>
            <p style="margin-top: 30px;">This invitation will expire in 7 days.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PRO Project Management. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `You've been invited to join "${projectName}"`,
    html,
  });
}

export async function sendTaskAssignedEmail({
  to,
  taskTitle,
  projectName,
  assignedBy,
  taskUrl,
}: {
  to: string;
  taskTitle: string;
  projectName: string;
  assignedBy: string;
  taskUrl: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .task-box { background: white; border-left: 4px solid #06b6d4; padding: 15px; margin: 20px 0; border-radius: 5px; }
          .button { display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%); color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Task Assigned</h1>
          </div>
          <div class="content">
            <p>Hi there,</p>
            <p><strong>${assignedBy}</strong> has assigned you a new task in <strong>"${projectName}"</strong>:</p>
            <div class="task-box">
              <h3 style="margin: 0 0 10px 0; color: #06b6d4;">${taskTitle}</h3>
            </div>
            <center>
              <a href="${taskUrl}" class="button">View Task</a>
            </center>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PRO Project Management. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `New task assigned: ${taskTitle}`,
    html,
  });
}

export async function sendInvitationAcceptedEmail({
  to,
  memberName,
  projectName,
}: {
  to: string;
  memberName: string;
  projectName: string;
}) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f8fafc; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Invitation Accepted</h1>
          </div>
          <div class="content">
            <p>Good news!</p>
            <p><strong>${memberName}</strong> has accepted your invitation and joined <strong>"${projectName}"</strong>.</p>
            <p>You can now collaborate together on this project.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PRO Project Management. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to,
    subject: `${memberName} joined "${projectName}"`,
    html,
  });
}
