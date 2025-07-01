import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permite todas as origens para fins de desenvolvimento. Ajuste em produção.
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('message') // Escuta por mensagens com o evento 'message'
  handleMessage(@MessageBody() data: string, @ConnectedSocket() client: Socket): string {
    console.log(`Client ${client.id} sent: ${data}`);
    // Envia a mensagem de volta para o cliente que a enviou
    client.emit('message', `Server received: ${data}`);
    return data; // Opcional: retorna a mensagem para o cliente que a enviou (se for um RPC)
  }

  // Exemplo de como enviar uma mensagem para todos os clientes conectados
  sendToAll(message: string) {
    this.server.emit('notification', message);
  }

  // Lida com a conexão de um novo cliente
  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  // Lida com a desconexão de um cliente
  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }
}