const mongoose = require("mongoose");
const Student = require("../../models/StudentModel");
const Tutor = require("../../models/TutorStudent");

const Meeting = require("../../models/MeetingModel");
const {
  sendMailAssignNewTutor,
  sendMailAssignNewTutorAll,
} = require("../mailService/mailService");

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

const fetchAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("tutorId", "firstname lastname email") // Lấy firstname + lastname
      .populate("studentIds", "firstname lastname email") // Lấy thông tin học sinh
      .sort({ createdAt: -1 });

    res.status(200).json(meetings);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách cuộc họp" });
  }
};

const assignTutorToStudentAll = async (req, res) => {
  try {
    const { studentIds, tutorId } = req.body;

    // Kiểm tra tutor có tồn tại không
    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(400).json({ error: "Not found Tutor" });
    }

    let assignedStudents = [];
    let studentEmails = [];

    // Lặp qua danh sách học sinh
    for (const studentId of studentIds) {
      const student = await Student.findById(studentId);
      if (!student) {
        console.warn(`Student ID ${studentId} not found`);
        continue;
      }

      // Nếu học sinh đã có tutor trước đó, xóa khỏi danh sách tutor cũ
      if (student.tutorId) {
        await Tutor.findByIdAndUpdate(student.tutorId, {
          $pull: { studentId: student._id },
        });
      }

      // Gán tutor mới cho học sinh
      student.tutorId = tutorId;
      await student.save();

      // Thêm học sinh vào danh sách của tutor
      tutor.studentId.push(student._id);

      // Lưu email để gửi thông báo
      studentEmails.push(student.email);
      assignedStudents.push(studentId);
    }

    await tutor.save();

    // Gửi email thông báo cho học sinh và giáo viên
    if (studentEmails.length > 0) {
      await sendMailAssignNewTutorAll(studentEmails, tutor.email);
    }

    res.status(200).json({ message: "Assign success", assignedStudents });
  } catch (error) {
    console.error("Error assigning Tutor to multiple students:", error);
    res.status(500).json({ error: "Error" });
  }
};

const updateMeetingStatus = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { status } = req.body;

    // 🔴 Kiểm tra meetingId hợp lệ
    if (!mongoose.Types.ObjectId.isValid(meetingId)) {
      return res.status(400).json({ error: "ID cuộc họp không hợp lệ" });
    }

    // 🔴 Kiểm tra trạng thái hợp lệ
    const validStatuses = ["approved", "rejected"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ" });
    }

    // 🔍 Tìm kiếm cuộc họp
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Không tìm thấy cuộc họp" });
    }

    // 🚀 Cập nhật trạng thái cuộc họp
    meeting.status = status;
    await meeting.save();

    // 📨 Trả về kết quả cập nhật
    res.status(200).json({
      message: `Cuộc họp đã được cập nhật thành ${status}`,
      meeting,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi server khi cập nhật trạng thái" });
  }
};

const viewListStudentByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tutorId)) {
      return res.status(400).json({ error: "Invalid Tutor ID" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    const students = await Student.find({ tutorId: tutorId });

    res.status(200).json(students);
  } catch (error) {
    console.error("Error fetching students by tutor:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
};

const viewListTutorByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;

    // Validate studentId
    if (!mongoose.Types.ObjectId.isValid(studentId)) {
      return res.status(400).json({ error: "Invalid Student ID" });
    }

    // Find the student
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    // Check if student has a tutor assigned
    if (!student.tutorId) {
      return res.status(200).json({
        message: "No tutor assigned to this student",
        tutor: null,
      });
    }

    // Find the tutor
    const tutor = await Tutor.findById(student.tutorId).select(
      "firstname lastname email"
    ); // Select specific fields if needed

    if (!tutor) {
      return res.status(404).json({ error: "Assigned tutor not found" });
    }

    res.status(200).json({
      message: "Tutor retrieved successfully",
      tutor,
    });
  } catch (error) {
    console.error("Error fetching tutor by student:", error);
    res.status(500).json({ error: "Failed to fetch tutor" });
  }
};

module.exports = {
  viewListUser,
  lockUser,
  unLockUser,
  removeTutorFromStudent,
  assignTutorToStudent,
  updateMeetingStatus,
  fetchAllMeetings,
  assignTutorToStudentAll,
  viewListStudentByTutor,
  viewListTutorByStudent,
};
