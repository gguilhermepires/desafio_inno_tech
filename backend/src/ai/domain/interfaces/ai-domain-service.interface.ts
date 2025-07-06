export interface IAiDomainService {
  getAiResponse(message: string): Promise<string>;
} 