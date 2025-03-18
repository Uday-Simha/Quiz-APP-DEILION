# 📝 Quiz Application (FastAPI + React)

## 📌 Overview
This is a **full-stack quiz application** that allows users to **log in, generate quizzes based on topics, take quizzes, and track scores**.  
It uses:
- **FastAPI** as the backend
- **PostgreSQL** as the database
- **React (Vite)** as the frontend

---

## 🚀 Tech Stack
### **Backend (FastAPI)**
- FastAPI
- SQLAlchemy
- PostgreSQL
- JWT Authentication
- Google Gemini API for MCQ generation

### **Frontend (React)**
- React (Vite)
- React Router
- Axios (for API calls)
- Context API (for authentication state)

---

## 📂 Project Structure
quiz-app/ │── backend/ # FastAPI Backend  
                ├── main.py 
                ├── database.py  
                ├── models.py 
                ├── schemas.py  
                ├── auth.py  
                ├── quiz.py  
                ├── config.py  
                ├── .env  
                ├── requirements.txt  
            │── frontend/ # React (Vite) Frontend 
                ├── src/ 
                ├── components/  
                    ├── Login.js   
                    ├── Register.js   
                    ├── QuizSetup.js   
                    ├── Quiz.js  
                    ├── Summary.js 
                ├── context/  
                    ├── AuthContext.js 
                ├── pages/  
                    ├── Home.js  
                    ├── Dashboard.js 
                ├── App.js  
                ├── main.jsx  
                ├── package.json  
                ├── vite.config.js 
        │── README.md



---

## 🔐 Authentication API (FastAPI)
|Endpoint	    |Method	    |Description|
|-------------|---------|------------|
|`/auth/register`	|POST	    |Register new user|
|`/auth/login`	    |POST	    |Authenticate user and return JWT token|

---

## 📝 Quiz API (FastAPI)
|Endpoint	            |Method	    |Description|
|----------------------|---------|------------|
|`/quiz/generate_mcq`	|POST	    |Generate quiz with MCQs using Gemini API|
|`/quiz/update_score`	|PUT	    |Update quiz score for the user|



## 📸 Screenshots

### 🔑 Login Page
![Login](images/login.png)

### 📝 Register Page
![Register](images/register.png)

### 🎯 Quiz Setup
![Quiz Setup](images/setup_quiz.png)

### 🚀 Start Quiz
![Start Quiz](images/GeneratedQuiz.png)

### 🏁 Finish Quiz
![Finish Quiz](images/finish.png)

### 🎯 Quiz Score
![Quiz Score](images/score.png)

---




## ⚙️ Backend Setup (FastAPI)
### **1️⃣ Install Dependencies**
```bash
cd backend
#create virtual environment
python -m venv venv
# install required dependencies
pip install -r requirements.txt
```

2. Create a .env file in the backend directory:

    DATABASE_URL=postgresql+psycopg2://your_user_name:your_password@your_localhost:your_port/your_db
    SECRET_KEY=your_secret_key
    ALGORITHM=HS256
    GEMINI_API_KEY=your_gemini_api_key

3. Run the Server

    uvicorn main:app --reload

    The API will be available at: http://localhost:8000
    Swagger Docs: http://localhost:8000/docs

🎨 Frontend Setup (React + Vite)

1️⃣ Install Dependencies

    ```bash
    cd frontend
    npm install
    ```

2️⃣ Run the Development Server

    ```bash
    npm run dev
    ```

    The frontend will run at: http://localhost:5173




🎮 Frontend Features
✔ User Authentication (Login/Register)
✔ Quiz Setup (Select Topic & Questions)
✔ Quiz Interface (Next/Previous Navigation)
✔ Real-time Score Calculation
✔ Final Score Submission to Backend
✔ User-Friendly UI


📌 Future Improvements
🔹 Leaderboards for top scorers
🔹 Timed Quizzes
🔹 Multiple Quiz Attempts Tracking
🔹 CSS Styling

📜 License
This version of your README includes the images in relevant sections. Let me know if you need any modifications! 🚀








