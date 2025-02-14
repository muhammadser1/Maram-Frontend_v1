import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { FaChalkboardTeacher, FaUsers, FaClock, FaCheckCircle, FaSchool, FaHourglassHalf } from 'react-icons/fa';
import "../styles/AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [adminName, setAdminName] = useState('');
    const instituteName = "معهد المرام"; // Replace with dynamic data if needed

    useEffect(() => {
        validateToken();
    }, []);

    const validateToken = () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    handleTokenExpiry();
                } else if (decodedToken.role !== 'admin') {
                    handleUnauthorizedAccess();
                } else {
                    setAdminName(decodedToken.name || 'مسؤول');
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

    const handleUnauthorizedAccess = () => {
        window.alert('ليس لديك الصلاحية للوصول إلى هذه الصفحة.');
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
            } else if (decodedToken.role !== 'admin') {
                handleUnauthorizedAccess();
            } else {
                action();
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
        <div className="admin-dashboard-container">
            <header className="admin-dashboard-header">
                <div className="institute-name">
                    <FaSchool className="school-icon" /> {instituteName}
                </div>
                <div className="admin-profile">
                    <span className="admin-name">{adminName}</span>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        تسجيل الخروج
                    </motion.button>
                </div>
            </header>

            <div className="admin-dashboard-body">
                <aside className="sidebar">
                    <SidebarButton
                        title="الدروس الفردية"
                        icon={<FaClock />}
                        onClick={() => handleActionClick(() => navigate('/ApprovedIndividualLessonsAdmin'))}
                    />
                    <SidebarButton
                        title="الدروس الفردية المعلقة"
                        icon={<FaHourglassHalf />}
                        onClick={() => handleActionClick(() => navigate('/PendingIndividualLessonsAdmin'))}
                    />
                    <br />
                    <SidebarButton
                        title="دروس المجموعات"
                        icon={<FaUsers />}
                        onClick={() => handleActionClick(() => navigate('/ApprovedGroupLessonsAdmin'))}
                    />
                    <SidebarButton
                        title="دروس المجموعات المعلقة"
                        icon={<FaHourglassHalf />}
                        onClick={() => handleActionClick(() => navigate('/PendingGroupLessonsAdmin'))}
                    />
                    <br />
                    <SidebarButton
                        title="نظرة عامة"
                        icon={<FaChalkboardTeacher />}
                        onClick={() => handleActionClick(() => navigate('/SystemOverview'))}
                    />
                </aside>

                <main className="admin-dashboard-main">
                    <section className="profile-section">
                        <h2>معلومات المسؤول</h2>
                        <div className="profile-card centered-profile">
                            <p><strong>الاسم:</strong> {adminName}</p>
                            <p><strong>البريد الإلكتروني:</strong> admin@example.com</p>
                            <p><strong>الدور:</strong> مسؤول النظام</p>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

function SidebarButton({ title, icon, onClick }) {
    return (
        <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="sidebar-button"
            onClick={onClick}
        >
            <div className="button-icon">{icon}</div>
            <span className="button-title">{title}</span>
        </motion.div>
    );
}

export default AdminDashboard;
