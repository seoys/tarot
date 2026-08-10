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
    const [step, setStep] = useState<"name" | "date" | "time">("name");

    const handleNext = () => {
        if (step === "name" && name.trim()) {
            setStep("date");
            return;
        }

        if (step === "date" && date) {
            setStep("time");
        }
    };

    const handlePrevious = () => {
        if (step === "date") {
            setStep("name");
            return;
        }

        if (step === "time") {
            setStep("date");
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !date) return;

        if (step !== "time") {
            handleNext();
            return;
        }

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
                    <h2 className="text-[1.65rem] sm:text-2xl md:text-[2rem] font-serif text-foreground mb-3 sm:mb-4 leading-tight">
                        {step === "name" && "이름을 알려주세요."}
                        {step === "date" && "이 세상에 태어난 날은요?"}
                        {step === "time" && "태어난 시간도 있을까요?"}
                    </h2>
                    <p className="text-[15px] leading-[1.9] text-left text-foreground/90 border border-white/10 bg-white/[0.03] pl-4 pr-4 py-4 rounded-2xl">
                        {step === "name" && "한 번에 하나씩만 적으면 됩니다."}
                        {step === "date" && "생년월일은 꼭 필요합니다."}
                        {step === "time" && "모르면 건너뛰어도 괜찮습니다."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4 sm:gap-5">
                    {step === "name" && (
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
                    )}

                    {step === "date" && (
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
                    )}

                    {step === "time" && (
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between items-center pl-1">
                                <label htmlFor="birthtime" className="text-sm font-medium text-foreground/90">
                                    태어난 시간
                                </label>
                                <button
                                    type="button"
                                    onClick={() => setIsTimeUnknown((prev) => !prev)}
                                    className={`text-xs rounded-full border px-3 py-1.5 transition-colors ${isTimeUnknown ? "border-primary/40 bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground hover:text-foreground"}`}
                                >
                                    시간 모름
                                </button>
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
                    )}

                    <div className="flex gap-3 pt-2">
                        {step !== "name" ? (
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handlePrevious}
                                className="flex-1 bg-transparent border-white/10 text-foreground hover:bg-white/5 rounded-2xl"
                            >
                                이전
                            </Button>
                        ) : (
                            <div className="flex-1" />
                        )}

                        {step !== "time" ? (
                            <Button
                                type="button"
                                onClick={handleNext}
                                disabled={(step === "name" && !name.trim()) || (step === "date" && !date)}
                                className="flex-1 bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground rounded-2xl shadow-[0_20px_50px_-25px_rgba(168,145,255,0.6)] transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                다음
                            </Button>
                        ) : (
                            <Button
                                type="submit"
                                disabled={!name || !date}
                                className="flex-1 bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground rounded-2xl shadow-[0_20px_50px_-25px_rgba(168,145,255,0.6)] transition-all hover:scale-[1.01] disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
                            >
                                시작하기
                            </Button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
