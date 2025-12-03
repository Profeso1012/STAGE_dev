"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    loading?: boolean;
}

export function SearchBar({ onSearch, loading }: SearchBarProps) {
    const [query, setQuery] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex w-full max-w-2xl mx-auto gap-2">
            <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for content (e.g. 'afrobeats for workout')..."
                    className="pl-10 h-12 text-lg bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:ring-primary/50"
                />
            </div>
            <Button type="submit" size="lg" className="h-12 px-8" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </Button>
        </form>
    );
}
