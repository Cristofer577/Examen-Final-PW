from datetime import date

from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.repositories import beneficiario as repo_beneficiario
from backend.repositories import racion as repositorio
from backend.schemas.racion import DiaRaciones, GuardarDia, RegistroRacionSalida


def ver_dia(db: Session, fecha: date) -> DiaRaciones:
    beneficiarios = repo_beneficiario.listar(db)
    registros = repositorio.registros_del_dia(db, fecha)

    filas = []
    for b in beneficiarios:
        registro = registros.get(b.id)
        filas.append(
            RegistroRacionSalida(
                beneficiario_id=b.id,
                familia=b.nombre,
                etiqueta="Adulto Mayor" if b.edad >= 60 else None,
                dni=b.dni,
                codigo=f"BEN-{b.id:03d}",
                raciones=registro.raciones if registro else b.raciones,
                entregado=registro.entregado if registro else False,
            )
        )

    servidas = sum(f.raciones for f in filas if f.entregado)
    meta = settings.meta_diaria
    return DiaRaciones(
        fecha=fecha,
        meta=meta,
        servidas=servidas,
        pendientes=max(0, meta - servidas),
        registros=filas,
    )


def guardar_dia(db: Session, fecha: date, datos: GuardarDia) -> DiaRaciones:
    ids = [item.beneficiario_id for item in datos.registros]
    if len(set(ids)) != len(ids):
        raise HTTPException(status.HTTP_422_UNPROCESSABLE_ENTITY, "Hay beneficiarios repetidos")

    por_id = {b.id: b for b in repo_beneficiario.listar(db)}
    filas = []
    for item in datos.registros:
        beneficiario = por_id.get(item.beneficiario_id)
        if beneficiario is None:
            raise HTTPException(
                status.HTTP_404_NOT_FOUND,
                f"El beneficiario {item.beneficiario_id} no existe",
            )
        filas.append(
            {
                "beneficiario_id": beneficiario.id,
                "raciones": beneficiario.raciones,
                "entregado": item.entregado,
            }
        )

    repositorio.guardar_registros(db, fecha, filas)
    return ver_dia(db, fecha)