import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const deliveries = await prisma.deliveryDocument.findMany({
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(deliveries);
  } catch (error) {
    console.error('Fetch Deliveries Error:', error);
    return NextResponse.json({ error: 'Failed to fetch deliveries.' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { id, customer, date, responsibleId, warehouseCode, items } = await req.json();

    if (!id || !customer || !items || items.length === 0) {
      return NextResponse.json({ error: 'Missing required delivery parameters.' }, { status: 400 });
    }

    // Create inside a Transaction for safety
    const result = await prisma.$transaction(async (tx: any) => {
      const doc = await tx.deliveryDocument.create({
        data: {
          id,
          customer,
          date,
          responsibleId: Number(responsibleId),
          warehouseCode,
          status: 'Draft', // Default
        }
      });

      // Bulk Add items lines
      await tx.deliveryItem.createMany({
        data: items.map((item: any) => ({
          documentId: id,
          productId: Number(item.productId),
          quantity: Number(item.quantity)
        }))
      });

      return doc;
    });

    return NextResponse.json({ success: true, message: 'Delivery Draft created successfully!', document: result }, { status: 201 });

  } catch (error) {
    console.error('Create Delivery Error:', error);
    return NextResponse.json({ error: 'Failed to create delivery document.' }, { status: 500 });
  }
}
