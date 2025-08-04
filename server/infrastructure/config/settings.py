"""
Application settings module.

Defines configuration settings loaded from environment variables, including API keys.
"""

from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    """
    Application configuration settings.

    Attributes:
        allowed_origins (List[str]): List of allowed CORS origins for the API.
            Defaults to ["https://chatgpt.com"].
        OPENAI_API_KEY = (str): API key used to authenticate with OpenAI services.

    Configuration:
        Loads environment variables from a ".env" file with UTF-8 encoding.
    """
    allowed_origins: List[str] = ["https://chatgpt.com"]
    OPENAI_API_KEY: str

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

# Singleton settings instance that is imported to main.py and stored on application.state.config.
settings = Settings()
