import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

// Defina as interfaces para os DTOs esperados do frontend
interface CreateItemDto {
  name: string;
  description: string;
}

interface UpdateItemDto {
  id: string;
  data: {
    name?: string;
    description?: string;
  };
}

interface DeleteItemDto {
  id: string;
}

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens para fins de desenvolvimento. Ajuste em produção.
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  // Remova ou renomeie este método se ele não for mais usado para 'message' genérico
  // @SubscribeMessage('message')
  // handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
  //   console.log(`Client ${client.id} sent: ${data}`);
  //   client.emit('message', `Server received: ${data}`);
  //   return data;
  // }

  @SubscribeMessage('CREATE_ITEM')
  handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): void {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);
    // Aqui você adicionaria a lógica para criar o item no seu banco de dados
    // Por exemplo: const newItem = await this.itemService.create(data);
    // E então emitiria um evento para todos os clientes sobre o novo item
    const newItem = { id: Date.now().toString(), ...data }; // Simula um item criado
    this.server.emit('ITEM_CREATED', newItem); // Notifica todos os clientes
  }

  @SubscribeMessage('UPDATE_ITEM')
  handleUpdateItem(@MessageBody() data: UpdateItemDto, @ConnectedSocket() client: Socket): void {
    console.log(`Received UPDATE_ITEM from ${client.id}:`, data);
    // Lógica para atualizar o item no banco de dados
    // Por exemplo: const updatedItem = await this.itemService.update(data.id, data.data);
    // E então emitiria um evento para todos os clientes sobre o item atualizado
    const updatedItem = { id: data.id, ...data.data }; // Simula um item atualizado
    this.server.emit('ITEM_UPDATED', updatedItem); // Notifica todos os clientes
  }

  @SubscribeMessage('DELETE_ITEM')
  handleDeleteItem(@MessageBody() data: DeleteItemDto, @ConnectedSocket() client: Socket): void {
    console.log(`Received DELETE_ITEM from ${client.id}:`, data);
    // Lógica para deletar o item no banco de dados
    // Por exemplo: await this.itemService.delete(data.id);
    // E então emitiria um evento para todos os clientes sobre o item deletado
    this.server.emit('ITEM_DELETED', { id: data.id }); // Notifica todos os clientes
  }

  // Exemplo de como enviar uma mensagem para todos os clientes conectados
  sendToAll(message: string) {
    this.server.emit('notification', message);
  }

  // Lida com a conexão de um novo cliente
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
    // Opcional: Enviar itens iniciais para o cliente recém-conectado
    // const initialItems = await this.itemService.findAll(); // Buscar itens do DB
    // client.emit('ITEMS_INITIAL_LOAD', initialItems);
  }

  // Lida com a desconexão de um cliente
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}