import { Injectable } from '@nestjs/common';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DynamoDBService {
  private readonly client: DynamoDBDocumentClient;

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

  async putItem(tableName: string, item: Record<string, any>): Promise<void> {
    const params = {
      TableName: tableName,
      Item: item,
    };

    try {
      await this.client.send(new PutCommand(params));
      console.log(`Successfully put item into ${tableName}:`, item);
    } catch (error) {
      console.error(`Error putting item into ${tableName}:`, error);
      throw new Error(String(error.message));
    }
  }
} 