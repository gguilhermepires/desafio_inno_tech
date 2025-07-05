import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';
import { AiModule } from '../ai/ai.module';

@Module({
  imports: [AiModule],
  providers: [EventsGateway],
})
export class EventsModule {}