from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Beneficiario(Base):
    __tablename__ = "beneficiarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(150))
    categoria: Mapped[str] = mapped_column(String(50))
    dni: Mapped[str] = mapped_column(String(8), unique=True, index=True)
    edad: Mapped[int]
    telefono: Mapped[str] = mapped_column(String(15), default="") 
    raciones: Mapped[int] = mapped_column(default=1)