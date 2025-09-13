'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  ChevronRight,
  Menu,
  X,
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  BarChart3,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  Home,
  Clock,
  BellRing,
  Plus,
  File,
  FlaskConical,
  Edit,
  UserCog,
  Zap,
  Upload,
  Download,
  Gift,
  Image,
  Calendar,
  TrendingUp,
  GitBranch,
  Users2,
  DollarSign,
  FileBarChart,
  Book,
  Video,
  MessageSquare,
  Shield,
  LinkIcon,
  Webhook,
} from 'lucide-react';
import { navigationItems, filterNavigationByRole } from '@/config/navigation';
import { NavigationItem, UserRole } from '@/types/dashboard';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';

interface SidebarProps {
  userRole?: UserRole;
  className?: string;
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  Megaphone,
  Users,
  FileText,
  BarChart3,
  Bell,
  CreditCard,
  Settings,
  HelpCircle,
  Home,
  Clock,
  BellRing,
  Plus,
  FileTemplate: File,
  FlaskConical,
  Edit,
  UserCog,
  Zap,
  Upload,
  Download,
  Gift,
  Image,
  Calendar,
  TrendingUp,
  GitBranch,
  Users2,
  DollarSign,
  FileBarChart,
  Book,
  Video,
  MessageSquare,
  Shield,
  Link: LinkIcon,
  Webhook,
};

export function Sidebar({ userRole = 'Admin', className }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>(['dashboard']);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const filteredNavigation = filterNavigationByRole(navigationItems, userRole);

  useEffect(() => {
    // Auto-expand parent item based on current path
    const activeItem = filteredNavigation.find((item) =>
      item.children?.some((child) => child.href === pathname)
    );
    if (activeItem && !expandedItems.includes(activeItem.id)) {
      setExpandedItems((prev) => [...prev, activeItem.id]);
    }
  }, [pathname, filteredNavigation]); // eslint-disable-line react-hooks/exhaustive-deps

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isItemActive = (item: NavigationItem): boolean => {
    if (item.href === pathname) return true;
    return item.children?.some((child) => child.href === pathname) ?? false;
  };

  const renderIcon = (
    iconName: string | undefined,
    className: string = 'w-5 h-5'
  ) => {
    if (!iconName) return null;
    const Icon = iconMap[iconName];
    return Icon ? <Icon className={className} /> : null;
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const isActive = isItemActive(item);
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const itemContent = (
      <>
        <div className='flex items-center flex-1 min-w-0'>
          <div className='flex items-center justify-center w-8 h-8 mr-3'>
            {renderIcon(item.icon)}
          </div>
          {!collapsed && (
            <>
              <span className='font-medium text-sm truncate flex-1'>
                {item.label}
              </span>
              {item.badge && (
                <Badge variant='secondary' className='ml-2 text-xs'>
                  {item.badge}
                </Badge>
              )}
            </>
          )}
        </div>
        {!collapsed && hasChildren && (
          <div className='ml-2'>
            {isExpanded ? (
              <ChevronDown className='w-4 h-4' />
            ) : (
              <ChevronRight className='w-4 h-4' />
            )}
          </div>
        )}
      </>
    );

    const buttonClass = cn(
      'w-full flex items-center justify-between p-3 rounded-lg text-left transition-all duration-200 group',
      'hover:bg-sidebar-accent focus:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-sidebar-ring',
      isActive
        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
        : 'text-sidebar-foreground hover:text-sidebar-accent-foreground',
      level > 0 && 'ml-4'
    );

    const itemElement =
      hasChildren || !item.href ? (
        <Button
          variant='ghost'
          className={buttonClass}
          onClick={() => hasChildren && toggleExpanded(item.id)}
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-haspopup={hasChildren ? 'true' : undefined}
        >
          {itemContent}
        </Button>
      ) : (
        <Link href={item.href} className={buttonClass}>
          {itemContent}
        </Link>
      );

    return (
      <div key={item.id} className='space-y-1'>
        {collapsed && item.icon ? (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>{itemElement}</TooltipTrigger>
              <TooltipContent side='right'>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          itemElement
        )}

        {!collapsed && hasChildren && isExpanded && (
          <div className='ml-4 space-y-1 border-l border-sidebar-border pl-4'>
            {item.children?.map((child) => (
              <Link
                key={child.id}
                href={child.href || '#'}
                className={cn(
                  'flex items-center p-2 rounded-md text-sm transition-colors duration-200',
                  'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                  'focus:bg-sidebar-accent focus:text-sidebar-accent-foreground focus:outline-none focus:ring-2 focus:ring-sidebar-ring',
                  pathname === child.href
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
                    : 'text-sidebar-foreground'
                )}
              >
                <div className='flex items-center justify-center w-6 h-6 mr-3'>
                  {renderIcon(child.icon, 'w-4 h-4')}
                </div>
                <span className='truncate'>{child.label}</span>
                {child.badge && (
                  <Badge variant='secondary' className='ml-auto text-xs'>
                    {child.badge}
                  </Badge>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  };

  const sidebarContent = (
    <div className='flex flex-col h-full'>
      {/* Header */}
      <div className='flex items-center justify-between p-4 border-b border-sidebar-border'>
        {!collapsed && (
          <div className='flex items-center'>
            <div className='w-8 h-8 bg-gradient-to-br from-sidebar-primary to-sidebar-accent rounded-lg flex items-center justify-center'>
              <span className='font-bold text-white text-sm'>AI</span>
            </div>
            <span className='ml-2 text-lg font-bold text-sidebar-foreground'>
              AI4Local
            </span>
          </div>
        )}
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setCollapsed(!collapsed)}
          className='w-8 h-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent lg:flex hidden'
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <Menu className='w-4 h-4' />
        </Button>
        <Button
          variant='ghost'
          size='sm'
          onClick={() => setMobileOpen(false)}
          className='w-8 h-8 p-0 text-sidebar-foreground hover:bg-sidebar-accent lg:hidden'
          aria-label='Close sidebar'
        >
          <X className='w-4 h-4' />
        </Button>
      </div>

      {/* Navigation */}
      <nav
        className='flex-1 p-4 space-y-2 overflow-y-auto'
        role='navigation'
        aria-label='Main navigation'
      >
        {filteredNavigation.map((item) => renderNavigationItem(item))}
      </nav>

      {/* Footer */}
      <div className='p-4 border-t border-sidebar-border'>
        {!collapsed && (
          <div className='text-xs text-sidebar-foreground/70 text-center'>
            <p>AI4Local Dashboard</p>
            <p>v1.0.0</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setMobileOpen(false)}
          aria-hidden='true'
        />
      )}

      {/* Mobile toggle button */}
      <Button
        variant='ghost'
        size='sm'
        onClick={() => setMobileOpen(true)}
        className='fixed top-4 left-4 z-50 w-10 h-10 p-0 bg-sidebar lg:hidden'
        aria-label='Open sidebar'
      >
        <Menu className='w-5 h-5 text-sidebar-foreground' />
      </Button>

      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex fixed left-0 top-0 z-30 h-screen bg-sidebar transition-all duration-300 ease-in-out',
          collapsed ? 'w-16' : 'w-64',
          className
        )}
        aria-label='Sidebar navigation'
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:hidden',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        aria-label='Mobile sidebar navigation'
      >
        {sidebarContent}
      </aside>
    </>
  );
}

export { Sidebar as default };
