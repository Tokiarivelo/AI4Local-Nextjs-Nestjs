# Dashboard AI4Local - Documentation

## Vue d'ensemble

Le dashboard AI4Local est une interface SaaS B2B moderne, responsive et accessible, conçue pour les PME souhaitant gérer efficacement leurs campagnes marketing, clients et analytics.

## Palette de couleurs

- **Bleu foncé primaire** : `#0A4595` - Navigation principale, CTA primaires
- **Bleu moyen accent** : `#1F6CC5` - Éléments interactifs, liens
- **Bleu clair secondaire** : `#63B3ED` - États actifs, highlights
- **Bleu très clair surlignage** : `#A7D8F9` - Arrière-plans, zones de focus
- **Blanc** : `#FFFFFF` - Texte sur fonds sombres, arrière-plans
- **Sombre** : `#0F172A` - Texte principal, contrastes élevés

## Architecture des composants

### Composants de mise en page

#### Sidebar (`/components/layout/Sidebar.tsx`)

- **Comportement** : Collapsible, responsive (drawer mobile)
- **Fonctionnalités** :
  - Navigation hiérarchique avec sous-menus
  - Tooltips en mode collapsed
  - Gestion des permissions par rôle
  - États actifs visuels
  - Support clavier complet

#### TopNav (`/components/layout/TopNav.tsx`)

- **Fonctionnalités** :
  - Recherche globale avec raccourci Ctrl+K
  - Menu "Nouveau" avec actions rapides
  - Notifications avec badge de compteur
  - Menu utilisateur avec informations de profil

#### Navigation secondaire

- **Breadcrumbs** : Navigation de retour avec icône d'accueil
- **Tabs** : Contextuelle, pills, underline
- **QuickFilterTabs** : Filtres rapides avec compteurs
- **BottomNav** : Navigation mobile avec badges

### Composants de données

#### DataTable (`/components/ui/data-table.tsx`)

- **Fonctionnalités** :
  - Tri multi-colonnes
  - Sélection multiple avec actions bulk
  - Pagination complète
  - Actions par ligne (kebab menu)
  - États de chargement (skeletons)
  - Responsive avec scroll horizontal

### Composants d'interaction

#### Modales et feedback

- **Dialog** : Modales configurables
- **Toast** : Notifications temporaires typées
- **ConfirmationModal** : Confirmation d'actions destructives

#### Actions rapides

- **FloatingActionButton** : Bouton flottant extensible
- **CommandPalette** : Palette de commandes avec recherche

## Gestion des rôles et permissions

### Rôles disponibles

1. **Admin** - Accès complet

   - Toutes les permissions
   - Gestion des utilisateurs et facturation
   - Configuration système

2. **Manager** - Gestion opérationnelle

   - Campagnes : lecture/écriture
   - Clients : lecture/écriture
   - Analytics : lecture/export
   - Équipe : lecture uniquement

3. **Editor** - Création de contenu

   - Campagnes : lecture/écriture
   - Clients : lecture/écriture
   - Contenu : lecture/écriture
   - Analytics : lecture uniquement

4. **Viewer** - Consultation
   - Lecture uniquement sur tous les modules
   - Pas d'actions de modification ou suppression

### Permissions par module

```typescript
// Exemples de permissions
'campaigns.read' | 'campaigns.write' | 'campaigns.delete';
'clients.read' | 'clients.write' | 'clients.delete';
'analytics.read' | 'analytics.export';
'billing.read' | 'billing.write';
'users.read' | 'users.write' | 'users.delete';
('permissions.manage');
('api.manage');
```

### Implémentation du filtrage par rôle

```typescript
// Utilisation dans la navigation
const filteredNavigation = filterNavigationByRole(navigationItems, userRole);

// Vérification de permission
if (hasPermission(userRole, 'campaigns.delete')) {
  // Afficher bouton supprimer
}
```

## Responsive Design

### Breakpoints Tailwind

- **Mobile** : `< 640px`
- **Tablet** : `640px - 1024px`
- **Desktop** : `> 1024px`

### Adaptations par appareil

#### Mobile (< 640px)

- Sidebar → Drawer overlay
- Top nav compact avec logo
- Bottom navigation (4 items principaux)
- Tables avec scroll horizontal
- FAB accessible

#### Tablet (640px - 1024px)

- Sidebar collapsible
- Navigation adaptée au touch
- Grilles responsive (2 colonnes)

#### Desktop (> 1024px)

- Sidebar pleine largeur par défaut
- Hover states complets
- Raccourcis clavier
- Tooltips détaillés

## Accessibilité (WCAG AA)

### Navigation

- **Aria labels** sur tous les éléments interactifs
- **Focus visible** avec ring-2 ring-primary
- **Navigation clavier** Tab/Shift+Tab/Enter/Space
- **Landmarks** nav, main, complementary

### Contrastes

- Texte sur fond : ratio 4.5:1 minimum
- Icônes importantes : ratio 3:1 minimum
- États hover/focus : contraste renforcé

### Screen readers

- **aria-current="page"** pour les liens actifs
- **aria-expanded** pour les menus déroulants
- **aria-label** pour les boutons d'icônes
- **role="tablist"** pour les groupes de tabs

## Usage et exemples

### Exemple d'utilisation basique

```tsx
import { DashboardLayout } from '@/components/layout/DashboardLayout';

export default function MyPage() {
  const user = {
    id: '1',
    name: 'Marie Dupont',
    role: 'Admin' as const,
    // ...
  };

  return (
    <DashboardLayout user={user}>
      <div className='space-y-6'>{/* Contenu de la page */}</div>
    </DashboardLayout>
  );
}
```

### Table avec actions et tri

```tsx
<DataTable
  data={campaigns}
  columns={columns}
  actions={actions}
  bulkActions={bulkActions}
  selection={{
    selected: selectedIds,
    onSelect: setSelectedIds,
    getRowId: (item) => item.id,
  }}
  sorting={{
    column: 'updatedAt',
    direction: 'desc',
    onSort: handleSort,
  }}
  pagination={{
    page: 1,
    pageSize: 25,
    total: totalItems,
    onPageChange: setPage,
    onPageSizeChange: setPageSize,
  }}
/>
```

### Navigation avec breadcrumbs

```tsx
<Breadcrumbs
  items={[
    { label: 'Campagnes', href: '/campaigns' },
    { label: 'Black Friday', href: '/campaigns/bf-2024' },
    { label: 'Modifier' },
  ]}
/>
```

## Structure des fichiers

```
src/
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── TopNav.tsx
│   │   ├── Breadcrumbs.tsx
│   │   ├── Tabs.tsx
│   │   ├── BottomNav.tsx
│   │   └── DashboardLayout.tsx
│   └── ui/
│       ├── data-table.tsx
│       ├── interactions.tsx
│       ├── dialog.tsx
│       ├── tooltip.tsx
│       └── ...
├── types/
│   └── dashboard.ts
├── config/
│   └── navigation.ts
└── app/
    ├── dashboard/
    └── campaigns/
```

## Performance

- **Code splitting** par route automatique (Next.js)
- **Lazy loading** des composants lourds
- **Memoization** des calculs coûteux
- **Skeletons** pendant les chargements
- **Images optimisées** (Next.js Image)

## Tests recommandés

1. **Tests unitaires** des utilitaires (permissions, filtres)
2. **Tests d'intégration** des composants complexes (DataTable)
3. **Tests d'accessibilité** avec jest-axe
4. **Tests visuels** avec Chromatic/Percy
5. **Tests E2E** des parcours critiques

## Déploiement

Le projet est configuré pour Next.js 15 avec :

- **Static generation** quand possible
- **SSR** pour les pages dynamiques
- **API routes** pour les endpoints
- **Middleware** pour l'authentification
- **Variables d'environnement** pour la configuration
