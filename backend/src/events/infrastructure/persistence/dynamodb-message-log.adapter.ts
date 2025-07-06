import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../../dynamodb/dynamodb.service';
import { IMessageLogService } from '../../domain/interfaces/message-log-service.interface';
import { Message } from '../../domain/entities/message';
import { WEBSOCKET_LOGS_TABLE_NAME } from '../../../dynamodb/dynamodb.constants';

@Injectable()
export class DynamoDBMessageLogAdapter implements IMessageLogService {
  private readonly tableName: string = WEBSOCKET_LOGS_TABLE_NAME;
  
  constructor(private readonly dynamodbService: DynamoDBService) {}

  async logMessage(clientId: string, message: Message, type: 'received' | 'sent'): Promise<void> {
    const item = {
      clientId: clientId,
      SK: `MESSAGE#${message.timestamp.toISOString()}`,
      eventType: 'message',
      direction: type,
      messageContent: { id: message.id, message: message.content, timestamp: message.timestamp.toISOString() }, // Ensure consistency
      timestamp: message.timestamp.toISOString(),
    };
    await this.dynamodbService.putItem(this.tableName, item);
  }
} 