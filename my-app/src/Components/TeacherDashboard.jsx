import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { FaChalkboardTeacher, FaBookOpen, FaUsers, FaClock, FaCheckCircle } from 'react-icons/fa';
import "../styles/TeacherDashboard.css";

function TeacherDashboard() {
    const navigate = useNavigate();
    const [teacherName, setTeacherName] = useState('');

    useEffect(() => {
        validateToken();  // Check the token on page load
    }, []);

    const validateToken = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    handleTokenExpiry();
                } else {
                    setTeacherName(decodedToken.sub || 'معلم');
                }
            } catch (error) {
                handleInvalidToken();
            }
        } else {
            handleInvalidToken();
        }
    };

    const handleTokenExpiry = () => {
        window.alert('انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.');
        localStorage.clear();
        navigate('/login');
    };

    const handleInvalidToken = () => {
        window.alert('رمز غير صالح، يرجى تسجيل الدخول مرة أخرى.');
        localStorage.clear();
        navigate('/login');
    };

    const handleActionClick = (action) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp < currentTime) {
                handleTokenExpiry();
            } else {
                action();  // Execute the action if the token is valid
            }
        } else {
            handleInvalidToken();
        }
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="teacher-dashboard-container">
            <header className="teacher-dashboard-header">
                <h1 className="teacher-dashboard-title">مرحبًا، {teacherName}!</h1>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="logout-button"
                    onClick={handleLogout}
                >
                    تسجيل الخروج
                </motion.button>
            </header>

            <main className="teacher-dashboard-main">
                <div className="dashboard-grid">
                    <div className="grid-column">
                        <motion.h2
                            className="column-title"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ color: '#00416A', backgroundColor: '#E4F1FE', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            الدروس الفردية
                        </motion.h2>
                        <DashboardCard
                            title="إرسال درس فردي جديد"
                            icon={<FaBookOpen />}
                            onClick={() => handleActionClick(() => navigate('/CreateIndividualLesson'))}
                        />
                        <DashboardCard
                            title="عرض الدروس الفردية المعلقة"
                            icon={<FaClock />}
                            onClick={() => handleActionClick(() => navigate('/ViewPendingIndividualLessons'))}
                        />
                        <DashboardCard
                            title="عرض الدروس الفردية المعتمدة"
                            icon={<FaCheckCircle />}
                            onClick={() => handleActionClick(() => navigate('/ViewApprovedIndividualLessons'))}
                        />
                    </div>

                    <div className="grid-image">
                        <h2 className="creative-text" style={{ textAlign: 'left', marginLeft: '20px' }}>✨🚀 مرحبًا بك في لوحة التحكم الخاصة بك!</h2>
                        <img src="../images/logo-removebg-preview.png" alt="عرض لوحة التحكم" className="large-image expanded-image" />
                        <div className="dashboard-overview" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                            <DashboardCard
                                title="نظرة عامة على لوحة التحكم"
                                icon={<FaChalkboardTeacher />}
                                onClick={() => handleActionClick(() => navigate('/DashboardOverview'))}
                            />
                        </div>
                    </div>

                    <div className="grid-column">
                        <motion.h2
                            className="column-title"
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            style={{ color: '#00416A', backgroundColor: '#D5F5E3', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                            دروس المجموعات
                        </motion.h2>
                        <DashboardCard
                            title="إرسال درس جماعي جديد"
                            icon={<FaUsers />}
                            onClick={() => handleActionClick(() => navigate('/CreateGroupLesson'))}
                        />
                        <DashboardCard
                            title="عرض الدروس الجماعية المعلقة"
                            icon={<FaClock />}
                            onClick={() => handleActionClick(() => navigate('/ViewPendingGroupLessons'))}
                        />
                        <DashboardCard
                            title="عرض الدروس الجماعية المعتمدة"
                            icon={<FaCheckCircle />}
                            onClick={() => handleActionClick(() => navigate('/ViewApprovedGroupLessons'))}
                        />
                    </div>
                </div>
            </main>

            <div className="animated-bg-circle"></div>
            <div className="animated-bg-circle delay"></div>
        </div>
    );
}

function DashboardCard({ title, icon, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, rotate: 1 }}
            whileTap={{ scale: 0.95 }}
            className="dashboard-card smaller-card"
            onClick={onClick}
            style={{ cursor: 'pointer', backgroundColor: '#f9f9f9', border: '2px solid transparent' }}>
            <div className="card-icon">{icon}</div>
            <h2 className="card-title">{title}</h2>
        </motion.div>
    );
}

export default TeacherDashboard;
