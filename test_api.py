#!/usr/bin/env python3
"""
Script de test pour l'API AI4Local
Teste les fonctionnalités principales de l'application
"""

import requests
import json
import time
from datetime import datetime

# Configuration
API_BASE = "http://localhost:5000/api"
AI_SERVICE_BASE = "http://localhost:8000"

def test_api_health():
    """Test de santé de l'API"""
    print("🔍 Test de santé de l'API...")
    try:
        response = requests.get(f"{API_BASE}/health")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ API healthy: {data['service']} v{data['version']}")
            return True
        else:
            print(f"❌ API unhealthy: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur API: {e}")
        return False

def test_ai_service():
    """Test du service AI"""
    print("🤖 Test du service AI...")
    try:
        response = requests.get(f"{AI_SERVICE_BASE}/health")
        if response.status_code == 200:
            print("✅ Service AI opérationnel")
            
            # Test de génération de texte
            gen_response = requests.post(f"{AI_SERVICE_BASE}/generate-text", json={
                "prompt": "restaurant malgache",
                "template": "Créez une publication Facebook pour {prompt}",
                "max_tokens": 100,
                "temperature": 0.7
            })
            
            if gen_response.status_code == 200:
                gen_data = gen_response.json()
                print(f"✅ Génération de texte: {gen_data['generated_text'][:50]}...")
                return True
            else:
                print(f"❌ Erreur génération: {gen_response.status_code}")
                return False
        else:
            print(f"❌ Service AI non disponible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur service AI: {e}")
        return False

def test_user_registration():
    """Test d'inscription utilisateur"""
    print("👤 Test d'inscription utilisateur...")
    try:
        user_data = {
            "email": f"test_{int(time.time())}@ai4local.mg",
            "password": "password123",
            "name": "Test User",
            "org_name": "Test Organization"
        }
        
        response = requests.post(f"{API_BASE}/auth/signup", json=user_data)
        
        if response.status_code == 201:
            data = response.json()
            print(f"✅ Utilisateur créé: {data['user']['name']}")
            return data['token'], data['user']['org_id']
        else:
            print(f"❌ Erreur inscription: {response.status_code} - {response.text}")
            return None, None
    except Exception as e:
        print(f"❌ Erreur inscription: {e}")
        return None, None

def test_customer_management(token, org_id):
    """Test de gestion des clients"""
    print("👥 Test de gestion des clients...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Création d'un client
        customer_data = {
            "name": "Client Test",
            "email": "client@test.mg",
            "phone": "034 12 345 67",
            "tags": ["vip", "restaurant"],
            "metadata": {"source": "test"}
        }
        
        response = requests.post(
            f"{API_BASE}/orgs/{org_id}/customers",
            json=customer_data,
            headers=headers
        )
        
        if response.status_code == 201:
            customer = response.json()['customer']
            print(f"✅ Client créé: {customer['name']} (ID: {customer['id']})")
            
            # Test de récupération des clients
            list_response = requests.get(
                f"{API_BASE}/orgs/{org_id}/customers",
                headers=headers
            )
            
            if list_response.status_code == 200:
                customers = list_response.json()['customers']
                print(f"✅ Liste clients récupérée: {len(customers)} client(s)")
                return customer['id']
            else:
                print(f"❌ Erreur liste clients: {list_response.status_code}")
                return None
        else:
            print(f"❌ Erreur création client: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erreur gestion clients: {e}")
        return None

def test_campaign_management(token, org_id):
    """Test de gestion des campagnes"""
    print("📢 Test de gestion des campagnes...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        # Création d'une campagne
        campaign_data = {
            "title": "Campagne Test",
            "description": "Test de campagne marketing",
            "campaign_type": "facebook",
            "target_audience": ["vip"],
            "draft_content": "Contenu brouillon de test"
        }
        
        response = requests.post(
            f"{API_BASE}/orgs/{org_id}/campaigns",
            json=campaign_data,
            headers=headers
        )
        
        if response.status_code == 201:
            campaign = response.json()['campaign']
            print(f"✅ Campagne créée: {campaign['title']} (ID: {campaign['id']})")
            
            # Test de génération de contenu IA
            gen_response = requests.post(
                f"{API_BASE}/orgs/{org_id}/campaigns/{campaign['id']}/generate-content",
                json={
                    "prompt": "restaurant traditionnel malgache",
                    "template": "Créez une publication Facebook engageante pour {prompt}"
                },
                headers=headers
            )
            
            if gen_response.status_code == 200:
                gen_data = gen_response.json()
                print(f"✅ Contenu généré: {gen_data['generated_content'][:50]}...")
                return campaign['id']
            else:
                print(f"❌ Erreur génération contenu: {gen_response.status_code}")
                return campaign['id']
        else:
            print(f"❌ Erreur création campagne: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"❌ Erreur gestion campagnes: {e}")
        return None

def test_ai_proxy(token):
    """Test du proxy AI"""
    print("🔗 Test du proxy AI...")
    try:
        headers = {"Authorization": f"Bearer {token}"}
        
        response = requests.post(
            f"{API_BASE}/ai/generate-text",
            json={
                "prompt": "boutique de vêtements à Antananarivo",
                "template": "Rédigez un SMS promotionnel pour {prompt}. Maximum 160 caractères.",
                "max_tokens": 100,
                "temperature": 0.8
            },
            headers=headers
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Proxy AI fonctionnel: {data['generated_text'][:50]}...")
            return True
        else:
            print(f"❌ Erreur proxy AI: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur proxy AI: {e}")
        return False

def main():
    """Fonction principale de test"""
    print("🚀 Démarrage des tests AI4Local")
    print("=" * 50)
    
    # Tests de base
    api_ok = test_api_health()
    ai_ok = test_ai_service()
    
    if not api_ok or not ai_ok:
        print("❌ Tests de base échoués, arrêt des tests")
        return
    
    # Test d'inscription
    token, org_id = test_user_registration()
    if not token:
        print("❌ Inscription échouée, arrêt des tests")
        return
    
    # Tests fonctionnels
    customer_id = test_customer_management(token, org_id)
    campaign_id = test_campaign_management(token, org_id)
    proxy_ok = test_ai_proxy(token)
    
    # Résumé
    print("\n" + "=" * 50)
    print("📊 RÉSUMÉ DES TESTS")
    print("=" * 50)
    print(f"✅ API Health: {'OK' if api_ok else 'FAIL'}")
    print(f"✅ Service AI: {'OK' if ai_ok else 'FAIL'}")
    print(f"✅ Inscription: {'OK' if token else 'FAIL'}")
    print(f"✅ Gestion clients: {'OK' if customer_id else 'FAIL'}")
    print(f"✅ Gestion campagnes: {'OK' if campaign_id else 'FAIL'}")
    print(f"✅ Proxy AI: {'OK' if proxy_ok else 'FAIL'}")
    
    success_count = sum([api_ok, ai_ok, bool(token), bool(customer_id), bool(campaign_id), proxy_ok])
    print(f"\n🎯 Score: {success_count}/6 tests réussis")
    
    if success_count == 6:
        print("🎉 Tous les tests sont passés ! L'application est prête.")
    else:
        print("⚠️  Certains tests ont échoué. Vérifiez les logs ci-dessus.")

if __name__ == "__main__":
    main()

