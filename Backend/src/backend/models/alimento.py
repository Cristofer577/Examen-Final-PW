from datetime import date

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from backend.core.database import Base


class Alimento(Base):
    __tablename__ = "alimentos"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(120), unique=True, index=True)
    cantidad: Mapped[float]
    unidad: Mapped[str] = mapped_column(String(30))
    fecha_ingreso: Mapped[date]
    stock_minimo: Mapped[float]