import { UploadForm } from "@/components/upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function UploadPage() {
    return (
        <div className="container max-w-4xl py-10 px-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Upload & Mint Content</h1>
                <p className="text-muted-foreground">
                    Register your IP on the blockchain. Our AI will analyze your content to ensure it gets discovered by the right audience.
                </p>
            </div>

            <Card className="glass-card">
                <CardHeader>
                    <CardTitle>Create New IP-NFT</CardTitle>
                    <CardDescription>
                        Supported formats: Images (PNG, JPG), Audio (MP3, WAV), Text (PDF, MD).
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <UploadForm />
                </CardContent>
            </Card>
        </div>
    );
}
