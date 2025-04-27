
export interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant' | 'system';
  timestamp: number;
}

export interface ChatStore {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}
