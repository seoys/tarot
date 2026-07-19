import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TarotCardDisplayData } from "@/lib/tarot-data";

interface CardSelectionDialogProps {
    isConfirmationOpen: boolean;
    setIsConfirmationOpen: (open: boolean) => void;
    selectedCards: string[];
    shuffledCards: TarotCardDisplayData[];
    isLoading: boolean;
    isShuffling: boolean;
    onConfirmSelection: () => void;
}

export function CardSelectionDialog({
    isConfirmationOpen,
    setIsConfirmationOpen,
    selectedCards,
    shuffledCards,
    isLoading,
    isShuffling,
    onConfirmSelection,
}: CardSelectionDialogProps) {
    return (
        <div className="w-full relative z-50">
            {/* Show counter if 1 to 4 cards are selected, fixed to the bottom of the screen */}
            {selectedCards.length > 0 && selectedCards.length !== 3 && selectedCards.length !== 5 && (
                <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 z-[200] flex justify-center animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none px-3">
                    <div className="flex items-center gap-3 bg-background/85 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 shadow-[0_18px_40px_-30px_rgba(168,145,255,0.55)] pointer-events-auto">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm md:text-base font-medium text-foreground">
                            <span className="text-primary font-bold text-lg">{selectedCards.length}</span>장 선택됨
                        </span>
                    </div>
                </div>
            )}

            {/* Show the confirmation button when 3 or 5 cards are selected, fixed to the bottom */}
            {(selectedCards.length === 3 || selectedCards.length === 5) && (
                <div className="fixed bottom-6 sm:bottom-8 left-0 right-0 z-[200] flex justify-center px-3 sm:px-4 animate-in slide-in-from-bottom-4 fade-in duration-500 zoom-in-95 pointer-events-none flex-col items-center">
                    {selectedCards.length === 3 && (
                        <p className="text-xs text-muted-foreground/90 mb-3 animate-pulse pointer-events-auto">
                            2장 더 고르면 더 깊어집니다
                        </p>
                    )}
                    <div className="w-full max-w-md pointer-events-auto">
                        <AlertDialog
                            open={isConfirmationOpen}
                            onOpenChange={setIsConfirmationOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="w-full bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground text-lg py-6 rounded-2xl shadow-[0_18px_45px_-28px_rgba(168,145,255,0.5)] transition-all hover:scale-[1.01]"
                                    disabled={isLoading || isShuffling}
                                    onClick={() => setIsConfirmationOpen(true)}
                                >
                                    이 {selectedCards.length}장으로 읽기
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card/95 backdrop-blur-2xl border-white/10 z-[2000] shadow-[0_24px_60px_-30px_rgba(168,145,255,0.45)] max-w-sm rounded-[2rem] mx-auto px-4 sm:px-6 py-5 sm:py-6">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-serif text-center text-primary-foreground">
                                        선택 완료
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-muted-foreground leading-relaxed">
                                        {selectedCards.length}장을 골랐습니다.<br/>
                                        이제 읽겠습니다.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex justify-center gap-3 my-5 sm:my-6 flex-wrap">
                                    {selectedCards.map((name) => {
                                        const card = shuffledCards.find((c) => c.name === name);
                                        return card ? (
                                            <div
                                                key={name}
                                                className="flex flex-col items-center"
                                            >
                                                <div className="relative w-12 h-16 rounded-lg overflow-hidden border border-white/10 shadow-lg">
                                                    <Image
                                                        src={card.imageUrl}
                                                        alt={name}
                                                        fill
                                                        sizes="48px"
                                                        className={`object-cover ${card.isReversed ? "rotate-180" : ""}`}
                                                    />
                                                </div>
                                            </div>
                                        ) : null;
                                    })}
                                </div>
                                <AlertDialogFooter className="flex flex-col gap-2">
                                    <AlertDialogAction
                                        onClick={onConfirmSelection}
                                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_16px_32px_-20px_rgba(168,145,255,0.65)] text-lg py-5 rounded-2xl"
                                    >
                                        읽기
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                </div>
            )}
        </div>
    );
}
