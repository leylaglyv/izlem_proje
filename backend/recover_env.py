import os
import re

env_path = r"c:\Ampps\www\proje\backend\.env"

def recover_env():
    print(f"Reading {env_path}...")
    try:
        # Read the current "Chinese" garbage as UTF-8
        with open(env_path, 'r', encoding='utf-8') as f:
            corrupted_content = f.read()
    except Exception as e:
        print(f"Read error: {e}")
        return

    print(f"Corrupted length (chars): {len(corrupted_content)}")
    
    try:
        # Reverse the damage: 
        # The chars are what you get when you decode ASCII bytes as UTF-16LE.
        # So encode back to UTF-16LE to get the original bytes.
        original_bytes = corrupted_content.encode('utf-16le')
        print(f"Recovered bytes: {original_bytes[:20]}")
        
        # Now decode as proper UTF-8/ASCII
        real_text = original_bytes.decode('utf-8')
        print(f"Recovered text: {real_text[:50]}...")
        
        # Now fix the variable name if needed
        # Expected: GEMINI_API_KEY=AIza...
        # We need: GOOGLE_API_KEY=AIza...
        
        match = re.search(r'(AIza[a-zA-Z0-9_\-]+)', real_text)
        if match:
            api_key = match.group(1)
            new_content = f"GOOGLE_API_KEY={api_key}"
            
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print("Successfully recovered and fixed .env!")
        else:
            print("Could not find key in recovered text.")
            
    except Exception as e2:
        print(f"Recovery failed: {e2}")

if __name__ == "__main__":
    recover_env()
