from datetime import date
from typing import Literal

from backend.schemas.racion import Camel


class RacionesHoy(Camel):
    servidas: int
    meta: int
    pendientes: int


class Poblacion(Camel):
    total: int
    adultos_mayores: int
    ninos: int


class InsumoCritico(Camel):
    nombre: str
    cantidad: float
    unidad: str
    estado: Literal["Poco stock", "Agotado"]


class ResumenInicio(Camel):
    fecha: date
    raciones: RacionesHoy
    poblacion: Poblacion
    insumos_criticos: list[InsumoCritico]