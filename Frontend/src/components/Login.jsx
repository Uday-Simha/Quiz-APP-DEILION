
import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import axios from "axios";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setAuthData } = useContext(AuthContext); // Get `setAuthData` from AuthContext
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:8000/auth/login", { username, password });

            if (res.status === 200) {
                const { access_token, user_id } = res.data;

                // Store token & user ID in localStorage
                localStorage.setItem("token", access_token);
                localStorage.setItem("user_id", user_id);

                // Update authentication state
                setAuthData({ token: access_token, user_id });

                // Redirect to home
                navigate("/home");
            }
        } catch (error) {
            alert("Login failed: " + (error.response?.data?.detail || error.message));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <br></br>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br></br>
                <button type="submit">Login</button>
            </form>
            <p>First time? <Link to="/register">Register here</Link></p>
        </div>
    );
};

export default Login;
