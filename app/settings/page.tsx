'use client';

import { useState, useEffect } from 'react';
import { useSettings } from '../contexts/SettingsContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '../contexts/AuthContext';
import { toast as sonnerToast } from 'sonner';
import Link from 'next/link';

export default function SettingsPage() {
  const { settings, saveSettings, isLoadingSettings } = useSettings();
  const { logout, token } = useAuth(); 
  const [currentIp, setCurrentIp] = useState('');
  const [currentPort, setCurrentPort] = useState('');

  useEffect(() => {
    if (!isLoadingSettings && settings) {
      setCurrentIp(settings.serverIp);
      setCurrentPort(settings.serverPort);
    }
  }, [settings, isLoadingSettings]);

  const handleSave = () => {
    const oldIp = settings.serverIp;
    const oldPort = settings.serverPort;

    if (!currentIp.trim() || !currentPort.trim()) {
        sonnerToast.error("Erro", { description: "IP e Porta não podem ser vazios." });
        return;
    }

    saveSettings({ serverIp: currentIp, serverPort: currentPort });
    sonnerToast.success('Configurações Salvas!', {
      description: `API agora aponta para ${currentIp}:${currentPort}.`,
    });


    if (token && (oldIp !== currentIp || oldPort !== currentPort)) {
      sonnerToast.info("Configurações de servidor alteradas.", {
        description: "Você foi deslogado para aplicar as novas configurações.",
      });
      logout();
    }
  };

  if (isLoadingSettings) {
    return <div className="flex items-center justify-center pt-10">Carregando configurações...</div>;
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Configurações do Servidor da API</CardTitle>
          <CardDescription>
            Defina o endereço IP e a Porta do servidor backend.
            Se as configurações forem alteradas e você estiver logado, será necessário fazer login novamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="server-ip">Endereço IP do Servidor</Label>
            <Input
              id="server-ip"
              value={currentIp}
              onChange={(e) => setCurrentIp(e.target.value)}
              placeholder="Ex: 192.168.3.6 ou localhost"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="server-port">Porta do Servidor</Label>
            <Input
              id="server-port"
              type="number"
              value={currentPort}
              onChange={(e) => setCurrentPort(e.target.value)}
              placeholder="Ex: 8080"
            />
          </div>
          <div className='flex space-x-2'>
            <Button onClick={handleSave}>Salvar Configurações</Button>
            {token && (
                 <Button variant="outline" asChild>
                    <Link href="/dashboard">Voltar ao Dashboard</Link>
                </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}