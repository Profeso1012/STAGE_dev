"use client";

import { CampModal, useAuthState, useModal } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthButton() {
    const [mounted, setMounted] = useState(false);
    
    // Safely access hooks only after mount
    let authenticated = false;
    let loading = false;
    let openModal: (() => void) | null = null;

    try {
        const authState = useAuthState();
        const modal = useModal();
        authenticated = authState.authenticated;
        loading = authState.loading;
        openModal = modal.openModal;
    } catch (err) {
        // Provider not yet ready; will render null
        console.warn("Auth provider not ready yet");
    }

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return null;
    }

    return (
        <>
            <CampModal injectButton={false} />
            <Button
                onClick={() => openModal?.()}
                variant="glass"
                disabled={loading}
                className="gap-2"
            >
                <Wallet className="w-4 h-4" />
                {loading ? "Connecting..." : authenticated ? "My Origin" : "Connect Wallet"}
            </Button>
        </>
    );
}

