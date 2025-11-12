"""
FastAPI 主應用程式
營造廠決策分析平台 - 後端 API
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import projects, activities, optimization
import os

# 建立 FastAPI 應用程式實例
app = FastAPI(
    title="營造廠決策分析平台 API",
    description="投標最佳化決策系統後端 API",
    version="1.0.0"
)

# 從環境變數讀取允許的前端來源
# 支援多個來源，用逗號分隔
frontend_urls = os.getenv("FRONTEND_URL", "http://localhost:5173")
allowed_origins = [url.strip() for url in frontend_urls.split(",") if url.strip()]

# 開發環境也允許 localhost
if "http://localhost:5173" not in allowed_origins:
    allowed_origins.append("http://localhost:5173")

# 設定 CORS 中間件，允許前端跨域請求
# 自動允許所有 Vercel 域名（包括 Preview 部署）
# 注意：FastAPI 的 CORS 不支援通配符，所以我們需要明確列出所有允許的來源
# 或者使用 allow_origin_regex 來支援 Vercel 域名模式
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # 允許所有 Vercel 域名
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 註冊路由
app.include_router(projects.router, prefix="/api", tags=["專案管理"])
app.include_router(activities.router, prefix="/api", tags=["作業管理"])
app.include_router(optimization.router, prefix="/api", tags=["優化計算"])


@app.get("/")
async def root():
    """根路徑健康檢查"""
    return {"message": "營造廠決策分析平台 API", "status": "running"}


@app.get("/health")
async def health_check():
    """健康檢查端點"""
    return {"status": "healthy"}

