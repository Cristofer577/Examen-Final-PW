from datetime import date
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field
from pydantic.alias_generators import to_camel

Unidad = Literal["kg", "botellas (1L)", "paquetes (1kg)", "bolsas", "latas", "unidades"]


class AlimentoEntrada(BaseModel):
    """Datos que llegan desde Angular. El JSON usa camelCase: fechaIngreso, stockMinimo."""

    model_config = ConfigDict(
        alias_generator=to_camel,
        validate_by_name=True,
        validate_by_alias=True,
    )

    nombre: str = Field(min_length=1, max_length=120)
    cantidad: float = Field(ge=0)
    unidad: Unidad
    fecha_ingreso: date
    stock_minimo: float = Field(ge=0)


class AlimentoSalida(AlimentoEntrada):
    """Lo que devuelve la API: lo mismo, más el id."""

    id: int

    model_config = ConfigDict(from_attributes=True)