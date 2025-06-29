from mindsdb_conn import run_query

if __name__ == "__main__":
    # Example query to test the connection
    query = """
        SHOW AGENTS;
    """
    
    try:
        result = run_query(query)
        print(result)
    except Exception as e:
        print(f"An error occurred: {e}")
