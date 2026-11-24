from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.beneficiario import Beneficiario


def listar(db: Session) -> list[Beneficiario]:
    return list(db.scalars(select(Beneficiario).order_by(Beneficiario.id)))


def obtener(db: Session, beneficiario_id: int) -> Beneficiario | None:
    return db.get(Beneficiario, beneficiario_id)


def obtener_por_dni(db: Session, dni: str) -> Beneficiario | None:
    return db.scalar(select(Beneficiario).where(Beneficiario.dni == dni))


def crear(db: Session, datos: dict) -> Beneficiario:
    beneficiario = Beneficiario(**datos)
    db.add(beneficiario)
    db.commit()
    db.refresh(beneficiario)
    return beneficiario


def actualizar(db: Session, beneficiario: Beneficiario, datos: dict) -> Beneficiario:
    for campo, valor in datos.items():
        setattr(beneficiario, campo, valor)
    db.commit()
    db.refresh(beneficiario)
    return beneficiario


def eliminar(db: Session, beneficiario: Beneficiario) -> None:
    db.delete(beneficiario)
    db.commit()