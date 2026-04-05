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
                <div className="fixed bottom-8 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-4 fade-in duration-300 pointer-events-none">
                    <div className="flex items-center gap-3 bg-background/90 backdrop-blur-md border border-primary/30 rounded-full px-6 py-3 shadow-[0_0_20px_-5px_rgba(139,92,246,0.5)] pointer-events-auto">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-sm md:text-base font-medium text-foreground tracking-wide">
                            <span className="text-primary font-bold text-lg">{selectedCards.length}</span>장의 패가 선택되었습니다
                        </span>
                    </div>
                </div>
            )}

            {/* Show the confirmation button when 3 or 5 cards are selected, fixed to the bottom */}
            {(selectedCards.length === 3 || selectedCards.length === 5) && (
                <div className="fixed bottom-8 left-0 right-0 flex justify-center px-4 animate-in slide-in-from-bottom-4 fade-in duration-500 zoom-in-95 pointer-events-none flex-col items-center">
                    {selectedCards.length === 3 && (
                        <p className="text-xs text-muted-foreground/80 mb-3 animate-pulse pointer-events-auto">
                            더 깊이 들어가시겠습니까? 2장이 더 남아 있습니다
                        </p>
                    )}
                    <div className="w-full max-w-md pointer-events-auto">
                        <AlertDialog
                            open={isConfirmationOpen}
                            onOpenChange={setIsConfirmationOpen}
                        >
                            <AlertDialogTrigger asChild>
                                <Button
                                    className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground text-lg py-6 rounded-2xl shadow-[0_0_30px_-5px_var(--primary)] transition-all hover:scale-[1.02]"
                                    disabled={isLoading || isShuffling}
                                    onClick={() => setIsConfirmationOpen(true)}
                                >
                                    이 {selectedCards.length}장의 패로 운명을 읽겠습니다
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-card/95 backdrop-blur-xl border-primary/20 z-[2000] shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)] max-w-sm rounded-2xl mx-auto">
                                <AlertDialogHeader>
                                    <AlertDialogTitle className="text-2xl font-serif text-center text-primary-foreground">
                                        패가 정해졌습니다
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-center text-muted-foreground">
                                        {selectedCards.length}장의 패를 선택하셨습니다.<br/>
                                        이제 당신의 운명을 들여다보겠습니다.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className="flex justify-center gap-3 my-6 flex-wrap">
                                    {selectedCards.map((name) => {
                                        const card = shuffledCards.find((c) => c.name === name);
                                        return card ? (
                                            <div
                                                key={name}
                                                className="flex flex-col items-center"
                                            >
                                                <div className="relative w-12 h-16 rounded-md overflow-hidden border border-white/10 shadow-lg">
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
                                        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_15px_-3px_var(--primary)] text-lg py-5 rounded-xl"
                                    >
                                        운명을 마주하다
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
