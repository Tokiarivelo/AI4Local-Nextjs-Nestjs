'use client';

import React, { useState } from 'react';
import { Plus, Search, Command } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { CommandPaletteItem } from '@/types/dashboard';

interface FloatingActionButtonProps {
  actions?: Array<{
    label: string;
    icon?: React.ReactNode;
    onClick: () => void;
    primary?: boolean;
  }>;
  className?: string;
}

interface CommandPaletteProps {
  items: CommandPaletteItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface ToastProps {
  title: string;
  description?: string;
  type: 'success' | 'error' | 'warning' | 'info';
  onClose?: () => void;
}

interface ConfirmationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
  onConfirm: () => void;
  loading?: boolean;
}

export function FloatingActionButton({
  actions,
  className,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultActions = [
    {
      label: 'Nouvelle campagne',
      icon: <Plus className='w-4 h-4' />,
      onClick: () => console.log('New campaign'),
      primary: true,
    },
  ];

  const actionList = actions || defaultActions;
  const primaryAction = actionList.find((a) => a.primary) || actionList[0];

  if (actionList.length === 1) {
    return (
      <Button
        size='lg'
        className={cn(
          'fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          className
        )}
        onClick={primaryAction.onClick}
        aria-label={primaryAction.label}
      >
        {primaryAction.icon || <Plus className='w-5 h-5' />}
      </Button>
    );
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 flex flex-col items-end space-y-2',
        className
      )}
    >
      {/* Expanded actions */}
      {isExpanded && (
        <div className='flex flex-col space-y-2 mb-2'>
          {actionList
            .filter((a) => !a.primary)
            .map((action, index) => (
              <Button
                key={index}
                variant='secondary'
                size='sm'
                className='shadow-md hover:shadow-lg transition-all duration-200'
                onClick={() => {
                  action.onClick();
                  setIsExpanded(false);
                }}
              >
                {action.icon && <span className='mr-2'>{action.icon}</span>}
                {action.label}
              </Button>
            ))}
        </div>
      )}

      {/* Main FAB */}
      <Button
        size='lg'
        className={cn(
          'h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-200',
          'bg-primary hover:bg-primary/90 text-primary-foreground',
          isExpanded && 'rotate-45'
        )}
        onClick={() => {
          if (actionList.length > 1) {
            setIsExpanded(!isExpanded);
          } else {
            primaryAction.onClick();
          }
        }}
        aria-label={
          actionList.length > 1 ? "Menu d'actions rapides" : primaryAction.label
        }
        aria-expanded={actionList.length > 1 ? isExpanded : undefined}
      >
        <Plus className='w-5 h-5' />
      </Button>
    </div>
  );
}

export function CommandPalette({
  items,
  open,
  onOpenChange,
}: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  const filteredItems = items.filter(
    (item) =>
      query === '' ||
      item.label.toLowerCase().includes(query.toLowerCase()) ||
      item.description?.toLowerCase().includes(query.toLowerCase()) ||
      item.keywords.some((keyword) =>
        keyword.toLowerCase().includes(query.toLowerCase())
      )
  );

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, CommandPaletteItem[]>);

  const handleItemSelect = (item: CommandPaletteItem) => {
    item.action();
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-2xl'>
        <DialogHeader className='sr-only'>
          <DialogTitle>Palette de commandes</DialogTitle>
        </DialogHeader>

        <div className='flex items-center border-b px-3' cmdk-input-wrapper=''>
          <Command className='mr-2 h-4 w-4 shrink-0 opacity-50' />
          <Input
            placeholder='Rechercher des actions, pages...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='border-0 p-3 shadow-none outline-none focus:ring-0'
          />
          <kbd className='pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex'>
            <span className='text-xs'>ESC</span>
          </kbd>
        </div>

        <div className='max-h-96 overflow-y-auto p-1'>
          {Object.keys(groupedItems).length === 0 ? (
            <div className='py-6 text-center text-sm text-muted-foreground'>
              Aucun résultat trouvé.
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, categoryItems]) => (
              <div key={category} className='mb-2'>
                <div className='px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider'>
                  {category}
                </div>
                <div className='space-y-1'>
                  {categoryItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemSelect(item)}
                      className='w-full flex items-center px-2 py-2 text-sm rounded-md hover:bg-accent transition-colors text-left'
                    >
                      {item.icon && (
                        <span className='mr-3 flex-shrink-0'>{item.icon}</span>
                      )}
                      <div className='flex-1 min-w-0'>
                        <div className='font-medium'>{item.label}</div>
                        {item.description && (
                          <div className='text-xs text-muted-foreground'>
                            {item.description}
                          </div>
                        )}
                      </div>
                      {item.shortcut && (
                        <kbd className='ml-auto text-xs bg-muted px-1.5 py-0.5 rounded'>
                          {item.shortcut}
                        </kbd>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function Toast({ title, description, type, onClose }: ToastProps) {
  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️',
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 z-50 max-w-sm w-full bg-background rounded-lg border shadow-lg p-4',
        colors[type]
      )}
    >
      <div className='flex items-start'>
        <span className='text-lg mr-3 flex-shrink-0'>{icons[type]}</span>
        <div className='flex-1 min-w-0'>
          <h4 className='font-medium text-sm'>{title}</h4>
          {description && (
            <p className='text-sm opacity-90 mt-1'>{description}</p>
          )}
        </div>
        {onClose && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onClose}
            className='ml-2 h-6 w-6 p-0 hover:bg-black/10'
          >
            ×
          </Button>
        )}
      </div>
    </div>
  );
}

export function ConfirmationModal({
  open,
  onOpenChange,
  title,
  description,
  confirmText = 'Confirmer',
  cancelText = 'Annuler',
  variant = 'default',
  onConfirm,
  loading = false,
}: ConfirmationModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <div className='py-4'>
          <p className='text-muted-foreground'>{description}</p>
        </div>

        <div className='flex justify-end space-x-2'>
          <Button
            variant='outline'
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            variant={variant === 'destructive' ? 'destructive' : 'default'}
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            disabled={loading}
          >
            {loading ? 'En cours...' : confirmText}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
