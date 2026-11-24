from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.models.alimento import Alimento


def listar(db: Session) -> list[Alimento]:
    return list(db.scalars(select(Alimento).order_by(Alimento.id)))


def obtener(db: Session, alimento_id: int) -> Alimento | None:
    return db.get(Alimento, alimento_id)


def obtener_por_nombre(db: Session, nombre: str) -> Alimento | None:
    return db.scalar(select(Alimento).where(func.lower(Alimento.nombre) == nombre.lower()))


def crear(db: Session, datos: dict) -> Alimento:
    alimento = Alimento(**datos)
    db.add(alimento)
    db.commit()
    db.refresh(alimento)
    return alimento


def actualizar(db: Session, alimento: Alimento, datos: dict) -> Alimento:
    for campo, valor in datos.items():
        setattr(alimento, campo, valor)
    db.commit()
    db.refresh(alimento)
    return alimento


def eliminar(db: Session, alimento: Alimento) -> None:
    db.delete(alimento)
    db.commit()