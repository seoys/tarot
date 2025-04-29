/**
 * Represents a Tarot card with its name and interpretation.
 */
export interface TarotCard {
  /**
   * The question that the user asked.
   */
  question: string;
  /**
   * The data of the Tarot card.
   */
  TarotCardData: TarotCardData[];
}

interface TarotCardData {
  name: string;
  isReversed: boolean;
}

/**
 * Asynchronously analyzes a selection of Tarot cards.
 *
 * @param cardNames An array of Tarot card names to analyze.
 * @returns A promise that resolves to an array of TarotCard objects containing the interpretation for each card.
 */
export async function analyzeTarotCards(question: string, TarotCardData: TarotCardData[]): Promise<TarotCard> {
  try {
    const response = await fetch('https://n8n.sosohappy.synology.me/webhook-test/f53fb29f-c619-4fc1-bd01-6c863e98eb12', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ question, TarotCardData }),
    });
    if (!response.ok) {
      console.error('Error fetching tarot card interpretations:', response.status);
      return {
        question: '',
        TarotCardData: []
      };
    }
    const data: TarotCard = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tarot card interpretations:', error);
    return {
      question: '',
      TarotCardData: []
    };
  }
}
