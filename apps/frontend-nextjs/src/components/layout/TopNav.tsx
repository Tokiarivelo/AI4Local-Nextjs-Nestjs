'use client';

import React, { useState } from 'react';
import { Search, Plus, Bell, ChevronDown, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { User as UserType } from '@/types/dashboard';

interface TopNavProps {
  user?: UserType;
  sidebarCollapsed?: boolean;
  className?: string;
  onSearch?: (query: string) => void;
  notifications?: Notification[];
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  unread: boolean;
  timestamp: Date;
}

export function TopNav({
  user,
  sidebarCollapsed = false,
  className,
  onSearch,
  notifications = [],
}: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const unreadCount = notifications.filter((n) => n.unread).length;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const newActions = [
    {
      label: 'Nouvelle campagne',
      description: 'Créer une nouvelle campagne marketing',
      action: () => console.log('New campaign'),
      shortcut: 'Ctrl+N',
    },
    {
      label: 'Nouveau segment',
      description: 'Créer un nouveau segment de clients',
      action: () => console.log('New segment'),
    },
    {
      label: 'Importer des contacts',
      description: 'Importer des contacts depuis un fichier CSV',
      action: () => console.log('Import contacts'),
    },
    {
      label: 'Nouvelle audience',
      description: 'Définir une nouvelle audience cible',
      action: () => console.log('New audience'),
    },
  ];

  const userMenuItems = [
    { label: 'Profil', action: () => console.log('Profile') },
    { label: 'Paramètres', action: () => console.log('Settings') },
    { label: 'Équipe', action: () => console.log('Team') },
    { label: 'Aide', action: () => console.log('Help') },
    {
      label: 'Se déconnecter',
      action: () => console.log('Logout'),
      variant: 'destructive',
    },
  ];

  return (
    <header
      className={cn(
        'sticky top-0 z-40 w-full bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-border',
        className
      )}
    >
      <div className='flex items-center justify-between h-16 px-4'>
        {/* Left section */}
        <div className='flex items-center space-x-4'>
          {/* Compact logo for collapsed sidebar */}
          {sidebarCollapsed && (
            <div className='flex items-center'>
              <div className='w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center'>
                <span className='font-bold text-white text-sm'>AI</span>
              </div>
              <span className='ml-2 text-lg font-bold text-foreground hidden sm:block'>
                AI4Local
              </span>
            </div>
          )}

          {/* Global search */}
          <form onSubmit={handleSearch} className='relative w-64 sm:w-80'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4' />
            <Input
              type='search'
              placeholder='Rechercher campagnes, clients, contenus...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 w-full'
              aria-label='Recherche globale'
            />
            <kbd className='absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded hidden sm:inline-block'>
              Ctrl K
            </kbd>
          </form>
        </div>

        {/* Right section */}
        <div className='flex items-center space-x-2'>
          {/* New button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className='bg-primary text-primary-foreground hover:bg-primary/90'>
                <Plus className='w-4 h-4 mr-2' />
                <span className='hidden sm:inline'>Nouveau</span>
                <ChevronDown className='w-4 h-4 ml-2' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-64'>
              <DropdownMenuLabel>Créer</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {newActions.map((action, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={action.action}
                  className='flex flex-col items-start space-y-1 py-3'
                >
                  <div className='flex items-center justify-between w-full'>
                    <span className='font-medium'>{action.label}</span>
                    {action.shortcut && (
                      <kbd className='text-xs bg-muted px-1.5 py-0.5 rounded'>
                        {action.shortcut}
                      </kbd>
                    )}
                  </div>
                  {action.description && (
                    <span className='text-sm text-muted-foreground'>
                      {action.description}
                    </span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='sm' className='relative'>
                <Bell className='w-5 h-5' />
                {unreadCount > 0 && (
                  <Badge
                    variant='destructive'
                    className='absolute -top-1 -right-1 w-5 h-5 text-xs p-0 flex items-center justify-center'
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
                <span className='sr-only'>
                  {unreadCount > 0
                    ? `${unreadCount} notifications non lues`
                    : 'Notifications'}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-80'>
              <DropdownMenuLabel className='flex items-center justify-between'>
                Notifications
                {unreadCount > 0 && (
                  <Badge variant='secondary'>{unreadCount} nouvelles</Badge>
                )}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className='max-h-64 overflow-y-auto'>
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map((notification) => (
                    <DropdownMenuItem
                      key={notification.id}
                      className='flex flex-col items-start space-y-1 py-3'
                    >
                      <div className='flex items-center justify-between w-full'>
                        <span className='font-medium text-sm'>
                          {notification.title}
                        </span>
                        {notification.unread && (
                          <div className='w-2 h-2 bg-primary rounded-full' />
                        )}
                      </div>
                      <span className='text-sm text-muted-foreground'>
                        {notification.message}
                      </span>
                      <span className='text-xs text-muted-foreground'>
                        {notification.timestamp.toLocaleDateString('fr-FR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <div className='p-4 text-center text-muted-foreground text-sm'>
                    Aucune notification
                  </div>
                )}
              </div>
              {notifications.length > 5 && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className='text-center text-sm text-primary'>
                    Voir toutes les notifications
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                className='flex items-center space-x-2 pl-2'
              >
                <div className='w-8 h-8 bg-muted rounded-full flex items-center justify-center'>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className='w-8 h-8 rounded-full object-cover'
                    />
                  ) : (
                    <User className='w-4 h-4' />
                  )}
                </div>
                <div className='hidden sm:block text-left'>
                  <div className='text-sm font-medium'>
                    {user?.name || 'Utilisateur'}
                  </div>
                  <div className='text-xs text-muted-foreground'>
                    {user?.role || 'Rôle'}
                  </div>
                </div>
                <ChevronDown className='w-4 h-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-48'>
              <DropdownMenuLabel>
                <div className='flex flex-col space-y-1'>
                  <span className='font-medium'>
                    {user?.name || 'Utilisateur'}
                  </span>
                  <span className='text-xs font-normal text-muted-foreground'>
                    {user?.email || 'email@example.com'}
                  </span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userMenuItems.map((item, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={item.action}
                  className={cn(
                    item.variant === 'destructive' &&
                      'text-destructive focus:text-destructive'
                  )}
                >
                  {item.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

export { TopNav as default };
