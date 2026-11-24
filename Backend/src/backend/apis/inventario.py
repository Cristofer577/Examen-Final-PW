from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.alimento import AlimentoEntrada, AlimentoSalida
from backend.services import alimento as servicio

router = APIRouter(prefix="/inventario", tags=["Inventario"])


@router.get("", response_model=list[AlimentoSalida], summary="Listar alimentos")
def listar(db: Session = Depends(get_db)):
    return servicio.listar(db)


@router.get("/{alimento_id}", response_model=AlimentoSalida, summary="Ver un alimento")
def obtener(alimento_id: int, db: Session = Depends(get_db)):
    return servicio.obtener(db, alimento_id)


@router.post(
    "",
    response_model=AlimentoSalida,
    status_code=status.HTTP_201_CREATED,
    summary="Agregar alimento",
)
def crear(datos: AlimentoEntrada, db: Session = Depends(get_db)):
    return servicio.crear(db, datos)


@router.put("/{alimento_id}", response_model=AlimentoSalida, summary="Editar alimento")
def actualizar(alimento_id: int, datos: AlimentoEntrada, db: Session = Depends(get_db)):
    return servicio.actualizar(db, alimento_id, datos)


@router.delete(
    "/{alimento_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    summary="Eliminar alimento",
)
def eliminar(alimento_id: int, db: Session = Depends(get_db)):
    servicio.eliminar(db, alimento_id)