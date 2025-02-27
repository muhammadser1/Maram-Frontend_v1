import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/homepage.css';
import { CheckCircle } from "lucide-react";

const messages = [
    "رمضان مبارك اجعل أيامك مليئة بالخير والبركة",
    "استقبل رمضان بقلب نقي وروح صافية",
    "في هذا الشهر الفضيل اغتنم الفرصة للعبادة والتأمل",
    "اللهم اجعلنا من عتقائك من النار في هذا الشهر العظيم",
    "رمضان فرصة ذهبية للعودة إلى الله",
    "املأ أيام رمضان بالصلاة والذكر والعمل الصالح",
    "اللهم اجعل رمضان شفاءً لقلوبنا",
    "في كل يوم من رمضان افتح قلبك للمغفرة والمحبة",
    "استغل الشهر الفضيل لتقوية علاقتك بالله وأحبائك",
    "اللهم بلغنا ليلة القدر واجعل لنا فيها نصيباً من الرحمة والمغفرة",
    "رمضان شهر الصيام فليكن صيامنا قربةً لله",
    "بادر في رمضان لنشر الخير والابتسامة",
    "اللهم اجعل لنا في رمضان نصيبًا من كل خير",
    "كن سباقًا في رمضان لفعل الخير ومساعدة الآخرين",
    "رمضان تذكير بأن القلوب الصافية تصنع العجائب",
    "استغل هذا الشهر لتجديد علاقتك بالله",
    "رمضان يأتي ليطهر قلوبنا وينير دروبنا",
    "اللهم اجعل صيامنا مقبولًا وذنوبنا مغفورة",
    "كل يوم في رمضان فرصة جديدة لتكون أفضل",
    "املأ يومك في رمضان بالذكر والتسبيح",
    "رمضان هو شهر المغفرة فلا تفوت الفرصة",
    "اللهم اجعلنا من الصائمين القائمين",
    "أدعو الله أن يكون رمضانك مليئًا بالسعادة",
    "صم بقلبك قبل أن تصوم بجسدك",
    "اللهم اجعل هذا الشهر الكريم مصدر بركة وسلام",
    "كل يوم يقربك أكثر من الله في رمضان",
    "ابحث عن لحظات السعادة في أبسط الأشياء خلال رمضان",
    "اللهم اجعل آخر رمضاننا خيرًا من أوله",
    "رمضان مبارك نسأل الله لكم القبول والمغفرة",
    "ليكن رمضانك مختلفًا هذا العام املأه بالخير",
    "اجعل من رمضان نقطة تحول لحياتك الروحية"
];

const Homepage = () => {
    const navigate = useNavigate();
    const [birthdays, setBirthdays] = useState([]);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * messages.length);
        setMessage(messages[randomIndex]);
    }, []);

    useEffect(() => {
        const fetchBirthdays = async () => {
            try {
                const response = await fetch("https://maram-classmanager-backend.onrender.com/teacher/teachers-birthdays");
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.detail || "فشل في جلب أعياد الميلاد");
                }

                setBirthdays(data.birthdays);
            } catch (error) {
                console.error("Error fetching birthdays:", error);
            }
        };

        fetchBirthdays();
    }, []);

    return (
        <>
            <header className="homepage-header">
                <div className="homepage-header-container">
                    <div className="homepage-logo">
                        <img src="../images/logo-removebg-preview.png" alt="معهد المرام" className="logo-image" />
                    </div>
                    <nav className="homepage-nav">
                        <button className="homepage-nav-button" onClick={() => navigate('/about')}>عن المعهد</button>
                        <button className="homepage-nav-button" onClick={() => navigate('/ContactUs')}>تواصل معنا</button>
                    </nav>
                    <div className="homepage-actions">
                        <button className="homepage-login" onClick={() => navigate('/login')}>تسجيل الدخول</button>
                        <button className="homepage-get-started" onClick={() => navigate('/signup')}>انضم كمعلم</button>
                    </div>
                </div>
            </header>
            <div className="homepage-yellow-line"></div>
            <section className="ramadan-section">
                <div className="ramadan-background"></div>
                <div className="ramadan-content">
                    <h1 className="ramadan-title">رمضان مبارك</h1>
                    <p className="ramadan-message">{message}</p>
                </div>
            </section>

            {/* Yellow Line */}
            <div className="homepage-yellow-line"></div>
            {/* Drive Section */}
            <div className="homepage-yellow-line"></div>
            <section className="homepage-collaboration">
                <div className="homepage-collaboration-container">
                    {/* Image on the left */}
                    <div className="homepage-collaboration-image">
                        <img src="./images/ssss.png" alt="Collaboration" />
                    </div>

                    {/* Text and buttons on the right */}
                    <div className="homepage-collaboration-content">
                        <h2 className="homepage-collaboration-title">تعليم مخصص لكل مستوى</h2>
                        <p className="homepage-collaboration-description">
                            .اختر المستوى التعليمي المناسب وابدأ رحلتك في تطوير مهاراتك مع مواردنا التعليمية المصممة خصيصًا لدعم المعلمين
                        </p>

                        <div className="homepage-collaboration-buttons">
                            <button onClick={() => window.open('https://drive.google.com/level1', '_blank')}>المرحلة الابتدائية</button>
                            <button onClick={() => window.open('https://drive.google.com/level2', '_blank')}>المرحلة الإعدادية</button>
                            <button onClick={() => window.open('https://drive.google.com/level3', '_blank')}>المرحلة الثانوية</button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Yellow Line */}
            <div className="homepage-yellow-line"></div>
            <section className="homepage-policies">
                <div className="homepage-policies-container">
                    <h2 className="homepage-policies-title">قوانين المعهد</h2>
                    <ul className="homepage-policies-list">
                        <li>✅ احترم الآخرين.</li>
                        <li>⏰ كن دقيقًا في مواعيدك.</li>
                        <li>🧹 حافظ على نظافة مكان العمل.</li>
                        <li>⚠️ قم بإبلاغ أي مشاكل على الفور.</li>
                        <li>📚 كن مستعدًا للحصة.</li>
                    </ul>


                </div>
            </section>
            {/* Yellow Line */}
            <div className="homepage-yellow-line"></div>


            <section className="birthday-section">
                <h2 className="birthday-title">Today's Birthdays 🎉</h2>
                {birthdays && birthdays.length > 0 ? (
                    <p className="birthday-message">
                        🎂 Happy Birthday to{" "}
                        {birthdays.map((teacher, index) => (
                            <strong key={index}>
                                {teacher.name}{index < birthdays.length - 1 ? ", " : ""}
                            </strong>
                        ))}!
                        We wish you a wonderful day filled with happiness and joy! 🎉🎂
                    </p>
                ) : (
                    <p className="birthday-no-birthday">No birthdays today. 😊</p>
                )}

                {/* Image container to position images */}
                <div className="birthday-images-container">
                    <img
                        src="../images/events-icon.png"
                        alt="Left Balloon"
                        className="birthday-left-image"
                    />
                    <img
                        src="../images/events-icon.png"
                        alt="Happy Birthday Balloons"
                        className="birthday-background"
                    />
                    <img
                        src="../images/events-icon.png"
                        alt="Right Balloon"
                        className="birthday-right-image"
                    />
                </div>
            </section>


            {/* Yellow Line */}
            <div className="homepage-yellow-line"></div>
            <footer class="site-footer">
                <div class="footer-content">
                    <p>📧 Email: <a href="mailto:m.sarahni.99@gmail.com">m.sarahni.99@gmail.com</a></p>
                    <p>📞 Phone: <a href="tel:+9728250579">+972 8250579</a></p>
                    <p>💻 Technical Support: Mohammad Sarahni</p>

                    <div class="social-links">
                        <a href="https://www.instagram.com/serhanmaram/" target="_blank">📸 Follow us on Instagram</a>
                    </div>

                    <p>© 2025 AL MARAM. All Rights Reserved.</p>
                </div>
            </footer>


        </>

    );
};

export default Homepage;
