'use client';

import React from 'react';
import {
  TrendingUp,
  Users,
  Mail,
  MousePointer,
  DollarSign,
  Activity,
  Target,
  Calendar,
  BarChart3,
  ArrowUpIcon,
  ArrowDownIcon,
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Données exemple pour la démo
const stats = [
  {
    title: 'Campagnes actives',
    value: '12',
    change: '+20%',
    changeType: 'increase' as const,
    icon: Mail,
    description: 'vs mois dernier',
  },
  {
    title: 'Clients actifs',
    value: '2,847',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Users,
    description: 'vs mois dernier',
  },
  {
    title: "Taux d'ouverture",
    value: '24.5%',
    change: '-2%',
    changeType: 'decrease' as const,
    icon: MousePointer,
    description: 'vs mois dernier',
  },
  {
    title: 'Revenus générés',
    value: '€45,231',
    change: '+18%',
    changeType: 'increase' as const,
    icon: DollarSign,
    description: 'vs mois dernier',
  },
];

const recentCampaigns = [
  {
    name: 'Promo Black Friday',
    status: 'active',
    audience: 1250,
    openRate: 28.4,
    clickRate: 4.2,
    sentAt: '2024-11-15',
  },
  {
    name: 'Newsletter Hebdo #47',
    status: 'completed',
    audience: 2847,
    openRate: 22.1,
    clickRate: 3.8,
    sentAt: '2024-11-12',
  },
  {
    name: 'Relance Panier Abandonné',
    status: 'active',
    audience: 156,
    openRate: 35.2,
    clickRate: 8.9,
    sentAt: '2024-11-14',
  },
  {
    name: 'Enquête Satisfaction',
    status: 'draft',
    audience: 2847,
    openRate: 0,
    clickRate: 0,
    sentAt: null,
  },
];

const recentActivities = [
  {
    action: 'Campagne créée',
    details: 'Promo Black Friday',
    time: 'Il y a 2 heures',
    type: 'campaign',
  },
  {
    action: 'Nouveau segment',
    details: 'Clients VIP Q4',
    time: 'Il y a 4 heures',
    type: 'segment',
  },
  {
    action: 'Import contacts',
    details: '245 nouveaux contacts',
    time: 'Il y a 1 jour',
    type: 'import',
  },
  {
    action: 'Rapport généré',
    details: 'Analytics Octobre',
    time: 'Il y a 2 jours',
    type: 'report',
  },
];

const getStatusBadge = (status: string) => {
  const variants = {
    active: 'bg-green-100 text-green-800 border-green-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200',
    draft: 'bg-gray-100 text-gray-800 border-gray-200',
    scheduled: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  };

  const labels = {
    active: 'Active',
    completed: 'Terminée',
    draft: 'Brouillon',
    scheduled: 'Planifiée',
  };

  return (
    <Badge
      className={variants[status as keyof typeof variants] || variants.draft}
    >
      {labels[status as keyof typeof labels] || status}
    </Badge>
  );
};

const mockUser = {
  id: '1',
  name: 'Marie Dupont',
  email: 'marie.dupont@ai4local.com',
  role: 'Admin' as const,
  permissions: [],
};

export default function DashboardPage() {
  return (
    <DashboardLayout user={mockUser}>
      <div className='space-y-6'>
        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>
              Tableau de bord
            </h1>
            <p className='text-muted-foreground'>
              Vue d'ensemble de vos campagnes et performances
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <Calendar className='w-4 h-4 mr-2' />
              Aujourd'hui
            </Button>
            <Button>
              <BarChart3 className='w-4 h-4 mr-2' />
              Voir les analytics
            </Button>
          </div>
        </div>

        {/* Stats cards */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index}>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>
                    {stat.title}
                  </CardTitle>
                  <Icon className='h-4 w-4 text-muted-foreground' />
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>{stat.value}</div>
                  <p className='text-xs text-muted-foreground flex items-center mt-1'>
                    {stat.changeType === 'increase' ? (
                      <ArrowUpIcon className='w-3 h-3 text-green-500 mr-1' />
                    ) : (
                      <ArrowDownIcon className='w-3 h-3 text-red-500 mr-1' />
                    )}
                    <span
                      className={
                        stat.changeType === 'increase'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }
                    >
                      {stat.change}
                    </span>
                    <span className='ml-1'>{stat.description}</span>
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Main content grid */}
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Recent campaigns */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle>Campagnes récentes</CardTitle>
                <Button variant='ghost' size='sm'>
                  Voir tout
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recentCampaigns.map((campaign, index) => (
                  <div
                    key={index}
                    className='flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                  >
                    <div className='space-y-1'>
                      <div className='flex items-center space-x-2'>
                        <p className='font-medium text-sm'>{campaign.name}</p>
                        {getStatusBadge(campaign.status)}
                      </div>
                      <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
                        <span>{campaign.audience} destinataires</span>
                        {campaign.openRate > 0 && (
                          <>
                            <span>• {campaign.openRate}% ouvert</span>
                            <span>• {campaign.clickRate}% cliqué</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs text-muted-foreground'>
                        {campaign.sentAt
                          ? new Date(campaign.sentAt).toLocaleDateString(
                              'fr-FR'
                            )
                          : 'Non envoyée'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent activity */}
          <Card>
            <CardHeader>
              <CardTitle>Activité récente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-3'>
                {recentActivities.map((activity, index) => (
                  <div key={index} className='flex items-start space-x-3'>
                    <div className='w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0' />
                    <div className='space-y-1 min-w-0 flex-1'>
                      <p className='text-sm font-medium leading-none'>
                        {activity.action}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {activity.details}
                      </p>
                      <p className='text-xs text-muted-foreground'>
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick actions */}
        <Card>
          <CardHeader>
            <CardTitle>Actions rapides</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
              <Button className='h-20 flex-col space-y-2'>
                <Mail className='w-6 h-6' />
                <span>Nouvelle campagne</span>
              </Button>
              <Button variant='outline' className='h-20 flex-col space-y-2'>
                <Users className='w-6 h-6' />
                <span>Créer un segment</span>
              </Button>
              <Button variant='outline' className='h-20 flex-col space-y-2'>
                <Target className='w-6 h-6' />
                <span>Importer contacts</span>
              </Button>
              <Button variant='outline' className='h-20 flex-col space-y-2'>
                <Activity className='w-6 h-6' />
                <span>Voir analytics</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
