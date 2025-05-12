# routers/container_control.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.target import Target
from models.active_container import ActiveContainer
from database import get_db
import os
import subprocess
from typing import Optional

router = APIRouter()

# ==================== 工具函数 ====================
def get_compose_file_path(file_path: str) -> str:
    """获取 docker-compose.yml 的完整路径"""
    compose_path = os.path.join(file_path, "docker-compose.yml")
    if not os.path.exists(compose_path):
        raise FileNotFoundError(f"docker-compose.yml 不存在于路径: {compose_path}")
    return compose_path

def run_docker_compose_cmd(compose_file: str, command: list):
    """执行 docker-compose 命令"""
    try:
        result = subprocess.run(
            ["docker-compose", "-f", compose_file] + command,
            capture_output=True,
            text=True,
            check=True
        )
        return result.stdout.strip()
    except subprocess.CalledProcessError as e:
        raise Exception(f"命令执行失败: {e.stderr}")

# ==================== 接口实现 ====================


# 获取所有容器信息
@router.get("/")
async def get_all_containers(db: Session = Depends(get_db)):
    containers = db.query(ActiveContainer).all()
    if not containers:
        return {"data": []}
    return {"data": containers}


# 获取指定靶场容器信息
@router.get("/{target_id}")
async def get_container_by_target(target_id: int, db: Session = Depends(get_db)):
    container_record = db.query(ActiveContainer).filter_by(target_id=target_id).first()
    if not container_record:
        raise HTTPException(status_code=404, detail="未找到该靶场的容器记录")

    return {"data": container_record}

@router.post("/start/{target_id}")
def start_container(target_id: int, db: Session = Depends(get_db)):
    target = db.query(Target).get(target_id)
    if not target:
        raise HTTPException(status_code=404, detail="靶场不存在")

    compose_file = get_compose_file_path(target.file_path)


    # 检查文件是否存在
    if not os.path.exists(compose_file):
        raise HTTPException(status_code=404, detail="docker-compose.yml 文件不存在")

    # 检查是否已有活跃容器
    active = db.query(ActiveContainer).filter_by(target_id=target_id).first()
    if active and active.status == "running":
        return {"message": "容器已在运行中", "container_id": active.container_id}

    # 启动容器
    stdout = run_docker_compose_cmd(compose_file, ["up", "-d"])
    project_name = os.path.basename(target.file_path)

    # 获取容器 ID（假设只有一个服务）
    container_id = subprocess.run(
        ["docker-compose", "-f", compose_file, "ps", "-q"],
        capture_output=True,
        text=True,
        check=True
    ).stdout.strip().splitlines()[0]

    if active:
        active.container_id = container_id
        active.status = "running"
    else:
        new_container = ActiveContainer(
            target_id=target_id,
            container_id=container_id,
            status="running"
        )
        db.add(new_container)

    db.commit()
    return {"message": "容器启动成功", "container_id": container_id}


@router.post("/stop/{target_id}")
def stop_container(target_id: int, db: Session = Depends(get_db)):
    target = db.query(Target).get(target_id)
    if not target:
        raise HTTPException(status_code=404, detail="靶场不存在")

    active = db.query(ActiveContainer).filter_by(target_id=target_id).first()
    if not active or active.status != "running":
        raise HTTPException(status_code=400, detail="容器不在运行中")

    compose_file = get_compose_file_path(target.file_path)
    run_docker_compose_cmd(compose_file, ["stop"])

    active.status = "exited"
    db.commit()
    return {"message": "容器已停止"}


@router.post("/restart/{target_id}")
def restart_container(target_id: int, db: Session = Depends(get_db)):
    stop_container(target_id, db)
    return start_container(target_id, db)


@router.post("/reset/{target_id}")
def reset_container(target_id: int, db: Session = Depends(get_db)):
    target = db.query(Target).get(target_id)
    if not target:
        raise HTTPException(status_code=404, detail="靶场不存在")

    compose_file = get_compose_file_path(target.file_path)

    # 先 down 掉旧容器
    try:
        run_docker_compose_cmd(compose_file, ["down", "--volumes", "--rmi", "all"])
    except Exception:
        pass  # 忽略错误（可能没有旧容器）

    # 再 up 起来
    return start_container(target_id, db)