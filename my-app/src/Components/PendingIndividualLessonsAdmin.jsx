import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import "../styles/PendingIndividualLessonsAdmin.css";

const PendingIndividualLessonsAdmin = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchStudent, setSearchStudent] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
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
                    fetchPendingLessons(token);
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

    const fetchPendingLessons = async (token) => {
        try {
            console.log(`🔍 Fetching: https://maram-classmanager-backend.onrender.com/admin/pending-individual-lessons?token=${token}`);
            const response = await axios.get(`https://maram-classmanager-backend.onrender.com/admin/pending-individual-lessons?token=${token}`);
            console.log("✅ Response:", response.data);
            setLessons(response.data.pending_lessons);
        } catch (error) {
            console.error("❌ Error fetching pending individual lessons:", error);
            if (error.response) {
                console.error("❌ Server Response:", error.response.data);
            }
            alert("Failed to fetch pending individual lessons.");
        }
    };

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(`http://127.0.0.1:8000/admin/approve-individual-lesson/${id}?token=${token}`);
            setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== id));
            alert("✅ تمت الموافقة على الدرس!");
        } catch (error) {
            console.error("❌ Error approving lesson:", error);
            alert("Failed to approve the lesson.");
        }
    };

    const handleReject = async (id) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.post(`http://localhost:8000/admin/reject-individual-lesson/${id}?token=${token}`);
            setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== id));
            alert("❌ تم رفض الدرس!");
        } catch (error) {
            console.error("❌ Error rejecting lesson:", error);
            alert("Failed to reject the lesson.");
        }
    };

    const filteredLessons = lessons.filter((lesson) =>
        lesson.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase()) &&
        lesson.student_name.toLowerCase().includes(searchStudent.toLowerCase()) &&
        lesson.date.includes(searchDate)
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
                <h1 className="title" style={{ textAlign: 'center', width: '100%' }}>الدروس الفردية المعلقة</h1>
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
                    type="date"
                    placeholder="بحث بالتاريخ"
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
                                    <button onClick={() => handleApprove(lesson._id)} className="approve-button">الموافقة</button>
                                    <button onClick={() => handleReject(lesson._id)} className="reject-button">رفض</button>
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

export default PendingIndividualLessonsAdmin;
