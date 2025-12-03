"use client";

import { CampProvider, CampModal } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [redirectUri, setRedirectUri] = useState("");
    const [mounted, setMounted] = useState(false);

    // Set redirectUri and mark as mounted only on client side
    useEffect(() => {
        setRedirectUri(window.location.origin);
        setMounted(true);
    }, []);

    // Don't render children until hydration is complete
    if (!mounted) {
        return null;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <CampProvider
                clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || ""}
                environment="DEVELOPMENT"
                redirectUri={redirectUri || window.location.origin}
            >
                <CampModal injectButton={false} />
                {children}
            </CampProvider>
        </QueryClientProvider>
    );
}
