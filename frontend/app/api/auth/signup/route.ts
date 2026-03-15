import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const { loginId, email, password } = await req.json();

    if (!loginId || !email || !password) {
      return NextResponse.json({ error: 'Missing required parameters (loginId, email, password)' }, { status: 400 });
    }

    // Check if loginId or email already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { loginId: loginId },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: 'Username or Email already in use.' }, { status: 400 });
    }

    // Hash Password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create User inside Database
    const user = await prisma.user.create({
      data: {
        loginId,
        email,
        passwordHash,
        role: 'User'
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully!', 
      userId: user.id 
    }, { status: 201 });

  } catch (error) {
    console.error('Signup Error:', error);
    return NextResponse.json({ error: 'Internal Server Error.' }, { status: 500 });
  }
}
