import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { OpenAIAdapter } from './infrastructure/openai/openai.adapter';
import { AiApplicationService } from './application/services/ai-application.service';
import { OpenAIMockAdapter } from './infrastructure/openai/openai.mock.adapter';


@Module({
  imports: [ConfigModule],
  providers: [
    AiApplicationService,
    {
      provide: 'IAiDomainService',
      useFactory: (configService: ConfigService) => {
        const nodeEnv = configService.get<string>('NODE_ENV');
        return nodeEnv === 'development' ? new OpenAIMockAdapter() : new OpenAIAdapter();
      },
      inject: [ConfigService],
    },
  ],
  exports: [AiApplicationService, 'IAiDomainService'],
})
export class AiModule {} 