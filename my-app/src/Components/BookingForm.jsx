// BookingForm.jsx
import React, { useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/BookingForm.css";

// Auto-switch API: localhost in dev, Render in prod
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8000"
        : "https://maram-classmanager-backend.onrender.com";

/* ---------- time & hours helpers ---------- */
const TIME_START_HOUR = 10;   // 10:00
const TIME_END_HOUR = 22;   // 22:00 (inclusive)

const buildTimeSlots = (startH, endH) => {
    const out = [];
    for (let h = startH; h <= endH; h++) {
        const HH = String(h).padStart(2, "0");
        out.push(`${HH}:00`);
        if (h !== endH) out.push(`${HH}:30`);
    }
    return out;
};
const TIME_SLOTS = buildTimeSlots(TIME_START_HOUR, TIME_END_HOUR);

const HOURS_OPTIONS = [
    { label: "ساعة واحدة (1:00)", value: 1.0 },
    { label: "ساعة ونصف (1:30)", value: 1.5 },
    { label: "ساعتان (2:00)", value: 2.0 },
    { label: "ساعتان ونصف (2:30)", value: 2.5 },
    { label: "ثلاث ساعات (3:00)", value: 3.0 },
    { label: "ثلاث ساعات ونصف (3:30)", value: 3.5 },
    { label: "أربع ساعات (4:00)", value: 4.0 },
];

export default function BookingForm() {
    const navigate = useNavigate();
    const today = useMemo(() => new Date().toISOString().split("T")[0], []);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // UI model
    const [formData, setFormData] = useState({
        parentName: "",
        phone: "",
        subject: "",
        ageLevel: "",
        lessonDate: today,
        lessonTime: "",
        hours: "",
        notes: "",
        lessonType: "individual", // "individual" | "group"
        studentName: "",          // for individual
        students: ["", ""],       // for group; ensure at least 2
    });

    const isGroup = formData.lessonType === "group";

    // -------- handlers --------
    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "lessonType") {
            setFormData((p) => ({
                ...p,
                lessonType: value,
                studentName: value === "individual" ? p.studentName || "" : "",
                students: value === "group" ? (p.students?.length ? p.students : ["", ""]) : ["", ""],
            }));
            return;
        }
        setFormData((p) => ({ ...p, [name]: value }));
    };

    // group students handlers
    const addStudent = () => setFormData((p) => ({ ...p, students: [...(p.students || []), ""] }));
    const removeStudent = (idx) =>
        setFormData((p) => {
            const next = [...p.students];
            next.splice(idx, 1);
            return { ...p, students: next };
        });
    const changeStudent = (idx, value) =>
        setFormData((p) => {
            const next = [...(p.students || [])];
            next[idx] = value;
            return { ...p, students: next };
        });

    // -------- submit --------
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");

        // basic validations (inline)
        if (!formData.phone) return setErrorMsg("⚠️ أدخل رقم الهاتف.");
        if (!formData.subject) return setErrorMsg("⚠️ اختر المادة.");
        if (!formData.ageLevel) return setErrorMsg("⚠️ اختر المرحلة الدراسية.");
        if (!formData.lessonDate) return setErrorMsg("⚠️ اختر تاريخ الدرس.");
        if (!formData.lessonTime) return setErrorMsg("⚠️ اختر وقت الدرس.");
        if (!formData.hours) return setErrorMsg("⚠️ اختر عدد الساعات.");

        // students validation + mapping
        let students = [];
        if (isGroup) {
            const cleaned = (formData.students || []).map((s) => s.trim()).filter(Boolean);
            if (cleaned.length < 2) return setErrorMsg("⚠️ للدرس الجماعي، يجب إدخال اسمين على الأقل.");
            students = cleaned;
        } else {
            const name = (formData.studentName || "").trim();
            if (!name) return setErrorMsg("⚠️ أدخل اسم الطالب.");
            students = [name];
        }

        // payload for backend
        const payload = {
            parentName: formData.parentName || undefined,
            phone: formData.phone,
            subject: formData.subject,
            ageLevel: formData.ageLevel,
            lessonDate: formData.lessonDate,
            lessonTime: formData.lessonTime,
            hours: Number(formData.hours),
            notes: formData.notes || undefined,
            lessonType: formData.lessonType,
            students,
        };

        try {
            setLoading(true);
            await axios.post(`${API_URL}/booking/`, payload, {
                headers: { "Content-Type": "application/json" },
            });

            // persist once so refresh on success page still shows details
            sessionStorage.setItem("lastBooking", JSON.stringify(payload));

            // navigate to your requested path: /BookingSuccess (capital B)
            navigate("/BookingSuccess", { state: { booking: payload } });
        } catch (err) {
            console.error(err);
            setErrorMsg("❌ تعذّر إرسال الطلب. حاول مرة أخرى لاحقاً.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="form-container" dir="rtl">
            <h2>📚 حجز درس</h2>
            <p>املأ البيانات التالية لإتمام عملية الحجز</p>

            {/* inline error (no alert) */}
            {errorMsg && (
                <div className="bf-alert error" role="alert">
                    {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="booking-form">
                {/* Parent & phone */}
                <div className="form-row">
                    <div className="form-group">
                        <label>اسم ولي الأمر (اختياري)</label>
                        <input
                            type="text"
                            name="parentName"
                            value={formData.parentName}
                            onChange={handleChange}
                            placeholder="أدخل اسم ولي الأمر"
                        />
                    </div>

                    <div className="form-group">
                        <label>رقم الهاتف</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0591234567"
                            required
                        />
                    </div>
                </div>

                {/* Subject & level */}
                <div className="form-row">
                    <div className="form-group">
                        <label>المادة الدراسية</label>
                        <select name="subject" value={formData.subject} onChange={handleChange} required>
                            <option value="">اختر المادة</option>
                            <option value="اللغة العربية">اللغة العربية</option>
                            <option value="اللغة العبرية (עברית)">اللغة العبرية (עברית)</option>
                            <option value="اللغة الإنجليزية">اللغة الإنجليزية</option>
                            <option value="الرياضيات">الرياضيات</option>

                            <option value="العلوم - فيزياء">العلوم - فيزياء (Physics)</option>
                            <option value="العلوم - كيمياء">العلوم - كيمياء (Chemistry)</option>
                            <option value="العلوم - أحياء">العلوم - أحياء (Biology ביולוגיה)</option>

                            <option value="التاريخ">التاريخ</option>
                            <option value="الجغرافيا">الجغرافيا</option>
                            <option value="التربية الإسلامية">التربية الإسلامية</option>
                            <option value="التربية المدنية">التربية المدنية</option>
                            <option value="الحاسوب">الحاسوب / علوم الكمبيوتر</option>
                            <option value="مواد أخرى">مواد أخرى</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>المرحلة الدراسية</label>
                        <select name="ageLevel" value={formData.ageLevel} onChange={handleChange} required>
                            <option value="">اختر المرحلة</option>
                            <option value="ابتدائي">ابتدائي</option>
                            <option value="إعدادي">إعدادي</option>
                            <option value="ثانوي">ثانوي</option>
                        </select>
                    </div>
                </div>

                {/* Date & time */}
                <div className="form-row">
                    <div className="form-group">
                        <label>تاريخ الدرس</label>
                        <input
                            type="date"
                            name="lessonDate"
                            min={today}
                            value={formData.lessonDate}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>وقت الدرس</label>
                        <select name="lessonTime" value={formData.lessonTime} onChange={handleChange} required>
                            <option value="">اختر الوقت</option>
                            {TIME_SLOTS.map((t) => (
                                <option key={t} value={t}>
                                    {t}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Type & hours */}
                <div className="form-row">
                    <div className="form-group">
                        <label>نوع الدرس</label>
                        <select name="lessonType" value={formData.lessonType} onChange={handleChange}>
                            <option value="individual">فردي</option>
                            <option value="group">مجموعة</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>عدد الساعات</label>
                        <select name="hours" value={formData.hours} onChange={handleChange} required>
                            <option value="">اختر المدة</option>
                            {HOURS_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Student(s) */}
                {isGroup ? (
                    <div className="form-group">
                        <label>الطلاب (مجموعة)</label>
                        <div style={{ display: "grid", gap: 8 }}>
                            {(formData.students || []).map((name, idx) => (
                                <div key={idx} style={{ display: "flex", gap: 8 }}>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => changeStudent(idx, e.target.value)}
                                        placeholder={`اسم الطالب ${idx + 1}`}
                                        className="input"
                                        style={{ flex: 1 }}
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeStudent(idx)}
                                        aria-label="حذف"
                                        title="حذف"
                                        style={iconBtn}
                                    >
                                        −
                                    </button>
                                </div>
                            ))}
                            <div>
                                <button type="button" onClick={addStudent} className="btn" style={addBtn}>
                                    + إضافة طالب
                                </button>
                            </div>
                            <div className="small" style={{ color: "#64748b" }}>
                                * للدرس الجماعي يجب إدخال اسمين على الأقل.
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="form-group">
                        <label>اسم الطالب</label>
                        <input
                            type="text"
                            name="studentName"
                            value={formData.studentName}
                            onChange={handleChange}
                            placeholder="أدخل اسم الطالب"
                            required
                        />
                    </div>
                )}

                {/* Notes */}
                <div className="form-group">
                    <label>ملاحظات إضافية (اختياري)</label>
                    <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder="أي ملاحظات خاصة أو متطلبات"
                    />
                </div>

                {/* Submit */}
                <button type="submit" className="submit-btn" disabled={loading}>
                    {loading ? "جارٍ الإرسال..." : "حجز الدرس"}
                </button>
            </form>
        </div>
    );
}

/* minimal button styles kept inline */
const iconBtn = {
    padding: "0 12px",
    borderRadius: 10,
    border: "1px solid #e5e7eb",
    background: "#fff",
    cursor: "pointer",
    fontWeight: 700,
    lineHeight: "36px",
    height: 40,
};
const addBtn = {
    border: 0,
    padding: "10px 14px",
    borderRadius: 12,
    cursor: "pointer",
    fontWeight: 700,
    background: "#2563eb",
    color: "#fff",
    boxShadow: "0 8px 18px rgba(37, 99, 235, .20)",
};
