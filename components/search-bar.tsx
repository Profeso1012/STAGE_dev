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
        <form onSubmit={handleSubmit} className="flex w-full max-w-3xl mx-auto gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for content (e.g. 'afrobeats', 'abstract art')..."
                    className="pl-12 h-13 text-base bg-slate-800/50 border-slate-700/50 text-slate-100 placeholder:text-slate-500 focus-visible:ring-orange-500/50 focus-visible:border-orange-500/50 backdrop-blur-sm transition-all"
                />
            </div>
            <Button
                type="submit"
                size="lg"
                className="h-13 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
                disabled={loading}
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Search"}
            </Button>
        </form>
    );
}
