
const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");
const Notification = require("../../models/NotificationModel");

const dayjs = require('dayjs');

  // const io = require("../../server"); // Import io từ server.js

  const createMeeting = async (req, res) => {
    try {
      let { name, type, description, tutorId, startTime, endTime, dayOfWeek } = req.body;
  
      if (!dayOfWeek) {
        return res.status(400).json({ error: "Vui lòng chọn ngày họp" });
      }
  
      // Kiểm tra `dayOfWeek` lớn hơn ngày hiện tại
      const today = dayjs();
      const meetingDate = dayjs(dayOfWeek);
      if (meetingDate.isBefore(today, 'day')) {
        return res.status(400).json({ error: "Ngày họp phải lớn hơn ngày hiện tại" });
      }
  
      // Validate `startTime` and `endTime`
      if (!dayjs(startTime).isValid() || !dayjs(endTime).isValid()) {
        return res.status(400).json({ error: "Thời gian không hợp lệ" });
      }
  
      // Ensure `endTime` is at least 2 hours after `startTime`
      if (dayjs(endTime).diff(dayjs(startTime), "hour") < 2) {
        return res.status(400).json({ error: "Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 2 tiếng" });
      }
  
      // Check for overlapping meetings
      const overlappingMeeting = await Meeting.findOne({
        tutorId,
        dayOfWeek,
        startTime: { $lt: endTime }, // Existing meeting starts before the new meeting ends
        endTime: { $gt: startTime }, // Existing meeting ends after the new meeting starts
      });
  
      if (overlappingMeeting) {
        return res.status(400).json({
          error: `Thời gian họp bị trùng với cuộc họp khác (${overlappingMeeting.name}) từ ${new Date(overlappingMeeting.startTime).toLocaleTimeString()} đến ${new Date(overlappingMeeting.endTime).toLocaleTimeString()}`,
        });
      }
  
      // Kiểm tra tutor có tồn tại không
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(403).json({ error: "Chỉ giáo viên hợp lệ mới có thể tạo cuộc họp" });
      }
  
      // Lấy danh sách học sinh của tutor
      const students = await Student.find({ _id: { $in: tutor.studentId } });
  
      if (students.length === 0) {
        return res.status(400).json({ error: "Tutor phải có ít nhất một học sinh để tạo cuộc họp" });
      }
  
      // Tạo cuộc họp mới
      const newMeeting = new Meeting({
        name,
        type,
        description,
        tutorId,
        studentIds: students.map(student => student._id),
        startTime, // Directly use the `startTime` from the frontend
        endTime, // Directly use the `endTime` from the frontend
        dayOfWeek,
        joinedUsers: [],
      });
  
      await newMeeting.save();
  
      // ======================== TẠO NOTIFICATION ========================
      const notificationText = `📅 Cuộc họp mới "${name}" đã được tạo vào ngày ${dayOfWeek} từ ${dayjs(startTime).format("HH:mm")} đến ${dayjs(endTime).format("HH:mm")}`;
  
      const newNotification = new Notification({
        meetingId: newMeeting._id,
        tutorId,
        studentIds: students.map(student => student._id),
        text: notificationText,
        isRead: false,
      });
  
      await newNotification.save();
      console.log("✅ Notification saved:", newNotification);
    
      res.status(201).json({ message: "Cuộc họp đã được tạo", meeting: newMeeting });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const editMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { name, type, description, startTime, endTime, dayOfWeek } = req.body;

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ error: "Cuộc họp không tồn tại" });
        }

        // Kiểm tra `dayOfWeek` lớn hơn ngày hiện tại
        const today = new Date();
        const meetingDate = new Date(dayOfWeek);
        if (meetingDate <= today) {
            return res.status(400).json({ error: "Ngày họp phải lớn hơn ngày hiện tại" });
        }

        // Kiểm tra `endTime` phải cách `startTime` ít nhất 2 tiếng
        const start = new Date(startTime);
        const end = new Date(endTime);
        if ((end - start) / (1000 * 60 * 60) < 2) {
            return res.status(400).json({ error: "Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 2 tiếng" });
        }

        // Kiểm tra xem cuộc họp mới có bị trùng thời gian với cuộc họp khác không
        const overlappingMeeting = await Meeting.findOne({
            _id: { $ne: meetingId }, // Loại trừ chính cuộc họp đang được chỉnh sửa
            tutorId: meeting.tutorId,
            dayOfWeek,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } },
            ],
        });

        if (overlappingMeeting) {
            return res.status(400).json({
                error: `Thời gian họp bị trùng với cuộc họp khác (${overlappingMeeting.name}) từ ${new Date(overlappingMeeting.startTime).toLocaleTimeString()} đến ${new Date(overlappingMeeting.endTime).toLocaleTimeString()}`,
            });
        }

        // Cập nhật cuộc họp
        meeting.name = name || meeting.name;
        meeting.type = type || meeting.type;
        meeting.description = description || meeting.description;
        meeting.startTime = startTime || meeting.startTime;
        meeting.endTime = endTime || meeting.endTime;
        meeting.dayOfWeek = dayOfWeek || meeting.dayOfWeek;

        await meeting.save();

        // ======================== TẠO NOTIFICATION ========================
        const notificationText = `📅 Cuộc họp "${meeting.name}" ngày ${dayOfWeek} từ ${dayjs(startTime).format("HH:mm")} đến ${dayjs(endTime).format("HH:mm")} đã được chỉnh sửa. Vui lòng kiểm tra lại thông tin.`;

        const newNotification = new Notification({
            meetingId: meeting._id,
            tutorId: meeting.tutorId,
            studentIds: meeting.studentIds,
            text: notificationText,
            isRead: false,
        });

        await newNotification.save();
        console.log("✅ Notification saved:", newNotification);


        res.json({ message: "Cập nhật cuộc họp thành công", meeting });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
  
const deleteMeeting = async (req, res) => {
  try {
      const { meetingId } = req.params;

      // Find the meeting by ID
      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
          return res.status(404).json({ error: "Cuộc họp không tồn tại" });
      }

      // Extract dayOfWeek, startTime, and endTime from the meeting object
      const { dayOfWeek, startTime, endTime } = meeting;

      // ======================== TẠO NOTIFICATION ========================
      const notificationText = `❌ Cuộc họp "${meeting.name}" ngày ${dayOfWeek} từ ${dayjs(startTime).format("HH:mm")} đến ${dayjs(endTime).format("HH:mm")} đã bị hủy.`;

      const newNotification = new Notification({
          meetingId: meeting._id,
          tutorId: meeting.tutorId,
          studentIds: meeting.studentIds,
          text: notificationText,
          isRead: false,
      });

      await newNotification.save();
      console.log("✅ Notification saved:", newNotification);

      // Delete the meeting
      await Meeting.findByIdAndDelete(meetingId);
      res.json({ message: "Cuộc họp đã bị xóa thành công" });

  } catch (error) {
      console.error("Error deleting meeting:", error);
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

    const meetings = await Meeting.find({ tutorId })
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

const fetchTutors = async (req, res) => {
  try {
    // Truy vấn danh sách tất cả các tutor
    const tutors = await Tutor.find({}, "firstname lastname email"); 

    if (!tutors || tutors.length === 0) {
      return res.status(404).json({ error: "Không có tutor nào được tìm thấy" });
    }

    res.json({ tutors });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const fetchAllMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find()
      .populate("tutorId", "firstname lastname email") 
      .populate("studentIds", "firstname lastname email");

    res.status(200).json(meetings);
  } catch (error) {
    console.error("Lỗi khi lấy danh sách tất cả cuộc họp:", error);
    res.status(500).json({ error: "Không thể lấy danh sách cuộc họp" });
  }
};



module.exports = {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getMeetingsByTutor,
  getMeetingsByStudent,
  getStudentsByTutor, 
  fetchTutors,
  fetchAllMeetings,
  editMeeting,
  deleteMeeting,
};
