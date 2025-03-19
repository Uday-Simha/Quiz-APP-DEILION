
from fastapi import APIRouter, Depends, HTTPException, Body, Header
from pydantic import BaseModel, Field
from typing import List, Dict, Optional
import google.generativeai as genai
import os
import json
import re
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from database import get_db  
from models import QuizAttempt  

load_dotenv()

quiz_router = APIRouter()

from pydantic import BaseModel

class QuizAttemptSummaryResponse(BaseModel):
    id: int  
    topic: str
    score: int
    correct_answers_count: int
    incorrect_answers_count: int
    time_taken: int

    class Config:
        orm_mode = True  


class QueryRequest(BaseModel):
    topic: str = Field(..., description="The main topic to focus on")
    num_questions: int = Field(..., description="Number of MCQ questions to generate")
    api_key: Optional[str] = Field(None, description="Gemini API key (optional)")
    question_level:str = Field(None, description="Enter the type of questions")

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
    """Generates multiple-choice questions (MCQs) and stores them in DB."""
    try:
        api_key = x_api_key or request.api_key or os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise HTTPException(status_code=401, detail="Gemini API key not provided")

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel('gemini-1.5-pro')

        prompt = f"""
            Generate {request.num_questions} multiple-choice questions on the topic: "{request.topic}".
            The difficulty level should be: "{request.question_level}".

            Each question must have:
            1. A "question" field (string).
            2. An "options" field (a list of exactly 4 strings).
            3. A "correct_index" field (integer between 0-3, indicating the correct option).

            ### **Strict JSON Output (No Extra Text)**
            ```json
            [
            {{"question": "Sample question?", "options": ["A", "B", "C", "D"], "correct_index": 0}},
            ...
            ]
            ```
            **DO NOT add explanations, formatting, or extra text. Return only a pure JSON array.**
            """

        # 🔥 Call Gemini API
        response = model.generate_content(prompt)

        if not response or not hasattr(response, 'text'):
            raise HTTPException(status_code=500, detail="Failed to get valid response from Gemini API")

        response_text = response.text.strip()

        json_pattern = r'\[\s*\{.*?\}\s*\]' # Handling the Extra Text
        json_match = re.search(json_pattern, response_text, re.DOTALL)

        if json_match:
            json_data = json_match.group(0)  # Extracted JSON
        else:
            raise HTTPException(status_code=500, detail=f"Failed to extract JSON. Raw Response: {response_text}")

        try:
            mcq_data = json.loads(json_data)

            for item in mcq_data:
                if "options" in item and not isinstance(item["options"], list):
                    # Convert incorrectly formatted "options" into a proper list
                    item["options"] = [str(option).strip() for option in item["options"].split(",")]

            if not isinstance(mcq_data, list):
                raise ValueError("Extracted response is not a valid JSON list")

        except json.JSONDecodeError as e:
            raise HTTPException(status_code=500, detail=f"JSON parsing error: {str(e)}. Raw Response: {response_text}")

        formatted_mcqs = []
        correct_answers = []

        for item in mcq_data:
            if not all(k in item for k in ("question", "options", "correct_index")):
                continue  # Skip if any key is missing
            
            correct_index = item.get("correct_index", 0)
            correct_answers.append(correct_index)

            formatted_mcqs.append({
                "question": item["question"],
                "options": item["options"][:4],  
                "correct_answer": item["options"][correct_index]  
            })

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


class ScoreUpdateRequest(BaseModel):
    quiz_id: int = Field(..., description="ID of the quiz attempt")
    score: int = Field(..., description="Score obtained by the user")
    time_taken: int = Field(..., description="Time taken to complete the quiz (in seconds)")  # ✅ Added


  

@quiz_router.put("/update_score")
async def update_quiz_score(
    request: ScoreUpdateRequest = Body(...),
    db: Session = Depends(get_db)
):
    """Update the score for a specific quiz attempt and return total questions."""
    try:
        quiz_attempt = db.query(QuizAttempt).filter(QuizAttempt.id == request.quiz_id).first()

        if not quiz_attempt:
            raise HTTPException(status_code=404, detail="Quiz attempt not found")

        total_questions = len(quiz_attempt.mcqs) if isinstance(quiz_attempt.mcqs, list) else 0

        correct_answers_count = request.score
        incorrect_answers_count = total_questions - correct_answers_count

        quiz_attempt.score = request.score
        quiz_attempt.correct_answers_count = correct_answers_count
        quiz_attempt.incorrect_answers_count = incorrect_answers_count
        quiz_attempt.time_taken = request.time_taken  


        db.commit()
        db.refresh(quiz_attempt)

        return {
            "message": "Score updated successfully",
            "quiz_id": request.quiz_id,
            "updated_score": request.score,
            "total_questions": total_questions,
            "correct_answers": correct_answers_count,
            "incorrect_answers": incorrect_answers_count,
            "time_taken": request.time_taken,
            "display_score": f"{request.score}/{total_questions}"  
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