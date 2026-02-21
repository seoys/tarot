import React from "react";
import Image from "next/image";
import { CARD_BACK_IMAGE } from "@/lib/tarot-data";

export const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[3000]">
        <div className="relative animate-spin-slow">
            <Image
                src={CARD_BACK_IMAGE}
                alt="Loading..."
                width={100}
                height={150}
                className="rounded-lg shadow-lg"
                data-ai-hint="card loading"
            />
        </div>
        <p className="text-white text-xl ml-4 font-serif italic">
            ✨🔮 당신을 분석 중... 🧙‍♂️✨
        </p>
    </div>
);
