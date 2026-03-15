import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { email, otpCode, newPassword } = await req.json();

    if (!email || !otpCode || !newPassword) {
      return NextResponse.json({ error: 'Missing parameters (email, otpCode, newPassword)' }, { status: 400 });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { email: email }
    });

    if (!user || !user.otpCode || !user.otpExpiry) {
      return NextResponse.json({ error: 'No OTP request found for this email address.' }, { status: 404 });
    }

    // Verify OTP Correctness
    if (user.otpCode !== otpCode) {
      return NextResponse.json({ error: 'Invalid verification code.' }, { status: 401 });
    }

    // Verify Expiry
    const isExpired = new Date() > new Date(user.otpExpiry);
    if (isExpired) {
      return NextResponse.json({ error: 'Verification code has expired.' }, { status: 400 });
    }

    // Hash New Password
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Update Password and Clear OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: passwordHash,
        otpCode: null,
        otpExpiry: null
      }
    });

    return NextResponse.json({ success: true, message: 'Password reset successfully!' });

  } catch (error) {
    console.error('Reset Password Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
