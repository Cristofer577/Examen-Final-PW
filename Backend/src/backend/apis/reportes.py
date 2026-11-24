from datetime import date

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db
from backend.schemas.reporte import ReporteRaciones
from backend.services import reporte as servicio

router = APIRouter(prefix="/reportes", tags=["Reportes"])


@router.get("/raciones", response_model=ReporteRaciones, summary="Raciones servidas por día")
def raciones_por_dia(desde: date, hasta: date, db: Session = Depends(get_db)):
    return servicio.raciones_por_dia(db, desde, hasta)