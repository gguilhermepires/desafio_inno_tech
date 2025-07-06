export const CHAT_MESSAGES = {
  CONNECTED_TITLE: "Connected",
  CONNECTED_DESCRIPTION: "Connected to chat server successfully",
  DISCONNECTED_TITLE: "Disconnected",
  DISCONNECTED_DESCRIPTION: "Disconnected from chat server",
  CONNECTION_ERROR_TITLE: "Connection Error",
  CONNECTION_ERROR_DESCRIPTION: "Failed to connect to chat server",
  SEND_MESSAGE_DISCONNECTED: "Cannot send message while disconnected",
};

export enum MESSAGE_SENDER {
  USER = "user",
  ASSISTANT = "assistant",
}

export const SOCKET_EVENTS = {
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  MESSAGE: "message",
  TYPING: "typing",
  CONNECT_ERROR: "connect_error",
}; 