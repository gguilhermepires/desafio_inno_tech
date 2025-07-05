import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import OpenAI from "openai";

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

  @SubscribeMessage('message')
  async handleCreateItem(@MessageBody() data: CreateItemDto, @ConnectedSocket() client: Socket): Promise<void> {
    console.log(`Received CREATE_ITEM from ${client.id}:`, data);

    const openai = new OpenAI({
      baseURL: "https://openrouter.ai/api/v1", // OpenRouter API base URL
      apiKey: "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", // Replace with your actual OpenRouter API Key
    });
    
    try {
        const completion = await openai.chat.completions.create({
            model: "google/gemini-2.5-flash-lite-preview-06-17", // A commonly available free model on OpenRouter. Check their docs for current free models.
            messages: [
              {
                "role": "user",
                "content": [
                  {
                    "type": "text",
                    "text": data.message
                  }
                ]
              }
            ],
        });
        
        const aiResponseContent = completion.choices[0].message.content;
        console.log("AI Response:", aiResponseContent);

        // Send the AI response back to the client
        this.server.emit('message', {
            id: 'ai-response-' + Date.now(), // Generate a unique ID for the AI response
            message: aiResponseContent,
            sender: 'ass  istant',
            timestamp: new Date(),
        });

    } catch (error) {
        console.error("Error calling OpenRouter AI:", error);
        // Optionally, send an error message back to the client
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