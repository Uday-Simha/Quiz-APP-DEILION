import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../context/AuthContext";

const Summary = ({ answers, questions, quizId, elapsedTime }) => {
    const [correctCount, setCorrectCount] = useState(0);
    const [scoreUpdated, setScoreUpdated] = useState(false);
    const [displayScore, setDisplayScore] = useState("");
    const { authData } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correct_answer) {
                correct++;
            }
        });
        setCorrectCount(correct);

        updateScore(correct);
    }, []);

    const updateScore = async (score) => {
        try {
            const response = await axios.put(
                "http://localhost:8000/quiz/update_score",
                { quiz_id: quizId, score: score, time_taken: elapsedTime }, // Send time taken
                {
                    headers: {
                        "Authorization": `Bearer ${authData.token}`,
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

    const goToDashboard = () => {
        navigate("/dashboard");
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Quiz Summary</h2>
                <p style={styles.text}><strong>Total Questions:</strong> {questions.length}</p>
                <p style={styles.text}><strong>Correct Answers:</strong> {correctCount}</p>
                <p style={styles.text}><strong>Time Taken:</strong> {elapsedTime} seconds</p>
                <p style={styles.text}><strong>Final Score:</strong> {displayScore || `${correctCount}/${questions.length}`}</p>

                {scoreUpdated && <p style={styles.successMessage}>✅ Score updated successfully!</p>}

                {/* Buttons */}
                <div style={styles.buttonContainer}>
                    <button style={styles.button} onClick={() => window.location.reload()}>Restart Quiz</button>
                    <button style={styles.dashboardButton} onClick={goToDashboard}>Go to Dashboard</button>
                </div>
            </div>
        </div>
    );
};

// Styles
const styles = {
    container: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#f4f4f9" },
    card: { backgroundColor: "#ffffff", padding: "30px", borderRadius: "10px", boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", textAlign: "center", width: "400px" },
    title: { color: "#333", fontSize: "22px", marginBottom: "15px" },
    text: { fontSize: "16px", marginBottom: "10px" },
    successMessage: { color: "green", fontSize: "14px", marginBottom: "10px" },
    buttonContainer: { display: "flex", justifyContent: "space-between", marginTop: "15px" },
    button: { padding: "10px 15px", border: "none", borderRadius: "5px", backgroundColor: "#2575fc", color: "white", fontSize: "16px", cursor: "pointer", transition: "background-color 0.3s" },
    dashboardButton: { padding: "10px 15px", border: "none", borderRadius: "5px", backgroundColor: "#28a745", color: "white", fontSize: "16px", cursor: "pointer", transition: "background-color 0.3s" }
};

export default Summary;
