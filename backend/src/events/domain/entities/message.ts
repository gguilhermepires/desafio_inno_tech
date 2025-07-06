import { AI_RESPONSE_ID_PREFIX } from 'events/domain/constants/events';

export class Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;

  constructor(id: string, content: string, sender: 'user' | 'assistant', timestamp: Date) {
    this.id = id;
    this.content = content;
    this.sender = sender;
    this.timestamp = timestamp;
  }

  static createAiResponseMessage(content: string): Message {
    return new Message(AI_RESPONSE_ID_PREFIX + Date.now(), content, 'assistant', new Date());
  }
} 