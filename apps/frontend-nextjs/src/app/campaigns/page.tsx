'use client';

import React, { useState } from 'react';
import {
  Plus,
  Filter,
  Download,
  Edit,
  Copy,
  Play,
  Pause,
  Trash2,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { QuickFilterTabs } from '@/components/layout/Tabs';
import { DataTable } from '@/components/ui/data-table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Campaign,
  TableColumn,
  TableAction,
  BulkAction,
} from '@/types/dashboard';

// Données exemple
const mockCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Promo Black Friday 2024',
    status: 'active',
    type: 'email',
    audience: 2847,
    openRate: 28.4,
    clickRate: 4.2,
    conversionRate: 2.1,
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-15'),
    scheduledAt: new Date('2024-11-25'),
    createdBy: 'Marie Dupont',
    tags: ['promo', 'e-commerce', 'black-friday'],
  },
  {
    id: '2',
    name: 'Newsletter Hebdomadaire #47',
    status: 'completed',
    type: 'email',
    audience: 5234,
    openRate: 22.1,
    clickRate: 3.8,
    conversionRate: 1.5,
    createdAt: new Date('2024-11-05'),
    updatedAt: new Date('2024-11-12'),
    createdBy: 'Jean Martin',
    tags: ['newsletter', 'hebdo'],
  },
  {
    id: '3',
    name: 'Relance Panier Abandonné',
    status: 'active',
    type: 'email',
    audience: 156,
    openRate: 35.2,
    clickRate: 8.9,
    conversionRate: 4.2,
    createdAt: new Date('2024-11-10'),
    updatedAt: new Date('2024-11-14'),
    createdBy: 'Sophie Lambert',
    tags: ['relance', 'automatique'],
  },
  {
    id: '4',
    name: 'Campagne SMS Soldes',
    status: 'scheduled',
    type: 'sms',
    audience: 1203,
    createdAt: new Date('2024-11-12'),
    updatedAt: new Date('2024-11-13'),
    scheduledAt: new Date('2024-12-01'),
    createdBy: 'Pierre Dubois',
    tags: ['sms', 'soldes'],
  },
  {
    id: '5',
    name: 'Test A/B Subject Lines',
    status: 'draft',
    type: 'email',
    audience: 500,
    createdAt: new Date('2024-11-14'),
    updatedAt: new Date('2024-11-14'),
    createdBy: 'Marie Dupont',
    tags: ['test', 'ab-testing'],
  },
];

const getStatusBadge = (status: Campaign['status']) => {
  const variants = {
    active: {
      className: 'bg-green-100 text-green-800 border-green-200',
      label: 'Active',
    },
    completed: {
      className: 'bg-blue-100 text-blue-800 border-blue-200',
      label: 'Terminée',
    },
    draft: {
      className: 'bg-gray-100 text-gray-800 border-gray-200',
      label: 'Brouillon',
    },
    scheduled: {
      className: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      label: 'Planifiée',
    },
    paused: {
      className: 'bg-orange-100 text-orange-800 border-orange-200',
      label: 'En pause',
    },
  };

  const variant = variants[status];
  return <Badge className={variant.className}>{variant.label}</Badge>;
};

const getTypeBadge = (type: Campaign['type']) => {
  const variants = {
    email: {
      className: 'bg-blue-50 text-blue-700 border-blue-200',
      label: 'Email',
    },
    sms: {
      className: 'bg-green-50 text-green-700 border-green-200',
      label: 'SMS',
    },
    push: {
      className: 'bg-purple-50 text-purple-700 border-purple-200',
      label: 'Push',
    },
    social: {
      className: 'bg-pink-50 text-pink-700 border-pink-200',
      label: 'Social',
    },
  };

  const variant = variants[type];
  return (
    <Badge variant='outline' className={variant.className}>
      {variant.label}
    </Badge>
  );
};

export default function CampaignsPage() {
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{
    column: string;
    direction: 'asc' | 'desc';
  }>({
    column: 'updatedAt',
    direction: 'desc',
  });

  const filterCounts = {
    all: mockCampaigns.length,
    active: mockCampaigns.filter((c) => c.status === 'active').length,
    scheduled: mockCampaigns.filter((c) => c.status === 'scheduled').length,
    completed: mockCampaigns.filter((c) => c.status === 'completed').length,
    draft: mockCampaigns.filter((c) => c.status === 'draft').length,
  };

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    if (activeFilter === 'all') return true;
    return campaign.status === activeFilter;
  });

  const columns: TableColumn<Campaign>[] = [
    {
      key: 'name',
      label: 'Campagne',
      sortable: true,
      render: (value, row) => (
        <div className='space-y-1'>
          <div className='font-medium'>{value}</div>
          <div className='flex items-center space-x-2'>
            {getTypeBadge(row.type)}
            <span className='text-xs text-muted-foreground'>
              par {row.createdBy}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Statut',
      sortable: true,
      render: (value) => getStatusBadge(value),
    },
    {
      key: 'audience',
      label: 'Audience',
      sortable: true,
      render: (value) => (
        <span className='font-medium'>{value?.toLocaleString()}</span>
      ),
    },
    {
      key: 'openRate',
      label: "Taux d'ouverture",
      sortable: true,
      render: (value) =>
        value !== undefined ? (
          <span className='font-medium'>{value}%</span>
        ) : (
          <span className='text-muted-foreground'>-</span>
        ),
    },
    {
      key: 'clickRate',
      label: 'Taux de clic',
      sortable: true,
      render: (value) =>
        value !== undefined ? (
          <span className='font-medium'>{value}%</span>
        ) : (
          <span className='text-muted-foreground'>-</span>
        ),
    },
    {
      key: 'updatedAt',
      label: 'Dernière modification',
      sortable: true,
      render: (value) => (
        <span className='text-sm text-muted-foreground'>
          {new Date(value).toLocaleDateString('fr-FR')}
        </span>
      ),
    },
  ];

  const actions: TableAction<Campaign>[] = [
    {
      label: 'Modifier',
      icon: 'Edit',
      onClick: (campaign) => console.log('Edit', campaign),
      hidden: (campaign) => campaign.status === 'completed',
    },
    {
      label: 'Dupliquer',
      icon: 'Copy',
      onClick: (campaign) => console.log('Duplicate', campaign),
    },
    {
      label: (campaign) =>
        campaign.status === 'active' ? 'Mettre en pause' : 'Activer',
      icon: (campaign) => (campaign.status === 'active' ? 'Pause' : 'Play'),
      onClick: (campaign) => console.log('Toggle', campaign),
      hidden: (campaign) =>
        campaign.status === 'completed' || campaign.status === 'draft',
    },
    {
      label: 'Supprimer',
      icon: 'Trash2',
      onClick: (campaign) => console.log('Delete', campaign),
      variant: 'destructive',
    },
  ];

  const bulkActions: BulkAction<Campaign>[] = [
    {
      label: 'Activer',
      icon: 'Play',
      onClick: (campaigns) => console.log('Bulk activate', campaigns),
      disabled: (campaigns) => campaigns.some((c) => c.status === 'completed'),
    },
    {
      label: 'Mettre en pause',
      icon: 'Pause',
      onClick: (campaigns) => console.log('Bulk pause', campaigns),
      disabled: (campaigns) => campaigns.every((c) => c.status !== 'active'),
    },
    {
      label: 'Exporter',
      icon: 'Download',
      onClick: (campaigns) => console.log('Export', campaigns),
    },
    {
      label: 'Supprimer',
      icon: 'Trash2',
      onClick: (campaigns) => console.log('Bulk delete', campaigns),
      variant: 'destructive',
    },
  ];

  const quickFilters = [
    { id: 'all', label: 'Toutes', count: filterCounts.all },
    {
      id: 'active',
      label: 'Actives',
      count: filterCounts.active,
      color: 'success' as const,
    },
    {
      id: 'scheduled',
      label: 'Planifiées',
      count: filterCounts.scheduled,
      color: 'warning' as const,
    },
    {
      id: 'completed',
      label: 'Terminées',
      count: filterCounts.completed,
      color: 'default' as const,
    },
    {
      id: 'draft',
      label: 'Brouillons',
      count: filterCounts.draft,
      color: 'default' as const,
    },
  ];

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Campagnes' }]} />

        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Campagnes</h1>
            <p className='text-muted-foreground'>
              Gérez toutes vos campagnes marketing
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <Filter className='w-4 h-4 mr-2' />
              Filtres avancés
            </Button>
            <Button variant='outline'>
              <Download className='w-4 h-4 mr-2' />
              Exporter
            </Button>
            <Button>
              <Plus className='w-4 h-4 mr-2' />
              Nouvelle campagne
            </Button>
          </div>
        </div>

        {/* Quick filters */}
        <QuickFilterTabs
          filters={quickFilters}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {/* Data table */}
        <DataTable
          data={filteredCampaigns}
          columns={columns}
          actions={actions}
          bulkActions={bulkActions}
          selection={{
            selected: selectedCampaigns,
            onSelect: setSelectedCampaigns,
            getRowId: (campaign) => campaign.id,
          }}
          sorting={{
            column: sortConfig.column,
            direction: sortConfig.direction,
            onSort: (column, direction) => setSortConfig({ column, direction }),
          }}
          pagination={{
            page: 1,
            pageSize: 10,
            total: filteredCampaigns.length,
            onPageChange: (page) => console.log('Page change', page),
            onPageSizeChange: (pageSize) =>
              console.log('Page size change', pageSize),
          }}
          emptyMessage='Aucune campagne trouvée pour ce filtre'
        />
      </div>
    </DashboardLayout>
  );
}
