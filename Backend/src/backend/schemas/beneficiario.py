from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

Categoria = Literal[
    "Grupo Familiar",
    "Atención Prioritaria",
    "Beneficiario Regular",
    "Apoyo Nutricional Escolar",
]


class BeneficiarioEntrada(BaseModel):
    """Datos que llegan desde Angular (para crear y para editar)."""

    nombre: str = Field(min_length=1, max_length=150)
    categoria: Categoria
    dni: str = Field(pattern=r"^\d{8}$")
    edad: int = Field(ge=0, le=120)
    telefono: str = Field(default="", pattern=r"^(\d{3} ?\d{3} ?\d{3})?$")
    raciones: int = Field(default=1, ge=1, le=20)


class BeneficiarioSalida(BeneficiarioEntrada):
    """Datos que la API devuelve: lo mismo, más el id."""

    id: int

    model_config = ConfigDict(from_attributes=True)