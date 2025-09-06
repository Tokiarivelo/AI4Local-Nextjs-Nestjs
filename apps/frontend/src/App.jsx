import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Users, Package, Megaphone, BookOpen, CreditCard, BarChart3, Sparkles, Menu, X } from 'lucide-react'
import './App.css'

// Composant Header
function Header({ onMenuToggle, isMenuOpen }) {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">AI4Local</span>
            </div>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Tableau de bord</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Clients</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Campagnes</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">Formation</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Button variant="outline" size="sm">Se connecter</Button>
            <Button size="sm">Commencer</Button>
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={onMenuToggle}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <a href="#" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">Tableau de bord</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">Clients</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">Campagnes</a>
            <a href="#" className="text-gray-500 hover:text-gray-900 block px-3 py-2 text-base font-medium">Formation</a>
            <div className="px-3 py-2 space-y-2">
              <Button variant="outline" size="sm" className="w-full">Se connecter</Button>
              <Button size="sm" className="w-full">Commencer</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

// Composant Hero Section
function HeroSection() {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Marketing IA pour les <span className="text-yellow-300">PME Locales</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
            Créez des campagnes marketing, générez du contenu avec l'IA, gérez vos clients et acceptez les paiements mobiles - tout optimisé pour Madagascar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
              Démarrer gratuitement
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Voir la démo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composant Features
function FeaturesSection() {
  const features = [
    {
      icon: <Megaphone className="h-8 w-8" />,
      title: "Campagnes IA",
      description: "Créez des publicités, posts et SMS avec l'intelligence artificielle. Templates optimisés pour le marché malgache.",
      badge: "IA"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Gestion Clients",
      description: "CRM simple pour gérer vos clients, tags, import CSV et segmentation pour vos campagnes.",
      badge: "CRM"
    },
    {
      icon: <Package className="h-8 w-8" />,
      title: "Catalogue Produits",
      description: "Gérez facilement vos produits et services avec photos, prix et descriptions.",
      badge: "Catalogue"
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Paiements Mobiles",
      description: "Intégration Mvola, Airtel Money et Orange Money pour accepter les paiements locaux.",
      badge: "Mobile Money"
    },
    {
      icon: <BookOpen className="h-8 w-8" />,
      title: "Formation Équipe",
      description: "LMS intégré pour former votre personnel avec cours vidéo et suivi de progression.",
      badge: "LMS"
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analytics",
      description: "Tableaux de bord et rapports pour suivre vos performances marketing et ventes.",
      badge: "Analytics"
    }
  ]

  return (
    <div className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Tout ce dont votre PME a besoin
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une plateforme complète pour digitaliser votre business et booster vos ventes avec l'intelligence artificielle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-blue-600">{feature.icon}</div>
                  <Badge variant="secondary">{feature.badge}</Badge>
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

// Composant CTA Section
function CTASection() {
  return (
    <div className="bg-blue-600 text-white py-16">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Prêt à transformer votre business ?
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          Rejoignez les PME malgaches qui utilisent déjà AI4Local pour développer leur activité.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" className="bg-yellow-400 text-blue-900 hover:bg-yellow-300">
            Créer mon compte
          </Button>
          <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
            Contacter l'équipe
          </Button>
        </div>
      </div>
    </div>
  )
}

// Composant Footer
function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-4">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold">AI4Local</span>
            </div>
            <p className="text-gray-400">
              La plateforme marketing IA pour les PME malgaches.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Produit</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Fonctionnalités</a></li>
              <li><a href="#" className="hover:text-white">Tarifs</a></li>
              <li><a href="#" className="hover:text-white">API</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">Documentation</a></li>
              <li><a href="#" className="hover:text-white">Aide</a></li>
              <li><a href="#" className="hover:text-white">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Entreprise</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white">À propos</a></li>
              <li><a href="#" className="hover:text-white">Blog</a></li>
              <li><a href="#" className="hover:text-white">Carrières</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 AI4Local. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}

// Composant principal App
function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <Router>
      <div className="min-h-screen bg-white">
        <Header onMenuToggle={toggleMenu} isMenuOpen={isMenuOpen} />
        
        <Routes>
          <Route path="/" element={
            <main>
              <HeroSection />
              <FeaturesSection />
              <CTASection />
            </main>
          } />
        </Routes>
        
        <Footer />
      </div>
    </Router>
  )
}

export default App

