'use client';

import React, { useState } from 'react';
import {
  Calendar,
  Download,
  MousePointer,
  DollarSign,
  Eye,
  Target,
  ArrowUpIcon,
  ArrowDownIcon,
  Filter,
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Breadcrumbs } from '@/components/layout/Breadcrumbs';
import { QuickFilterTabs } from '@/components/layout/Tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

// Données exemple pour les graphiques
const performanceData = [
  {
    month: 'Jan',
    campaigns: 15,
    openRate: 22.5,
    clickRate: 3.2,
    revenue: 12500,
  },
  {
    month: 'Fev',
    campaigns: 18,
    openRate: 24.1,
    clickRate: 3.8,
    revenue: 15200,
  },
  {
    month: 'Mar',
    campaigns: 22,
    openRate: 26.3,
    clickRate: 4.1,
    revenue: 18900,
  },
  {
    month: 'Avr',
    campaigns: 19,
    openRate: 23.7,
    clickRate: 3.5,
    revenue: 16800,
  },
  {
    month: 'Mai',
    campaigns: 25,
    openRate: 28.2,
    clickRate: 4.6,
    revenue: 22100,
  },
  {
    month: 'Jun',
    campaigns: 23,
    openRate: 25.8,
    clickRate: 4.2,
    revenue: 20300,
  },
  {
    month: 'Jul',
    campaigns: 27,
    openRate: 30.1,
    clickRate: 5.1,
    revenue: 26500,
  },
  {
    month: 'Aoû',
    campaigns: 24,
    openRate: 27.9,
    clickRate: 4.8,
    revenue: 24200,
  },
  {
    month: 'Sep',
    campaigns: 26,
    openRate: 29.5,
    clickRate: 5.3,
    revenue: 28800,
  },
  {
    month: 'Oct',
    campaigns: 21,
    openRate: 26.7,
    clickRate: 4.4,
    revenue: 23600,
  },
  {
    month: 'Nov',
    campaigns: 29,
    openRate: 32.1,
    clickRate: 5.7,
    revenue: 31200,
  },
  {
    month: 'Dec',
    campaigns: 31,
    openRate: 34.2,
    clickRate: 6.1,
    revenue: 35400,
  },
];

const channelData = [
  { name: 'Email', value: 65, color: '#1F6CC5' },
  { name: 'SMS', value: 20, color: '#63B3ED' },
  { name: 'Push', value: 10, color: '#A7D8F9' },
  { name: 'Social', value: 5, color: '#0A4595' },
];

const funnelData = [
  { stage: 'Envoyés', value: 100000, percentage: 100 },
  { stage: 'Ouverts', value: 28500, percentage: 28.5 },
  { stage: 'Cliqués', value: 4750, percentage: 4.75 },
  { stage: 'Convertis', value: 950, percentage: 0.95 },
];

const cohortData = [
  {
    cohort: 'Jan 2024',
    month1: 100,
    month2: 85,
    month3: 72,
    month4: 68,
    month5: 65,
    month6: 62,
  },
  {
    cohort: 'Fev 2024',
    month1: 100,
    month2: 88,
    month3: 75,
    month4: 70,
    month5: 67,
    month6: 0,
  },
  {
    cohort: 'Mar 2024',
    month1: 100,
    month2: 82,
    month3: 78,
    month4: 74,
    month5: 0,
    month6: 0,
  },
  {
    cohort: 'Avr 2024',
    month1: 100,
    month2: 90,
    month3: 81,
    month4: 0,
    month5: 0,
    month6: 0,
  },
  {
    cohort: 'Mai 2024',
    month1: 100,
    month2: 87,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
  },
  {
    cohort: 'Jun 2024',
    month1: 100,
    month2: 0,
    month3: 0,
    month4: 0,
    month5: 0,
    month6: 0,
  },
];

const topCampaigns = [
  {
    name: 'Black Friday 2024',
    opens: 15420,
    clicks: 2180,
    conversions: 387,
    revenue: 18500,
  },
  {
    name: 'Newsletter Hebdo',
    opens: 8950,
    clicks: 1120,
    conversions: 98,
    revenue: 4200,
  },
  {
    name: 'Relance Panier',
    opens: 3200,
    clicks: 890,
    conversions: 245,
    revenue: 12800,
  },
  {
    name: 'Soldes Été',
    opens: 12100,
    clicks: 1850,
    conversions: 298,
    revenue: 15200,
  },
  {
    name: 'Enquête Client',
    opens: 5600,
    clicks: 420,
    conversions: 0,
    revenue: 0,
  },
];

const stats = [
  {
    title: 'Revenus totaux',
    value: '€287,430',
    change: '+18.2%',
    changeType: 'increase' as const,
    icon: DollarSign,
    description: 'vs période précédente',
  },
  {
    title: "Taux d'ouverture moyen",
    value: '28.4%',
    change: '+2.1%',
    changeType: 'increase' as const,
    icon: Eye,
    description: 'vs période précédente',
  },
  {
    title: 'Taux de clic moyen',
    value: '4.7%',
    change: '+0.8%',
    changeType: 'increase' as const,
    icon: MousePointer,
    description: 'vs période précédente',
  },
  {
    title: 'ROI moyen',
    value: '3.2x',
    change: '-0.1x',
    changeType: 'decrease' as const,
    icon: Target,
    description: 'vs période précédente',
  },
];

export default function AnalyticsPage() {
  const [activePeriod, setActivePeriod] = useState('year');

  const periodFilters = [
    { id: 'week', label: 'Cette semaine', count: 0 },
    { id: 'month', label: 'Ce mois', count: 0 },
    { id: 'quarter', label: 'Ce trimestre', count: 0 },
    { id: 'year', label: 'Cette année', count: 0 },
  ];

  return (
    <DashboardLayout>
      <div className='space-y-6'>
        {/* Breadcrumbs */}
        <Breadcrumbs items={[{ label: 'Analytics' }]} />

        {/* Header */}
        <div className='flex items-center justify-between'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>Analytics</h1>
            <p className='text-muted-foreground'>
              Analysez les performances de vos campagnes marketing
            </p>
          </div>
          <div className='flex items-center space-x-2'>
            <Button variant='outline'>
              <Calendar className='w-4 h-4 mr-2' />
              Sélectionner une période
            </Button>
            <Button variant='outline'>
              <Filter className='w-4 h-4 mr-2' />
              Filtres avancés
            </Button>
            <Button>
              <Download className='w-4 h-4 mr-2' />
              Exporter
            </Button>
          </div>
        </div>

        {/* Period filters */}
        <QuickFilterTabs
          filters={periodFilters}
          activeFilter={activePeriod}
          onFilterChange={setActivePeriod}
        />

        {/* KPI Cards */}
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

        {/* Performance Overview */}
        <div className='grid gap-6 lg:grid-cols-2'>
          {/* Revenue & Campaigns Chart */}
          <Card className='lg:col-span-2'>
            <CardHeader>
              <CardTitle>Performance sur l&apos;année</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-80'>
                <ResponsiveContainer width='100%' height='100%'>
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis yAxisId='left' />
                    <YAxis yAxisId='right' orientation='right' />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                    />
                    <Legend />
                    <Bar
                      yAxisId='left'
                      dataKey='campaigns'
                      fill='#63B3ED'
                      name='Campagnes'
                    />
                    <Line
                      yAxisId='right'
                      type='monotone'
                      dataKey='openRate'
                      stroke='#1F6CC5'
                      strokeWidth={2}
                      name="Taux d'ouverture %"
                    />
                    <Line
                      yAxisId='right'
                      type='monotone'
                      dataKey='clickRate'
                      stroke='#0A4595'
                      strokeWidth={2}
                      name='Taux de clic %'
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className='grid gap-6 lg:grid-cols-3'>
          {/* Channel Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Répartition par canal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx='50%'
                      cy='50%'
                      outerRadius={80}
                      fill='#8884d8'
                      dataKey='value'
                      label={({ name, value }) => `${name}: ${value}%`}
                    >
                      {channelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Évolution du chiffre d&apos;affaires</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='h-64'>
                <ResponsiveContainer width='100%' height='100%'>
                  <AreaChart data={performanceData}>
                    <CartesianGrid strokeDasharray='3 3' />
                    <XAxis dataKey='month' />
                    <YAxis />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '6px',
                      }}
                      formatter={(value) => [`€${value}`, 'Revenus']}
                    />
                    <Area
                      type='monotone'
                      dataKey='revenue'
                      stroke='#1F6CC5'
                      fill='url(#colorRevenue)'
                    />
                    <defs>
                      <linearGradient
                        id='colorRevenue'
                        x1='0'
                        y1='0'
                        x2='0'
                        y2='1'
                      >
                        <stop
                          offset='5%'
                          stopColor='#1F6CC5'
                          stopOpacity={0.8}
                        />
                        <stop
                          offset='95%'
                          stopColor='#1F6CC5'
                          stopOpacity={0.1}
                        />
                      </linearGradient>
                    </defs>
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Funnel Analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Entonnoir de conversion</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {funnelData.map((stage, index) => (
                  <div key={index} className='space-y-2'>
                    <div className='flex items-center justify-between text-sm'>
                      <span className='font-medium'>{stage.stage}</span>
                      <span className='text-muted-foreground'>
                        {stage.percentage}%
                      </span>
                    </div>
                    <div className='w-full bg-muted rounded-full h-2'>
                      <div
                        className='bg-primary h-2 rounded-full transition-all duration-500'
                        style={{ width: `${stage.percentage}%` }}
                      />
                    </div>
                    <div className='text-xs text-muted-foreground'>
                      {stage.value.toLocaleString()} utilisateurs
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cohort Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Analyse de cohortes - Rétention (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b'>
                    <th className='text-left p-2'>Cohorte</th>
                    <th className='text-center p-2'>M1</th>
                    <th className='text-center p-2'>M2</th>
                    <th className='text-center p-2'>M3</th>
                    <th className='text-center p-2'>M4</th>
                    <th className='text-center p-2'>M5</th>
                    <th className='text-center p-2'>M6</th>
                  </tr>
                </thead>
                <tbody>
                  {cohortData.map((cohort, index) => (
                    <tr key={index} className='border-b'>
                      <td className='p-2 font-medium'>{cohort.cohort}</td>
                      <td className='text-center p-2'>
                        <div className='w-12 h-6 bg-primary rounded mx-auto flex items-center justify-center text-white text-xs'>
                          {cohort.month1}%
                        </div>
                      </td>
                      <td className='text-center p-2'>
                        {cohort.month2 > 0 && (
                          <div
                            className='w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs'
                            style={{
                              backgroundColor: `hsl(var(--ai4local-accent), ${cohort.month2}%)`,
                            }}
                          >
                            {cohort.month2}%
                          </div>
                        )}
                      </td>
                      <td className='text-center p-2'>
                        {cohort.month3 > 0 && (
                          <div
                            className='w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs'
                            style={{
                              backgroundColor: `hsl(var(--ai4local-secondary), ${cohort.month3}%)`,
                            }}
                          >
                            {cohort.month3}%
                          </div>
                        )}
                      </td>
                      <td className='text-center p-2'>
                        {cohort.month4 > 0 && (
                          <div
                            className='w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs'
                            style={{
                              backgroundColor: `hsl(var(--ai4local-highlight), ${cohort.month4}%)`,
                            }}
                          >
                            {cohort.month4}%
                          </div>
                        )}
                      </td>
                      <td className='text-center p-2'>
                        {cohort.month5 > 0 && (
                          <div
                            className='w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs'
                            style={{
                              backgroundColor: `hsl(var(--ai4local-primary), ${cohort.month5}%)`,
                            }}
                          >
                            {cohort.month5}%
                          </div>
                        )}
                      </td>
                      <td className='text-center p-2'>
                        {cohort.month6 > 0 && (
                          <div
                            className='w-12 h-6 rounded mx-auto flex items-center justify-center text-white text-xs'
                            style={{
                              backgroundColor: `hsl(var(--ai4local-accent), ${cohort.month6}%)`,
                            }}
                          >
                            {cohort.month6}%
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Top Campaigns Performance */}
        <Card>
          <CardHeader>
            <div className='flex items-center justify-between'>
              <CardTitle>Top campagnes</CardTitle>
              <Button variant='ghost' size='sm'>
                Voir tout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {topCampaigns.map((campaign, index) => (
                <div
                  key={index}
                  className='flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors'
                >
                  <div className='space-y-1'>
                    <div className='flex items-center space-x-2'>
                      <p className='font-medium text-sm'>{campaign.name}</p>
                      <Badge variant='outline' className='text-xs'>
                        #{index + 1}
                      </Badge>
                    </div>
                    <div className='flex items-center space-x-4 text-xs text-muted-foreground'>
                      <span>{campaign.opens.toLocaleString()} ouvertures</span>
                      <span>• {campaign.clicks.toLocaleString()} clics</span>
                      <span>• {campaign.conversions} conversions</span>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium text-sm'>
                      €{campaign.revenue.toLocaleString()}
                    </p>
                    <p className='text-xs text-muted-foreground'>
                      {campaign.conversions > 0
                        ? `${(
                            (campaign.conversions / campaign.clicks) *
                            100
                          ).toFixed(1)}% conv.`
                        : 'Pas de vente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
