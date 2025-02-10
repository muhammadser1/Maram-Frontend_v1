import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaInstagram, FaHeadset } from 'react-icons/fa';
import '../styles/ContactUs.css'; // Make sure to create this CSS file

const ContactUs = () => {
    const navigate = useNavigate();

    return (
        <div className="contact-container">
            <div className="contact-content">
                <h1 className="contact-title">تواصل معنا - معهد المرام</h1>
                <p className="contact-description">
                    نؤمن أن التواصل هو مفتاح النجاح، ونحن هنا لدعمك!
                    لا تتردد في الاتصال بنا لأي استفسارات أو مساعدة تقنية
                </p>

                <div className="contact-section">
                    <FaHeadset className="contact-icon" />
                    <p className="contact-text">💻 الدعم الفني: محمد سراحنة</p>
                </div>

                <div className="contact-section">
                    <FaPhone className="contact-icon" />
                    <p className="contact-text">📞 الهاتف: 0538250579 </p>
                </div>

                <div className="contact-section">
                    <FaEnvelope className="contact-icon" />
                    <p className="contact-text">📧 البريد الإلكتروني: m.sarahni.99@gmail.com</p>
                </div>

                <div className="contact-section">
                    <FaInstagram className="contact-icon" />
                    <p className="contact-text">
                        📸 تابعنا على إنستجرام:
                        <a href="https://www.instagram.com/serhanmaram/" target="_blank" rel="noopener noreferrer" className="contact-highlight">
                            AL_MARAM
                        </a>
                    </p>                </div>

                {/* Centered Back Button */}
                <button className="back-home-button" onClick={() => navigate('/homepage')}>
                    العودة إلى الصفحة الرئيسية
                </button>
            </div>
        </div>
    );
};

export default ContactUs;
