from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from backend.models.racion import RegistroRacion


def registros_del_dia(db: Session, fecha: date) -> dict[int, RegistroRacion]:
    """Devuelve los registros de una fecha, indexados por id de beneficiario."""
    filas = db.scalars(select(RegistroRacion).where(RegistroRacion.fecha == fecha))
    return {r.beneficiario_id: r for r in filas}


def guardar_registros(db: Session, fecha: date, filas: list[dict]) -> None:
    existentes = registros_del_dia(db, fecha)
    for fila in filas:
        registro = existentes.get(fila["beneficiario_id"])
        if registro:
            registro.entregado = fila["entregado"]
        else:
            db.add(RegistroRacion(fecha=fecha, **fila))
    db.commit()