// Admin_Booking.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Admin_Booking.css";

const API_BASE = "https://maram-classmanager-backend.onrender.com";

const STATUS_LABELS_AR = {
    pending: "قيد الانتظار",
    approved: "معتمدة",
    completed: "منتهية",
    cancelled: "مُلغاة",
};
const TYPE_LABELS_AR = { individual: "فردي", group: "جماعي" };
const ROWS_PER_PAGE = 15;

export default function Admin_Booking() {
    const navigate = useNavigate();

    // ---------- state ----------
    const [mode, setMode] = useState("bookings"); // 'bookings' | 'lessons'
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [selectedDate, setSelectedDate] = useState(today);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");

    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const [page, setPage] = useState(1);

    // ---------- fetch by DAY (with query token) ----------
    async function fetchDay() {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("يرجى تسجيل الدخول أولاً.");
            navigate("/login");
            return;
        }

        setLoading(true);
        setErr("");

        try {
            const path =
                mode === "lessons"
                    ? "/booking/today/lessons"
                    : "/booking/today/bookings";

            const { data } = await axios.get(`${API_BASE}${path}`, {
                params: { date: selectedDate, token },
            });

            const rows = Array.isArray(data) ? data : [];
            setItems(rows);

            console.info(
                `[Admin_Booking] mode=${mode} date=${selectedDate} -> ${rows.length} rows`,
                { endpoint: `${API_BASE}${path}`, params: { date: selectedDate } }
            );
        } catch (e) {
            console.error(e);
            setErr("فشل في جلب بيانات هذا اليوم.");
            setItems([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchDay();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [mode, selectedDate]);

    // ---------- filter + paginate ----------
    const filtered = useMemo(() => {
        return (items || []).filter((it) => {
            const statusMatch =
                statusFilter === "all" || (it.status || "pending") === statusFilter;
            const typeMatch =
                typeFilter === "all" || (it.lessonType || "individual") === typeFilter;
            return statusMatch && typeMatch;
        });
    }, [items, statusFilter, typeFilter]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / ROWS_PER_PAGE));
    const pageSafe = Math.min(page, totalPages);
    const pageRows = filtered.slice(
        (pageSafe - 1) * ROWS_PER_PAGE,
        pageSafe * ROWS_PER_PAGE
    );

    useEffect(() => {
        setPage(1);
    }, [statusFilter, typeFilter, mode, selectedDate]);

    // ---------- actions (optimistic) ----------
    async function changeStatus(id, newStatus) {
        const token = localStorage.getItem("access_token");
        if (!id || !token) return;

        const prev = items.slice();
        const next = items.map((x) =>
            String(x._id) === String(id) ? { ...x, status: newStatus } : x
        );
        setItems(next);

        try {
            await axios.patch(
                `${API_BASE}/booking/${id}/status`,
                { status: newStatus },
                { params: { token } }
            );
        } catch (e) {
            console.error(e);
            alert("تعذّر تحديث الحالة. تم التراجع عن التغيير.");
            setItems(prev);
        }
    }

    // ---------- helpers ----------
    const statusChipClass = (status) => `status-chip ${status || "pending"}`;
    const typeChipClass = (t) =>
        `type-chip ${t === "group" ? "group" : "individual"}`;

    const modeTitle =
        mode === "bookings"
            ? "الدروس المحجوزة (حسب تاريخ الحجز)"
            : "الدروس المجدولة (حسب تاريخ الدرس)";

    return (
        <div className="admin-shell" dir="rtl">
            {/* header banner */}
            <div className="header-bar">
                <h1>لوحة إدارة الحجوزات والدروس</h1>
                <div className="subtitle">{modeTitle}</div>
            </div>

            {/* filters */}
            <div className="filters-card">
                <div className="mode-switch">
                    <button
                        className={`pill ${mode === "bookings" ? "active" : ""}`}
                        onClick={() => setMode("bookings")}
                    >
                        الدروس المحجوزة
                    </button>
                    <button
                        className={`pill ${mode === "lessons" ? "active" : ""}`}
                        onClick={() => setMode("lessons")}
                    >
                        الدروس المجدولة
                    </button>
                </div>

                <div className="field">
                    <label>التاريخ</label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                    />
                </div>

                <div className="field">
                    <label>الحالة</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">كل الحالات</option>
                        <option value="pending">قيد الانتظار</option>
                        <option value="approved">معتمدة</option>
                        <option value="completed">منتهية</option>
                        <option value="cancelled">مُلغاة</option>
                    </select>
                </div>

                <div className="field">
                    <label>النوع</label>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                    >
                        <option value="all">كل الأنواع</option>
                        <option value="individual">فردي</option>
                        <option value="group">جماعي</option>
                    </select>
                </div>

                <div className="count-badge" title="عدد النتائج">
                    {filtered.length}
                </div>
            </div>

            {/* table */}
            <div className="table-card">
                {loading ? (
                    <div className="state muted">جارِ التحميل…</div>
                ) : err ? (
                    <div className="state error">{err}</div>
                ) : (
                    <table className="grid-table">
                        <thead>
                            <tr>
                                <th>الطلاب</th>
                                <th>عدد الساعات</th>
                                <th>المستوى</th>
                                <th>المادة</th>
                                <th>تاريخ الحجز</th>
                                <th>تاريخ الدرس</th>
                                <th>وقت الدرس</th>
                                <th>النوع</th>
                                <th>الحالة</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pageRows.map((row) => {
                                const students = Array.isArray(row.students) && row.students.length
                                    ? row.students.join("، ")
                                    : `${row.firstName || ""} ${row.lastName || ""}`.trim();

                                return (
                                    <tr key={row._id}>
                                        <td className="col-names">{students || "—"}</td>
                                        <td>{row.hours ?? "—"}</td>
                                        <td>{row.ageLevel || row.education_level || "—"}</td>
                                        <td>{row.subject || "—"}</td>
                                        <td>{row.bookingDate || "—"}</td>
                                        <td>{row.lessonDate || "—"}</td>
                                        <td>{row.lessonTime || "—"}</td>
                                        <td>
                                            <span className={typeChipClass(row.lessonType || "individual")}>
                                                {TYPE_LABELS_AR[row.lessonType || "individual"]}
                                            </span>
                                        </td>
                                        <td>
                                            <span className={statusChipClass(row.status)}>
                                                {STATUS_LABELS_AR[row.status || "pending"]}
                                            </span>
                                        </td>
                                        <td className="actions">
                                            <button
                                                className="btn b-approve"
                                                onClick={() => changeStatus(row._id, "approved")}
                                                disabled={row.status === "approved"}
                                            >
                                                الموافقة
                                            </button>
                                            <button
                                                className="btn b-cancel"
                                                onClick={() => changeStatus(row._id, "cancelled")}
                                                disabled={row.status === "cancelled"}
                                            >
                                                رفض
                                            </button>
                                            <button
                                                className="btn b-complete"
                                                onClick={() => changeStatus(row._id, "completed")}
                                                disabled={row.status === "completed"}
                                            >
                                                إنهاء
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {pageRows.length === 0 && (
                                <tr>
                                    <td colSpan="10" className="state muted">
                                        لا توجد نتائج لهذا اليوم.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            {/* pagination */}
            <div className="pagination">
                {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                        key={i}
                        className={`page ${pageSafe === i + 1 ? "active" : ""}`}
                        onClick={() => setPage(i + 1)}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            <div className="footer-bar">
                <button className="back-btn" onClick={() => navigate("/AdminDashboard")}>
                    العودة إلى لوحة التحكم
                </button>
            </div>
        </div>
    );
}
