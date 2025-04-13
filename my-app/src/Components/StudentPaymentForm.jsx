import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import "../styles/StudentPaymentForm.css";

const StudentPaymentForm = () => {
    const [studentName, setStudentName] = useState('');
    const [cost, setCost] = useState('');
    const [paymentDate, setPaymentDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
    });
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [paymentList, setPaymentList] = useState([]);
    const [searchMonth, setSearchMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
    });
    const [searchName, setSearchName] = useState('');

    const navigate = useNavigate();

    const fetchPaymentsForMonth = async (month) => {
        try {
            const token = localStorage.getItem("access_token");

            const fullURL = `https://maram-classmanager-backend.onrender.com/student_payments/?month=${month}&token=${encodeURIComponent(token)}`;
            console.log("📡 FULL DEBUG GET URL:\n", fullURL);

            const response = await axios.get(fullURL);
            setPaymentList(response.data.payments);
        } catch (err) {
            console.error("❌ Error fetching payments:", err);
            setError("فشل في تحميل الدفعات");
        }
    };

    useEffect(() => {
        fetchPaymentsForMonth(searchMonth);
    }, [searchMonth]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("No token found. Please log in.");
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            if (decoded.role !== "admin") {
                alert("Unauthorized");
                navigate("/login");
                return;
            }

            const name = studentName.trim();
            const newCost = parseInt(cost);

            if (!name || isNaN(newCost) || !paymentDate) {
                setError("يرجى تعبئة الحقول بشكل صحيح.");
                return;
            }

            const fullURL = `https://maram-classmanager-backend.onrender.com/student_payments/?name=${encodeURIComponent(name)}&cost=${newCost}&date=${paymentDate}&token=${encodeURIComponent(token)}`;
            console.log("📡 FULL DEBUG POST URL:\n", fullURL);

            await axios.post(fullURL);

            setMessage("✅ تم تسجيل الدفعة بنجاح");
            setError('');
            setStudentName('');
            setCost('');
            setPaymentDate(new Date().toISOString().split("T")[0]);

            await fetchPaymentsForMonth(searchMonth);
        } catch (err) {
            console.error("❌ Error adding payment:", err);
            setError("فشل في إضافة الدفعة.");
            setMessage('');
        }
    };

    const filteredPayments = paymentList.filter(p =>
        p.date.startsWith(searchMonth) &&
        p.name.toLowerCase().includes(searchName.toLowerCase())
    );

    const totals = filteredPayments.reduce((acc, p) => {
        acc[p.name] = (acc[p.name] || 0) + p.cost;
        return acc;
    }, {});

    return (
        <div className="payment-form-page">
            <div className="payment-form-container">
                <img src="../images/logo-removebg-preview.png" alt="Logo" className="logo" />
                <h2>إضافة دفعة طالب</h2>
                {message && <p className="success">{message}</p>}
                {error && <p className="error">{error}</p>}

                <form onSubmit={handleSubmit} className="payment-form">
                    <label>اسم الطالب:</label>
                    <input
                        type="text"
                        value={studentName}
                        onChange={(e) => setStudentName(e.target.value)}
                        required
                    />

                    <label>المبلغ (بالشيكل):</label>
                    <input
                        type="number"
                        value={cost}
                        onChange={(e) => setCost(e.target.value)}
                        required
                    />

                    <label>تاريخ الدفع:</label>
                    <input
                        type="date"
                        value={paymentDate}
                        onChange={(e) => setPaymentDate(e.target.value)}
                        required
                    />

                    <button type="submit">إضافة</button>
                </form>

                <div className="search-bar">
                    <label>بحث بالشهر:</label>
                    <input
                        type="month"
                        value={searchMonth}
                        onChange={(e) => setSearchMonth(e.target.value)}
                    />
                    <label>بحث باسم الطالب:</label>
                    <input
                        type="text"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        placeholder="اكتب اسم الطالب"
                    />
                </div>

                {filteredPayments.length > 0 && (
                    <>
                        <div className="table-container">
                            <h3>الدفعات في {searchMonth}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>اسم الطالب</th>
                                        <th>المبلغ (₪)</th>
                                        <th>التاريخ</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPayments.map((p, i) => (
                                        <tr key={i}>
                                            <td>{p.name}</td>
                                            <td>{p.cost}</td>
                                            <td>{p.date}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="table-container">
                            <h3>إجمالي المدفوعات حسب الطالب</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>اسم الطالب</th>
                                        <th>المجموع (₪)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(totals).map(([name, total], i) => (
                                        <tr key={i}>
                                            <td>{name}</td>
                                            <td>{total}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}

                <button onClick={() => navigate('/AdminDashboard')} className="home-button">
                    العودة إلى الصفحة الرئيسية
                </button>
            </div>
        </div>
    );
};

export default StudentPaymentForm;
