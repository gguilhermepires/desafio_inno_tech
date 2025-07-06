import { Injectable } from '@nestjs/common';
import { DynamoDBService } from '../../../dynamodb/dynamodb.service';
import { IConnectionLogService } from '../../domain/interfaces/connection-log-service.interface';
import { WEBSOCKET_LOGS_TABLE_NAME } from '../../../dynamodb/dynamodb.constants';

@Injectable()
export class DynamoDBConnectionLogAdapter implements IConnectionLogService {
  private readonly tableName: string = WEBSOCKET_LOGS_TABLE_NAME; // Use the constant here

  constructor(private readonly dynamodbService: DynamoDBService) {}

  async logConnection(clientId: string, type: 'connect' | 'disconnect'): Promise<void> {
    const timestamp = new Date().toISOString();
    const item = {
      clientId: clientId,
      SK: `CONNECTION#${timestamp}`,
      eventType: type,
      timestamp: timestamp,
    };
    await this.dynamodbService.putItem(this.tableName, item);
  }
} 