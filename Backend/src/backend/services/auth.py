from fastapi import HTTPException, status
from sqlalchemy.orm import Session

from backend.core.security import crear_token, encriptar_clave, verificar_clave
from backend.repositories import usuario as repositorio
from backend.schemas.auth import LoginEntrada, TokenSalida, UsuarioSalida

# Usuarios de demostración (son los del acceso rápido del Login)
USUARIOS_DEMO = [
    ("Yolanda Quispe", "10458921", "demo123", "Encargada General"),
    ("Bertha Mayta", "socia.turno", "demo123", "Socia de Turno"),
]


def login(db: Session, datos: LoginEntrada) -> TokenSalida:
    usuario = repositorio.obtener_por_usuario(db, datos.usuario.strip())
    if (
        usuario is None
        or not usuario.activo
        or not verificar_clave(datos.clave, usuario.clave_encriptada)
    ):
        # Mismo mensaje para ambos casos: no se revela si el usuario existe
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Usuario o contraseña incorrectos")

    return TokenSalida(
        token=crear_token(usuario.id),
        usuario=UsuarioSalida.model_validate(usuario),
    )


def crear_usuarios_iniciales(db: Session) -> None:
    """Crea los usuarios de demostración solo si la tabla está vacía."""
    if repositorio.contar(db) > 0:
        return
    for nombre, usuario, clave, rol in USUARIOS_DEMO:
        repositorio.crear(
            db,
            {
                "nombre": nombre,
                "usuario": usuario,
                "clave_encriptada": encriptar_clave(clave),
                "rol": rol,
            },
        )