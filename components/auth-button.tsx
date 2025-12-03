"use client";

import { useAuthState, useModal } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthButton() {
    const [mounted, setMounted] = useState(false);
    const [hasError, setHasError] = useState(false);

    let authState: any = { loading: false, authenticated: false };
    let modal: any = { openModal: () => {} };

    try {
        authState = useAuthState();
        modal = useModal();
    } catch (err) {
        setHasError(true);
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <Button
            onClick={() => modal.openModal?.()}
            variant="glass"
            disabled={authState.loading}
            className="gap-2"
        >
            <Wallet className="w-4 h-4" />
            {authState.loading ? "Connecting..." : authState.authenticated ? "My Origin" : "Connect Wallet"}
        </Button>
    );
}
