import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EventsModule } from './events/events.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    EventsModule, 
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
