// src/pages/BookingSuccess.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "../styles/BookingSuccess.css"; // optional styles below

export default function BookingSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const booking = location.state?.booking; // passed from BookingForm navigate(..., { state })

    // Fallbacks if page is opened directly / refreshed
    const subject = booking?.subject || "—";
    const ageLevel = booking?.ageLevel || "—";
    const lessonDate = booking?.lessonDate || "—";
    const lessonTime = booking?.lessonTime || "—";
    const hours = booking?.hours ?? "—";
    const lessonType = booking?.lessonType === "group" ? "مجموعة" : "فردي";
    const students = Array.isArray(booking?.students) ? booking.students.join("، ") : "—";

    return (
        <div className="bs-wrap" dir="rtl">
            <div className="bs-card">
                <div className="bs-icon">🎉</div>
                <h1>تم استلام طلب الحجز</h1>
                <p className="bs-sub">
                    شكراً لحجزك. ستتواصل إدارة المعهد معك قريباً{" "}
                    <strong>لتأكيد الحجز أو الاعتذار عنه</strong>.
                </p>


                <div className="bs-details">
                    <div><span>المادة:</span> {subject}</div>
                    <div><span>المرحلة:</span> {ageLevel}</div>
                    <div><span>التاريخ:</span> {lessonDate}</div>
                    <div><span>الوقت:</span> {lessonTime}</div>
                    <div><span>المدة:</span> {hours} ساعة</div>
                    <div><span>النوع:</span> {lessonType}</div>
                    <div><span>الطلاب:</span> {students}</div>
                </div>

                <p className="bs-sub">
                    شكراً لحجزك. ستتواصل إدارة المعهد معك قريباً{" "}
                    <strong>لتأكيد الحجز أو الاعتذار عنه</strong>.
                </p>


            </div>
        </div>
    );
}
