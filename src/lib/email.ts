import sgMail from '@sendgrid/mail';

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY || '');

/**
 * Sends a verification email to the user with a link to verify their email address.
 * @param userId - The ID of the user to verify.
 * @param email - The email address of the user.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendVerificationEmail(userId: string, email: string): Promise<void> {
  const verificationToken = generateVerificationToken(userId);
  const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/v1/auth/verify-email?token=${verificationToken}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@ilove-card.com',
    subject: 'Verify Your Email Address',
    text: `Please verify your email by clicking on the following link: ${verificationUrl}`,
    html: `<p>Please verify your email by clicking on the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Generates a verification token for the user.
 * @param userId - The ID of the user.
 * @returns A verification token string.
 */
function generateVerificationToken(userId: string): string {
  // Simple token generation; in production, use a more secure method
  return Buffer.from(`${userId}:${Date.now()}`).toString('base64');
}

/**
 * Sends a password reset email to the user with a link to reset their password.
 * @param email - The email address of the user.
 * @param token - The password reset token.
 * @returns A promise that resolves when the email is sent.
 */
export async function sendPasswordResetEmail(email: string, token: string): Promise<void> {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL || 'no-reply@ilove-card.com',
    subject: 'Reset Your Password',
    text: `You requested a password reset. Click the link to reset your password: ${resetUrl}`,
    html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetUrl}">Reset Password</a></p>`,
  };

  try {
    await sgMail.send(msg);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}
