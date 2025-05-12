from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class ActiveContainer(Base):
    __tablename__ = 'active_containers'

    id = Column(Integer, primary_key=True)
    target_id = Column(Integer, ForeignKey('targets.id'))
    container_id = Column(String(255))
    status = Column(String(50))
    started_at = Column(DateTime, default=datetime.utcnow)
    expired_at = Column(DateTime)

    target = relationship("Target")