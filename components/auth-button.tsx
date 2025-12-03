"use client";

import { useAuthState, useModal } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

export function AuthButton() {
    const authState = useAuthState();
    const modal = useModal();

    return (
        <Button
            onClick={() => modal.openModal()}
            variant="glass"
            disabled={authState.loading}
            className="gap-2"
        >
            <Wallet className="w-4 h-4" />
            {authState.loading ? "Connecting..." : authState.authenticated ? "My Origin" : "Connect Wallet"}
        </Button>
    );
}
