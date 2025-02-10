import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/PendingGroupLessonsAdmin.css";

const PendingGroupLessonsAdmin = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchStudent, setSearchStudent] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No token found. Please log in.");
            navigate("/login");
            return;
        }

        try {
            jwtDecode(token);
        } catch (error) {
            console.error("Failed to decode token:", error);
            alert("Invalid or expired token. Please log in again.");
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchPendingLessons = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) return;

            try {
                const response = await fetch(`http://127.0.0.1:8000/admin/pending-group-lessons?token=${token}`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "Failed to fetch lessons");
                }

                // Ensure `_id` is a string for frontend use
                setLessons(data.pending_lessons.map(lesson => ({
                    ...lesson,
                    _id: String(lesson._id)
                })));
            } catch (error) {
                console.error("Error fetching pending lessons:", error);
                alert("حدث خطأ أثناء جلب الدروس المعلقة.");
            }
        };

        fetchPendingLessons();
    }, []);

    const filteredLessons = lessons.filter((lesson) =>
        lesson.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase()) &&
        lesson.student_names.some(student => student.toLowerCase().includes(searchStudent.toLowerCase())) &&
        lesson.date.includes(searchDate)
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

    const handleApprove = async (id) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/approve-group-lesson/${id}?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to approve lesson");

            setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== id));
            alert("تمت الموافقة على الدرس الجماعي!");
        } catch (error) {
            console.error("Error approving lesson:", error);
            alert("حدث خطأ أثناء الموافقة على الدرس.");
        }
    };

    const handleReject = async (id) => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        try {
            const response = await fetch(`http://127.0.0.1:8000/admin/reject-group-lesson/${id}?token=${token}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" }
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || "Failed to reject lesson");

            setLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== id));
            alert("تم رفض الدرس الجماعي!");
        } catch (error) {
            console.error("Error rejecting lesson:", error);
            alert("حدث خطأ أثناء رفض الدرس.");
        }
    };

    return (
        <div className="teachers-container">
            <header className="teachers-header">
                <button className="back-button" onClick={() => navigate('/AdminDashboard')}>
                    <FaArrowLeft /> العودة إلى لوحة التحكم
                </button>
                <h1 className="title" style={{ textAlign: 'center', width: '100%' }}>الدروس الجماعية المعلقة</h1>
            </header>

            <div className="search-container">
                <input type="text" placeholder="بحث باسم المعلم" value={searchTeacher} onChange={(e) => setSearchTeacher(e.target.value)} className="search-input" />
                <input type="text" placeholder="بحث باسم الطالب" value={searchStudent} onChange={(e) => setSearchStudent(e.target.value)} className="search-input" />
                <input type="date" placeholder="بحث بالتاريخ" value={searchDate} onChange={(e) => setSearchDate(e.target.value)} className="search-input" />
            </div>

            <div className="table-wrapper">
                <table className="teachers-table">
                    <thead>
                        <tr>
                            <th>المعلم</th>
                            <th>الطلاب</th>
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
                                <td>{lesson.student_names.join(", ")}</td>
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
                    <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PendingGroupLessonsAdmin;
