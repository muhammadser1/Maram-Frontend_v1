import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { jwtDecode } from 'jwt-decode';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import "../styles/ApprovedIndividualLessonsAdmin.css";



const ApprovedIndividualLessonsAdmin = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchStudent, setSearchStudent] = useState("");
    const getCurrentMonth = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0'); // months are 0-indexed
        return `${year}-${month}`;
    };

    const [searchDate, setSearchDate] = useState(getCurrentMonth());
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 20;
    const navigate = useNavigate();

    useEffect(() => {
        validateToken();
    }, []);

    const validateToken = () => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                const currentTime = Date.now() / 1000;

                if (decodedToken.exp < currentTime) {
                    handleTokenExpiry();
                } else if (decodedToken.role !== "admin") {
                    handleUnauthorizedAccess();
                } else {
                    fetchApprovedLessons(token);
                }
            } catch (error) {
                handleInvalidToken();
            }
        } else {
            handleInvalidToken();
        }
    };

    const handleTokenExpiry = () => {
        window.alert("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.");
        localStorage.clear();
        navigate("/login");
    };

    const handleUnauthorizedAccess = () => {
        window.alert("ليس لديك الصلاحية للوصول إلى هذه الصفحة.");
        localStorage.clear();
        navigate("/login");
    };

    const handleInvalidToken = () => {
        window.alert("رمز غير صالح، يرجى تسجيل الدخول مرة أخرى.");
        localStorage.clear();
        navigate("/login");
    };
    const handleDelete = async (lessonId) => {

        try {
            console.log("🔍 Deleting lesson with ID:", lessonId);
            const token = localStorage.getItem("access_token");
            await axios.delete(`https://maram-classmanager-backend.onrender.com/admin/admin/delete-lesson/${lessonId}?token=${token}`);

            alert("تم حذف الدرس بنجاح!");
            setLessons((prevLessons) =>
                prevLessons.filter((lesson) => lesson._id !== lessonId)
            );
        } catch (error) {
            console.error("❌ فشل في حذف الدرس:", error);
            alert("حدث خطأ أثناء حذف الدرس. حاول مرة أخرى.");
        }
    };

    const fetchApprovedLessons = async (token) => {
        try {
            const response = await axios.get(`https://maram-classmanager-backend.onrender.com/admin/approved-individual-lessons?token=${token}`);
            setLessons(response.data.approved_lessons);
        } catch (error) {
            console.error("❌ Error fetching approved individual lessons:", error);
            alert("Failed to fetch approved individual lessons.");
        }
    };

    const filteredLessons = lessons.filter((lesson) =>
        lesson.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase()) &&
        lesson.student_name.toLowerCase().includes(searchStudent.toLowerCase()) &&
        lesson.date.startsWith(searchDate)
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="teachers-container">
            <header className="teachers-header">
                <button className="back-button" onClick={() => navigate('/AdminDashboard')}>
                    <FaArrowLeft /> العودة إلى لوحة التحكم
                </button>
                <h1 className="title" style={{ textAlign: 'center', width: '100%' }}>الدروس الفردية المعتمدة</h1>
            </header>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="بحث باسم المعلم"
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="search-input"
                />
                <input
                    type="text"
                    placeholder="بحث باسم الطالب"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="search-input"
                />
                <input
                    type="month"
                    placeholder="بحث بالشهر"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="search-input"
                />

            </div>

            <div className="table-wrapper">
                <table className="teachers-table">
                    <thead>
                        <tr>
                            <th>المعلم</th>
                            <th>الطالب</th>
                            <th>عدد الساعات</th>
                            <th>المستوى التعليمي</th>
                            <th>المادة</th>
                            <th>التاريخ</th>
                            <th>الإجراءات</th>

                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((lesson) => (
                            <tr key={lesson._id}>
                                <td>{lesson.teacher_name}</td>
                                <td>{lesson.student_name}</td>
                                <td>{lesson.hours}</td>
                                <td>{lesson.education_level}</td>
                                <td>{lesson.subject}</td>
                                <td>{lesson.date}</td>
                                <td>
                                    <button
                                        className="action-button delete-button"
                                        onClick={() => handleDelete(lesson._id)}
                                    >
                                        حذف
                                    </button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredLessons.length / rowsPerPage) }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default ApprovedIndividualLessonsAdmin;
