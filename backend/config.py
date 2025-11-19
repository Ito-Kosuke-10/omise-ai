from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path

# .envファイルのパスを取得
env_path = Path(__file__).parent / ".env"

class Settings(BaseSettings):
    database_url: str = "sqlite:///./omise_ai.db"
    frontend_url: str = "http://localhost:3000"
    
    model_config = SettingsConfigDict(
        env_file=str(env_path),
        env_file_encoding="utf-8-sig",  # BOMを自動的に処理
        case_sensitive=False,
        env_ignore_empty=True,
        extra="ignore"  # 余分なフィールドを無視
    )

settings = Settings()

