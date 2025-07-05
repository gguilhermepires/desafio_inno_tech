import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AiService } from '../ai/ai.service';

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

  constructor(private readonly aiService: AiService) {}

  @SubscribeMessage('message')
  async handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);
    try {
        const aiResponseContent = await this.aiService.getAiResponse(data.message);
        console.log("AI Response:", aiResponseContent);

        this.server.emit('message', {
            id: 'ai-response-' + Date.now(), 
            message: aiResponseContent,
            sender: 'assistant',
            timestamp: new Date(),
        });

    } catch (error) {
        console.error("Error calling OpenRouter AI:", error);
        this.server.emit('message', {
            id: 'error-' + Date.now(),
            message: "Erro ao processar sua solicitação com a IA.",
            sender: 'assistant',
            timestamp: new Date(),
        });
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}