import requests
import json

BASE_URL = "http://localhost:8000"

def test_general_query():
    print("Testing general query...")
    data = {
        "question": "What should I take for headache?",
        "allergy": ""
    }
    response = requests.post(f"{BASE_URL}/query", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response text: {response.text}")  # Show raw response
    if response.status_code == 200:
        print(f"Response JSON: {response.json()}")
    print()

def test_classify_agent():
    print("Testing classify agent...")
    data = {
        "agent": "classify_agent",
        "inputs": {
            "question": "paracetamol"
        }
    }
    response = requests.post(f"{BASE_URL}/query-agent", json=data)
    print(f"Status: {response.status_code}")
    print(f"Response text: {response.text}")  # Show raw response
    if response.status_code == 200:
        print(f"Response JSON: {response.json()}")
    print()

# Add health check
def test_health():
    print("Testing health endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        print()
    except Exception as e:
        print(f"Health check failed: {e}")

if __name__ == "__main__":
    try:
        # Test if server is running
        response = requests.get(f"{BASE_URL}/docs")
        print("✅ Backend server is running!")
        print()
        
        # Test health first
        test_health()
        
        # Run tests
        test_general_query()
        test_classify_agent()
        
    except requests.exceptions.ConnectionError:
        print("❌ Backend server is not running!")
        print("Start it with: uvicorn main:app --reload --port 8000")