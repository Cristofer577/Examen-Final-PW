from pydantic import ConfigDict, Field

from backend.schemas.racion import Camel


class LoginEntrada(Camel):
    usuario: str = Field(min_length=1, max_length=50)
    clave: str = Field(min_length=1, max_length=100)


class UsuarioSalida(Camel):
    id: int
    nombre: str
    usuario: str
    rol: str

    model_config = ConfigDict(from_attributes=True)


class TokenSalida(Camel):
    token: str
    usuario: UsuarioSalida