import { io, Socket } from 'socket.io-client';
import { addMessage, setIsConnected, setIsTyping } from '../../store/chat/chatSlice';
import { Message } from '../../types/chat';
import { ToastFunction } from '../../types/utils';
import { AppDispatch, RootState } from '../../store';
import { CHAT_MESSAGES, MESSAGE_SENDER, SOCKET_EVENTS } from '../../lib/constants';
import { IChatClient } from './IChatClient';

export class SocketIoChatClient implements IChatClient {
  private socket: Socket | null = null;

  connect(backendUrl: string, toast: ToastFunction, dispatch: AppDispatch) {
    if (this.socket && this.socket.connected) {
      return;
    }

    this.socket = io(backendUrl);

    this.socket.on(SOCKET_EVENTS.CONNECT, () => {
      dispatch(setIsConnected(true));
      console.log('Connected to server');
      toast({ title: CHAT_MESSAGES.CONNECTED_TITLE, description: CHAT_MESSAGES.CONNECTED_DESCRIPTION });
    });

    this.socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      dispatch(setIsConnected(false));
      console.log('Disconnected from server');
      toast({ title: CHAT_MESSAGES.DISCONNECTED_TITLE, description: CHAT_MESSAGES.DISCONNECTED_DESCRIPTION, variant: "destructive" });
    });

    this.socket.on(SOCKET_EVENTS.MESSAGE, (data: Message) => {
      const assistantMessage: Message = {
        id: data.id,
        content: data.content,
        sender: MESSAGE_SENDER.ASSISTANT,
        timestamp: data.timestamp,
      };
      dispatch(addMessage(assistantMessage));
      dispatch(setIsTyping(false));
    });

    this.socket.on(SOCKET_EVENTS.TYPING, () => {
      dispatch(setIsTyping(true));
    });

    this.socket.on(SOCKET_EVENTS.CONNECT_ERROR, (error) => {
      console.error('Connection error:', error);
      toast({ title: CHAT_MESSAGES.CONNECTION_ERROR_TITLE, description: CHAT_MESSAGES.CONNECTION_ERROR_DESCRIPTION, variant: "destructive" });
    });
  }

  disconnect(dispatch: AppDispatch) {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null; // Clear the socket instance
      dispatch(setIsConnected(false)); // Ensure state is updated
    }
  }

  sendMessage(message: string, conversationId: string, state: RootState, dispatch: AppDispatch, toast: ToastFunction) {
    if (!this.socket || !state.chat.isConnected) {
      console.log("Send message prevented: socket not connected");
      toast({ title: CHAT_MESSAGES.DISCONNECTED_TITLE, description: CHAT_MESSAGES.SEND_MESSAGE_DISCONNECTED, variant: "destructive" });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      sender: MESSAGE_SENDER.USER,
      timestamp: new Date().toISOString(),
    };

    dispatch(addMessage(userMessage));

    this.socket.emit(SOCKET_EVENTS.MESSAGE, { message, conversationId });
  }
} 