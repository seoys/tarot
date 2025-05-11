
"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  analyzeTarotCards,
  TarotCard,
  TarotCardData as ApiTarotCardData,
} from "@/services/tarot-card-analysis";
import { cn } from "@/lib/utils";

const CARD_BACK_IMAGE = "/images/back.gif";

interface TarotCardDisplayData {
  name: string;
  imageUrl: string;
  isReversed?: boolean;
}

const tarotCardsData: TarotCardDisplayData[] = [
  { name: "The Fool", imageUrl: "/images/the-fool.png" },
  { name: "The Magician", imageUrl: "/images/the-magician.png" },
  { name: "The High Priestess", imageUrl: "/images/the-high-priestess.png" },
  { name: "The Empress", imageUrl: "/images/the-empress.png" },
  { name: "The Emperor", imageUrl: "/images/the-emperor.png" },
  { name: "The Hierophant", imageUrl: "/images/the-heirophant.png" },
  { name: "The Lovers", imageUrl: "/images/the-lovers.png" },
  { name: "The Chariot", imageUrl: "/images/the-chariot.png" },
  { name: "Strength", imageUrl: "/images/strength.png" },
  { name: "The Hermit", imageUrl: "/images/the-hermit.png" },
  { name: "Wheel of Fortune", imageUrl: "/images/wheel-of-fortune.png" },
  { name: "Justice", imageUrl: "/images/justice.png" },
  { name: "The Hanged Man", imageUrl: "/images/the-hanged-man.png" },
  { name: "Death", imageUrl: "/images/death.png" },
  { name: "Temperance", imageUrl: "/images/temperance.png" },
  { name: "The Devil", imageUrl: "/images/the-devil.png" },
  { name: "The Tower", imageUrl: "/images/the-tower.png" },
  { name: "The Star", imageUrl: "/images/the-star.png" },
  { name: "The Moon", imageUrl: "/images/the-moon.png" },
  { name: "The Sun", imageUrl: "/images/the-sun.png" },
  { name: "Judgment", imageUrl: "/images/judgement.png" },
  { name: "The World", imageUrl: "/images/the-world.png" },
  { name: "Ace of Wands", imageUrl: "/images/ace-of-wands.png" },
  { name: "Two of Wands", imageUrl: "/images/two-of-wands.png" },
  { name: "Three of Wands", imageUrl: "/images/three-of-wands.png" },
  { name: "Four of Wands", imageUrl: "/images/four-of-wands.png" },
  { name: "Five of Wands", imageUrl: "/images/five-of-wands.png" },
  { name: "Six of Wands", imageUrl: "/images/six-of-wands.png" },
  { name: "Seven of Wands", imageUrl: "/images/seven-of-wands.png" },
  { name: "Eight of Wands", imageUrl: "/images/eight-of-wands.png" },
  { name: "Nine of Wands", imageUrl: "/images/nine-of-wands.png" },
  { name: "Ten of Wands", imageUrl: "/images/ten-of-wands.png" },
  { name: "Page of Wands", imageUrl: "/images/page-of-wands.png" },
  { name: "Knight of Wands", imageUrl: "/images/knight-of-wands.png" },
  { name: "Queen of Wands", imageUrl: "/images/queen-of-wands.png" },
  { name: "King of Wands", imageUrl: "/images/king-of-wands.png" },
  { name: "Ace of Cups", imageUrl: "/images/ace-of-cups.png" },
  { name: "Two of Cups", imageUrl: "/images/two-of-cups.png" },
  { name: "Three of Cups", imageUrl: "/images/three-of-cups.png" },
  { name: "Four of Cups", imageUrl: "/images/four-of-cups.png" },
  { name: "Five of Cups", imageUrl: "/images/five-of-cups.png" },
  { name: "Six of Cups", imageUrl: "/images/six-of-cups.png" },
  { name: "Seven of Cups", imageUrl: "/images/seven-of-cups.png" },
  { name: "Eight of Cups", imageUrl: "/images/eight-of-cups.png" },
  { name: "Nine of Cups", imageUrl: "/images/nine-of-cups.png" },
  { name: "Ten of Cups", imageUrl: "/images/ten-of-cups.png" },
  { name: "Page of Cups", imageUrl: "/images/page-of-cups.png" },
  { name: "Knight of Cups", imageUrl: "/images/knight-of-cups.png" },
  { name: "Queen of Cups", imageUrl: "/images/queen-of-cups.png" },
  { name: "King of Cups", imageUrl: "/images/king-of-cups.png" },
  { name: "Ace of Swords", imageUrl: "/images/ace-of-swords.png" },
  { name: "Two of Swords", imageUrl: "/images/two-of-swords.png" },
  { name: "Three of Swords", imageUrl: "/images/three-of-swords.png" },
  { name: "Four of Swords", imageUrl: "/images/four-of-swords.png" },
  { name: "Five of Swords", imageUrl: "/images/five-of-swords.png" },
  { name: "Six of Swords", imageUrl: "/images/six-of-swords.png" },
  { name: "Seven of Swords", imageUrl: "/images/seven-of-swords.png" },
  { name: "Eight of Swords", imageUrl: "/images/eight-of-swords.png" },
  { name: "Nine of Swords", imageUrl: "/images/nine-of-swords.png" },
  { name: "Ten of Swords", imageUrl: "/images/ten-of-swords.png" },
  { name: "Page of Swords", imageUrl: "/images/page-of-swords.png" },
  { name: "Knight of Swords", imageUrl: "/images/knight-of-swords.png" },
  { name: "Queen of Swords", imageUrl: "/images/queen-of-swords.png" },
  { name: "King of Swords", imageUrl: "/images/king-of-swords.png" },
  { name: "Ace of Pentacles", imageUrl: "/images/ace-of-pentacles.png" },
  { name: "Two of Pentacles", imageUrl: "/images/two-of-pentacles.png" },
  { name: "Three of Pentacles", imageUrl: "/images/three-of-pentacles.png" },
  { name: "Four of Pentacles", imageUrl: "/images/four-of-pentacles.png" },
  { name: "Five of Pentacles", imageUrl: "/images/five-of-pentacles.png" },
  { name: "Six of Pentacles", imageUrl: "/images/six-of-pentacles.png" },
  { name: "Seven of Pentacles", imageUrl: "/images/seven-of-pentacles.png" },
  { name: "Eight of Pentacles", imageUrl: "/images/eight-of-pentacles.png" },
  { name: "Nine of Pentacles", imageUrl: "/images/nine-of-pentacles.png" },
  { name: "Ten of Pentacles", imageUrl: "/images/ten-of-pentacles.png" },
  { name: "Page of Pentacles", imageUrl: "/images/page-of-pentacles.png" },
  { name: "Knight of Pentacles", imageUrl: "/images/knight-of-pentacles.png" },
  { name: "Queen of Pentacles", imageUrl: "/images/queen-of-pentacles.png" },
  { name: "King of Pentacles", imageUrl: "/images/king-of-pentacles.png" },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleWithReversed(
  cards: TarotCardDisplayData[]
): TarotCardDisplayData[] {
  return shuffleArray(cards).map((card) => ({
    ...card,
    isReversed: Math.random() < 0.5,
  }));
}

interface CardPosition {
  x: number;
  y: number;
  rotate: number;
  scale: number;
}

const LoadingIndicator = () => (
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

export default function Home() {
  const [shuffledCards, setShuffledCards] =
    useState<TarotCardDisplayData[]>(tarotCardsData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cardInterpretations, setCardInterpretations] =
    useState<TarotCard | null>(null);
  const [cardPositions, setCardPositions] = useState<
    Record<string, CardPosition>
  >({});
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [isOutputModalOpen, setIsOutputModalOpen] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      }
    };
    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  useEffect(() => {
    if (windowSize.width === 0 || windowSize.height === 0) return; // Don't run animations until window size is known

    let scatterTimeoutId: NodeJS.Timeout;
    let gatherTimeoutId: NodeJS.Timeout;

    if (isShuffling) {
      // Phase 1: Scatter
      const scatterPositions: Record<string, CardPosition> = {};
      shuffledCards.forEach((card) => {
        scatterPositions[card.name] = {
          x: (Math.random() - 0.5) * windowSize.width * 0.6,
          y: (Math.random() - 0.5) * windowSize.height * 0.4,
          rotate: Math.random() * 720 - 360,
          scale: 0.7 + Math.random() * 0.6,
        };
      });
      setCardPositions(scatterPositions);

      // Phase 2: Gather
      scatterTimeoutId = setTimeout(() => {
        const gatherPositions: Record<string, CardPosition> = {};
        shuffledCards.forEach((card) => {
          gatherPositions[card.name] = {
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 30,
            rotate: (Math.random() - 0.5) * 45,
            scale: 1,
          };
        });
        setCardPositions(gatherPositions);

        // Phase 3: End Shuffling (will trigger fan-out)
        gatherTimeoutId = setTimeout(() => {
          setIsShuffling(false);
        }, 500); // Duration for gather animation
      }, 500); // Duration for scatter animation
    } else {
      // Fan-out positioning
      const fanPositions: Record<string, CardPosition> = {};
      const cardsToFan = shuffledCards.slice(0, 78);
      const numCards = cardsToFan.length;

      const isSmallScreen = windowSize.width < 768;
      const fanArc = isSmallScreen ? 140 : 120;
      const radiusMultiplier = isSmallScreen ? 0.28 : 0.32;
      const fanRadius = Math.min(windowSize.width * radiusMultiplier, windowSize.height * 0.35);
      const yOffset = fanRadius * 0.7 - (windowSize.height * 0.1);


      cardsToFan.forEach((card, index) => {
        const angle = numCards > 1 ? (index - (numCards - 1) / 2) * (fanArc / (numCards - 1)) : 0;
        fanPositions[card.name] = {
          x: fanRadius * Math.sin((angle * Math.PI) / 180),
          y: -fanRadius * Math.cos((angle * Math.PI) / 180) + yOffset,
          rotate: angle,
          scale: 1,
        };
      });
      setCardPositions(fanPositions);
    }
    return () => {
        clearTimeout(scatterTimeoutId);
        clearTimeout(gatherTimeoutId);
    };
  }, [isShuffling, shuffledCards, windowSize]);

  const handleShuffle = useCallback(() => {
    setIsLoading(false); // Reset loading state
    setCardInterpretations(null); // Clear previous interpretations
    setSelectedCards([]); // Clear selected cards
    setQuestion(""); // Clear question

    const newShuffledDeck = shuffleWithReversed(tarotCardsData);
    setShuffledCards(newShuffledDeck);
    setIsShuffling(true); // Start shuffling animation sequence
  }, []);

  useEffect(() => {
    handleShuffle();
  }, [handleShuffle]);


  const toggleCardSelection = (cardName: string) => {
    if (isLoading || isShuffling) return;

    if (selectedCards.includes(cardName)) {
      setSelectedCards(selectedCards.filter((name) => name !== cardName));
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, cardName]);
    }
  };

  const handleConfirmSelection = async () => {
    if (question === "") {
      alert("질문을 입력해주세요");
      setIsConfirmationOpen(false);
      return;
    }
    if (selectedCards.length === 0) {
      alert("카드를 선택해주세요.");
      setIsConfirmationOpen(false);
      return;
    }

    setIsConfirmationOpen(false);
    setIsLoading(true);

    const selectedCardDetails: ApiTarotCardData[] = selectedCards.map(
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
        question,
        selectedCardDetails
      );
      setCardInterpretations(interpretationsResult);
    } catch (error) {
      console.error("Failed to analyze tarot cards:", error);
      alert("해석을 가져오는 중 오류가 발생했습니다.");
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
    } else if (cardInterpretations && cardInterpretations.TarotCardData && cardInterpretations.TarotCardData.length > 0) {
       // This condition handles the case where it's already processed TarotCard structure
       // No direct modal opening here unless you intend to show details differently
    }
  }, [cardInterpretations]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-secondary">
      {isLoading && <LoadingIndicator />}
      <div className="w-full max-w-md mb-6 relative z-10 text-center">
        <Label
          htmlFor="question"
          className="text-foreground mb-2 block font-serif italic text-lg"
        >
          무엇이 알고 싶으신가요?
        </Label>
        <Input
          id="question"
          placeholder="타로카드로 알아보고 싶은 질문을 입력해주세요"
          className="w-full bg-background/80 text-foreground text-center font-serif border-primary/50 focus:border-primary focus:ring-primary/50 rounded-lg shadow-inner"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={isLoading || isShuffling}
        />
      </div>
      <Button
        onClick={handleShuffle}
        className="mb-4 bg-secondary hover:bg-accent text-foreground relative z-10 shadow-md rounded-lg"
        disabled={isShuffling || isLoading}
      >
        {isShuffling ? "섞는 중..." : "카드 다시 섞기"}
      </Button>
      <div className="relative w-full max-w-4xl h-96 mb-8 flex items-center justify-center">
        {shuffledCards.slice(0, 78).map((card, index) => {
          const currentPosition = cardPositions[card.name] || { x:0, y:0, rotate:0, scale:1};
          const transitionDuration = isShuffling ? '0.5s' : '0.8s';
          return (
            <div
              key={card.name}
              onClick={() => toggleCardSelection(card.name)}
              className={cn(
                "absolute cursor-pointer hover:z-20 hover:scale-110",
                isCardSelected(card.name)
                  ? "ring-4 ring-primary ring-offset-2 ring-offset-background rounded-lg z-10 scale-105"
                  : "shadow-lg",
                isLoading || isShuffling
                  ? "pointer-events-none opacity-70"
                  : "opacity-100"
              )}
              style={{
                transform: `translate(${currentPosition.x}px, ${currentPosition.y}px) rotate(${currentPosition.rotate}deg) scale(${currentPosition.scale})`,
                zIndex: isCardSelected(card.name) ? 999 : index,
                transition: `transform ${transitionDuration} cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.5s ease-out, z-index 0.3s, box-shadow 0.3s, ring 0.3s`,
              }}
            >
              <Image
                src={
                  isCardSelected(card.name) || isShuffling
                    ? card.imageUrl
                    : CARD_BACK_IMAGE
                }
                alt={card.name}
                className={cn(
                  "rounded-md object-cover w-16 h-auto border border-black/30",
                  card.isReversed && (isCardSelected(card.name) || isShuffling)
                    ? "rotate-180"
                    : ""
                )}
                width={64}
                height={96}
                priority={index < 10}
                data-ai-hint="tarot card"
              />
              {isCardSelected(card.name) && (
                <div className="absolute inset-0 bg-primary/20 rounded-md pointer-events-none"></div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-4 relative z-10">
        <AlertDialog
          open={isConfirmationOpen}
          onOpenChange={setIsConfirmationOpen}
        >
          <AlertDialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-accent text-primary-foreground rounded-lg shadow-md"
              disabled={selectedCards.length === 0 || isLoading || isShuffling}
              onClick={() => setIsConfirmationOpen(true)}
            >
              선택 완료 ({selectedCards.length}/5)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border-primary/50 z-[2000]">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-primary">
                선택 확인
              </AlertDialogTitle>
              <AlertDialogDescription className="text-foreground/80">
                {selectedCards.length}장의 카드를 선택하셨습니다. 이 카드로
                질문에 대한 해석을 진행할까요?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="flex justify-center gap-2 my-4 flex-wrap">
              {selectedCards.map((name) => {
                const card = shuffledCards.find((c) => c.name === name);
                return card ? (
                  <div
                    key={name}
                    className="flex flex-col items-center text-xs text-foreground/80"
                  >
                    <Image
                      src={card.imageUrl}
                      alt={name}
                      width={40}
                      height={60}
                      className={`rounded ${
                        card.isReversed ? "rotate-180" : ""
                      }`}
                      data-ai-hint="tarot card selected"
                    />
                    <span>
                      {name}
                      {card.isReversed ? "(R)" : ""}
                    </span>
                  </div>
                ) : null;
              })}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-foreground border-muted hover:bg-muted/50">
                다시 선택
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmSelection}
                className="bg-primary hover:bg-primary/90"
              >
                해석 보기
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      {cardInterpretations &&
        cardInterpretations.TarotCardData &&
        cardInterpretations.TarotCardData.length > 0 && (
          <div className="mt-8 w-full max-w-4xl p-6 bg-secondary/50 rounded-lg shadow-xl relative z-10 border border-primary/30">
            <h2 className="text-3xl font-semibold mb-6 text-center text-primary font-serif italic">
              카드 해석
            </h2>
            <p className="text-center text-lg mb-6 text-foreground/90">
              "{cardInterpretations.question}"
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {cardInterpretations.TarotCardData.map((card, index) => {
                const displayCard = tarotCardsData.find(
                  (dc) => dc.name === card.name
                );
                return (
                  <Card
                    key={index}
                    className="bg-background/80 border-primary/30 shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col"
                  >
                    <CardHeader className="items-center pb-2">
                      <Image
                        src={displayCard?.imageUrl || CARD_BACK_IMAGE}
                        alt={card.name}
                        width={80}
                        height={120}
                        className={`rounded-md ${
                          card.isReversed ? "rotate-180" : ""
                        }`}
                        data-ai-hint="tarot card interpretation"
                      />
                      <CardTitle className="text-lg font-semibold mt-2 text-primary">
                        {card.name}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        {card.isReversed ? " (역방향)" : " (정방향)"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow pt-2">
                      <p className="text-foreground/90 text-sm">
                        {card.description || "해석을 불러오는 중..."}
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            <div className="text-center mt-8">
              <Button
                onClick={clearInterpretations}
                className="mt-4 bg-muted hover:bg-accent text-foreground rounded-lg shadow-md"
              >
                해석 지우기
              </Button>
            </div>
          </div>
        )}
      {cardInterpretations &&
        Array.isArray(cardInterpretations) &&
        cardInterpretations[0]?.output &&
        isOutputModalOpen && (
          <div className="fixed inset-0 z-[4000] flex items-center justify-center bg-gradient-to-br from-black/70 via-primary/60 to-secondary/70 backdrop-blur-sm">
            <div className="relative bg-gradient-to-br from-background via-primary/20 to-secondary/30 border-2 border-primary/40 rounded-2xl shadow-2xl p-8 max-w-lg w-full max-h-[70vh] overflow-y-auto text-xs flex flex-col">
              <button
                className="absolute top-3 right-4 text-primary/70 hover:text-primary text-2xl font-bold"
                onClick={() => {
                  setIsOutputModalOpen(false);
                  setSelectedCards([]);
                  setCardInterpretations(null);
                  setQuestion("");
                }}
                aria-label="닫기"
              >
                ×
              </button>
              <h3 className="text-xl font-bold text-primary mb-4 text-center drop-shadow">
                🃏 타로 해석 결과
              </h3>
              <div className="whitespace-pre-line text-foreground leading-relaxed flex-1 text-sm">
                {highlightOutput(cardInterpretations[0].output)}
              </div>
              <button
                className="mt-6 w-full py-2 rounded-lg bg-primary text-white font-semibold text-base hover:bg-primary/80 transition"
                onClick={() => {
                  setIsOutputModalOpen(false);
                  setSelectedCards([]);
                  setCardInterpretations(null);
                  setQuestion("");
                }}
              >
                닫기
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

function highlightOutput(text: string) {
  const bolded = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  const italicized = bolded.replace(/_(.+?)_/g, "<i>$1</i>");
  const newlines = italicized.replace(/\n/g, "<br />");
  return <span dangerouslySetInnerHTML={{ __html: newlines }} />;
}
