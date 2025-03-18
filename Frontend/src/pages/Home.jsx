

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizSetup from "../components/QuizSetup";

const Home = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showQuizSetup, setShowQuizSetup] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login"); // Redirect if not logged in
        } else {
            setUser("User"); // Simulating user load
        }
    }, [navigate]);

    return (
        <div>
            <h2>Welcome to the Quiz</h2>
            {user ? (
                <>
                    {!showQuizSetup ? (
                        <button onClick={() => setShowQuizSetup(true)}>Start Quiz</button>
                    ) : (
                        <QuizSetup />
                    )}
                    <br />
                    <button onClick={() => {
                        localStorage.removeItem("token");
                        navigate("/login");
                    }}>
                        Logout
                    </button>
                </>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default Home;
