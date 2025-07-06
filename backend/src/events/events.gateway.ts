import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsApplicationService } from './application/services/events-application.service';
import { Message } from './domain/entities/message';

interface CreateItemDto {
  id?: string;
  message: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsApplicationService: EventsApplicationService) {}

  @SubscribeMessage('message')
  async handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);
    if (!client.id) {
      throw Error("clientId empty");
    }

    try {
      const aiMessage = await this.eventsApplicationService.processMessage(client.id, data.message);
      this.server.emit('message', aiMessage);
    } catch (error) {
      console.error("Caught error in handleCreateItem:", error);
      throw new Error(String(error.message));
    }
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    if (!client.id) {
      throw new Error('Client ID is required');
    }
    this.eventsApplicationService.logConnection(client.id, 'connect');
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    if (!client.id) {
      throw new Error('Client ID is required');
    }
    this.eventsApplicationService.logConnection(client.id, 'disconnect');
  }
}