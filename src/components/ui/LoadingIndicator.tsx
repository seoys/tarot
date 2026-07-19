import React from "react";
import Image from "next/image";
import { CARD_BACK_IMAGE } from "@/lib/tarot-data";

const loadingPhases = [
    "카드를 펼치고 있습니다",
    "패의 흐름을 읽고 있습니다",
    "결과를 정리하고 있습니다",
];

interface LoadingIndicatorProps {
    phaseIndex: number;
}

export const LoadingIndicator = ({ phaseIndex }: LoadingIndicatorProps) => (
    <div className="w-full max-w-lg px-4 sm:px-6">
        <div className="rounded-[2.25rem] border border-white/10 bg-white/[0.06] backdrop-blur-2xl p-5 sm:p-8 shadow-[0_24px_80px_-35px_rgba(168,145,255,0.35)] text-center">
            <div className="flex items-center justify-center gap-4 sm:gap-5">
                <div className="relative animate-spin-slow drop-shadow-[0_0_24px_rgba(168,145,255,0.35)] shrink-0">
                    <Image
                        src={CARD_BACK_IMAGE}
                        alt="Loading..."
                        width={96}
                        height={144}
                        className="rounded-2xl shadow-lg border border-white/10 w-20 sm:w-24 h-auto"
                        data-ai-hint="card loading"
                    />
                </div>
                <div className="flex-1 text-left min-w-0">
                    <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary/75 mb-2 sm:mb-3">Tarot reading</p>
                    <p className="text-foreground text-lg sm:text-xl font-serif leading-relaxed">
                        {loadingPhases[phaseIndex]}
                    </p>
                    <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        잠시만 기다리시면 마지막 해석이 도착합니다.
                    </p>
                </div>
            </div>
            <div className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                {loadingPhases.map((phase, index) => (
                    <div
                        key={phase}
                        className={`h-2 sm:h-1.5 rounded-full transition-all duration-300 ${index <= phaseIndex ? "bg-gradient-to-r from-primary via-secondary to-[#e4dcff]" : "bg-white/10"}`}
                    />
                ))}
            </div>
            <div className="mt-4 flex items-center justify-center gap-1 sm:hidden">
                {loadingPhases.map((phase, index) => (
                    <span
                        key={phase}
                        className={`h-2 w-2 rounded-full transition-all duration-300 ${index <= phaseIndex ? "bg-primary" : "bg-white/20"}`}
                    />
                ))}
            </div>
        </div>
    </div>
);
