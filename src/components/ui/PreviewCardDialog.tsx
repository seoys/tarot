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
            <DialogContent className="max-w-sm border-primary/20 bg-card/95 backdrop-blur-md text-foreground shadow-[0_0_40px_-10px_rgba(139,92,246,0.3)]">
                <DialogHeader className="mb-2">
                    <DialogTitle className="font-serif text-2xl text-center text-primary-foreground tracking-wide">
                        {card.name}
                    </DialogTitle>
                    <DialogDescription className="text-center text-muted-foreground italic">
                        이 패가 당신에게 오고 있었습니다
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-4">
                    <div className="relative w-48 h-72 rounded-xl overflow-hidden shadow-2xl border border-white/10 ring-2 ring-primary/20">
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
                        className="w-full bg-primary hover:bg-primary/80 text-primary-foreground shadow-[0_0_20px_-5px_var(--primary)]"
                    >
                        알겠습니다
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
