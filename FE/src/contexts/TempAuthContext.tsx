import React, { createContext, useContext, ReactNode } from 'react';

export interface TempUser {
  _id: string;
  name?: string;
  username?: string;
  avatarUrl?: string;
  // Các trường khác của user nếu cần
}

interface TempAuthContextType {
  user: TempUser | null;
  // Các hàm khác của auth context (ví dụ: login, logout) nếu cần mô phỏng
}

const TempAuthContext = createContext<TempAuthContextType | undefined>(undefined);

export const useTempAuth = (): TempAuthContextType => {
  const context = useContext(TempAuthContext);
  if (context === undefined) {
    // Fallback an toàn hơn cho trường hợp không có Provider, trả về một user mẫu
    // Hoặc throw error tùy theo yêu cầu của bạn khi context thật chưa sẵn sàng
    console.warn('useTempAuth called outside of a TempAuthProvider, returning mock user.');
    return { user: { _id: 'mockUserId', name: 'Người dùng mẫu', username: 'mockuser' } };
    // throw new Error('useTempAuth must be used within a TempAuthProvider');
  }
  return context;
};

interface TempAuthProviderProps {
  children: ReactNode;
  mockUser?: TempUser | null; // Cho phép truyền user mẫu từ bên ngoài
}

export const TempAuthProvider: React.FC<TempAuthProviderProps> = ({ children, mockUser }) => {
  const defaultMockUser: TempUser = { 
    _id: 'defaultMockUserId',
    name: 'Người dùng mặc định',
    username: 'defaultuser',
    avatarUrl: undefined 
  };

  const userToProvide = mockUser === undefined ? defaultMockUser : mockUser;

  return (
    <TempAuthContext.Provider value={{ user: userToProvide }}>
      {children}
    </TempAuthContext.Provider>
  );
};

export default TempAuthContext; 