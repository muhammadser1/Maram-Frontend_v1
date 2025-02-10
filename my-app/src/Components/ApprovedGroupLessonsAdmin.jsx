import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { jwtDecode } from "jwt-decode";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";
import "../styles/ApprovedGroupLessonsAdmin.css";

const ApprovedGroupLessonsAdmin = () => {
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
        alert("انتهت صلاحية الجلسة، يرجى تسجيل الدخول مرة أخرى.");
        localStorage.clear();
        navigate("/login");
    };

    const handleUnauthorizedAccess = () => {
        alert("ليس لديك الصلاحية للوصول إلى هذه الصفحة.");
        localStorage.clear();
        navigate("/login");
    };

    const handleInvalidToken = () => {
        alert("رمز غير صالح، يرجى تسجيل الدخول مرة أخرى.");
        localStorage.clear();
        navigate("/login");
    };
    const fetchApprovedLessons = async (token) => {
        try {
            console.log("📡 Fetching approved group lessons...");

            const response = await axios.get(`http://localhost:8000/admin/approved-group-lessons?token=${token}`);

            console.log("✅ Response from backend:", response.data);

            if (response.data.approved_lessons) {
                setLessons(response.data.approved_lessons);
            } else {
                console.warn("⚠️ No approved lessons found in response!");
                setLessons([]);
            }
        } catch (error) {
            console.error("❌ Error fetching approved group lessons:", error);
            alert("Failed to fetch approved group lessons.");
        }
    };

    const filteredLessons = lessons.filter((lesson) =>
        lesson.teacher_name?.toLowerCase().includes(searchTeacher.toLowerCase()) &&
        (Array.isArray(lesson.student_names) && lesson.student_names.some(student => student.toLowerCase().includes(searchStudent.toLowerCase()))) &&
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
                <button className="back-button" onClick={() => navigate("/AdminDashboard")}>
                    <FaArrowLeft /> العودة إلى لوحة التحكم
                </button>
                <h1 className="title" style={{ textAlign: "center", width: "100%" }}>الدروس الجماعية المعتمدة</h1>
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
                            <th>الطلاب</th>
                            <th>عدد الساعات</th>
                            <th>المستوى التعليمي</th>
                            <th>المادة</th>
                            <th>التاريخ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((lesson) => (
                            <tr key={lesson._id}>
                                <td>{lesson.teacher_name}</td>
                                <td>{Array.isArray(lesson.student_names) ? lesson.student_names.join(", ") : "لا يوجد"}</td>
                                <td>{lesson.hours}</td>
                                <td>{lesson.education_level}</td>
                                <td>{lesson.subject}</td>
                                <td>{lesson.date}</td>
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

export default ApprovedGroupLessonsAdmin;
