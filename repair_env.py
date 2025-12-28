import os

def repair_env():
    env_path = '.env'
    if not os.path.exists(env_path):
        print("No .env file found.")
        return

    with open(env_path, 'rb') as f:
        content = f.read()
    
    # Try decoding as utf-8, if fails, it might be utf-16
    try:
        text = content.decode('utf-8')
    except UnicodeDecodeError:
        try:
            text = content.decode('utf-16')
        except UnicodeDecodeError:
            print("Unknown encoding.")
            return

    # Clean up lines
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    
    # Add teacher credentials if missing or update them
    new_lines = []
    google_key_found = False
    
    for line in lines:
        if line.startswith('GOOGLE_API_KEY='):
            new_lines.append(line)
            google_key_found = True
        elif line.startswith('TEACHER_USERNAME='):
            continue
        elif line.startswith('TEACHER_PASSWORD='):
            continue
        else:
            new_lines.append(line)
            
    if not google_key_found:
        print("Warning: GOOGLE_API_KEY not found in .env")
        
    new_lines.append("TEACHER_USERNAME=ogretmen")
    new_lines.append("TEACHER_PASSWORD=gbb123")
    
    with open(env_path, 'w', encoding='utf-8', newline='\n') as f:
        f.write('\n'.join(new_lines) + '\n')
    
    print("Repaired .env file successfully.")

if __name__ == "__main__":
    repair_env()
