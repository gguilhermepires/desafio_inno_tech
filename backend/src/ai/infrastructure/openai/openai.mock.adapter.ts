import { Injectable } from '@nestjs/common';
import { IAiDomainService } from 'ai/domain/interfaces/ai-domain-service.interface';

@Injectable()
export class OpenAIMockAdapter implements IAiDomainService {
  async getAiResponse(message: string): Promise<string> {
    console.log("Mock AI response for message:", message);
    if (message.toLowerCase().includes("olá")) {
      return Promise.resolve("Olá! Como posso ajudar você hoje (resposta mock)?");
    } else if (message.toLowerCase().includes("tempo")) {
      return Promise.resolve("O tempo hoje está ensolarado no mundo mock.");
    } else {
      return Promise.resolve("Esta é uma resposta genérica do mock AI para: " + message);
    }
  }
} 