'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface Tab {
  id: string;
  label: string;
  href?: string;
  badge?: string | number;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab?: string;
  onTabChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

interface ContextualTabsProps extends TabsProps {
  title?: string;
  description?: string;
  actions?: React.ReactNode;
}

export function Tabs({
  tabs,
  activeTab,
  onTabChange,
  variant = 'default',
  className,
}: TabsProps) {
  const pathname = usePathname();

  const getActiveTab = () => {
    if (activeTab) return activeTab;
    return tabs.find((tab) => tab.href === pathname)?.id || tabs[0]?.id;
  };

  const currentActiveTab = getActiveTab();

  const baseTabClass =
    'flex items-center space-x-2 px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20';

  const getTabClasses = (tab: Tab, isActive: boolean) => {
    const base = cn(baseTabClass, {
      'opacity-50 cursor-not-allowed': tab.disabled,
      'cursor-pointer': !tab.disabled,
    });

    switch (variant) {
      case 'pills':
        return cn(base, 'rounded-full', {
          'bg-primary text-primary-foreground': isActive,
          'text-muted-foreground hover:text-foreground hover:bg-muted':
            !isActive && !tab.disabled,
        });
      case 'underline':
        return cn(base, 'border-b-2 rounded-none', {
          'border-primary text-foreground': isActive,
          'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground':
            !isActive && !tab.disabled,
        });
      default:
        return cn(base, 'rounded-md', {
          'bg-accent text-accent-foreground': isActive,
          'text-muted-foreground hover:text-foreground hover:bg-muted':
            !isActive && !tab.disabled,
        });
    }
  };

  const renderTab = (tab: Tab) => {
    const isActive = currentActiveTab === tab.id;
    const classes = getTabClasses(tab, isActive);

    const content = (
      <>
        {tab.icon && <span className='w-4 h-4'>{tab.icon}</span>}
        <span>{tab.label}</span>
        {tab.badge && (
          <Badge
            variant={isActive ? 'secondary' : 'outline'}
            className='text-xs'
          >
            {tab.badge}
          </Badge>
        )}
      </>
    );

    if (tab.disabled) {
      return (
        <div key={tab.id} className={classes} aria-disabled='true'>
          {content}
        </div>
      );
    }

    if (tab.href) {
      return (
        <Link
          key={tab.id}
          href={tab.href}
          className={classes}
          aria-current={isActive ? 'page' : undefined}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        key={tab.id}
        onClick={() => onTabChange?.(tab.id)}
        className={classes}
        aria-selected={isActive}
        role='tab'
      >
        {content}
      </button>
    );
  };

  return (
    <div
      className={cn('flex items-center space-x-1', className)}
      role='tablist'
    >
      {tabs.map(renderTab)}
    </div>
  );
}

export function ContextualTabs({
  title,
  description,
  actions,
  tabs,
  className,
  ...tabsProps
}: ContextualTabsProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {(title || description || actions) && (
        <div className='flex items-start justify-between'>
          <div className='space-y-1'>
            {title && (
              <h2 className='text-2xl font-semibold tracking-tight'>{title}</h2>
            )}
            {description && (
              <p className='text-muted-foreground'>{description}</p>
            )}
          </div>
          {actions && (
            <div className='flex items-center space-x-2'>{actions}</div>
          )}
        </div>
      )}

      <div className='border-b'>
        <Tabs {...tabsProps} tabs={tabs} variant='underline' />
      </div>
    </div>
  );
}

// Quick filter tabs for lists
interface QuickFilterTabsProps {
  filters: Array<{
    id: string;
    label: string;
    count?: number;
    color?: 'default' | 'primary' | 'success' | 'warning' | 'destructive';
  }>;
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
  className?: string;
}

export function QuickFilterTabs({
  filters,
  activeFilter,
  onFilterChange,
  className,
}: QuickFilterTabsProps) {
  const colorVariants = {
    default:
      'text-muted-foreground border-transparent hover:text-foreground data-[active]:text-foreground data-[active]:border-border',
    primary:
      'text-primary border-primary/20 hover:border-primary/40 data-[active]:border-primary',
    success:
      'text-green-600 border-green-200 hover:border-green-300 data-[active]:border-green-500',
    warning:
      'text-yellow-600 border-yellow-200 hover:border-yellow-300 data-[active]:border-yellow-500',
    destructive:
      'text-red-600 border-red-200 hover:border-red-300 data-[active]:border-red-500',
  };

  return (
    <div className={cn('flex items-center space-x-6 border-b', className)}>
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={cn(
            'flex items-center space-x-2 pb-2 border-b-2 text-sm font-medium transition-colors',
            colorVariants[filter.color || 'default']
          )}
          data-active={activeFilter === filter.id}
        >
          <span>{filter.label}</span>
          {filter.count !== undefined && (
            <span className='bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full min-w-[1.5rem] text-center'>
              {filter.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
