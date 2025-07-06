import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { IAiDomainService } from './domain/interfaces/ai-domain-service.interface';
import { OpenAIAdapter } from './infrastructure/openai/openai.adapter';
import { AiApplicationService } from './application/services/ai-application.service';

@Module({
  imports: [ConfigModule],
  providers: [
    AiApplicationService,
    {
      provide: 'IAiDomainService',
      useClass: OpenAIAdapter,
    },
  ],
  exports: [AiApplicationService, 'IAiDomainService'],
})
export class AiModule {} 