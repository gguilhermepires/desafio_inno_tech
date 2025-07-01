import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io'; // Importe IoAdapter

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); // Habilita CORS para permitir conexões de frontend
  app.useWebSocketAdapter(new IoAdapter(app)); // Usa o adaptador Socket.io
  await app.listen(3000);
}
bootstrap();