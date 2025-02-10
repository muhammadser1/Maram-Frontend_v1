import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import "../styles/ViewPendingIndividualLessons.css";

const ViewPendingIndividualLessons = () => {
    const [pendingLessons, setPendingLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [originalData, setOriginalData] = useState({});
    const [teacherName, setTeacherName] = useState("");
    const rowsPerPage = 9;
    const navigate = useNavigate();

    // ✅ Hour Options Mapping
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

    // ✅ Reverse Mapping for Display
    const hourValuesToText = Object.fromEntries(
        Object.entries(hourOptions).map(([text, value]) => [value, text])
    );

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decodedToken = jwtDecode(token);
                setTeacherName(decodedToken.username);
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

    useEffect(() => {
        const fetchPendingLessons = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://localhost:8000/teacher/pending-lessons?token=${token}`);

                console.log("📄 Fetched Pending Lessons:", response.data.pending_lessons);
                const lessons = response.data.pending_lessons.map((lesson) => ({
                    ...lesson,
                    isEditing: false,
                }));
                setPendingLessons(lessons);

                const initialData = {};
                lessons.forEach((lesson) => {
                    initialData[lesson._id] = { ...lesson };
                });
                setOriginalData(initialData);
            } catch (error) {
                console.error("❌ Error fetching lessons:", error);
                alert("Failed to fetch pending lessons.");
            }
        };

        if (teacherName) {
            fetchPendingLessons();
        }
    }, [teacherName]);

    const handleDelete = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;

        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`http://localhost:8000/teacher/delete-lesson/${lessonId}?token=${token}`);

            alert("Lesson deleted successfully!");
            setPendingLessons((prevLessons) =>
                prevLessons.filter((lesson) => lesson._id !== lessonId)
            );
        } catch (error) {
            console.error("❌ Failed to delete lesson:", error);
            alert("Failed to delete the lesson. Please try again.");
        }
    };

    const handleEditToggle = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId ? { ...lesson, isEditing: !lesson.isEditing } : lesson
            )
        );
    };

    const handleInputChange = (lessonId, field, value) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? {
                        ...lesson,
                        [field]: field === "hours" ? hourOptions[value] || value : value, // ✅ Convert hours to number
                    }
                    : lesson
            )
        );
    };

    const handleSave = async (lessonId) => {
        const token = localStorage.getItem("access_token");
        const lessonToUpdate = pendingLessons.find((lesson) => lesson._id === lessonId);

        try {
            await axios.put(`http://localhost:8000/teacher/update-lesson/${lessonId}?token=${token}`, lessonToUpdate);
            alert("Lesson updated successfully!");
            handleEditToggle(lessonId);
        } catch (error) {
            console.error("❌ Failed to save lesson:", error);
            alert("Failed to save the lesson. Please try again.");
        }
    };

    const handleCancel = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId ? { ...originalData[lesson._id], isEditing: false } : lesson
            )
        );
    };

    const filteredLessons = pendingLessons.filter((lesson) =>
        lesson.student_name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (searchDate === "" || lesson.date.includes(searchDate))
    );

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="pending-lessons-container creative-background">
            <h1 className="title">الدروس الفردية المعلقة</h1>
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
            <div className="table-wrapper">
                <table className="pending-lessons-table">
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
                                <td>
                                    {lesson.isEditing ? (
                                        <input
                                            type="text"
                                            value={lesson.student_name}
                                            onChange={(e) => handleInputChange(lesson._id, "student_name", e.target.value)}
                                        />
                                    ) : (
                                        lesson.student_name
                                    )}
                                </td>

                                <td>
                                    {lesson.isEditing ? (
                                        <select
                                            className="select-dropdown"
                                            value={hourValuesToText[lesson.hours] || ""}
                                            onChange={(e) => handleInputChange(lesson._id, "hours", e.target.value)}
                                        >
                                            {Object.keys(hourOptions).map((key) => (
                                                <option key={key} value={key}>{key}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        hourValuesToText[lesson.hours] || lesson.hours
                                    )}
                                </td>

                                <td>{lesson.education_level}</td>
                                <td>{lesson.subject}</td>
                                <td>{new Date(lesson.date).toLocaleDateString()}</td>
                                <td>
                                    {lesson.isEditing ? (
                                        <>
                                            <button className="action-button save-button" onClick={() => handleSave(lesson._id)}>حفظ</button>
                                            <button className="action-button cancel-button" onClick={() => handleCancel(lesson._id)}>إلغاء</button>
                                        </>
                                    ) : (
                                        <>
                                            <button className="action-button edit-button" onClick={() => handleEditToggle(lesson._id)}>تعديل</button>
                                            <button className="action-button delete-button" onClick={() => handleDelete(lesson._id)}>حذف</button>
                                        </>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredLessons.length / rowsPerPage) }).map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)}
                        className={currentPage === index + 1 ? "active" : ""}>
                        {index + 1}
                    </button>
                ))}
            </div>
            <button className="back-to-home-button" onClick={() => navigate("/TeacherDashboard")}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
};

export default ViewPendingIndividualLessons;
