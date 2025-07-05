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
    await this.dynamodbService.logMessage(client.id, data, 'received');
    try {
        const aiResponseContent = await this.aiService.getAiResponse(data.message);
        console.log("AI Response:", aiResponseContent);

        const aiResponse = {
            id: 'ai-response-' + Date.now(), 
            message: aiResponseContent,
            sender: 'assistant',
            timestamp: new Date(),
        };
        this.server.emit('message', aiResponse);
        await this.dynamodbService.logMessage(client.id, aiResponse, 'sent');

    } catch (error) {
        console.error("Error calling OpenRouter AI:", error);
        const errorResponse = {
            id: 'error-' + Date.now(),
            message: "Erro ao processar sua solicitação com a IA.",
            sender: 'assistant',
            timestamp: new Date(),
        };
        this.server.emit('message', errorResponse);
        await this.dynamodbService.logMessage(client.id, errorResponse, 'sent');
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    this.dynamodbService.logConnection(client.id, 'connect');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.dynamodbService.logConnection(client.id, 'disconnect');
  }
}