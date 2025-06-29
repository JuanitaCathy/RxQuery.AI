from mindsdb_conn import run_query
from pandas import DataFrame
import json
import os
from dotenv import load_dotenv 
load_dotenv()

# === Configuration ===
PROJECT = "mindsdb"
KB_NAME = "drug_kb"
SOURCE_TABLE = "files.medicine_details"
OLLAMA_MODEL = "tinydolphin"



# 1. KNOWLEDGE BASE CREATION
# Well, we will create a Knowledge Base with an embedding model and a reranking model with OLLAMA.

def create_kb():
    query = f"""
    CREATE KNOWLEDGE BASE {PROJECT}.{KB_NAME}
    USING
        embedding_model = {{
            "provider": "ollama",
            "model_name": "{OLLAMA_MODEL}",
            "base_url": os.environ.get("OLLAMA_URL", "")
        }},
        reranking_model = {{
            "provider": "ollama",
            "model_name": "{OLLAMA_MODEL}",
            "base_url": os.environ.get("OLLAMA_URL", "")
        }},
        metadata_columns = ["category", "usage"],
        content_columns = ["description"],
        id_column = "drug_name";
    """
    run_query(query)
    print("Yayy we created our Knowledge Base!")


# 2. DATA INGESTION INTO THE KNOWLEDGE BASE
# This function will ingest data from the SOURCE_TABLE into the KB.

def ingest_kb_data(limit: int = 50):
    query = f"""
    INSERT INTO {PROJECT}.{KB_NAME}(drug_name, description, category, usage)
    SELECT * FROM {SOURCE_TABLE}
    LIMIT {limit};
    """
    run_query(query)
    print("Data ingested into KB.")


# 3. EVALUATE THE KNOWLEDGE BASE
# This function will evaluate the KB using a Groq LLM.

def evaluate_kb(run_eval: bool = False):
   
    llm_config = {
        "provider": "openai",
        "api_key": os.environ.get("GROQ_API_KEY", ""),
        "base_url": "https://api.groq.com/openai/v1",
        "model_name": "mixtral-8x7b"
    }

    action = "RUN" if run_eval else "GENERATE"
    query = f"""
    EVALUATE KNOWLEDGE BASE {PROJECT}.{KB_NAME}
    USING llm_config = {json.dumps(llm_config)}
    {action};
    """
    result = run_query(query)
    print("🧪 Evaluation", "run." if run_eval else "dataset generated.")
    return result


# 4. SHOW ALL KNOWLEDGE BASES

def show_kbs():
    return run_query(f"SHOW KNOWLEDGE BASES IN {PROJECT};")


# 5. KNOWLEDGE BASE DESCRIPTION

def describe_kb():
    return run_query(f"DESCRIBE {PROJECT}.{KB_NAME};")


# 6. DELETE THE KNOWLEDGE BASE

def delete_kb():
    run_query(f"DROP KNOWLEDGE BASE {PROJECT}.{KB_NAME};")
    print("Knowledge Base deleted.")


