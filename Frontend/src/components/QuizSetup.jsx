
import { useState, useContext } from "react";
import axios from "axios";
import Quiz from "./Quiz";
import AuthContext from "../context/AuthContext";

const QuizSetup = () => {
    const [topic, setTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [quizData, setQuizData] = useState(null);
    const [quizId, setQuizId] = useState(null);
    const [error, setError] = useState("");
    const { authData } = useContext(AuthContext);

    const fetchQuiz = async () => {
        setError("");

        try {
            const response = await axios.post(
                "http://localhost:8000/quiz/generate_mcq",
                { topic, num_questions: numQuestions },
                {
                    headers: {
                        "Authorization": `Bearer ${authData.token}`,
                        "user-id": authData.user_id,  // Pass user ID in headers
                    },
                }
            );

            if (response.status === 200) {
                setQuizData(response.data.mcqs);
                setQuizId(response.data.quiz_id); // Store quiz_id
            } else {
                setError("Failed to fetch quiz questions.");
            }
        } catch (err) {
            console.error("Error fetching quiz:", err.response?.data?.detail || err.message);
            setError(err.response?.data?.detail || "An error occurred.");
        }
    };

    return (
        <div>
            {quizData ? (
                <Quiz questions={quizData} quizId={quizId} />
            ) : (
                <>
                    {/* <h2>Setup Quiz</h2> */}
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <h5>Enter the Topic for Quiz</h5>
                    <input
                        type="text"
                        placeholder="Enter topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                    />
                    <br></br>
                    <br></br>
                    <h5>Select the No.of Questions</h5>
                    <select value={numQuestions} onChange={(e) => setNumQuestions(e.target.value)}>
                        <option value="" disabled>Select number of questions</option>
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="15">15</option>
                    </select>
                    <br></br>
                    <br></br>
                    <button onClick={fetchQuiz}>Start Quiz</button>
                </>
            )}
        </div>
    );
};

export default QuizSetup;
