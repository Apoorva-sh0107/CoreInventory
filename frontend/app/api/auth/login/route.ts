import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { loginId, password } = await req.json();

    if (!loginId || !password) {
      return NextResponse.json({ error: 'Missing parameters (loginId, password)' }, { status: 400 });
    }

    // Find User
    const user = await prisma.user.findUnique({
      where: { loginId: loginId }
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // Compare Hashed Password
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid login credentials' }, { status: 401 });
    }

    // Generate JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'fallback_secret_key_change_this';
    const token = jwt.sign(
      { id: user.id, loginId: user.loginId, role: user.role },
      jwtSecret,
      { expiresIn: '1d' } // Expires in 1 day
    );

    // Create Cookie response headers
    const response = NextResponse.json({ 
      success: true, 
      message: 'Login successful!',
      user: { loginId: user.loginId, email: user.email, role: user.role }
    });

    // Set HTTPOnly Cookie for security
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Send only on HTTPS in prod
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day in seconds
    });

    return response;

  } catch (error) {
    console.error('Login Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
