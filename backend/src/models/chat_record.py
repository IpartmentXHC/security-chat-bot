from sqlalchemy import Column, Integer, Text, DateTime
from database import Base

class ChatRecord(Base):
    __tablename__ = 'chat_records'

    id = Column(Integer, primary_key=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    model_name = Column(String(100))
    created_at = Column(DateTime, default=datetime.utcnow)