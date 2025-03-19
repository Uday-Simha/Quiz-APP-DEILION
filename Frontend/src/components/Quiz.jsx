import { useState, useEffect } from "react";
import Summary from "./Summary";

const Quiz = ({ questions, quizId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // Start time at 0

    useEffect(() => {
        // Start the timer when the quiz begins
        const timer = setInterval(() => {
            setElapsedTime((prevTime) => prevTime + 1);
        }, 1000);

        return () => clearInterval(timer); // Cleanup timer when unmounting
    }, []);

    const handleOptionSelect = (option) => {
        setAnswers({ ...answers, [currentIndex]: option });
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setQuizFinished(true);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    if (quizFinished) {
        return <Summary answers={answers} questions={questions} quizId={quizId} elapsedTime={elapsedTime} />;
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Question {currentIndex + 1} of {questions.length}</h2>
                <p style={styles.timer}>⏳ Time: {elapsedTime} sec</p> {/* ✅ Real-time updating */}
                <p style={styles.question}><strong>{currentQuestion.question}</strong></p>
                <div style={styles.optionsContainer}>
                    {currentQuestion.options.map((option, index) => (
                        <label key={index} style={styles.optionLabel}>
                            <input
                                type="radio"
                                name={`question-${currentIndex}`}
                                value={option}
                                checked={answers[currentIndex] === option}
                                onChange={() => handleOptionSelect(option)}
                                style={styles.radio}
                            />
                            {option}
                        </label>
                    ))}
                </div>
                <div style={styles.buttonContainer}>
                    {currentIndex > 0 && <button style={styles.button} onClick={handlePrev}>Previous</button>}
                    <button style={styles.button} onClick={handleNext}>
                        {currentIndex < questions.length - 1 ? "Next" : "Finish Quiz"}
                    </button>
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
    timer: { fontSize: "18px", color: "#ff6347", marginBottom: "10px" },
    question: { fontSize: "18px", marginBottom: "15px" },
    optionsContainer: { textAlign: "left" },
    optionLabel: { display: "block", padding: "10px", backgroundColor: "#f9f9f9", borderRadius: "5px", marginBottom: "8px", cursor: "pointer", transition: "background-color 0.3s" },
    radio: { marginRight: "10px" },
    buttonContainer: { marginTop: "15px" },
    button: { padding: "10px 15px", margin: "5px", border: "none", borderRadius: "5px", backgroundColor: "#2575fc", color: "white", fontSize: "16px", cursor: "pointer", transition: "background-color 0.3s" }
};

export default Quiz;
