from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    database_url: str = "sqlite:///./comedor.db"
    secret_key: str = "clave-solo-para-desarrollo"
    algorithm: str = "HS256"
    token_minutos: int = 480
    meta_diaria: int = 180
    origenes_permitidos: list[str] = ["http://localhost:4200"]

    model_config = SettingsConfigDict(env_file=".env")


settings = Settings()