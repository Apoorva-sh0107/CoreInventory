import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(products);
  } catch (error) {
    console.error('Fetch Products Error:', error);
    return NextResponse.json({ error: 'Failed to fetch products.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { name, category, unitCost, onHand, locationCode } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Product name is required.' }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        category: category || null,
        unitCost: Number(unitCost) || 0.0,
        onHand: Number(onHand) || 0,
        freeToUse: Number(onHand) || 0, // Initially, free to use = on hand
        locationCode: locationCode || null
      }
    });

    return NextResponse.json({ success: true, message: 'Product created successfully!', product }, { status: 201 });

  } catch (error) {
    console.error('Create Product Error:', error);
    return NextResponse.json({ error: 'Failed to create product.' }, { status: 500 });
  }
}
