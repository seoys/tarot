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
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-6 animate-in fade-in duration-700">
            <div className="w-full max-w-md bg-card/40 backdrop-blur-xl border border-primary/20 rounded-3xl p-8 shadow-[0_0_40px_-10px_rgba(139,92,246,0.15)] relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/20 rounded-full blur-[50px] -ml-16 -mb-16 pointer-events-none" />

                <div className="relative z-10 text-center mb-8">
                    <h2 className="text-3xl font-serif text-primary-foreground mb-3">다음에 펼쳐질 당신의 이야기</h2>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        당신을 향해 다가오는 운명의 흐름을 읽고,<br />
                        앞으로 맞이할 눈부신 내일을 확인하기 위해 기본 정보가 필요해요.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <label htmlFor="name" className="text-sm font-medium text-foreground/80 pl-1">
                            이름 (닉네임) <span className="text-primary">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            required
                            placeholder="당신을 부를 이름을 알려주세요"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-background/50 border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label htmlFor="birthdate" className="text-sm font-medium text-foreground/80 pl-1">
                            생년월일 <span className="text-primary">*</span>
                        </label>
                        <input
                            type="date"
                            id="birthdate"
                            required
                            max="9999-12-31"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-background/50 border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
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
                                <span className="text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors">모름</span>
                            </label>
                        </div>
                        <input
                            type="time"
                            id="birthtime"
                            value={time}
                            disabled={isTimeUnknown}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-background/50 border border-primary/30 rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        />
                    </div>

                    <Button
                        type="submit"
                        disabled={!name || !date}
                        className="w-full mt-4 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground text-lg py-6 rounded-xl shadow-[0_0_20px_-5px_var(--primary)] transition-all hover:scale-[1.02] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                    >
                        나만의 운명 여정 시작하기
                    </Button>
                </form>
            </div>
        </div>
    );
}
