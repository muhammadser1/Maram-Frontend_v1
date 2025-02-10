import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";
import "../styles/DashboardOverview.css";

// ✅ Register Chart.js components to avoid "category" error
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

const DashboardOverview = () => {
    const [totalLessons, setTotalLessons] = useState(0);
    const [totalHours, setTotalHours] = useState(0);
    const [totalIndividualHoursByLevel, setTotalIndividualHoursByLevel] = useState({});
    const [totalGroupHoursByLevel, setTotalGroupHoursByLevel] = useState({});
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
    const navigate = useNavigate();
    const [teacherName, setTeacherName] = useState("");

    // ✅ Handle token and authentication check
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No token found. Please log in.");
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            setTeacherName(decoded.username || decoded.sub);
        } catch (error) {
            console.error("Failed to decode token:", error);
            alert("Invalid or expired token. Please log in again.");
            navigate("/login");
        }
    }, [navigate]);

    // ✅ Fetch dashboard data
    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const response = await axios.get(`http://localhost:8000/group_lessons/dashboard-overview?token=${token}&month=${selectedMonth}`);

                setTotalLessons(response.data.total_lessons);
                setTotalHours(response.data.total_hours);
                setTotalIndividualHoursByLevel(response.data.individual_hours_by_level);
                setTotalGroupHoursByLevel(response.data.group_hours_by_level);
            } catch (error) {
                console.error("❌ Error fetching dashboard data:", error);
                alert("Failed to fetch dashboard overview.");
            }
        };

        fetchDashboardData();
    }, [selectedMonth]); // ✅ Re-fetch data when month changes

    // ✅ Handle month selection change
    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    const educationLevels = ["ابتدائي", "إعدادي", "ثانوي"];

    // ✅ Chart data
    const totalHoursData = {
        labels: educationLevels,
        datasets: [
            {
                label: "إجمالي الساعات حسب المستوى التعليمي",
                data: educationLevels.map((level) =>
                    (totalIndividualHoursByLevel[level] || 0) + (totalGroupHoursByLevel[level] || 0)
                ),
                backgroundColor: ["#4bc0c0", "#9966ff", "#ff9f40"],
            },
        ],
    };

    // ✅ Cleanup Chart.js instances to prevent "Canvas is already in use" error
    useEffect(() => {
        return () => {
            Object.values(ChartJS.instances).forEach((chart) => chart.destroy());
        };
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="title">نظرة عامة على الدروس</h1>

            <div className="filter-section">
                <label htmlFor="month-select">اختر الشهر:</label>
                <select id="month-select" value={selectedMonth} onChange={handleMonthChange}>
                    {[...Array(12).keys()].map((month) => (
                        <option key={month + 1} value={month + 1}>
                            {new Date(0, month).toLocaleString("ar", { month: "long" })}
                        </option>
                    ))}
                </select>
            </div>

            <div className="stats-section">
                <div className="row row-centered">
                    <div className="stat-card">
                        <h3>إجمالي الدروس</h3>
                        <p>{totalLessons}</p>
                    </div>
                    <div className="stat-card">
                        <h3>إجمالي الساعات</h3>
                        <p>{totalHours}</p>
                    </div>
                </div>

                <div className="row row-centered">
                    {educationLevels.map((level) => (
                        <div key={level} className="stat-card">
                            <h3>الساعات الفردية - {level}</h3>
                            <p>{totalIndividualHoursByLevel[level] || 0}</p>
                        </div>
                    ))}
                </div>

                <div className="row row-centered">
                    {educationLevels.map((level) => (
                        <div key={level + '-group'} className="stat-card">
                            <h3>الساعات الجماعية - {level}</h3>
                            <p>{totalGroupHoursByLevel[level] || 0}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="charts-section">
                <div className="chart-container">
                    <h3>إجمالي الساعات حسب المستوى التعليمي</h3>
                    {/* ✅ Added key to force re-render when data updates */}
                    <Bar key={JSON.stringify(totalHoursData)} data={totalHoursData} />
                </div>
            </div>

            <button className="back-to-home-button" onClick={() => navigate('/TeacherDashboard')}>
                العودة إلى لوحة التحكم
            </button>
        </div>
    );
};

export default DashboardOverview;
