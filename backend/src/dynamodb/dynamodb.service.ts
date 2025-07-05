import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBDocumentClient;
  private readonly tableName: string = "websocket_logs"; 

  constructor() {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION, 
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });
    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
  }

  async logConnection(clientId: string, type: 'connect' | 'disconnect'): Promise<void> {
    const timestamp = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `CLIENT#${clientId}`,
        SK: `CONNECTION#${timestamp}`,
        EventType: type,
        ClientId: clientId,
        Timestamp: timestamp,
      },
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Successfully logged ${type} for client: ${clientId}`);
    } catch (error) {
      console.error(`Error logging ${type} for client ${clientId}:`, error);
    }
  }

  async logMessage(clientId: string, message: any, direction: 'sent' | 'received'): Promise<void> {
    const timestamp = new Date().toISOString();
    const params = {
      TableName: this.tableName,
      Item: {
        PK: `CLIENT#${clientId}`,
        SK: `MESSAGE#${timestamp}`,
        EventType: 'message',
        ClientId: clientId,
        Direction: direction,
        MessageContent: message,
        Timestamp: timestamp,
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