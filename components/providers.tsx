"use client";

import { CampProvider, CampModal } from "@campnetwork/origin/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";

function CampProviderWrapper({ children }: { children: React.ReactNode }) {
    const [redirectUri, setRedirectUri] = useState("");
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        setRedirectUri(window.location.origin);
        setHasMounted(true);
    }, []);

    if (!hasMounted) {
        return children;
    }

    return (
        <CampProvider
            clientId={process.env.NEXT_PUBLIC_ORIGIN_CLIENT_ID || ""}
            environment="DEVELOPMENT"
            redirectUri={redirectUri || ""}
        >
            <CampModal injectButton={false} />
            {children}
        </CampProvider>
    );
}

export function Providers({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(() => new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
            <CampProviderWrapper>
                {children}
            </CampProviderWrapper>
        </QueryClientProvider>
    );
}
