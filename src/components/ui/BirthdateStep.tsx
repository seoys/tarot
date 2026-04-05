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
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-primary/20 rounded-3xl p-6 shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-[50px] -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 text-center mb-6">
                    <h2 className="text-xl font-serif text-primary-foreground mb-4">말하지 않아도 됩니다. 이미 보고 있으니까요.</h2>
                    <p className="text-sm leading-relaxed text-left italic text-foreground/75 border-l-2 border-primary/50 pl-4 bg-primary/5 py-3 pr-3 rounded-r-lg">
                        "그렇지만... 이름과 태어난 날만큼은 직접 알려주셔야 합니다. 그것은 당신만이 줄 수 있는 것이니."
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">
                            당신의 이름 <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="숨기지 않아도 됩니다"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="birthdate" className="text-sm font-medium text-foreground/80 pl-1">
                            이 세상에 태어난 날 <span className="text-primary">*</span>
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            required
                            max="9999-12-31"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all [color-scheme:dark]"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center pl-1">
                            <label htmlFor="birthtime" className="text-sm font-medium text-foreground/80">
                                태어난 시간
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className="relative flex items-center justify-center w-5 h-5">
                                    <input
                                        type="checkbox"
                                        checked={isTimeUnknown}
                                        onChange={(e) => setIsTimeUnknown(e.target.checked)}
                                        className="appearance-none w-5 h-5 border border-primary/40 rounded bg-background/50 checked:bg-primary/80 checked:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all cursor-pointer"
                                    />
                                    <svg className={`absolute w-3.5 h-3.5 text-white pointer-events-none transition-opacity ${isTimeUnknown ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <span className="text-xs text-muted-foreground group-hover:text-foreground/80 transition-colors">기억하지 못합니다</span>
                            </label>
                        </div>
                        <input
                            type="time"
                            id="birthtime"
                            value={time}
                            disabled={isTimeUnknown}
                            placeholder="알고 있다면 알려주십시오"
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-white/5 border border-primary/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all [color-scheme:dark] disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!name || !date}
                        className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground text-lg py-6 rounded-xl shadow-[0_0_20px_-5px_var(--primary)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        운명의 문 앞에 서다
                    </Button>
                </form>
            </div>
        </div>
    );
}
