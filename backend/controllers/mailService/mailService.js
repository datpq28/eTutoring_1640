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
const sendAdminApprovalRequest = async (adminEmail, token) => {
  try {
      const approvalLink = `http://localhost:5090/api/auth/approveAdmin?token=${token}`;

      const approvalMailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: adminEmail, // Use the admin's email
          subject: "Admin Login Approval Request",
          text: `An admin is trying to log in. Click the link below to approve:\n${approvalLink}`,
      };

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
const sendMailAssignNewTutorAll = async (studentEmails, tutorEmail) => {
  try {
    // Gửi email cho từng học sinh
    const studentMailPromises = studentEmails.map((studentEmail) => {
      const studentMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: studentEmail,
        subject: "Assign New Tutor",
        text: `You have been assigned a new tutor. Your new tutor's email is: ${tutorEmail}`,
      };
      return transporter.sendMail(studentMailOptions);
    });

    // Gửi email cho giáo viên với danh sách học sinh mới
    const tutorMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: tutorEmail,
      subject: "New Students Assigned",
      text: `You have been assigned new students. Their emails are:
      ${studentEmails.join("\n")}`,
    };

    // Thực hiện gửi tất cả email đồng thời
    await Promise.all([...studentMailPromises, transporter.sendMail(tutorMailOptions)]);

    console.log("Emails sent successfully to tutor and students!");
  } catch (error) {
    console.error("Error sending bulk assignment emails:", error);
  }
};

module.exports = { sendMailAssignNewTutor, sendAdminApprovalRequest, sendMailAssignNewTutorAll };
