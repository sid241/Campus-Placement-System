import urllib.request
import json

data = json.dumps({
    'username': 'testuser10',
    'password': 'password123',
    'email': 'test@test.com',
    'first_name': 'Test',
    'last_name': 'User',
    'major': 'CS'
}).encode('utf-8')

req = urllib.request.Request('http://localhost:8000/api/auth/register/student/', data=data, headers={'Content-Type': 'application/json'})

try:
    urllib.request.urlopen(req)
    print("Success")
except urllib.error.HTTPError as e:
    print(f"HTTPError: {e.code}")
    print(e.read().decode('utf-8'))
