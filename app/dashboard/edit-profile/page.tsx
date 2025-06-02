'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { useAuth } from "@/app/contexts/AuthContext";
import Link from "next/link";

const editProfileSchema = z.object({
  nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  senha: z.string().min(8, { message: "A nova senha deve ter pelo menos 8 caracteres." }).optional().or(z.literal('')),
});

type EditProfileFormValues = z.infer<typeof editProfileSchema>;

export default function EditProfilePage() {
  const { user, updateUserAccount, isLoading: isAuthLoading } = useAuth();

  const form = useForm<EditProfileFormValues>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      nome: "",
      senha: "",
    },
  });

  useEffect(() => {
    if (user) {
      form.reset({
        nome: user.nome,
        senha: "",
      });
    }
  }, [user, form]);

  const onSubmit = async (data: EditProfileFormValues) => {
    const payload: any = { nome: data.nome };
    if (data.senha) {
      payload.senha = data.senha;
    }
    await updateUserAccount(payload);
  };

  if (isAuthLoading && !user) {
    return <div className="flex items-center justify-center pt-10">Carregando...</div>;
  }

  if (!user) {
    return <div className="flex items-center justify-center pt-10">Usuário não encontrado.</div>;
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Perfil</CardTitle>
        <CardDescription>Atualize suas informações pessoais.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="nome"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Seu Nome" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="senha"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nova Senha (opcional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Deixe em branco para não alterar" {...field} type="password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex space-x-2">
                <Button type="submit" disabled={isAuthLoading || form.formState.isSubmitting}>
                {isAuthLoading || form.formState.isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/dashboard">Cancelar</Link>
                </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}