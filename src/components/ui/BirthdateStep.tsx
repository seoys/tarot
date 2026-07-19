"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserInfo } from "@/types/user-journey";

interface BirthdateStepProps {
    onComplete: (info: Partial<UserInfo>) => void;
}

export function BirthdateStep({ onComplete }: BirthdateStepProps) {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [isTimeUnknown, setIsTimeUnknown] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !date) return; // Name and Date are required

        onComplete({
            name,
            birthDate: date,
            birthTime: isTimeUnknown ? undefined : (time || undefined),
        });
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[64vh] sm:min-h-[70vh] px-3 sm:px-4 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white/[0.04] backdrop-blur-2xl border border-white/10 rounded-[1.75rem] sm:rounded-[2rem] p-5 sm:p-6 md:p-8 shadow-[0_24px_80px_-40px_rgba(168,145,255,0.4)] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/15 rounded-full blur-[60px] -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/12 rounded-full blur-[60px] -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 text-center mb-5 sm:mb-6">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.28em] sm:tracking-[0.35em] text-primary/70 mb-2 sm:mb-3">Moonlight Zen</p>
                    <h2 className="text-[1.65rem] sm:text-2xl md:text-[2rem] font-serif text-primary-foreground mb-3 sm:mb-4 leading-tight">이미 보고 있습니다.</h2>
                    <p className="text-[15px] leading-[1.9] text-left text-foreground/90 border border-white/10 bg-white/[0.03] pl-4 pr-4 py-4 rounded-2xl">
                        이름과 태어난 날만 알려주세요. 나머지는 제가 읽겠습니다.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4 sm:gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground/90 pl-1">
                            당신의 이름 <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="이름을 적어주세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background/60 border border-white/10 rounded-2xl px-4 py-3 text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all shadow-[0_0_0_1px_rgba(255,255,255,0.02)] text-base sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="birthdate" className="text-sm font-medium text-foreground/90 pl-1">
                            이 세상에 태어난 날 <span className="text-primary">*</span>
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            required
                            max="9999-12-31"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-background/60 border border-white/10 rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all [color-scheme:dark] text-base sm:text-base"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center pl-1">
                                <label htmlFor="birthtime" className="text-sm font-medium text-foreground/90">
                                    태어난 시간
                                </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input
                                        type="checkbox"
                                        checked={isTimeUnknown}
                                        onChange={(e) => setIsTimeUnknown(e.target.checked)}
                                        className="appearance-none w-5 h-5 border border-white/20 rounded-md bg-background/50 checked:bg-primary/80 checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all cursor-pointer"
                                    />
                                    <svg className={`absolute w-3.5 h-3.5 text-white pointer-events-none transition-opacity ${isTimeUnknown ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs text-muted-foreground group-hover:text-foreground/90 transition-colors">기억하지 못합니다</span>
                            </label>
                        </div>
                        <input
                            type="time"
                            id="birthtime"
                            value={time}
                            disabled={isTimeUnknown}
                            placeholder="시간을 아시면 적어주세요"
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-background/60 border border-white/10 rounded-2xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/40 transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!name || !date}
                        className="w-full mt-3 sm:mt-4 bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground text-base sm:text-lg py-5 sm:py-6 rounded-2xl shadow-[0_20px_50px_-25px_rgba(168,145,255,0.6)] transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        시작하기
                    </Button>
                </form>
            </div>
        </div>
    );
}
