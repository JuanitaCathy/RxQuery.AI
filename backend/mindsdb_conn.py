from mindsdb_sdk import connect
from pandas import DataFrame

server = connect('http://127.0.0.1:47334')

def run_query(query: str) -> DataFrame:
    result = server.query(query).fetch()
    return result