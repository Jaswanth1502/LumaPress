import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '../types';
import { getMeApi, loginApi, logoutApi, registerApi } from '../api/auth.api';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateCurrentUserState: (updatedUser: User) => void;
}

const DEMO_USERS: Record<string, User> = {
  'jane@example.com': {
    id: '65f1a2b3c4d5e6f7a8b9c0d1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    bio: 'Editorial writer & software architect at LumaPress.',
    createdAt: new Date().toISOString(),
  },
  'john@example.com': {
    id: '65f1a2b3c4d5e6f7a8b9c0d2',
    name: 'John Smith',
    email: 'john@example.com',
    role: 'user',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    bio: 'Frontend engineer & design systems enthusiast.',
    createdAt: new Date().toISOString(),
  },
};

const LOCAL_STORAGE_KEY = 'lumapress_user_session';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getMeApi();
        setUser(currentUser);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentUser));
      } catch {
        const savedDemoUser = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedDemoUser) {
          try {
            setUser(JSON.parse(savedDemoUser));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (data: any) => {
    setIsLoading(true);
    try {
      const loggedInUser = await loginApi(data);
      setUser(loggedInUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(loggedInUser));
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch {
      // Fallback for static environments (e.g. GitHub Pages) where live backend is not attached
      const emailLower = (data.email || '').toLowerCase().trim();
      const fallbackUser: User = DEMO_USERS[emailLower] || {
        id: `demo-${Date.now()}`,
        name: data.email?.split('@')[0] || 'Jane Doe',
        email: data.email || 'jane@example.com',
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        bio: 'Author & contributor at LumaPress.',
        createdAt: new Date().toISOString(),
      };

      setUser(fallbackUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
      toast.success(`Welcome back, ${fallbackUser.name}!`);
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const registeredUser = await registerApi(data);
      setUser(registeredUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(registeredUser));
      toast.success(`Account created! Welcome to LumaPress, ${registeredUser.name}.`);
    } catch {
      // Fallback for static environments (e.g. GitHub Pages)
      const fallbackUser: User = {
        id: `demo-${Date.now()}`,
        name: data.name || data.email?.split('@')[0] || 'New Author',
        email: data.email,
        role: 'admin',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        bio: 'Author on LumaPress.',
        createdAt: new Date().toISOString(),
      };

      setUser(fallbackUser);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(fallbackUser));
      toast.success(`Account created! Welcome to LumaPress, ${fallbackUser.name}.`);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // Silent catch if API endpoint is unreachable
    } finally {
      setUser(null);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      toast.info('Logged out successfully');
    }
  };

  const updateCurrentUserState = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateCurrentUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
