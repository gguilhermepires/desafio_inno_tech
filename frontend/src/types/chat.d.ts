export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: string;
}

export interface Conversation {
  id: string;
  title: string;
  lastContent: string;
  timestamp: string;
}

export interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isTyping: boolean;
} 