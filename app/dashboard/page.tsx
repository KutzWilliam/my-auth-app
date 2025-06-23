'use client';

import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { SquarePen } from 'lucide-react';

export default function DashboardHomePage() {
  const { user, isLoading } = useAuth();

  if (isLoading || !user) {
    return <div className="flex items-center justify-center pt-10">Carregando...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo(a) ao Email Service, {user.usuario.nome}!</h1>

      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>O que você gostaria de fazer?</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard/compose" passHref>
            <Button size="lg">
              <SquarePen className="mr-2 h-5 w-5" />
              Escrever Novo Email
            </Button>
            </Link>
          <Link href="/dashboard/emails/inbox" passHref>
            <Button size="lg" variant="outline">
              Ver Caixa de Entrada
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}