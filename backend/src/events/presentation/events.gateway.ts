import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { EventsApplicationService } from 'events/application/services/events-application.service';
import { CreateItemDto } from './dto/create-item.dto';
import { MessageEvent, ConnectionType } from 'events/domain/constants/events';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly eventsApplicationService: EventsApplicationService) {}

  @SubscribeMessage(MessageEvent.MESSAGE)
  async handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);
    try {
      const aiMessage = await this.eventsApplicationService.processMessage(client.id, data.message);
      this.server.emit(MessageEvent.MESSAGE, aiMessage);
    } catch (error) {
      console.error("Error calling OpenRouter AI:", error);
      throw new Error(String(error.message));
    }
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    this.eventsApplicationService.logConnection(client.id, ConnectionType.CONNECT);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.eventsApplicationService.logConnection(client.id, ConnectionType.DISCONNECT);
  }
}