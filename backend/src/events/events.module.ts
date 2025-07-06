import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AiModule } from '../ai/ai.module';
import { DynamodbModule } from '../dynamodb/dynamodb.module';
import { EventsApplicationService } from './application/services/events-application.service';
import { DynamoDBMessageLogAdapter } from './infrastructure/persistence/dynamodb-message-log.adapter';
import { DynamoDBConnectionLogAdapter } from './infrastructure/persistence/dynamodb-connection-log.adapter';

@Module({
  imports: [AiModule, DynamodbModule],
  providers: [
    EventsGateway,
    EventsApplicationService,
    {
      provide: 'IMessageLogService',
      useClass: DynamoDBMessageLogAdapter,
    },
    {
      provide: 'IConnectionLogService',
      useClass: DynamoDBConnectionLogAdapter,
    },
  ],
})
export class EventsModule {}