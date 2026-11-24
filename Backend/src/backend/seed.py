from datetime import date, timedelta

from backend.core.database import Base, SessionLocal, engine
from backend.models import alimento, beneficiario, racion, usuario  # noqa: F401
from backend.repositories import alimento as repo_alimento
from backend.repositories import beneficiario as repo_beneficiario
from backend.repositories import racion as repo_racion

BENEFICIARIOS = [
    {"nombre": "Familia Huamán Quispe", "categoria": "Grupo Familiar", "dni": "42819034", "edad": 38, "telefono": "964 123 456", "raciones": 4},
    {"nombre": "Pedro Celestino Rojas", "categoria": "Atención Prioritaria", "dni": "19830214", "edad": 72, "telefono": "952 789 101", "raciones": 2},
    {"nombre": "Familia Condori Mayta", "categoria": "Grupo Familiar", "dni": "47291045", "edad": 41, "telefono": "943 552 890", "raciones": 5},
    {"nombre": "Familia Alanya Balbín", "categoria": "Grupo Familiar", "dni": "20491823", "edad": 36, "telefono": "954 601 324", "raciones": 3},
    {"nombre": "Martha Canchanya Sedano", "categoria": "Beneficiario Regular", "dni": "09287156", "edad": 58, "telefono": "", "raciones": 1},
    {"nombre": "Familia Zacarías Paucar", "categoria": "Grupo Familiar", "dni": "47920281", "edad": 44, "telefono": "964 881 230", "raciones": 4},
    {"nombre": "Familia Lázaro Poma", "categoria": "Grupo Familiar", "dni": "20491821", "edad": 39, "telefono": "", "raciones": 3},
    {"nombre": "Elena Paucar Flores", "categoria": "Apoyo Nutricional Escolar", "dni": "73110294", "edad": 8, "telefono": "", "raciones": 1},
]

HOY = date.today()

ALIMENTOS = [
    {"nombre": "Arroz extra costeño", "cantidad": 45, "unidad": "kg", "fecha_ingreso": HOY - timedelta(days=3), "stock_minimo": 10},
    {"nombre": "Aceite vegetal", "cantidad": 4, "unidad": "botellas (1L)", "fecha_ingreso": HOY - timedelta(days=8), "stock_minimo": 5},
    {"nombre": "Lentejas serranas", "cantidad": 0, "unidad": "kg", "fecha_ingreso": HOY - timedelta(days=18), "stock_minimo": 5},
    {"nombre": "Papa amarilla Huancayo", "cantidad": 60, "unidad": "kg", "fecha_ingreso": HOY - timedelta(days=1), "stock_minimo": 15},
    {"nombre": "Sal yodada", "cantidad": 12, "unidad": "paquetes (1kg)", "fecha_ingreso": HOY - timedelta(days=5), "stock_minimo": 5},
    {"nombre": "Fideos tallarín", "cantidad": 3, "unidad": "bolsas", "fecha_ingreso": HOY - timedelta(days=11), "stock_minimo": 5},
    {"nombre": "Avena precocida", "cantidad": 25, "unidad": "kg", "fecha_ingreso": HOY - timedelta(days=2), "stock_minimo": 8},
    {"nombre": "Leche evaporada", "cantidad": 18, "unidad": "latas", "fecha_ingreso": HOY - timedelta(days=4), "stock_minimo": 6},
]

ENTREGADOS_POR_DIA = [5, 7, 6, 8, 4, 7, 3]


def cargar() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as db:
        if repo_beneficiario.listar(db):
            print("Ya hay beneficiarios: no se cargaron datos de ejemplo.")
            return

        creados = [repo_beneficiario.crear(db, datos) for datos in BENEFICIARIOS]
        for datos in ALIMENTOS:
            repo_alimento.crear(db, datos)

        for i, cantidad in enumerate(ENTREGADOS_POR_DIA):
            fecha = HOY - timedelta(days=6 - i)
            filas = [
                {"beneficiario_id": b.id, "raciones": b.raciones, "entregado": n < cantidad}
                for n, b in enumerate(creados)
            ]
            repo_racion.guardar_registros(db, fecha, filas)

        print(f"Listo: {len(creados)} beneficiarios, {len(ALIMENTOS)} alimentos y 7 días de raciones.")


if __name__ == "__main__":
    cargar()