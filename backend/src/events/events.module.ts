import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AiModule } from '../ai/ai.module';
import { DynamodbModule } from '../dynamodb/dynamodb.module';

@Module({
  imports: [AiModule, DynamodbModule],
  providers: [EventsGateway],
})
export class EventsModule {}