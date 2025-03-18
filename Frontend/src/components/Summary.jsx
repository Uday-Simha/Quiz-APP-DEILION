
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Summary = ({ answers, questions, quizId }) => {
    const [correctCount, setCorrectCount] = useState(0);
    const [totalQuestions, setTotalQuestions] = useState(questions.length);
    const [scoreUpdated, setScoreUpdated] = useState(false);
    const [displayScore, setDisplayScore] = useState("");
    const { authData } = useContext(AuthContext); // Get token from AuthContext

    useEffect(() => {
        // Calculate score
        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correct_answer) {
                correct++;
            }
        });
        setCorrectCount(correct);

        // Send score update to API
        updateScore(correct);
    }, []);

    const updateScore = async (score) => {
        try {
            const response = await axios.put(
                "http://localhost:8000/quiz/update_score",
                { quiz_id: quizId, score: score },
                {
                    headers: {
                        "Authorization": `Bearer ${authData.token}`, // Pass auth token
                    },
                }
            );

            if (response.status === 200) {
                setScoreUpdated(true);
                setDisplayScore(response.data.display_score);
            }
        } catch (error) {
            console.error("Error updating score:", error.response?.data?.detail || error.message);
        }
    };

    return (
        <div>
            <h2>Quiz Summary</h2>
            <p><strong>Total Questions:</strong> {totalQuestions}</p>
            <p><strong>Correct Answers:</strong> {correctCount}</p>
            <p><strong>Final Score:</strong> {displayScore || `${correctCount}/${totalQuestions}`}</p>

            {scoreUpdated && <p style={{ color: "green" }}>✅ Score updated successfully!</p>}

            {questions.map((question, index) => (
                <div key={index} style={{ marginBottom: "10px" }}>
                    <p><strong>{index + 1}. {question.question}</strong></p>
                    <p>Your Answer: {answers[index] || "Not Answered"}</p>
                    <p>Correct Answer: {question.correct_answer}</p>
                </div>
            ))}
            <button onClick={() => window.location.reload()}>Restart Quiz</button>
        </div>
    );
};

export default Summary;
