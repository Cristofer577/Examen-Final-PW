from contextlib import asynccontextmanager

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.orm import Session

from backend.apis import auth, beneficiarios, inventario, raciones, reportes, resumen
from backend.core.config import settings
from backend.core.database import Base, SessionLocal, engine
from backend.core.dependencies import get_db, usuario_actual
from backend.services import auth as servicio_auth

Base.metadata.create_all(bind=engine)


@asynccontextmanager
async def lifespan(_: FastAPI):
    with SessionLocal() as db:
        servicio_auth.crear_usuarios_iniciales(db)
    yield


app = FastAPI(title="Comedor Solidario API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origenes_permitidos,
    allow_methods=["*"],
    allow_headers=["*"],
)

protegido = [Depends(usuario_actual)]

app.include_router(auth.router)
app.include_router(beneficiarios.router, dependencies=protegido)
app.include_router(inventario.router, dependencies=protegido)
app.include_router(raciones.router, dependencies=protegido)
app.include_router(reportes.router, dependencies=protegido)
app.include_router(resumen.router, dependencies=protegido)


@app.get("/", summary="Bienvenida", tags=["General"])
def raiz():
    return {"mensaje": "API del Comedor Solidario funcionando"}


@app.get("/salud", summary="Estado de la base de datos", tags=["General"])
def salud(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"base_de_datos": "conectada"}