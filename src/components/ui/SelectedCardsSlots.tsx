import React from "react";
import Image from "next/image";
import { TarotCardDisplayData } from "@/lib/tarot-data";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

interface SelectedCardsSlotsProps {
    selectedCards: string[];
    shuffledCards: TarotCardDisplayData[];
    onUnselectCard: (cardName: string) => void;
}

export function SelectedCardsSlots({
    selectedCards,
    shuffledCards,
    onUnselectCard,
}: SelectedCardsSlotsProps) {
    const slots = [0, 1, 2, 3, 4];

    return (
        <div className="w-full max-w-2xl mx-auto mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex justify-center items-center gap-3 sm:gap-4 flex-wrap">
                {slots.map((index) => {
                    const cardName = selectedCards[index];
                    const card = cardName ? shuffledCards.find((c) => c.name === cardName) : null;

                    return (
                        <div
                            key={index}
                            className={cn(
                                "relative w-16 h-24 sm:w-20 sm:h-30 rounded-[1.1rem] border transition-all duration-500 overflow-hidden group",
                                card
                                    ? "border-white/15 bg-white/[0.04] shadow-[0_16px_40px_-28px_rgba(168,145,255,0.55)] scale-100"
                                    : "border-dashed border-white/10 bg-white/[0.02] scale-95 opacity-60"
                            )}
                        >
                            {card ? (
                                <>
                                    <div className="relative w-full h-full animate-in zoom-in-95 duration-300">
                                        <Image
                                            src={card.imageUrl}
                                            alt={card.name}
                                            fill
                                            sizes="(max-width: 640px) 64px, 80px"
                                            className={cn(
                                                "object-cover",
                                                card.isReversed ? "rotate-180" : ""
                                            )}
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/10 pointer-events-none" />

                                        {/* Remove button */}
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onUnselectCard(card.name);
                                            }}
                                            className="absolute -top-1 -right-1 sm:top-1 sm:right-1 bg-background/90 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg z-10 border border-white/10"
                                            aria-label="카드 제거"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-2xl font-serif text-muted-foreground/25">{index + 1}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {selectedCards.length > 0 && selectedCards.length < 3 && (
                <p className="text-center text-xs text-muted-foreground mt-4 animate-pulse">
                    최소 3장의 패가 필요합니다
                </p>
            )}
        </div>
    );
}
