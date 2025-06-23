'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { updateApiBaseUrl } from '../services/api';

interface Settings {
  serverIp: string;
  serverPort: string;
}

interface SettingsContextType {
  settings: Settings;
  isLoadingSettings: boolean;
  saveSettings: (newSettings: Settings) => void;
  isSettingsConfigured: boolean;
}

const SETTINGS_STORAGE_KEY = 'apiSettings';
const DEFAULT_IP = process.env.NEXT_PUBLIC_SERVER_IP || 'localhost';
const DEFAULT_PORT = process.env.NEXT_PUBLIC_SERVER_PORT || '8080';


const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider = ({ children }: { children: ReactNode }) => {
  const [settings, setSettings] = useState<Settings>({ serverIp: '', serverPort: '' });
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [isSettingsConfigured, setIsSettingsConfigured] = useState(false);

  useEffect(() => {
    try {
      const storedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
      if (storedSettings) {
        const parsedSettings: Settings = JSON.parse(storedSettings);
        if (parsedSettings.serverIp && parsedSettings.serverPort) {
          setSettings(parsedSettings);
          updateApiBaseUrl(parsedSettings.serverIp, parsedSettings.serverPort);
          setIsSettingsConfigured(true);
        } else {
          setSettings({ serverIp: DEFAULT_IP, serverPort: DEFAULT_PORT });
          updateApiBaseUrl(DEFAULT_IP, DEFAULT_PORT);
          setIsSettingsConfigured(!!(DEFAULT_IP && DEFAULT_PORT && DEFAULT_IP !== 'localhost')); // Considera configurado se não for localhost
        }
      } else {
        setSettings({ serverIp: DEFAULT_IP, serverPort: DEFAULT_PORT });
        updateApiBaseUrl(DEFAULT_IP, DEFAULT_PORT);
        setIsSettingsConfigured(!!(DEFAULT_IP && DEFAULT_PORT && DEFAULT_IP !== 'localhost' && DEFAULT_IP !== ''));
      }
    } catch (error) {
      console.error("Erro ao carregar configurações da API:", error);
      setSettings({ serverIp: DEFAULT_IP, serverPort: DEFAULT_PORT });
      updateApiBaseUrl(DEFAULT_IP, DEFAULT_PORT);
    } finally {
      setIsLoadingSettings(false);
    }
  }, []);

  const saveSettings = useCallback((newSettings: Settings) => {
    if (newSettings.serverIp && newSettings.serverPort) {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
      updateApiBaseUrl(newSettings.serverIp, newSettings.serverPort);
      setIsSettingsConfigured(true);
    } else {
      console.warn("Tentativa de salvar IP ou Porta inválidos.");
    }
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, isLoadingSettings, saveSettings, isSettingsConfigured }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};