from sqlalchemy import JSON, Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    password_hash = Column(String)

    quiz_attempts = relationship("QuizAttempt", back_populates="user")


class QuizAttempt(Base):
    __tablename__ = "quiz_attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    topic = Column(String, nullable=False)
    mcqs = Column(JSON, nullable=False)  # Stores the generated questions
    correct_answers = Column(JSON, nullable=False)  # Stores correct answer indices
    score = Column(Integer, default=0)  # Score after submission
    time_taken = Column(Integer, default=0)  # Time taken (optional)
    correct_answers_count = Column(Integer, default=0)  # Store correct count
    incorrect_answers_count = Column(Integer, default=0)  # Store incorrect count

    user = relationship("User", back_populates="quiz_attempts")
