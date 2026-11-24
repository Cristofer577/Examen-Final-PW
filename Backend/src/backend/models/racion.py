from datetime import date

from sqlalchemy import ForeignKey, UniqueConstraint
from sqlalchemy.orm import Mapped, backref, mapped_column, relationship

from backend.core.database import Base
from backend.models.beneficiario import Beneficiario


class RegistroRacion(Base):
    __tablename__ = "registros_racion"
    __table_args__ = (UniqueConstraint("fecha", "beneficiario_id"),)

    id: Mapped[int] = mapped_column(primary_key=True)
    fecha: Mapped[date] = mapped_column(index=True)
    beneficiario_id: Mapped[int] = mapped_column(ForeignKey("beneficiarios.id"))
    raciones: Mapped[int]
    entregado: Mapped[bool] = mapped_column(default=False)

    beneficiario: Mapped[Beneficiario] = relationship(
        backref=backref("registros", cascade="all, delete-orphan")
    )