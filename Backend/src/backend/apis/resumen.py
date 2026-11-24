from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.resumen import ResumenInicio
from backend.services import resumen as servicio

router = APIRouter(prefix="/resumen", tags=["Inicio"])


@router.get("", response_model=ResumenInicio, summary="Resumen de la pantalla de inicio")
def ver_resumen(fecha: date | None = None, db: Session = Depends(get_db)):
    return servicio.ver_resumen(db, fecha)