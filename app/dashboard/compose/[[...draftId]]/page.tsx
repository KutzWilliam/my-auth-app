'use client';

import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useEmail } from '@/app/contexts/EmailContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast as sonnerToast } from 'sonner';

const emailSchema = z.object({
  emailDestinatario: z.string().email({ message: 'Email do destinatário inválido.' }),
  assunto: z.string().min(1, { message: 'Assunto não pode ser vazio.' }),
  corpo: z.string().min(1, { message: 'Corpo do email não pode ser vazio.' }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

export default function ComposePage() {
  const params = useParams<{ draftId?: string[] }>();
  const router = useRouter();
  const { getDraftById, saveDraft, updateDraft, sendEmail, isLoading } = useEmail();

  const draftId = params.draftId?.[0] ? Number(params.draftId[0]) : null;

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  useEffect(() => {
    if (draftId) {
      const loadDraft = async () => {
        const draft = await getDraftById(draftId);
        if (draft) {
          reset({
            emailDestinatario: draft.emailDestinatario,
            assunto: draft.assunto,
            corpo: draft.corpo,
          });
        }
      };
      loadDraft();
    }
  }, [draftId, getDraftById, reset]);

  const onSend: SubmitHandler<EmailFormValues> = async (data) => {
    const success = await sendEmail(data);
    if (success) {
      router.push('/dashboard/emails/sent');
    }
  };

  const onSaveDraft: SubmitHandler<EmailFormValues> = async (data) => {
    if (draftId) {
      const success = await updateDraft({ rascunhoId: draftId, ...data });
      if (success) router.push('/dashboard/emails/drafts');
    } else {
      const newDraft = await saveDraft(data);
      if (newDraft) {
        router.replace(`/dashboard/compose/${newDraft.id}`);
      }
    }
  };
  
  return (
    <div className="grid flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
            <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                {draftId ? 'Editar Rascunho' : 'Escrever Novo Email'}
            </h1>
            <div className="hidden items-center gap-2 md:ml-auto md:flex">
                <Button variant="outline" onClick={() => router.back()} disabled={isLoading}>Descartar</Button>
                <Button onClick={handleSubmit(onSaveDraft)} disabled={isLoading}>Salvar Rascunho</Button>
                <Button onClick={handleSubmit(onSend)} disabled={isLoading}>Enviar Email</Button>
            </div>
        </div>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
            <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
                <div className="grid gap-6">
                    <div className="grid gap-3">
                        <Label htmlFor="emailDestinatario">Para</Label>
                        <Input id="emailDestinatario" {...register('emailDestinatario')} placeholder="email@exemplo.com" />
                        {errors.emailDestinatario && <p className="text-sm text-red-500">{errors.emailDestinatario.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="assunto">Assunto</Label>
                        <Input id="assunto" {...register('assunto')} placeholder="Assunto do seu email" />
                        {errors.assunto && <p className="text-sm text-red-500">{errors.assunto.message}</p>}
                    </div>
                    <div className="grid gap-3">
                        <Label htmlFor="corpo">Corpo</Label>
                        <Textarea id="corpo" {...register('corpo')} className="min-h-[250px]" />
                        {errors.corpo && <p className="text-sm text-red-500">{errors.corpo.message}</p>}
                    </div>
                </div>
            </div>
             <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            </div>
        </div>
    </div>
  );
}