import { NextResponse } from 'next/server';
import { mockDb, MintedItem } from '@/lib/mock-db';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const item: MintedItem = body;

        if (!item.id || !item.owner) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Add createdAt if missing
        if (!item.createdAt) {
            item.createdAt = new Date().toISOString();
        }

        mockDb.addItem(item);

        return NextResponse.json({ success: true, message: "Item indexed successfully" });
    } catch (error) {
        console.error("Indexer Error:", error);
        return NextResponse.json({ error: "Failed to index item" }, { status: 500 });
    }
}
