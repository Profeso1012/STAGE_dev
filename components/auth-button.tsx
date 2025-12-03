"use client";

import { CampModal, useAuthState, useModal } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

export function AuthButton() {
    const { authenticated, loading } = useAuthState();
    const { openModal } = useModal();

    return (
        <>
            <CampModal injectButton={false} />
            <Button
                onClick={openModal}
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
