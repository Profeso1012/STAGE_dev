import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/mock-db';

// Mock function to generate a random vector
function generateMockVector(dim = 1536): number[] {
    return Array.from({ length: dim }, () => Math.random() - 0.5);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { query } = body;

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 1000));

        const queryVector = generateMockVector();

        // In a real scenario, we would use the vector to search.
        // Here, we will just return the query vector so the frontend (or this API) can use it.
        // Actually, for the "Discovery" page, we might want this endpoint to return the *results* directly
        // if we are managing the DB here.

        // Let's perform a "Mock Search" against our local JSON DB
        const allItems = mockDb.getItems();

        // Simple keyword filter to simulate "relevance" if the query matches title/tags
        // Otherwise return everything (discovery mode)
        const lowerQuery = query.toLowerCase();
        const results = allItems.filter(item =>
            item.title.toLowerCase().includes(lowerQuery) ||
            item.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
            item.description.toLowerCase().includes(lowerQuery)
        );

        // If no results found by keyword, return some random ones to simulate "semantic" match
        const finalResults = results.length > 0 ? results : allItems.slice(0, 5);

        return NextResponse.json({
            results: finalResults,
            suggestedFilters: ["trending", "recent"]
        });
    } catch (error) {
        console.error("AI Search Error:", error);
        return NextResponse.json({ error: "Failed to search content" }, { status: 500 });
    }
}
