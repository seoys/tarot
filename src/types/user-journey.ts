// src/types/user-journey.ts

export interface UserInfo {
    name: string;
    birthDate: string; // YYYY-MM-DD
    birthTime?: string; // HH:MM (Optional)
    mbti?: string; // e.g., "INTJ", "ENFP" (calculated in step 2)
}

export type FunnelStep = 'birth' | 'mbti' | 'tarot';

export interface MbtiQuestion {
    id: number;
    indicator: 'E-I' | 'S-N' | 'T-F' | 'J-P'; // Which dimension this question tests
    text: string;
    optionA: {
        text: string;
        value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    };
    optionB: {
        text: string;
        value: 'E' | 'I' | 'S' | 'N' | 'T' | 'F' | 'J' | 'P';
    };
}
