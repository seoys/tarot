"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
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

const tarotCardsData = [
  { name: "The Fool", imageUrl: "https://picsum.photos/200/300" },
  { name: "The Magician", imageUrl: "https://picsum.photos/200/301" },
  { name: "The High Priestess", imageUrl: "https://picsum.photos/200/302" },
  { name: "The Empress", imageUrl: "https://picsum.photos/200/303" },
  { name: "The Emperor", imageUrl: "https://picsum.photos/200/304" },
  { name: "The Hierophant", imageUrl: "https://picsum.photos/200/305" },
  { name: "The Lovers", imageUrl: "https://picsum.photos/200/306" },
  { name: "The Chariot", imageUrl: "https://picsum.photos/200/307" },
  { name: "Strength", imageUrl: "https://picsum.photos/200/308" },
  { name: "The Hermit", imageUrl: "https://picsum.photos/200/309" },
  { name: "Wheel of Fortune", imageUrl: "https://picsum.photos/200/310" },
  { name: "Justice", imageUrl: "https://picsum.photos/200/311" },
  { name: "The Hanged Man", imageUrl: "https://picsum.photos/200/312" },
  { name: "Death", imageUrl: "https://picsum.photos/200/313" },
  { name: "Temperance", imageUrl: "https://picsum.photos/200/314" },
  { name: "The Devil", imageUrl: "https://picsum.photos/200/315" },
  { name: "The Tower", imageUrl: "https://picsum.photos/200/316" },
  { name: "The Star", imageUrl: "https://picsum.photos/200/317" },
  { name: "The Moon", imageUrl: "https://picsum.photos/200/318" },
  { name: "The Sun", imageUrl: "https://picsum.photos/200/319" },
  { name: "Judgment", imageUrl: "https://picsum.photos/200/320" },
  { name: "The World", imageUrl: "https://picsum.photos/200/321" },
];

function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export default function Home() {
  const [shuffledCards, setShuffledCards] = useState(tarotCardsData);
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [cardInterpretations, setCardInterpretations] = useState<TarotCard[]>([]);

  useEffect(() => {
    setShuffledCards(shuffleArray(tarotCardsData));
  }, []);

  const handleShuffle = () => {
    setShuffledCards(shuffleArray(tarotCardsData));
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
    setIsConfirmationOpen(false);
    const interpretations = await analyzeTarotCards(selectedCards);
    setCardInterpretations(interpretations);
  };

  const clearInterpretations = () => {
    setCardInterpretations([]);
  };

  const isCardSelected = (cardName: string) => selectedCards.includes(cardName);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-3xl font-semibold mb-4 text-gold-500">Tarot Reader</h1>

      <Button onClick={handleShuffle} className="mb-4 bg-secondary hover:bg-accent text-foreground">Shuffle Cards</Button>

      <div className="grid grid-cols-5 gap-4">
        {shuffledCards.map((card) => (
          <div
            key={card.name}
            className={`relative rounded-md shadow-md cursor-pointer transition-transform duration-200 ${
              isCardSelected(card.name) ? 'transform rotate-3' : ''
            }`}
            onClick={() => toggleCardSelection(card.name)}
          >
            <img
              src={card.imageUrl}
              alt={card.name}
              className="rounded-md w-40 h-60 object-cover"
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
                You have selected {selectedCards.length} cards. Are you sure you want to proceed?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsConfirmationOpen(false)}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirmSelection}>Confirm</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {cardInterpretations.length > 0 && (
        <div className="mt-8 w-full max-w-4xl">
          <h2 className="text-2xl font-semibold mb-4 text-gold-500">Card Interpretations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cardInterpretations.map((card, index) => (
              <Card key={index} className="bg-secondary">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">{card.name}</CardTitle>
                  <CardDescription>Interpretation</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>{card.interpretation}</p>
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
