import { Message } from '../entities/message';

export interface IMessageLogService {
  logMessage(clientId: string, message: Message, type: 'received' | 'sent'): Promise<void>;
} 