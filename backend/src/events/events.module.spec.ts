import { Test, TestingModule } from '@nestjs/testing';
import { EventsModule } from './events.module';
import { EventsGateway } from './events.gateway';
import { AiService } from '../ai/ai.service';
import { Server } from 'socket.io';

describe('EventsModule', () => {
  let eventsModule: TestingModule;

  beforeEach(async () => {
    eventsModule = await Test.createTestingModule({
      imports: [EventsModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(eventsModule).toBeDefined();
  });
});

describe('EventsGateway', () => {
  let gateway: EventsGateway;
  let aiService: AiService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsGateway,
        {
          provide: AiService,
          useValue: {
            getAiResponse: jest.fn(),
          },
        },
        {
            provide: 'WEB_SOCKET_SERVER',
            useValue: {
                emit: jest.fn(),
            },
        },
      ],
    }).compile();

    gateway = module.get<EventsGateway>(EventsGateway);
    aiService = module.get<AiService>(AiService);
    server = module.get<Server>('WEB_SOCKET_SERVER');

    // Manually set the server instance on the gateway
    Object.defineProperty(gateway, 'server', {
        writable: true,
        value: server,
    });
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('handleCreateItem', () => {
    it('should emit a message with AI response on success', async () => {
      const mockData = {
        id: '1',
        message: 'Hello AI',
        sender: 'user' as 'user',
        timestamp: new Date(),
      };
      const mockClient: any = { id: 'client1' };
      const aiResponse = 'AI says hello!';

      jest.spyOn(aiService, 'getAiResponse').mockResolvedValue(aiResponse);

      await gateway.handleCreateItem(mockData, mockClient);

      expect(aiService.getAiResponse).toHaveBeenCalledWith(mockData.message);
      expect(server.emit).toHaveBeenCalledWith(
        'message',
        expect.objectContaining({
          message: aiResponse,
          sender: 'assistant',
        }),
      );
    });

    it('should emit an error message on AI service failure', async () => {
      const mockData = {
        id: '1',
        message: 'Hello AI',
        sender: 'user' as 'user',
        timestamp: new Date(),
      };
      const mockClient: any = { id: 'client1' };
      const errorMessage = 'Erro ao processar sua solicitação com a IA.';

      jest.spyOn(aiService, 'getAiResponse').mockRejectedValue(new Error('AI error'));

      await gateway.handleCreateItem(mockData, mockClient);

      expect(aiService.getAiResponse).toHaveBeenCalledWith(mockData.message);
      expect(server.emit).toHaveBeenCalledWith(
        'message',
        expect.objectContaining({
          message: errorMessage,
          sender: 'assistant',
        }),
      );
    });
  });
}); 