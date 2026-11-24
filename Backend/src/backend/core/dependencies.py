from collections.abc import Generator

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from backend.core.database import SessionLocal
from backend.core.security import decodificar_token
from backend.models.usuario import Usuario
from backend.repositories import usuario as repo_usuario

esquema_bearer = HTTPBearer(auto_error=False)


def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def usuario_actual(
    credenciales: HTTPAuthorizationCredentials | None = Depends(esquema_bearer),
    db: Session = Depends(get_db),
) -> Usuario:
    no_autorizado = HTTPException(
        status.HTTP_401_UNAUTHORIZED,
        "Sesión no válida o expirada",
        headers={"WWW-Authenticate": "Bearer"},
    )
    if credenciales is None:
        raise no_autorizado

    usuario_id = decodificar_token(credenciales.credentials)
    if usuario_id is None:
        raise no_autorizado

    usuario = repo_usuario.obtener(db, usuario_id)
    if usuario is None or not usuario.activo:
        raise no_autorizado
    return usuario