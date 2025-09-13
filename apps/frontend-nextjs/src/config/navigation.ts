import { NavigationItem, UserRole } from '@/types/dashboard';
import {
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
  FileTemplate,
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
  Trash2,
  UserPlus,
  Database,
  Shield,
  Link,
  Webhook,
  Book,
  Video,
  MessageSquare,
} from 'lucide-react';

export const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Accueil',
    icon: 'LayoutDashboard',
    children: [
      { id: 'overview', label: 'Overview', href: '/dashboard', icon: 'Home' },
      {
        id: 'realtime',
        label: 'Temps réel',
        href: '/dashboard/realtime',
        icon: 'Clock',
      },
      {
        id: 'notifications',
        label: 'Notifications',
        href: '/dashboard/notifications',
        icon: 'BellRing',
      },
    ],
  },
  {
    id: 'campaigns',
    label: 'Campagnes',
    icon: 'Megaphone',
    children: [
      {
        id: 'all-campaigns',
        label: 'Toutes les campagnes',
        href: '/campaigns',
        icon: 'Megaphone',
      },
      {
        id: 'create-campaign',
        label: 'Créer une campagne',
        href: '/campaigns/create',
        icon: 'Plus',
      },
      {
        id: 'templates',
        label: 'Templates',
        href: '/campaigns/templates',
        icon: 'FileTemplate',
      },
      {
        id: 'ab-tests',
        label: 'A/B Tests',
        href: '/campaigns/ab-tests',
        icon: 'FlaskConical',
      },
      {
        id: 'drafts',
        label: 'Brouillons',
        href: '/campaigns/drafts',
        icon: 'Edit',
      },
    ],
  },
  {
    id: 'clients',
    label: 'Clients',
    icon: 'Users',
    children: [
      { id: 'directory', label: 'Annuaire', href: '/clients', icon: 'Users' },
      {
        id: 'segments',
        label: 'Segments',
        href: '/clients/segments',
        icon: 'UserCog',
      },
      {
        id: 'import-export',
        label: 'Import / Export CSV',
        href: '/clients/import-export',
        icon: 'Upload',
      },
      {
        id: 'loyalty',
        label: 'Programme de fidélité',
        href: '/clients/loyalty',
        icon: 'Gift',
      },
    ],
  },
  {
    id: 'content',
    label: 'Contenu',
    icon: 'FileText',
    children: [
      {
        id: 'publications',
        label: 'Publications',
        href: '/content/publications',
        icon: 'FileText',
      },
      { id: 'ads', label: 'Publicités', href: '/content/ads', icon: 'Zap' },
      {
        id: 'assets',
        label: "Bibliothèque d'assets",
        href: '/content/assets',
        icon: 'Image',
      },
      {
        id: 'scheduler',
        label: 'Planificateur',
        href: '/content/scheduler',
        icon: 'Calendar',
      },
    ],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    children: [
      {
        id: 'overview-analytics',
        label: 'Vue générale',
        href: '/analytics',
        icon: 'BarChart3',
      },
      {
        id: 'funnels',
        label: 'Funnels',
        href: '/analytics/funnels',
        icon: 'TrendingUp',
      },
      {
        id: 'cohorts',
        label: 'Cohortes',
        href: '/analytics/cohorts',
        icon: 'GitBranch',
      },
      { id: 'ltv', label: 'LTV', href: '/analytics/ltv', icon: 'DollarSign' },
      {
        id: 'custom-reports',
        label: 'Rapports personnalisés',
        href: '/analytics/reports',
        icon: 'FileBarChart',
      },
      {
        id: 'exports',
        label: 'Exports',
        href: '/analytics/exports',
        icon: 'Download',
      },
    ],
  },
  {
    id: 'notifications-alerts',
    label: 'Notifications & Alertes',
    icon: 'Bell',
    children: [
      {
        id: 'realtime-feed',
        label: 'Flux en temps réel',
        href: '/notifications/feed',
        icon: 'Bell',
      },
      {
        id: 'alert-settings',
        label: 'Paramètres alertes',
        href: '/notifications/settings',
        icon: 'Settings',
      },
    ],
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: 'CreditCard',
    requiredPermissions: ['billing.read'],
    children: [
      {
        id: 'subscription',
        label: 'Abonnement',
        href: '/billing/subscription',
        icon: 'CreditCard',
      },
      {
        id: 'invoices',
        label: 'Factures',
        href: '/billing/invoices',
        icon: 'FileText',
      },
      {
        id: 'usage',
        label: 'Utilisation',
        href: '/billing/usage',
        icon: 'BarChart3',
      },
    ],
  },
  {
    id: 'settings',
    label: 'Paramètres',
    icon: 'Settings',
    children: [
      {
        id: 'team',
        label: 'Équipe & rôles',
        href: '/settings/team',
        icon: 'Users2',
        requiredPermissions: ['users.read'],
      },
      {
        id: 'permissions',
        label: 'Permissions',
        href: '/settings/permissions',
        icon: 'Shield',
        requiredPermissions: ['permissions.manage'],
      },
      {
        id: 'integrations',
        label: 'Intégrations',
        href: '/settings/integrations',
        icon: 'Link',
      },
      {
        id: 'webhooks',
        label: 'Webhooks & API keys',
        href: '/settings/webhooks',
        icon: 'Webhook',
        requiredPermissions: ['api.manage'],
      },
    ],
  },
  {
    id: 'help',
    label: 'Aide',
    icon: 'HelpCircle',
    children: [
      {
        id: 'documentation',
        label: 'Documentation',
        href: '/help/docs',
        icon: 'Book',
      },
      {
        id: 'tutorials',
        label: 'Tutoriels',
        href: '/help/tutorials',
        icon: 'Video',
      },
      {
        id: 'support',
        label: 'Contacter le support',
        href: '/help/support',
        icon: 'MessageSquare',
      },
    ],
  },
];

export const rolePermissions: Record<UserRole, string[]> = {
  Admin: [
    'campaigns.read',
    'campaigns.write',
    'campaigns.delete',
    'clients.read',
    'clients.write',
    'clients.delete',
    'analytics.read',
    'analytics.export',
    'billing.read',
    'billing.write',
    'users.read',
    'users.write',
    'users.delete',
    'permissions.manage',
    'api.manage',
    'content.read',
    'content.write',
    'content.delete',
    'notifications.read',
    'notifications.write',
  ],
  Manager: [
    'campaigns.read',
    'campaigns.write',
    'clients.read',
    'clients.write',
    'analytics.read',
    'analytics.export',
    'users.read',
    'content.read',
    'content.write',
    'notifications.read',
  ],
  Editor: [
    'campaigns.read',
    'campaigns.write',
    'clients.read',
    'clients.write',
    'content.read',
    'content.write',
    'analytics.read',
    'notifications.read',
  ],
  Viewer: [
    'campaigns.read',
    'clients.read',
    'analytics.read',
    'content.read',
    'notifications.read',
  ],
};

export function hasPermission(userRole: UserRole, permission: string): boolean {
  return rolePermissions[userRole]?.includes(permission) ?? false;
}

export function filterNavigationByRole(
  navigation: NavigationItem[],
  userRole: UserRole
): NavigationItem[] {
  return navigation
    .map((item) => {
      const filteredChildren = item.children?.filter((child) => {
        if (!child.requiredPermissions) return true;
        return child.requiredPermissions.some((permission) =>
          hasPermission(userRole, permission)
        );
      });

      if (
        item.requiredPermissions &&
        !item.requiredPermissions.some((permission) =>
          hasPermission(userRole, permission)
        )
      ) {
        return null;
      }

      return {
        ...item,
        children: filteredChildren,
      };
    })
    .filter(Boolean) as NavigationItem[];
}
