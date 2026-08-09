import subprocess, time, requests, sys

# Start backend
proc = subprocess.Popen(
    [sys.executable, 'main.py'],
    cwd=r'C:\Users\josh-\Desktop\NorthStar Knowledge OS prototyp\backend',
    stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True
)
time.sleep(4)

# Hit login
try:
    r = requests.post('http://localhost:8000/api/auth/login',
        json={'name': 'Elena Rodriguez', 'role': 'Employee'})
    print(f'Login: {r.status_code} {r.text[:200]}')
except Exception as e:
    print(f'Login error: {e}')

# Also hit health
try:
    r = requests.get('http://localhost:8000/api/health')
    print(f'Health: {r.status_code} {r.text}')
except Exception as e:
    print(f'Health error: {e}')

# Print backend output
print('\n--- Backend stdout/stderr ---')
proc.terminate()
out = proc.stdout.read()
print(out[:3000] if out else '(no output)')
