export enum MessageEvent {
  MESSAGE = 'message',
}

export enum SenderType {
  USER = 'user',
  ASSISTANT = 'assistant',
}

export enum ConnectionType {
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
}

export enum MessageStatus {
  RECEIVED = 'received',
  SENT = 'sent',
}

export const AI_RESPONSE_ID_PREFIX = 'ai-response-'; 