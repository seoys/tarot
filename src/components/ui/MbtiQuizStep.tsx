"use client";

import { useMemo, useState } from "react";
import { UserInfo } from "@/types/user-journey";
import { getMbtiQuiz } from "@/lib/mbti-data";
import { cn } from "@/lib/utils";

interface MbtiQuizStepProps {
    onComplete: (info: Partial<UserInfo>) => void;
    onSkip: () => void;
}

export function MbtiQuizStep({ onComplete, onSkip }: MbtiQuizStepProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({
        E: 0, I: 0,
        S: 0, N: 0,
        T: 0, F: 0,
        J: 0, P: 0,
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    const quiz = useMemo(() => getMbtiQuiz(), []);
    const questions = quiz.questions;
    const axisCounts = quiz.axisCounts;

    const handleSelect = (value: string) => {
        if (isTransitioning) return;

        // Update local state and map answers
        const newAnswers = { ...answers, [value]: answers[value] + 1 };
        setAnswers(newAnswers);
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentIdx < questions.length - 1) {
                setCurrentIdx(currentIdx + 1);
                setIsTransitioning(false);
            } else {
                // Calculate final MBTI
                const normalize = (positive: keyof typeof newAnswers, negative: keyof typeof newAnswers, axisKey: keyof typeof axisCounts) => {
                    const count = Math.max(axisCounts[axisKey] || 1, 1);
                    const positiveScore = newAnswers[positive] / count;
                    const negativeScore = newAnswers[negative] / count;
                    return positiveScore >= negativeScore;
                };

                const mbti = [
                    normalize("E", "I", "E-I") ? "E" : "I",
                    normalize("S", "N", "S-N") ? "S" : "N",
                    normalize("T", "F", "T-F") ? "T" : "F",
                    normalize("J", "P", "J-P") ? "J" : "P",
                ].join("");

                onComplete({ mbti });
            }
        }, 500); // Wait 500ms for smooth exit animation
    };

    const currentQ = questions[currentIdx];
    const progress = ((currentIdx + 1) / questions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[64vh] sm:min-h-[70vh] px-3 sm:px-4">
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="flex justify-between text-xs text-primary/75 mb-2 px-1 font-medium">
                    <span>Q{currentIdx + 1}</span>
                    <span>읽는 중...</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-primary via-secondary to-[#e5ddff] transition-all duration-500 ease-out shadow-[0_0_16px_rgba(168,145,255,0.55)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className={cn(
                "w-full max-w-md transition-all duration-500",
                isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            )}>
                {/* Question Card */}
                <div className="bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[1.75rem] sm:rounded-[2rem] p-6 sm:p-8 md:p-10 shadow-[0_24px_70px_-35px_rgba(168,145,255,0.35)] relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />

                    <p className="text-xs text-primary/70 mb-3">질문</p>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-foreground mb-6 sm:mb-8 leading-[1.75]">
                        {currentQ.text}
                    </h3>

                    <div className="flex flex-col gap-3 sm:gap-4 w-full">
                        <button
                            onClick={() => handleSelect(currentQ.optionA.value)}
                            className="w-full text-left bg-background/55 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-foreground p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_30px_-20px_rgba(168,145,255,0.6)] hover:-translate-y-0.5"
                        >
                            <p className="text-sm sm:text-base leading-relaxed">{currentQ.optionA.text}</p>
                        </button>
                        <button
                            onClick={() => handleSelect(currentQ.optionB.value)}
                            className="w-full text-left bg-background/55 hover:bg-white/10 border border-white/10 hover:border-primary/30 text-foreground p-4 sm:p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_12px_30px_-20px_rgba(168,145,255,0.6)] hover:-translate-y-0.5"
                        >
                            <p className="text-sm sm:text-base leading-relaxed">{currentQ.optionB.text}</p>
                        </button>
                    </div>
                </div>
            </div>

            <button
                onClick={onSkip}
                className="mt-6 text-xs sm:text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
            >
                건너뛰고 바로 타로 보기
            </button>
        </div>
    );
}
