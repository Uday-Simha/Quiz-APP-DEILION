import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:8000/auth/register", { username, password });
            navigate("/login");  // Redirect to login after registering
        } catch (err) {
            alert(err.response?.data?.detail || "Registration failed");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Register</h2>
                <form onSubmit={handleRegister}>
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
                    <button type="submit" style={styles.button}>Register</button>
                </form>
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
        backgroundColor: "#28a745",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        fontSize: "16px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    buttonHover: {
        backgroundColor: "#218838",
    }
};

export default Register;
