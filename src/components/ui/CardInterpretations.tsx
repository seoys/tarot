import React, { useRef, useState } from "react";
import Image from "next/image";
import { toPng } from "html-to-image";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { TarotCard } from "@/services/tarot-card-analysis";
import { tarotCardsData, CARD_BACK_IMAGE } from "@/lib/tarot-data";
import { UserInfo } from "@/types/user-journey";

export function highlightOutput(text: string) {
    let processed = text
        // Headers (H2 and H3)
        .replace(/^##\s+(.*)/gm, '<h2 class="text-2xl font-serif font-bold text-primary mt-8 mb-4 pb-2 border-b border-primary/20">$1</h2>')
        .replace(/^###\s+(.*)/gm, '<h3 class="text-xl font-bold text-primary-foreground mt-6 mb-3">$1</h3>')
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-primary/90 text-[1.05em]">$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="italic text-muted-foreground">$1</em>')
        // Bullet points
        .replace(/^-\s+(.*)/gm, '<li class="ml-2 mb-2 relative pl-2 before:content-[\'•\'] before:absolute before:-left-3 before:text-primary block">$1</li>')
        // Convert remaining newlines to breaks
        .replace(/\n/g, "<br />")
        // Fix `<br />` following block elements
        .replace(/<\/h2><br \/>/g, "</h2>")
        .replace(/<\/h3><br \/>/g, "</h3>")
        .replace(/<\/li><br \/>/g, "</li>")
        // Clean up excessive breaks
        .replace(/(<br \/>){3,}/g, "<br /><br />");

    return <div dangerouslySetInnerHTML={{ __html: processed }} className="prose prose-invert prose-p:leading-relaxed max-w-none space-y-2" />;
}

interface CardInterpretationsProps {
    cardInterpretations: TarotCard | any | null;
    clearInterpretations: () => void;
    isOutputModalOpen: boolean;
    setIsOutputModalOpen: (open: boolean) => void;
    setSelectedCards: (cards: string[]) => void;
    setQuestion: (q: string) => void;
    userInfo?: UserInfo;
    onRestart: () => void;
}

export function CardInterpretations({
    cardInterpretations,
    clearInterpretations,
    isOutputModalOpen,
    setIsOutputModalOpen,
    setSelectedCards,
    setQuestion,
    userInfo,
    onRestart,
}: CardInterpretationsProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const [isSaving, setIsSaving] = useState(false);

    if (!cardInterpretations) return null;

    const handleCloseModal = () => {
        setIsOutputModalOpen(false);
        setSelectedCards([]);
        clearInterpretations();
        setQuestion("");
    };

    const handleSaveImage = async () => {
        if (!modalRef.current) return;
        setIsSaving(true);
        // Add a small delay to ensure rendering of any state changes if needed
        setTimeout(async () => {
            try {
                const dataUrl = await toPng(modalRef.current as HTMLElement, {
                    cacheBust: true,
                    backgroundColor: '#1a1525',
                    style: {
                        // Expand to full height for capture, overriding the Tailwind classes
                        maxHeight: 'none',
                        height: 'auto',
                        overflow: 'visible',
                        transform: 'none',
                    },
                });
                const link = document.createElement('a');
                link.download = `tarot-reading-${new Date().toISOString().slice(0, 10)}.png`;
                link.href = dataUrl;
                link.click();
            } catch (err) {
                console.error("Failed to capture image", err);
            } finally {
                setIsSaving(false);
            }
        }, 100);
    };

    return (
        <>
            {cardInterpretations.TarotCardData &&
                cardInterpretations.TarotCardData.length > 0 && (
                    <div className="mt-8 w-full max-w-4xl p-6 bg-secondary/30 backdrop-blur-md rounded-2xl shadow-xl relative z-10 border border-primary/20">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-primary font-serif italic">
                            선택된 카드들
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {cardInterpretations.TarotCardData.map((card: any, index: number) => {
                                const displayCard = tarotCardsData.find(
                                    (dc) => dc.name === card.name
                                );
                                return (
                                    <div
                                        key={index}
                                        className="bg-card/60 backdrop-blur-sm border border-primary/20 rounded-xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 flex flex-col items-center p-4"
                                    >
                                        <div className="relative w-24 h-36 mb-4 shadow-md rounded-md overflow-hidden">
                                            <Image
                                                src={displayCard?.imageUrl || CARD_BACK_IMAGE}
                                                alt={card.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className={`object-cover ${card.isReversed ? "rotate-180" : ""}`}
                                            />
                                        </div>
                                        <div className="text-center w-full">
                                            <h3 className="text-base font-semibold text-primary truncate w-full">
                                                {card.name}
                                            </h3>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {card.isReversed ? "역방향" : "정방향"}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {Array.isArray(cardInterpretations) &&
                cardInterpretations[0]?.output &&
                isOutputModalOpen && (
                    <div className="fixed inset-0 z-[5000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-500">
                        <div
                            ref={modalRef}
                            className={`relative bg-[#1a1525] border border-primary/30 rounded-3xl shadow-[0_0_60px_-15px_rgba(139,92,246,0.4)] w-full max-w-2xl flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ${isSaving ? 'h-auto max-h-none overflow-visible' : 'max-h-[85vh] overflow-hidden'}`}
                        >

                            {/* Header sticky area */}
                            <div className="flex-none p-6 pb-4 border-b border-white/5 flex flex-col gap-3 bg-card/40 z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-2xl font-serif font-bold text-primary tracking-wide">
                                        당신의 패를 읽겠습니다
                                    </h3>
                                    <button
                                        className="p-2 -mr-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors flex items-center justify-center"
                                        onClick={handleCloseModal}
                                        aria-label="닫기"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
                                    </button>
                                </div>
                                {userInfo && (
                                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs text-muted-foreground font-light tracking-wide">
                                        <span>
                                            🕯 내담자: <span className="text-foreground/90 font-medium">{userInfo.name}</span>님
                                            ({userInfo.birthDate.replace(/-/g, '.')}{userInfo.birthTime ? ` ${userInfo.birthTime}` : ''} / {userInfo.mbti})
                                        </span>
                                        <span className="hidden sm:inline text-white/20">|</span>
                                        <span>
                                            ✨ 해석 일시: <span className="text-foreground/90">{new Date().toLocaleString('ko-KR', {
                                                year: 'numeric', month: 'long', day: 'numeric',
                                                hour: '2-digit', minute: '2-digit'
                                            })}</span>
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Content */}
                            <div className={`flex-1 p-6 md:p-8 scroll-smooth ${isSaving ? 'overflow-visible' : 'overflow-y-auto'}`}>
                                <div className="text-foreground/90 text-[15px] md:text-[16px] leading-[1.8] md:leading-[2] tracking-wide">
                                    {highlightOutput(cardInterpretations[0].output)}
                                </div>
                            </div>

                            {/* Footer sticky area */}
                            {!isSaving && (
                                <div className="flex-none p-6 pt-4 border-t border-white/5 bg-card/40 flex gap-4">
                                    <Button
                                        className="flex-1 py-6 text-lg rounded-xl bg-card border border-primary/30 hover:bg-primary/10 text-primary transition-all"
                                        onClick={handleSaveImage}
                                        disabled={isSaving}
                                    >
                                        저장하기
                                    </Button>
                                    <Button
                                        className="flex-1 py-6 text-lg rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-primary-foreground shadow-[0_0_20px_-5px_var(--primary)] transition-all hover:scale-[1.01]"
                                        onClick={() => {
                                            handleCloseModal();
                                            onRestart();
                                        }}
                                    >
                                        다시 운명을 마주하다
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
        </>
    );
}
