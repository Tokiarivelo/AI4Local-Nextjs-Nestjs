'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Megaphone, Users, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface BottomNavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string | number;
}

interface BottomNavProps {
  className?: string;
  notifications?: number;
}

export function BottomNav({ className, notifications = 0 }: BottomNavProps) {
  const pathname = usePathname();

  const navItems: BottomNavItem[] = [
    {
      id: 'dashboard',
      label: 'Accueil',
      href: '/dashboard',
      icon: <LayoutDashboard className='w-5 h-5' />,
    },
    {
      id: 'campaigns',
      label: 'Campagnes',
      href: '/campaigns',
      icon: <Megaphone className='w-5 h-5' />,
    },
    {
      id: 'clients',
      label: 'Clients',
      href: '/clients',
      icon: <Users className='w-5 h-5' />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      href: '/analytics',
      icon: <BarChart3 className='w-5 h-5' />,
      badge: notifications > 0 ? notifications : undefined,
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard' || pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur border-t border-border sm:hidden',
        className
      )}
      aria-label='Navigation mobile'
    >
      <div className='flex items-center justify-around h-16 px-2'>
        {navItems.map((item) => {
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.id}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-lg transition-colors min-w-0 flex-1',
                isActive
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-current={isActive ? 'page' : undefined}
            >
              <div className='relative'>
                {item.icon}
                {item.badge && (
                  <Badge
                    variant='destructive'
                    className='absolute -top-1 -right-1 w-4 h-4 text-xs p-0 flex items-center justify-center'
                  >
                    {typeof item.badge === 'number' && item.badge > 9
                      ? '9+'
                      : item.badge}
                  </Badge>
                )}
              </div>
              <span className='text-xs font-medium truncate max-w-full'>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export { BottomNav as default };
