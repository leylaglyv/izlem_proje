import os
import re

env_path = r"c:\Ampps\www\proje\backend\.env"

def brute_force_fix():
    print(f"Reading {env_path}...")
    try:
        with open(env_path, 'rb') as f:
            raw_data = f.read()
    except FileNotFoundError:
        print("File not found.")
        return

    # Search for AIza pattern in bytes
    # AIza characters are ASCII, so regex on bytes works
    match = re.search(b'(AIza[a-zA-Z0-9_\-]+)', raw_data)
    
    if match:
        api_key_bytes = match.group(1)
        api_key = api_key_bytes.decode('utf-8', errors='ignore')
        print(f"Found API Key: {api_key[:5]}...")
        
        # Write clean .env
        new_content = f"GOOGLE_API_KEY={api_key}"
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully rewrote .env with GOOGLE_API_KEY")
    else:
        print("CRITICAL: No API Key pattern (AIza...) found in BYTES.")
        # Debug: Print hex of first 20 bytes
        print(f"Hex dump head: {raw_data[:20].hex()}")

if __name__ == "__main__":
    brute_force_fix()
