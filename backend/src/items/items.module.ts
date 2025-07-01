import { Module } from '@nestjs/common';
import { ItemsController } from './items.controller';
import { ItemsGateway } from './items.gateway'; // Import the new gateway
import { ItemsService } from './items.service';

@Module({
  controllers: [ItemsController],
  providers: [ItemsService, ItemsGateway], // Add ItemsGateway here
  // ... existing exports if any ...
})
export class ItemsModule {}