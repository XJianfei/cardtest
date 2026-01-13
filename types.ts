export interface Flashcard {
  id: string;
  front: string; // The question or term
  back: string;  // The answer or definition
  mastered: boolean;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  cards: Flashcard[];
  createdAt: number;
  themeColor: string;
  icon: string;
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  CREATE_DECK = 'CREATE_DECK',
  EDIT_DECK = 'EDIT_DECK',
  STUDY_SESSION = 'STUDY_SESSION',
  DECK_STATS = 'DECK_STATS',
  GLOBAL_STATS = 'GLOBAL_STATS',
}

export interface StudySessionState {
  deckId: string;
  currentCardIndex: number;
  isFlipped: boolean;
  completedCards: string[]; // IDs of cards marked as known in this session
}

export type GenerateStatus = 'idle' | 'generating' | 'success' | 'error';