from mindsdb_conn import run_query

def test_agents():
    print("Testing MindsDB agents...")
    
    # 1. Check if agents exist
    try:
        agents = run_query("SHOW AGENTS;")
        print("Available agents:")
        print(agents)
        print()
    except Exception as e:
        print(f"Error showing agents: {e}")
        return
    
    # 2. Test classify_agent
    try:
        print("Testing classify_agent...")
        result = run_query("SELECT response FROM classify_agent WHERE question = 'paracetamol';")
        print(f"Classify result: {result}")
        print()
    except Exception as e:
        print(f"Error with classify_agent: {e}")
    
    # 3. Test drug_recommender
    try:
        print("Testing drug_recommender...")
        result = run_query("SELECT recommendation FROM drug_recommender WHERE question = 'fever' AND category = 'General';")
        print(f"Recommender result: {result}")
        print()
    except Exception as e:
        print(f"Error with drug_recommender: {e}")

if __name__ == "__main__":
    test_agents()