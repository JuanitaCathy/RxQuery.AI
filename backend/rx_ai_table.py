from mindsdb_conn import run_query
import os
from dotenv import load_dotenv 
load_dotenv()
def create_rx_ai_table():
    query = """
    DROP MODEL IF EXISTS rx_assistant;
    CREATE MODEL rx_assistant
    PREDICT response
    USING
        engine = 'openai',
        model_name = 'text-embedding-ada-002',
        openai_api_key = os.environ.get("OPENAI_API_KEY", ""),
        prompt_template = 
            'You are a helpful drug information assistant. If a user inputs a user query "{{question}}" and allergy "{{allergy}}", return helpful medicine suggestions related to that or, if it is a general medical query, answer generally.'
    ;
    """
    run_query(query)
    print("AI Table created successfully.")