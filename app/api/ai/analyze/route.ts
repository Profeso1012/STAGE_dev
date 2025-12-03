import { NextResponse } from 'next/server';

// Mock function to generate a random vector
function generateMockVector(dim = 1536): number[] {
    return Array.from({ length: dim }, () => Math.random() - 0.5);
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { fileUrl, fileType, userDescription, title } = body;

        // Simulate AI processing delay
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Simple mock logic for "Verification"
        const isMatch = true; // Assume match for now, or randomize
        const confidenceScore = 0.95;

        // Mock "Enhanced Description" based on file type
        let enhancedDescription = userDescription;
        let tags = ["content"];

        if (fileType.startsWith("image")) {
            enhancedDescription = `[AI Enhanced] A high-quality visual representation of ${title}. ${userDescription}`;
            tags = ["image", "visual", "art", "creative"];
        } else if (fileType.startsWith("audio")) {
            enhancedDescription = `[AI Enhanced] A clear audio recording featuring ${title}. ${userDescription}`;
            tags = ["audio", "music", "sound", "recording"];
        } else if (fileType.startsWith("text") || fileType === "application/pdf") {
            enhancedDescription = `[AI Enhanced] A detailed document about ${title}. ${userDescription}`;
            tags = ["text", "document", "article", "writing"];
        }

        const response = {
            isMatch,
            confidenceScore,
            feedback: isMatch ? "The description accurately depicts the content." : "Potential mismatch detected.",
            enhancedDescription,
            tags,
            contentVector: generateMockVector(),
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error("AI Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze content" }, { status: 500 });
    }
}
