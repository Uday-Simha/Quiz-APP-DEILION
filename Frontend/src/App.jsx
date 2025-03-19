import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";
import Layout from "./components/Layout";  // Import Layout
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* Protected Layout with Sidebar */}
                    <Route path="/" element={<Layout />}>
                        <Route path="home" element={<Home />} />
                        <Route path="dashboard" element={<Dashboard />} />
                    </Route>

                    {/* Redirect unknown routes to Login */}
                    <Route path="*" element={<Login />} />
                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;

