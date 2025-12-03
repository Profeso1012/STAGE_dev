"use client";

import { useState } from "react";
import { SearchBar } from "@/components/search-bar";
import { ContentCard } from "@/components/content-card";
import { MintedItem } from "@/lib/mock-db";
import { useAuth, useConnect } from "@campnetwork/origin/react";
import { Loader2 } from "lucide-react";

export default function DiscoveryPage() {
    const { origin, isAuthenticated, walletAddress } = useAuth();
    const { connect } = useConnect();

    const [results, setResults] = useState<MintedItem[]>([]);
    const [searching, setSearching] = useState(false);
    const [buyingId, setBuyingId] = useState<string | null>(null);
    // Mock state for access (in real app, we check origin.hasAccess)
    const [accessMap, setAccessMap] = useState<Record<string, boolean>>({});

    const handleSearch = async (query: string) => {
        setSearching(true);
        try {
            const res = await fetch("/api/ai/search", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ query }),
            });
            const data = await res.json();
            if (data.results) {
                setResults(data.results);
            }
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setSearching(false);
        }
    };

    const handleBuy = async (item: MintedItem) => {
        if (!isAuthenticated || !origin) {
            connect();
            return;
        }

        setBuyingId(item.id);
        try {
            // 1. Check if already has access (real app)
            // const hasAccess = await origin.hasAccess(BigInt(item.id), walletAddress);
            // if (hasAccess) ...

            // 2. Buy Access
            // await origin.buyAccessSmart(BigInt(item.id));

            // Mock delay
            await new Promise(r => setTimeout(r, 2000));

            setAccessMap(prev => ({ ...prev, [item.id]: true }));

        } catch (error) {
            console.error("Buy access failed:", error);
            alert("Failed to buy access. See console.");
        } finally {
            setBuyingId(null);
        }
    };

    return (
        <div className="container py-10 px-4 min-h-screen">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Discover Content</h1>
                <p className="text-muted-foreground mb-8">
                    Find exactly what you need with our AI-powered semantic search.
                </p>
                <SearchBar onSearch={handleSearch} loading={searching} />
            </div>

            {searching ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                </div>
            ) : results.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.map((item) => (
                        <ContentCard
                            key={item.id}
                            item={item}
                            hasAccess={!!accessMap[item.id]}
                            onBuy={handleBuy}
                            buying={buyingId === item.id}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 text-muted-foreground">
                    {results.length === 0 && !searching ? "Search for something to see results." : "No results found."}
                </div>
            )}
        </div>
    );
}
