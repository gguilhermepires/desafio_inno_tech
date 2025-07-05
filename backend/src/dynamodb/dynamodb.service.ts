import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string = "WEBSOCKET_LOGS"; 

  constructor(private configService: ConfigService) {
    const credentials = {
      accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID')!,
      secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY')!,
    };
    if (!credentials.accessKeyId || !credentials.secretAccessKey) {
      throw new Error('AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in your environment variables.');
    }
    const dynamoDBClient = new DynamoDBClient({
        region: this.configService.get<string>('AWS_REGION'), 
        credentials
      });
    
    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  async logConnection(clientId: string, eventType: 'connect' | 'disconnect'): Promise<void> {
    const timestamp = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        clientId: clientId,
        SK: `CONNECTION#${timestamp}`,
        eventType,
        timestamp,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Successfully logged ${eventType} for client: ${clientId}`);
    } catch (error) {
      console.error(`Error logging ${eventType} for client ${clientId}:`, error);
    }
  }

  async logMessage(clientId: string, message: any, direction: 'sent' | 'received'): Promise<void> {
    const timestamp = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        clientId: clientId,
        SK: `MESSAGE#${timestamp}`,
        eventType: 'message',
        direction: direction,
        messageContent: message,
        timestamp,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Successfully logged ${direction} message for client: ${clientId}`);
    } catch (error) {
      console.error(`Error logging message for client ${clientId}:`, error);
    }
  }
} 