from datetime import date

from pydantic import BaseModel, ConfigDict
from pydantic.alias_generators import to_camel


class Camel(BaseModel):
    """Base: el JSON usa camelCase (beneficiarioId), igual que Angular."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=True,
    )


class RegistroRacionSalida(Camel):
    beneficiario_id: int
    familia: str
    etiqueta: str | None = None
    dni: str
    codigo: str
    raciones: int
    entregado: bool


class DiaRaciones(Camel):
    fecha: date
    meta: int
    servidas: int
    pendientes: int
    registros: list[RegistroRacionSalida]


class RegistroRacionEntrada(Camel):
    beneficiario_id: int
    entregado: bool


class GuardarDia(Camel):
    registros: list[RegistroRacionEntrada]