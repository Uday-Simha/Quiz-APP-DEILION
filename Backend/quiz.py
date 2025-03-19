
from fastapi import APIRouter, Depends, HTTPException, Body, Header
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db  # Ensure you have get_db to manage sessions
from models import QuizAttempt  # Import QuizAttempt model

# Load environment variables
load_dotenv()

# Initialize FastAPI
quiz_router = APIRouter()

from pydantic import BaseModel

class QuizAttemptSummaryResponse(BaseModel):
    id: int  # Quiz ID
    topic: str
    score: int
    correct_answers_count: int
    incorrect_answers_count: int

    class Config:
        orm_mode = True  # Enables SQLAlchemy model serialization


# Input model
class QueryRequest(BaseModel):
    topic: str = Field(..., description="The main topic to focus on")
    num_questions: int = Field(..., description="Number of MCQ questions to generate")
    api_key: Optional[str] = Field(None, description="Gemini API key (optional)")

# Model for answer validation
class AnswerSubmission(BaseModel):
    session_id: str = Field(..., description="Session ID received from generate_mcq")
    answers: List[int] = Field(..., description="List of answer indices (0-3) for each question")    

mcq_sessions = {}

@quiz_router.post("/generate_mcq")
async def generate_mcq_questions(
    request: QueryRequest = Body(...),
    x_api_key: Optional[str] = Header(None, description="Gemini API key (header)"),
    db: Session = Depends(get_db),
    user_id: int = Header(..., description="User ID (header)")
):
    """Generate multiple-choice questions (MCQs) and store them in DB."""
    try:
        api_key = x_api_key or request.api_key or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=401, detail="Gemini API key not provided")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-pro')

        prompt = f"""
        Generate {request.num_questions} multiple-choice questions on the topic: {request.topic}.
        Each question should have exactly 4 answer choices.
        Format the response as a valid JSON array like this:
        [
          {{"question": "What is ...?", "options": ["A", "B", "C", "D"], "correct_index": 0}},
          ...
        ]
        Ensure it is **pure JSON** without any additional text.
        """

        response = model.generate_content(prompt)
        if not response or not hasattr(response, 'text'):
            raise HTTPException(status_code=500, detail="Failed to get valid response from Gemini")

        response_text = response.text.strip()
        json_pattern = r'\[\s*\{(?:[^{}]|(?:\{[^{}]*\}))*\}\s*\]'
        json_match = re.search(json_pattern, response_text, re.DOTALL)
        json_data = json_match.group(0) if json_match else response_text

        try:
            mcq_data = json.loads(json_data)
            if not isinstance(mcq_data, list):
                raise ValueError("Response is not a valid JSON list")
        except json.JSONDecodeError:
            raise HTTPException(status_code=500, detail=f"Failed to parse response into JSON. Raw Response: {response_text}")

        formatted_mcqs = []
        correct_answers = []
        
        for item in mcq_data:
            if not all(k in item for k in ("question", "options", "correct_index")):
                continue
                
            correct_index = item.get("correct_index", 0)
            correct_answers.append(correct_index)
            
            formatted_mcqs.append({
                "question": item["question"],
                "options": item["options"][:4],
                "correct_answer": item["options"][correct_index]  # Correctly store answer text
            })

        # Store quiz details in the database
        quiz_attempt = QuizAttempt(
            user_id=user_id,
            topic=request.topic,
            mcqs=formatted_mcqs,
            correct_answers=correct_answers
        )
        db.add(quiz_attempt)
        db.commit()
        db.refresh(quiz_attempt)

        return {
            "quiz_id": quiz_attempt.id,
            "session_id": str(quiz_attempt.id),
            "topic": request.topic,
            "mcqs": formatted_mcqs
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating MCQs: {str(e)}")

# Input model for updating score
class ScoreUpdateRequest(BaseModel):
    quiz_id: int = Field(..., description="ID of the quiz attempt")
    score: int = Field(..., description="Score obtained by the user")
  

@quiz_router.put("/update_score")
async def update_quiz_score(
    request: ScoreUpdateRequest = Body(...),
    db: Session = Depends(get_db)
):
    """Update the score for a specific quiz attempt and return total questions."""
    try:
        # Fetch the quiz attempt from DB
        quiz_attempt = db.query(QuizAttempt).filter(QuizAttempt.id == request.quiz_id).first()

        if not quiz_attempt:
            raise HTTPException(status_code=404, detail="Quiz attempt not found")

        # Calculate total questions
        total_questions = len(quiz_attempt.mcqs) if isinstance(quiz_attempt.mcqs, list) else 0

        # Calculate correct & incorrect answers
        correct_answers_count = request.score
        incorrect_answers_count = total_questions - correct_answers_count

        # Update fields in DB
        quiz_attempt.score = request.score
        quiz_attempt.correct_answers_count = correct_answers_count
        quiz_attempt.incorrect_answers_count = incorrect_answers_count

        db.commit()
        db.refresh(quiz_attempt)

        return {
            "message": "Score updated successfully",
            "quiz_id": request.quiz_id,
            "updated_score": request.score,
            "total_questions": total_questions,
            "correct_answers": correct_answers_count,
            "incorrect_answers": incorrect_answers_count,
            "display_score": f"{request.score}/{total_questions}"  # UI-friendly format
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating score: {str(e)}")
    
@quiz_router.get("/quiz/attempts/{user_id}", response_model=list[QuizAttemptSummaryResponse])
def get_quiz_attempts(user_id: int, db: Session = Depends(get_db)):
    """Fetch all quiz attempts for a specific user."""
    quiz_attempts = db.query(QuizAttempt).filter(QuizAttempt.user_id == user_id).all()
    
    if not quiz_attempts:
        raise HTTPException(status_code=404, detail="No quiz attempts found for this user")
    
    return quiz_attempts    