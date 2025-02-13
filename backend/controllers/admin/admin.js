const mongoose = require("mongoose");
const Student = require("../../models/StudentModel");
const Tutor = require("../../models/TutorStudent");
const { sendMailAssignNewTutor } = require("../mailService/mailService");

const viewListUser = async (req, res) => {
  try {
    const students = await Student.find({});
    const tutors = await Tutor.find({});

    res.status(200).json({
      students,
      tutors,
    });
  } catch (error) {
    console.error("Error fetching user list:", error);
    res.status(500).json({ error: "Failed to fetch user list" });
  }
};

const lockUser = async (req, res) => {
  const { email } = req.body;

  let user = await Student.findOne({ email });
  let role = "student";

  if (!user) {
    user = await Tutor.findOne({ email });
    role = "tutor";
  }

  if (!user) {
    return res.status(400).json({ error: "Not found user" });
  }

  if (user.isLocked) {
    return res.status(400).json({ error: "User is already locked" });
  }

  user.isLocked = true;
  await user.save();

  res.status(200).json({
    message: `User ${email} has been locked`,
    role,
    isLocked: user.isLocked,
  });
};

const unLockUser = async (req, res) => {
  const { email } = req.body;

  let user = await Student.findOne({ email });
  let role = "student";

  if (!user) {
    user = await Tutor.findOne({ email });
    role = "tutor";
  }

  if (!user) {
    return res.status(400).json({ error: "Not found user" });
  }

  if (!user.isLocked) {
    return res.status(400).json({ error: "User is already unlocked" });
  }

  user.isLocked = false;
  await user.save();

  res.status(200).json({
    message: `User ${email} has been unlocked`,
    role,
    isLocked: user.isLocked,
  });
};

const removeTutorFromStudent = async (req, res) => {
  try {
    const { studentId } = req.body;
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Not found Student" });
    }

    if (student.tutorId == null) {
      return res.status(400).json({ error: "Student not have tutor before" });
    }

    await Tutor.findByIdAndUpdate(student.tutorId, {
      $pull: { studentId: student._id },
    });

    student.tutorId = null;
    await student.save();

    res
      .status(200)
      .json({ message: "Remove Tutor from Student successfully", student });
  } catch (error) {
    console.error("Error remove Tutor:", error);
    res.status(500).json({ error: "Error" });
  }
};

const assignTutorToStudent = async (req, res) => {
  try {
    const { studentId, tutorId } = req.body;

    const student = await Student.findById(studentId);
    const tutor = await Tutor.findById(tutorId);

    if (!student) {
      res.status(400).json({ error: "Not found Student" });
    }

    if (!tutor) {
      res.status(400).json({ error: "Not found Tutor" });
    }

    if (student.tutorId) {
      await Tutor.findByIdAndUpdate(student.tutorId, {
        $pull: { studentId: student._id },
      });
    }

    student.tutorId = tutorId;
    await student.save();

    tutor.studentId.push(student._id);
    await tutor.save();

    res.status(200).json({ message: "Assign success", student });

    await sendMailAssignNewTutor(student.email, tutor.email);
  } catch (error) {
    console.error("Error assign Tutor:", error);
    res.status(500).json({ error: "Error" });
  }
};
module.exports = {
  viewListUser,
  lockUser,
  unLockUser,
  removeTutorFromStudent,
  assignTutorToStudent,
};
