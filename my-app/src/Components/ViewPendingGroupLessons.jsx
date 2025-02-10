import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/ViewPendingGroupLessons.css";

const ViewPendingGroupLessons = () => {
    const [pendingLessons, setPendingLessons] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchDate, setSearchDate] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 10;
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
        "3 ساعات": 3
    };

    // ✅ Reverse Mapping for Display
    const hourValuesToText = Object.fromEntries(
        Object.entries(hourOptions).map(([text, value]) => [value, text])
    );

    // ✅ Fetch Data from Backend
    useEffect(() => {
        const fetchPendingLessons = async () => {
            const token = localStorage.getItem("access_token");
            if (!token) {
                alert("No token found. Please log in.");
                navigate("/login");
                return;
            }

            try {
                const response = await axios.get(`http://localhost:8000/group_lessons/pending-lessons?token=${token}`);
                setPendingLessons(response.data.pending_lessons.map(lesson => ({
                    ...lesson,
                    isEditing: false
                })));
            } catch (error) {
                console.error("❌ Error fetching lessons:", error);
                alert("Failed to fetch pending lessons.");
            }
        };


        fetchPendingLessons();
    }, [navigate]);

    // ✅ Filtering logic (search by student name & date)
    const filteredLessons = pendingLessons.filter((lesson) =>
        lesson.student_names.some(name => name.toLowerCase().includes(searchTerm.toLowerCase())) &&
        (searchDate === "" || lesson.date.startsWith(searchDate))
    );

    // ✅ Pagination logic
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = filteredLessons.slice(indexOfFirstRow, indexOfLastRow);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // ✅ Toggle edit mode
    const handleEditToggle = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? { ...lesson, isEditing: !lesson.isEditing, tempStudents: [...lesson.student_names] }
                    : lesson
            )
        );
    };

    // ✅ Handle changes in input fields
    const handleInputChange = (lessonId, field, value) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? {
                        ...lesson,
                        [field]: field === "hours" ? hourOptions[value] || value : value
                    }
                    : lesson
            )
        );
    };

    // ✅ Handle student changes locally
    const handleStudentChange = (lessonId, index, value) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? {
                        ...lesson,
                        tempStudents: lesson.tempStudents.map((name, i) => (i === index ? value : name))
                    }
                    : lesson
            )
        );
    };

    const handleAddStudent = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? { ...lesson, tempStudents: [...lesson.tempStudents, ""] }
                    : lesson
            )
        );
    };

    const handleDeleteStudent = (lessonId, index) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? {
                        ...lesson,
                        tempStudents: lesson.tempStudents.filter((_, i) => i !== index)
                    }
                    : lesson
            )
        );
    };

    // ✅ Save student changes locally
    const handleSaveStudents = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId
                    ? { ...lesson, student_names: [...lesson.tempStudents] }
                    : lesson
            )
        );
    };

    // ✅ Save changes to backend
    const handleSave = async (lessonId) => {
        const token = localStorage.getItem("access_token");
        const lessonToSave = pendingLessons.find((lesson) => lesson._id === lessonId);

        try {
            await axios.put(`http://localhost:8000/group_lessons/update-lesson/${lessonId}?token=${token}`, lessonToSave);

            setPendingLessons((prevLessons) =>
                prevLessons.map((lesson) =>
                    lesson._id === lessonId ? { ...lesson, isEditing: false } : lesson
                )
            );
            alert("Lesson updated successfully!");
        } catch (error) {
            console.error("❌ Failed to save lesson:", error);
            alert("Failed to update the lesson.");
        }
    };


    const handleCancel = (lessonId) => {
        setPendingLessons((prevLessons) =>
            prevLessons.map((lesson) =>
                lesson._id === lessonId ? { ...lesson, isEditing: false } : lesson
            )
        );
    };
    const handleDelete = async (lessonId) => {
        if (!window.confirm("Are you sure you want to delete this lesson?")) return;
        const token = localStorage.getItem("access_token");

        try {
            await axios.delete(`http://localhost:8000/group_lessons/delete-lesson/${lessonId}?token=${token}`);

            setPendingLessons(prevLessons => prevLessons.filter(lesson => lesson._id !== lessonId));
            alert("Lesson deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting lesson:", error);
        }
    };

    return (
        <div className="group-pending-lessons-container">
            <h1 className="group-title">الدروس الجماعية المعلقة</h1>
            <div className="group-search-container">
                <input
                    type="text"
                    placeholder="بحث باسم الطالب"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="group-search-input"
                />
                <input
                    type="date"
                    placeholder="بحث بالتاريخ"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="group-search-input"
                />
            </div>
            <div className="group-table-wrapper">
                <table className="group-pending-lessons-table">
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
                                <td>
                                    {lesson.isEditing ? (
                                        <input
                                            type="text"
                                            value={lesson.student_names.join(", ")}
                                            onChange={(e) => handleInputChange(lesson._id, "student_names", e.target.value.split(", "))}
                                        />
                                    ) : (
                                        lesson.student_names.join(", ")
                                    )}
                                </td>
                                <td>
                                    {lesson.isEditing ? (
                                        <select
                                            className="group-select-dropdown"
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
                                            <button className="group-save-button" onClick={() => handleSave(lesson._id)}>حفظ</button>
                                            <button className="group-cancel-button" onClick={() => handleCancel(lesson._id)}>إلغاء</button>
                                        </>
                                    ) : (
                                        <button className="group-edit-button" onClick={() => handleEditToggle(lesson._id)}>تعديل</button>
                                    )}
                                    <button className="group-delete-button" onClick={() => handleDelete(lesson._id)}>حذف</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="group-pagination">
                {Array.from({ length: Math.ceil(filteredLessons.length / rowsPerPage) }).map((_, index) => (
                    <button key={index} onClick={() => handlePageChange(index + 1)} className={currentPage === index + 1 ? "active" : ""}>
                        {index + 1}
                    </button>
                ))}
            </div>
            <button className="group-back-to-home-button" onClick={() => navigate('/TeacherDashboard')}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
};

export default ViewPendingGroupLessons;
