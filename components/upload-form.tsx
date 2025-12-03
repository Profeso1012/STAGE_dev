"use client";

import { useState } from "react";
import { useAuth, useConnect } from "@campnetwork/origin/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { createLicenseTerms } from "@campnetwork/origin";
import { zeroAddress } from "viem";
import { useRouter } from "next/navigation";

export function UploadForm() {
    const { origin, isAuthenticated, walletAddress } = useAuth();
    const { connect } = useConnect();
    const router = useRouter();

    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [analyzing, setAnalyzing] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [minting, setMinting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // License Terms State
    const [price, setPrice] = useState("0.001"); // in CAMP (ETH)
    const [royalty, setRoyalty] = useState("5"); // percentage

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            const maxSizeInMB = 100;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            // Validate file size
            if (selectedFile.size > maxSizeInBytes) {
                setError(`File size must be less than ${maxSizeInMB}MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`);
                setFile(null);
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'audio/mpeg', 'audio/wav', 'application/pdf', 'text/markdown', 'text/plain'];
            if (!allowedTypes.includes(selectedFile.type)) {
                setError(`File type not supported. Allowed: images (PNG, JPG), audio (MP3, WAV), documents (PDF), text (MD, TXT).`);
                setFile(null);
                return;
            }

            setFile(selectedFile);
            setAnalysisResult(null);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!file || !title || !description) {
            setError("Please select a file and provide title/description.");
            return;
        }

        setAnalyzing(true);
        setError(null);

        try {
            // Create FormData to send the actual file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('userDescription', description);

            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                body: formData, // Send as multipart/form-data
            });

            const data = await res.json();
            if (data.error) throw new Error(data.error);

            setAnalysisResult(data);
        } catch (err: any) {
            setError(err.message || "Analysis failed");
        } finally {
            setAnalyzing(false);
        }
    };

    const handleMint = async () => {
        if (!isAuthenticated || !origin) {
            setError("Please connect your wallet first.");
            return;
        }
        if (!file || !analysisResult) {
            setError("Please analyze content before minting.");
            return;
        }

        setMinting(true);
        setError(null);

        try {
            // 1. Create License Terms
            // Price in wei (1 CAMP = 10^18 wei)
            // For simplicity, assuming input is in CAMP
            const priceWei = BigInt(parseFloat(price) * 1e18);
            // Royalty in bps (1% = 100 bps)
            const royaltyBps = parseInt(royalty) * 100;

            const license = createLicenseTerms(
                priceWei,
                86400 * 30, // 30 days duration (example)
                royaltyBps,
                zeroAddress // Native currency
            );

            // 2. Prepare Metadata
            const metadata = {
                name: title,
                description: analysisResult.enhancedDescription, // Use AI enhanced description
                attributes: [
                    { trait_type: "Original Description", value: description },
                    ...analysisResult.tags.map((tag: string) => ({ trait_type: "Tag", value: tag })),
                ],
                // Add AI vector to metadata if needed, or just keep it for indexing
            };

            // 3. Mint File
            // Note: In a real app, we might want to use the AI-generated vector here? 
            // The Origin SDK mintFile uploads the file to IPFS/Arweave via their service.
            const tokenId = await origin.mintFile(file, metadata, license);

            if (!tokenId) throw new Error("Minting returned no Token ID");

            // 4. Index the minted item in our AI Service (Mock DB)
            await fetch("/api/ai/index", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: tokenId,
                    title: title,
                    description: analysisResult.enhancedDescription,
                    tags: analysisResult.tags,
                    fileType: file.type,
                    fileUrl: `https://ipfs.io/ipfs/...`, // In real app, we'd get the CID from mint result if possible or assume it
                    owner: walletAddress,
                    price: price,
                    vector: analysisResult.contentVector,
                }),
            });

            setSuccess(`Successfully minted IP-NFT! Token ID: ${tokenId}`);
            setFile(null);
            setTitle("");
            setDescription("");
            setAnalysisResult(null);

            // Redirect to profile or discovery after short delay
            setTimeout(() => router.push("/discovery"), 2000);

        } catch (err: any) {
            console.error(err);
            setError(err.message || "Minting failed");
        } finally {
            setMinting(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="text-center py-10">
                <p className="mb-4 text-muted-foreground">Connect your wallet to start minting.</p>
                <Button onClick={() => connect()} variant="default">Connect Wallet</Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {error && (
                <div className="p-4 bg-red-500/10 text-red-400 rounded-lg flex items-center gap-3 border border-red-500/30 backdrop-blur">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{error}</span>
                    <button
                        onClick={() => setError(null)}
                        className="ml-auto text-red-400 hover:text-red-300"
                    >
                        ✕
                    </button>
                </div>
            )}
            {success && (
                <div className="p-4 bg-green-500/10 text-green-400 rounded-lg flex items-center gap-3 border border-green-500/30 backdrop-blur">
                    <CheckCircle className="w-5 h-5 flex-shrink-0" />
                    <span className="text-sm">{success}</span>
                    <button
                        onClick={() => setSuccess(null)}
                        className="ml-auto text-green-400 hover:text-green-300"
                    >
                        ✕
                    </button>
                </div>
            )}

            <div className="space-y-4">
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Label htmlFor="file">Content File</Label>
                    <Input id="file" type="file" onChange={handleFileChange} disabled={minting} />
                </div>

                <div className="grid w-full gap-1.5">
                    <Label htmlFor="title">Title</Label>
                    <Input
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. My Awesome Track"
                        disabled={minting}
                    />
                </div>

                <div className="grid w-full gap-1.5">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Describe your content..."
                        disabled={minting}
                    />
                </div>

                {!analysisResult ? (
                    <Button
                        onClick={handleAnalyze}
                        disabled={analyzing || !file || !title || !description}
                        className="w-full"
                    >
                        {analyzing ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                AI Analyzing...
                            </>
                        ) : (
                            "Analyze Content"
                        )}
                    </Button>
                ) : (
                    <div className="space-y-4 border rounded-md p-4 bg-secondary/10">
                        <div className="flex items-center gap-2 text-green-500">
                            <CheckCircle className="w-5 h-5" />
                            <span className="font-semibold">AI Analysis Complete</span>
                        </div>

                        <div className="space-y-2 text-sm">
                            <p><span className="font-semibold">Feedback:</span> {analysisResult.feedback}</p>
                            <p><span className="font-semibold">Enhanced Description:</span> {analysisResult.enhancedDescription}</p>
                            <div className="flex flex-wrap gap-2">
                                {analysisResult.tags.map((tag: string) => (
                                    <span key={tag} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                            <div className="grid gap-1.5">
                                <Label htmlFor="price">Price (CAMP)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    step="0.001"
                                />
                            </div>
                            <div className="grid gap-1.5">
                                <Label htmlFor="royalty">Royalty (%)</Label>
                                <Input
                                    id="royalty"
                                    type="number"
                                    value={royalty}
                                    onChange={(e) => setRoyalty(e.target.value)}
                                    min="0"
                                    max="100"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleMint}
                            disabled={minting}
                            className="w-full bg-primary hover:bg-primary/90"
                        >
                            {minting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Minting IP-NFT...
                                </>
                            ) : (
                                "Mint IP-NFT"
                            )}
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
