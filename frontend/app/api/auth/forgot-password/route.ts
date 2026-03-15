import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email parameter is required.' }, { status: 400 });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user) {
      return NextResponse.json({ error: 'No user found with that email address.' }, { status: 404 });
    }

    // Generate 6-Digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 mins expiry

    // Save OTP to Database
    await prisma.user.update({
      where: { id: user.id },
      data: {
        otpCode: otpCode,
        otpExpiry: otpExpiry
      }
    });

    // Configure Nodemailer Transport
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.example.com',
      port: Number(process.env.SMTP_PORT) || 587,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || ''
      }
    });

    // Send Email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"Bold Stock" <no-reply@boldstock.com>',
      to: email,
      subject: 'Password Reset OTP - Bold Stock',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 12px;">
          <h2 style="color: #714B67; text-align: center;">Reset Your Password</h2>
          <p>We received a request to reset your password. Use the verification code below to proceed:</p>
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 800; letter-spacing: 5px; color: #1A1A2E; background: #F3E8FF; padding: 12px 24px; border-radius: 10px; border: 1px solid #714B67;">${otpCode}</span>
          </div>
          <p>This code will expire in <strong>15 minutes</strong>.</p>
          <p>If you did not request this, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
          <p style="font-size: 12px; color: #888; text-align: center;">Bold Stock Inventory Management System</p>
        </div>
      `
    });

    return NextResponse.json({ success: true, message: 'OTP code sent to your email successfully.' });

  } catch (error) {
    console.error('Forgot Password Error:', error);
    return NextResponse.json({ error: 'Failed to send OTP. Please configure SMTP properly inside .env' }, { status: 500 });
  }
}
