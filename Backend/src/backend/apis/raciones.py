from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.racion import DiaRaciones, GuardarDia
from backend.services import racion as servicio

router = APIRouter(prefix="/raciones", tags=["Raciones diarias"])


@router.get("/{fecha}", response_model=DiaRaciones, summary="Ver las raciones de un día")
def ver_dia(fecha: date, db: Session = Depends(get_db)):
    return servicio.ver_dia(db, fecha)


@router.put("/{fecha}", response_model=DiaRaciones, summary="Guardar el registro de un día")
def guardar_dia(fecha: date, datos: GuardarDia, db: Session = Depends(get_db)):
    return servicio.guardar_dia(db, fecha, datos)