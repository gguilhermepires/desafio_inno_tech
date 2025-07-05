import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AiModule } from './ai/ai.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { EventsModule } from './events/events.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AiModule, DynamodbModule, EventsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
