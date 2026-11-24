from datetime import UTC, datetime, timedelta

import jwt
from pwdlib import PasswordHash

from backend.core.config import settings

_hasher = PasswordHash.recommended()


def encriptar_clave(clave: str) -> str:
    return _hasher.hash(clave)


def verificar_clave(clave: str, clave_encriptada: str) -> bool:
    return _hasher.verify(clave, clave_encriptada)


def crear_token(usuario_id: int) -> str:
    expira = datetime.now(UTC) + timedelta(minutes=settings.token_minutos)
    datos = {"sub": str(usuario_id), "exp": expira}
    return jwt.encode(datos, settings.secret_key, algorithm=settings.algorithm)


def decodificar_token(token: str) -> int | None:
    """Devuelve el id del usuario, o None si el token es falso o expiró."""
    try:
        datos = jwt.decode(token, settings.secret_key, algorithms=[settings.algorithm])
        return int(datos["sub"])
    except (jwt.InvalidTokenError, KeyError, ValueError):
        return None