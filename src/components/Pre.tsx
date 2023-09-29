'use client';

import { styled } from '@mui/material/styles';

export const Pre = styled('pre')(({ theme }) => ({
  color: theme.palette.text.primary,
  background: theme.palette.action.selected,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  overflowX: 'auto',
  userSelect: 'all',
}));
