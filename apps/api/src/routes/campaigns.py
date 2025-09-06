from flask import Blueprint, request, jsonify, current_app
import json
import requests
from datetime import datetime, timedelta
from src.models.user import db, Campaign, Customer

campaigns_bp = Blueprint('campaigns', __name__)

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

@campaigns_bp.route('/orgs/<int:org_id>/campaigns', methods=['GET'])
@token_required
def get_campaigns(current_user_id, current_org_id, org_id):
    """Récupération de la liste des campagnes d'une organisation"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        # Paramètres de pagination et filtrage
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        status = request.args.get('status', '').strip()
        campaign_type = request.args.get('type', '').strip()
        
        # Construction de la requête
        query = Campaign.query.filter_by(org_id=org_id)
        
        # Filtrage par statut
        if status:
            query = query.filter_by(status=status)
        
        # Filtrage par type de campagne
        if campaign_type:
            query = query.filter_by(campaign_type=campaign_type)
        
        # Pagination
        campaigns_paginated = query.order_by(Campaign.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'campaigns': [campaign.to_dict() for campaign in campaigns_paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': campaigns_paginated.total,
                'pages': campaigns_paginated.pages,
                'has_next': campaigns_paginated.has_next,
                'has_prev': campaigns_paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns', methods=['POST'])
@token_required
def create_campaign(current_user_id, current_org_id, org_id):
    """Création d'une nouvelle campagne"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('title'):
            return jsonify({'error': 'Le titre de la campagne est requis'}), 400
        
        if not data.get('campaign_type'):
            return jsonify({'error': 'Le type de campagne est requis'}), 400
        
        # Validation du type de campagne
        valid_types = ['facebook', 'sms', 'email', 'whatsapp']
        if data['campaign_type'] not in valid_types:
            return jsonify({'error': f'Type de campagne invalide. Types valides: {", ".join(valid_types)}'}), 400
        
        # Traitement de la date de planification
        schedule_at = None
        if data.get('schedule_at'):
            try:
                schedule_at = datetime.fromisoformat(data['schedule_at'].replace('Z', '+00:00'))
            except ValueError:
                return jsonify({'error': 'Format de date invalide pour schedule_at'}), 400
        
        # Création de la campagne
        campaign = Campaign(
            org_id=org_id,
            title=data['title'].strip(),
            description=data.get('description', '').strip(),
            draft_content=data.get('draft_content', ''),
            target_audience=json.dumps(data.get('target_audience', [])),
            schedule_at=schedule_at,
            campaign_type=data['campaign_type'],
            metadata=json.dumps(data.get('metadata', {}))
        )
        
        db.session.add(campaign)
        db.session.commit()
        
        return jsonify({
            'message': 'Campagne créée avec succès',
            'campaign': campaign.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/<int:campaign_id>', methods=['GET'])
@token_required
def get_campaign(current_user_id, current_org_id, org_id, campaign_id):
    """Récupération d'une campagne spécifique"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        campaign = Campaign.query.filter_by(id=campaign_id, org_id=org_id).first()
        if not campaign:
            return jsonify({'error': 'Campagne non trouvée'}), 404
        
        return jsonify({'campaign': campaign.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/<int:campaign_id>/generate-content', methods=['POST'])
@token_required
def generate_campaign_content(current_user_id, current_org_id, org_id, campaign_id):
    """Génération de contenu pour une campagne avec l'IA"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        campaign = Campaign.query.filter_by(id=campaign_id, org_id=org_id).first()
        if not campaign:
            return jsonify({'error': 'Campagne non trouvée'}), 404
        
        data = request.get_json()
        
        # Récupération du prompt et du template
        prompt = data.get('prompt', campaign.title)
        template = data.get('template', '')
        
        # Sélection du template par défaut selon le type de campagne
        if not template:
            templates = {
                'facebook': "Créez une publication Facebook engageante pour promouvoir {prompt}. Incluez des emojis et un appel à l'action. Maximum 150 caractères.",
                'sms': "Rédigez un SMS promotionnel pour {prompt}. Maximum 160 caractères. Incluez un appel à l'action clair.",
                'email': "Rédigez l'objet et le contenu d'un email marketing pour {prompt}. Ton professionnel mais engageant.",
                'whatsapp': "Créez un message WhatsApp Business pour promouvoir {prompt}. Ton amical et direct."
            }
            template = templates.get(campaign.campaign_type, "Créez du contenu marketing pour {prompt}")
        
        # Appel au service AI
        try:
            ai_response = requests.post(
                f"{current_app.config['AI_SERVICE_URL']}/generate-text",
                json={
                    'prompt': prompt,
                    'template': template,
                    'max_tokens': 200,
                    'temperature': 0.7
                },
                timeout=30
            )
            
            if ai_response.status_code != 200:
                return jsonify({'error': 'Erreur du service AI'}), 500
            
            ai_data = ai_response.json()
            generated_content = ai_data.get('generated_text', '')
            
        except requests.RequestException as e:
            return jsonify({'error': f'Erreur de communication avec le service AI: {str(e)}'}), 500
        
        # Mise à jour de la campagne avec le contenu généré
        campaign.generated_content = generated_content
        campaign.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Contenu généré avec succès',
            'generated_content': generated_content,
            'campaign': campaign.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la génération: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/<int:campaign_id>', methods=['PUT'])
@token_required
def update_campaign(current_user_id, current_org_id, org_id, campaign_id):
    """Mise à jour d'une campagne"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        campaign = Campaign.query.filter_by(id=campaign_id, org_id=org_id).first()
        if not campaign:
            return jsonify({'error': 'Campagne non trouvée'}), 404
        
        data = request.get_json()
        
        # Mise à jour des champs
        if 'title' in data:
            campaign.title = data['title'].strip()
        if 'description' in data:
            campaign.description = data['description'].strip()
        if 'draft_content' in data:
            campaign.draft_content = data['draft_content']
        if 'generated_content' in data:
            campaign.generated_content = data['generated_content']
        if 'target_audience' in data:
            campaign.target_audience = json.dumps(data['target_audience'])
        if 'status' in data:
            valid_statuses = ['draft', 'scheduled', 'sent', 'failed']
            if data['status'] in valid_statuses:
                campaign.status = data['status']
        if 'schedule_at' in data:
            if data['schedule_at']:
                try:
                    campaign.schedule_at = datetime.fromisoformat(data['schedule_at'].replace('Z', '+00:00'))
                except ValueError:
                    return jsonify({'error': 'Format de date invalide pour schedule_at'}), 400
            else:
                campaign.schedule_at = None
        if 'metadata' in data:
            campaign.metadata = json.dumps(data['metadata'])
        
        campaign.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Campagne mise à jour avec succès',
            'campaign': campaign.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/<int:campaign_id>', methods=['DELETE'])
@token_required
def delete_campaign(current_user_id, current_org_id, org_id, campaign_id):
    """Suppression d'une campagne"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        campaign = Campaign.query.filter_by(id=campaign_id, org_id=org_id).first()
        if not campaign:
            return jsonify({'error': 'Campagne non trouvée'}), 404
        
        # Vérification que la campagne n'est pas déjà envoyée
        if campaign.status == 'sent':
            return jsonify({'error': 'Impossible de supprimer une campagne déjà envoyée'}), 400
        
        db.session.delete(campaign)
        db.session.commit()
        
        return jsonify({'message': 'Campagne supprimée avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/<int:campaign_id>/preview', methods=['GET'])
@token_required
def preview_campaign(current_user_id, current_org_id, org_id, campaign_id):
    """Prévisualisation d'une campagne avec audience ciblée"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        campaign = Campaign.query.filter_by(id=campaign_id, org_id=org_id).first()
        if not campaign:
            return jsonify({'error': 'Campagne non trouvée'}), 404
        
        # Récupération de l'audience ciblée
        target_audience = campaign.to_dict()['target_audience']
        
        # Construction de la requête pour les clients ciblés
        query = Customer.query.filter_by(org_id=org_id)
        
        # Filtrage par tags si spécifié
        if target_audience:
            for tag in target_audience:
                query = query.filter(Customer.tags.contains(f'"{tag}"'))
        
        targeted_customers = query.all()
        
        return jsonify({
            'campaign': campaign.to_dict(),
            'targeted_customers_count': len(targeted_customers),
            'targeted_customers': [customer.to_dict() for customer in targeted_customers[:10]],  # Limite à 10 pour la préview
            'content_preview': {
                'draft': campaign.draft_content,
                'generated': campaign.generated_content
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la prévisualisation: {str(e)}'}), 500

@campaigns_bp.route('/orgs/<int:org_id>/campaigns/templates', methods=['GET'])
@token_required
def get_campaign_templates(current_user_id, current_org_id, org_id):
    """Récupération des templates de campagne disponibles"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        templates = {
            'facebook': [
                {
                    'name': 'Promotion Produit',
                    'template': '🌟 Découvrez {prompt} ! Une offre exceptionnelle vous attend. Visitez-nous dès aujourd\'hui ! #LocalBusiness #Madagascar',
                    'description': 'Template pour promouvoir un produit ou service'
                },
                {
                    'name': 'Événement',
                    'template': '📅 Ne manquez pas {prompt} ! Rejoignez-nous pour un moment inoubliable. Réservez votre place maintenant ! 🎉',
                    'description': 'Template pour annoncer un événement'
                }
            ],
            'sms': [
                {
                    'name': 'Promo Flash',
                    'template': 'PROMO: {prompt} - Offre limitée ! Valable jusqu\'au [DATE]. Info: [PHONE]',
                    'description': 'Template pour une promotion flash'
                },
                {
                    'name': 'Rappel RDV',
                    'template': 'Rappel: RDV {prompt} demain à [HEURE]. Confirmez au [PHONE]. Merci !',
                    'description': 'Template pour rappel de rendez-vous'
                }
            ],
            'email': [
                {
                    'name': 'Newsletter',
                    'template': 'Objet: Nouveautés {prompt}\n\nBonjour,\n\nDécouvrez nos dernières nouveautés concernant {prompt}. [CONTENU]\n\nCordialement,\nL\'équipe',
                    'description': 'Template pour newsletter'
                }
            ],
            'whatsapp': [
                {
                    'name': 'Message Amical',
                    'template': 'Salut ! 👋 J\'ai pensé que {prompt} pourrait t\'intéresser. Qu\'en penses-tu ? 😊',
                    'description': 'Template pour message WhatsApp amical'
                }
            ]
        }
        
        return jsonify({'templates': templates}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération des templates: {str(e)}'}), 500

