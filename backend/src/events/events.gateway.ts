import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AiService } from '../ai/ai.service';
import { DynamoDBService } from '../dynamodb/dynamodb.service';

interface CreateItemDto {
  id: string;
  message: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*', 
  },
})

export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly aiService: AiService, private readonly dynamodbService: DynamoDBService) {}

  @SubscribeMessage('message')
  async handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);
    console.log("line 34");

    if(!client.id){
      throw Error("clientId empty")
    }
    console.log("line 37");
    const now = new Date()
    const dataToLog = { id: data.id || now.valueOf(), message:data.message, timestamp: now.toISOString() };
    console.log("dataLog",dataToLog);
    
    await this.dynamodbService.logMessage(client.id, dataToLog, 'received');
    try {
      console.log("line 42");
      
        const aiResponseContent = await this.aiService.getAiResponse(data.message);
        console.log("AI Response:", aiResponseContent);

        const aiResponse = {
            id: 'ai-response-' + Date.now(), 
            message: aiResponseContent,
            sender: 'assistant',
            timestamp: new Date().toISOString(),
        };
        this.server.emit('message', aiResponse);
        await this.dynamodbService.logMessage(client.id, aiResponse, 'sent');

    } catch (error) {
        console.error("Caught error in handleCreateItem:", error);
        // Always ensure a standard Error object is thrown
        throw new Error(String(error?.message));
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    if(!client.id){
      throw new Error('Client ID is required');
    }
    this.dynamodbService.logConnection(client.id, 'connect');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if(!client.id){
      throw new Error('Client ID is required');
    }
    this.dynamodbService.logConnection(client.id, 'disconnect');
  }
}