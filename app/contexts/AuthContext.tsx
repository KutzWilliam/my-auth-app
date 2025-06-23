'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import apiClient from '../services/api';
import { toast as sonnerToast } from 'sonner';

interface User {
  usuario: any;
  id?: string;
  nome: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  fetchUserData: () => Promise<void>;
  updateUserAccount: (data: any) => Promise<void>;
  deleteUserAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
    setIsLoading(false);
  }, []);

  const fetchUserData = async () => {
    if (!localStorage.getItem('authToken')) {
      setUser(null);
      return;
    }
    try {
      setIsLoading(true);
      const response = await apiClient.get('/usuarios');
      setUser(response.data);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Failed to fetch user data:', error);
      sonnerToast.error('Erro ao carregar dados', {
        description: error.response?.data?.message || 'Não foi possível carregar os dados do usuário. Faça login novamente.',
      });
      logout();
    }
  };

  const login = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await apiClient.post('/login', data);
      const { token: apiToken, user: userData } = response.data;

      if (apiToken) {
        localStorage.setItem('authToken', apiToken);
        setToken(apiToken);
        if (userData) {
            setUser(userData);
        } else {
            await fetchUserDataInternal(apiToken);
        }
        sonnerToast.success('Login bem-sucedido!');
        router.push('/dashboard');
      } else {
        throw new Error("Token não recebido do servidor.");
      }
    } catch (error: any) {
      console.error('Login failed:', error);
      sonnerToast.error('Erro de Login', {
        description: error.response?.data?.message || 'Email ou senha inválidos.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserDataInternal = async (apiToken: string) => {
    try {
      const userResponse = await apiClient.get('/usuarios', {
        headers: { Authorization: `Bearer ${apiToken}` },
      });
      setUser(userResponse.data);
    } catch (fetchError) {
      console.error('Failed to fetch user data after login:', fetchError);
      sonnerToast.warning('Aviso', {
        description: 'Não foi possível carregar os dados do usuário após o login.',
      });
    }
  };

  const register = async (data: any) => {
    try {
      setIsLoading(true);
      await apiClient.post('/usuarios', data);
      sonnerToast.success('Cadastro realizado com sucesso!', {
        description: 'Você já pode fazer login.',
      });
      router.push('/login');
    } catch (error: any)
     {
      console.error('Registration failed:', error);
      sonnerToast.error('Erro no Cadastro', {
        description: error.response?.data?.message || 'Não foi possível realizar o cadastro.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);

    try {
      await apiClient.post('/logout');
      sonnerToast.info('Sessão encerrada no servidor.');
    } catch (error: any) {
      console.error("A chamada para /logout na API falhou:", error.message);
    } finally {
      localStorage.removeItem('authToken');
      setUser(null);
      setToken(null);
      sonnerToast.info('Logout realizado com sucesso!');
      router.push('/login');
      setIsLoading(false);
    }
  };

  const updateUserAccount = async (data: any) => {
    try {
      setIsLoading(true);
      const response = await apiClient.put('/usuarios', data);
      setUser(prevUser => prevUser ? { ...prevUser, ...response.data } : response.data);
      sonnerToast.success('Sucesso', { description: 'Dados atualizados com sucesso!' });
      await fetchUserData();
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Update failed:', error);
      sonnerToast.error('Erro ao Atualizar', {
        description: error.response?.data?.message || 'Não foi possível atualizar os dados.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteUserAccount = async () => {
    try {
      setIsLoading(true);
      await apiClient.delete('/usuarios');
      sonnerToast.success('Conta Excluída', { description: 'Sua conta foi excluída com sucesso.' });
      logout();
    } catch (error: any) {
      console.error('Delete account failed:', error);
      sonnerToast.error('Erro ao Excluir', {
        description: error.response?.data?.message || 'Não foi possível excluir a conta.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout, fetchUserData, updateUserAccount, deleteUserAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};