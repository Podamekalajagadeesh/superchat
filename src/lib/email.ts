import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<boolean> => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.error('SMTP credentials not configured');
      return false;
    }

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      html,
    });

    return true;
  } catch (error) {
    console.error('Failed to send email:', error);
    return false;
  }
};

export const sendMagicLink = async (email: string, token: string): Promise<boolean> => {
  const magicLink = `${process.env.NEXTAUTH_URL}/auth/verify-magic-link?token=${token}`;
  
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Welcome to SuperChat!</h2>
      <p>Click the button below to sign in to your account:</p>
      <a href="${magicLink}" 
         style="display: inline-block; background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 20px 0;">
        Sign In to SuperChat
      </a>
      <p style="color: #666; font-size: 14px;">
        This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
      </p>
      <p style="color: #666; font-size: 14px;">
        If the button doesn't work, copy and paste this link into your browser:<br>
        <a href="${magicLink}">${magicLink}</a>
      </p>
    </div>
  `;

  return await sendEmail(email, 'Sign in to SuperChat', html);
};

// For development/testing without SMTP
export const sendMagicLinkDev = async (email: string, token: string): Promise<boolean> => {
  const magicLink = `${process.env.NEXTAUTH_URL}/auth/verify-magic-link?token=${token}`;
  console.log(`[DEV] Magic link for ${email}: ${magicLink}`);
  return true;
};
