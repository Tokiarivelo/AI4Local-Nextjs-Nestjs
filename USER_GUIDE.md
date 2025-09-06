# Guide Utilisateur AI4Local

## 🎯 Bienvenue sur AI4Local

AI4Local est une plateforme marketing complète conçue spécialement pour les PME malgaches. Elle combine intelligence artificielle, gestion client, et paiements mobiles pour digitaliser votre business.

## 🚀 Démarrage Rapide

### 1. Inscription et Configuration

1. **Créer votre compte**
   - Rendez-vous sur https://ai4local.mg
   - Cliquez sur "Créer mon compte"
   - Remplissez vos informations et le nom de votre entreprise
   - Confirmez votre email

2. **Configuration initiale**
   - Complétez votre profil entreprise
   - Ajoutez votre logo et informations de contact
   - Configurez vos préférences de notification

### 2. Première Connexion

Après inscription, vous accédez au **Tableau de Bord** qui affiche :
- Résumé de vos clients
- Campagnes récentes
- Statistiques de performance
- Notifications importantes

## 👥 Gestion des Clients (CRM)

### Ajouter un Client

1. Allez dans **Clients** > **Nouveau Client**
2. Remplissez les informations :
   - Nom complet
   - Téléphone (format malgache : 034 XX XXX XX)
   - Email (optionnel)
   - Tags (ex: "VIP", "Restaurant", "Fidèle")

### Importer des Clients en Masse

1. Préparez un fichier CSV avec les colonnes :
   ```
   name,email,phone,tags
   "Jean Rakoto","jean@email.mg","034 12 345 67","vip,restaurant"
   ```
2. Allez dans **Clients** > **Importer**
3. Sélectionnez votre fichier CSV
4. Vérifiez l'aperçu et confirmez l'import

### Organiser vos Clients

- **Tags** : Utilisez des étiquettes pour segmenter (ex: "VIP", "Nouveau", "Inactif")
- **Recherche** : Trouvez rapidement un client par nom, email ou téléphone
- **Filtres** : Filtrez par tags pour cibler vos campagnes

## 📢 Campagnes Marketing avec IA

### Créer une Campagne

1. **Nouvelle Campagne**
   - Allez dans **Campagnes** > **Nouvelle Campagne**
   - Choisissez le type : Facebook, SMS, Email, WhatsApp
   - Donnez un titre descriptif

2. **Ciblage de l'Audience**
   - Sélectionnez les tags de clients à cibler
   - Prévisualisez le nombre de clients concernés

3. **Génération de Contenu IA**
   - Décrivez votre produit/service dans le prompt
   - Cliquez sur **"Générer avec l'IA"**
   - L'IA crée automatiquement un contenu adapté au type de campagne

### Types de Campagnes

#### 📱 **SMS Marketing**
- Messages courts (160 caractères max)
- Idéal pour : promotions flash, rappels RDV
- Exemple généré : *"PROMO: Restaurant Chez Mama - Plats traditionnels -20% jusqu'au 31/12. Info: 034 XX XXX XX"*

#### 📘 **Facebook Posts**
- Publications engageantes avec emojis
- Idéal pour : nouveautés, événements
- Exemple généré : *"🌟 Découvrez notre restaurant traditionnel malgache ! Saveurs authentiques vous attendent. Visitez-nous ! #LocalBusiness #Madagascar"*

#### 📧 **Email Marketing**
- Messages plus longs et détaillés
- Idéal pour : newsletters, offres spéciales
- Inclut objet et contenu du message

#### 💬 **WhatsApp Business**
- Messages personnalisés et directs
- Idéal pour : relation client, support

### Optimiser vos Campagnes

1. **Tester différents prompts** : Essayez plusieurs descriptions pour obtenir des variations
2. **Personnaliser le contenu** : Modifiez le texte généré selon vos besoins
3. **Programmer l'envoi** : Planifiez vos campagnes aux meilleurs moments
4. **Analyser les résultats** : Suivez les performances dans les analytics

## 🛍️ Catalogue Produits

### Ajouter un Produit

1. **Nouveau Produit**
   - Allez dans **Catalogue** > **Nouveau Produit**
   - Ajoutez titre, description, prix
   - Téléchargez une photo
   - Définissez la catégorie

2. **Informations Importantes**
   - Prix en Ariary (MGA)
   - Description détaillée pour l'IA
   - Photos de qualité pour les réseaux sociaux

### Utiliser le Catalogue dans les Campagnes

- L'IA utilise les informations produits pour créer du contenu pertinent
- Mentionnez le nom du produit dans vos prompts de campagne
- Les photos peuvent être utilisées pour les publications visuelles

## 💰 Paiements Mobiles

### Configuration des Paiements

1. **Mvola (Telma)**
   - Contactez Telma pour obtenir vos clés API
   - Configurez dans **Paramètres** > **Paiements**

2. **Airtel Money**
   - Inscription marchant Airtel Money
   - Configuration des webhooks

3. **Orange Money**
   - Partenariat Orange Money Business
   - Intégration API

### Accepter un Paiement

1. **Créer une Demande de Paiement**
   - Montant en Ariary
   - Numéro du client
   - Description de la transaction

2. **Envoi au Client**
   - Le client reçoit une notification sur son téléphone
   - Il confirme le paiement via son app mobile money
   - Vous recevez une confirmation automatique

### Suivi des Transactions

- **Historique** : Toutes vos transactions dans **Paiements**
- **Statuts** : En attente, Confirmé, Échoué, Annulé
- **Rapports** : Export CSV pour votre comptabilité

## 🎓 Formation Équipe (LMS)

### Créer un Cours

1. **Nouveau Cours**
   - Titre et description
   - Niveau de difficulté
   - Durée estimée

2. **Ajouter des Leçons**
   - Vidéos de formation
   - Documents PDF
   - Quiz d'évaluation

### Assigner des Cours

- Sélectionnez les employés concernés
- Définissez une date limite
- Suivez la progression en temps réel

### Suivi de Progression

- **Tableau de bord formation** : Vue d'ensemble des progrès
- **Certificats** : Génération automatique à la fin
- **Rapports** : Statistiques de formation par employé

## 📊 Analytics et Rapports

### Métriques Disponibles

1. **Clients**
   - Nombre total de clients
   - Nouveaux clients par mois
   - Segmentation par tags

2. **Campagnes**
   - Taux d'ouverture (emails)
   - Taux de clic
   - Conversions

3. **Ventes**
   - Chiffre d'affaires par période
   - Transactions par canal de paiement
   - Produits les plus vendus

### Export des Données

- **Format CSV** : Compatible Excel
- **Filtres par date** : Périodes personnalisées
- **Données clients** : Export pour marketing externe

## ⚙️ Paramètres et Configuration

### Profil Entreprise

- **Informations générales** : Nom, adresse, téléphone
- **Logo et branding** : Upload de votre logo
- **Signature email** : Personnalisation des emails automatiques

### Utilisateurs et Permissions

- **Ajouter des employés** : Invitation par email
- **Rôles** : Propriétaire, Admin, Employé
- **Permissions** : Contrôle d'accès par fonctionnalité

### Notifications

- **Email** : Alertes importantes
- **SMS** : Notifications urgentes
- **In-app** : Messages dans l'interface

## 🆘 Support et Aide

### Ressources Disponibles

1. **Centre d'Aide** : Articles et tutoriels
2. **Vidéos de Formation** : Guides visuels
3. **FAQ** : Questions fréquentes
4. **Chat Support** : Assistance en direct

### Contacter le Support

- **Email** : support@ai4local.mg
- **Téléphone** : +261 34 XX XXX XX
- **Heures** : Lundi-Vendredi 8h-17h (GMT+3)

### Communauté

- **Forum Utilisateurs** : Échanges entre entrepreneurs
- **Groupe Facebook** : Conseils et astuces
- **Newsletter** : Nouveautés et bonnes pratiques

## 💡 Conseils et Bonnes Pratiques

### Marketing Efficace

1. **Segmentez vos clients** : Utilisez les tags pour cibler précisément
2. **Testez vos messages** : Essayez différents styles avec l'IA
3. **Timing optimal** : Envoyez aux bonnes heures (9h-11h, 14h-16h)
4. **Personnalisez** : Adaptez le contenu à votre audience locale

### Gestion Client

1. **Mise à jour régulière** : Gardez les informations clients à jour
2. **Historique des interactions** : Notez les échanges importants
3. **Suivi post-vente** : Campagnes de fidélisation
4. **Feedback client** : Collectez les avis pour améliorer

### Optimisation IA

1. **Prompts détaillés** : Plus vous donnez d'informations, meilleur est le résultat
2. **Contexte local** : Mentionnez "Madagascar", "malgache" pour du contenu adapté
3. **Ton approprié** : Spécifiez le style souhaité (professionnel, amical, etc.)
4. **Itération** : Générez plusieurs versions et choisissez la meilleure

## 🔐 Sécurité et Confidentialité

### Protection des Données

- **Chiffrement** : Toutes les données sont chiffrées
- **Sauvegarde** : Backup automatique quotidien
- **Accès sécurisé** : Authentification à deux facteurs disponible

### Conformité

- **RGPD** : Respect des règles de protection des données
- **Données locales** : Serveurs basés à Madagascar
- **Audit** : Logs de toutes les actions importantes

## 📱 Application Mobile (Bientôt)

### Fonctionnalités Prévues

- **Gestion clients** : Ajout/modification en déplacement
- **Campagnes rapides** : Création de SMS/posts depuis mobile
- **Notifications push** : Alertes en temps réel
- **Mode hors-ligne** : Synchronisation automatique

---

## 🎉 Félicitations !

Vous êtes maintenant prêt à utiliser AI4Local pour développer votre business. N'hésitez pas à explorer toutes les fonctionnalités et à contacter notre support si vous avez des questions.

**Bonne digitalisation ! 🚀**

