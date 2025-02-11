import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ResetPassword.css';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!token) {
            console.error('Token is missing from the URL.');
            setError('رابط غير صالح أو مفقود.');
        } else {
            console.log('Token found:', token);
        }
    }, [token]);

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setError('كلمات المرور غير متطابقة.');
            console.warn('Passwords do not match.');
            return;
        }

        setLoading(true);

        try {
            console.log('Sending request to reset password...');
            const response = await axios.post('https://maram-classmanager-backend.onrender.com/user/reset-password', {
                token,
                new_password: password,
            });

            console.log('Response from server:', response.data);
            setMessage('تم تعيين كلمة المرور الجديدة بنجاح! يمكنك تسجيل الدخول الآن.');
            setError('');

            // Redirect to login page after 3 seconds
            setTimeout(() => {
                console.log('Redirecting to login page...');
                navigate('/login');
            }, 3000);
        } catch (error) {
            console.error('Error occurred while resetting password:', error.response?.data);
            setError(error.response?.data?.detail || 'فشل إعادة تعيين كلمة المرور. حاول مرة أخرى.');
            setMessage('');

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="reset-password-container">
            <div className="reset-password-box">
                <h1 className="reset-password-title">إعادة تعيين كلمة المرور</h1>
                <p className="reset-password-description">
                    أدخل كلمة المرور الجديدة الخاصة بك.
                </p>

                {error && <p className="error-message">{error}</p>}
                {message && <p className="success-message">{message}</p>}

                <form onSubmit={handleResetPassword} className="reset-password-form">
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="كلمة المرور الجديدة"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="تأكيد كلمة المرور"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="reset-password-button" disabled={loading}>
                        {loading ? 'جاري إعادة التعيين...' : 'إعادة تعيين'}
                    </button>
                </form>

                <button className="back-to-login" onClick={() => navigate('/login')}>
                    العودة إلى تسجيل الدخول
                </button>
            </div>
        </div>
    );
};

export default ResetPassword;
