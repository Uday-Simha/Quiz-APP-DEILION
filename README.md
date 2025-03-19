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
                    ├── Login.jsx   
                    ├── Register.jsx   
                    ├── QuizSetup.jsx   
                    ├── Quiz.jsx 
                    ├── Summary.jsx 
                    ├── Layout.jsx
                ├── context/  
                    ├── AuthContext.jsx 
                ├── pages/  
                    ├── Home.jsx 
                    ├── Dashboard.jsx 
                ├── App.jsx  
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

### 🔑 Login Page check under Images/login.png
<img src="images/login.png" alt="Login Page" width="600">

### 📝 Register Page check under Images/register.png

<img src="images/register.png" alt="Register Page" width="600">

### 🎯 Quiz Setup check under Images/setup_quiz.png
<img src="images/setup_quiz.png" alt="Quiz Setup" width="600">

### 🚀 Start Quiz check under Images/GeneratedQuiz.png
<img src="images/GeneratedQuiz.png" alt="Start Quiz" width="600">

### 🏁 Finish Quiz check under Images/finish.png
<img src="images/finish.png" alt="Finish Quiz" width="600">

### 🎯 Quiz Score check under Images/score.png
<img src="images/score.png" alt="Quiz Score" width="600">

### 🚀 Dashboard Score check under Images/dashboard.png
<img src="images/dashboard.png" alt="Dashboard" width="600"

---

## Note : After Finishing the Quiz click on Goto Dashboard button to see the dashboard.
<img src="images/image.png" alt="dashboard button" width="600"


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
    ```bash
    DATABASE_URL=postgresql+psycopg2://your_user_name:your_password@your_localhost:your_port/your_db

    SECRET_KEY=your_secret_key

    ALGORITHM=HS256

    GEMINI_API_KEY=your_gemini_api_key
    ```

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



