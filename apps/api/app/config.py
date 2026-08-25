from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    google_cloud_project: str = ""
    google_cloud_region: str = ""

    alloydb_host: str = ""
    alloydb_port: int = 5432
    alloydb_database: str = ""
    alloydb_user: str = ""
    alloydb_password: str = ""

    firebase_project_id: str = ""

    vertex_ai_project: str = ""
    vertex_ai_location: str = ""

    frontend_url: str = "http://localhost:3000"

    @property
    def cors_origins(self) -> list[str]:
        return [self.frontend_url]

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
