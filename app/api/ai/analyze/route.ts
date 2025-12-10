import { NextResponse } from 'next/server';

const AI_SERVICE_URL = 'https://web3-semantic-search.onrender.com';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const userDescription = formData.get('userDescription') as string;

        if (!file || !title) {
            return NextResponse.json(
                { error: "Missing required fields: file and title" },
                { status: 400 }
            );
        }

        // Convert File to Buffer for the external API
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);

        // Create FormData for the external API
        const externalFormData = new FormData();
        const blob = new Blob([uint8Array], { type: file.type });
        externalFormData.append('file', blob, file.name);
        externalFormData.append('title', title);
        externalFormData.append('userDescription', userDescription);

        // Call the external AI service
        const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
            method: 'POST',
            body: externalFormData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.error || `AI service returned ${response.status}`
            );
        }

        const data = await response.json();

        // Ensure response has required fields
        if (!data.enhancedDescription || !data.tags || !data.contentVector) {
            throw new Error('Invalid response format from AI service');
        }

        return NextResponse.json({
            isMatch: data.isMatch !== false,
            confidenceScore: data.confidenceScore ?? 0.85,
            feedback: data.feedback || "Analysis completed successfully.",
            enhancedDescription: data.enhancedDescription,
            tags: data.tags,
            contentVector: data.contentVector,
        });
    } catch (error) {
        console.error("AI Analysis Error:", error);
        const message = error instanceof Error ? error.message : "Failed to analyze content";
        return NextResponse.json(
            { error: message },
            { status: 500 }
        );
    }
}
