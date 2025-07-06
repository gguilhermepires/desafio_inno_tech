export interface IConnectionLogService {
  logConnection(clientId: string, type: 'connect' | 'disconnect'): Promise<void>;
} 