import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/homepage.css';
import { CheckCircle } from "lucide-react";

const Homepage = () => {
    const navigate = useNavigate();
    const [birthdays, setBirthdays] = useState([]);
    const goToLogin = () => navigate('/login');
    const goToSignup = () => navigate('/signup');
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
                setError("حدث خطأ أثناء جلب بيانات أعياد الميلاد.");
            } finally {
                setLoading(false);
            }
        };

        fetchBirthdays();
    }, []);

    return (
        <>
            <header className="homepage-header">
                <div className="homepage-header-container">
                    <div className="homepage-logo">معهد المرام</div>
                    <nav className="homepage-nav">
                        <button className="homepage-nav-button" onClick={() => navigate('/about')}>عن المعهد</button>
                        <button className="homepage-nav-button" onClick={() => navigate('/ContactUs')}>تواصل معنا</button>


                    </nav>
                    <div className="homepage-actions">
                        <button className="homepage-login" onClick={goToLogin}>تسجيل الدخول</button>
                        <button className="homepage-get-started" onClick={goToSignup}>انضم كمعلم</button>
                    </div>
                </div>
            </header>


            {/* Yellow Line */}
            <div className="homepage-yellow-line"></div>

            {/* Hero Section */}
            <section className="homepage-hero">
                <div className="homepage-hero-container">
                    <div className="homepage-hero-text">
                        <h1 className="homepage-hero-title">طور مهاراتك التعليمية مع معهد المرام</h1>
                        <p className="homepage-hero-description">
                            انضم إلى معهد المرام وكن جزءًا من شبكة من المعلمين المحترفين. نوفر لك الأدوات والدورات التي تحتاجها لتعزيز تجربتك التعليمية وتوسيع مهاراتك.
                        </p>
                        <button className="homepage-hero-button" onClick={goToSignup}>ابدأ رحلتك التعليمية الآن</button>
                    </div>
                    <div className="homepage-hero-image">
                        <img src="../images/sss.png" alt="معهد المرام للمعلمين" />
                    </div>
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
