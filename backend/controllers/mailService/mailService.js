const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

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

module.exports = {sendMailAssignNewTutor}