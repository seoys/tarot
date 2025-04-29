/**
 * Represents a Tarot card with its name and interpretation.
 */
export interface TarotCard {
  /**
   * The name of the Tarot card.
   */
  name: string;
  /**
   * A brief interpretation of the Tarot card.
   */
  interpretation: string;
}

/**
 * Asynchronously analyzes a selection of Tarot cards.
 *
 * @param cardNames An array of Tarot card names to analyze.
 * @returns A promise that resolves to an array of TarotCard objects containing the interpretation for each card.
 */
export async function analyzeTarotCards(cardNames: string[]): Promise<TarotCard[]> {
  try {
    const response = await fetch('/api/tarot', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ cardNames }),
    });
    if (!response.ok) {
      console.error('Error fetching tarot card interpretations:', response.status);
      return [];
    }
    const data: TarotCard[] = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching tarot card interpretations:', error);
    return [];
  }
}
