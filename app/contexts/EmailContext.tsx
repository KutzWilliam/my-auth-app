'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import apiClient from '../services/api';
import { toast as sonnerToast } from 'sonner';

export interface Email {
  emailId: number; 
  assunto: string;
  corpo: string;
  emailRemetente: string;    
  emailDestinatario: string; 
  status: 'enviado' | 'lido' | string; 
  dataEnvio: string;
}

export interface Draft {
  id: any;
  rascunhoId: number; 
  assunto: string;
  corpo: string;
  emailDestinatario: string;
}

interface EmailContextType {
  emails: Email[];
  drafts: Draft[];
  isLoading: boolean;
  fetchEmails: () => Promise<void>;
  fetchDrafts: () => Promise<void>;
  sendEmail: (data: { assunto: string; corpo: string; emailDestinatario: string; }) => Promise<boolean>;
  sendEmailFromDraft: (draftId: number) => Promise<boolean>;
  saveDraft: (data: { assunto: string; corpo: string; emailDestinatario: string; }) => Promise<Draft | null>;
  updateDraft: (data: { rascunhoId: number; assunto?: string; corpo?: string; emailDestinatario?: string; }) => Promise<boolean>;
  getDraftById: (draftId: number) => Promise<Draft | null>;
  deleteDraft: (draftId: number) => Promise<void>;
  markAsRead: (emailId: number) => Promise<void>;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const EmailProvider = ({ children }: { children: ReactNode }) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmails = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/emails');
      setEmails(response.data.emails || []);
    } catch (error: any) {
      if (error.isAxiosError && error.response && error.response.status === 404) {
        console.log('Nenhum email encontrado para este usuário (404 recebido).');
        setEmails([]);
      } else {
        sonnerToast.error('Erro ao buscar emails.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchDrafts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/rascunhos');
      setDrafts(response.data.rascunhos || []);
    } catch (error: any) {
      if (error.isAxiosError && error.response && error.response.status === 404) {
        console.log('Nenhum rascunho encontrado para este usuário (404 recebido).');
        setDrafts([]);
      } else {
        sonnerToast.error('Erro ao buscar rascunhos.');
        console.error(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getDraftById = useCallback(async (draftId: number): Promise<Draft | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.get(`/rascunhos/${draftId}`);
      return response.data.rascunho;
    } catch (error) {
      sonnerToast.error('Erro ao buscar rascunho.');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendEmail = useCallback(async (data: { assunto: string; corpo: string; emailDestinatario: string; }): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient.post('/emails', data);
      sonnerToast.success('Email enviado com sucesso!');
      await fetchEmails();
      return true;
    } catch (error) {
      sonnerToast.error('Falha ao enviar email.');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEmails]);

  const sendEmailFromDraft = useCallback(async (draftId: number): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiClient.post(`/emails/${draftId}`);
      sonnerToast.success('Email enviado com sucesso!');
      await fetchEmails();
      await fetchDrafts();
      return true;
    } catch (error) {
      sonnerToast.error('Falha ao enviar email do rascunho.');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchEmails, fetchDrafts]);

  const saveDraft = useCallback(async (data: { assunto: string; corpo: string; emailDestinatario: string; }): Promise<Draft | null> => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/rascunhos', data);
      sonnerToast.success('Rascunho salvo!');
      await fetchDrafts();
      return response.data.rascunho;
    } catch (error) {
      sonnerToast.error('Falha ao salvar rascunho.');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDrafts]);

  const updateDraft = useCallback(async (data: { rascunhoId: number; assunto?: string; corpo?: string; emailDestinatario?: string; }): Promise<boolean> => {
    setIsLoading(true);
    const { rascunhoId, ...updateData } = data; 
    
    try {
      await apiClient.put(`/rascunhos/${rascunhoId}`, updateData);
      
      sonnerToast.success('Rascunho atualizado!');
      await fetchDrafts();
      return true;
    } catch (error) {
      sonnerToast.error('Falha ao atualizar rascunho.');
      console.error(error);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDrafts]);

  const deleteDraft = useCallback(async (draftId: number) => {
    setIsLoading(true);
    try {
      await apiClient.delete(`/rascunhos/${draftId}`);
      sonnerToast.success('Rascunho excluído.');
      await fetchDrafts();
    } catch (error) {
      sonnerToast.error('Falha ao excluir rascunho.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchDrafts]);

  const markAsRead = useCallback(async (emailId: number) => {
    try {
      await apiClient.get(`/emails/${emailId}`);
      setEmails(prevEmails =>
        prevEmails.map(email =>
          email.emailId === emailId ? { ...email, status: 'lido' } : email
        )
      );
    } catch (error) {
      console.error('Falha ao marcar email como lido:', error);
    }
  }, []);


  return (
    <EmailContext.Provider value={{ emails, drafts, isLoading, fetchEmails, fetchDrafts, getDraftById, sendEmail, sendEmailFromDraft, saveDraft, updateDraft, deleteDraft, markAsRead }}>
      {children}
    </EmailContext.Provider>
  );
};

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};