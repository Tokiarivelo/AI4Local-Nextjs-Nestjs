import graphene
from graphene import relay
from graphene_sqlalchemy import SQLAlchemyObjectType, SQLAlchemyConnectionField
from graphene_sqlalchemy.converter import convert_sqlalchemy_type
from sqlalchemy.orm import scoped_session, sessionmaker
from sqlalchemy import create_engine
import json
from datetime import datetime

from src.models.user import db, User, Organization, Customer, Campaign

# Configuration de la session SQLAlchemy pour GraphQL
# Utiliser la même configuration que l'application Flask
from flask import current_app
import os

# Utiliser la base de données existante de l'application Flask
database_path = os.path.join(os.path.dirname(__file__), 'database', 'app.db')
engine = create_engine(f'sqlite:///{database_path}')
db_session = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))

# Types GraphQL pour les modèles SQLAlchemy

class UserType(SQLAlchemyObjectType):
    class Meta:
        model = User
        interfaces = (relay.Node, )

class OrganizationType(SQLAlchemyObjectType):
    class Meta:
        model = Organization
        interfaces = (relay.Node, )

class CustomerType(SQLAlchemyObjectType):
    class Meta:
        model = Customer
        interfaces = (relay.Node, )
    
    # Champs personnalisés pour les données JSON
    tags = graphene.List(graphene.String)
    metadata = graphene.JSONString()
    
    def resolve_tags(self, info):
        if self.tags:
            return json.loads(self.tags)
        return []
    
    def resolve_metadata(self, info):
        if self.extra_data:
            return json.loads(self.extra_data)
        return {}

class CampaignType(SQLAlchemyObjectType):
    class Meta:
        model = Campaign
        interfaces = (relay.Node, )
    
    # Champs personnalisés pour les données JSON
    target_audience = graphene.List(graphene.String)
    metadata = graphene.JSONString()
    
    def resolve_target_audience(self, info):
        if self.target_audience:
            return json.loads(self.target_audience)
        return []
    
    def resolve_metadata(self, info):
        if self.metadata:
            return json.loads(self.metadata)
        return {}

# Requêtes GraphQL

class Query(graphene.ObjectType):
    node = relay.Node.Field()
    
    # Requêtes pour les utilisateurs
    all_users = SQLAlchemyConnectionField(UserType.connection)
    user = graphene.Field(UserType, id=graphene.Int())
    
    # Requêtes pour les organisations
    all_organizations = SQLAlchemyConnectionField(OrganizationType.connection)
    organization = graphene.Field(OrganizationType, id=graphene.Int())
    
    # Requêtes pour les clients
    all_customers = SQLAlchemyConnectionField(CustomerType.connection)
    customer = graphene.Field(CustomerType, id=graphene.Int())
    customers_by_org = graphene.List(CustomerType, org_id=graphene.Int(required=True))
    
    # Requêtes pour les campagnes
    all_campaigns = SQLAlchemyConnectionField(CampaignType.connection)
    campaign = graphene.Field(CampaignType, id=graphene.Int())
    campaigns_by_org = graphene.List(CampaignType, org_id=graphene.Int(required=True))
    
    def resolve_user(self, info, id):
        return db_session.query(User).filter(User.id == id).first()
    
    def resolve_organization(self, info, id):
        return db_session.query(Organization).filter(Organization.id == id).first()
    
    def resolve_customer(self, info, id):
        return db_session.query(Customer).filter(Customer.id == id).first()
    
    def resolve_customers_by_org(self, info, org_id):
        return db_session.query(Customer).filter(Customer.org_id == org_id).all()
    
    def resolve_campaign(self, info, id):
        return db_session.query(Campaign).filter(Campaign.id == id).first()
    
    def resolve_campaigns_by_org(self, info, org_id):
        return db_session.query(Campaign).filter(Campaign.org_id == org_id).all()

# Mutations GraphQL

class CreateCustomer(graphene.Mutation):
    class Arguments:
        org_id = graphene.Int(required=True)
        name = graphene.String(required=True)
        email = graphene.String()
        phone = graphene.String()
        tags = graphene.List(graphene.String)
        metadata = graphene.JSONString()
    
    customer = graphene.Field(lambda: CustomerType)
    
    def mutate(self, info, org_id, name, email=None, phone=None, tags=None, metadata=None):
        customer = Customer(
            org_id=org_id,
            name=name,
            email=email,
            phone=phone,
            tags=json.dumps(tags or []),
            extra_data=json.dumps(metadata or {})
        )
        db_session.add(customer)
        db_session.commit()
        return CreateCustomer(customer=customer)

class UpdateCustomer(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        name = graphene.String()
        email = graphene.String()
        phone = graphene.String()
        tags = graphene.List(graphene.String)
        metadata = graphene.JSONString()
    
    customer = graphene.Field(lambda: CustomerType)
    
    def mutate(self, info, id, name=None, email=None, phone=None, tags=None, metadata=None):
        customer = db_session.query(Customer).filter(Customer.id == id).first()
        if not customer:
            raise Exception("Customer not found")
        
        if name is not None:
            customer.name = name
        if email is not None:
            customer.email = email
        if phone is not None:
            customer.phone = phone
        if tags is not None:
            customer.tags = json.dumps(tags)
        if metadata is not None:
            customer.extra_data = json.dumps(metadata)
        
        customer.updated_at = datetime.utcnow()
        db_session.commit()
        return UpdateCustomer(customer=customer)

class DeleteCustomer(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    
    def mutate(self, info, id):
        customer = db_session.query(Customer).filter(Customer.id == id).first()
        if not customer:
            raise Exception("Customer not found")
        
        db_session.delete(customer)
        db_session.commit()
        return DeleteCustomer(success=True)

class CreateCampaign(graphene.Mutation):
    class Arguments:
        org_id = graphene.Int(required=True)
        title = graphene.String(required=True)
        description = graphene.String()
        campaign_type = graphene.String(required=True)
        target_audience = graphene.List(graphene.String)
        draft_content = graphene.String()
        metadata = graphene.JSONString()
    
    campaign = graphene.Field(lambda: CampaignType)
    
    def mutate(self, info, org_id, title, campaign_type, description=None, target_audience=None, draft_content=None, metadata=None):
        campaign = Campaign(
            org_id=org_id,
            title=title,
            description=description,
            campaign_type=campaign_type,
            target_audience=json.dumps(target_audience or []),
            draft_content=draft_content,
            metadata=json.dumps(metadata or {}),
            status='draft'
        )
        db_session.add(campaign)
        db_session.commit()
        return CreateCampaign(campaign=campaign)

class UpdateCampaign(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
        title = graphene.String()
        description = graphene.String()
        campaign_type = graphene.String()
        target_audience = graphene.List(graphene.String)
        draft_content = graphene.String()
        final_content = graphene.String()
        status = graphene.String()
        metadata = graphene.JSONString()
    
    campaign = graphene.Field(lambda: CampaignType)
    
    def mutate(self, info, id, title=None, description=None, campaign_type=None, 
               target_audience=None, draft_content=None, final_content=None, 
               status=None, metadata=None):
        campaign = db_session.query(Campaign).filter(Campaign.id == id).first()
        if not campaign:
            raise Exception("Campaign not found")
        
        if title is not None:
            campaign.title = title
        if description is not None:
            campaign.description = description
        if campaign_type is not None:
            campaign.campaign_type = campaign_type
        if target_audience is not None:
            campaign.target_audience = json.dumps(target_audience)
        if draft_content is not None:
            campaign.draft_content = draft_content
        if final_content is not None:
            campaign.final_content = final_content
        if status is not None:
            campaign.status = status
        if metadata is not None:
            campaign.metadata = json.dumps(metadata)
        
        campaign.updated_at = datetime.utcnow()
        db_session.commit()
        return UpdateCampaign(campaign=campaign)

class DeleteCampaign(graphene.Mutation):
    class Arguments:
        id = graphene.Int(required=True)
    
    success = graphene.Boolean()
    
    def mutate(self, info, id):
        campaign = db_session.query(Campaign).filter(Campaign.id == id).first()
        if not campaign:
            raise Exception("Campaign not found")
        
        db_session.delete(campaign)
        db_session.commit()
        return DeleteCampaign(success=True)

class Mutation(graphene.ObjectType):
    create_customer = CreateCustomer.Field()
    update_customer = UpdateCustomer.Field()
    delete_customer = DeleteCustomer.Field()
    create_campaign = CreateCampaign.Field()
    update_campaign = UpdateCampaign.Field()
    delete_campaign = DeleteCampaign.Field()

# Schéma GraphQL principal
schema = graphene.Schema(query=Query, mutation=Mutation)

