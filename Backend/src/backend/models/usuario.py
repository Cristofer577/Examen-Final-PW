from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120))
    usuario: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    clave_encriptada: Mapped[str] = mapped_column(String(255))
    rol: Mapped[str] = mapped_column(String(50))
    activo: Mapped[bool] = mapped_column(default=True)