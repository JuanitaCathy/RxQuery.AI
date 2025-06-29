from agents import (
    query_allergy_safe_recommender,
    query_classify_agent,   
    query_drug_recommender,
    query_side_effect_agent
)
from mindsdb_conn import run_query

print(run_query("""
    SELECT * FROM mindsdb.agents;
"""))

def test_all():
    print("Testing classify_agent...")
    result_1 = query_classify_agent("I have fever and headache. What type of drug to use?")
    print(f"Classify Agent Output: {result_1}")
    print("Testing drug_recommender...")
    result_2 = print(query_drug_recommender("fever treatment", "antipyretic"))
    print(f"Drug Recommender Output: {result_2}")
    print("Testing side_effect_agent...")
    result_3 = print(query_side_effect_agent("Paracetamol"))
    print(f"Side Effect Agent Output: {result_3}")
    print("Testing allergy_safe_recommender...")
    result_4 = print(query_allergy_safe_recommender("Penicillin"))
    print(f"Allergy Safe Recommender Output: {result_4}")

    if __name__ == "__main__":
        test_all()
