'use client';

import React from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { TopNav } from '@/components/layout/TopNav';
import { BottomNav } from '@/components/layout/BottomNav';
import { FloatingActionButton } from '@/components/ui/interactions';
import { cn } from '@/lib/utils';
import { UserRole, User } from '@/types/dashboard';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  user?: User;
  sidebarCollapsed?: boolean;
  className?: string;
}

export function DashboardLayout({
  children,
  userRole = 'Admin',
  user,
  sidebarCollapsed = false,
  className,
}: DashboardLayoutProps) {
  return (
    <div className='min-h-screen bg-background'>
      {/* Sidebar */}
      <Sidebar userRole={userRole} />

      {/* Main content area */}
      <div
        className={cn(
          'transition-all duration-300 ease-in-out',
          'lg:pl-64', // Default sidebar width
          sidebarCollapsed && 'lg:pl-16',
          'pb-16 sm:pb-0' // Bottom padding for mobile nav
        )}
      >
        {/* Top Navigation */}
        <TopNav
          user={user}
          sidebarCollapsed={sidebarCollapsed}
          notifications={[
            {
              id: '1',
              title: 'Campagne terminée',
              message:
                'La campagne "Promo été 2024" s\'est terminée avec succès',
              type: 'success',
              unread: true,
              timestamp: new Date(),
            },
            {
              id: '2',
              title: 'Faible engagement',
              message:
                'La campagne "Newsletter hebdo" a un taux d\'ouverture de 8%',
              type: 'warning',
              unread: true,
              timestamp: new Date(),
            },
          ]}
        />

        {/* Page content */}
        <main className={cn('flex-1 p-4 lg:p-6', className)}>{children}</main>
      </div>

      {/* Mobile bottom navigation */}
      <BottomNav notifications={2} />

      {/* Floating Action Button */}
      <FloatingActionButton
        actions={[
          {
            label: 'Nouvelle campagne',
            onClick: () => console.log('New campaign'),
            primary: true,
          },
          {
            label: 'Nouveau segment',
            onClick: () => console.log('New segment'),
          },
          {
            label: 'Importer des contacts',
            onClick: () => console.log('Import contacts'),
          },
        ]}
      />
    </div>
  );
}

export { DashboardLayout as default };
