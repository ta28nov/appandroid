import { io, Socket } from 'socket.io-client';
import { API_BASE_URL } from '../config/apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

let socket: Socket | null = null;

export const getSocket = async (): Promise<Socket> => {
  if (socket) return socket;
  const token = await AsyncStorage.getItem('@auth_token');
  socket = io(API_BASE_URL, {
    transports: ['websocket'],
    auth: { token },
    autoConnect: true,
    reconnection: true,
  });
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
