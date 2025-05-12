# models/target.py
from sqlalchemy import Column, Integer, String, Text, JSON, DateTime
from database import Base
from datetime import datetime

class Target(Base):
    __tablename__ = 'targets'

    id = Column(Integer, primary_key=True)
    name = Column(String(255), unique=True, nullable=False, comment='靶场名称')
    description = Column(Text, comment='靶场描述信息')
    image_name = Column(String(255), nullable=False, comment='Docker镜像名称')
    port_mapping = Column(JSON, comment='端口映射配置，JSON格式')
    file_path = Column(String(255), comment='靶场相关文件的服务器存储路径')
    category = Column(String(50), comment='靶场分类，例如 Web、Reverse、Pwn、Crypto 等')
    created_at = Column(DateTime, default=datetime.utcnow, comment='创建时间')
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        comment='最后更新时间'
    )