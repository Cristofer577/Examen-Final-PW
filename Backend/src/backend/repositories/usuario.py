from sqlalchemy import func, select
from sqlalchemy.orm import Session

from backend.models.usuario import Usuario


def obtener(db: Session, usuario_id: int) -> Usuario | None:
    return db.get(Usuario, usuario_id)


def obtener_por_usuario(db: Session, usuario: str) -> Usuario | None:
    return db.scalar(select(Usuario).where(func.lower(Usuario.usuario) == usuario.lower()))


def contar(db: Session) -> int:
    return db.scalar(select(func.count()).select_from(Usuario)) or 0


def crear(db: Session, datos: dict) -> Usuario:
    usuario = Usuario(**datos)
    db.add(usuario)
    db.commit()
    db.refresh(usuario)
    return usuario