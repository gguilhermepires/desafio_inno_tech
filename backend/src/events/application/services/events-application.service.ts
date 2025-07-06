import { Injectable, Inject } from '@nestjs/common';
import { AiApplicationService } from 'ai/application/services/ai-application.service';
import { IMessageLogService } from 'events/domain/interfaces/message-log-service.interface';
import { IConnectionLogService } from 'events/domain/interfaces/connection-log-service.interface';
import { Message } from 'events/domain/entities/message';

@Injectable()
export class EventsApplicationService {
  constructor(
    private readonly aiApplicationService: AiApplicationService,
    @Inject('IMessageLogService')
    private readonly messageLogService: IMessageLogService,
    @Inject('IConnectionLogService')
    private readonly connectionLogService: IConnectionLogService,
  ) {}

  async processMessage(clientId: string, messageContent: string): Promise<Message> {
    const userMessage = new Message(String(Date.now()), messageContent, 'user', new Date());
    await this.messageLogService.logMessage(clientId, userMessage, 'received');

    const aiResponseContent = await this.aiApplicationService.getAiResponse(messageContent);
    const aiMessage = new Message(
      'ai-response-' + Date.now(),
      aiResponseContent,
      'assistant',
      new Date(),
    );
    await this.messageLogService.logMessage(clientId, aiMessage, 'sent');

    return aiMessage;
  }

  async logConnection(clientId: string, type: 'connect' | 'disconnect'): Promise<void> {
    await this.connectionLogService.logConnection(clientId, type);
  }
} 