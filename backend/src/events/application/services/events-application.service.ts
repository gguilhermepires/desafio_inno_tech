import { Injectable, Inject } from '@nestjs/common';
import { AiApplicationService } from 'ai/application/services/ai-application.service';
import { IMessageLogService } from 'events/domain/interfaces/message-log-service.interface';
import { IConnectionLogService } from 'events/domain/interfaces/connection-log-service.interface';
import { Message } from 'events/domain/entities/message';
import { SenderType, ConnectionType, MessageStatus } from 'events/domain/constants/events';

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
    const userMessage = new Message(String(Date.now()), messageContent, SenderType.USER, new Date());
    await this.messageLogService.logMessage(clientId, userMessage, MessageStatus.RECEIVED);

    const aiResponseContent = await this.aiApplicationService.getAiResponse(messageContent);
    const aiMessage = Message.createAiResponseMessage(aiResponseContent);
    await this.messageLogService.logMessage(clientId, aiMessage, MessageStatus.SENT);

    return aiMessage;
  }

  async logConnection(clientId: string, type: ConnectionType): Promise<void> {
    await this.connectionLogService.logConnection(clientId, type);
  }
} 