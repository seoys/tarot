
"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
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
} from "@/components/ui/alert-dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { analyzeTarotCards, TarotCard, TarotCardData as ApiTarotCardData } from "@/services/tarot-card-analysis";
import { cn } from "@/lib/utils"; // Import cn

const CARD_BACK_IMAGE = "/images/back.gif";

interface TarotCardDisplayData {
  name: string;
  imageUrl: string;
  isReversed?: boolean;
}

// Map API structure if needed, or use directly if it matches TarotCardDisplayData
const tarotCardsData: TarotCardDisplayData[] = [
    // Major Arcana
    { name: "The Fool", imageUrl: "/images/TheFool.jpg" },
    { name: "The Magician", imageUrl: "/images/TheMagician.jpg" },
    { name: "The High Priestess", imageUrl: "/images/TheHighPriestess.jpg" },
    { name: "The Empress", imageUrl: "/images/TheEmpress.jpg" },
    { name: "The Emperor", imageUrl: "/images/TheEmperor.jpg" },
    { name: "The Hierophant", imageUrl: "/images/TheHierophant.jpg" },
    { name: "The Lovers", imageUrl: "/images/TheLovers.jpg" },
    { name: "The Chariot", imageUrl: "/images/TheChariot.jpg" },
    { name: "Strength", imageUrl: "/images/Strength.jpg" },
    { name: "The Hermit", imageUrl: "/images/TheHermit.jpg" },
    { name: "Wheel of Fortune", imageUrl: "/images/WheelOfFortune.jpg" },
    { name: "Justice", imageUrl: "/images/Justice.jpg" },
    { name: "The Hanged Man", imageUrl: "/images/TheHangedMan.jpg" },
    { name: "Death", imageUrl: "/images/Death.jpg" },
    { name: "Temperance", imageUrl: "/images/Temperance.jpg" },
    { name: "The Devil", imageUrl: "/images/TheDevil.jpg" },
    { name: "The Tower", imageUrl: "/images/TheTower.jpg" },
    { name: "The Star", imageUrl: "/images/TheStar.jpg" },
    { name: "The Moon", imageUrl: "/images/TheMoon.jpg" },
    { name: "The Sun", imageUrl: "/images/TheSun.jpg" },
    { name: "Judgment", imageUrl: "/images/Judgement.jpg" }, // Note: Often spelled Judgement
    { name: "The World", imageUrl: "/images/TheWorld.jpg" },
    // Wands
    { name: "Ace of Wands", imageUrl: "/images/Wands01.jpg" },
    { name: "Two of Wands", imageUrl: "/images/Wands02.jpg" },
    { name: "Three of Wands", imageUrl: "/images/Wands03.jpg" },
    { name: "Four of Wands", imageUrl: "/images/Wands04.jpg" },
    { name: "Five of Wands", imageUrl: "/images/Wands05.jpg" },
    { name: "Six of Wands", imageUrl: "/images/Wands06.jpg" },
    { name: "Seven of Wands", imageUrl: "/images/Wands07.jpg" },
    { name: "Eight of Wands", imageUrl: "/images/Wands08.jpg" },
    { name: "Nine of Wands", imageUrl: "/images/Wands09.jpg" },
    { name: "Ten of Wands", imageUrl: "/images/Wands10.jpg" },
    { name: "Page of Wands", imageUrl: "/images/WandsPage.jpg" },
    { name: "Knight of Wands", imageUrl: "/images/WandsKnight.jpg" },
    { name: "Queen of Wands", imageUrl: "/images/WandsQueen.jpg" },
    { name: "King of Wands", imageUrl: "/images/WandsKing.jpg" },
    // Cups
    { name: "Ace of Cups", imageUrl: "/images/Cups01.jpg" },
    { name: "Two of Cups", imageUrl: "/images/Cups02.jpg" },
    { name: "Three of Cups", imageUrl: "/images/Cups03.jpg" },
    { name: "Four of Cups", imageUrl: "/images/Cups04.jpg" },
    { name: "Five of Cups", imageUrl: "/images/Cups05.jpg" },
    { name: "Six of Cups", imageUrl: "/images/Cups06.jpg" },
    { name: "Seven of Cups", imageUrl: "/images/Cups07.jpg" },
    { name: "Eight of Cups", imageUrl: "/images/Cups08.jpg" },
    { name: "Nine of Cups", imageUrl: "/images/Cups09.jpg" },
    { name: "Ten of Cups", imageUrl: "/images/Cups10.jpg" },
    { name: "Page of Cups", imageUrl: "/images/CupsPage.jpg" },
    { name: "Knight of Cups", imageUrl: "/images/CupsKnight.jpg" },
    { name: "Queen of Cups", imageUrl: "/images/CupsQueen.jpg" },
    { name: "King of Cups", imageUrl: "/images/CupsKing.jpg" },
    // Swords
    { name: "Ace of Swords", imageUrl: "/images/Swords01.jpg" },
    { name: "Two of Swords", imageUrl: "/images/Swords02.jpg" },
    { name: "Three of Swords", imageUrl: "/images/Swords03.jpg" },
    { name: "Four of Swords", imageUrl: "/images/Swords04.jpg" },
    { name: "Five of Swords", imageUrl: "/images/Swords05.jpg" },
    { name: "Six of Swords", imageUrl: "/images/Swords06.jpg" },
    { name: "Seven of Swords", imageUrl: "/images/Swords07.jpg" },
    { name: "Eight of Swords", imageUrl: "/images/Swords08.jpg" },
    { name: "Nine of Swords", imageUrl: "/images/Swords09.jpg" },
    { name: "Ten of Swords", imageUrl: "/images/Swords10.jpg" },
    { name: "Page of Swords", imageUrl: "/images/SwordsPage.jpg" },
    { name: "Knight of Swords", imageUrl: "/images/SwordsKnight.jpg" },
    { name: "Queen of Swords", imageUrl: "/images/SwordsQueen.jpg" },
    { name: "King of Swords", imageUrl: "/images/SwordsKing.jpg" },
    // Pentacles
    { name: "Ace of Pentacles", imageUrl: "/images/Pentacles01.jpg" },
    { name: "Two of Pentacles", imageUrl: "/images/Pentacles02.jpg" },
    { name: "Three of Pentacles", imageUrl: "/images/Pentacles03.jpg" },
    { name: "Four of Pentacles", imageUrl: "/images/Pentacles04.jpg" },
    { name: "Five of Pentacles", imageUrl: "/images/Pentacles05.jpg" },
    { name: "Six of Pentacles", imageUrl: "/images/Pentacles06.jpg" },
    { name: "Seven of Pentacles", imageUrl: "/images/Pentacles07.jpg" },
    { name: "Eight of Pentacles", imageUrl: "/images/Pentacles08.jpg" },
    { name: "Nine of Pentacles", imageUrl: "/images/Pentacles09.jpg" },
    { name: "Ten of Pentacles", imageUrl: "/images/Pentacles10.jpg" },
    { name: "Page of Pentacles", imageUrl: "/images/PentaclesPage.jpg" },
    { name: "Knight of Pentacles", imageUrl: "/images/PentaclesKnight.jpg" },
    { name: "Queen of Pentacles", imageUrl: "/images/PentaclesQueen.jpg" },
    { name: "King of Pentacles", imageUrl: "/images/PentaclesKing.jpg" }
];


function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleWithReversed(cards: TarotCardDisplayData[]): TarotCardDisplayData[] {
  return shuffleArray(cards).map(card => ({
    ...card,
    isReversed: Math.random() < 0.5
  }));
}

interface CardPosition {
  x: number;
  y: number;
  rotate: number;
}

const LoadingIndicator = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative animate-spin-slow">
        <Image src={CARD_BACK_IMAGE} alt="Loading..." width={100} height={150} className="rounded-lg shadow-lg" />
      </div>
       <p className="text-white text-xl ml-4 font-serif italic">카드를 읽는 중...</p>
    </div>
  );

export default function Home() {
  const [shuffledCards, setShuffledCards] = useState<TarotCardDisplayData[]>(tarotCardsData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cardInterpretations, setCardInterpretations] = useState<TarotCard | null>(null); // Initialize as null
  const [cardPositions, setCardPositions] = useState<Record<string, CardPosition>>({});
  const [isShuffling, setIsShuffling] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [question, setQuestion] = useState('');

  useEffect(() => {
    setShuffledCards(shuffleWithReversed(tarotCardsData));

    const positions: Record<string, CardPosition> = {};
    tarotCardsData.forEach((card, index) => {
      const angle = (index / tarotCardsData.length) * Math.PI * 2;
      const radius = 100; // Spread radius
      positions[card.name] = {
        x: radius * Math.cos(angle) + Math.random() * 50 - 25,
        y: radius * Math.sin(angle) + Math.random() * 50 - 25,
        rotate: Math.random() * 30 - 15,
      };
    });
    setCardPositions(positions);

    // Short timeout to apply initial positions, then clear for transition
    const timeout = setTimeout(() => {
      setCardPositions({});
    }, 100);

    return () => clearTimeout(timeout);

  }, [isShuffling]); // Rerun when isShuffling changes

  // Initial shuffle on mount
  useEffect(() => {
    handleShuffle(); // Use handleShuffle for consistency
  }, []);

  const handleShuffle = () => {
    setIsShuffling(true);
    setShuffledCards(shuffleWithReversed(tarotCardsData));
    setSelectedCards([]);
    setCardInterpretations(null); // Clear interpretations on shuffle
    setQuestion(''); // Clear question on shuffle

    // Reset shuffling state after animation duration
    setTimeout(() => setIsShuffling(false), 1000); // Adjust duration as needed
  };

  const toggleCardSelection = (cardName: string) => {
    if (isLoading || isShuffling) return; // Prevent selection during loading/shuffling

    if (selectedCards.includes(cardName)) {
      setSelectedCards(selectedCards.filter((name) => name !== cardName));
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, cardName]);
    }
  };

  const handleConfirmSelection = async () => {
    if (question === '') {
        alert('질문을 입력해주세요');
        setIsConfirmationOpen(false); // Close dialog
        return;
    }
    if (selectedCards.length === 0) {
        alert('카드를 선택해주세요.');
        setIsConfirmationOpen(false); // Close dialog
        return;
    }

    setIsConfirmationOpen(false);
    setIsLoading(true); // Start loading

    const selectedCardDetails: ApiTarotCardData[] = selectedCards.map(cardName => {
      const card = shuffledCards.find(c => c.name === cardName);
      return {
        name: cardName,
        isReversed: card?.isReversed || false
      };
    });

    try {
        const interpretationsResult: TarotCard = await analyzeTarotCards(question, selectedCardDetails);
        setCardInterpretations(interpretationsResult); // Set interpretations
    } catch (error) {
        console.error("Failed to analyze tarot cards:", error);
        alert("해석을 가져오는 중 오류가 발생했습니다."); // Show error to user
        setCardInterpretations(null); // Reset interpretations on error
    } finally {
        setIsLoading(false); // Stop loading regardless of success or failure
    }
  };


  const clearInterpretations = () => {
    setCardInterpretations(null);
  };

  const isCardSelected = (cardName: string) => selectedCards.includes(cardName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gradient-to-b from-background to-secondary">
      {isLoading && <LoadingIndicator />} {/* Show loading indicator */}

      <div className="w-full max-w-md mb-6 relative z-10 text-center">
        <Label htmlFor="question" className="text-foreground mb-2 block font-serif italic text-lg">
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

      <Button onClick={handleShuffle} className="mb-4 bg-secondary hover:bg-accent text-foreground relative z-10 shadow-md rounded-lg" disabled={isLoading || isShuffling}>
        카드 섞기
      </Button>

      <div className="relative w-full max-w-4xl h-96 mb-8 flex items-center justify-center">
        {shuffledCards.slice(0, 78).map((card, index) => ( // Show all 78 cards
          <div
            key={card.name}
            onClick={() => toggleCardSelection(card.name)}
            className={cn(
              "absolute transition-all duration-500 ease-out cursor-pointer hover:z-20 hover:scale-110",
              isCardSelected(card.name) ? 'ring-4 ring-primary ring-offset-2 ring-offset-background rounded-lg z-10 scale-105' : 'shadow-lg',
              isShuffling ? 'opacity-50' : 'opacity-100',
              isLoading || isShuffling ? 'pointer-events-none' : ''
            )}
            style={
                cardPositions[card.name]
                ? { // Position during shuffle animation
                    transform: `translate(${cardPositions[card.name].x}px, ${cardPositions[card.name].y}px) rotate(${cardPositions[card.name].rotate}deg)`,
                    zIndex: index, // Basic stacking during shuffle
                    transition: 'transform 0.5s ease-out, opacity 0.5s ease-out'
                  }
                : { // Position when laid out in a fan
                  transform: `rotate(${index * (360 / shuffledCards.slice(0, 78).length)}deg) translateY(-150px) rotate(-${index * (360 / shuffledCards.slice(0, 78).length)}deg) ${isCardSelected(card.name) ? 'scale(1.1)' : 'scale(1)'}`,
                  transformOrigin: 'center 150px', // Position cards around a central point
                  zIndex: isCardSelected(card.name) ? 30 : index,
                  transition: 'transform 0.3s ease-in-out, z-index 0.3s, box-shadow 0.3s, ring 0.3s'
                }
            }
          >
            <Image
              src={isCardSelected(card.name) ? card.imageUrl : CARD_BACK_IMAGE}
              alt={card.name}
              className={cn(
                  "rounded-md object-cover w-16 h-auto border border-black/30", // Slightly smaller cards for fan layout
                  card.isReversed && isCardSelected(card.name) ? 'rotate-180' : ''
              )}
              width={64} // Smaller width
              height={96} // Adjust height proportionally
              priority={index < 10} // Prioritize loading initial cards
            />
             {isCardSelected(card.name) && (
                <div className="absolute inset-0 bg-primary/20 rounded-md pointer-events-none"></div>
             )}
          </div>
        ))}
      </div>

      <div className="mt-4 relative z-10">
        <AlertDialog open={isConfirmationOpen} onOpenChange={setIsConfirmationOpen}>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-accent text-primary-foreground rounded-lg shadow-md"
              disabled={selectedCards.length === 0 || isLoading || isShuffling}
              onClick={() => setIsConfirmationOpen(true)} // Explicitly open dialog
            >
              선택 완료 ({selectedCards.length}/5)
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-background border-primary/50">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-primary">선택 확인</AlertDialogTitle>
              <AlertDialogDescription className="text-foreground/80">
                {selectedCards.length}장의 카드를 선택하셨습니다. 이 카드로 질문에 대한 해석을 진행할까요?
              </AlertDialogDescription>
            </AlertDialogHeader>
             <div className="flex justify-center gap-2 my-4 flex-wrap">
                {selectedCards.map(name => {
                     const card = shuffledCards.find(c => c.name === name);
                     return card ? (
                        <div key={name} className="flex flex-col items-center text-xs text-foreground/80">
                            <Image src={card.imageUrl} alt={name} width={40} height={60} className={`rounded ${card.isReversed ? 'rotate-180' : ''}`}/>
                            <span>{name}{card.isReversed ? '(R)' : ''}</span>
                        </div>
                     ) : null;
                })}
             </div>
            <AlertDialogFooter>
              <AlertDialogCancel className="text-foreground border-muted hover:bg-muted/50">다시 선택</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSelection} className="bg-primary hover:bg-primary/90">해석 보기</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {cardInterpretations && cardInterpretations.TarotCardData && cardInterpretations.TarotCardData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl p-6 bg-secondary/50 rounded-lg shadow-xl relative z-10 border border-primary/30">
          <h2 className="text-3xl font-semibold mb-6 text-center text-primary font-serif italic">카드 해석</h2>
           <p className="text-center text-lg mb-6 text-foreground/90">"{cardInterpretations.question}"</p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {cardInterpretations.TarotCardData.map((card, index) => {
              const displayCard = tarotCardsData.find(dc => dc.name === card.name);
              return (
                <Card key={index} className="bg-background/80 border-primary/30 shadow-lg transform hover:scale-105 transition-transform duration-300 flex flex-col">
                  <CardHeader className="items-center pb-2">
                    <Image src={displayCard?.imageUrl || CARD_BACK_IMAGE} alt={card.name} width={80} height={120} className={`rounded-md ${card.isReversed ? 'rotate-180' : ''}`} />
                    <CardTitle className="text-lg font-semibold mt-2 text-primary">{card.name}</CardTitle>
                    <CardDescription className="text-xs text-muted-foreground">{card.isReversed ? ' (역방향)' : ' (정방향)'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow pt-2">
                    <p className="text-foreground/90 text-sm">{card.description || "해석을 불러오는 중..."}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-8">
            <Button onClick={clearInterpretations} className="mt-4 bg-muted hover:bg-accent text-foreground rounded-lg shadow-md">
              해석 지우기
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
