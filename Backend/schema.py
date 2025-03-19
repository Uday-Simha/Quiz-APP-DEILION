from pydantic import BaseModel

class QuizAttemptSummaryResponse(BaseModel):
    id: int  # Quiz ID
    topic: str
    score: int
    correct_answers_count: int
    incorrect_answers_count: int

    class Config:
        orm_mode = True  # Enables SQLAlchemy model serialization
