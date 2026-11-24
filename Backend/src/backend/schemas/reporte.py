from datetime import date

from backend.schemas.racion import Camel


class DiaReporte(Camel):
    fecha: date
    servidas: int


class ReporteRaciones(Camel):
    desde: date
    hasta: date
    meta: int
    total: int
    promedio: int
    dias: list[DiaReporte]