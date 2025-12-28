import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.getcwd(), '.env')
load_dotenv(dotenv_path)

print(f"Loading from: {dotenv_path}")
print(f"TEACHER_USERNAME: '{os.getenv('TEACHER_USERNAME')}'")
print(f"TEACHER_PASSWORD: '{os.getenv('TEACHER_PASSWORD')}'")
