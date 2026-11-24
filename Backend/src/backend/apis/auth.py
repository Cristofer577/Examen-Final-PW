from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from backend.core.dependencies import get_db, usuario_actual
from backend.models.usuario import Usuario
from backend.schemas.auth import LoginEntrada, TokenSalida, UsuarioSalida
from backend.services import auth as servicio

router = APIRouter(prefix="/auth", tags=["Autenticación"])


@router.post("/login", response_model=TokenSalida, summary="Iniciar sesión")
def login(datos: LoginEntrada, db: Session = Depends(get_db)):
    return servicio.login(db, datos)


@router.get("/yo", response_model=UsuarioSalida, summary="Ver el usuario con sesión iniciada")
def yo(usuario: Usuario = Depends(usuario_actual)):
    return usuario