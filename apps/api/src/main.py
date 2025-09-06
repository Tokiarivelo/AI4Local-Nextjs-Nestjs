import os
import sys
import requests
from datetime import datetime, timedelta
import jwt
from functools import wraps
# DON'T CHANGE THIS !!!
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, send_from_directory, request, jsonify
from flask_cors import CORS
from flask_graphql import GraphQLView
from src.models.user import db
from src.routes.user import user_bp
from src.routes.auth import auth_bp
from src.routes.customers import customers_bp
from src.routes.campaigns import campaigns_bp
from src.routes.ai import ai_bp
from src.graphql_schema import schema

app = Flask(__name__, static_folder=os.path.join(os.path.dirname(__file__), 'static'))
app.config['SECRET_KEY'] = 'ai4local_secret_key_2024'

# Configuration CORS pour permettre les requêtes depuis le frontend
CORS(app, origins=['http://localhost:3000', 'http://localhost:5173'])

# Configuration de la base de données
app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{os.path.join(os.path.dirname(__file__), 'database', 'app.db')}"
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Configuration du service AI
app.config['AI_SERVICE_URL'] = os.getenv('AI_SERVICE_URL', 'http://localhost:8000')

# Enregistrement des blueprints
app.register_blueprint(user_bp, url_prefix='/api')
app.register_blueprint(auth_bp, url_prefix='/api/auth')
app.register_blueprint(customers_bp, url_prefix='/api')
app.register_blueprint(campaigns_bp, url_prefix='/api')
app.register_blueprint(ai_bp, url_prefix='/api/ai')

# Initialisation de la base de données
db.init_app(app)
with app.app_context():
    db.create_all()

# Middleware d'authentification JWT
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Récupération du token depuis l'en-tête Authorization
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(" ")[1]  # Bearer <token>
            except IndexError:
                return jsonify({'message': 'Token format invalide'}), 401
        
        if not token:
            return jsonify({'message': 'Token manquant'}), 401
        
        try:
            # Décodage du token JWT
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user_id = data['user_id']
            current_org_id = data.get('org_id')
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token expiré'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Token invalide'}), 401
        
        return f(current_user_id, current_org_id, *args, **kwargs)
    
    return decorated

# Route de santé de l'API
@app.route('/api/health')
def health_check():
    return jsonify({
        'status': 'healthy',
        'service': 'ai4local-api',
        'timestamp': datetime.utcnow().isoformat(),
        'version': '1.0.0'
    })

# Route de statut avec informations sur les services
@app.route('/api/status')
def status():
    ai_service_status = 'unknown'
    try:
        ai_response = requests.get(f"{app.config['AI_SERVICE_URL']}/health", timeout=5)
        ai_service_status = 'healthy' if ai_response.status_code == 200 else 'unhealthy'
    except:
        ai_service_status = 'unreachable'
    
    return jsonify({
        'api': 'healthy',
        'ai_service': ai_service_status,
        'database': 'connected',
        'timestamp': datetime.utcnow().isoformat()
    })

# Route pour servir le frontend (SPA)
@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    static_folder_path = app.static_folder
    if static_folder_path is None:
        return "Static folder not configured", 404

    if path != "" and os.path.exists(os.path.join(static_folder_path, path)):
        return send_from_directory(static_folder_path, path)
    else:
        index_path = os.path.join(static_folder_path, 'index.html')
        if os.path.exists(index_path):
            return send_from_directory(static_folder_path, 'index.html')
        else:
            return jsonify({
                'message': 'AI4Local API',
                'version': '1.0.0',
                'endpoints': {
                    'health': '/api/health',
                    'status': '/api/status',
                    'auth': '/api/auth/*',
                    'customers': '/api/orgs/{org_id}/customers',
                    'campaigns': '/api/orgs/{org_id}/campaigns',
                    'ai': '/api/ai/*',
                    'graphql': '/graphql'
                }
            })

# Endpoint GraphQL
app.add_url_rule(
    '/graphql',
    view_func=GraphQLView.as_view(
        'graphql',
        schema=schema,
        graphiql=True  # Interface GraphiQL pour les tests en développement
    )
)

# Gestionnaire d'erreurs
@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint non trouvé'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Erreur interne du serveur'}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

