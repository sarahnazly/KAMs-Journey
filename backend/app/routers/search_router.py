from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.db import get_db

from app.models.orientasi import Orientasi
from app.models.pelaksanaan import Pelaksanaan
from app.models.kinerja import Kinerja
from app.models.evaluasi_kinerja import EvaluasiKinerja
from app.models.pengembangan import Pengembangan
from app.models.project import Project

router = APIRouter(prefix="/search", tags=["Search"])


def apply_filters(queryset, query: str | None, quarter: str | None):
    """
    Helper untuk menerapkan filter search + quarter.
    """
    if quarter:
        queryset = queryset.filter(queryset.column_descriptions[0]["entity"].quarter == quarter)

    if query:
        if query.isdigit():
            queryset = queryset.filter(
                queryset.column_descriptions[0]["entity"].nik == int(query)
            )
        else:
            queryset = queryset.filter(
                queryset.column_descriptions[0]["entity"].name.ilike(f"%{query}%")
            )

    return queryset.all()


@router.get("")
def global_search(query: str | None = None, quarter: str | None = None, db: Session = Depends(get_db)):
    """
    Global search by name or NIK + optional quarter filter.
    """

    models = {
        "orientasi": Orientasi,
        "pelaksanaan": Pelaksanaan,
        "kinerja": Kinerja,
        "evaluasi": EvaluasiKinerja,
        "pengembangan": Pengembangan,
        "projects": Project,
    }

    results = {}

    for key, model in models.items():
        qs = db.query(model)
        results[key] = apply_filters(qs, query, quarter)

    return results
