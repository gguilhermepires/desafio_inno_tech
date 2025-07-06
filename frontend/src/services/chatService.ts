import { io, Socket } from 'socket.io-client';
import { addMessage, setIsConnected, setIsTyping } from '../store/chat/chatSlice';
import { Message } from '../types/chat';
import { ToastFunction } from '../types/utils';
import { AppDispatch, RootState } from '../store';

let socket: Socket | null = null;

export const connectChatSocket = (backendUrl: string, toast: ToastFunction, dispatch: AppDispatch) => {
  if (socket && socket.connected) {
    return;
  }

  socket = io(backendUrl);

  socket.on('connect', () => {
    dispatch(setIsConnected(true));
    console.log('Connected to server');
    toast({ title: "Connected", description: "Connected to chat server successfully" });
  });

  socket.on('disconnect', () => {
    dispatch(setIsConnected(false));
    console.log('Disconnected from server');
    toast({ title: "Disconnected", description: "Disconnected from chat server", variant: "destructive" });
  });

  socket.on('message', (data: Message) => {
    const assistantMessage: Message = {
      id: data.id,
      content: data.content,
      sender: 'assistant',
      timestamp: data.timestamp,
    };
    dispatch(addMessage(assistantMessage));
    dispatch(setIsTyping(false));
  });

  socket.on('typing', () => {
    dispatch(setIsTyping(true));
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    toast({ title: "Connection Error", description: "Failed to connect to chat server", variant: "destructive" });
  });
};

export const disconnectChatSocket = (dispatch: AppDispatch) => {
  if (socket) {
    socket.disconnect();
    socket = null; // Clear the socket instance
    dispatch(setIsConnected(false)); // Ensure state is updated
  }
};

export const sendChatMessage = (message: string, conversationId: string, getState: () => RootState, dispatch: AppDispatch) => {
  const state = getState();
  if (!socket || !state.chat.isConnected) {
    console.log("Send message prevented: socket not connected");
    return;
  }

  const userMessage: Message = {
    id: Date.now().toString(),
    content: message,
    sender: 'user',
    timestamp: new Date().toISOString(),
  };

  dispatch(addMessage(userMessage));
  dispatch(setIsTyping(true));

  socket.emit('message', { message, conversationId });
}; 