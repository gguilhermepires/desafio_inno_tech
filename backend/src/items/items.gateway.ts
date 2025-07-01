import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';

@WebSocketGateway({
  cors: {
    origin: '*', // Allow all origins for development. Adjust in production.
  },
  port: 3001, // Ensure this matches the frontend's connection port
})
export class ItemsGateway {
  @WebSocketServer() server: Server;

  constructor(private readonly itemsService: ItemsService) {}

  afterInit(server: Server) {
    console.log('Socket.IO Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Optionally, send initial data to the newly connected client
    this.itemsService.findAll().then(items => {
      client.emit('ITEMS_INITIAL_LOAD', items);
    });
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('CREATE_ITEM')
  async create(@MessageBody() createItemDto: CreateItemDto): Promise<void> {
    const newItem = await this.itemsService.create(createItemDto);
    this.server.emit('ITEM_CREATED', newItem); // Broadcast to all clients
  }

  @SubscribeMessage('UPDATE_ITEM')
  async update(@MessageBody() payload: { id: string; data: UpdateItemDto }): Promise<void> {
    const updatedItem = await this.itemsService.update(payload.id, payload.data);
    if (updatedItem) {
      this.server.emit('ITEM_UPDATED', updatedItem); // Broadcast to all clients
    }
  }

  @SubscribeMessage('DELETE_ITEM')
  async remove(@MessageBody() payload: { id: string }): Promise<void> {
    const success = await this.itemsService.remove(payload.id);
    if (success) {
      this.server.emit('ITEM_DELETED', { id: payload.id }); // Broadcast to all clients
    }
  }
}