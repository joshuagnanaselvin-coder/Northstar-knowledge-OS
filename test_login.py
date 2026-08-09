import sys, os
os.chdir(r'C:\Users\josh-\Desktop\NorthStar Knowledge OS prototyp\backend')
sys.path.insert(0, '.')

from main import app
from fastapi.testclient import TestClient
import traceback

client = TestClient(app)

# Try login and catch full error
try:
    resp = client.post('/api/auth/login', json={'name': 'Elena Rodriguez', 'role': 'Employee'})
    print(f'Status: {resp.status_code}')
    print(f'Body: {resp.text}')
except Exception as e:
    traceback.print_exc()

# Also try health
try:
    r = client.get('/api/health')
    print(f'Health: {r.status_code} {r.text}')
except Exception as e:
    print(f'Health failed: {e}')

# Try users list
try:
    r = client.get('/api/auth/users')
    print(f'Users: {r.status_code}')
except Exception as e:
    print(f'Users failed: {e}')
    traceback.print_exc()
