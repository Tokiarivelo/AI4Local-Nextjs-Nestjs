from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import json

db = SQLAlchemy()

class Organization(db.Model):
    """Modèle pour les organisations/entreprises"""
    __tablename__ = 'organizations'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    plan = db.Column(db.String(20), default='free')  # free, basic, premium
    billing_info = db.Column(db.Text)  # JSON string pour les infos de facturation
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relations
    users = db.relationship('User', backref='organization', lazy=True)
    customers = db.relationship('Customer', backref='organization', lazy=True)
    products = db.relationship('Product', backref='organization', lazy=True)
    campaigns = db.relationship('Campaign', backref='organization', lazy=True)
    courses = db.relationship('Course', backref='organization', lazy=True)
    payments = db.relationship('Payment', backref='organization', lazy=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'plan': self.plan,
            'billing_info': json.loads(self.billing_info) if self.billing_info else None,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class User(db.Model):
    """Modèle pour les utilisateurs"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # ADMIN, OWNER, EMPLOYEE
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    last_login = db.Column(db.DateTime)
    is_active = db.Column(db.Boolean, default=True)
    
    def to_dict(self):
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'role': self.role,
            'org_id': self.org_id,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'last_login': self.last_login.isoformat() if self.last_login else None,
            'is_active': self.is_active
        }

class Customer(db.Model):
    """Modèle pour les clients"""
    __tablename__ = 'customers'
    
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    phone = db.Column(db.String(20))
    email = db.Column(db.String(120))
    tags = db.Column(db.Text)  # JSON string pour les tags
    extra_data = db.Column(db.Text)  # JSON string pour données additionnelles
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'org_id': self.org_id,
            'name': self.name,
            'phone': self.phone,
            'email': self.email,
            'tags': json.loads(self.tags) if self.tags else [],
            'metadata': json.loads(self.extra_data) if self.extra_data else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Product(db.Model):
    """Modèle pour les produits/services"""
    __tablename__ = 'products'
    
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    price = db.Column(db.Float)
    currency = db.Column(db.String(3), default='MGA')  # Ariary malgache
    category = db.Column(db.String(50))
    image_url = db.Column(db.String(255))
    extra_data = db.Column(db.Text)  # JSON string pour données additionnelles
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'org_id': self.org_id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'currency': self.currency,
            'category': self.category,
            'image_url': self.image_url,
            'metadata': json.loads(self.extra_data) if self.extra_data else {},
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Campaign(db.Model):
    """Modèle pour les campagnes marketing"""
    __tablename__ = 'campaigns'
    
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    draft_content = db.Column(db.Text)  # Contenu brouillon
    generated_content = db.Column(db.Text)  # Contenu généré par l'IA
    target_audience = db.Column(db.Text)  # JSON string pour les critères de ciblage
    schedule_at = db.Column(db.DateTime)
    status = db.Column(db.String(20), default='draft')  # draft, scheduled, sent, failed
    campaign_type = db.Column(db.String(20))  # facebook, sms, email, etc.
    extra_data = db.Column(db.Text)  # JSON string pour données additionnelles
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'org_id': self.org_id,
            'title': self.title,
            'description': self.description,
            'draft_content': self.draft_content,
            'generated_content': self.generated_content,
            'target_audience': json.loads(self.target_audience) if self.target_audience else [],
            'schedule_at': self.schedule_at.isoformat() if self.schedule_at else None,
            'status': self.status,
            'campaign_type': self.campaign_type,
            'metadata': json.loads(self.extra_data) if self.extra_data else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Course(db.Model):
    """Modèle pour les cours de formation (LMS)"""
    __tablename__ = 'courses'
    
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    lessons = db.Column(db.Text)  # JSON string pour les leçons
    duration_minutes = db.Column(db.Integer)
    difficulty_level = db.Column(db.String(20))  # beginner, intermediate, advanced
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'org_id': self.org_id,
            'title': self.title,
            'description': self.description,
            'lessons': json.loads(self.lessons) if self.lessons else [],
            'duration_minutes': self.duration_minutes,
            'difficulty_level': self.difficulty_level,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Payment(db.Model):
    """Modèle pour les paiements"""
    __tablename__ = 'payments'
    
    id = db.Column(db.Integer, primary_key=True)
    org_id = db.Column(db.Integer, db.ForeignKey('organizations.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(3), default='MGA')
    provider = db.Column(db.String(50))  # mvola, airtel_money, orange_money
    status = db.Column(db.String(20))  # pending, completed, failed, cancelled
    external_id = db.Column(db.String(100))  # ID de la transaction chez le fournisseur
    customer_phone = db.Column(db.String(20))
    description = db.Column(db.Text)
    extra_data = db.Column(db.Text)  # JSON string pour données additionnelles
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    completed_at = db.Column(db.DateTime)
    
    def to_dict(self):
        return {
            'id': self.id,
            'org_id': self.org_id,
            'amount': self.amount,
            'currency': self.currency,
            'provider': self.provider,
            'status': self.status,
            'external_id': self.external_id,
            'customer_phone': self.customer_phone,
            'description': self.description,
            'metadata': json.loads(self.extra_data) if self.extra_data else {},
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'completed_at': self.completed_at.isoformat() if self.completed_at else None
        }

