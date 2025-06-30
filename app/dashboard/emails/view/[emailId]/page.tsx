'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useEmail, Email } from '@/app/contexts/EmailContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, MessageSquareReply } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { toast as sonnerToast } from 'sonner';

export default function EmailViewPage() {
  const params = useParams<{ emailId: string }>();
  const router = useRouter();
  const { emails, markAsRead, saveDraft, isLoading: isEmailLoading } = useEmail();
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


  const handleReply = async () => {
    if (!email) {
      sonnerToast.error("Erro", { description: "Email original não carregado para resposta." });
      return;
    }

    const replyHeader = `\n\n--------------------\nDe: ${email.emailRemetente}\nPara: ${email.emailDestinatario}\nData: ${email.dataEnvio}\nAssunto: ${email.assunto}`;
    const newBody = `${replyHeader}\nCorpo: ${email.corpo}`;

    const newSubject = `Re: ${email.assunto}`;

    const draftPayload = {
      emailDestinatario: email.emailRemetente,
      assunto: newSubject,
      corpo: `\n\n${newBody}`,
    };

    sonnerToast.info("Criando rascunho da resposta...");

    const newDraft = await saveDraft(draftPayload);

    if (newDraft && newDraft.rascunhoId) {
      router.push(`/dashboard/compose/${newDraft.rascunhoId}`);
    } else {
      sonnerToast.error("Erro", { description: "Não foi possível criar o rascunho da resposta." });
    }
  };


  if (!email) {
    return <div className="p-10 text-center">Carregando email ou email não encontrado...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Button variant="ghost" onClick={() => router.back()} disabled={isEmailLoading}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
        <Button onClick={handleReply} disabled={isEmailLoading}>
          <MessageSquareReply className="mr-2 h-4 w-4" />
          Responder
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{email.assunto}</CardTitle>
          <CardDescription>Enviado em: {email.dataEnvio}</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent className="p-6 space-y-4">
          <div className="flex justify-between text-sm flex-wrap gap-2">
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
          <div className="whitespace-pre-wrap text-base leading-relaxed">
            {email.corpo}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}