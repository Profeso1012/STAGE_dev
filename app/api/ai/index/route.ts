import { NextResponse } from 'next/server';
import { mockDb, MintedItem } from '@/lib/mock-db';

export async function POST(req: Request) {
    try {
        console.log("[API:INDEX] Request received");

        const body = await req.json();
        const item: MintedItem = body;

        console.log("[API:INDEX] Item data extracted");
        console.log("[API:INDEX] Item ID:", item.id);
        console.log("[API:INDEX] Item title:", item.title);
        console.log("[API:INDEX] Item owner:", item.owner);
        console.log("[API:INDEX] Item file type:", item.fileType);
        console.log("[API:INDEX] Item tags:", item.tags);

        if (!item.id || !item.owner) {
            console.error("[API:INDEX] Missing required fields - id or owner");
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        console.log("[API:INDEX] All required fields present");

        // Add createdAt if missing
        if (!item.createdAt) {
            item.createdAt = new Date().toISOString();
            console.log("[API:INDEX] Added createdAt timestamp:", item.createdAt);
        }

        console.log("[API:INDEX] Adding item to database");
        mockDb.addItem(item);
        console.log("[API:INDEX] Item successfully added to database");

        const successMsg = "Item indexed successfully";
        console.log("[API:INDEX] SUCCESS:", successMsg);
        return NextResponse.json({ success: true, message: successMsg });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to index item";
        console.error("[API:INDEX] ERROR:", message);
        console.error("[API:INDEX] Full error:", error);
        return NextResponse.json({ error: "Failed to index item" }, { status: 500 });
    }
}
