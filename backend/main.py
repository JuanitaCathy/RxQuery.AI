from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from mindsdb_conn import run_query
import pandas as pd

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GeneralQuery(BaseModel):
    question: str
    allergy: str = ""

class AgentQuery(BaseModel):
    agent: str
    inputs: dict


def find_best_match(query, response_dict):
    """Find best matching response for a query"""
    query_lower = query.lower()
    
    # Exact match
    if query_lower in response_dict:
        return response_dict[query_lower]
    
    # Partial match
    for key, value in response_dict.items():
        if key in query_lower or query_lower in key:
            return value
    
    return None

@app.get("/")
def read_root():
    return {"message": "RxQuery Backend is running!"}

@app.get("/health")
def health_check():
    try:
        result = run_query("SHOW TABLES;")
        return {"status": "healthy", "mindsdb_connected": True}
    except Exception as e:
        return {"status": "degraded", "mindsdb_connected": False, "using_fallback": True}

@app.post("/query")
def query_rx_assistant(data: GeneralQuery):
    try:
        question_escaped = data.question.replace("'", "''")
        allergy_escaped = data.allergy.replace("'", "''")
        
        query = f"""
            SELECT response
            FROM rx_assistant
            WHERE question = '{question_escaped}' AND allergy = '{allergy_escaped}';
        """
        print(f"Executing query: {query}")
        result = run_query(query)
        
        if not result.empty and 'response' in result.columns:
            return {"response": result["response"].iloc[0]}
        
    except Exception as e:
        print(f"MindsDB failed: {e}")
    

@app.post("/query-agent")
def query_agent(data: AgentQuery):
    try:
        print(f"Agent request: {data.agent}, inputs: {data.inputs}")
        
        # Extract the main query/question
        question = data.inputs.get("question", data.inputs.get("query", data.inputs.get("recommendation", data.inputs.get("allergy", ""))))
        
        # Try MindsDB first
        agent_mapping = {
            "classify_agent": "classify_agent",
            "recommend_agent": "drug_recommender", 
            "side_effects_agent": "side_effect_agent",
            "allergy_agent": "allergy_safe_recommender"
        }
        
        actual_agent = agent_mapping.get(data.agent, data.agent)
        
        try:
            if data.agent == "classify_agent":
                query = f"SELECT response FROM {actual_agent} WHERE question = '{question}';"
                result = run_query(query)
                if not result.empty:
                    return result.to_dict(orient="records")[0]
        except Exception as e:
            print(f"MindsDB agent failed: {e}")
        
            
    except Exception as e:
        print(f"Error in query_agent: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Agent query error: {str(e)}")