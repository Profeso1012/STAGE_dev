import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lock, Unlock, Music, Image as ImageIcon, FileText } from "lucide-react";
import { MintedItem } from "@/lib/mock-db";

interface ContentCardProps {
    item: MintedItem;
    hasAccess: boolean;
    onBuy: (item: MintedItem) => void;
    buying?: boolean;
    isPremium?: boolean;
}

export function ContentCard({ item, hasAccess, onBuy, buying, isPremium = false }: ContentCardProps) {
    const Icon = item.fileType.startsWith("image") ? ImageIcon :
        item.fileType.startsWith("audio") ? Music : FileText;

    const basePrice = parseFloat(item.price);
    const discountedPrice = isPremium ? basePrice * 0.5 : basePrice;

    return (
        <Card className="overflow-hidden border-slate-700/50 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur hover:border-orange-500/30 transition-all hover:shadow-orange-500/10 hover:shadow-2xl group h-full flex flex-col">
            {/* Image/Content Preview */}
            <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                {item.fileType.startsWith("image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={hasAccess ? item.fileUrl : "/placeholder-blur.jpg"}
                        alt={item.title}
                        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
                            !hasAccess ? "blur-md" : ""
                        }`}
                    />
                ) : (
                    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-slate-800 to-slate-900">
                        <Icon className="w-16 h-16 text-slate-600/50 group-hover:text-orange-500/30 transition-colors" />
                    </div>
                )}

                {/* Lock Overlay */}
                {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm">
                        <div className="flex flex-col items-center gap-2">
                            <Lock className="w-8 h-8 text-white/90" />
                            <span className="text-xs text-white/80 font-semibold">Locked</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Content */}
            <CardHeader className="p-4 pb-3 flex-grow">
                <div className="flex justify-between items-start gap-3 mb-3">
                    <CardTitle className="text-base line-clamp-2 text-slate-100 group-hover:text-orange-400 transition-colors">
                        {item.title}
                    </CardTitle>
                </div>
                <p className="text-sm text-slate-400 line-clamp-2 min-h-10">
                    {item.description}
                </p>
            </CardHeader>

            <CardContent className="p-4 pt-2">
                <div className="flex flex-wrap gap-2 mb-4">
                    {item.tags.slice(0, 3).map(tag => (
                        <span
                            key={tag}
                            className="text-xs px-2 py-1 bg-orange-500/10 text-orange-400 rounded-full font-medium hover:bg-orange-500/20 transition-colors"
                        >
                            #{tag}
                        </span>
                    ))}
                    {item.tags.length > 3 && (
                        <span className="text-xs px-2 py-1 text-slate-500">+{item.tags.length - 3}</span>
                    )}
                </div>

                {/* Price */}
                <div className="mb-4">
                    {isPremium && !hasAccess ? (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500 line-through">
                                {basePrice.toFixed(3)} CAMP
                            </span>
                            <span className="text-sm font-bold bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">
                                {discountedPrice.toFixed(3)} CAMP
                            </span>
                            <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded font-semibold">50% OFF</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-mono bg-orange-500/20 text-orange-400 px-3 py-1 rounded-full font-bold">
                                {basePrice.toFixed(3)} CAMP
                            </span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-2">
                {hasAccess ? (
                    <Button
                        disabled
                        className="w-full gap-2 bg-green-500/20 text-green-400 hover:bg-green-500/30 border border-green-500/30"
                    >
                        <Unlock className="w-4 h-4" />
                        Access Granted
                    </Button>
                ) : (
                    <Button
                        onClick={() => onBuy(item)}
                        disabled={buying}
                        className="w-full gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    >
                        {buying ? (
                            <>
                                <span className="animate-spin">⏳</span>
                                Unlocking...
                            </>
                        ) : (
                            <>
                                <Lock className="w-4 h-4" />
                                Unlock for {discountedPrice.toFixed(3)} CAMP
                            </>
                        )}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
