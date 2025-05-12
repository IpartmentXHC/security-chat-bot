from sqlalchemy import Column, Integer, Text, DateTime
from database import Base
from datetime import datetime

class QuestionAnswer(Base):
    __tablename__ = "qa_records"

    id = Column(Integer, primary_key=True)
    question = Column(Text, nullable=False)
    answer = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)