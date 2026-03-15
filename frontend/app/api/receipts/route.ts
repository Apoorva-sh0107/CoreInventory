import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const receipts = await prisma.receiptDocument.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(receipts);
  } catch (error) {
    console.error('Fetch Receipts Error:', error);
    return NextResponse.json({ error: 'Failed to fetch receipts.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, vendor, date, responsibleId, warehouseCode, items } = await req.json();

    if (!id || !vendor || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required document parameters.' }, { status: 400 });
    }

    // Create inside a Transaction for safety
    const result = await prisma.$transaction(async (tx: any) => {
      const doc = await tx.receiptDocument.create({
        data: {
          id,
          vendor,
          date,
          responsibleId: Number(responsibleId),
          warehouseCode,
          status: 'Draft', // Default
        }
      });

      // Bulk Add items lines
      await tx.receiptItem.createMany({
        data: items.map((item: any) => ({
          documentId: id,
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      });

      return doc;
    });

    return NextResponse.json({ success: true, message: 'Receipt Draft created successfully!', document: result }, { status: 201 });

  } catch (error) {
    console.error('Create Receipt Error:', error);
    return NextResponse.json({ error: 'Failed to create receipt document.' }, { status: 500 });
  }
}
