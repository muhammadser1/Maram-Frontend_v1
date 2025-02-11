import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "../styles/SystemOverview.css";

const SystemOverview = () => {
    const [teacherStats, setTeacherStats] = useState([]);
    const [studentStats, setStudentStats] = useState([]);
    const [loadingTeachers, setLoadingTeachers] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);
    const [errorTeachers, setErrorTeachers] = useState(null);
    const [errorStudents, setErrorStudents] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().slice(0, 7));
    const [searchTeacher, setSearchTeacher] = useState("");
    const [searchStudent, setSearchStudent] = useState("");
    const navigate = useNavigate();

    // ✅ Fetch Teacher Statistics
    useEffect(() => {
        const fetchTeacherStats = async () => {
            setLoadingTeachers(true);
            setErrorTeachers(null);

            const token = localStorage.getItem("access_token");

            if (!token) {
                setErrorTeachers("لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.");
                return;
            }

            try {
                console.log(`🔍 Fetching teacher stats for month: ${selectedMonth}`);

                const response = await fetch(`https://maram-classmanager-backend.onrender.com/admin/teacher-individual-stats?month=${selectedMonth}&token=${token}`);
                const data = await response.json();

                console.log("✅ Teacher Stats API Response:", data);

                if (!response.ok) {
                    throw new Error(data.detail || "Error fetching teacher statistics");
                }

                setTeacherStats(data.teachers || []);
            } catch (error) {
                console.error("❌ Error fetching teacher statistics:", error);
                setErrorTeachers("حدث خطأ أثناء جلب إحصائيات المعلمين.");
            } finally {
                setLoadingTeachers(false);
            }
        };

        fetchTeacherStats();
    }, [selectedMonth]);

    // ✅ Fetch Student Statistics
    useEffect(() => {
        const fetchStudentStats = async () => {
            setLoadingStudents(true);
            setErrorStudents(null);

            const token = localStorage.getItem("access_token");

            if (!token) {
                setErrorStudents("لم يتم العثور على رمز المصادقة. الرجاء تسجيل الدخول.");
                return;
            }

            try {
                console.log(`🔍 Fetching student stats for month: ${selectedMonth}`);

                const response = await fetch(`https://maram-classmanager-backend.onrender.com/admin/student-stats?month=${selectedMonth}&token=${token}`);
                const data = await response.json();

                console.log("✅ Student Stats API Response:", data);

                if (!response.ok) {
                    throw new Error(data.detail || "Error fetching student statistics");
                }

                setStudentStats(data.students || []);
            } catch (error) {
                console.error("❌ Error fetching student statistics:", error);
                setErrorStudents("حدث خطأ أثناء جلب إحصائيات الطلاب.");
            } finally {
                setLoadingStudents(false);
            }
        };

        fetchStudentStats();
    }, [selectedMonth]);

    // ✅ Ensure teacherStats is not undefined before filtering
    const filteredTeachers = teacherStats.filter((teacher) =>
        teacher.teacher_name?.toLowerCase().includes(searchTeacher.toLowerCase())
    );

    // ✅ Ensure studentStats is not undefined before filtering
    const filteredStudents = studentStats.filter((student) =>
        student.student_name?.toLowerCase().includes(searchStudent.toLowerCase())
    );

    return (
        <div className="overview-container">
            <header className="overview-header">
                <button className="back-button" onClick={() => navigate('/AdminDashboard')}>
                    <FaArrowLeft /> العودة إلى لوحة التحكم
                </button>
                <h1 className="title">نظرة عامة على النظام</h1>
            </header>

            <div className="filter-section">
                <label htmlFor="month">اختر الشهر:</label>
                <input
                    type="month"
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="filter-input"
                />

                <input
                    type="text"
                    placeholder="بحث باسم المعلم"
                    value={searchTeacher}
                    onChange={(e) => setSearchTeacher(e.target.value)}
                    className="filter-input"
                />

                <input
                    type="text"
                    placeholder="بحث باسم الطالب"
                    value={searchStudent}
                    onChange={(e) => setSearchStudent(e.target.value)}
                    className="filter-input"
                />
            </div>

            {/* ✅ Teacher Statistics */}
            {loadingTeachers ? <p>جارٍ تحميل إحصائيات المعلمين...</p> : errorTeachers ? <p className="error">{errorTeachers}</p> : (
                <div className="stats-section">
                    <h2>إحصائيات المعلمين</h2>
                    <div className="table-wrapper">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>المعلم</th>
                                    <th>إجمالي ساعات الدروس الفردية</th>
                                    <th>إجمالي ساعات دروس المجموعات</th>
                                    <th>ساعات الفردي حسب المستوى</th>
                                    <th>ساعات المجموعة حسب المستوى</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredTeachers.length === 0 ? (
                                    <tr><td colSpan="5">لا توجد بيانات متاحة</td></tr>
                                ) : (
                                    filteredTeachers.map((teacher, index) => {
                                        console.log("👀 Rendering teacher:", teacher);
                                        return (
                                            <tr key={index}>
                                                <td>{teacher.teacher_name}</td>
                                                <td>{teacher.total_individual_hours}</td>
                                                <td>{teacher.total_group_hours}</td>
                                                <td>
                                                    {Object.entries(teacher.individual_hours_by_education_level || {}).map(([level, hours]) => (
                                                        <div key={`ind-${level}`}>📚 {level}: {hours} ساعة</div>
                                                    ))}
                                                </td>
                                                <td>
                                                    {Object.entries(teacher.group_hours_by_education_level || {}).map(([level, hours]) => (
                                                        <div key={`grp-${level}`}>👥 {level}: {hours} ساعة</div>
                                                    ))}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* ✅ Student Statistics */}
            {loadingStudents ? <p>جارٍ تحميل إحصائيات الطلاب...</p> : errorStudents ? <p className="error">{errorStudents}</p> : (
                <div className="stats-section">
                    <h2>إحصائيات الطلاب</h2>
                    <div className="table-wrapper">
                        <table className="stats-table">
                            <thead>
                                <tr>
                                    <th>الطالب</th>
                                    <th>ساعات الدروس الفردية</th>
                                    <th>ساعات دروس المجموعات</th>
                                    <th>إجمالي الساعات</th>
                                    <th>المستوى التعليمي</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredStudents.length === 0 ? (
                                    <tr><td colSpan="5">لا توجد بيانات متاحة</td></tr>
                                ) : (
                                    filteredStudents.map((student, index) => (
                                        <tr key={index}>
                                            <td>{student.student_name}</td>
                                            <td>{student.total_individual_hours}</td>
                                            <td>{student.total_group_hours}</td>
                                            <td>{student.total_individual_hours + student.total_group_hours}</td>
                                            <td>{student.education_level}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SystemOverview;
