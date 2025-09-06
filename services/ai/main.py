from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
import os
import google.generativeai as genai

app = FastAPI(title="AI4Local AI Service", version="1.0.0")

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configuration de l'API Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set.")
genai.configure(api_key=GEMINI_API_KEY)

# Modèles Pydantic pour les requêtes
class TextGenerationRequest(BaseModel):
    prompt: str
    template: Optional[str] = None
    max_tokens: Optional[int] = 150
    temperature: Optional[float] = 0.7

class EmbeddingRequest(BaseModel):
    texts: List[str]

class SemanticSearchRequest(BaseModel):
    query: str
    topK: Optional[int] = 5

class TextGenerationResponse(BaseModel):
    generated_text: str
    model_used: str

class EmbeddingResponse(BaseModel):
    embeddings: List[List[float]]
    model_used: str

class SemanticSearchResponse(BaseModel):
    results: List[dict]
    query: str

@app.get("/")
async def root():
    return {"message": "AI4Local AI Service", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "ai"}

@app.post("/generate-text", response_model=TextGenerationResponse)
async def generate_text(request: TextGenerationRequest):
    """
    Génère du texte basé sur un prompt et un template optionnel en utilisant Gemini.
    """
    try:
        model = genai.GenerativeModel("gemini-2.5-flash-lite")

        if request.template:
            full_prompt = request.template.replace("{prompt}", request.prompt)
        else:
            full_prompt = request.prompt

        generation_config = {
            "max_output_tokens": request.max_tokens,
            "temperature": request.temperature,
        }

        response = model.generate_content(
            full_prompt,
            generation_config=generation_config
        )
        
        generated_text = response.text

        return TextGenerationResponse(
            generated_text=generated_text,
            model_used="gemini-2.5-flash-lite"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la génération: {str(e)}")

@app.post("/embed", response_model=EmbeddingResponse)
async def create_embeddings(request: EmbeddingRequest):
    """
    Crée des embeddings pour une liste de textes en utilisant Gemini.
    """
    try:
        embeddings = []
        for text in request.texts:
            response = genai.embed_content(
                model="models/embedding-001",
                content=text,
                task_type="retrieval_document"
            )
            embeddings.append(response["embedding"])
            
        return EmbeddingResponse(
            embeddings=embeddings,
            model_used="models/embedding-001"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la création d'embeddings: {str(e)}")

@app.post("/semantic-search", response_model=SemanticSearchResponse)
async def semantic_search(request: SemanticSearchRequest):
    """
    Effectue une recherche sémantique basée sur une requête en utilisant Gemini pour l'embedding.
    Pour le MVP, la recherche est simulée après l'embedding.
    """
    try:
        # Créer l'embedding de la requête
        query_embedding_response = genai.embed_content(
            model="models/embedding-001",
            content=request.query,
            task_type="retrieval_query"
        )
        query_embedding = query_embedding_response["embedding"]

        # Simulation de recherche sémantique (à remplacer par une vraie DB vectorielle comme Weaviate)
        # Pour cette démo, nous allons juste simuler des résultats pertinents
        mock_results = [
            {
                "id": "doc_1",
                "content": f"Document pertinent pour \'{request.query}\' - Résultat 1",
                "score": 0.95,
                "metadata": {"source": "knowledge_base", "category": "marketing"}
            },
            {
                "id": "doc_2", 
                "content": f"Information liée à \'{request.query}\' - Résultat 2",
                "score": 0.87,
                "metadata": {"source": "templates", "category": "content"}
            },
            {
                "id": "doc_3",
                "content": f"Contenu associé à \'{request.query}\' - Résultat 3", 
                "score": 0.76,
                "metadata": {"source": "examples", "category": "campaigns"}
            }
        ]
        
        # Retourner seulement le nombre demandé de résultats
        results = mock_results[:request.topK]
        
        return SemanticSearchResponse(
            results=results,
            query=request.query
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur lors de la recherche sémantique: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)


