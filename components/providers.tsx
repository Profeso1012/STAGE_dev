"use client";

import { CampProvider } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <CampProvider
                clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID!}
                environment="DEVELOPMENT" // Hardcoded to DEVELOPMENT for Testnet as per instructions
                redirectUri={typeof window !== "undefined" ? window.location.origin : ""}
            >
                {children}
            </CampProvider>
        </QueryClientProvider>
    );
}
