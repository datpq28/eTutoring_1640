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
import StudentLayout from "./layouts/StudentLayout/StudentLayout";
import StudentDashboardPage from "./pages/student/DashboardPage/DashboardPage";
import StudentCalendarPage from "./pages/student/CalendarPage/CalendarPage";
import StudentDocumentsPage from "./pages/student/DocumentPage/DocumentsPage";
import StudentBlogPage from "./pages/student/BlogPage/BlogPage";
import StudentMessagePage from "./pages/student/MessagePage/MessagePage";

//Tutor
import TutorLayout from "./layouts/TutorLayout/TutorLayout";
import TutorDashboardPage from "./pages/tutor/DashboardPage/DashboardPage";
import TutorCalendarPage from "./pages/tutor/CalendarPage/CalendarPage";
import TutorDocumentsPage from "./pages/tutor/DocumentPage/DocumentsPage";
import TutorBlogPage from "./pages/tutor/BlogPage/BlogPage";
import TutorMessagePage from "./pages/tutor/MessagePage/MessagePage";
import TutorMeetingPage from "./pages/tutor/MeetingPage/MeetingPage";

//Admin
import AdminLayout from "./layouts/AdminLayout/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage/DashboardPage";
import AdminCalendarPage from "./pages/admin/CalendarPage/CalendarPage";
import BlogManagementPage from "./pages/admin/BlogManagementPage/BlogManagementPage";
import DocumentManagementPage from "./pages/admin/DocumentManagementPage/DocumentManagementPage";
import MeetingManagementPage from "./pages/admin/MeetingManagementPage/MeetingManagementPage";
import AccountsManagementPage from "./pages/admin/AccountsManagementPage/AccountsManagementPage";
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
          <Route path="meeting" element={<TutorMeetingPage />} />
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
