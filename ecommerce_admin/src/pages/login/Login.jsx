// Login.js
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../../redux/apiCalls";
import { Redirect } from "react-router-dom";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [isLoggingIn, setIsLoggingIn] = useState(false); // New state to manage login delay
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.user.currentUser);

    const handleClick = async () => {
        try {
            setIsLoggingIn(true); // Start login delay
            await login(dispatch, { username, password });
            // Wait 1 second before proceeding to ensure persist state is ready
            setTimeout(() => {
                setIsLoggingIn(false); // End login delay
            }, 1000);
        } catch (err) {
            console.log("Login failed:", err);
            setIsLoggingIn(false);
        }
    };

    // Redirect to "/" if logged in and is an admin, and not in the delay period
    if (currentUser && currentUser.isAdmin && !isLoggingIn) {
        return <Redirect to="/" />;
    }

    return (
        <div style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center"
        }}>
            <input
                style={{ padding: 10, marginBottom: 20 }}
                type="text"
                placeholder="username"
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                style={{ padding: 10, marginBottom: 20 }}
                type="password" // Changed type to password for security
                placeholder="password"
                onChange={(e) => setPassword(e.target.value)}
            />
            <button
                style={{ padding: 10, width: 100 }}
                onClick={handleClick}
                disabled={isLoggingIn} // Disable button during login delay
            >
                {isLoggingIn ? "Logging in..." : "Login"}
            </button>
        </div>
    );
};

export default Login;