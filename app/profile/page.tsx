"use client";

import { useAuth, useConnect } from "@campnetwork/origin/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MintedItem } from "@/lib/mock-db";
import { useEffect, useState } from "react";
import { ContentCard } from "@/components/content-card";
import { Loader2, User, BarChart3, DollarSign, Eye } from "lucide-react";

export default function ProfilePage() {
    const { isAuthenticated, walletAddress } = useAuth();
    const { connect } = useConnect();

    const [myContent, setMyContent] = useState<MintedItem[]>([]);
    const [loading, setLoading] = useState(false);

    const [stats, setStats] = useState({
        totalViews: 0,
        totalRevenue: 0,
        totalSales: 0
    });

    useEffect(() => {
        if (!isAuthenticated || !walletAddress) return;

        const controller = new AbortController();
        let isMounted = true;

        const fetchMyContent = async () => {
            setLoading(true);
            try {
                // Fetch creator analytics from Subgraph
                const analyticsRes = await fetch(`/api/analytics/creator/${walletAddress}`, {
                    signal: controller.signal
                });
                const analyticsData = await analyticsRes.json();

                if (!isMounted || controller.signal.aborted) return;

                if (analyticsData.error) {
                    console.error('Analytics error:', analyticsData.error);
                    // Fall back to search if Subgraph fails
                    const res = await fetch(`/api/ai/search`, {
                        method: "POST",
                        body: JSON.stringify({ query: "" }),
                        signal: controller.signal
                    });
                    const data = await res.json();
                    if (isMounted && data.results && !controller.signal.aborted) {
                        const mine = data.results.filter((item: MintedItem) =>
                            item.owner.toLowerCase() === walletAddress?.toLowerCase()
                        );
                        setMyContent(mine);
                    }
                    // Use mock stats as fallback
                    if (isMounted && !controller.signal.aborted) {
                        setStats({
                            totalViews: 0,
                            totalRevenue: 0,
                            totalSales: 0
                        });
                    }
                } else {
                    // Use real on-chain analytics
                    if (isMounted && !controller.signal.aborted) {
                        setStats({
                            totalViews: analyticsData.estimatedViews || 0,
                            totalRevenue: parseFloat(analyticsData.totalRevenue) || 0,
                            totalSales: analyticsData.totalSales || 0
                        });
                    }

                    // Fetch content details from AI search
                    const res = await fetch(`/api/ai/search`, {
                        method: "POST",
                        body: JSON.stringify({ query: "" }),
                        signal: controller.signal
                    });
                    const data = await res.json();
                    if (isMounted && data.results && !controller.signal.aborted) {
                        const mine = data.results.filter((item: MintedItem) =>
                            item.owner.toLowerCase() === walletAddress?.toLowerCase()
                        );
                        setMyContent(mine);
                    }
                }
            } catch (error) {
                if (error instanceof Error && error.name !== 'AbortError') {
                    console.error("Failed to fetch profile content", error);
                }
            } finally {
                if (isMounted && !controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchMyContent();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [isAuthenticated, walletAddress]);

    if (!isAuthenticated) {
        return (
            <div className="container mx-auto max-w-screen-2xl py-20 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Creator Dashboard</h1>
                <p className="text-muted-foreground mb-8">Connect your wallet to view your content performance and analytics.</p>
                <Button onClick={() => connect()}>Connect Wallet</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-screen-2xl py-10 px-4 sm:px-6 lg:px-8 min-h-screen">
            <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold">Creator Dashboard</h1>
                    <p className="text-muted-foreground font-mono text-sm">{walletAddress}</p>
                </div>
            </div>

            {/* Analytics Cards - Data from Subgraph */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Estimated from on-chain sales</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRevenue.toFixed(6)} CAMP</div>
                        <p className="text-xs text-muted-foreground">From Subgraph (immutable)</p>
                    </CardContent>
                </Card>
                <Card className="glass-card">
                    <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Access Sales</CardTitle>
                        <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalSales}</div>
                        <p className="text-xs text-muted-foreground">On-chain purchases</p>
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mb-6">My Content</h2>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            ) : myContent.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myContent.map((item) => (
                        <ContentCard
                            key={item.id}
                            item={item}
                            hasAccess={true}
                            onBuy={() => { }}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">You haven&apos;t uploaded any content yet.</p>
                    <Button onClick={() => window.location.href = '/upload'}>Upload Content</Button>
                </div>
            )}
        </div>
    );
}
