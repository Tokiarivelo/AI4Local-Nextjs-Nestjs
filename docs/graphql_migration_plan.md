# Plan de Migration GraphQL pour AI4Local

## 1. Introduction

Ce document détaille le plan de migration de l'API REST existante d'AI4Local vers une API GraphQL, ainsi que l'intégration du modèle Gemini pour les fonctionnalités d'IA. L'objectif est d'améliorer la flexibilité des requêtes côté client, de réduire le sur-fetch et le sous-fetch de données, et de moderniser l'architecture d'IA.

## 2. Choix de la Bibliothèque GraphQL pour Flask

Après analyse des options disponibles pour implémenter GraphQL avec Flask, les bibliothèques `Graphene-Python` et `Ariadne` ont été considérées.

### 2.1. Graphene-Python

**Avantages :**
- Intégration native avec SQLAlchemy, ce qui est un avantage majeur étant donné que notre backend Flask utilise déjà SQLAlchemy pour la gestion de la base de données.
- Approche code-first, permettant de définir le schéma GraphQL directement à partir des modèles Python existants.
- Large communauté et documentation bien établie.

**Inconvénients :**
- Peut devenir verbeux pour des schémas très complexes.

### 2.2. Ariadne

**Avantages :**
- Approche schema-first, favorisant une collaboration claire entre le frontend et le backend en définissant le schéma en premier.
- Moins de dépendances et plus léger que Graphene.

**Inconvénients :**
- Moins d'intégration directe avec SQLAlchemy, nécessitant plus de code manuel pour mapper les modèles de base de données aux types GraphQL.

### 2.3. Décision

Compte tenu de l'utilisation existante de SQLAlchemy dans le backend Flask et de la volonté de minimiser la refactorisation des modèles de données, **Graphene-Python** est le choix privilégié pour l'implémentation de GraphQL. Son intégration avec SQLAlchemy simplifiera grandement la création du schéma et la résolution des requêtes.

## 3. Plan d'Intégration de Gemini pour le Service AI

Actuellement, le service AI utilise une approche générique qui peut être adaptée pour Gemini. L'intégration se fera en mettant à jour le service FastAPI pour appeler l'API de Gemini au lieu d'OpenAI.

### 3.1. Étapes d'intégration

1.  **Installation des SDK/Bibliothèques Gemini** : Installer la bibliothèque Python officielle de Google pour Gemini (ex: `google-generativeai`).
2.  **Mise à jour des appels API** : Modifier les fonctions de génération de texte, d'embeddings et de recherche sémantique dans le service FastAPI pour utiliser les méthodes correspondantes de l'API Gemini.
3.  **Gestion des clés API** : S'assurer que la clé API de Gemini est correctement configurée et sécurisée via les variables d'environnement.
4.  **Tests** : Tester les endpoints du service AI pour valider l'intégration de Gemini.

## 4. Étapes de Migration Détaillées

### Phase 1: Analyse et Planification (Actuelle)
- [x] Recherche sur les options GraphQL pour Flask.
- [x] Décision sur la bibliothèque GraphQL (Graphene-Python).
- [x] Planification de l'intégration de Gemini.
- [ ] Mise à jour du fichier `todo.md` avec les nouvelles tâches.

### Phase 2: Mise à jour du Service AI pour Gemini
- [ ] Installer le SDK Gemini dans le service AI.
- [ ] Modifier `services/ai/main.py` pour utiliser l'API Gemini pour la génération de texte, les embeddings et la recherche sémantique.
- [ ] Mettre à jour `requirements.txt` du service AI.
- [ ] Tester le service AI indépendamment.

### Phase 3: Implémentation de l'API GraphQL dans le Backend Flask
- [ ] Installer `Graphene-SQLAlchemy` et `Flask-GraphQL`.
- [ ] Définir les types GraphQL pour les modèles SQLAlchemy existants (User, Organization, Customer, Campaign, Product, Course, Payment).
- [ ] Créer le schéma GraphQL principal (Query, Mutation).
- [ ] Implémenter les résolveurs pour les requêtes et mutations.
- [ ] Intégrer l'endpoint GraphQL dans `apps/api/src/main.py`.
- [ ] Migrer les endpoints REST existants vers GraphQL progressivement.

### Phase 4: Adaptation du Frontend React pour GraphQL
- [ ] Installer un client GraphQL (ex: Apollo Client ou Relay) dans le frontend React.
- [ ] Mettre à jour les requêtes API existantes pour utiliser GraphQL.
- [ ] Adapter les composants React pour consommer les données GraphQL.
- [ ] Gérer les mutations GraphQL pour les opérations de création/mise à jour/suppression.

### Phase 5: Tests d'Intégration et Validation
- [ ] Mettre à jour le script `test_api.py` pour tester les endpoints GraphQL.
- [ ] Effectuer des tests de bout en bout pour valider le flux complet.
- [ ] Vérifier la performance et la sécurité de la nouvelle API.

### Phase 6: Mise à jour de la Documentation
- [ ] Mettre à jour `README.md` avec les nouvelles instructions de démarrage.
- [ ] Mettre à jour `DEPLOYMENT.md` pour refléter les changements d'architecture.
- [ ] Créer une documentation spécifique GraphQL (schéma, exemples de requêtes).
- [ ] Mettre à jour `USER_GUIDE.md` si des changements affectent l'expérience utilisateur.

### Phase 7: Livraison du Projet Mis à Jour
- [ ] Préparer une nouvelle archive du projet.
- [ ] Fournir un résumé des changements et des améliorations.

Ce plan servira de feuille de route pour la migration. Chaque phase sera exécutée séquentiellement, avec des tests et des validations à chaque étape pour assurer la stabilité du système.

