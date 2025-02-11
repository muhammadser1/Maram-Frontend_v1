import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResendVerification = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const resendVerificationEmail = async () => {
            try {
                const response = await axios.post('https://maram-classmanager-backend.onrender.com/user/resend-verification', { email });
                setMessage(response.data.message);

                // Redirect to login after successful resend
                setTimeout(() => navigate('/login'), 3000);
            } catch (error) {
                setMessage(error.response?.data?.detail || 'فشل في إعادة إرسال رسالة التحقق. حاول مرة أخرى.');
            } finally {
                setLoading(false);
            }
        };

        if (email) {
            resendVerificationEmail();
        } else {
            setMessage('البريد الإلكتروني غير صالح.');
            setLoading(false);
        }
    }, [email, navigate]);

    return (
        <div className="verification-container" style={{ textAlign: 'center', marginTop: '50px' }}>
            {loading ? <p>جارٍ إرسال رسالة التحقق...</p> : <p>{message}</p>}
        </div>
    );
};

export default ResendVerification;
