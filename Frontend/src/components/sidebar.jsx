import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    return (
        <div style={{ width: "200px", height: "100vh", background: "#f4f4f4", padding: "20px" }}>
            <h3>Dashboard</h3>
            <ul>
                <li><Link to="/quiz">Quiz Generation</Link></li>
            </ul>
            <button onClick={logout} style={{ marginTop: "20px" }}>Logout</button>
        </div>
    );
};

export default Sidebar;
