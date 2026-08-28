import React, { useRef, useState } from "react";
import { createPortal } from "react-dom";
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
import { ApiTarotCardData, TarotCard } from "@/services/tarot-card-analysis";
import { tarotCardsData, CARD_BACK_IMAGE } from "@/lib/tarot-data";
import { UserInfo } from "@/types/user-journey";

const mbtiReadingNotes: Record<string, { title: string; text: string }> = {
    INFP: {
        title: "잔잔한 결을 읽는 타입",
        text: "감정과 상징을 오래 곱씹는 편이라, 카드의 기운을 섬세하게 받아들입니다.",
    },
    INFJ: {
        title: "흐름을 미리 느끼는 타입",
        text: "보이지 않는 의미를 먼저 포착해서, 해석의 방향을 빠르게 잡습니다.",
    },
    ISFP: {
        title: "감각으로 먼저 반응하는 타입",
        text: "말보다 분위기를 먼저 읽어서, 현재의 카드와 직접적으로 연결합니다.",
    },
    ISFJ: {
        title: "정성스럽게 기억하는 타입",
        text: "세부를 놓치지 않고 차분히 받아들여, 결과를 안정적으로 소화합니다.",
    },
    ENFP: {
        title: "가능성을 크게 여는 타입",
        text: "카드의 의미를 확장해서 받아들이고, 해석을 새로운 이야기로 연결합니다.",
    },
    ENFJ: {
        title: "사람의 흐름을 잘 보는 타입",
        text: "관계와 분위기를 빠르게 읽어, 해석을 현실적인 조언으로 바꿉니다.",
    },
    ESFP: {
        title: "지금의 온도를 잘 느끼는 타입",
        text: "현재 감정과 상황을 생생하게 받아들여 결과를 쉽게 체감합니다.",
    },
    ESFJ: {
        title: "균형과 관계를 챙기는 타입",
        text: "주변의 분위기와 관계 맥락을 함께 보며 해석을 안정적으로 정리합니다.",
    },
    INTJ: {
        title: "구조를 먼저 보는 타입",
        text: "결과에서 패턴과 원리를 찾는 데 강해, 카드의 연결 고리를 빠르게 짚습니다.",
    },
    INTP: {
        title: "의미를 분해해 보는 타입",
        text: "카드의 메시지를 조각내어 분석하면서도, 의외의 연결을 잘 찾아냅니다.",
    },
    ISTP: {
        title: "필요한 것만 정확히 보는 타입",
        text: "핵심만 빠르게 잡아내서, 해석을 실용적으로 받아들이는 편입니다.",
    },
    ISTJ: {
        title: "기준을 분명히 보는 타입",
        text: "질서와 사실을 바탕으로 해석을 정리해서, 결과를 신뢰감 있게 받아들입니다.",
    },
    ENTJ: {
        title: "방향을 바로 잡는 타입",
        text: "결과를 목표와 실행으로 연결해, 카드의 메시지를 빠르게 정리합니다.",
    },
    ENTP: {
        title: "새 해석을 잘 만드는 타입",
        text: "카드의 의미를 여러 각도로 바라보며, 결과를 풍부하게 확장합니다.",
    },
    ESTP: {
        title: "상황 판단이 빠른 타입",
        text: "현재의 흐름을 즉각적으로 읽어, 해석을 현실적인 다음 행동으로 바꿉니다.",
    },
    ESTJ: {
        title: "정리와 실행이 빠른 타입",
        text: "카드의 메시지를 우선순위로 바꾸는 데 강해서, 결과를 명확히 받아들입니다.",
    },
};

const getMbtiReadingNote = (mbti?: string) => {
    if (!mbti) return null;
    return mbtiReadingNotes[mbti] ?? null;
};

function escapeHtml(text: string) {
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

export function highlightOutput(text: string) {
    let processed = escapeHtml(text)
        // Headers (H2 and H3)
        .replace(/^##\s+(.*)/gm, '<h2 class="text-2xl font-serif font-bold text-foreground mt-8 mb-4 pb-2 border-b border-white/10">$1</h2>')
        .replace(/^###\s+(.*)/gm, '<h3 class="text-xl font-bold text-foreground mt-6 mb-3">$1</h3>')
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-foreground text-[1.03em]">$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="not-italic text-muted-foreground">$1</em>')
        // Bullet points
        .replace(/^-\s+(.*)/gm, '<li class="ml-2 mb-2 relative pl-2 before:content-[\'•\'] before:absolute before:-left-3 before:text-primary block leading-relaxed">$1</li>')
        // Convert remaining newlines to breaks
        .replace(/\n/g, "<br />")
        // Fix `<br />` following block elements
        .replace(/<\/h2><br \/>/g, "</h2>")
        .replace(/<\/h3><br \/>/g, "</h3>")
        .replace(/<\/li><br \/>/g, "</li>")
        // Clean up excessive breaks
        .replace(/(<br \/>){3,}/g, "<br /><br />");

    return <div dangerouslySetInnerHTML={{ __html: processed }} className="prose prose-invert prose-p:leading-relaxed prose-p:text-[16px] prose-p:text-foreground/95 max-w-none space-y-2" />;
}

function stripInlineMarkdown(text: string) {
    return text
        .replace(/\*\*(.*?)\*\*/g, "$1")
        .replace(/^#+\s*/gm, "")
        .replace(/^[-*]\s+/gm, "")
        .replace(/\s+/g, " ")
        .trim();
}

function parseReadingSections(output: string) {
    const matches = [...output.matchAll(/^\d+\.\s*\*\*(.+?)\*\*:?\s*([\s\S]*?)(?=\n\s*\d+\.\s*\*\*|$)/gm)];
    return matches.map((match) => ({
        title: stripInlineMarkdown(match[1]),
        body: stripInlineMarkdown(match[2]),
    }));
}

interface N8nOutputEntry {
    output: string;
}

type CardInterpretationsData = TarotCard | N8nOutputEntry[] | null;

interface CardInterpretationsProps {
    cardInterpretations: CardInterpretationsData;
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
    const [showDetails, setShowDetails] = useState(false);

    React.useEffect(() => {
        if (!isOutputModalOpen) {
            setShowDetails(false);
            return;
        }

        const timeoutId = window.setTimeout(() => setShowDetails(true), 500);
        return () => window.clearTimeout(timeoutId);
    }, [isOutputModalOpen]);

    if (!cardInterpretations) return null;

    const n8nOutput: N8nOutputEntry[] | null = Array.isArray(cardInterpretations)
        ? cardInterpretations
        : null;
    const tarotCardResult: TarotCard | null = Array.isArray(cardInterpretations)
        ? null
        : cardInterpretations;

    const rawOutput: string = n8nOutput?.[0]?.output ?? "";
    const readingSections = parseReadingSections(rawOutput);
    const moodSection = readingSections[0];
    const openingText =
        moodSection?.body ||
        stripInlineMarkdown(rawOutput.split("\n").find((line: string) => line.trim()) ?? "") ||
        "결과를 읽고 있습니다.";

    const handleCloseModal = () => {
        setIsOutputModalOpen(false);
        setSelectedCards([]);
        clearInterpretations();
        setQuestion("");
        setShowDetails(false);
    };

    const handleSaveImage = async () => {
        if (!modalRef.current) return;
        setIsSaving(true);
        // Add a small delay to ensure rendering of any state changes if needed
        setTimeout(async () => {
            try {
                const dataUrl = await toPng(modalRef.current as HTMLElement, {
                    cacheBust: true,
                    backgroundColor: '#11172a',
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
            {tarotCardResult?.TarotCardData &&
                tarotCardResult.TarotCardData.length > 0 && (
                    <div className="mt-8 w-full max-w-4xl p-6 bg-white/[0.04] backdrop-blur-2xl rounded-[2rem] shadow-[0_24px_70px_-35px_rgba(168,145,255,0.35)] relative z-10 border border-white/10">
                        <h2 className="text-3xl font-semibold mb-6 text-center text-foreground font-serif animate-in fade-in duration-500">
                            카드 요약
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-3 duration-700">
                            {tarotCardResult.TarotCardData.map((card: ApiTarotCardData, index: number) => {
                                const displayCard = tarotCardsData.find(
                                    (dc) => dc.name === card.name
                                );
                                return (
                                    <div
                                        key={index}
                                        className="bg-card/70 backdrop-blur-sm border border-white/10 rounded-[1.25rem] overflow-hidden shadow-lg transform hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 flex flex-col items-center p-4 animate-in fade-in zoom-in-95"
                                        style={{ animationDelay: `${index * 90}ms` }}
                                    >
                                        <div className="relative w-24 h-36 mb-4 shadow-md rounded-lg overflow-hidden ring-1 ring-white/10">
                                            <Image
                                                src={displayCard?.imageUrl || CARD_BACK_IMAGE}
                                                alt={card.name}
                                                fill
                                                sizes="(max-width: 768px) 100vw, 33vw"
                                                className={`object-cover ${card.isReversed ? "rotate-180" : ""}`}
                                            />
                                        </div>
                                        <div className="text-center w-full">
                                            <h3 className="text-base font-semibold text-foreground truncate w-full">
                                                {card.name}
                                            </h3>
                                        <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                                            {card.isReversed ? "역방향" : "정방향"}
                                        </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

            {n8nOutput?.[0]?.output &&
                isOutputModalOpen && createPortal(
                    <div className="fixed inset-0 z-[5000] flex items-stretch justify-center p-2 sm:items-center sm:p-4 bg-background/75 backdrop-blur-md animate-in fade-in duration-500">
                        <div
                            ref={modalRef}
                            className={`relative bg-[linear-gradient(180deg,rgba(17,23,42,0.98)_0%,rgba(23,30,54,0.98)_100%)] border border-white/10 rounded-[1.5rem] sm:rounded-[2rem] shadow-[0_24px_80px_-35px_rgba(168,145,255,0.5)] w-full max-w-2xl h-[calc(100dvh-1rem)] sm:h-auto flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ${isSaving ? 'h-auto max-h-none overflow-visible' : 'sm:max-h-[85vh] overflow-hidden'}`}
                        >

                            {/* Header sticky area */}
                            <div className="flex-none p-5 sm:p-6 pb-4 border-b border-white/5 flex flex-col gap-3 bg-white/[0.02] z-10">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl sm:text-2xl font-serif font-bold text-foreground tracking-wide">
                                        해석 보기
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
                                {getMbtiReadingNote(userInfo?.mbti) && (
                                    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-4 text-sm leading-relaxed text-foreground/90 shadow-[0_16px_32px_-24px_rgba(168,145,255,0.45)]">
                                        <div className="font-medium text-foreground mb-1">
                                            {getMbtiReadingNote(userInfo?.mbti)?.title}
                                        </div>
                                        <div>{getMbtiReadingNote(userInfo?.mbti)?.text}</div>
                                    </div>
                                )}
                            </div>

                            {/* Scrollable Content */}
                            <div className={`flex-1 min-h-0 px-4 sm:px-6 pt-4 sm:pt-6 scroll-smooth ${isSaving ? 'overflow-visible' : 'overflow-y-auto'}`}>
                                <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(168,145,255,0.24),transparent_42%),linear-gradient(180deg,rgba(20,26,47,0.98)_0%,rgba(15,20,38,0.98)_100%)] px-5 py-5 sm:px-6 sm:py-6 shadow-[0_24px_50px_-28px_rgba(168,145,255,0.5)] animate-in fade-in slide-in-from-bottom-4 duration-700">
                                    <div className="absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.07),transparent_24%)]" />
                                    <div className="relative flex flex-col gap-5 sm:gap-6 md:grid md:grid-cols-[1.4fr_0.9fr] md:items-end">
                                        <div className="space-y-4">
                                            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[0.35em] text-primary/90 animate-in fade-in duration-500">
                                                moonlit opening
                                            </div>
                                            <div>
                                                <p className="text-xs sm:text-sm uppercase tracking-[0.45em] text-muted-foreground animate-in fade-in slide-in-from-bottom-1 duration-500">
                                                    오늘의 첫 숨결
                                                </p>
                                                <h4 className="mt-2 text-3xl sm:text-4xl md:text-5xl font-serif font-bold leading-[1.06] text-foreground drop-shadow-[0_10px_30px_rgba(168,145,255,0.22)] animate-in fade-in slide-in-from-bottom-2 duration-700">
                                                    카드가 먼저 속삭이는
                                                    <span className="block text-primary/95">가장 조용한 진실</span>
                                                </h4>
                                            </div>
                                            <div className="space-y-2 text-[15px] sm:text-[17px] leading-[1.95] text-foreground/92">
                                                <div className="rounded-2xl border border-white/8 bg-white/[0.04] px-4 py-3 shadow-[0_12px_30px_-24px_rgba(168,145,255,0.45)] animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    {moodSection?.title && (
                                                        <p className="text-[10px] uppercase tracking-[0.3em] text-primary/80 mb-1">
                                                            {moodSection.title}
                                                        </p>
                                                    )}
                                                    <p>{openingText}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-1 animate-in fade-in slide-in-from-bottom-2 duration-700" style={{ animationDelay: "180ms" }}>
                                            <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
                                                <p className="text-[10px] uppercase tracking-[0.35em] text-primary/80">분위기</p>
                                                <p className="mt-2 text-base sm:text-lg font-medium text-foreground">
                                                    문라이트 젠 리딩
                                                </p>
                                                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                    부드러운 흐름 속에서 핵심만 또렷하게 정리합니다.
                                                </p>
                                            </div>
                                            {userInfo && (
                                                <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.05] p-4 backdrop-blur-sm transition-transform duration-300 hover:-translate-y-0.5">
                                                    <p className="text-[10px] uppercase tracking-[0.35em] text-primary/80">리더</p>
                                                    <p className="mt-2 text-base sm:text-lg font-medium text-foreground">
                                                        {userInfo.name}님
                                                    </p>
                                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                                        {userInfo.mbti}의 관점으로 카드를 풀어갑니다.
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4 sm:space-y-5 py-4 sm:py-6 md:pb-8">
                                    <div className="rounded-[1.5rem] border border-white/10 bg-white/[0.06] px-4 py-5 text-foreground/95 shadow-[0_20px_40px_-28px_rgba(168,145,255,0.45)] animate-in fade-in slide-in-from-bottom-2 duration-500" style={{ animationDelay: "120ms" }}>
                                        <p className="text-[10px] sm:text-xs uppercase tracking-[0.3em] text-primary/80 mb-2">한 줄 요약</p>
                                        <p className="text-base sm:text-lg md:text-lg leading-relaxed font-semibold">
                                            {openingText}
                                        </p>
                                    </div>
                                    {showDetails && (
                                        <div className="text-foreground/95 text-[16px] md:text-[17px] leading-[1.95] md:leading-[2.1] tracking-normal animate-in fade-in slide-in-from-bottom-2 duration-300">
                                            {highlightOutput(n8nOutput[0].output)}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Footer sticky area */}
                            {!isSaving && (
                                <div className="flex-none p-6 pt-4 border-t border-white/5 bg-card/40 flex gap-4">
                                    <Button
                                        className="flex-1 py-6 text-lg rounded-2xl bg-card border border-white/10 hover:bg-white/10 text-foreground transition-all"
                                        onClick={handleSaveImage}
                                        disabled={isSaving}
                                    >
                                        저장
                                    </Button>
                                    <Button
                                        className="flex-1 py-6 text-lg rounded-2xl bg-gradient-to-r from-primary via-secondary to-[#e4dcff] hover:opacity-95 text-primary-foreground shadow-[0_16px_32px_-20px_rgba(168,145,255,0.65)] transition-all hover:scale-[1.01]"
                                        onClick={() => {
                                          handleCloseModal();
                                          onRestart();
                                        }}
                                    >
                                        다시 보기
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>,
                    document.body
                )}
        </>
    );
}
