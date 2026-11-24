from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.repositories import reporte as repositorio
from backend.schemas.reporte import DiaReporte, ReporteRaciones


def raciones_por_dia(db: Session, desde: date, hasta: date) -> ReporteRaciones:
    if desde > hasta:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "La fecha 'desde' no puede ser posterior a 'hasta'",
        )
    if (hasta - desde).days > 366:
        raise HTTPException(
            status.HTTP_422_UNPROCESSABLE_ENTITY,
            "El rango no puede superar un año",
        )

    dias = [DiaReporte(fecha=f, servidas=s) for f, s in repositorio.servidas_por_dia(db, desde, hasta)]
    total = sum(d.servidas for d in dias)
    promedio = round(total / len(dias)) if dias else 0

    return ReporteRaciones(
        desde=desde,
        hasta=hasta,
        meta=settings.meta_diaria,
        total=total,
        promedio=promedio,
        dias=dias,
    )