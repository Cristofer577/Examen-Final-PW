from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.models.beneficiario import Beneficiario
from backend.repositories import beneficiario as repositorio
from backend.schemas.beneficiario import BeneficiarioEntrada


def listar(db: Session) -> list[Beneficiario]:
    return repositorio.listar(db)


def obtener(db: Session, beneficiario_id: int) -> Beneficiario:
    beneficiario = repositorio.obtener(db, beneficiario_id)
    if beneficiario is None:
        raise HTTPException(status.HTTP_404_NOT_FOUND, "Beneficiario no encontrado")
    return beneficiario


def crear(db: Session, datos: BeneficiarioEntrada) -> Beneficiario:
    if repositorio.obtener_por_dni(db, datos.dni):
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe un beneficiario con ese DNI")
    return repositorio.crear(db, datos.model_dump())


def actualizar(db: Session, beneficiario_id: int, datos: BeneficiarioEntrada) -> Beneficiario:
    beneficiario = obtener(db, beneficiario_id)
    otro = repositorio.obtener_por_dni(db, datos.dni)
    if otro and otro.id != beneficiario_id:
        raise HTTPException(status.HTTP_409_CONFLICT, "Ya existe un beneficiario con ese DNI")
    return repositorio.actualizar(db, beneficiario, datos.model_dump())


def eliminar(db: Session, beneficiario_id: int) -> None:
    beneficiario = obtener(db, beneficiario_id)
    repositorio.eliminar(db, beneficiario)