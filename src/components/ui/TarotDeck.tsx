import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { TarotCardDisplayData, CARD_BACK_IMAGE, CardPosition } from "@/lib/tarot-data";

interface TarotDeckProps {
    shuffledCards: TarotCardDisplayData[];
    cardPositions: Record<string, CardPosition>;
    selectedCards: string[];
    isShuffling: boolean;
    isLoading: boolean;
    toggleCardSelection: (cardName: string) => void;
    isCardSelected: (cardName: string) => boolean;
}

export const TarotDeck = React.memo(
    ({
        shuffledCards,
        cardPositions,
        selectedCards,
        isShuffling,
        isLoading,
        toggleCardSelection,
        isCardSelected,
    }: TarotDeckProps) => {
        return (
            <div className="relative w-full max-w-4xl h-96 mb-8 flex items-center justify-center">
                {shuffledCards.slice(0, 78).map((card, index) => {
                    const currentPosition = cardPositions[card.name] || {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                    };
                    const selected = isCardSelected(card.name);
                    return (
                        <div
                            key={card.name}
                            onClick={() => toggleCardSelection(card.name)}
                            className={cn(
                                "absolute cursor-pointer hover:z-20 hover:scale-110",
                                selected
                                    ? "ring-4 ring-primary ring-offset-2 ring-offset-background rounded-lg z-10 scale-105"
                                    : "shadow-lg",
                                isLoading || isShuffling ? "pointer-events-none opacity-70" : "opacity-100"
                            )}
                            style={{
                                transform: `perspective(1000px) translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${currentPosition.rotate}deg) rotateX(${currentPosition.rotateX || 0}deg) rotateY(${currentPosition.rotateY || 0}deg) scale(${currentPosition.scale})`,
                                zIndex: selected ? 999 : index,
                                transition: `transform ${isShuffling
                                    ? "0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" // Bouncy spring effect for mystical shuffle
                                    : "0.8s cubic-bezier(0.25, 0.1, 0.25, 1)"
                                    }, opacity 0.5s ease-out, z-index 0.3s, box-shadow 0.3s, ring 0.3s`,
                            }}
                        >
                            <Image
                                src={selected ? card.imageUrl : CARD_BACK_IMAGE}
                                alt={card.name}
                                className={cn(
                                    "rounded-md object-cover w-16 h-auto border border-black/30",
                                    card.isReversed && selected ? "rotate-180" : ""
                                )}
                                width={64}
                                height={96}
                                priority={index < 10}
                                data-ai-hint="tarot card"
                            />
                            {selected && (
                                <div className="absolute inset-0 bg-primary/20 rounded-md pointer-events-none"></div>
                            )}
                        </div>
                    );
                })}
            </div>
        );
    },
    (prevProps, nextProps) => {
        // Only re-render if these props change. Note that we don't include `question` here!
        return (
            prevProps.isShuffling === nextProps.isShuffling &&
            prevProps.isLoading === nextProps.isLoading &&
            prevProps.shuffledCards === nextProps.shuffledCards && // Assuming shallow equal is fine because it's a new array on shuffle
            prevProps.cardPositions === nextProps.cardPositions && // Assuming new object on resize/shuffle completion
            prevProps.selectedCards.length === nextProps.selectedCards.length &&
            prevProps.selectedCards.every((item, i) => item === nextProps.selectedCards[i])
        );
    }
);

TarotDeck.displayName = "TarotDeck";
