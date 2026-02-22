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
        title: "질문을 입력해주세요",
        description: "타로카드에게 물어볼 질문이 필요합니다.",
      });
      setIsConfirmationOpen(false);
      return;
    }
    if (selectedCards.length === 0) {
      toast({
        variant: "destructive",
        title: "카드를 선택해주세요",
        description: "해석을 위해 최소 1장의 카드를 선택해야 합니다.",
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
        title: "오류가 발생했습니다",
        description: "해석을 가져오는 중 문제가 생겼습니다. 다시 시도해주세요.",
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
    if (isLoading) return "카드의 메시지를 해석하고 있습니다...";
    if (isShuffling) return "카드를 섞고 있습니다...";
    if (question.trim() === "") return "먼저 타로카드에게 물어볼 질문을 입력해주세요.";
    if (selectedCards.length === 0) return "직관이 이끄는 대로 카드를 선택해주세요. (3장 또는 5장)";
    if (selectedCards.length > 0) return "선택 완료 버튼을 눌러 카드의 의미를 확인해보세요.";
    return "카드를 섞고 질문을 집중해 보세요.";
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
    <main className="min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-8 md:p-24 overflow-hidden bg-background selection:bg-primary/30">
      {/* Mystic Background Glows */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/20 blur-[100px] rounded-full pointer-events-none" />

      {/* Funnel Router */}
      <div className="w-full max-w-7xl relative z-10 flex flex-col items-center">

        {step === 'birth' && (
          <BirthdateStep onComplete={handleBirthdateComplete} />
        )}

        {step === 'mbti' && (
          <MbtiQuizStep onComplete={handleMbtiComplete} />
        )}

        {step === 'tarot' && (
          <div className="w-full flex flex-col items-center animate-in fade-in zoom-in-95 duration-700">
            {/* Title Section */}
            <div className="text-center mb-12 relative">
              <h1 className="text-5xl md:text-7xl font-serif tracking-tight text-primary-foreground drop-shadow-[0_0_15px_rgba(139,92,246,0.5)] mb-4">
                Tarotal
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground font-light max-w-xl mx-auto leading-relaxed">
                {userInfo.mbti}의 기운을 담아, 당신의 무의식이 이끄는 5장의 카드를 선택하세요.
              </p>
            </div>

            {/* Question Input */}
            {!isAnalysisComplete && (
              <QuestionInput
                question={question}
                setQuestion={setQuestion}
                isLoading={isAnalyzing || selectedCards.length > 0}
                isShuffling={isShuffling}
              />
            )}

            {/* Controls */}
            {!isAnalysisComplete && selectedCards.length === 0 && (
              <div className="mb-12">
                <Button
                  onClick={shuffleCards}
                  disabled={isShuffling}
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-8 py-6 text-lg tracking-wider transition-all duration-300 hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:scale-105 active:scale-95"
                >
                  {isShuffling ? "우주의 기운을 모으는 중..." : "카드 섞기"}
                </Button>
              </div>
            )}

            {/* Loading Indicator */}
            {isAnalyzing && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
                <LoadingIndicator />
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
