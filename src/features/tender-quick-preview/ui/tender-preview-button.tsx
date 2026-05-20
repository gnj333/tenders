'use client';

import { Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { useQuickPreview } from '../model/context';

type Props = { tenderId: string };

export function TenderPreviewButton({ tenderId }: Props) {
  const { open } = useQuickPreview();

  return (
    <Button
      variant='outline'
      size='sm'
      onClick={(e) => {
        // Stop the card-wide link from intercepting the click.
        e.preventDefault();
        e.stopPropagation();
        open(tenderId);
      }}
    >
      <Eye className='size-3.5' aria-hidden />
      Предпросмотр
    </Button>
  );
}
