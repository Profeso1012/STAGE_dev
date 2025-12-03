"use client";

import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [redirectUri, setRedirectUri] = useState(
        typeof window !== "undefined" ? window.location.origin : ""
    );

    // Update redirectUri after mount to ensure it's correct
    useEffect(() => {
        setRedirectUri(window.location.origin);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <CampProvider
                clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID!}
                environment="DEVELOPMENT"
                redirectUri={redirectUri}
            >
                {children}
            </CampProvider>
        </QueryClientProvider>
    );
}
