from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, docker_terminal,container_control,terminal,relation_graph
import uvicorn

app = FastAPI(
    title="FastAPI Backend for LLM & Docker Terminal",
    description="支持LLM问答和Docker终端映射的后端服务",
    version="1.0.0"
)

# 允许跨域请求
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 注册路由
app.include_router(chat.router, prefix="/api/chat", tags=["Chat"])
app.include_router(docker_terminal.router, prefix="/api/docker", tags=["Docker"])
app.include_router(container_control.router, prefix="/api/container", tags=["Container Control"])
app.include_router(terminal.router, prefix="/api/terminal", tags=["Terminal"])
app.include_router(relation_graph.router, prefix="/api/neo4j", tags=["neo4j"])

@app.get("/")
def read_root():
    return {"message": "Welcome to FastAPI Backend!"}

if __name__ == "__main__":
    uvicorn.run(app, host="192.168.1.160")