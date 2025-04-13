import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from "react-router-dom";
import "../styles/ViewApprovedIndividualLessons.css";

const ViewApprovedIndividualLessons = () => {
    const [approvedLessons, setApprovedLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;
    const navigate = useNavigate();

    // ✅ Set default month to current month
    useEffect(() => {
        const currentMonth = new Date().toISOString().slice(0, 7); // Get current month in "YYYY-MM" format
        setSearchDate(currentMonth); // Set the default month
    }, []);

    // ✅ Check Token and Redirect if Invalid
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                jwtDecode(token); // ✅ Validate Token
            } catch (error) {
                console.error("Failed to decode token:", error);
                alert("Invalid or expired token. Please log in again.");
                navigate("/login");
            }
        } else {
            alert("No token found. Please log in.");
            navigate("/login");
        }
    }, [navigate]);

    // ✅ Fetch Approved Lessons from Backend
    useEffect(() => {
        const fetchApprovedLessons = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    alert("No token found. Please log in.");
                    navigate("/login");
                    return;
                }

                const response = await axios.get(`https://maram-classmanager-backend.onrender.com/teacher/approved-lessons?token=${token}`);
                console.log("📄 Fetched Approved Lessons:", response.data.approved_lessons);
                setApprovedLessons(response.data.approved_lessons);
            } catch (error) {
                console.error("❌ Error fetching approved lessons:", error);
                alert("Failed to fetch approved lessons. Please try again later.");
            }
        };

        fetchApprovedLessons();
    }, [navigate]);

    // ✅ Search & Filtering Logic (Student Name and Month)
    const filteredLessons = approvedLessons.filter((lesson) =>
        lesson.student_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (searchDate === "" || lesson.date.slice(0, 7) === searchDate) // Compare only the year and month (YYYY-MM)
    );

    // ✅ Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="approved-lessons-container creative-background">
            <h1 className="title">الدروس الفردية المعتمدة</h1>

            {/* ✅ Search Inputs */}
            <div className="search-container">
                <input
                    type="text"
                    placeholder="بحث باسم الطالب"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <input
                    type="month" // This allows the user to select a month and year
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* ✅ Lessons Table */}
            <div className="table-wrapper">
                <table className="approved-lessons-table">
                    <thead>
                        <tr>
                            <th>المعلم</th>
                            <th>الطالب</th>
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
                                <td>{lesson.student_name}</td>
                                <td>{lesson.hours}</td>
                                <td>{lesson.education_level}</td>
                                <td>{lesson.subject}</td>
                                <td>{new Date(lesson.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ✅ Pagination */}
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

            {/* ✅ Back to Dashboard */}
            <button className="back-to-home-button" onClick={() => navigate('/TeacherDashboard')}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
};

export default ViewApprovedIndividualLessons;
