import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const items = await prisma.warehouse.findMany();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  try {
    const { name, code, address } = await req.json();

    if (!name || !code) {
      return NextResponse.json({ error: 'Name and Code are required.' }, { status: 400 });
    }

    const item = await prisma.warehouse.create({
      data: { name, code, address: address || '' }
    });

    return NextResponse.json({ success: true, message: 'Warehouse created!', item }, { status: 201 });

  } catch (error) {
    console.error('Create Warehouse Error:', error);
    return NextResponse.json({ error: 'Failed to create warehouse.' }, { status: 500 });
  }
}
