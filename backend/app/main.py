from fastapi import FastAPI
from app.routers.feature_importance import router as fi_router
from app.routers.win_probability import router as wp_router
from app.routers.orientasi_router import router as ori_router
from app.routers.pelaksanaan_router import router as pel_router
from app.routers.kinerja_router import router as kin_router
from app.routers.evaluasi_router import router as eva_router
from app.routers.pengembangan_router import router as peng_router
from app.routers.project_router import router as proj_router
from app.core.db import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KAMs Journey Backend")

app.include_router(fi_router)
app.include_router(wp_router)
app.include_router(ori_router)
app.include_router(pel_router)
app.include_router(kin_router)
app.include_router(eva_router)
app.include_router(peng_router)
app.include_router(proj_router)