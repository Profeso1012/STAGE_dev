import { NextResponse } from 'next/server';

const AI_SERVICE_URL = 'https://web3-semantic-search.onrender.com';

export async function POST(req: Request) {
    try {
        console.log("[API:ANALYZE] Request received");

        const formData = await req.formData();
        const file = formData.get('file') as File;
        const title = formData.get('title') as string;
        const userDescription = formData.get('userDescription') as string;

        console.log("[API:ANALYZE] Extracted form data");
        console.log("[API:ANALYZE] File:", file?.name, "Size:", file?.size);
        console.log("[API:ANALYZE] Title:", title);
        console.log("[API:ANALYZE] User description length:", userDescription?.length);

        if (!file || !title) {
            console.error("[API:ANALYZE] Missing required fields");
            return NextResponse.json(
                { error: "Missing required fields: file and title" },
                { status: 400 }
            );
        }

        console.log("[API:ANALYZE] Converting file to buffer");
        // Convert File to Buffer for the external API
        const buffer = await file.arrayBuffer();
        const uint8Array = new Uint8Array(buffer);
        console.log("[API:ANALYZE] File converted to buffer, size:", uint8Array.length);

        console.log("[API:ANALYZE] Creating external FormData for AI service");
        // Create FormData for the external API
        const externalFormData = new FormData();
        const blob = new Blob([uint8Array], { type: file.type });
        externalFormData.append('file', blob, file.name);
        externalFormData.append('title', title);
        externalFormData.append('userDescription', userDescription);
        console.log("[API:ANALYZE] External FormData created");

        console.log("[API:ANALYZE] Calling external AI service at:", `${AI_SERVICE_URL}/analyze`);
        // Call the external AI service
        const startTime = Date.now();
        const response = await fetch(`${AI_SERVICE_URL}/analyze`, {
            method: 'POST',
            body: externalFormData,
        });
        const endTime = Date.now();
        console.log(`[API:ANALYZE] External AI service response received in ${endTime - startTime}ms`);
        console.log("[API:ANALYZE] Response status:", response.status);
        console.log("[API:ANALYZE] Response headers:", Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            console.error("[API:ANALYZE] AI service returned non-OK status");
            const errorData = await response.json().catch(() => ({}));
            console.error("[API:ANALYZE] Error data:", errorData);
            throw new Error(
                errorData.error || `AI service returned ${response.status}`
            );
        }

        const data = await response.json();
        console.log("[API:ANALYZE] Response data parsed");
        console.log("[API:ANALYZE] Full raw response:", JSON.stringify(data, null, 2));
        console.log("[API:ANALYZE] Response keys:", Object.keys(data));
        console.log("[API:ANALYZE] Enhanced description:", data.enhancedDescription);
        console.log("[API:ANALYZE] Enhanced description type:", typeof data.enhancedDescription);
        console.log("[API:ANALYZE] Enhanced description length:", data.enhancedDescription?.length);
        console.log("[API:ANALYZE] Tags:", data.tags);
        console.log("[API:ANALYZE] Tags type:", typeof data.tags);
        console.log("[API:ANALYZE] Content vector:", data.contentVector);
        console.log("[API:ANALYZE] Content vector type:", typeof data.contentVector);
        console.log("[API:ANALYZE] Content vector length:", data.contentVector?.length);

        // Ensure response has required fields
        if (!data.enhancedDescription || !data.tags || !data.contentVector) {
            console.error("[API:ANALYZE] Response missing required fields!");
            console.error("[API:ANALYZE] - Has enhancedDescription?", !!data.enhancedDescription);
            console.error("[API:ANALYZE] - Has tags?", !!data.tags);
            console.error("[API:ANALYZE] - Has contentVector?", !!data.contentVector);
            const errorDetails = {
                message: 'Invalid response format from AI service',
                receivedData: data,
                missingFields: {
                    enhancedDescription: !data.enhancedDescription,
                    tags: !data.tags,
                    contentVector: !data.contentVector,
                }
            };
            throw new Error(JSON.stringify(errorDetails));
        }

        const responseData = {
            isMatch: data.isMatch !== false,
            confidenceScore: data.confidenceScore ?? 0.85,
            feedback: data.feedback || "Analysis completed successfully.",
            enhancedDescription: data.enhancedDescription,
            tags: data.tags,
            contentVector: data.contentVector,
        };

        console.log("[API:ANALYZE] Returning response to client");
        console.log("[API:ANALYZE] Response structure validated");
        return NextResponse.json(responseData);
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to analyze content";
        console.error("[API:ANALYZE] ERROR:", message);
        console.error("[API:ANALYZE] Full error:", error);

        // Try to parse error message as JSON for detailed info
        let errorDetails = message;
        try {
            errorDetails = JSON.parse(message);
        } catch (e) {
            // If not JSON, keep the original message
        }

        return NextResponse.json(
            {
                error: typeof errorDetails === 'object' ? 'Invalid response format from AI service' : message,
                details: errorDetails
            },
            { status: 500 }
        );
    }
}
