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
 * @param question The question the user asked for the reading.
 * @param cardsToAnalyze An array of objects, each containing the name and reversed status of a selected card.
 * @returns A promise that resolves to a TarotCard object containing the original question and the interpretation for each analyzed card. Returns a default empty structure on error.
 */
export async function analyzeTarotCards(
  question: string,
  cardsToAnalyze: { name: string; isReversed: boolean }[]
): Promise<TarotCard> {
  console.log(
    "Sending to API:",
    JSON.stringify({ question, TarotCardData: cardsToAnalyze })
  ); // Log request body
  try {
    // Make sure the URL is correct and accessible
    const response = await fetch(
      "https://n8n.sosohappy.synology.me/webhook/f53fb29f-c619-4fc1-bd01-6c863e98eb12",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Add any necessary authorization headers if required by your n8n webhook
          // 'Authorization': 'Bearer YOUR_N8N_API_KEY', // Example
        },
        // Ensure the body structure matches what n8n expects based on its workflow trigger node.
        // It seems the previous structure { question, TarotCardData: cardsToAnalyze } was correct based on n8n logs.
        body: JSON.stringify({ question, TarotCardData: cardsToAnalyze }),
      }
    );

    console.log("API Response Status:", response.status); // Log response status

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
      ); // Throw an error to be caught below
    }

    // Assuming the n8n workflow returns data in the TarotCard structure directly
    const data: TarotCard = await response.json();
    console.log("Received data from API:", data); // Log received data
    return data;
  } catch (error) {
    console.error("Error during API call or processing:", error);
    // Return a default structure indicating failure but including the question
    return {
      question: question,
      TarotCardData: [],
    };
  }
}
