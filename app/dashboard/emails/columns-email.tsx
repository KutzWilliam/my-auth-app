'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Email } from '@/app/contexts/EmailContext';
import { CheckCheck } from 'lucide-react';

export const emailColumns = (pageType: 'inbox' | 'sent'): ColumnDef<Email>[] => [
  {
    accessorKey: 'partner',
    header: pageType === 'inbox' ? 'De' : 'Para',
    cell: ({ row }) => {
      const email = row.original;
      const partnerEmail = pageType === 'inbox' ? email.emailRemetente : email.emailDestinatario;
      return <div className="font-medium">{partnerEmail}</div>;
    },
  },
  {
    accessorKey: 'assunto',
    header: 'Assunto',
    cell: ({ row }) => {
      const email = row.original;
      const isUnread = pageType === 'inbox' && email.status !== 'lido';

      return (
        <div className="flex items-center gap-2">
          {isUnread && <span className="flex h-2 w-2 rounded-full bg-blue-600" title="Não lido" />}
          <span className={isUnread ? 'font-bold' : ''}>{email.assunto}</span>
        </div>
      );
    },
  },
  {
    accessorKey: 'dataEnvio',
    header: 'Data',
    cell: ({ row }) => {
      return <div className="text-right text-nowrap">{row.getValue('dataEnvio')}</div>;
    },
  },
  {
    id: 'status',
    header: () => <div className="text-right">Status</div>,
    cell: ({ row }) => {
      const email = row.original;
      if (pageType === 'sent') {
        return (
          <div className="flex justify-end" title={email.status === 'lido' ? 'Lido pelo destinatário' : 'Enviado'}>
            {email.status === 'lido' ? (
              <CheckCheck className="h-5 w-5 text-blue-500" />
            ) : (
              <CheckCheck className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
        );
      }
      return null;
    },
  },
];