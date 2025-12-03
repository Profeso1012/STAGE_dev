"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { useAuth, useConnect } from "@campnetwork/origin/react";
import { useState } from "react";

export default function PremiumPage() {
    const { isAuthenticated } = useAuth();
    const { connect } = useConnect();
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async () => {
        if (!isAuthenticated) {
            connect();
            return;
        }
        setLoading(true);
        // Mock subscription process
        await new Promise(resolve => setTimeout(resolve, 2000));
        alert("Successfully subscribed to Premium!");
        setLoading(false);
    };

    return (
        <div className="container py-20 px-4 min-h-screen flex flex-col items-center">
            <div className="text-center mb-16 max-w-2xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-400">
                    Upgrade to STAGE Premium
                </h1>
                <p className="text-xl text-muted-foreground">
                    Unlock advanced AI tools, lower fees, and get exclusive access to rising talent before anyone else.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
                {/* Free Plan */}
                <Card className="glass-card border-white/10 relative overflow-hidden">
                    <CardHeader>
                        <CardTitle className="text-2xl">Free</CardTitle>
                        <CardDescription>For casual listeners and new creators.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">0 CAMP</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Basic Semantic Search</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Upload 3 items/month</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-green-500" />
                                <span>Standard Discovery</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button variant="outline" className="w-full" disabled>Current Plan</Button>
                    </CardFooter>
                </Card>

                {/* Premium Plan */}
                <Card className="glass-card border-primary/50 relative overflow-hidden transform md:-translate-y-4 transition-all hover:scale-105 duration-300">
                    <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                        POPULAR
                    </div>
                    <CardHeader>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-6 h-6 text-primary" />
                            <CardTitle className="text-2xl">Pro Creator</CardTitle>
                        </div>
                        <CardDescription>For serious artists and talent scouts.</CardDescription>
                        <div className="mt-4">
                            <span className="text-4xl font-bold">10 CAMP</span>
                            <span className="text-muted-foreground">/month</span>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Advanced AI Analytics</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Unlimited Uploads</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>Priority in Discovery</span>
                            </li>
                            <li className="flex items-center gap-2">
                                <Check className="w-5 h-5 text-primary" />
                                <span>0% Platform Fees</span>
                            </li>
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button
                            className="w-full bg-primary hover:bg-primary/90 text-lg h-12"
                            onClick={handleSubscribe}
                            disabled={loading}
                        >
                            {loading ? "Processing..." : "Upgrade Now"}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
