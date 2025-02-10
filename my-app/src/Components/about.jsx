import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/about.css'; // Using the same background as the homepage
import { FaChalkboardTeacher, FaUsers, FaLightbulb, FaHandsHelping } from 'react-icons/fa';

const AboutInstitute = () => {
    const navigate = useNavigate();

    return (
        <div className="homepage-container"> {/* Reusing homepage styles for background */}
            <div className="about-content">
                <h1 className="about-title">معهد المرام - بيئة تعليمية متميزة</h1>

                <div className="about-section">
                    <FaChalkboardTeacher className="about-icon" />
                    <p className="about-text">99% من طاقمنا التعليمي من النساء، مما يخلق بيئة تعليمية مليئة بالدعم والتمكين.</p>
                </div>

                <div className="about-section">
                    <FaUsers className="about-icon" />
                    <p className="about-text">مجتمع متعاون ومتفاعل، حيث يشعر الجميع بالراحة في التعبير عن أفكارهم ومشاركة تجاربهم.</p>
                </div>

                <div className="about-section">
                    <FaLightbulb className="about-icon" />
                    <p className="about-text">نحن نؤمن بأن التعليم ليس مجرد دروس، بل هو إلهام وإبداع ورحلة مستمرة نحو التطور.</p>
                </div>

                <div className="about-section">
                    <FaHandsHelping className="about-icon" />
                    <p className="about-text">بيئة محفزة وداعمة للمعلمين، حيث تتوفر أحدث الوسائل التعليمية لضمان تجربة تعليمية مثالية.</p>
                </div>

                {/* Back to Home Button */}
                <button className="back-home-button" onClick={() => navigate('/homepage')}>
                    العودة إلى الصفحة الرئيسية
                </button>
            </div>
        </div>
    );
};

export default AboutInstitute;
