from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from models.target import Target
from database import get_db
from pydantic import BaseModel
from typing import Optional, Dict
from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.active_container import ActiveContainer
import docker
import asyncio

router = APIRouter(prefix="/targets")

# Pydantic 模型用于请求体验证
class TargetCreate(BaseModel):
    name: str
    description: str
    image_name: str
    port_mapping: Dict
    file_path: str
    category: str

class TargetUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    image_name: Optional[str] = None
    port_mapping: Optional[Dict] = None
    file_path: Optional[str] = None
    category: Optional[str] = None
# ========== CRUD 接口 ==========

# 获取所有靶场
@router.get("/")
def get_all_targets(db: Session = Depends(get_db)):
    """获取所有靶场信息"""
    targets = db.query(Target).all()
    return {"data": targets}

# 获取单个靶场
@router.get("/{target_id}")
def get_target(target_id: int, db: Session = Depends(get_db)):
    """获取单个靶场信息"""
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    return {"data": target}

# 添加新靶场
@router.post("/")
def create_target(request: TargetCreate, db: Session = Depends(get_db)):
    """添加新靶场"""
    new_target = Target(
        name=request.name,
        description=request.description,
        image_name=request.image_name,
        port_mapping=request.port_mapping,
        file_path=request.file_path,
        category=request.category  # 👈 新增字段
    )
    db.add(new_target)
    db.commit()
    db.refresh(new_target)
    return {"message": "Target created successfully", "data": new_target}

# 更新靶场信息
@router.put("/{target_id}")
def update_target(target_id: int, request: TargetUpdate, db: Session = Depends(get_db)):
    """更新靶场信息"""
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")

    for key, value in request.dict(exclude_unset=True).items():
        setattr(target, key, value)

    db.commit()
    db.refresh(target)
    return {"message": "Target updated successfully", "data": target}

# 删除靶场
@router.delete("/{target_id}")
def delete_target(target_id: int, db: Session = Depends(get_db)):
    """删除靶场"""
    target = db.query(Target).filter(Target.id == target_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    db.delete(target)
    db.commit()
    return {"message": "Target deleted successfully"}
