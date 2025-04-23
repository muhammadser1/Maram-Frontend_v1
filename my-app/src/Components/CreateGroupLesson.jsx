import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "../styles/CreateGroupLesson.css";

const CreateGroupLesson = () => {
    const [teacherName, setTeacherName] = useState("");  // ✅ Auto-filled from token
    const [studentNames, setStudentNames] = useState([""]);
    const [hours, setHours] = useState("");
    const [subject, setSubject] = useState("");
    const [educationLevel, setEducationLevel] = useState("");
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // ✅ Default today’s date
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setTeacherName(decoded.username || decoded.sub); // ✅ Extract teacher's name from token
            } catch (error) {
                console.error("Token decoding failed:", error);
                alert("Invalid or expired token. Please log in.");
                navigate("/login");
            }
        } else {
            alert("No token found. Please log in.");
            navigate("/login");
        }
    }, [navigate]);

    const handleStudentChange = (index, value) => {
        const newStudentNames = [...studentNames];
        newStudentNames[index] = value;
        setStudentNames(newStudentNames);
    };

    const addStudentField = () => setStudentNames([...studentNames, ""]);

    const removeStudentField = (index) => {
        setStudentNames(studentNames.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No token found. Please log in.");
            navigate("/login");
            return;
        }

        const lessonData = {
            teacher_name: teacherName,  // ✅ Automatically taken from the token
            student_names: studentNames,
            hours: parseFloat(hourOptions[hours]),  // ✅ Convert to float before sending
            subject,
            education_level: educationLevel,
            date,
            approved: false
        };

        try {
            await axios.post(`https://maram-classmanager-backend.onrender.com/group_lessons/submit?token=${token}`, lessonData);
            alert("تم إنشاء الدرس الجماعي بنجاح!");
            navigate('/TeacherDashboard');
        } catch (error) {
            console.error("❌ Error creating lesson:", error);
            alert("فشل إنشاء الدرس. حاول مرة أخرى.");
        }
    };

    // ✅ Arabic Hour Options (Map Text → Float)
    const hourOptions = {
        "نصف ساعة": 0.5,
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

    return (
        <div className="create-lesson-container">
            <h1 className="title">إنشاء درس جماعي</h1>
            <form onSubmit={handleSubmit} className="lesson-form">
                <label>اسم المعلم:</label>
                <input type="text" value={teacherName} readOnly required />

                <label>أسماء الطلاب:</label>
                {studentNames.map((name, index) => (
                    <div key={index} className="student-field">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => handleStudentChange(index, e.target.value)}
                            required
                        />
                        {studentNames.length > 1 && (
                            <button type="button" onClick={() => removeStudentField(index)} className="remove-student-button">
                                حذف
                            </button>
                        )}
                    </div>
                ))}
                <button type="button" onClick={addStudentField} className="add-student-button">إضافة طالب</button>

                <label>عدد الساعات:</label>
                <select value={hours} onChange={(e) => setHours(e.target.value)} required>
                    <option value="">اختر عدد الساعات</option>
                    {Object.keys(hourOptions).map((key, index) => (
                        <option key={index} value={key}>{key}</option>
                    ))}
                </select>

                <label>المادة:</label>
                <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />

                <label>المستوى التعليمي:</label>
                <select value={educationLevel} onChange={(e) => setEducationLevel(e.target.value)} required>
                    <option value="">اختر المستوى التعليمي</option>
                    <option value="ابتدائي">ابتدائي</option>
                    <option value="إعدادي">إعدادي</option>
                    <option value="ثانوي">ثانوي</option>
                </select>

                <label>التاريخ:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />

                <button type="submit" className="submit-button">إنشاء الدرس</button>
            </form>
            <button className="back-to-home-button" onClick={() => navigate('/TeacherDashboard')}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
};

export default CreateGroupLesson;
