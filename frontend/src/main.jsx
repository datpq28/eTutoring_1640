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
import StudentLayout from "./layouts/StudentLayout/StudentLayout";
import DashboardPage from "./pages/student/DashBoardPage/DashboardPage";
import CalendarPage from "./pages/student/CalendarPage/CalendarPage";
import DocumentsPage from "./pages/student/DocumentPage/DocumentsPage";
import BlogPage from "./pages/student/BlogPage/BlogPage";
import MessagePage from "./pages/student/MessagePage/MessagePage";
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
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route path="documents" element={<DocumentsPage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="messages" element={<MessagePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
