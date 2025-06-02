'use client';

import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  console.log('Dados do usuário no DashboardPage:', user);
  if (isLoading || !user || !user.usuario) {
    return <div className="flex items-center justify-center pt-10">Carregando dados do usuário...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bem-vindo(a) de volta, {user.usuario.nome}!</h1>

      <Card>
        <CardHeader>
          <CardTitle>Suas Informações</CardTitle>
          <CardDescription>Estes são os detalhes da sua conta.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium">Nome:</p>
            <p className="text-muted-foreground">{user.usuario.nome}</p>
          </div>
          <div>
            <p className="font-medium">Email:</p>
            <p className="text-muted-foreground">{user.usuario.email}</p>
          </div>
          <div className="pt-2">
            <Link href="/dashboard/edit-profile" passHref>
              <Button>Editar Perfil</Button>
            </Link>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}