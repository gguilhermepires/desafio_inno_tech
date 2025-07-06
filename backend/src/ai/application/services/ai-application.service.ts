import { Injectable, Inject } from '@nestjs/common';
import { IAiDomainService } from '../../domain/interfaces/ai-domain-service.interface';

@Injectable()
export class AiApplicationService {
  constructor(@Inject('IAiDomainService') private readonly aiDomainService: IAiDomainService) {}

  async getAiResponse(message: string): Promise<string> {
    return this.aiDomainService.getAiResponse(message);
  }
} 