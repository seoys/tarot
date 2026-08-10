import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { TarotCardDisplayData } from "@/lib/tarot-data";

interface PreviewCardDialogProps {
    card: TarotCardDisplayData | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PreviewCardDialog({
    card,
    isOpen,
    onOpenChange,
}: PreviewCardDialogProps) {
    if (!card) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-sm border-white/10 bg-card/96 backdrop-blur-2xl text-foreground shadow-[0_24px_60px_-30px_rgba(168,145,255,0.45)] rounded-[2rem] px-4 sm:px-6 py-5 sm:py-6">
                <DialogHeader className="mb-2">
                    <DialogTitle className="font-serif text-2xl text-center text-foreground tracking-wide">
                        {card.name}
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground">
                        선택된 카드입니다
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-3 sm:py-4">
                    <div className="relative w-40 sm:w-48 h-60 sm:h-72 rounded-[1.5rem] overflow-hidden shadow-2xl border border-white/10 ring-1 ring-white/10">
                        <Image
                            src={card.imageUrl}
                            alt={card.name}
                            fill
                            className="object-cover"
                            priority
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-center mt-4">
                    <Button
                        onClick={() => onOpenChange(false)}
                        className="w-full bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground shadow-[0_16px_32px_-20px_rgba(168,145,255,0.65)] rounded-2xl"
                    >
                        닫기
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
