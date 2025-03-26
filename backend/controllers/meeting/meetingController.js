const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

const io = require("../../server"); // Import io từ server.js

const createMeeting = async (req, res) => {
  try {
    const { tutorId, name, description, startTime, endTime } = req.body;

    console.log("📌 Nhận request tạo cuộc họp với tutorId:", tutorId);

    // Kiểm tra tutorId có tồn tại không
    if (!tutorId) {
      console.log("❌ Lỗi: tutorId không được cung cấp!");
      return res.status(400).json({ error: "Thiếu tutorId!" });
    }

    // Kiểm tra tutor có tồn tại trong DB không
    const tutor = await Tutor.findById(tutorId).populate("students");
    if (!tutor) {
      console.log(`❌ Lỗi: Tutor với ID ${tutorId} không tồn tại trong database!`);
      return res.status(404).json({ error: "Tutor không tồn tại!" });
    }

    console.log("✅ Tutor tìm thấy:", tutor);

    // Lấy danh sách học sinh của Tutor
    const studentIds = tutor.students.map((student) => student._id);
    console.log("📌 Danh sách học sinh thuộc tutor:", studentIds);

    // Tạo cuộc họp
    const meeting = new Meeting({
      tutorId,
      name,
      description,
      studentIds,
      joinedUsers: studentIds,
      participantType: "Student",
      startTime,
      endTime,
    });

    await meeting.save();
    console.log("✅ Cuộc họp đã được tạo thành công:", meeting);

    res.status(201).json(meeting);
  } catch (error) {
    console.log("❌ Lỗi khi tạo cuộc họp:", error.message);
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

const getAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find().populate("tutorId", "name").populate("studentIds", "name");
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

    res.json({ studentIds: tutor.studentId || [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getAllMeetings,
  getStudentsByTutor, 
};
