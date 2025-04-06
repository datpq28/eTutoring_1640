const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

const transporter = nodemailer.createTransport({
  service: "gmail", 
  auth: {
    user: process.env.EMAIL_USERNAME,  
    pass: process.env.EMAIL_PASSWORD,  
  },
});

const sendAdminApprovalRequest = async (adminEmail, token) => {
  try {
      const approvalLink = `http://localhost:5090/api/auth/approveAdmin?token=${token}`;

      const approvalMailOptions = {
          from: process.env.EMAIL_USERNAME,
          to: adminEmail, 
          subject: "Admin Login Approval Request",
          text: `An admin is trying to log in. Click the link below to approve:\n${approvalLink}`,
      };

      await transporter.sendMail(approvalMailOptions);
      console.log("Admin approval request email sent successfully!");
  } catch (error) {
      console.error("Error sending admin approval request email:", error);
  }
};

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
    const studentMailPromises = studentEmails.map((studentEmail) => {
      const studentMailOptions = {
        from: process.env.EMAIL_USERNAME,
        to: studentEmail,
        subject: "Assign New Tutor",
        text: `You have been assigned a new tutor. Your new tutor's email is: ${tutorEmail}`,
      };
      return transporter.sendMail(studentMailOptions);
    });

    const tutorMailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: tutorEmail,
      subject: "New Students Assigned",
      text: `You have been assigned new students. Their emails are:
      ${studentEmails.join("\n")}`,
    };i
    await Promise.all([...studentMailPromises, transporter.sendMail(tutorMailOptions)]);

    console.log("Emails sent successfully to tutor and students!");
  } catch (error) {
    console.error("Error sending bulk assignment emails:", error);
  }
};

module.exports = { sendMailAssignNewTutor, sendAdminApprovalRequest, sendMailAssignNewTutorAll };
