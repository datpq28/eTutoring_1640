import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "antd/dist/reset.css";
import "./assets/css/main.css";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import VerifyOTPPage from "./pages/auth/VerifyOTPPage";
import ForgotPasswordPage from "./pages/auth/ForgotPasswordPage";
import SetNewPasswordPage from "./pages/auth/SetNewPasswordPage";

//Student
import StudentLayout from "./layouts/StudentLayout.jsx";
import StudentDashboardPage from "./pages/student/DashboardPage.jsx";
import StudentCalendarPage from "./pages/student/CalendarPage.jsx";
import StudentDocumentsPage from "./pages/student/DocumentsPage.jsx";
import StudentBlogPage from "./pages/student/BlogPage.jsx";
import StudentMessagePage from "./pages/student/MessagePage.jsx";

//Tutor
import TutorLayout from "./layouts/TutorLayout.jsx";
import TutorDashboardPage from "./pages/tutor/DashboardPage.jsx";
import TutorCalendarPage from "./pages/tutor/CalendarPage.jsx";
import TutorDocumentsPage from "./pages/tutor/DocumentsPage.jsx";
import TutorBlogPage from "./pages/tutor/BlogPage.jsx";
import TutorMessagePage from "./pages/tutor/MessagePage.jsx";
import TutorMeetingPage from "./pages/tutor/MeetingPage.jsx";

//Admin
import AdminLayout from "./layouts/AdminLayout.jsx";
import AdminDashboardPage from "./pages/admin/DashboardPage.jsx";
import AdminCalendarPage from "./pages/admin/CalendarPage.jsx";
import BlogManagementPage from "./pages/admin/BlogManagementPage.jsx";
import DocumentManagementPage from "./pages/admin/DocumentManagementPage.jsx";
import MeetingManagementPage from "./pages/admin/MeetingManagementPage.jsx";
import AccountsManagementPage from "./pages/admin/AccountsManagementPage.jsx";
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="auth/login" element={<LoginPage />} />
        <Route path="auth/register" element={<RegisterPage />} />
        <Route path="auth/verify-otp" element={<VerifyOTPPage />} />
        <Route path="auth/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="auth/set-new-password" element={<SetNewPasswordPage />} />
        <Route path="student" element={<StudentLayout />}>
          <Route path="dashboard" element={<StudentDashboardPage />} />
          <Route path="calendar" element={<StudentCalendarPage />} />
          <Route path="documents" element={<StudentDocumentsPage />} />
          <Route path="blog" element={<StudentBlogPage />} />
          <Route path="messages" element={<StudentMessagePage />} />
        </Route>
        <Route path="tutor" element={<TutorLayout />}>
          <Route path="dashboard" element={<TutorDashboardPage />} />
          <Route path="calendar" element={<TutorCalendarPage />} />
          <Route path="documents" element={<TutorDocumentsPage />} />
          <Route path="blog" element={<TutorBlogPage />} />
          <Route path="messages" element={<TutorMessagePage />} />
          <Route path="meeting/:meetingId" element={<TutorMeetingPage />} />
        </Route>
        <Route path="admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="calendar" element={<AdminCalendarPage />} />
          <Route
            path="accounts-management"
            element={<AccountsManagementPage />}
          />
          <Route path="blog-management" element={<BlogManagementPage />} />
          <Route
            path="document-management"
            element={<DocumentManagementPage />}
          />
          <Route
            path="meeting-management"
            element={<MeetingManagementPage />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
