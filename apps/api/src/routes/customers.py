from flask import Blueprint, request, jsonify, current_app
import json
import csv
import io
from datetime import datetime
from src.models.user import db, Customer

customers_bp = Blueprint('customers', __name__)

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

@customers_bp.route('/orgs/<int:org_id>/customers', methods=['GET'])
@token_required
def get_customers(current_user_id, current_org_id, org_id):
    """Récupération de la liste des clients d'une organisation"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        # Paramètres de pagination et filtrage
        page = request.args.get('page', 1, type=int)
        per_page = min(request.args.get('per_page', 20, type=int), 100)
        search = request.args.get('search', '').strip()
        tags = request.args.get('tags', '').strip()
        
        # Construction de la requête
        query = Customer.query.filter_by(org_id=org_id)
        
        # Filtrage par recherche (nom, email, téléphone)
        if search:
            search_filter = f"%{search}%"
            query = query.filter(
                db.or_(
                    Customer.name.ilike(search_filter),
                    Customer.email.ilike(search_filter),
                    Customer.phone.ilike(search_filter)
                )
            )
        
        # Filtrage par tags
        if tags:
            tag_list = [tag.strip() for tag in tags.split(',')]
            for tag in tag_list:
                query = query.filter(Customer.tags.contains(f'"{tag}"'))
        
        # Pagination
        customers_paginated = query.order_by(Customer.created_at.desc()).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'customers': [customer.to_dict() for customer in customers_paginated.items],
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': customers_paginated.total,
                'pages': customers_paginated.pages,
                'has_next': customers_paginated.has_next,
                'has_prev': customers_paginated.has_prev
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers', methods=['POST'])
@token_required
def create_customer(current_user_id, current_org_id, org_id):
    """Création d'un nouveau client"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('name'):
            return jsonify({'error': 'Le nom du client est requis'}), 400
        
        # Vérification de l'unicité de l'email dans l'organisation
        if data.get('email'):
            existing_customer = Customer.query.filter_by(
                org_id=org_id, 
                email=data['email']
            ).first()
            if existing_customer:
                return jsonify({'error': 'Un client avec cet email existe déjà'}), 409
        
        # Création du client
        customer = Customer(
            org_id=org_id,
            name=data['name'].strip(),
            phone=data.get('phone', '').strip() if data.get('phone') else None,
            email=data.get('email', '').strip().lower() if data.get('email') else None,
            tags=json.dumps(data.get('tags', [])),
            extra_data=json.dumps(data.get('metadata', {}))
        )
        
        db.session.add(customer)
        db.session.commit()
        
        return jsonify({
            'message': 'Client créé avec succès',
            'customer': customer.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la création: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers/<int:customer_id>', methods=['GET'])
@token_required
def get_customer(current_user_id, current_org_id, org_id, customer_id):
    """Récupération d'un client spécifique"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        customer = Customer.query.filter_by(id=customer_id, org_id=org_id).first()
        if not customer:
            return jsonify({'error': 'Client non trouvé'}), 404
        
        return jsonify({'customer': customer.to_dict()}), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers/<int:customer_id>', methods=['PUT'])
@token_required
def update_customer(current_user_id, current_org_id, org_id, customer_id):
    """Mise à jour d'un client"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        customer = Customer.query.filter_by(id=customer_id, org_id=org_id).first()
        if not customer:
            return jsonify({'error': 'Client non trouvé'}), 404
        
        data = request.get_json()
        
        # Vérification de l'unicité de l'email (si modifié)
        if data.get('email') and data['email'] != customer.email:
            existing_customer = Customer.query.filter_by(
                org_id=org_id, 
                email=data['email']
            ).first()
            if existing_customer:
                return jsonify({'error': 'Un client avec cet email existe déjà'}), 409
        
        # Mise à jour des champs
        if 'name' in data:
            customer.name = data['name'].strip()
        if 'phone' in data:
            customer.phone = data['phone'].strip() if data['phone'] else None
        if 'email' in data:
            customer.email = data['email'].strip().lower() if data['email'] else None
        if 'tags' in data:
            customer.tags = json.dumps(data['tags'])
        if 'metadata' in data:
            customer.extra_data = json.dumps(data['metadata'])
        
        customer.updated_at = datetime.utcnow()
        db.session.commit()
        
        return jsonify({
            'message': 'Client mis à jour avec succès',
            'customer': customer.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la mise à jour: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers/<int:customer_id>', methods=['DELETE'])
@token_required
def delete_customer(current_user_id, current_org_id, org_id, customer_id):
    """Suppression d'un client"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        customer = Customer.query.filter_by(id=customer_id, org_id=org_id).first()
        if not customer:
            return jsonify({'error': 'Client non trouvé'}), 404
        
        db.session.delete(customer)
        db.session.commit()
        
        return jsonify({'message': 'Client supprimé avec succès'}), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de la suppression: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers/import', methods=['POST'])
@token_required
def import_customers(current_user_id, current_org_id, org_id):
    """Importation en masse de clients via CSV"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        if 'file' not in request.files:
            return jsonify({'error': 'Aucun fichier fourni'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'Aucun fichier sélectionné'}), 400
        
        if not file.filename.lower().endswith('.csv'):
            return jsonify({'error': 'Le fichier doit être au format CSV'}), 400
        
        # Lecture du fichier CSV
        stream = io.StringIO(file.stream.read().decode("UTF8"), newline=None)
        csv_input = csv.DictReader(stream)
        
        imported_count = 0
        errors = []
        
        for row_num, row in enumerate(csv_input, start=2):  # Start=2 car ligne 1 = headers
            try:
                # Validation des données requises
                if not row.get('name', '').strip():
                    errors.append(f"Ligne {row_num}: Le nom est requis")
                    continue
                
                # Vérification de l'unicité de l'email
                email = row.get('email', '').strip().lower() if row.get('email') else None
                if email:
                    existing_customer = Customer.query.filter_by(
                        org_id=org_id, 
                        email=email
                    ).first()
                    if existing_customer:
                        errors.append(f"Ligne {row_num}: Email {email} déjà existant")
                        continue
                
                # Traitement des tags (séparés par des virgules)
                tags = []
                if row.get('tags'):
                    tags = [tag.strip() for tag in row['tags'].split(',') if tag.strip()]
                
                # Création du client
                customer = Customer(
                    org_id=org_id,
                    name=row['name'].strip(),
                    phone=row.get('phone', '').strip() if row.get('phone') else None,
                    email=email,
                    tags=json.dumps(tags),
                    extra_data=json.dumps({})
                )
                
                db.session.add(customer)
                imported_count += 1
                
            except Exception as e:
                errors.append(f"Ligne {row_num}: {str(e)}")
        
        db.session.commit()
        
        return jsonify({
            'message': f'{imported_count} clients importés avec succès',
            'imported_count': imported_count,
            'errors': errors
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de l\'importation: {str(e)}'}), 500

@customers_bp.route('/orgs/<int:org_id>/customers/export', methods=['GET'])
@token_required
def export_customers(current_user_id, current_org_id, org_id):
    """Exportation des clients au format CSV"""
    try:
        # Vérification des permissions
        if current_org_id != org_id:
            return jsonify({'error': 'Accès non autorisé à cette organisation'}), 403
        
        customers = Customer.query.filter_by(org_id=org_id).order_by(Customer.created_at.desc()).all()
        
        # Création du CSV
        output = io.StringIO()
        writer = csv.writer(output)
        
        # En-têtes
        writer.writerow(['id', 'name', 'email', 'phone', 'tags', 'created_at'])
        
        # Données
        for customer in customers:
            tags_str = ', '.join(customer.to_dict()['tags']) if customer.to_dict()['tags'] else ''
            writer.writerow([
                customer.id,
                customer.name,
                customer.email or '',
                customer.phone or '',
                tags_str,
                customer.created_at.strftime('%Y-%m-%d %H:%M:%S') if customer.created_at else ''
            ])
        
        output.seek(0)
        
        return jsonify({
            'csv_data': output.getvalue(),
            'filename': f'clients_org_{org_id}_{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de l\'exportation: {str(e)}'}), 500

