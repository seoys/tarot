import { useState, useMemo, useEffect } from "react";
import {
    TarotCardDisplayData,
    CardPosition,
    WindowDimensions,
} from "../lib/tarot-data";

export type ShuffleVariantId = "burst" | "spiral" | "cascade";

export interface ShuffleStep {
    delay: number;
    positions: Record<string, CardPosition>;
}

export interface ShuffleSequence {
    steps: ShuffleStep[];
    totalDuration: number;
}

export interface ShuffleVariant {
    id: ShuffleVariantId;
    createSequence: (
        cards: TarotCardDisplayData[],
        viewport: WindowDimensions
    ) => ShuffleSequence;
}

const buildPositions = (
    cards: TarotCardDisplayData[],
    factory: (card: TarotCardDisplayData, index: number) => CardPosition
): Record<string, CardPosition> => {
    const positions: Record<string, CardPosition> = {};
    cards.forEach((card, index) => {
        positions[card.name] = factory(card, index);
    });
    return positions;
};

export const SHUFFLE_VARIANTS: ShuffleVariant[] = [
    {
        id: "burst",
        createSequence: (cards, viewport) => {
            const safeWidth = Math.max(viewport.width, 1);
            const safeHeight = Math.max(viewport.height, 1);
            const aspectRatio = safeHeight / safeWidth;

            const scatter = buildPositions(cards, () => {
                const angle = Math.random() * Math.PI * 2;
                const radius = safeWidth * (0.3 + Math.random() * 0.4);
                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius * aspectRatio * 0.8,
                    rotate: (Math.random() - 0.5) * 1080,
                    rotateX: (Math.random() - 0.5) * 720,
                    rotateY: (Math.random() - 0.5) * 720,
                    scale: 0.45 + Math.random() * 0.55,
                };
            });

            const overshoot = buildPositions(cards, () => ({
                x: (Math.random() - 0.5) * 120,
                y: (Math.random() - 0.5) * 120,
                rotate: (Math.random() - 0.5) * 240,
                rotateX: (Math.random() - 0.5) * 180,
                rotateY: (Math.random() - 0.5) * 180,
                scale: 1.1 + Math.random() * 0.25,
            }));

            const gather = buildPositions(cards, () => ({
                x: (Math.random() - 0.5) * 20,
                y: (Math.random() - 0.5) * 20,
                rotate: (Math.random() - 0.5) * 35,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
            }));

            return {
                steps: [
                    { delay: 0, positions: scatter },
                    { delay: 800, positions: overshoot },
                    { delay: 1250, positions: gather },
                ],
                totalDuration: 1650,
            };
        },
    },
    {
        id: "spiral",
        createSequence: (cards, viewport) => {
            const safeWidth = Math.max(viewport.width, 1);
            const safeHeight = Math.max(viewport.height, 1);
            const maxRadius = Math.min(safeWidth, safeHeight) * 0.45;
            const angleStep = (Math.PI * 5) / Math.max(cards.length, 1);

            const spiralScatter = buildPositions(cards, (_card, index) => {
                const angle = index * angleStep + Math.random() * 0.8;
                const radius =
                    maxRadius * (index / Math.max(cards.length - 1, 1)) +
                    Math.random() * 30;
                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius * 0.8,
                    rotate: (angle * 180) / Math.PI + (Math.random() - 0.5) * 120,
                    rotateX: (Math.random() - 0.5) * 360,
                    rotateY: (Math.random() - 0.5) * 360,
                    scale: 0.6 + (index % 5) * 0.08,
                };
            });

            const swirl = buildPositions(cards, (_card, index) => {
                const angle = index * angleStep + Math.PI / 2;
                const radius = maxRadius * 0.5 + Math.random() * 40;
                return {
                    x: Math.cos(angle) * radius,
                    y: Math.sin(angle) * radius * 0.6,
                    rotate: (Math.random() - 0.5) * 180,
                    rotateX: (Math.random() - 0.5) * 90,
                    rotateY: (Math.random() - 0.5) * 90,
                    scale: 0.9 + (Math.random() - 0.5) * 0.2,
                };
            });

            const gather = buildPositions(cards, () => ({
                x: (Math.random() - 0.5) * 22,
                y: (Math.random() - 0.5) * 22,
                rotate: (Math.random() - 0.5) * 25,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
            }));

            return {
                steps: [
                    { delay: 0, positions: spiralScatter },
                    { delay: 650, positions: swirl },
                    { delay: 1150, positions: gather },
                ],
                totalDuration: 1600,
            };
        },
    },
    {
        id: "cascade",
        createSequence: (cards, viewport) => {
            const safeWidth = Math.max(viewport.width, 1);
            const safeHeight = Math.max(viewport.height, 1);
            const columns = Math.max(Math.ceil(Math.sqrt(cards.length)), 1);
            const rows = Math.max(Math.ceil(cards.length / columns), 1);
            const horizontalSpan = safeWidth * 0.65;
            const verticalSpan = safeHeight * 0.55;
            const columnDenominator = Math.max(columns - 1, 1);
            const rowDenominator = Math.max(rows - 1, 1);
            const cellWidth = horizontalSpan / columnDenominator;
            const cellHeight = verticalSpan / rowDenominator;
            const startX = -horizontalSpan / 2;
            const startY = -verticalSpan / 2;

            const gridScatter = buildPositions(cards, (_card, index) => {
                const col = index % columns;
                const row = Math.floor(index / columns);
                return {
                    x:
                        startX +
                        col * cellWidth +
                        (Math.random() - 0.5) * cellWidth * 0.4,
                    y:
                        startY +
                        row * cellHeight +
                        (Math.random() - 0.5) * cellHeight * 0.4,
                    rotate: (Math.random() - 0.5) * 160,
                    rotateX: (Math.random() - 0.5) * 720,
                    rotateY: (Math.random() - 0.5) * 720,
                    scale: 0.7 + Math.random() * 0.3,
                };
            });

            const wave = buildPositions(cards, (_card, index) => {
                const progress = index / Math.max(cards.length - 1, 1);
                const angle = progress * Math.PI * 4;
                const amplitude = safeHeight * 0.15 + Math.random() * 20;
                const x = startX + progress * horizontalSpan;
                return {
                    x,
                    y: Math.sin(angle) * amplitude + (Math.random() - 0.5) * 40,
                    rotate: Math.cos(angle) * 45,
                    rotateX: Math.sin(angle) * 90,
                    rotateY: Math.cos(angle) * 90,
                    scale: 0.85 + Math.sin(angle + Math.PI / 4) * 0.1,
                };
            });

            const gather = buildPositions(cards, () => ({
                x: (Math.random() - 0.5) * 18,
                y: (Math.random() - 0.5) * 18,
                rotate: (Math.random() - 0.5) * 28,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
            }));

            return {
                steps: [
                    { delay: 0, positions: gridScatter },
                    { delay: 600, positions: wave },
                    { delay: 1100, positions: gather },
                ],
                totalDuration: 1550,
            };
        },
    },
];

export function shuffleArray<T>(array: T[]): T[] {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

export function shuffleWithReversed(
    cards: TarotCardDisplayData[]
): TarotCardDisplayData[] {
    return shuffleArray(cards).map((card) => ({
        ...card,
        isReversed: Math.random() < 0.5,
    }));
}

export function useTarotShuffle(
    shuffledCards: TarotCardDisplayData[],
    windowSize: WindowDimensions,
    isShuffling: boolean,
    setIsShuffling: (val: boolean) => void,
    shuffleVariantId: ShuffleVariantId
) {
    const [cardPositions, setCardPositions] = useState<
        Record<string, CardPosition>
    >({});

    const activeShuffleVariant = useMemo(() => {
        const fallback = SHUFFLE_VARIANTS[0];
        return (
            SHUFFLE_VARIANTS.find((variant) => variant.id === shuffleVariantId) ||
            fallback
        );
    }, [shuffleVariantId]);

    useEffect(() => {
        if (windowSize.width === 0 || windowSize.height === 0) return;

        if (isShuffling) {
            const { steps, totalDuration } = activeShuffleVariant.createSequence(
                shuffledCards,
                windowSize
            );

            if (!steps.length) {
                setIsShuffling(false);
                return;
            }

            const sortedSteps = steps.slice().sort((a, b) => a.delay - b.delay);
            const [firstStep, ...remainingSteps] = sortedSteps;
            const timeouts: NodeJS.Timeout[] = [];

            if (firstStep.delay <= 0) {
                setCardPositions(firstStep.positions);
            } else {
                const initialTimeout = setTimeout(() => {
                    setCardPositions(firstStep.positions);
                }, firstStep.delay);
                timeouts.push(initialTimeout);
            }

            remainingSteps.forEach((step) => {
                const timeoutId = setTimeout(() => {
                    setCardPositions(step.positions);
                }, step.delay);
                timeouts.push(timeoutId);
            });

            const completionTimeout = setTimeout(() => {
                setIsShuffling(false);
            }, totalDuration);
            timeouts.push(completionTimeout);

            return () => {
                timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
            };
        }

        const fanPositions: Record<string, CardPosition> = {};
        const cardsToFan = shuffledCards.slice(0, 78);
        const numCards = cardsToFan.length;

        const isSmallScreen = windowSize.width < 768;
        // 덱 컨테이너 높이(h-[22rem] / sm:h-96)에 맞춰 부채꼴 크기를 제한한다.
        const deckHeight = isSmallScreen ? 352 : 384;
        const fanArc = isSmallScreen ? 140 : 132;
        const radiusMultiplier = isSmallScreen ? 0.28 : 0.24;
        const fanRadius = Math.min(
            windowSize.width * radiusMultiplier,
            isSmallScreen ? windowSize.height * 0.35 : deckHeight * 0.66
        );
        const halfArcRad = (fanArc / 2) * (Math.PI / 180);
        const yOffset = isSmallScreen
            ? fanRadius * 0.7 - windowSize.height * 0.1
            : // PC: 부채꼴의 세로 중앙이 컨테이너 중앙에 오도록 정렬 (아래쪽 빈 공간 제거)
              (fanRadius * (1 + Math.cos(halfArcRad))) / 2;

        cardsToFan.forEach((card, index) => {
            const angle =
                numCards > 1
                    ? (index - (numCards - 1) / 2) * (fanArc / (numCards - 1))
                    : 0;
            fanPositions[card.name] = {
                x: fanRadius * Math.sin((angle * Math.PI) / 180),
                y: -fanRadius * Math.cos((angle * Math.PI) / 180) + yOffset,
                rotate: angle,
                rotateX: 0,
                rotateY: 0,
                scale: 1,
            };
        });

        setCardPositions(fanPositions);
    }, [activeShuffleVariant, isShuffling, shuffledCards, windowSize, setIsShuffling]);

    return cardPositions;
}
