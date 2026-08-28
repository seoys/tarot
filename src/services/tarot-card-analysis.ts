import { UserInfo } from "@/types/user-journey";

/**
 * Represents the data structure for a single Tarot card as expected
 * from the API response.
 */
export interface ApiTarotCardData {
  name: string;
  description: string;
  isReversed: boolean;
}

/**
 * Represents the overall Tarot reading result from the API, including the question asked
 * and the data for each card drawn. Matches the n8n expected output.
 */
export interface TarotCard {
  /**
   * The question that the user asked.
   */
  question: string;
  /**
   * An array containing the data for each analyzed Tarot card.
   */
  TarotCardData: ApiTarotCardData[]; // Use the specific API data structure
}

/**
 * Asynchronously analyzes a selection of Tarot cards based on a user's question
 * by calling an external API (n8n webhook).
 *
 * @param userInfo The collected user journey information (Birthdate & MBTI).
 * @param question The question the user asked for the reading.
 * @param cardsToAnalyze An array of objects, each containing the name and reversed status of a selected card.
 * @returns A promise that resolves to a TarotCard object containing the original question and the interpretation for each analyzed card. Returns a default empty structure on error.
 */
export async function analyzeTarotCards(
  userInfo: UserInfo,
  question: string,
  cardsToAnalyze: { name: string; isReversed: boolean }[]
): Promise<TarotCard> {
  if (process.env.NODE_ENV === "development") {
    console.log(
      "Sending to API:",
      JSON.stringify({ userInfo, question, TarotCardData: cardsToAnalyze })
    );
  }

  const response = await fetch(
    "https://n8n.sosigi.synology.me/webhook/f53fb29f-c619-4fc1-bd01-6c863e98eb12",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userInfo, question, TarotCardData: cardsToAnalyze }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(
      "Error fetching tarot card interpretations:",
      response.status,
      response.statusText,
      errorBody
    );
    throw new Error(
      `API Error: ${response.status} ${response.statusText} - ${errorBody}`
    );
  }

  const data: TarotCard = await response.json();
  return data;
}
