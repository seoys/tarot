import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface QuestionInputProps {
    question: string;
    setQuestion: (q: string) => void;
    isLoading: boolean;
    isShuffling: boolean;
}

export function QuestionInput({
    question,
    setQuestion,
    isLoading,
    isShuffling,
}: QuestionInputProps) {
    return (
        <div className="w-full max-w-md mb-5 sm:mb-6 relative z-10 text-center px-1 sm:px-0">
            <Label
                htmlFor="question"
                className="text-foreground mb-2 block font-serif text-lg font-medium"
            >
                무엇이 궁금하신가요?
            </Label>
            <Input
                id="question"
                placeholder="예: 오늘 연애운"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                autoFocus
                disabled={isLoading || isShuffling}
                className="w-full text-center text-base sm:text-lg py-4 sm:py-6 px-4 sm:px-5 bg-white/[0.04] backdrop-blur-md border-white/10 focus-visible:ring-primary/30 shadow-[0_18px_40px_-28px_rgba(168,145,255,0.35)] text-foreground placeholder:text-foreground/45 transition-all duration-300 rounded-2xl"
            />
        </div>
    );
}
