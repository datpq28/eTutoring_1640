const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

// Tạo transporter cho nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Hoặc bạn có thể dùng dịch vụ khác như SendGrid, Mailgun, v.v.
  auth: {
    user: process.env.EMAIL_USERNAME,  // Đảm bảo bạn đã cấu hình đúng EMAIL_USERNAME trong .env
    pass: process.env.EMAIL_PASSWORD,  // Đảm bảo bạn đã cấu hình đúng EMAIL_PASSWORD trong .env
  },
});

// Hàm gửi email thông báo phê duyệt admin
const sendAdminApprovalRequest = async () => {
  try {
    // Tạo token phê duyệt cho admin
    const token = jwt.sign(
      { email: 'admin' },  // Thông tin của admin cần phê duyệt (có thể thay đổi)
      process.env.JWT_SECRET,  // Mã bí mật của JWT từ file .env
      { expiresIn: '1h' }  // Token hết hạn sau 1 giờ
    );

    // Tạo link phê duyệt với token
    const approvalLink = `http://localhost:5080/api/auth/approveAdmin?token=${token}`;

    // Tạo nội dung email với link phê duyệt
    const approvalMailOptions = {
      from: process.env.EMAIL_USERNAME,  // Địa chỉ email gửi
      to: "nguyenkhaccao1@gmail.com",   // Địa chỉ email admin nhận yêu cầu phê duyệt
      subject: "Admin Login Approval Request",  // Tiêu đề email
      text: `An admin is trying to log in. Click the link below to approve:\n${approvalLink}`,  // Nội dung email với link phê duyệt
    };

    // Gửi email phê duyệt admin
    await transporter.sendMail(approvalMailOptions);
    console.log("Admin approval request email sent successfully!");
  } catch (error) {
    console.error("Error sending admin approval request email:", error);
  }
};

// Hàm gửi email khi gán tutor mới cho student
const sendMailAssignNewTutor = async (studentEmail, tutorEmail) => {
  try {
    const studentMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: studentEmail,
      subject: "Assign New Tutor",
      text: `You have been assigned a new tutor. Your new tutor's email is: ${tutorEmail}`,
    };

    const tutorMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: tutorEmail,
      subject: "New Student Assigned",
      text: `You have been assigned a new student. The student's email is: ${studentEmail}`,
    };

    await Promise.all([
      transporter.sendMail(studentMailOptions),
      transporter.sendMail(tutorMailOptions),
    ]);

    console.log("Emails sent successfully!");
  } catch (error) {
    console.error("Error sending emails:", error);
  }
};

module.exports = { sendMailAssignNewTutor, sendAdminApprovalRequest };
