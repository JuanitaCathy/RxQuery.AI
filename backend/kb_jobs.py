from mindsdb_conn import run_query

PROJECT = "mindsdb"
KB_NAME = "drug_kb"
SOURCE_TABLE = "files.medicine_details"

def create_kb_updater_job():
    query = f"""
    CREATE JOB drug_kb_updater AS (
        INSERT INTO drug_kb (drug_name, description, category, usage)
        SELECT drug_name, description, category, usage
        FROM files.medicine_details
        WHERE id > COALESCE(LAST, 0)
    )
    EVERY 1 hour;
    """
    run_query(query)
    print("JOB CREATED. KB WILL UPDATE EVERY DAY.")

def delete_kb_updater_job():
    query = f"""
    DROP JOB IF EXISTS drug_kb_updater;
    """
    run_query(query)
    print("JOB DELETED. KB WILL NOT UPDATE.")

def show_kb_updater_job():
    query = f"""
    SHOW JOBS;
    """
    result = run_query(query)
    print(result)