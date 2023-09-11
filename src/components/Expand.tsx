'use client';

import ExpandLessIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreIcon from '@mui/icons-material/ExpandMoreRounded';
import {
  Collapse,
  CollapseProps,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemProps,
  ListItemText,
  ListItemTextProps,
  Paper,
  PaperProps,
  Stack,
} from '@mui/material';
import { ReactNode, useState } from 'react';

export type StandaloneExpandProps = PaperProps &
  Pick<ListItemTextProps, 'primary' | 'secondary'> & {
    icon: ReactNode;
    children: ReactNode;
    listItemProps?: ListItemProps;
    collapseProps?: CollapseProps;
    expanded?: boolean;
    onExpand?: (expanded: boolean) => void;
  };

export const StandaloneExpand = ({
  primary,
  secondary,
  icon,
  children,
  collapseProps,
  listItemProps,
  expanded,
  onExpand,
  sx,
  ...props
}: StandaloneExpandProps) => {
  const [isExpanded, setExpanded] = useState(false);

  return (
    <Paper sx={{ p: 0, overflow: 'hidden', ...sx }} {...props}>
      <ListItem disablePadding {...listItemProps}>
        <ListItemButton onClick={() => (onExpand ? onExpand(!(expanded !== undefined ? expanded : isExpanded)) : setExpanded((prev) => !prev))}>
          <ListItemIcon sx={{ minWidth: 35 }}>{icon}</ListItemIcon>
          <ListItemText primary={primary} secondary={secondary} />
          <ListItemIcon sx={{ minWidth: 35 }}>{expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}</ListItemIcon>
        </ListItemButton>
      </ListItem>
      <Collapse mountOnEnter {...collapseProps} in={expanded !== undefined ? expanded : isExpanded}>
        <Stack gap={1} sx={{ p: 2 }}>
          {children}
        </Stack>
      </Collapse>
    </Paper>
  );
};
