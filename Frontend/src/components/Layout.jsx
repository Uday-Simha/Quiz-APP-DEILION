import { Link, useLocation, useNavigate, Outlet  } from "react-router-dom";

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token"); // Clear token
        navigate("/login"); // Redirect to login
    };

    return (
        <div style={styles.container}>
            {/* Sidebar */}
            <div style={styles.sidebar}>
                <h2 style={styles.logo}>Quiz App</h2>
                <ul style={styles.navList}>
                    <li style={location.pathname === "/home" ? styles.activeNavItem : styles.navItem}>
                        <Link to="/home" style={styles.link}>🏠 Home</Link>
                    </li>
                    <li style={location.pathname === "/dashboard" ? styles.activeNavItem : styles.navItem}>
                        <Link to="/dashboard" style={styles.link}>📊 Dashboard</Link>
                    </li>
                </ul>

                {/* Logout Button in Sidebar */}
                <button onClick={handleLogout} style={styles.logoutButton}>🚪 Logout</button>
            </div>

            {/* Page Content */}
            <div style={styles.content}>
                <Outlet />  {/* Renders either Home or Dashboard */}
            </div>
        </div>
    );
};

// Inline styles
const styles = {
    container: {
        display: "flex",
        height: "100vh",
    },
    sidebar: {
        width: "250px",
        background: "#2575fc",
        color: "white",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between", // Keeps items spaced out
    },
    logo: {
        fontSize: "22px",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "20px",
    },
    navList: {
        listStyle: "none",
        padding: "0",
    },
    navItem: {
        padding: "10px",
        borderRadius: "5px",
    },
    activeNavItem: {
        padding: "10px",
        backgroundColor: "#1a5bd1",
        borderRadius: "5px",
    },
    link: {
        textDecoration: "none",
        color: "white",
        fontSize: "18px",
        display: "block",
    },
    logoutButton: {
        marginTop: "auto", // Pushes logout button to the bottom
        padding: "10px",
        backgroundColor: "#ff4d4d",
        border: "none",
        color: "white",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        textAlign: "center",
        transition: "background-color 0.3s",
    },
    logoutButtonHover: {
        backgroundColor: "#cc0000",
    },
    content: {
        flexGrow: "1",
        padding: "20px",
        background: "#f4f4f9",
    }
};

export default Layout;
