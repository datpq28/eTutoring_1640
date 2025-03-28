
const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

  // const io = require("../../server"); // Import io từ server.js



const createMeeting = async (req, res) => {
  try {
    const { name, type, description, tutorId, studentIds, startTime, endTime, dayOfWeek } = req.body;

    if (!dayOfWeek) {
      return res.status(400).json({ error: "Vui lòng chọn ngày họp" });
    }

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(403).json({ error: "Chỉ giáo viên mới có thể tạo cuộc họp" });
    }

    if (type === "private" && studentIds.length !== 1) {
      return res.status(400).json({ error: "Cuộc họp riêng tư chỉ có 1 học sinh" });
    }

    const newMeeting = new Meeting({
      name,
      type,
      description,
      tutorId,
      studentIds,
      startTime,
      endTime,
      dayOfWeek,
      joinedUsers: [],
      status: "pending", // Trạng thái mặc định là chờ duyệt
    });

    await newMeeting.save();

    res.status(201).json({ message: "Cuộc họp đã gửi yêu cầu phê duyệt", meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getMeetingsByUser = async (req, res) => {
  try {
    const { userId, role } = req.params;
    let meetings;

    if (role === "tutor") {
      meetings = await Meeting.find({ tutorId: userId });
    } else if (role === "student") {
      meetings = await Meeting.find({ studentIds: userId });
    } else {
      return res.status(400).json({ error: "Role không hợp lệ" });
    }

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.body;
    const meeting = await Meeting.findById(meetingId);

    if (!meeting || !meeting.studentIds.includes(userId)) {
      return res.status(403).json({ error: "Không thể tham gia cuộc họp này" });
    }

    // Gửi thông báo đến tất cả student trong cuộc họp
    meeting.studentIds.forEach((studentId) => {
      const studentSocket = onlineUsers[studentId]?.socketId;
      if (studentSocket) {
        io.to(studentSocket).emit("user-joined", { meetingId, userId });
      }
    });

    res.json({ message: "Đã tham gia cuộc họp", meeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMeetingsByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    if (!tutorId) {
      return res.status(400).json({ error: "Tutor ID is required" });
    }

    const meetings = await Meeting.find({ tutorId, status: "approved" })
    .populate("studentIds", "firstname lastname email")
    .populate("tutorId", "firstname lastname email") 

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMeetingsByStudent = async (req, res) => {
  try {
    const { studentId } = req.params;
    if (!studentId) {
      return res.status(400).json({ error: "Student ID is required" });
    }

    const meetings = await Meeting.find({ 
      studentIds: studentId, 
      status: "approved" 
    })
    .populate("studentIds", "firstname lastname email")
    .populate("tutorId", "firstname lastname email") 

    res.json(meetings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



const getStudentsByTutor = async (req, res) => {
  try {
    const { tutorId } = req.params;
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor không tồn tại" });
    }

    // Lấy danh sách studentId từ Tutor
    const studentIds = tutor.studentId || [];

    // Truy vấn thông tin học sinh từ model Student
    const students = await Student.find(
      { _id: { $in: studentIds } }, 
      { firstname: 1, lastname: 1 } // Dùng đúng tên trường
    );

    // Định dạng lại dữ liệu trả về
    const studentList = students.map(student => ({
      id: student._id,
      name: `${student.firstname} ${student.lastname}` // Đổi firstName -> firstname
    }));

    res.json({ students: studentList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



module.exports = {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getMeetingsByTutor,
  getMeetingsByStudent,
  getStudentsByTutor, 

};
