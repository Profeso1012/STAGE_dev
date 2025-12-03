"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/search-bar";
import { ContentCard } from "@/components/content-card";
import { MintedItem } from "@/lib/mock-db";
import { useAuth, useModal, useAuthState } from "@campnetwork/origin/react";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DiscoveryPage() {
    const { origin, isAuthenticated, walletAddress } = useAuth();
    const authState = useAuthState();
    const modal = useModal();

    const [results, setResults] = useState<MintedItem[]>([]);
    const [searching, setSearching] = useState(false);
    const [buyingId, setBuyingId] = useState<string | null>(null);
    const [accessMap, setAccessMap] = useState<Record<string, boolean>>({});
    const [error, setError] = useState<string | null>(null);
    const [transactionHash, setTransactionHash] = useState<string | null>(null);
    const [isPremium, setIsPremium] = useState(false);

    // Check access and premium status
    useEffect(() => {
        const controller = new AbortController();

        const checkAccessAndPremium = async () => {
            if (!isAuthenticated || !walletAddress) return;

            // Check premium status
            try {
                const premiumRes = await fetch(`/api/premium/check-status/${walletAddress}`, {
                    signal: controller.signal
                });
                const premiumData = await premiumRes.json();
                if (!controller.signal.aborted) {
                    setIsPremium(premiumData.isPremium || false);
                }
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error("Failed to check premium status:", err);
                    setIsPremium(false);
                }
            }

            // Check access for items
            if (!origin || controller.signal.aborted) return;

            const newAccessMap: Record<string, boolean> = {};
            for (const item of results) {
                try {
                    const hasAccess = await origin.hasAccess(`0x${item.id}` as `0x${string}`, walletAddress);
                    if (!controller.signal.aborted) {
                        newAccessMap[item.id] = hasAccess;
                    }
                } catch (err) {
                    if (err instanceof Error && err.name !== 'AbortError') {
                        console.error(`Failed to check access for ${item.id}:`, err);
                        nAccessMap[item.id] = false;
                    }
                }
            }
            if (!controller.signal.aborted) {
                setAccessMap(newAccessMap);
            }
        };

        checkAccessAndPremium();

        return () => controller.abort();
    }, [results, isAuthenticated, origin, walletAddress]);

    const handleSearch = async (query: string) => {
        setSearching(true);
        setError(null);
        setResults([]);
        try {
            const res = await fetch("/api/ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            if (data.results) {
                setResults(data.results);
            } else if (data.error) {
                setError(data.error);
            }
        } catch (err) {
            console.error("Search failed:", err);
            setError("Failed to search. Please try again.");
        } finally {
            setSearching(false);
        }
    };

    const handleBuy = async (item: MintedItem) => {
        if (!isAuthenticated) {
            modal.openModal();
            return;
        }

        if (!origin || !walletAddress) {
            setError("Authentication failed. Please reconnect your wallet.");
            return;
        }

        setBuyingId(item.id);
        setError(null);
        setTransactionHash(null);

        try {
            // Check if already has access
            const hasAccess = await origin.hasAccess(BigInt(item.id), walletAddress);
            if (hasAccess) {
                setError("You already have access to this content.");
                setBuyingId(null);
                return;
            }

            // Buy Access
            const result = await origin.buyAccessSmart(BigInt(item.id));

            if (result) {
                setAccessMap(prev => ({ ...prev, [item.id]: true }));
                setTransactionHash(result.hash || "success");
            }

        } catch (err: any) {
            console.error("Buy access failed:", err);
            const errorMsg = err.message || err.reason || "Failed to buy access. Please try again.";
            setError(errorMsg);
        } finally {
            setBuyingId(null);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-background/50">
            <div className="container mx-auto max-w-screen-2xl py-10 px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-foreground mb-4">
                        Discover Content
                    </h1>
                    <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                        Find exactly what you're looking for with our AI-powered semantic search.
                        Browse by relevance, not just popularity.
                    </p>
                    <SearchBar onSearch={handleSearch} loading={searching} />
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                        <AlertCircle className="w-5 h-5 flex-shrink-0" />
                        <span>{error}</span>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Transaction Success */}
                {transactionHash && (
                    <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-3 text-green-400">
                        <span>✓ Purchase successful! Access granted.</span>
                        <button
                            onClick={() => setTransactionHash(null)}
                            className="ml-auto text-green-400 hover:text-green-300"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Results */}
                {searching ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                        <p className="text-muted-foreground">Searching the AI index...</p>
                    </div>
                ) : results.length > 0 ? (
                    <div>
                        <p className="text-muted-foreground mb-6">Found {results.length} item{results.length !== 1 ? 's' : ''}</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((item) => (
                                <ContentCard
                                    key={item.id}
                                    item={item}
                                    hasAccess={accessMap[item.id] || false}
                                    onBuy={handleBuy}
                                    buying={buyingId === item.id}
                                    isPremium={isPremium}
                                />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="mb-6 text-6xl">🔍</div>
                        <p className="text-xl text-foreground mb-4">No results yet</p>
                        <p className="text-muted-foreground mb-6">
                            {searching ? "Searching..." : "Try searching for something like 'afrobeats', 'abstract art', or 'blockchain'."}
                        </p>
                        {!isAuthenticated && (
                            <Button
                                onClick={() => modal.openModal()}
                                className="bg-primary hover:bg-primary/90"
                            >
                                Connect Wallet to Browse
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
