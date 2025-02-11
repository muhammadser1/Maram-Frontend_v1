import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../styles/Signup.css";
const Signup = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [birthday, setBirthday] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [monkeyEmoji, setMonkeyEmoji] = useState("🙉");
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        const formData = {
            username,
            email,
            birthday,
            password,
            role: "teacher"
        };

        try {
            const response = await fetch("https://maram-classmanager-backend.onrender.com/user/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error("Signup failed");
            }

            const data = await response.json();
            console.log("Signup successful:", data);
            setTimeout(() => navigate("/login"), 2000); // Redirect to login after 2 seconds
        } catch (error) {
            console.error("Signup error:", error.message);
            setError(error.message); // Set the specific error message
        }
    };

    const handlePasswordFocus = () => {
        setMonkeyEmoji("🙈");
    };

    const handlePasswordBlur = () => {
        setMonkeyEmoji("🙉");
    };

    return (
        <div className="signup-container">
            {/* Arabic Motivational Title */}
            <h2 className="signup-title">✨ سجل وانضم إلينا في رحلتنا التعليمية ✨</h2>

            {/* Signup Box */}
            <div className="signup-box">
                <div className="signup-icon">{monkeyEmoji}</div>
                <h2>Sign Up</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="animated-bg-circle"></div>
                    <div className="animated-bg-circle delay"></div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="date"
                            placeholder="Birthday"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            onFocus={handlePasswordFocus}
                            onBlur={handlePasswordBlur}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="signup-button">Sign Up</button>
                    <div className="signup-options">
                        <a href="#" onClick={() => navigate("/login")}>Already have an account? Login</a>
                    </div>
                    <button className="home-button" onClick={() => navigate("/")}>Back to Home</button>
                </form>
            </div>
        </div>
    );
};

export default Signup;
