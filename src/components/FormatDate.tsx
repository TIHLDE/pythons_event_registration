'use client';

import { format } from 'date-fns';
import { nb } from 'date-fns/locale';

export type FormatDateProps = {
  time: string;
  format?: string;
};

export const FormatDate = ({ format: formatting = "EEEE dd. MMMM' 'HH:mm", time }: FormatDateProps) => (
  <>
    {format(new Date(time), formatting, {
      locale: nb,
    })}
  </>
);
