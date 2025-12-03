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
        <Card className="overflow-hidden glass-card hover:border-primary/50 transition-colors">
            <div className="aspect-video bg-muted relative flex items-center justify-center">
                {item.fileType.startsWith("image") ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={hasAccess ? item.fileUrl : "/placeholder-blur.jpg"}
                        alt={item.title}
                        className={`w-full h-full object-cover ${!hasAccess ? "blur-md" : ""}`}
                    />
                ) : (
                    <Icon className="w-16 h-16 text-muted-foreground/50" />
                )}

                {!hasAccess && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
                        <Lock className="w-8 h-8 text-white/80" />
                    </div>
                )}
            </div>

            <CardHeader className="p-4">
                <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-1">{item.title}</CardTitle>
                    <div className="flex flex-col items-end gap-1">
                        {isPremium && !hasAccess ? (
                            <>
                                <span className="text-[10px] text-muted-foreground line-through">
                                    {basePrice.toFixed(3)} CAMP
                                </span>
                                <span className="text-xs font-mono bg-green-500/20 text-green-500 px-2 py-1 rounded">
                                    {discountedPrice.toFixed(3)} CAMP
                                </span>
                            </>
                        ) : (
                            <span className="text-xs font-mono bg-primary/10 text-primary px-2 py-1 rounded">
                                {basePrice.toFixed(3)} CAMP
                            </span>
                        )}
                    </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 h-10">
                    {item.description}
                </p>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-1">
                    {item.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 bg-secondary rounded-full text-secondary-foreground">
                            #{tag}
                        </span>
                    ))}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                {hasAccess ? (
                    <Button variant="secondary" className="w-full gap-2 text-green-500 bg-green-500/10 hover:bg-green-500/20">
                        <Unlock className="w-4 h-4" />
                        Access Content
                    </Button>
                ) : (
                    <Button onClick={() => onBuy(item)} disabled={buying} className="w-full gap-2">
                        {buying ? "Unlocking..." : `Unlock for ${discountedPrice.toFixed(3)} CAMP`}
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
