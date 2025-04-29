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

import { analyzeTarotCards, TarotCard } from "@/services/tarot-card-analysis";

const CARD_BACK_IMAGE = "/images/back.gif";

interface TarotCardData {
  name: string;
  imageUrl: string;
  isReversed?: boolean;
}

const tarotCardsData: TarotCardData[] = [
  { name: "The Fool", imageUrl: "/images/the-fool.png" },
  { name: "The Magician", imageUrl: "/images/the-magician.png" },
  { name: "The High Priestess", imageUrl: "/images/the-high-priestess.png" },
  { name: "The Empress", imageUrl: "/images/the-empress.png" },
  { name: "The Emperor", imageUrl: "/images/the-emperor.png" },
  { name: "The Hierophant", imageUrl: "/images/the-hierophant.png" },
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
  { name: "King of Wands", imageUrl: "/images/king-of-wands.png" }
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function shuffleWithReversed(cards: TarotCardData[]): TarotCardData[] {
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

export default function Home() {
  const [shuffledCards, setShuffledCards] = useState<TarotCardData[]>(tarotCardsData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cardInterpretations, setCardInterpretations] = useState<TarotCard>();
  const [cardPositions, setCardPositions] = useState<Record<string, CardPosition>>({});
  const [isShuffling, setIsShuffling] = useState(false);
  const [question, setQuestion] = useState('');
  useEffect(() => {
    setShuffledCards(shuffleWithReversed(tarotCardsData));

    const positions: Record<string, CardPosition> = {};
    tarotCardsData.forEach((card, index) => {
      const angle = (index / tarotCardsData.length) * Math.PI * 2;
      const radius = 100;
      positions[card.name] = {
        x: radius * Math.cos(angle) + Math.random() * 50 - 25,
        y: radius * Math.sin(angle) + Math.random() * 50 - 25,
        rotate: Math.random() * 30 - 15,
      };
    });
    setCardPositions(positions);

    const timeout = setTimeout(() => {
      setCardPositions({});
    }, 100);

    return () => clearTimeout(timeout);

  }, [isShuffling]);

  useEffect(() => {
    if(!isShuffling){
        setShuffledCards(shuffleWithReversed(tarotCardsData));
    }
  }, []);

  const handleShuffle = () => {
    setShuffledCards(shuffleWithReversed(tarotCardsData));
    setSelectedCards([]);
  };

  const toggleCardSelection = (cardName: string) => {
    if (selectedCards.includes(cardName)) {
      setSelectedCards(selectedCards.filter((name) => name !== cardName));
    } else if (selectedCards.length < 5) {
      setSelectedCards([...selectedCards, cardName]);
    }
  };

  const handleConfirmSelection = async () => {
    if(question === ''){
      alert('질문을 입력해주세요');
      return;
    }
    setIsConfirmationOpen(false);

    const selectedCardDetails = selectedCards.map(cardName => {
      const card = shuffledCards.find(c => c.name === cardName);
      return {
        name: cardName,
        isReversed: card?.isReversed || false
      };
    });


    const interpretations = await analyzeTarotCards(question, selectedCardDetails);

    setCardInterpretations(interpretations);
  };

  const clearInterpretations = () => {
    setCardInterpretations({
      question: '',
      TarotCardData: []
    });
  };

  const isCardSelected = (cardName: string) => selectedCards.includes(cardName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md mb-6 relative z-10 text-center">
        <Label htmlFor="question" className="text-foreground mb-2 block font-serif italic">
          무엇이 알고 싶으신가요?
        </Label>
        <Input
          id="question"
          placeholder="타로카드로 알아보고 싶은 질문을 입력해주세요"
          className="w-full bg-background text-foreground text-center font-serif"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
      </div>

      <Button onClick={() => {
        setIsShuffling(true);
        setTimeout(() => setIsShuffling(false), 1000)
      }} className="mb-4 bg-secondary hover:bg-accent text-foreground relative z-10">Shuffle Cards</Button>

      

      <div className={`grid grid-cols-5 gap-4 transition-all duration-1000 ${isShuffling ? 'opacity-50' : 'opacity-100'}`}>
        {shuffledCards.map((card) => (
          <div
            style={cardPositions[card.name] ? { transform: `translate(${cardPositions[card.name].x}px, ${cardPositions[card.name].y}px) rotate(${cardPositions[card.name].rotate}deg)` } : {}}
            key={card.name}
            className={`relative rounded-md shadow-md cursor-pointer transition-transform duration-200 ${
              isCardSelected(card.name) ? 'transform rotate-3' : ''
            }`}
            onClick={() => toggleCardSelection(card.name)}
          >
            <Image
              src={isCardSelected(card.name) ? card.imageUrl : CARD_BACK_IMAGE}
              alt={card.name}
              className={`rounded-md object-cover ${card.isReversed && isCardSelected(card.name) ? 'rotate-180' : ''}`}
              width={160}
              height={240}
            />

            {isCardSelected(card.name) && (
              <div className="absolute inset-0 bg-gold-500 opacity-20 rounded-md"></div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-accent text-background"
              disabled={selectedCards.length === 0}
              onClick={() => setIsConfirmationOpen(true)}
            >
              Confirm Selection
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Card Selection</AlertDialogTitle>
              <AlertDialogDescription>
                {selectedCards.length}장의 카드를 선택하셨습니다. 진행하시겠습니까?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirmationOpen(false)}>다시 선택</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSelection}>진행</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {cardInterpretations && cardInterpretations.TarotCardData && cardInterpretations.TarotCardData.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Card Interpretations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardInterpretations.TarotCardData.map((card, index) => (
              <Card key={index} className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{card.name}</CardTitle>
                  <CardDescription>Interpretation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{card.isReversed ? '역방향' : '정방향'}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <Button onClick={clearInterpretations} className="mt-4 bg-muted hover:bg-accent text-foreground">
            Clear Interpretations
          </Button>
        </div>
      )}
    </div>
  );
}
