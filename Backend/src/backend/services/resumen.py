from datetime import date

from sqlalchemy.orm import Session

from backend.repositories import alimento as repo_alimento
from backend.repositories import beneficiario as repo_beneficiario
from backend.schemas.resumen import InsumoCritico, Poblacion, RacionesHoy, ResumenInicio
from backend.services import racion as servicio_racion


def ver_resumen(db: Session, fecha: date | None = None) -> ResumenInicio:
    fecha = fecha or date.today()

    dia = servicio_racion.ver_dia(db, fecha)
    beneficiarios = repo_beneficiario.listar(db)
    alimentos = repo_alimento.listar(db)

    criticos = sorted(
        (a for a in alimentos if a.cantidad <= a.stock_minimo),
        key=lambda a: a.cantidad,
    )

    return ResumenInicio(
        fecha=fecha,
        raciones=RacionesHoy(servidas=dia.servidas, meta=dia.meta, pendientes=dia.pendientes),
        poblacion=Poblacion(
            total=len(beneficiarios),
            adultos_mayores=sum(1 for b in beneficiarios if b.edad >= 60),
            ninos=sum(1 for b in beneficiarios if b.edad <= 12),
        ),
        insumos_criticos=[
            InsumoCritico(
                nombre=a.nombre,
                cantidad=a.cantidad,
                unidad=a.unidad,
                estado="Agotado" if a.cantidad <= 0 else "Poco stock",
            )
            for a in criticos
        ],
    )