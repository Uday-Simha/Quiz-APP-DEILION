
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext"; // Import AuthProvider
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./pages/Home";

function App() {
    return (
        <Router> {/* Router should wrap everything */}
            <AuthProvider> {/* Now inside Router */}
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="*" element={<Login />} /> {/* Redirect unknown routes to Login */}
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;
