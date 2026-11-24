from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.beneficiario import BeneficiarioEntrada, BeneficiarioSalida
from backend.services import beneficiario as servicio

router = APIRouter(prefix="/beneficiarios", tags=["Beneficiarios"])


@router.get("", response_model=list[BeneficiarioSalida], summary="Listar beneficiarios")
def listar(db: Session = Depends(get_db)):
    return servicio.listar(db)


@router.get("/{beneficiario_id}", response_model=BeneficiarioSalida, summary="Ver un beneficiario")
def obtener(beneficiario_id: int, db: Session = Depends(get_db)):
    return servicio.obtener(db, beneficiario_id)


@router.post(
    "",
    response_model=BeneficiarioSalida,
    status_code=status.HTTP_201_CREATED,
    summary="Agregar beneficiario",
)
def crear(datos: BeneficiarioEntrada, db: Session = Depends(get_db)):
    return servicio.crear(db, datos)


@router.put("/{beneficiario_id}", response_model=BeneficiarioSalida, summary="Editar beneficiario")
def actualizar(beneficiario_id: int, datos: BeneficiarioEntrada, db: Session = Depends(get_db)):
    return servicio.actualizar(db, beneficiario_id, datos)


@router.delete(
    "/{beneficiario_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar beneficiario",
)
def eliminar(beneficiario_id: int, db: Session = Depends(get_db)):
    servicio.eliminar(db, beneficiario_id)