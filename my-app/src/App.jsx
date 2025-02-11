import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Login from "./Components/Login";
import Signup from "./Components/Signup";
import HomePage from "./Components/HomePage";
import AboutInstitute from "./Components/about";
import ContactUs from "./Components/ContactUs";
import ForgetPassword from "./Components/ForgetPassword";
import TeacherDashboard from "./Components/TeacherDashboard";
import VerifyEmail from "./Components/verify-email";
import ResetPassword from './Components/ResetPassword';
import ResendVerification from "./Components/ResendVerification";
import CreateIndividualLesson from "./Components/CreateIndividualLesson";
import ViewPendingIndividualLessons from "./Components/ViewPendingIndividualLessons";
import ViewApprovedIndividualLessons from "./Components/ViewApprovedIndividualLessons";
import ViewApprovedGroupLessons from "./Components/ViewApprovedGroupLessons";
import ViewPendingGroupLessons from "./Components/ViewPendingGroupLessons";
import CreateGroupLesson from "./Components/CreateGroupLesson";
import DashboardOverview from "./Components/DashboardOverview";
import AdminDashboard from "./Components/AdminDashboard";
import ApprovedIndividualLessonsAdmin from "./Components/ApprovedIndividualLessonsAdmin";
import PendingIndividualLessonsAdmin from "./Components/PendingIndividualLessonsAdmin";
import PendingGroupLessonsAdmin from "./Components/PendingGroupLessonsAdmin";
import ApprovedGroupLessonsAdmin from "./Components/ApprovedGroupLessonsAdmin";
import SystemOverview from "./Components/SystemOverview";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutInstitute />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="/ForgetPassword" element={<ForgetPassword />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/TeacherDashboard" element={<TeacherDashboard />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/ResendVerification" element={<ResendVerification />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/CreateIndividualLesson" element={<CreateIndividualLesson />} />
        <Route path="/ViewPendingIndividualLessons" element={<ViewPendingIndividualLessons />} />
        <Route path="/ViewApprovedIndividualLessons" element={<ViewApprovedIndividualLessons />} />
        <Route path="/ViewApprovedGroupLessons" element={<ViewApprovedGroupLessons />} />
        <Route path="/ViewPendingGroupLessons" element={<ViewPendingGroupLessons />} />
        <Route path="/CreateGroupLesson" element={<CreateGroupLesson />} />
        <Route path="/DashboardOverview" element={<DashboardOverview />} />
        <Route path="/AdminDashboard" element={<AdminDashboard />} />
        <Route path="/ApprovedIndividualLessonsAdmin" element={<ApprovedIndividualLessonsAdmin />} />
        <Route path="/PendingIndividualLessonsAdmin" element={<PendingIndividualLessonsAdmin />} />
        <Route path="/PendingGroupLessonsAdmin" element={<PendingGroupLessonsAdmin />} />
        <Route path="/ApprovedGroupLessonsAdmin" element={<ApprovedGroupLessonsAdmin />} />
        <Route path="/SystemOverview" element={<SystemOverview />} />

      </Routes>
    </Router>
  );
}

export default App; // Ensure this is a default export
