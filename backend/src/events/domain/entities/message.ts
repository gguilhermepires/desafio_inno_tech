export class Message {
  constructor(
    public readonly id: string,
    public readonly content: string,
    public readonly sender: 'user' | 'assistant',
    public readonly timestamp: Date,
  ) {}
} 