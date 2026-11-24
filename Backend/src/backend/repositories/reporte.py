from datetime import date

from sqlalchemy import case, func, select
from sqlalchemy.orm import Session

from backend.models.racion import RegistroRacion


def servidas_por_dia(db: Session, desde: date, hasta: date) -> list[tuple[date, int]]:
    """Suma las raciones entregadas de cada día dentro del rango."""
    suma = func.sum(case((RegistroRacion.entregado, RegistroRacion.raciones), else_=0))
    consulta = (
        select(RegistroRacion.fecha, suma)
        .where(RegistroRacion.fecha >= desde, RegistroRacion.fecha <= hasta)
        .group_by(RegistroRacion.fecha)
        .order_by(RegistroRacion.fecha)
    )
    return [(fecha, int(total or 0)) for fecha, total in db.execute(consulta)]