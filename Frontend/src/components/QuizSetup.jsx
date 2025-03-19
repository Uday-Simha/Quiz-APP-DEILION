
import { useState, useContext } from "react";
import axios from "axios";
import Quiz from "./Quiz";
import AuthContext from "../context/AuthContext";

const QuizSetup = () => {
    const [topic, setTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState(5);
    const [question_level, setQuestionlevel] = useState("Easy level");
    const [quizData, setQuizData] = useState(null);
    const [quizId, setQuizId] = useState(null);
    const [error, setError] = useState("");
    const { authData } = useContext(AuthContext);

    const fetchQuiz = async () => {
        setError("");
        try {
            const response = await axios.post(
                "http://localhost:8000/quiz/generate_mcq",
                { topic, num_questions: numQuestions, question_level },
                {
                    headers: {
                        "Authorization": `Bearer ${authData.token}`,
                        "user-id": authData.user_id,
                    },
                }
            );

            if (response.status === 200) {
                setQuizData(response.data.mcqs);
                setQuizId(response.data.quiz_id);
            } else {
                setError("Failed to fetch quiz questions.");
            }
        } catch (err) {
            setError(err.response?.data?.detail || "An error occurred.");
        }
    };

    return (
        <div style={styles.container}>
            {quizData ? (
                <Quiz questions={quizData} quizId={quizId} />
            ) : (
                <div style={styles.card}>
                    <h2 style={styles.title}>Setup Your Quiz</h2>
                    {error && <p style={styles.error}>{error}</p>}
                    <input
                        type="text"
                        placeholder="Enter topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <select value={numQuestions} onChange={(e) => setNumQuestions(Number(e.target.value))} style={styles.select}>
                        <option value="5">5 Questions</option>
                        <option value="10">10 Questions</option>
                        <option value="15">15 Questions</option>
                    </select>
                    <select value={question_level} onChange={(e) => setQuestionlevel(e.target.value)} style={styles.select}>
                        <option value="Easy level">Easy</option>
                        <option value="Medium level">Medium</option>
                        <option value="Hard level">Hard</option>
                    </select>
                    <button style={styles.button} onClick={fetchQuiz}>Start Quiz</button>
                </div>
            )}
        </div>
    );
};

// Styles
const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f4f4f9",
    },
    card: {
        backgroundColor: "#ffffff",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        textAlign: "center",
        width: "400px",
    },
    title: {
        fontSize: "22px",
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
        outline: "none",
    },
    select: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        borderRadius: "5px",
        border: "1px solid #ccc",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#2575fc",
        color: "white",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
    },
    error: {
        color: "red",
        fontSize: "14px",
        marginBottom: "10px",
    }
};

export default QuizSetup;
