import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { AiModule } from './ai/ai.module';
import { DynamodbModule } from './dynamodb/dynamodb.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    EventsModule, 
    AiModule,
    DynamodbModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
