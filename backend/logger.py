import logging
import sys
from logging.handlers import RotatingFileHandler
import os

# Create logs directory if it doesn't exist
log_dir = os.path.join(os.path.dirname(__file__), "logs")
os.makedirs(log_dir, exist_ok=True)

log_file_path = os.path.join(log_dir, "backend_debug.log")

def verify_log_dir_access():
    try:
        with open(os.path.join(log_dir, "test_write.txt"), "w") as f:
            f.write("test")
        os.remove(os.path.join(log_dir, "test_write.txt"))
        return True
    except Exception as e:
        print(f"CRITICAL: Cannot write to log directory: {e}")
        return False

# Configure logging
def setup_logger(name="backend_logger"):
    verify_log_dir_access()
    
    logger = logging.getLogger(name)
    logger.setLevel(logging.DEBUG)

    # Avoid adding handlers multiple times if function is called repeatedly
    if not logger.handlers:
        # File Handler (Rotating)
        try:
            file_handler = RotatingFileHandler(
                log_file_path, maxBytes=5*1024*1024, backupCount=3, encoding='utf-8'
            )
            file_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s'
            )
            file_handler.setFormatter(file_formatter)
            logger.addHandler(file_handler)
        except Exception as e:
            print(f"Failed to setup file handler: {e}")

        # Console Handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_formatter = logging.Formatter(
            '%(asctime)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_formatter)
        logger.addHandler(console_handler)

    return logger

logger = setup_logger()
