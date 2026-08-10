"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  analyzeTarotCards,
  TarotCard,
} from "@/services/tarot-card-analysis";
import { cn } from "@/lib/utils";

import {
  CARD_BACK_IMAGE,
  TarotCardDisplayData,
  tarotCardsData,
} from "@/lib/tarot-data";
import {
  shuffleWithReversed,
  useTarotShuffle,
  ShuffleVariantId,
  SHUFFLE_VARIANTS,
} from "@/hooks/useTarotShuffle";
import { LoadingIndicator } from "@/components/ui/LoadingIndicator";
import { QuestionInput } from "@/components/ui/QuestionInput";
import { CardSelectionDialog } from "@/components/ui/CardSelectionDialog";
import { CardInterpretations } from "@/components/ui/CardInterpretations";
import { TarotDeck } from "@/components/ui/TarotDeck";
import { SelectedCardsSlots } from "@/components/ui/SelectedCardsSlots";
import { PreviewCardDialog } from "@/components/ui/PreviewCardDialog";
import { useToast } from "@/hooks/use-toast";
import { FunnelStep, UserInfo } from "@/types/user-journey";
import { BirthdateStep } from "@/components/ui/BirthdateStep";
import { MbtiQuizStep } from "@/components/ui/MbtiQuizStep";

export default function Home() {
  const [shuffledCards, setShuffledCards] =
    useState<TarotCardDisplayData[]>(tarotCardsData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cardInterpretations, setCardInterpretations] =
    useState<TarotCard | null>(null);
  const [shuffleVariantId, setShuffleVariantId] = useState<ShuffleVariantId>(
    SHUFFLE_VARIANTS[0].id
  );
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [previewCard, setPreviewCard] = useState<TarotCardDisplayData | null>(null);
  const { toast } = useToast();

  // User Journey & Funnel State
  const [step, setStep] = useState<FunnelStep>('birth');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    birthDate: '',
    birthTime: '',
    mbti: '',
  });

  // Tarot Question State
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisPhaseIndex, setAnalysisPhaseIndex] = useState(0);
  const [readings, setReadings] = useState<
    {
      card: { name: string; isReversed: boolean };
      reading: { keyword: string; basicMeaning: string };
    }[]
  >([]);
  const [overallReading, setOverallReading] = useState("");
  const [isAnalysisComplete, setIsAnalysisComplete] = useState(false);

  // Dialog & UI State
  const [isSelectionModalOpen, setIsSelectionModalOpen] = useState(false);
  const [previewCardName, setPreviewCardName] = useState<string | null>(null); // Renamed to avoid conflict

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== "undefined") {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    if (typeof window !== "undefined") {
      handleResize(); // Initial size
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const cardPositions = useTarotShuffle(
    shuffledCards,
    windowSize,
    isShuffling,
    setIsShuffling,
    shuffleVariantId
  );

  const handleShuffle = useCallback(() => {
    setIsLoading(false); // Reset loading state
    setCardInterpretations(null); // Clear previous interpretations
    setSelectedCards([]); // Clear selected cards
    // setQuestion(""); // Clear question

    const newShuffledDeck = shuffleWithReversed(tarotCardsData);
    setShuffledCards(newShuffledDeck);
    setShuffleVariantId((previous) => {
      const candidates = SHUFFLE_VARIANTS.filter(
        (variant) => variant.id !== previous
      );
      const pool = candidates.length > 0 ? candidates : SHUFFLE_VARIANTS;
      const nextVariant = pool[Math.floor(Math.random() * pool.length)];
      return nextVariant.id;
    });
    setIsShuffling(true); // Start shuffling animation sequence
  }, []);

  useEffect(() => {
    handleShuffle(); // Initial shuffle when component mounts
  }, [handleShuffle]);

  useEffect(() => {
    if (!isAnalyzing) return;

    setAnalysisPhaseIndex(0);
    const intervalId = window.setInterval(() => {
      setAnalysisPhaseIndex((current) => (current + 1) % 3);
    }, 1200);

    return () => window.clearInterval(intervalId);
  }, [isAnalyzing]);

  const toggleCardSelection = (cardName: string) => {
    if (isLoading || isShuffling) return;

    if (selectedCards.includes(cardName)) {
      // If already selected, do nothing or just preview? 
      // User wants selected cards to be hidden from deck, so unselect should happen via slots.
      // But for robustness, let's keep it togglable if they somehow click it.
      handleUnselectCard(cardName);
    } else if (selectedCards.length < 5) {
      // Select it and show preview
      const card = shuffledCards.find((c) => c.name === cardName);
      if (card) {
        setSelectedCards([...selectedCards, cardName]);
        setPreviewCard(card);
      }
    }
  };

  const handleUnselectCard = (cardName: string) => {
    setSelectedCards(selectedCards.filter((name) => name !== cardName));
  };

  const handleConfirmSelection = async () => {
    if (question === "") {
      toast({
        variant: "destructive",
        title: "물음이 없으면 패를 읽을 수 없습니다",
        description: "점술가에게 전할 물음을 먼저 적어주십시오.",
      });
      setIsConfirmationOpen(false);
      return;
    }
    if (selectedCards.length === 0) {
      toast({
        variant: "destructive",
        title: "패를 선택하십시오",
        description: "최소 1장의 패를 집어야 운명을 읽을 수 있습니다.",
      });
      setIsConfirmationOpen(false);
      return;
    }

    setIsConfirmationOpen(false);
    setIsLoading(true);

    const selectedCardDetails: { name: string; isReversed: boolean }[] = selectedCards.map(
      (cardName) => {
        const card = shuffledCards.find((c) => c.name === cardName);
        return {
          name: cardName,
          isReversed: card?.isReversed || false,
        };
      }
    );

    try {
      const interpretationsResult: TarotCard = await analyzeTarotCards(
        userInfo,
        question || "오늘의 전반적인 운세를 알려주세요.",
        selectedCardDetails
      );
      setCardInterpretations(interpretationsResult);
    } catch (error) {
      console.error("Failed to analyze tarot cards:", error);
      toast({
        variant: "destructive",
        title: "운명의 실이 끊겼습니다",
        description: "패를 읽는 중 문제가 생겼습니다. 다시 시도해 주십시오.",
      });
      setCardInterpretations(null);
    } finally {
      setIsLoading(false);
    }
  };

  const clearInterpretations = () => {
    setCardInterpretations(null);
  };

  const isCardSelected = (cardName: string) => selectedCards.includes(cardName);

  useEffect(() => {
    if (
      cardInterpretations &&
      Array.isArray(cardInterpretations) && // Ensure it's the expected API output array
      cardInterpretations[0]?.output
    ) {
      setIsOutputModalOpen(true);
    } else if (
      cardInterpretations &&
      cardInterpretations.TarotCardData &&
      cardInterpretations.TarotCardData.length > 0
    ) {
      // This condition handles the case where it's already processed TarotCard structure
      // No direct modal opening here unless you intend to show details differently
    }
  }, [cardInterpretations]);

  // UX Helper Text Logic
  const getHelperText = () => {
    if (isLoading) return "읽는 중...";
    if (isShuffling) return "섞는 중...";
    if (question.trim() === "") return "먼저 물음을 적어주세요.";
    if (selectedCards.length === 0) return "3장 또는 5장을 골라주세요.";
    if (selectedCards.length > 0) return "패를 골랐습니다. 이어서 읽겠습니다.";
    return "패를 섞고 물음을 적어주세요.";
  };

  const getFlowStage = () => {
    if (isLoading || isAnalyzing) return "해석 확인";
    if (selectedCards.length > 0) return "카드 선택";
    if (question.trim().length > 0) return "물음 작성";
    return "시작";
  };

  const handleBirthdateComplete = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
    setStep('mbti');
  };

  const handleMbtiComplete = (info: Partial<UserInfo>) => {
    setUserInfo(prev => ({ ...prev, ...info }));
    setStep('tarot');
  };

  // Renamed for clarity in the context of the diff
  const shuffleCards = handleShuffle;
  const handleCardClick = toggleCardSelection;
  const error = null; // Placeholder for error state

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-24 overflow-hidden bg-background selection:bg-primary/20">
      {/* Moonlight layers */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_top,_hsla(259,42%,66%,0.16),_transparent_36%),radial-gradient(circle_at_bottom_right,_hsla(335,34%,66%,0.10),_transparent_30%),linear-gradient(180deg,_hsla(228,35%,7%,0.9)_0%,_hsla(228,35%,7%,1)_100%)]" />
      <div className="fixed inset-0 pointer-events-none opacity-[0.16] bg-[radial-gradient(circle,_rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:26px_26px]" />
      <div className="fixed top-[-10%] left-[-10%] w-[48%] h-[48%] bg-primary/15 blur-[120px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-12%] right-[-10%] w-[44%] h-[44%] bg-secondary/12 blur-[120px] rounded-full pointer-events-none" />

      {/* Funnel Router */}
      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center px-2 sm:px-0">

        {step === 'birth' && (
          <BirthdateStep onComplete={handleBirthdateComplete} />
        )}

        {step === 'mbti' && (
          <MbtiQuizStep onComplete={handleMbtiComplete} />
        )}

        {step === 'tarot' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Title Section */}
            <div className="text-center mb-8 sm:mb-12 relative px-2 sm:px-4 max-w-2xl">
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif tracking-tight text-foreground drop-shadow-[0_0_24px_rgba(168,145,255,0.35)] mb-3 sm:mb-4">
                Tarotal
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground font-light max-w-lg sm:max-w-xl mx-auto leading-relaxed px-2 sm:px-0">
                {userInfo.mbti}의 흐름을 읽고 5장의 패를 고르십시오.
              </p>
            </div>

            <div className="w-full max-w-md mb-5 sm:mb-6 px-2 sm:px-0">
              <div className="flex items-center justify-between gap-3 rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-xs sm:text-sm text-muted-foreground backdrop-blur-md">
                <span className="font-medium text-foreground">현재 단계</span>
                <span>{getFlowStage()}</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-[11px] sm:text-xs text-center">
                <div className={`rounded-full border px-3 py-2 ${selectedCards.length === 0 && !isShuffling && !isLoading ? "border-primary/40 bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground"}`}>
                  1 질문
                </div>
                <div className={`rounded-full border px-3 py-2 ${selectedCards.length > 0 ? "border-primary/40 bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground"}`}>
                  2 카드 선택
                </div>
                <div className={`rounded-full border px-3 py-2 ${(isLoading || isAnalyzing) ? "border-primary/40 bg-primary/10 text-foreground" : "border-white/10 bg-white/[0.03] text-muted-foreground"}`}>
                  3 해석 확인
                </div>
              </div>
            </div>

            {/* Question Input */}
            {!isAnalysisComplete && (
              <QuestionInput
                question={question}
                setQuestion={setQuestion}
                isLoading={isAnalyzing}
                isShuffling={isShuffling}
              />
            )}

            {!isAnalysisComplete && (
              <p className="mb-4 sm:mb-5 text-center text-sm text-muted-foreground px-4 max-w-md leading-relaxed">
                {getHelperText()}
              </p>
            )}

            {/* Controls */}
            {!isAnalysisComplete && selectedCards.length === 0 && (
              <div className="mb-8 sm:mb-12">
                <Button
                  onClick={shuffleCards}
                  disabled={isShuffling}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 sm:px-8 py-5 sm:py-6 text-base sm:text-lg tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-[1.02] active:scale-95"
                >
                  {isShuffling ? "섞는 중..." : "패 섞기"}
                </Button>
              </div>
            )}

            {/* Loading Indicator */}
            {isAnalyzing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/78 backdrop-blur-md animate-in fade-in duration-300">
                  <LoadingIndicator phaseIndex={analysisPhaseIndex} />
                </div>
              )}

            {/* Error State */}
            {error && (
              <div className="mb-8 p-4 bg-destructive/20 border border-destructive/50 rounded-xl text-destructive text-center max-w-md w-full backdrop-blur-md">
                {error}
              </div>
            )}

            {/* Tarot Deck Area */}
            {!isAnalysisComplete && (
              <div className="w-full relative mb-12">
                {!isAnalysisComplete && selectedCards.length > 0 && (
                  <SelectedCardsSlots
                    selectedCards={selectedCards}
                    shuffledCards={shuffledCards}
                    onUnselectCard={handleUnselectCard}
                  />
                )}
                <TarotDeck
                  shuffledCards={shuffledCards}
                  cardPositions={cardPositions}
                  selectedCards={selectedCards}
                  isShuffling={isShuffling}
                  isLoading={isAnalyzing}
                  toggleCardSelection={toggleCardSelection}
                  isCardSelected={isCardSelected}
                />
                <CardSelectionDialog
                  isConfirmationOpen={isSelectionModalOpen} // Changed from 'isConfirmationOpen'
                  setIsConfirmationOpen={setIsSelectionModalOpen} // Changed from 'setIsConfirmationOpen'
                  selectedCards={selectedCards}
                  shuffledCards={shuffledCards}
                  isLoading={isAnalyzing} // Changed from 'isLoading'
                  isShuffling={isShuffling}
                  onConfirmSelection={handleConfirmSelection}
                />
              </div>
            )}

            {/* Preview Card Layer Dialog */}
            <PreviewCardDialog
              card={previewCard} // Changed from 'cardName' and 'imageUrl'
              isOpen={!!previewCard}
              onOpenChange={(open) => !open && setPreviewCard(null)}
            />

            {/* Interpretations */}
            <CardInterpretations
              cardInterpretations={cardInterpretations}
              clearInterpretations={clearInterpretations}
              isOutputModalOpen={isOutputModalOpen}
              setIsOutputModalOpen={setIsOutputModalOpen}
              setSelectedCards={setSelectedCards}
              setQuestion={setQuestion}
              userInfo={userInfo}
              onRestart={() => {
                setStep('birth');
                setUserInfo({
                  name: '',
                  birthDate: '',
                  birthTime: '',
                  mbti: '',
                });
                setSelectedCards([]);
                setQuestion("");
                setCardInterpretations(null);
                setPreviewCard(null);
                setPreviewCardName(null);
                setIsOutputModalOpen(false);
              }}
            />
          </div>
        )}
      </div>
    </main>
  );
}
