
import { useState } from "react";
import Summary from "./Summary";

const Quiz = ({ questions, quizId }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [quizFinished, setQuizFinished] = useState(false);

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
        return <Summary answers={answers} questions={questions} quizId={quizId} />;
    }

    const currentQuestion = questions[currentIndex];

    return (
        <div>
            <h2>Question {currentIndex + 1} of {questions.length}</h2>
            <p><strong>{currentQuestion.question}</strong></p>
            <div>
                {currentQuestion.options.map((option, index) => (
                    <label key={index} style={{ display: "block", margin: "5px 0" }}>
                        <input
                            type="radio"
                            name={`question-${currentIndex}`}
                            value={option}
                            checked={answers[currentIndex] === option}
                            onChange={() => handleOptionSelect(option)}
                        />
                        {option}
                    </label>
                ))}
            </div>
            <div style={{ marginTop: "10px" }}>
                {currentIndex > 0 && <button onClick={handlePrev}>Previous</button>}
                <h1></h1>
                <button onClick={handleNext}>{currentIndex < questions.length - 1 ? "Next" : "Finish Quiz"}</button>
            </div>
        </div>
    );
};

export default Quiz;
