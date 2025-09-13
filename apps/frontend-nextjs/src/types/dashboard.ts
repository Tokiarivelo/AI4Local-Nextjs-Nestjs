export type UserRole = 'Admin' | 'Manager' | 'Editor' | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export interface NavigationItem {
  id: string;
  label: string;
  icon?: string;
  href?: string;
  children?: NavigationItem[];
  requiredPermissions?: string[];
  badge?: string | number;
}

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'scheduled' | 'completed' | 'paused';
  type: 'email' | 'sms' | 'push' | 'social';
  audience: number;
  openRate?: number;
  clickRate?: number;
  conversionRate?: number;
  createdAt: Date;
  updatedAt: Date;
  scheduledAt?: Date;
  createdBy: string;
  tags: string[];
}

export interface Client {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  status: 'active' | 'inactive' | 'unsubscribed';
  segments: string[];
  tags: string[];
  lastActivity: Date;
  createdAt: Date;
  ltv: number;
}

export interface Segment {
  id: string;
  name: string;
  description: string;
  clientCount: number;
  criteria: SegmentCriteria[];
  createdAt: Date;
  updatedAt: Date;
}

export interface SegmentCriteria {
  field: string;
  operator:
    | 'equals'
    | 'contains'
    | 'greater_than'
    | 'less_than'
    | 'in'
    | 'not_in';
  value: string | number | string[];
}

export interface Analytics {
  period: 'today' | 'week' | 'month' | 'quarter' | 'year';
  campaigns: {
    total: number;
    active: number;
    avgOpenRate: number;
    avgClickRate: number;
    avgConversionRate: number;
  };
  clients: {
    total: number;
    active: number;
    newThisMonth: number;
    avgLtv: number;
  };
  revenue: {
    total: number;
    thisMonth: number;
    growth: number;
  };
}

export interface DashboardStats {
  totalCampaigns: number;
  activeCampaigns: number;
  totalClients: number;
  activeClients: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  revenue: number;
  revenueGrowth: number;
}

export interface NotificationConfig {
  id: string;
  type:
    | 'campaign_completed'
    | 'low_engagement'
    | 'goal_reached'
    | 'system_alert';
  enabled: boolean;
  channels: ('email' | 'in_app' | 'sms')[];
  conditions?: Record<string, any>;
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, row: T) => React.ReactNode;
  width?: string;
}

export interface TableAction<T = any> {
  label: string;
  icon?: string;
  onClick: (row: T) => void;
  variant?: 'default' | 'destructive';
  hidden?: (row: T) => boolean;
}

export interface BulkAction<T = any> {
  label: string;
  icon?: string;
  onClick: (selectedRows: T[]) => void;
  variant?: 'default' | 'destructive';
  disabled?: (selectedRows: T[]) => boolean;
}

export interface FilterOption {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'daterange' | 'number';
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface CommandPaletteItem {
  id: string;
  label: string;
  description?: string;
  icon?: string;
  shortcut?: string;
  category: string;
  action: () => void;
  keywords: string[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}
