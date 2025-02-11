import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import '../styles/CreateIndividualLesson.css';

export default function CreateIndividualLesson() {
    const navigate = useNavigate();

    // ✅ Set default date to today
    const getTodayDate = () => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    };

    const [formData, setFormData] = useState({
        date: getTodayDate(), // ✅ Default date to today
        teacher_name: '',
        student_name: '',
        hours: '',
        subject: '',
        education_level: '',
    });

    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    // Decode teacher name from JWT
    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const teacherName = decodedToken.username || ''; // Fix here
                setFormData((prevData) => ({ ...prevData, teacher_name: teacherName }));
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }
    }, []);

    // ✅ Convert Arabic hour labels to decimal values
    const hourOptions = {
        "ساعة": 1,
        "ساعة وربع": 1.25,
        "ساعة ونصف": 1.5,
        "ساعة و45 دقيقة": 1.75,
        "ساعتان": 2,
        "ساعتان وربع": 2.25,
        "ساعتان ونصف": 2.5,
        "ساعتان و45 دقيقة": 2.75,
        "3 ساعات": 3,
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                setError('الرجاء تسجيل الدخول أولاً');
                return;
            }

            // ✅ Ensure the data format matches FastAPI expectations
            const formattedData = {
                date: new Date(formData.date).toISOString(), // ✅ Convert date to ISO format
                teacher_name: formData.teacher_name,
                student_name: formData.student_name,
                hours: hourOptions[formData.hours] || 1, // ✅ Convert Arabic hour format to float
                subject: formData.subject,
                education_level: formData.education_level,
                approved: false // ✅ Explicitly set approved
            };

            console.log('📤 Sending Data:', JSON.stringify(formattedData, null, 2)); // ✅ Log request data
            console.log('🔑 Using Token as Query Parameter:', token); // ✅ Log token placement

            // ✅ Send token as a query parameter instead of in headers
            const response = await axios.post(`https://maram-classmanager-backend.onrender.com/teacher/submit?token=${token}`, formattedData, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            setMessage('تم إنشاء الدرس الفردي بنجاح!');
            setError('');
        } catch (err) {
            console.error('❌ Error:', err.response);

            if (err.response?.data?.detail) {
                const errorDetails = err.response.data.detail.map((err) => `⚠️ ${err.msg}`).join(", ");
                setError(errorDetails);
            } else {
                setError('فشل إنشاء الدرس. حاول مرة أخرى.');
            }

            setMessage('');
        }
    };

    return (
        <div className="create-lesson-container">
            <h1 className="create-lesson-title">إنشاء درس فردي جديد</h1>
            {message && <p className="success-message">{message}</p>}
            {error && <p className="error-message">{error}</p>}

            <form onSubmit={handleSubmit} className="create-lesson-form">
                <label>تاريخ الدرس:</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} required />

                <label>اسم المعلم:</label>
                <input type="text" name="teacher_name" value={formData.teacher_name} readOnly />

                <label>اسم الطالب:</label>
                <input type="text" name="student_name" value={formData.student_name} onChange={handleChange} required />

                <label>عدد الساعات:</label>
                <select name="hours" value={formData.hours} onChange={handleChange} required>
                    <option value="">اختر عدد الساعات</option>
                    {Object.keys(hourOptions).map((label) => (
                        <option key={label} value={label}>{label}</option>
                    ))}
                </select>

                <label>المادة:</label>
                <input type="text" name="subject" value={formData.subject} onChange={handleChange} required />

                <label>المستوى التعليمي:</label>
                <select name="education_level" value={formData.education_level} onChange={handleChange} required>
                    <option value="">اختر المستوى التعليمي</option>
                    <option value="ابتدائي">ابتدائي</option>
                    <option value="إعدادي">إعدادي</option>
                    <option value="ثانوي">ثانوي</option>
                </select>

                <button type="submit" className="submit-button">إنشاء الدرس</button>
            </form>

            <button className="back-button" onClick={() => navigate('/TeacherDashboard')}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
}
