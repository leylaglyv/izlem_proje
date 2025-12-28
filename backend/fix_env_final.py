import os
import re

env_path = r"c:\Ampps\www\proje\backend\.env"

def fix_env_content():
    content = ""
    # Try reading binary to ignore encoding mess initially
    with open(env_path, 'rb') as f:
        raw_data = f.read()
    
    print(f"Raw bytes length: {len(raw_data)}")
    
    # Try decoding
    try:
        content = raw_data.decode('utf-8')
    except:
        try:
            content = raw_data.decode('utf-16')
        except:
            content = raw_data.decode('utf-8', errors='ignore')

    print(f"Read content: {content[:50]}...")

    # Extract Key
    # Look for anything looking like an API Key (AIza...)
    match = re.search(r'(AIza[a-zA-Z0-9_\-]+)', content)
    
    if match:
        api_key = match.group(1)
        print(f"Found API Key: {api_key[:5]}...")
        
        # Write clean .env
        new_content = f"GOOGLE_API_KEY={api_key}"
        with open(env_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print("Successfully rewrote .env with GOOGLE_API_KEY")
    else:
        print("CRITICAL: No API Key pattern (AIza...) found in file content.")
        # Attempt to see if it's just variable name mismatch without 'AIza' pattern (unlikely for google but possible if masked)
        # Just Dump content for debug if failing
        print(f"Full content dump: {content}")

if __name__ == "__main__":
    fix_env_content()
