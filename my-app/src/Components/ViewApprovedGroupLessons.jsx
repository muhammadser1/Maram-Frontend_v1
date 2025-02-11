import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewApprovedGroupLessons.css";

const ViewApprovedGroupLessons = () => {
    const [approvedLessons, setApprovedLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState(""); // ✅ Added Date Search
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 15;
    const navigate = useNavigate();

    // ✅ Fetch Approved Group Lessons from Backend
    useEffect(() => {
        const fetchApprovedLessons = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    alert("No token found. Please log in.");
                    navigate("/login");
                    return;
                }

                // ✅ Fetch data with token as a query parameter
                const response = await axios.get(`https://maram-classmanager-backend.onrender.com/group_lessons/approved-lessons?token=${token}`);

                console.log("📄 Fetched Approved Lessons:", response.data.approved_lessons);
                setApprovedLessons(response.data.approved_lessons);
            } catch (error) {
                console.error("❌ Error fetching approved lessons:", error);
                alert("Failed to fetch approved lessons. Please try again later.");
            }
        };

        fetchApprovedLessons();
    }, [navigate]);

    // ✅ Filtering Logic (Search by Student Name & Date)
    const filteredLessons = approvedLessons.filter((lesson) =>
        lesson.student_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (searchDate === "" || lesson.date.startsWith(searchDate))
    );

    // ✅ Pagination Logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="approved-lessons-container">
            <h1 className="title">الدروس الجماعية المعتمدة</h1>

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
                    type="date"
                    placeholder="بحث بالتاريخ"
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
                                <td className="student-names">
                                    {lesson.student_names.join(", ")}
                                </td>
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

export default ViewApprovedGroupLessons;
