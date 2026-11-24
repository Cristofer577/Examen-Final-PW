from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.alimento import Alimento
from backend.repositories import alimento as repositorio
from backend.schemas.alimento import AlimentoEntrada


def listar(db: Session) -> list[Alimento]:
    return repositorio.listar(db)


def obtener(db: Session, alimento_id: int) -> Alimento:
    alimento = repositorio.obtener(db, alimento_id)
    if alimento is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Alimento no encontrado")
    return alimento


def crear(db: Session, datos: AlimentoEntrada) -> Alimento:
    if repositorio.obtener_por_nombre(db, datos.nombre):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe un alimento con ese nombre")
    return repositorio.crear(db, datos.model_dump())


def actualizar(db: Session, alimento_id: int, datos: AlimentoEntrada) -> Alimento:
    alimento = obtener(db, alimento_id)
    otro = repositorio.obtener_por_nombre(db, datos.nombre)
    if otro and otro.id != alimento_id:
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe un alimento con ese nombre")
    return repositorio.actualizar(db, alimento, datos.model_dump())


def eliminar(db: Session, alimento_id: int) -> None:
    alimento = obtener(db, alimento_id)
    repositorio.eliminar(db, alimento)