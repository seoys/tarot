import React from "react";
import Image from "next/image";
import { CARD_BACK_IMAGE } from "@/lib/tarot-data";

export const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-md flex items-center justify-center z-[3000] px-6">
        <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="relative animate-spin-slow drop-shadow-[0_0_24px_rgba(168,145,255,0.35)]">
                <Image
                    src={CARD_BACK_IMAGE}
                    alt="Loading..."
                    width={100}
                    height={150}
                    className="rounded-2xl shadow-lg border border-white/10"
                    data-ai-hint="card loading"
                />
            </div>
            <p className="text-foreground text-xl sm:ml-4 font-serif italic">
                잠시만요, 당신의 흐름을 읽고 있습니다...
            </p>
        </div>
    </div>
);
