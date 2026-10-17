import "server-only";
import nodemailer from "nodemailer";
import { INQUIRY_RECIPIENT, inquiryText, parseInquiry } from "./inquiry";

export function inquiryMailConfigured() {
  return Boolean(process.env.GMAIL_SMTP_USER && process.env.GMAIL_APP_PASSWORD);
}

export async function sendInquiryMail(inquiry: ReturnType<typeof parseInquiry>) {
  if (!inquiryMailConfigured()) throw new Error("Mail not configured");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_SMTP_USER, pass: process.env.GMAIL_APP_PASSWORD?.replace(/\s/g, "") },
    connectionTimeout: 10000, greetingTimeout: 10000, socketTimeout: 20000,
    disableFileAccess: true, disableUrlAccess: true
  });
  const result = await transporter.sendMail({
    from: { name: "越泰指南合作詢問", address: process.env.GMAIL_SMTP_USER! },
    to: INQUIRY_RECIPIENT,
    replyTo: inquiry.email,
    subject: "【越泰指南】新的合作詢問",
    text: inquiryText(inquiry)
  });
  if (!result.accepted?.length || result.rejected?.length) throw new Error("Mail not accepted");
}
