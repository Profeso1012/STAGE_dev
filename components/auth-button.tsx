"use client";

import { CampModal, useAuthState, useModal } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";
import { useState, useEffect } from "react";

export function AuthButton() {
    const [mounted, setMounted] = useState(false);
    const authState = useAuthState();
    const modal = useModal();

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <CampModal injectButton={false} />
            <Button
                onClick={() => modal.openModal()}
                variant="glass"
                disabled={authState.loading}
                className="gap-2"
            >
                <Wallet className="w-4 h-4" />
                {authState.loading ? "Connecting..." : authState.authenticated ? "My Origin" : "Connect Wallet"}
            </Button>
        </>
    );
}
