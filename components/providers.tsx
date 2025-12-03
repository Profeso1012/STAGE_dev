"use client";

import { CampProvider, CampModal } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());
    const [redirectUri, setRedirectUri] = useState(() => {
        if (typeof window !== "undefined") {
            return window.location.origin;
        }
        return "";
    });

    useEffect(() => {
        setRedirectUri(window.location.origin);
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <CampProvider
                clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || ""}
                environment="DEVELOPMENT"
                redirectUri={redirectUri || ""}
            >
                <CampModal injectButton={false} />
                {children}
            </CampProvider>
        </QueryClientProvider>
    );
}
