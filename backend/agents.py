from mindsdb_conn import run_query

def setup_agents():
    queries = [
        # 1. Classify Agent
        "DROP AGENT IF EXISTS classify_agent;",
        """
        CREATE AGENT classify_agent
        USING
            input_column = 'question',
            output_column = 'response',
            prompt_template = 
            'Classify the query "{{question}}" into a drug category like Antibiotic, Antipyretic etc.';
        """,
        # 2. Recommender Agent
        """
        CREATE AGENT drug_recommender
        USING
            input_column = 'question',
            output_column = 'recommendation',
            metadata_columns = ['category'],
            prompt_template = 
            'Based on drugs in category "{{category}}", what should user take for: {{question}}?';
        """,
        # 3. Side Effect Agent
        """
        CREATE AGENT side_effect_agent
        USING
            input_column = 'recommendation',
            output_column = 'side_effects',
            prompt_template = 
            'what are the common side effects of the drug "{{recommendation}}" ?';
        """,
        # 4. Allergy Safe Agent
        """
        CREATE AGENT allergy_safe_recommender
        USING
            input_column = 'allergy',
            output_column = 'safe_drug',
            prompt_template = 
            'Given the allergy: "{{allergy}}", recommend a safe drug that avoids triggering it. Also explain why it is suitable shortly.';
        """
    ]
    for q in queries:
        run_query(q)
    print("✅ All agents created.")

def show_agents():
    return run_query("SHOW AGENTS;")
