import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/login.css"; // Ensure this path is correct
import { jwtDecode } from 'jwt-decode';

const Login = () => {
    const navigate = useNavigate();
    const goToHome = () => navigate('/');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [monkeyEmoji, setMonkeyEmoji] = useState("🙉");

    // Function to handle input changes and reset error
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(""); // Clear error when user types
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(""); // Clear previous errors

        try {
            console.log("Attempting login with username:", username);

            const response = await fetch("https://maram-classmanager-backend.onrender.com/user/signin", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            console.log("Response data:", data);

            if (!response.ok) {
                console.error("Login failed with status:", response.status);
                throw new Error(data.detail || "Invalid username or password");
            }

            // Store token in localStorage
            localStorage.setItem("access_token", data.access_token);

            // Decode JWT to get role
            const decodedToken = jwtDecode(data.access_token);
            const role = decodedToken.role;
            console.log("Decoded role:", role);

            // Store role in localStorage
            localStorage.setItem("user_role", role);

            // Redirect based on role
            if (role === "admin") {
                navigate("/AdminDashboard");
            } else if (role === "teacher") {
                navigate("/TeacherDashboard");
            }

        } catch (error) {
            console.error("Error during login:", error);
            setError(error.message);
        }
    };

    const handlePasswordFocus = () => {
        setMonkeyEmoji("🙈");
    };

    const handlePasswordBlur = () => {
        setMonkeyEmoji("🙉");
    };

    return (
        <div className="login-container">
            <h1 className="login-title">"التعليم يبدأ بك! 🚀 اصنع الفرق اليوم"</h1>  {/* NEW MOTIVATIONAL TITLE */}
            <div className="animated-bg-circle"></div>
            <div className="animated-bg-circle delay"></div>

            <div className="login-box">
                <div className="login-icon">{monkeyEmoji}</div>
                <h2>Login</h2>

                {/* Error Message */}
                {error && <p className="error-message">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <span className="input-icon">👤</span>
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange(setUsername)} // Clears error when typing
                            required
                        />
                    </div>
                    <div className="input-group">
                        <span className="input-icon">🔒</span>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={handleInputChange(setPassword)} // Clears error when typing
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">Login</button>
                    <div className="login-options">
                        <a href="#" onClick={() => navigate("/ForgetPassword")}>Forgot Password?</a>
                        <a href="#" onClick={() => navigate("/signup")}>Register Here</a>
                    </div>
                    <button className="home-button" onClick={goToHome}>Back to Home</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
