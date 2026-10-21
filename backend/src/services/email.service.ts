import { Resend } from "resend";
import { env } from "../config/env.js";

const resend = new Resend(env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (
  email: string,
  name: string,
  resetToken: string,
) => {
  const resetUrl = `${env.FRONTEND_URL}/reset-password/${resetToken}`;

  const { error } = await resend.emails.send({
    from: env.EMAIL_FROM,
    to: [email],
    subject: "Reset your password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2>Reset your password</h2>

        <p>Hello ${name},</p>

        <p>
          We received a request to reset your NOVA Store password.
        </p>

        <p>
          Click the button below to choose a new password:
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            padding: 12px 20px;
            background: #111827;
            color: white;
            text-decoration: none;
            border-radius: 6px;
          "
        >
          Reset Password
        </a>

        <p style="margin-top: 24px;">
          This link will expire in 10 minutes.
        </p>

        <p>
          If you did not request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  });

  if (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};
