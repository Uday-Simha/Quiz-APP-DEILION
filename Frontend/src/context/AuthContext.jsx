
import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authData, setAuthData] = useState({
        token: localStorage.getItem("token") || "",
        user_id: localStorage.getItem("user_id") || null,
    });

    useEffect(() => {
        if (!authData.token) {
            console.log("No token found. Redirect user to login inside components.");
        }
    }, [authData.token]);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user_id");
        setAuthData({ token: "", user_id: null });
    };

    return (
        <AuthContext.Provider value={{ authData, setAuthData, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
