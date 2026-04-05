"use client";

import { useState } from "react";
import { UserInfo } from "@/types/user-journey";
import { mbtiQuestions } from "@/lib/mbti-data";
import { cn } from "@/lib/utils";

interface MbtiQuizStepProps {
    onComplete: (info: Partial<UserInfo>) => void;
}

export function MbtiQuizStep({ onComplete }: MbtiQuizStepProps) {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({
        E: 0, I: 0,
        S: 0, N: 0,
        T: 0, F: 0,
        J: 0, P: 0,
    });

    const [isTransitioning, setIsTransitioning] = useState(false);

    const handleSelect = (value: string) => {
        if (isTransitioning) return;

        // Update local state and map answers
        const newAnswers = { ...answers, [value]: answers[value] + 1 };
        setAnswers(newAnswers);
        setIsTransitioning(true);

        setTimeout(() => {
            if (currentIdx < mbtiQuestions.length - 1) {
                setCurrentIdx(currentIdx + 1);
                setIsTransitioning(false);
            } else {
                // Calculate final MBTI
                const mbti = [
                    newAnswers.E >= newAnswers.I ? "E" : "I",
                    newAnswers.S >= newAnswers.N ? "S" : "N",
                    newAnswers.T >= newAnswers.F ? "T" : "F",
                    newAnswers.J >= newAnswers.P ? "J" : "P",
                ].join("");

                onComplete({ mbti });
            }
        }, 500); // Wait 500ms for smooth exit animation
    };

    const currentQ = mbtiQuestions[currentIdx];
    const progress = ((currentIdx + 1) / mbtiQuestions.length) * 100;

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            {/* Progress Bar */}
            <div className="w-full max-w-md mb-8">
                <div className="flex justify-between text-xs text-primary/70 mb-2 px-1 font-medium">
                    <span>Q{currentIdx + 1}</span>
                    <span>당신의 본질을 읽는 중...</span>
                </div>
                <div className="h-1.5 w-full bg-primary/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_10px_var(--primary)]"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className={cn(
                "w-full max-w-md transition-all duration-500",
                isTransitioning ? "opacity-0 translate-y-4 scale-95" : "opacity-100 translate-y-0 scale-100"
            )}>
                {/* Question Card */}
                <div className="bg-card/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 md:p-10 shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden flex flex-col items-center text-center">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />

                    <p className="text-xs text-primary/60 uppercase tracking-widest mb-3">점술가가 묻습니다</p>
                    <h3 className="text-xl md:text-2xl font-serif text-primary-foreground mb-8 leading-relaxed">
                        {currentQ.text}
                    </h3>

                    <div className="flex flex-col gap-4 w-full">
                        <button
                            onClick={() => handleSelect(currentQ.optionA.value)}
                            className="w-full text-left bg-background/50 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-foreground p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] hover:-translate-y-1"
                        >
                            <p className="text-sm md:text-base">{currentQ.optionA.text}</p>
                        </button>
                        <button
                            onClick={() => handleSelect(currentQ.optionB.value)}
                            className="w-full text-left bg-background/50 hover:bg-primary/20 border border-primary/30 hover:border-primary/50 text-foreground p-5 rounded-2xl transition-all duration-300 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)] hover:-translate-y-1"
                        >
                            <p className="text-sm md:text-base">{currentQ.optionB.text}</p>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
