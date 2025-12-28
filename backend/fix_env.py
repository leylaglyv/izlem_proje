import os

env_path = r"c:\Ampps\www\proje\backend\.env"

def fix_encoding():
    content = ""
    try:
        # Try reading as UTF-16 (common culprit for 0xff 0xfe BOM)
        with open(env_path, 'r', encoding='utf-16') as f:
            content = f.read()
        print(f"Successfully read .env as UTF-16. Content length: {len(content)}")
    except Exception as e:
        print(f"Failed to read as UTF-16: {e}")
        try:
             # Fallback to binary read to debug or recover
            with open(env_path, 'rb') as f:
                raw_data = f.read()
            print(f"Raw bytes: {raw_data[:10]}...")
            # Try decoding with ignore to salvage
            content = raw_data.decode('utf-16', errors='ignore')
            print("Decoded binaries with utf-16 ignoring errors.")
        except Exception as e2:
             print(f"Critial failure reading .env: {e2}")
             return

    # Write back as clean UTF-8 (no BOM)
    if content:
        try:
            with open(env_path, 'w', encoding='utf-8') as f:
                f.write(content.strip())
            print("Successfully saved .env as UTF-8.")
        except Exception as e:
            print(f"Failed to write .env: {e}")

if __name__ == "__main__":
    fix_encoding()
