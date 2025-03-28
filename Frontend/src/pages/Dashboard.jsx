import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const Dashboard = () => {
    const { authData } = useContext(AuthContext);
    const [quizAttempts, setQuizAttempts] = useState([]);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;  
    const navigate = useNavigate();

    useEffect(() => {
        if (!authData.token) {
            navigate("/login"); // Redirect if not logged in
            return;
        }

        const fetchQuizAttempts = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8000/quiz/quiz/attempts/${authData.user_id}`,
                    {
                        headers: { "Authorization": `Bearer ${authData.token}` }
                    }
                );
                setQuizAttempts(response.data);
            } catch (err) {
                setError("Failed to load quiz attempts.");
                console.error(err);
            }
        };

        fetchQuizAttempts();
    }, [authData, navigate]);

    // **Pagination Logic**
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = quizAttempts.slice(indexOfFirstRecord, indexOfLastRecord);

    const nextPage = () => {
        if (indexOfLastRecord < quizAttempts.length) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <div style={styles.dashboardContainer}>
            <h2 style={styles.title}>Quiz History</h2>
            {error && <p style={styles.error}>{error}</p>}
            {currentRecords.length > 0 ? (
                <>
                    <table style={styles.quizTable}>
                        <thead>
                            <tr style={styles.headerRow}>
                                <th style={styles.th}>Quiz ID</th>
                                <th style={styles.th}>Topic</th>
                                <th style={styles.th}>Score</th>
                                <th style={styles.th}>Time Taken (sec)</th>  {/* ✅ Show Time */}
                                <th style={styles.th}>Correct Answers</th>
                                <th style={styles.th}>Incorrect Answers</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((attempt) => (
                                <tr key={attempt.id} style={styles.row}>
                                    <td style={styles.td}>{attempt.id}</td>
                                    <td style={styles.td}>{attempt.topic}</td>
                                    <td style={styles.td}>{attempt.score}</td>
                                    <td style={styles.td}>{attempt.time_taken} sec</td>  {/* ✅ Show Time Taken */}
                                    <td style={styles.td}>{attempt.correct_answers_count}</td>
                                    <td style={styles.td}>{attempt.incorrect_answers_count}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div style={styles.pagination}>
                        {indexOfLastRecord < quizAttempts.length && (
                            <button style={styles.button} onClick={nextPage}>Next</button>
                        )}
                    </div>
                </>
            ) : (
                <p style={styles.noData}>No quiz attempts found.</p>
            )}
        </div>
    );
};

// Styles
const styles = {
    dashboardContainer: { maxWidth: "800px", margin: "40px auto", padding: "20px", background: "white", borderRadius: "10px", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)", textAlign: "center" },
    title: { color: "#333", fontSize: "24px", marginBottom: "20px" },
    error: { color: "red", fontSize: "14px", marginBottom: "10px" },
    quizTable: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
    headerRow: { backgroundColor: "#2575fc", color: "white" },
    th: { padding: "12px", border: "1px solid #ddd", fontSize: "16px" },
    row: { backgroundColor: "#f9f9f9" },
    td: { padding: "10px", border: "1px solid #ddd", textAlign: "center" },
    noData: { color: "#555", fontSize: "16px", marginTop: "20px" },
    pagination: { marginTop: "20px", textAlign: "center" },
    button: { padding: "10px", backgroundColor: "#2575fc", color: "white", border: "none", borderRadius: "5px", cursor: "pointer", transition: "background-color 0.3s" }
};

export default Dashboard;
