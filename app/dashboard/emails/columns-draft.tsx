'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Draft } from '@/app/contexts/EmailContext';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

export const draftColumns = (
  deleteHandler: (draftId: number) => void
): ColumnDef<Draft>[] => [
  {
    accessorKey: 'emailDestinatario',
    header: 'Para',
  },
  {
    accessorKey: 'assunto',
    header: 'Assunto',
    cell: ({ row }) => {
        return <div className="font-medium">{row.original.assunto || '(Sem assunto)'}</div>
    }
  },
  {
    id: 'actions',
    header: () => <div className="text-right">Ações</div>,
    cell: ({ row }) => {
      const draft = row.original;
      return (
        <div className="text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              if (window.confirm('Tem certeza que deseja excluir este rascunho?')) {
                deleteHandler(draft.rascunhoId);
              }
            }}
          >
            <Trash2 className="h-4 w-4 text-red-500" />
            <span className="sr-only">Excluir</span>
          </Button>
        </div>
      );
    },
  },
];