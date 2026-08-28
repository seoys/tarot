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
            <div className="relative w-full max-w-4xl mx-auto h-[22rem] sm:h-72 mb-6 sm:mb-8 flex items-center justify-center">
                {shuffledCards.slice(0, 78).map((card, index) => {
                    const currentPosition = cardPositions[card.name] || {
                        x: 0,
                        y: 0,
                        rotate: 0,
                        scale: 1,
                    };
                    const selected = isCardSelected(card.name);
                    const disabled = isLoading || isShuffling;
                    return (
                        <button
                            key={card.name}
                            type="button"
                            onClick={() => toggleCardSelection(card.name)}
                            disabled={disabled}
                            aria-label={selected ? "선택한 카드 해제하기" : "카드 선택하기"}
                            aria-pressed={selected}
                            className={cn(
                                "absolute appearance-none bg-transparent border-0 p-0 m-0 cursor-pointer transition-all duration-700 will-change-transform focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:z-30",
                                selected
                                    ? "opacity-0 pointer-events-none scale-0"
                                    : "opacity-100 hover:z-20 hover:scale-[1.03] sm:hover:scale-105 shadow-lg",
                                disabled ? "pointer-events-none opacity-50" : ""
                            )}
                            style={{
                                transform: `perspective(1000px) translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${currentPosition.rotate}deg) rotateX(${currentPosition.rotateX || 0}deg) rotateY(${currentPosition.rotateY || 0}deg) scale(${selected ? 0 : currentPosition.scale})`,
                                zIndex: selected ? -1 : index,
                            }}
                        >
                            <Image
                                src={CARD_BACK_IMAGE}
                                alt="타로 카드 뒷면"
                                className={cn(
                                    "rounded-lg object-cover w-12 sm:w-16 h-auto border border-white/10 shadow-[0_8px_24px_-12px_rgba(168,145,255,0.45)]"
                                )}
                                width={64}
                                height={96}
                                priority={index < 10}
                                data-ai-hint="tarot card"
                            />
                        </button>
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
