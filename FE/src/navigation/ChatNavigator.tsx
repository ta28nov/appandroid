import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils/constants';
import { ChatStackParamList } from './types';
import ChatListScreen from '../screens/Main/ChatListScreen';
import ChatDetailScreen from '../screens/Main/ChatDetailScreen';
import CreateChatUserSelectionScreen from '../screens/Main/CreateChatUserSelectionScreen';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.MAIN.CHAT_LIST}>
      <Stack.Screen name={ROUTES.MAIN.CHAT_LIST} component={ChatListScreen} options={{ title: 'Tin nhắn' }} />
      <Stack.Screen name={ROUTES.MAIN.CHAT} component={ChatDetailScreen} />
      <Stack.Screen name={ROUTES.MAIN.CREATE_CHAT_USER_SELECTION} component={CreateChatUserSelectionScreen} options={{ title: 'Tạo cuộc trò chuyện mới' }} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
