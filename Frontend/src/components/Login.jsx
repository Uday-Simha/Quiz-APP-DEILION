import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthData } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/auth/login", { username, password });

            if (res.status === 200) {
                const { access_token, user_id } = res.data;
                localStorage.setItem("token", access_token);
                localStorage.setItem("user_id", user_id);
                setAuthData({ token: access_token, user_id });
                navigate("/home");
            }
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Login</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        style={styles.input}
                    />
                    <button type="submit" style={styles.button}>Login</button>
                </form>
                <p style={styles.text}>
                    First time? <Link to="/register" style={styles.link}>Register here</Link>
                </p>
            </div>
        </div>
    );
};

// Inline styles
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
        width: "300px",
    },
    title: {
        color: "#333",
        fontSize: "24px",
        marginBottom: "20px",
    },
    input: {
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
        outline: "none",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#0056b3",
    },
    text: {
        marginTop: "10px",
        fontSize: "14px",
        color: "#666",
    },
    link: {
        color: "#007BFF",
        textDecoration: "none",
        fontWeight: "bold",
    }
};

export default Login;
