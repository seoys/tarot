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
                className="text-foreground mb-2 block font-serif italic text-lg"
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
                className="w-full text-center text-lg py-6 bg-background/50 backdrop-blur-sm border-primary/30 focus-visible:ring-primary shadow-[0_0_15px_-5px_var(--primary)] text-foreground placeholder-muted-foreground transition-all duration-300 rounded-xl"
            />
        </div>
    );
}
