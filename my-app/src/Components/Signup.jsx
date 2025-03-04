import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Signup.css";

const Signup = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [birthday, setBirthday] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [monkeyEmoji, setMonkeyEmoji] = useState("🙉");

    const navigate = useNavigate();

    // Function to validate age (must be at least 18)
    const isValidAge = (birthday) => {
        const birthDate = new Date(birthday);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        return age >= 18;
    };

    // Reset error when user types
    const handleInputChange = (setter) => (e) => {
        setter(e.target.value);
        setError(""); // Clear error when user types
        setSuccessMessage(""); // Clear success message
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setSuccessMessage("");
        setLoading(true);

        // Password match check
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        // Age validation
        if (!isValidAge(birthday)) {
            setError("You must be at least 18 years old to sign up.");
            setLoading(false);
            return;
        }

        const formData = {
            username,
            email,
            birthday,
            password,
            role: "teacher",
        };

        try {
            const response = await fetch("https://maram-classmanager-backend.onrender.com/user/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.detail || "Signup failed");
            }

            setSuccessMessage("Signup successful! Please check your email to verify your account.");
            setTimeout(() => navigate("/login"), 3000); // Redirect after 3 seconds
        } catch (error) {
            if (error.message.includes("User with this email or username already exists")) {
                setError("Username or email is already registered.");
            } else {
                setError(error.message);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <h2 className="signup-title">✨ سجل وانضم إلينا في رحلتنا التعليمية ✨</h2>

            <div className="signup-box">
                <div className="signup-icon">{monkeyEmoji}</div>
                <h2>Sign Up</h2>

                {/* Show success or error messages */}
                {error && <p className="error-message">{error}</p>}
                {successMessage && <p className="success-message">{successMessage}</p>}

                <form onSubmit={handleSignup}>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={handleInputChange(setUsername)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={handleInputChange(setEmail)}
                            required
                        />
                    </div>
                    <div className="input-group">
<input
    type="date"
    placeholder="Birthday"
    value={birthday}
    onChange={(e) => setBirthday(e.target.value)}
    className="birthday-input"
    required
/>

                    </div>


                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onFocus={() => setMonkeyEmoji("🙈")}
                            onBlur={() => setMonkeyEmoji("🙉")}
                            onChange={handleInputChange(setPassword)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onFocus={() => setMonkeyEmoji("🙈")}
                            onBlur={() => setMonkeyEmoji("🙉")}
                            onChange={handleInputChange(setConfirmPassword)}
                            required
                        />
                    </div>

                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading ? "Signing Up..." : "Sign Up"}
                    </button>

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
