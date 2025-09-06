from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import generate_password_hash, check_password_hash
import jwt
from datetime import datetime, timedelta
import re
from src.models.user import db, User, Organization

auth_bp = Blueprint('auth', __name__)

def validate_email(email):
    """Valide le format de l'email"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

def validate_password(password):
    """Valide la force du mot de passe"""
    if len(password) < 6:
        return False, "Le mot de passe doit contenir au moins 6 caractères"
    return True, ""

@auth_bp.route('/signup', methods=['POST'])
def signup():
    """Inscription d'un nouvel utilisateur et création d'organisation"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        required_fields = ['email', 'password', 'name', 'org_name']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Le champ {field} est requis'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        name = data['name'].strip()
        org_name = data['org_name'].strip()
        
        # Validation de l'email
        if not validate_email(email):
            return jsonify({'error': 'Format d\'email invalide'}), 400
        
        # Validation du mot de passe
        is_valid, error_msg = validate_password(password)
        if not is_valid:
            return jsonify({'error': error_msg}), 400
        
        # Vérification si l'utilisateur existe déjà
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'Un utilisateur avec cet email existe déjà'}), 409
        
        # Création de l'organisation
        organization = Organization(
            name=org_name,
            plan='free',
            created_at=datetime.utcnow()
        )
        db.session.add(organization)
        db.session.flush()  # Pour obtenir l'ID de l'organisation
        
        # Création de l'utilisateur (propriétaire de l'organisation)
        user = User(
            email=email,
            name=name,
            password_hash=generate_password_hash(password),
            role='OWNER',
            org_id=organization.id,
            created_at=datetime.utcnow()
        )
        db.session.add(user)
        db.session.commit()
        
        # Génération du token JWT
        token = jwt.encode({
            'user_id': user.id,
            'org_id': organization.id,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Inscription réussie',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'org_id': user.org_id,
                'org_name': organization.name
            }
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Erreur lors de l\'inscription: {str(e)}'}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """Connexion d'un utilisateur existant"""
    try:
        data = request.get_json()
        
        # Validation des données requises
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email et mot de passe requis'}), 400
        
        email = data['email'].lower().strip()
        password = data['password']
        
        # Recherche de l'utilisateur
        user = User.query.filter_by(email=email).first()
        if not user or not check_password_hash(user.password_hash, password):
            return jsonify({'error': 'Email ou mot de passe incorrect'}), 401
        
        # Récupération de l'organisation
        organization = Organization.query.get(user.org_id)
        if not organization:
            return jsonify({'error': 'Organisation non trouvée'}), 404
        
        # Génération du token JWT
        token = jwt.encode({
            'user_id': user.id,
            'org_id': user.org_id,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Connexion réussie',
            'token': token,
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'org_id': user.org_id,
                'org_name': organization.name
            }
        }), 200
        
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la connexion: {str(e)}'}), 500

@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """Récupération des informations de l'utilisateur connecté"""
    try:
        token = None
        
        # Récupération du token depuis l'en-tête Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Token format invalide'}), 401
        
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        
        # Décodage du token JWT
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'])
        user_id = data['user_id']
        
        # Récupération de l'utilisateur
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        # Récupération de l'organisation
        organization = Organization.query.get(user.org_id)
        
        return jsonify({
            'user': {
                'id': user.id,
                'email': user.email,
                'name': user.name,
                'role': user.role,
                'org_id': user.org_id,
                'org_name': organization.name if organization else None
            }
        }), 200
        
    except jwt.ExpiredSignatureError:
        return jsonify({'error': 'Token expiré'}), 401
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token invalide'}), 401
    except Exception as e:
        return jsonify({'error': f'Erreur lors de la récupération: {str(e)}'}), 500

@auth_bp.route('/refresh', methods=['POST'])
def refresh_token():
    """Renouvellement du token JWT"""
    try:
        token = None
        
        # Récupération du token depuis l'en-tête Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'error': 'Token format invalide'}), 401
        
        if not token:
            return jsonify({'error': 'Token manquant'}), 401
        
        # Décodage du token JWT (même expiré)
        data = jwt.decode(token, current_app.config['SECRET_KEY'], algorithms=['HS256'], options={"verify_exp": False})
        user_id = data['user_id']
        
        # Vérification que l'utilisateur existe toujours
        user = User.query.get(user_id)
        if not user:
            return jsonify({'error': 'Utilisateur non trouvé'}), 404
        
        # Génération d'un nouveau token
        new_token = jwt.encode({
            'user_id': user.id,
            'org_id': user.org_id,
            'role': user.role,
            'exp': datetime.utcnow() + timedelta(days=7)
        }, current_app.config['SECRET_KEY'], algorithm='HS256')
        
        return jsonify({
            'message': 'Token renouvelé',
            'token': new_token
        }), 200
        
    except jwt.InvalidTokenError:
        return jsonify({'error': 'Token invalide'}), 401
    except Exception as e:
        return jsonify({'error': f'Erreur lors du renouvellement: {str(e)}'}), 500

