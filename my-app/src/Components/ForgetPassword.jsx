import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import '../styles/ForgetPassword.css';

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('https://maram-classmanager-backend.onrender.com/user/forgot-password', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.detail || 'حدث خطأ أثناء إرسال الطلب.');
            }

            setMessage('تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.');
            setError('');
        } catch (error) {
            setError(error.message);
            setMessage('');
        }
    };

    return (
        <div className="forget-password-container">
            <div className="forget-password-box">
                <h1 className="forget-password-title">
                    <FaLock className="title-icon" /> نسيت كلمة المرور
                </h1>
                <p className="forget-password-description">
                    أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
                </p>

                <form onSubmit={handleSubmit} className="forget-password-form">
                    <div className="input-group">
                        <FaEnvelope className="input-icon" />
                        <input
                            type="email"
                            placeholder="أدخل بريدك الإلكتروني"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="forget-password-button2">إرسال</button>
                </form>

                {message && <p className="success-message">{message}</p>}
                {error && <p className="error-message">{error}</p>}

                <button className="back-to-login" onClick={() => navigate('/login')}>
                    العودة إلى تسجيل الدخول
                </button>
            </div>
        </div>
    );
};

export default ForgetPassword;
