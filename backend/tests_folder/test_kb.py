from knowledge_base import ( create_kb,ingest_kb_data, evaluate_kb, show_kbs, describe_kb)

create_kb()
ingest_kb_data()
evaluate_kb(run_eval=False)
print(show_kbs())
print(describe_kb())