'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types/dashboard';

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  if (!items.length) return null;

  return (
    <nav
      className={cn(
        'flex items-center space-x-1 text-sm text-muted-foreground',
        className
      )}
      aria-label='Breadcrumb'
    >
      <Link
        href='/dashboard'
        className='flex items-center hover:text-foreground transition-colors'
        aria-label='Accueil'
      >
        <Home className='w-4 h-4' />
      </Link>

      {items.map((item, index) => (
        <React.Fragment key={index}>
          <ChevronRight className='w-4 h-4 text-muted-foreground/60' />
          {item.href && index < items.length - 1 ? (
            <Link
              href={item.href}
              className='hover:text-foreground transition-colors'
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={cn(
                index === items.length - 1 ? 'text-foreground font-medium' : ''
              )}
              aria-current={index === items.length - 1 ? 'page' : undefined}
            >
              {item.label}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export { Breadcrumbs as default };
