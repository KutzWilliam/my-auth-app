'use client';

import { useEffect, useMemo } from 'react';
import { useEmail, Email, Draft } from '@/app/contexts/EmailContext';
import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import { DataTable } from '../data-table';
import { emailColumns } from '../columns-email';
import { draftColumns } from '../columns-draft';

export default function EmailListPage() {
  const params = useParams<{ slug?: string[] }>();
  const { user } = useAuth();
  const { emails, drafts, isLoading, fetchEmails, fetchDrafts, deleteDraft } = useEmail();
  const router = useRouter();

  const pageType = params.slug?.[0] || 'inbox';

  useEffect(() => {
    if (pageType === 'drafts') {
      fetchDrafts();
    } else {
      fetchEmails();
    }
  }, [pageType, fetchEmails, fetchDrafts]);

  const filteredData = useMemo(() => {
    if (!user || !user.usuario) return [];
    
    const currentUserEmail = user.usuario.email;

    switch (pageType) {
      case 'inbox':
        return emails.filter(
          (email) => email.emailDestinatario === currentUserEmail
        );
      case 'sent':
        return emails.filter(
          (email) => email.emailRemetente === currentUserEmail
        );
      case 'drafts':
        return drafts;
      default:
        return [];
    }
  }, [pageType, emails, drafts, user]);

  const handleRowClick = (row: Email | Draft) => {
    if ('rascunhoId' in row) {
      router.push(`/dashboard/compose/${row.rascunhoId}`);
    } else if ('emailId' in row) {
      router.push(`/dashboard/emails/view/${row.emailId}`);
    }
  };
  
  if (isLoading && filteredData.length === 0) {
      return <div>Carregando...</div>
  }
  
  const getTitle = () => {
    if (pageType === 'inbox') return 'Caixa de Entrada';
    if (pageType === 'sent') return 'Emails Enviados';
    if (pageType === 'drafts') return 'Rascunhos';
    return 'Emails';
  };

  const renderDataTable = () => {
    if (pageType === 'inbox' || pageType === 'sent') {
      return <DataTable columns={emailColumns(pageType)} data={filteredData as Email[]} onRowClick={handleRowClick} />;
    }
    
    if (pageType === 'drafts') {
      return <DataTable columns={draftColumns(deleteDraft)} data={filteredData as Draft[]} onRowClick={handleRowClick} />;
    }
    
    return <div className="text-center p-10 text-muted-foreground">Selecione uma pasta para visualizar.</div>;
  };

  return (
    <div className="container mx-auto py-2">
      <h1 className="text-2xl font-bold capitalize mb-4">
        {getTitle()}
      </h1>
      {renderDataTable()}
    </div>
  );
}