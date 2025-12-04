import json
from pathlib import Path

def load_json(path: str):
    file_path = Path(path)
    if not file_path.exists():
        raise FileNotFoundError(f"JSON file not found: {path}")
    with open(file_path, "r") as f:
        return json.load(f)
