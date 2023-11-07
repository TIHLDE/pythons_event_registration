'use client';

import { Accordion, AccordionItem } from '@nextui-org/accordion';
import clsx from 'clsx';
import { ReactNode, useEffect, useId, useState } from 'react';

import { stats } from '~/stats';

export type StandaloneExpandProps = {
  primary: string;
  secondary?: string;
  icon: ReactNode;
  children: ReactNode;
  expanded?: boolean;
  onExpand?: (expanded: boolean) => void;
  className?: string;
};

export const StandaloneExpand = ({ primary, secondary, className, icon, children, expanded, onExpand }: StandaloneExpandProps) => {
  const id = useId();
  const [isExpanded, setExpanded] = useState(false);

  useEffect(() => {
    if (isExpanded) {
      stats.event(`Open Accordion: "${primary}"`);
    }
  }, [isExpanded, primary]);

  return (
    <Accordion
      className={clsx([`px-0`, className])}
      itemClasses={{
        trigger: 'py-3',
        content: 'pb-4',
        title: 'text-base',
      }}
      onSelectionChange={() => (onExpand ? onExpand(!(expanded !== undefined ? expanded : isExpanded)) : setExpanded((prev) => !prev))}
      selectedKeys={new Set((expanded !== undefined ? expanded : isExpanded) ? [id] : [])}
      variant='splitted'>
      <AccordionItem key={id} startContent={icon} subtitle={secondary} title={primary}>
        {children}
      </AccordionItem>
    </Accordion>
  );
};
