import { AppDispatch, RootState } from '../index';
import { connectChatSocket, disconnectChatSocket, sendChatMessage } from '../../services/chatService';
import { ToastFunction } from '../../types/utils';

export const connectSocket = (backendUrl: string, toast: ToastFunction) => async (dispatch: AppDispatch, getState: () => RootState) => {
  connectChatSocket(backendUrl, toast, dispatch);
};

export const disconnectSocket = () => async (dispatch: AppDispatch) => {
  disconnectChatSocket(dispatch);
};

export const sendMessage = (message: string, conversationId: string) => async (dispatch: AppDispatch, getState: () => RootState) => {
  sendChatMessage(message, conversationId, getState, dispatch);
}; 