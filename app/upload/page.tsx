import { UploadForm } from "@/components/upload-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Zap, Lock, TrendingUp } from "lucide-react";

export default function UploadPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
            <div className="container mx-auto max-w-screen-2xl py-10 px-4">
                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Upload & Mint Content
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Register your IP on the Camp Network blockchain. Our AI will analyze your content to ensure it gets discovered by the right audience.
                    </p>

                    {/* Benefits Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 mb-12">
                        <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 backdrop-blur hover:border-primary/30 transition-all">
                            <div className="flex justify-center mb-3">
                                <Lock className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">IP Protected</h3>
                            <p className="text-sm text-muted-foreground">Your work is immutable on blockchain</p>
                        </div>
                        <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 backdrop-blur hover:border-primary/30 transition-all">
                            <div className="flex justify-center mb-3">
                                <Zap className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">AI Analyzed</h3>
                            <p className="text-sm text-muted-foreground">Smart discovery recommendations</p>
                        </div>
                        <div className="bg-secondary/50 border border-border/50 rounded-lg p-4 backdrop-blur hover:border-primary/30 transition-all">
                            <div className="flex justify-center mb-3">
                                <TrendingUp className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-foreground mb-2">Earn Royalties</h3>
                            <p className="text-sm text-muted-foreground">Get paid every time someone accesses</p>
                        </div>
                    </div>
                </div>

                {/* Upload Form Card */}
                <Card className="border-border/50 bg-gradient-to-br from-secondary/50 to-secondary/30 backdrop-blur">
                    <CardHeader>
                        <CardTitle className="text-2xl text-foreground">Create New IP-NFT</CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Supported formats: Images (PNG, JPG), Audio (MP3, WAV), Text (PDF, MD).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UploadForm />
                    </CardContent>
                </Card>

                {/* Info Section */}
                <div className="mt-12 bg-secondary/20 border border-border/50 rounded-lg p-6 backdrop-blur">
                    <h3 className="text-lg font-semibold text-foreground mb-4">How it works</h3>
                    <ol className="space-y-3 text-muted-foreground">
                        <li className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex-shrink-0">1</span>
                            <span>Upload your file and provide a title and description</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex-shrink-0">2</span>
                            <span>Our AI analyzes your content and generates enhanced metadata</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex-shrink-0">3</span>
                            <span>Set your price and royalty percentage</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex-shrink-0">4</span>
                            <span>Mint to blockchain and start earning</span>
                        </li>
                    </ol>
                </div>
            </div>
        </div>
    );
}
