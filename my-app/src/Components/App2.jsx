import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "../styles/App2.css";

const App2 = () => {
    const [lessons, setLessons] = useState([]);
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchDate, setSearchDate] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return navigate("/login");

        const decoded = jwtDecode(token);
        if (decoded.role !== "admin") return navigate("/login");

        axios.get(`https://maram-classmanager-backend.onrender.com/admin/approved-individual-lessons?token=${token}`)
            .then(res => setLessons(res.data.approved_lessons || []))
            .catch(err => {
                console.error("Error loading lessons", err);
                alert("خطأ في تحميل الدروس.");
            });
    }, []);

    const filteredLessons = lessons.filter((lesson) =>
        lesson.teacher_name.toLowerCase().includes(searchTeacher.toLowerCase()) &&
        lesson.date.startsWith(searchDate)
    );

    const exportToExcel = () => {
        const rows = filteredLessons.map((lesson) => ({
            "المعلم": lesson.teacher_name,
            "الطالب": lesson.student_name,
            "عدد الساعات": lesson.hours,
            "المستوى التعليمي": lesson.education_level,
            "المادة": lesson.subject,
            "التاريخ": lesson.date,
        }));

        const worksheet = XLSX.utils.json_to_sheet(rows);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "الدروس");

        const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
        const blob = new Blob([buffer], { type: "application/octet-stream" });
        saveAs(blob, `filtered_lessons_${searchDate}.xlsx`);
    };

    return (
        <div className="export-page">
            <h2 className="title">تصدير الدروس إلى Excel</h2>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="بحث باسم المعلم"
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="search-input"
                />
                <input
                    type="month"
                    value={searchDate}
                    onChange={(e) => setSearchDate(e.target.value)}
                    className="search-input"
                />
                <button className="export-button" onClick={exportToExcel}>تصدير</button>
            </div>

            <table className="preview-table">
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
                    {filteredLessons.map((lesson) => (
                        <tr key={lesson._id}>
                            <td>{lesson.teacher_name}</td>
                            <td>{lesson.student_name}</td>
                            <td>{lesson.hours}</td>
                            <td>{lesson.education_level}</td>
                            <td>{lesson.subject}</td>
                            <td>{lesson.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="back-button" onClick={() => navigate("/AdminDashboard")}>العودة</button>
        </div>
    );
};

export default App2;
