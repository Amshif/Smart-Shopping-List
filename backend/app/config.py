from pydantic_settings import BaseSettings,SettingsConfigDict

class Settings(BaseSettings):
    db_engine: str
    db_port: str
    db_host: str
    db_user: str
    db_password: str
    db_name: str
    api_key: str
    # mail_username: str
    # mail_password: str
    # mail_from: str
    # mail_port: int = 587
    # mail_server: str = "smtp.gmail.com"
    # mail_from_name: str = "Booking System"

    model_config = SettingsConfigDict(env_file='.env', env_file_encoding='utf-8')

APP_CONFIG = dict(
    title="Smart Shopping List",
    description="API for managing a smart shopping list application.",
    version="1.0.0"
)

 