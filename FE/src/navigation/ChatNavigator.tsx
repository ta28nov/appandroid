import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { ROUTES } from '../utils/constants';
import { ChatStackParamList } from './types';
import ChatListScreen from '../screens/Main/ChatListScreen';
import ChatDetailScreen from '../screens/Main/ChatDetailScreen';

const Stack = createStackNavigator<ChatStackParamList>();

const ChatNavigator = () => {
  return (
    <Stack.Navigator initialRouteName={ROUTES.MAIN.CHAT_LIST} screenOptions={{ headerShown: false }}>
      <Stack.Screen name={ROUTES.MAIN.CHAT_LIST} component={ChatListScreen} />
      <Stack.Screen name={ROUTES.MAIN.CHAT} component={ChatDetailScreen} />
    </Stack.Navigator>
  );
};

export default ChatNavigator;
