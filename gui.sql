--This is the reference MindsDB code if you want to replicate it and work with it!
-- The actual implementation of these can be found in `/backend` files

-- CREATE KNOWLEDGE_BASE

CREATE KNOWLEDGE_BASE drug_kb
USING
    embedding_model = {
        "provider": "ollama",
        "model_name": "tinydolphin",
        "base_url": "{{OLLAMA_URL}}"
    },
    reranking_model = {
        "provider": "ollama",
        "model_name": "tinydolphin",
        "base_url": "{{OLLAMA_URL}}"
    },
    metadata_columns = ['category', 'usage'],
    content_columns = ['description'],
    id_column = 'drug_name';

SHOW KNOWLEDGE BASES;

-- INGESTION OF DATA

INSERT INTO drug_kb (drug_name, description, category, usage)
SELECT drug_name, description, category, usage
FROM files.medicine_details
LIMIT 50;

-- SEMANTICS
SELECT * 
FROM drug_kb
WHERE content LIKE 'what drug to use for Fever and Headaches category?';


-- CHAINED AGENTS

-- 1. Classify agent
DROP AGENT IF EXISTS classify_agent;
CREATE AGENT classify_agent
USING
    input_column = 'question',
    output_column = 'response',
    prompt_template = 
    'Classify the query "{{question}}" into a drug category like Antibiotic, Antipyretic etc.';

-- TESTING
SELECT * FROM classify_agent WHERE
question = 'I have a fever and headache';

-- 2. Recommender agent
CREATE AGENT drug_recommender
USING
    input_column = 'question',
    output_column = 'recommendation',
    metadata_columns = ['category'],
    prompt_template = 
    'Based on drugs in category "{{category}}", what should user take for: {{question}}?';

-- 3. side effect agent
CREATE AGENT side_effect_agent
USING
    input_column = 'recommendation',
    output_column = 'side_effects',
    prompt_template = 
    'what are the common side effects of the drug "{{recommendation}}" ?';

-- 4. allergy agent
CREATE AGENT allergy_safe_recommender
USING
    input_column = 'allergy',
    output_column = 'safe_drug',
    prompt_template = 
    'Given the allergy: "{{allergy}}", recommend a safe drug that avoids triggering it. Also explain why it is suitable shortly.';

SHOW AGENTS;

SHOW PROJECTS;

-- AI TABLES
DROP MODEL IF EXISTS rx_assistant;

CREATE MODEL rx_assistant
PREDICT response
USING
    engine = 'openai',
    model_name = 'text-embedding-ada-002',
    openai_api_key = '{{OPENAI_API_KEY}}',
    prompt_template = 
        'You are a helpful drug information assistant. If a user inputs a user query "{{question}}" and allergy "{{allergy}}", return helpful medicine suggestions related to that or, if it is a general medical query, answer generally.'
;

-- TEST
SELECT response
FROM rx_assistant
WHERE question = 'I have a fever and body ache'
  AND allergy = 'penicillin';


SELECT error FROM information_schema.models WHERE name = 'rx_assistant';


-- JOBS

CREATE JOB drug_kb_updater AS (
    INSERT INTO drug_kb (drug_name, description, category, usage)
    SELECT drug_name, description, category, usage
    FROM files.medicine_details
    WHERE id > COALESCE(LAST, 0)
)
EVERY 1 hour;

-- Evaluate Knowledge Base
 
Checkout the `/backend/knowledge_base.py` for evaluation code~
