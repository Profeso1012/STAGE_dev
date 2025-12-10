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
import { isFileSupported, getFileCategory, getSupportedFileTypes } from "@/lib/file-validation";
import { UnsupportedFileModal } from "@/components/unsupported-file-modal";

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
    const [unsupportedFile, setUnsupportedFile] = useState<{ name: string; type: any } | null>(null);

    // License Terms State
    const [price, setPrice] = useState("0.001"); // in CAMP (ETH)
    const [royalty, setRoyalty] = useState("5"); // percentage

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            console.log("[UPLOAD] File selection started");
            console.log("[UPLOAD] File name:", selectedFile.name);
            console.log("[UPLOAD] File type:", selectedFile.type);
            console.log("[UPLOAD] File size:", (selectedFile.size / 1024 / 1024).toFixed(2), "MB");

            const maxSizeInMB = 100;
            const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

            // Validate file size
            if (selectedFile.size > maxSizeInBytes) {
                const errorMsg = `File size must be less than ${maxSizeInMB}MB. Your file is ${(selectedFile.size / 1024 / 1024).toFixed(2)}MB.`;
                console.error("[UPLOAD] File size validation failed:", errorMsg);
                setError(errorMsg);
                setFile(null);
                return;
            }
            console.log("[UPLOAD] File size validation passed");

            // Validate file type
            if (!isFileSupported(selectedFile)) {
                const fileType = getFileCategory(selectedFile);
                console.warn("[UPLOAD] Unsupported file type detected:", fileType);
                console.log("[UPLOAD] Showing unsupported file modal");
                setUnsupportedFile({ name: selectedFile.name, type: fileType });
                setFile(null);
                setError(null);
                return;
            }
            console.log("[UPLOAD] File type validation passed");

            console.log("[UPLOAD] File accepted and set for analysis");
            setFile(selectedFile);
            setAnalysisResult(null);
            setError(null);
            setUnsupportedFile(null);
        }
    };

    const handleAnalyze = async () => {
        console.log("[AI ANALYSIS] Starting analysis process");

        if (!file || !title || !description) {
            const errorMsg = "Please select a file and provide title/description.";
            console.error("[AI ANALYSIS] Missing required fields:", { hasFile: !!file, hasTitle: !!title, hasDescription: !!description });
            setError(errorMsg);
            return;
        }

        console.log("[AI ANALYSIS] All required fields present");
        console.log("[AI ANALYSIS] File:", file.name);
        console.log("[AI ANALYSIS] Title:", title);
        console.log("[AI ANALYSIS] Description:", description);

        setAnalyzing(true);
        setError(null);

        try {
            console.log("[AI ANALYSIS] Creating FormData for API request");
            // Create FormData to send the actual file
            const formData = new FormData();
            formData.append('file', file);
            formData.append('title', title);
            formData.append('userDescription', description);
            console.log("[AI ANALYSIS] FormData created successfully");

            console.log("[AI ANALYSIS] Sending request to /api/ai/analyze");
            const startTime = performance.now();
            const res = await fetch("/api/ai/analyze", {
                method: "POST",
                body: formData, // Send as multipart/form-data
            });
            const endTime = performance.now();
            console.log(`[AI ANALYSIS] API response received in ${(endTime - startTime).toFixed(2)}ms`);
            console.log("[AI ANALYSIS] Response status:", res.status);

            const data = await res.json();
            console.log("[AI ANALYSIS] Response data:", data);
            console.log("[AI ANALYSIS] Response details:", data.details);

            if (data.error) {
                const errorMsg = data.error;
                console.error("[AI ANALYSIS] API returned error:", errorMsg);
                if (data.details) {
                    console.error("[AI ANALYSIS] Error details:", data.details);
                }
                throw new Error(errorMsg);
            }

            console.log("[AI ANALYSIS] Analysis result received successfully");
            console.log("[AI ANALYSIS] Enhanced description:", data.enhancedDescription);
            console.log("[AI ANALYSIS] Tags:", data.tags);
            console.log("[AI ANALYSIS] Confidence score:", data.confidenceScore);
            console.log("[AI ANALYSIS] Content vector length:", data.contentVector?.length);

            setAnalysisResult(data);
            console.log("[AI ANALYSIS] Analysis result set in state");
        } catch (err: any) {
            const errorMsg = err.message || "Analysis failed";
            console.error("[AI ANALYSIS] Error during analysis:", errorMsg);
            console.error("[AI ANALYSIS] Full error:", err);
            setError(errorMsg);
        } finally {
            setAnalyzing(false);
            console.log("[AI ANALYSIS] Analysis process completed (finally block)");
        }
    };

    const handleMint = async () => {
        console.log("[MINTING] Starting mint process");

        if (!isAuthenticated || !origin) {
            const errorMsg = "Please connect your wallet first.";
            console.error("[MINTING] Wallet not connected:", { isAuthenticated, hasOrigin: !!origin });
            setError(errorMsg);
            return;
        }
        console.log("[MINTING] Wallet authenticated, walletAddress:", walletAddress);

        if (!file || !analysisResult) {
            const errorMsg = "Please analyze content before minting.";
            console.error("[MINTING] Missing file or analysis result:", { hasFile: !!file, hasAnalysisResult: !!analysisResult });
            setError(errorMsg);
            return;
        }
        console.log("[MINTING] File and analysis result present");

        // Validate inputs
        const priceNum = parseFloat(price);
        const royaltyNum = parseFloat(royalty);
        console.log("[MINTING] Input values - Price:", priceNum, "Royalty:", royaltyNum);

        if (isNaN(priceNum) || priceNum < 0.001) {
            const errorMsg = "Price must be at least 0.001 CAMP.";
            console.error("[MINTING] Price validation failed:", priceNum);
            setError(errorMsg);
            return;
        }

        if (isNaN(royaltyNum) || royaltyNum < 0 || royaltyNum > 100) {
            const errorMsg = "Royalty must be between 0% and 100%.";
            console.error("[MINTING] Royalty validation failed:", royaltyNum);
            setError(errorMsg);
            return;
        }
        console.log("[MINTING] Input validation passed");

        setMinting(true);
        setError(null);

        try {
            console.log("[MINTING] Step 1: Creating License Terms");
            // 1. Create License Terms
            // Price in wei (1 CAMP = 10^18 wei)
            // For simplicity, assuming input is in CAMP
            const priceWei = BigInt(Math.floor(priceNum * 1e18));
            // Royalty in bps (1% = 100 bps)
            const royaltyBps = Math.floor(royaltyNum * 100);
            console.log("[MINTING] Price in wei:", priceWei.toString());
            console.log("[MINTING] Royalty in bps:", royaltyBps);

            const license = createLicenseTerms(
                priceWei,
                86400 * 30, // 30 days duration
                royaltyBps,
                zeroAddress // Native currency
            );
            console.log("[MINTING] License terms created successfully");

            console.log("[MINTING] Step 2: Preparing metadata");
            // 2. Prepare Metadata
            const metadata = {
                name: title,
                description: analysisResult.enhancedDescription, // Use AI enhanced description
                attributes: [
                    { trait_type: "Original Description", value: description },
                    ...analysisResult.tags.map((tag: string) => ({ trait_type: "Tag", value: tag })),
                ],
            };
            console.log("[MINTING] Metadata prepared:", metadata);

            console.log("[MINTING] Step 3: Minting file to blockchain");
            console.log("[MINTING] Calling origin.mintFile with file:", file.name);
            const startMintTime = performance.now();
            // 3. Mint File
            // The Origin SDK mintFile uploads the file to IPFS/Arweave via their service.
            const tokenId = await origin.mintFile(file, metadata, license);
            const endMintTime = performance.now();
            console.log(`[MINTING] mintFile completed in ${(endMintTime - startMintTime).toFixed(2)}ms`);

            if (!tokenId) {
                console.error("[MINTING] mintFile returned no Token ID");
                throw new Error("Minting returned no Token ID");
            }
            console.log("[MINTING] Token ID received:", tokenId);

            console.log("[MINTING] Step 4: Indexing minted item");
            const indexPayload = {
                id: tokenId,
                title: title,
                description: analysisResult.enhancedDescription,
                tags: analysisResult.tags,
                fileType: file.type,
                fileUrl: `https://ipfs.io/ipfs/...`,
                owner: walletAddress,
                price: price,
                vector: analysisResult.contentVector,
            };
            console.log("[MINTING] Index payload prepared:", indexPayload);

            // 4. Index the minted item in our AI Service (Mock DB)
            console.log("[MINTING] Sending index request to /api/ai/index");
            const startIndexTime = performance.now();
            const indexRes = await fetch("/api/ai/index", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(indexPayload),
            });
            const endIndexTime = performance.now();
            console.log(`[MINTING] Index request completed in ${(endIndexTime - startIndexTime).toFixed(2)}ms`);
            console.log("[MINTING] Index response status:", indexRes.status);

            const indexData = await indexRes.json();
            console.log("[MINTING] Index response data:", indexData);

            const successMsg = `Successfully minted IP-NFT! Token ID: ${tokenId}`;
            console.log("[MINTING] SUCCESS:", successMsg);
            setSuccess(successMsg);

            console.log("[MINTING] Resetting form state");
            setFile(null);
            setTitle("");
            setDescription("");
            setAnalysisResult(null);

            console.log("[MINTING] Redirecting to /discovery in 2 seconds");
            // Redirect to profile or discovery after short delay
            setTimeout(() => {
                console.log("[MINTING] Redirecting now");
                router.push("/discovery");
            }, 2000);

        } catch (err: any) {
            const errorMsg = err.message || "Minting failed";
            console.error("[MINTING] ERROR during minting:", errorMsg);
            console.error("[MINTING] Full error object:", err);
            setError(errorMsg);
        } finally {
            setMinting(false);
            console.log("[MINTING] Minting process completed (finally block)");
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
        <>
            <UnsupportedFileModal
                isOpen={unsupportedFile !== null}
                fileName={unsupportedFile?.name || ""}
                fileType={unsupportedFile?.type || "unknown"}
                onClose={() => setUnsupportedFile(null)}
            />
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
                        <div className="flex justify-center">
                            <Button
                                onClick={handleAnalyze}
                                disabled={analyzing || !file || !title || !description}
                                className="w-auto px-8"
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
                        </div>
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

                            <div className="flex justify-center pt-4">
                                <Button
                                    onClick={handleMint}
                                    disabled={minting}
                                    className="w-auto px-8 bg-primary hover:bg-primary/90"
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
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
