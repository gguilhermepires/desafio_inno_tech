export interface CreateItemDto {
  id?: string;
  message: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
} 