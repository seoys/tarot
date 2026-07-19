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
        <div className="w-full max-w-md mb-6 relative z-10 text-center">
            <Label
                htmlFor="question"
                className="text-foreground mb-2 block font-serif italic text-lg tracking-wide"
            >
                무엇을 알고 싶습니까?
            </Label>
            <Input
                id="question"
                placeholder="직접 말하지 않아도 됩니다. 하지만 물음이 있다면..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                autoFocus
                disabled={isLoading || isShuffling}
                className="w-full text-center text-lg py-6 bg-white/[0.04] backdrop-blur-md border-white/10 focus-visible:ring-primary/30 shadow-[0_18px_40px_-28px_rgba(168,145,255,0.5)] text-foreground placeholder:text-foreground/35 transition-all duration-300 rounded-2xl"
            />
        </div>
    );
}
