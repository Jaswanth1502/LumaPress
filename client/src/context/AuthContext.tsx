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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const currentUser = await getMeApi();
        setUser(currentUser);
      } catch {
        setUser(null);
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
      toast.success(`Welcome back, ${loggedInUser.name}!`);
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: any) => {
    setIsLoading(true);
    try {
      const registeredUser = await registerApi(data);
      setUser(registeredUser);
      toast.success(`Account created! Welcome to LumaPress, ${registeredUser.name}.`);
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await logoutApi();
      setUser(null);
      toast.info('Logged out successfully');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    }
  };

  const updateCurrentUserState = (updatedUser: User) => {
    setUser(updatedUser);
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
