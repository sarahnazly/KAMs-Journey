from fastapi import FastAPI
from app.routers.feature_importance import router as fi_router
from app.routers.win_probability import router as wp_router
from app.routers.evaluation_prediction_router import router as ep_router
from app.routers.orientasi_router import router as ori_router
from app.routers.pelaksanaan_router import router as pel_router
from app.routers.kinerja_router import router as kin_router
from app.routers.evaluasi_router import router as eva_router
from app.routers.pengembangan_router import router as peng_router
from app.routers.project_router import router as proj_router
from app.routers.search_router import router as search_router
from app.core.db import Base, engine
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="KAMs Journey Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://ae-journey.vercel.app","*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fi_router)
app.include_router(wp_router)
app.include_router(ep_router)
app.include_router(ori_router)
app.include_router(pel_router)
app.include_router(kin_router)
app.include_router(eva_router)
app.include_router(peng_router)
app.include_router(proj_router)
app.include_router(search_router)