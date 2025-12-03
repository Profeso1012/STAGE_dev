"use client";

import { CampModal, useAuthState, useConnect } from "@campnetwork/origin/react";
import { Button } from "./ui/button";
import { Wallet } from "lucide-react";

export function AuthButton() {
    const { authenticated, loading } = useAuthState();
    const { disconnect } = useConnect();

    return (
        <>
            <CampModal injectButton={false} />
            {authenticated ? (
                <div className="flex items-center gap-4">
                    {/* CampModal handles the "My Origin" view when authenticated if we use its button, 
               but here we want a custom button or just the CampModal's default behavior?
               The docs say: "If the user is already authenticated, the button will instead say 'My Origin'"
               So if we use CampModal with injectButton={true}, it handles it.
               But we want to style it.
               Let's use CampButton if we want to trigger it, or just use CampModal's default button if it looks okay, 
               but we want "Premium" style.
               Actually, CampModal with injectButton={false} allows programmatic control via useModal, 
               BUT the docs say "CampButton component allows you to render a button that opens the Auth or My Origin modal".
           */}
                    {/* We will use a custom button that triggers the modal via useModal if needed, 
               or just let CampModal inject the button if we can style it? 
               No, let's use the CampButton component from the SDK if available, or build our own wrapper.
               The docs say: "import { CampButton } from '@campnetwork/origin/react'".
           */}
                    {/* Wait, I don't have CampButton in the imports above. Let me check if I can import it. */}
                    {/* If not, I'll use useModal. */}
                    <CampButtonCustom />
                </div>
            ) : (
                <CampButtonCustom />
            )}
        </>
    );
}

import { useModal } from "@campnetwork/origin/react";

function CampButtonCustom() {
    const { openModal } = useModal();
    const { authenticated, loading } = useAuthState();

    return (
        <Button
            onClick={openModal}
            variant="glass"
            disabled={loading}
            className="gap-2"
        >
            <Wallet className="w-4 h-4" />
            {loading ? "Connecting..." : authenticated ? "My Origin" : "Connect Wallet"}
        </Button>
    );
}
