import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);  // New flag to track verification status
    const navigate = useNavigate();

    useEffect(() => {
        const verifyToken = async () => {
            if (verified) return;  // Prevent multiple API calls if already verified

            try {
                const apiUrl = `https://maram-classmanager-backend.onrender.com/user/verify-email?token=${token}`;
                console.log('Requesting verification from:', apiUrl);

                const response = await axios.get(apiUrl);
                setMessage(response.data.message);
                setVerified(true);  // Mark as verified

                if (response.data.message.includes('تم التحقق')) {
                    setTimeout(() => navigate('/login'), 1000);
                }
            } catch (error) {
                console.error('Verification error:', error.response?.data);
                if (error.response?.data?.detail === "Email already verified") {
                    setMessage('تم التحقق من بريدك الإلكتروني بالفعل. يمكنك تسجيل الدخول.');
                } else {
                    setMessage('فشل التحقق. حاول مرة أخرى.');
                }
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyToken();
        } else {
            setMessage('رابط التحقق غير صالح.');
            setLoading(false);
        }
    }, [token, navigate, verified]);

    return (
        <div className="verification-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            {loading ? <p>جارٍ التحقق...</p> : <p>{message}</p>}
        </div>
    );
}
