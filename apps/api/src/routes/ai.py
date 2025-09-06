from flask import Blueprint, request, jsonify, current_app
import requests
import json

ai_bp = Blueprint('ai', __name__)

def token_required(f):
    """Décorateur pour vérifier l'authentification JWT"""
    from functools import wraps
    import jwt
    
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]
            except IndexError:
                return jsonify({'error': 'Token format invalide'}), 401
        
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        
        try:
            data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            current_org_id = data.get('org_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Token invalide'}), 401
        
        return f(current_user_id, current_org_id, *args, **kwargs)
    
    return decorated

@ai_bp.route('/generate-text', methods=['POST'])
@token_required
def generate_text(current_user_id, current_org_id):
    """Proxy pour la génération de texte via le service AI"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('prompt'):
            return jsonify({'error': 'Le prompt est requis'}), 400
        
        # Appel au service AI
        ai_response = requests.post(
            f"{current_app.config['AI_SERVICE_URL']}/generate-text",
            json=data,
            timeout=30
        )
        
        if ai_response.status_code != 200:
            return jsonify({'error': 'Erreur du service AI'}), 500
        
        return jsonify(ai_response.json()), 200
        
    except requests.RequestException as e:
        return jsonify({'error': f'Erreur de communication avec le service AI: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la génération: {str(e)}'}), 500

@ai_bp.route('/embed', methods=['POST'])
@token_required
def create_embeddings(current_user_id, current_org_id):
    """Proxy pour la création d'embeddings via le service AI"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('texts') or not isinstance(data['texts'], list):
            return jsonify({'error': 'Une liste de textes est requise'}), 400
        
        # Appel au service AI
        ai_response = requests.post(
            f"{current_app.config['AI_SERVICE_URL']}/embed",
            json=data,
            timeout=30
        )
        
        if ai_response.status_code != 200:
            return jsonify({'error': 'Erreur du service AI'}), 500
        
        return jsonify(ai_response.json()), 200
        
    except requests.RequestException as e:
        return jsonify({'error': f'Erreur de communication avec le service AI: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la création d\'embeddings: {str(e)}'}), 500

@ai_bp.route('/semantic-search', methods=['POST'])
@token_required
def semantic_search(current_user_id, current_org_id):
    """Proxy pour la recherche sémantique via le service AI"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('query'):
            return jsonify({'error': 'La requête de recherche est requise'}), 400
        
        # Appel au service AI
        ai_response = requests.post(
            f"{current_app.config['AI_SERVICE_URL']}/semantic-search",
            json=data,
            timeout=30
        )
        
        if ai_response.status_code != 200:
            return jsonify({'error': 'Erreur du service AI'}), 500
        
        return jsonify(ai_response.json()), 200
        
    except requests.RequestException as e:
        return jsonify({'error': f'Erreur de communication avec le service AI: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la recherche: {str(e)}'}), 500

@ai_bp.route('/content-suggestions', methods=['POST'])
@token_required
def get_content_suggestions(current_user_id, current_org_id):
    """Génération de suggestions de contenu basées sur le contexte"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('business_type'):
            return jsonify({'error': 'Le type d\'entreprise est requis'}), 400
        
        business_type = data['business_type']
        target_audience = data.get('target_audience', 'clients locaux')
        campaign_type = data.get('campaign_type', 'facebook')
        
        # Génération de suggestions contextuelles
        suggestions = []
        
        if campaign_type == 'facebook':
            suggestions = [
                f"🌟 Découvrez notre {business_type} ! Qualité exceptionnelle pour {target_audience}. Visitez-nous dès aujourd'hui ! #LocalBusiness #Madagascar",
                f"📍 Votre {business_type} de confiance à Madagascar ! Service personnalisé pour {target_audience}. Contactez-nous ! 📞",
                f"💫 Nouveau chez nous ! {business_type} adapté aux besoins de {target_audience}. Venez découvrir nos offres spéciales ! 🎉"
            ]
        elif campaign_type == 'sms':
            suggestions = [
                f"NOUVEAU: {business_type} pour {target_audience}. Offre spéciale ce mois-ci ! Info: 034 XX XXX XX",
                f"Promo {business_type}: -20% pour {target_audience}. Valable jusqu'au 31/12. Appelez maintenant !",
                f"Votre {business_type} vous attend ! Service de qualité pour {target_audience}. RDV: 034 XX XXX XX"
            ]
        elif campaign_type == 'email':
            suggestions = [
                f"Objet: Découvrez notre {business_type} exceptionnel\n\nBonjour,\n\nNous sommes ravis de vous présenter notre {business_type}, spécialement conçu pour {target_audience}...",
                f"Objet: Offre exclusive pour {target_audience}\n\nCher(e) client(e),\n\nProfitez de notre {business_type} avec une remise spéciale...",
                f"Objet: Nouveautés {business_type} - Ne manquez pas ça !\n\nBonjour,\n\nDécouvrez nos dernières innovations en {business_type}..."
            ]
        
        return jsonify({
            'suggestions': suggestions,
            'context': {
                'business_type': business_type,
                'target_audience': target_audience,
                'campaign_type': campaign_type
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la génération de suggestions: {str(e)}'}), 500

@ai_bp.route('/optimize-content', methods=['POST'])
@token_required
def optimize_content(current_user_id, current_org_id):
    """Optimisation de contenu existant"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('content'):
            return jsonify({'error': 'Le contenu à optimiser est requis'}), 400
        
        content = data['content']
        campaign_type = data.get('campaign_type', 'facebook')
        optimization_goal = data.get('goal', 'engagement')  # engagement, conversion, awareness
        
        # Création du prompt d'optimisation
        optimization_prompts = {
            'engagement': f"Optimisez ce contenu {campaign_type} pour maximiser l'engagement (likes, commentaires, partages): {content}",
            'conversion': f"Réécrivez ce contenu {campaign_type} pour inciter à l'action et améliorer les conversions: {content}",
            'awareness': f"Adaptez ce contenu {campaign_type} pour améliorer la notoriété de la marque: {content}"
        }
        
        prompt = optimization_prompts.get(optimization_goal, optimization_prompts['engagement'])
        
        # Appel au service AI pour l'optimisation
        ai_response = requests.post(
            f"{current_app.config['AI_SERVICE_URL']}/generate-text",
            json={
                'prompt': content,
                'template': prompt,
                'max_tokens': 200,
                'temperature': 0.6
            },
            timeout=30
        )
        
        if ai_response.status_code != 200:
            return jsonify({'error': 'Erreur du service AI'}), 500
        
        ai_data = ai_response.json()
        optimized_content = ai_data.get('generated_text', '')
        
        return jsonify({
            'original_content': content,
            'optimized_content': optimized_content,
            'optimization_goal': optimization_goal,
            'campaign_type': campaign_type,
            'suggestions': [
                "Ajoutez des emojis pour plus d'engagement",
                "Incluez un appel à l'action clair",
                "Mentionnez votre localisation (Madagascar)",
                "Utilisez des hashtags pertinents"
            ]
        }), 200
        
    except requests.RequestException as e:
        return jsonify({'error': f'Erreur de communication avec le service AI: {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': f'Erreur lors de l\'optimisation: {str(e)}'}), 500

@ai_bp.route('/status', methods=['GET'])
@token_required
def ai_service_status(current_user_id, current_org_id):
    """Vérification du statut du service AI"""
    try:
        # Test de connectivité avec le service AI
        ai_response = requests.get(
            f"{current_app.config['AI_SERVICE_URL']}/health",
            timeout=5
        )
        
        if ai_response.status_code == 200:
            ai_data = ai_response.json()
            return jsonify({
                'status': 'healthy',
                'ai_service': ai_data,
                'features': {
                    'text_generation': True,
                    'embeddings': True,
                    'semantic_search': True,
                    'content_optimization': True
                }
            }), 200
        else:
            return jsonify({
                'status': 'unhealthy',
                'error': 'Service AI non disponible'
            }), 503
            
    except requests.RequestException as e:
        return jsonify({
            'status': 'unreachable',
            'error': f'Impossible de contacter le service AI: {str(e)}'
        }), 503
    except Exception as e:
        return jsonify({
            'status': 'error',
            'error': f'Erreur lors de la vérification: {str(e)}'
        }), 500

