import nodemailer, { type Transporter } from "nodemailer";

type EmailMessage = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

let gmailTransporter: Transporter | null = null;

function getGmailTransporter() {
  const user = process.env.GMAIL_USER || process.env.ADMIN_EMAIL;
  const pass = process.env.GMAIL_APP_PASSWORD ? process.env.GMAIL_APP_PASSWORD.replace(/\s+/g, "") : undefined;

  if (!user || !pass) return null;

  if (!gmailTransporter) {
    gmailTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }
  return { transporter: gmailTransporter, user };
}

export async function sendEmail(message: EmailMessage) {
  const gmail = getGmailTransporter();
  if (!gmail) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Configure GMAIL_USER and GMAIL_APP_PASSWORD to send account emails.");
    }

    console.info(`[development email] To: ${message.to}\nSubject: ${message.subject}\n\n${message.text}`);
    return;
  }

  try {
    const fromName = process.env.EMAIL_FROM_NAME || "GDE Worldwide Express";
    await gmail.transporter.sendMail({
      from: `"${fromName}" <${gmail.user}>`,
      to: message.to,
      subject: message.subject,
      text: message.text,
      html: message.html,
    });
    console.info(`[email:gmail] Delivered to ${message.to}: "${message.subject}"`);
  } catch (error) {
    console.error("[email:gmail] Delivery via Gmail SMTP failed:", error);
    throw new Error("Gmail could not deliver the account email.", { cause: error });
  }
}

export function appUrl(path: string) {
  const origin = process.env.APP_URL ?? (process.env.NODE_ENV === "production" ? "" : "http://localhost:3000");
  if (!origin) throw new Error("Set APP_URL to the public application origin.");
  return new URL(path, origin).toString();
}

export async function sendVerificationEmail(params: {
  to: string;
  contactName: string;
  token: string;
}) {
  const verificationUrl = appUrl(`/verify-email?token=${encodeURIComponent(params.token)}`);
  await sendEmail({
    to: params.to,
    subject: "Verify your GDE Worldwide Express account",
    text: `Hello ${params.contactName},\n\nConfirm your email address to submit your GDE business account for review:\n\n${verificationUrl}\n\nThis link expires in 24 hours. If you do not see this email, check your Spam or Junk folder.\n\nIf you did not receive this earlier or the link expired, request a new one at ${appUrl("/resend-verification")}.`,
  });
}

export async function sendPasswordResetEmail(params: { to: string; token: string }) {
  const resetUrl = appUrl(`/reset-password?token=${encodeURIComponent(params.token)}`);
  await sendEmail({
    to: params.to,
    subject: "Reset your GDE Worldwide Express password",
    text: `Use this one-time link to reset your password:\n\n${resetUrl}\n\nThis link expires in one hour. If you did not request a password reset, you can ignore this email.`,
  });
}

export async function sendApplicationDecisionEmail(params: {
  to: string;
  contactName: string;
  companyName: string;
  approved: boolean;
  reason?: string;
}) {
  if (params.approved) {
    await sendEmail({
      to: params.to,
      subject: "Your GDE business account has been approved",
      text: `Hello ${params.contactName},\n\nGood news — the GDE Worldwide Express application for ${params.companyName} has been approved.\n\nYou can sign in here:\n${appUrl("/login")}\n\nWelcome to GDE.`,
    });
    return;
  }

  const reasonLine = params.reason ? `\n\nReason: ${params.reason}` : "";
  await sendEmail({
    to: params.to,
    subject: "Update on your GDE business account application",
    text: `Hello ${params.contactName},\n\nThe GDE Worldwide Express application for ${params.companyName} was not approved at this time.${reasonLine}\n\nIf you have questions, contact GDE support.`,
  });
}

export async function sendPickupUpdateEmail(params: {
  to: string;
  contactName: string;
  pickupId: string;
  status: string;
  scheduleDetails?: string;
  note?: string;
}) {
  const noteLine = params.note ? `\n\nNotes from GDE Operations: ${params.note}` : "";
  const scheduleLine = params.scheduleDetails ? `\nSchedule: ${params.scheduleDetails}` : "";
  await sendEmail({
    to: params.to,
    subject: `GDE Pickup Request Update (${params.status})`,
    text: `Hello ${params.contactName},\n\nYour pickup request (#${params.pickupId.slice(-6).toUpperCase()}) status has been updated to: ${params.status}.${scheduleLine}${noteLine}\n\nYou can review your pickup requests in the portal:\n${appUrl("/account/pickups")}\n\nThank you for choosing GDE Worldwide Express.`,
  });
}

export async function sendTicketReplyEmail(params: {
  to: string;
  contactName: string;
  ticketSubject: string;
  ticketId: string;
  replySnippet: string;
}) {
  await sendEmail({
    to: params.to,
    subject: `[Ticket #${params.ticketId.slice(-6).toUpperCase()}] New response: ${params.ticketSubject}`,
    text: `Hello ${params.contactName},\n\nGDE Support has posted a response to your ticket "${params.ticketSubject}":\n\n"${params.replySnippet}"\n\nYou can view and reply to the ticket in your portal:\n${appUrl(`/account/tickets/${params.ticketId}`)}\n\nBest regards,\nGDE Support Team`,
  });
}
