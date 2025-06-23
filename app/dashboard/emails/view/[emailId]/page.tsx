'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmail, Email } from '@/app/contexts/EmailContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function EmailViewPage() {
  const params = useParams<{ emailId: string }>();
  const router = useRouter();
  const { emails, markAsRead } = useEmail();
  const { user } = useAuth();
  const [email, setEmail] = useState<Email | null>(null);

  const emailId = Number(params.emailId);

  useEffect(() => {
    if (emails.length > 0 && emailId) {
      const foundEmail = emails.find(e => e.emailId === emailId);
      if (foundEmail) {
        setEmail(foundEmail);
        
        if (user?.usuario && foundEmail.emailDestinatario === user.usuario.email && foundEmail.status !== 'lido') {
          markAsRead(emailId);
        }
      }
    }
  }, [emailId, emails, markAsRead, user]);

  if (!email) {
    return <div className="p-10 text-center">Carregando email ou email não encontrado...</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{email.assunto}</CardTitle>
          <CardDescription>Enviado em: {email.dataEnvio}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between text-sm">
            <div>
              <span className="font-semibold">De: </span>
              <span className="text-muted-foreground">{email.emailRemetente}</span>
            </div>
            <div>
              <span className="font-semibold">Para: </span>
              <span className="text-muted-foreground">{email.emailDestinatario}</span>
            </div>
          </div>
          <Separator />
          <div className="whitespace-pre-wrap text-base">
            {email.corpo}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}