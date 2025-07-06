import { Injectable } from '@nestjs/common';
import { IAiDomainService } from 'ai/domain/interfaces/ai-domain-service.interface';

@Injectable()
export class AiService {
  constructor(private readonly aiDomainService: IAiDomainService) {}

  async getAiResponse(message: string): Promise<string> {
    return this.aiDomainService.getAiResponse(message);
  }
} 