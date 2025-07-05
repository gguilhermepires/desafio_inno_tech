import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { AiModule } from './ai/ai.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';

@Module({
  imports: [
    EventsModule, 
    AiModule,
    DynamodbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
