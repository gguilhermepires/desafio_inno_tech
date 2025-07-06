import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Message, ChatState } from '../../types/chat';

const initialState: ChatState = {
  messages: [],
  isConnected: false,
  isTyping: false,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Message>) => {
      state.messages.push(action.payload);
    },
    setIsConnected: (state, action: PayloadAction<boolean>) => {
      state.isConnected = action.payload;
    },
    setIsTyping: (state, action: PayloadAction<boolean>) => {
      state.isTyping = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, setIsConnected, setIsTyping, clearMessages } = chatSlice.actions;
export default chatSlice.reducer; 