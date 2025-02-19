const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");
const MeetingComments = require("../../models/MeetingCommentsModel")

const createMeeting = async (req, res) => {
  try {
    const { name, type, description, tutorId, studentIds, startTime, endTime } =
      req.body;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res
        .status(403)
        .json({ error: "Chỉ giáo viên mới có thể tạo cuộc họp" });
    }

    if (type === "private" && studentIds.length !== 1) {
      return res
        .status(400)
        .json({ error: "Cuộc họp riêng tư chỉ có 1 học sinh" });
    }

    const newMeeting = new Meeting({
      name,
      type,
      description,
      tutorId,
      studentIds,
      startTime,
      endTime,
      meetingLink: `http://localhost:5080/meeting/${tutorId}-${Date.now()}`,
      joinedUsers: [],
    });

    await newMeeting.save();
    res.status(201).json(newMeeting);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMeetingsByUser = async (req, res) => {
  try {
    const { userId, role } = req.params;

    let meetings;
    if (role === "student") {
      meetings = await Meeting.find({ studentIds: userId }).populate(
        "tutorId",
        "email description"
      );
    } else {
      meetings = await Meeting.find({ tutorId: userId }).populate(
        "studentIds",
        "email description"
      );
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

    const meeting = await Meeting.findById(meetingId).populate(
      "tutorId studentIds"
    );

    if (!meeting) {
      return res.status(404).json({ error: "Cuộc họp không tìm thấy" });
    }

    const isTutor = meeting.tutorId._id.toString() === userId;
    const isStudent = meeting.studentIds.some(
      (student) => student._id.toString() === userId
    );

    if (!isTutor && !isStudent) {
      return res
        .status(403)
        .json({ error: "Bạn không có quyền tham gia cuộc họp này" });
    }

    if (
      meeting.type === "private" &&
      isStudent &&
      meeting.studentIds.length > 1
    ) {
      return res
        .status(400)
        .json({ error: "Cuộc họp riêng tư chỉ có 1 học sinh" });
    }

    if (!meeting.joinedUsers) {
      meeting.joinedUsers = [];
    }

    if (!meeting.joinedUsers.includes(userId)) {
      meeting.joinedUsers.push(userId);
      await meeting.save();
    }
    res.json({
      message: `${isTutor ? "Giáo viên" : "Học sinh"} đã tham gia cuộc họp.`,
      meeting,
      link: meeting.meetingLink,
      joinedUsers: meeting.joinedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCommentToMeeting = async (req, res) => {
  try {
    const { meetingId, userId, userType, content } = req.body;

    // Kiểm tra meeting có tồn tại không
    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Cuộc họp không tồn tại" });
    }

    const isTutor = meeting.tutorId.toString() === userId;
    const isStudent = meeting.studentIds.some(
      (studentId) => studentId.toString() === userId
    );

    if (!isTutor && !isStudent) {
      return res.status(403).json({ error: "Bạn không có quyền bình luận" });
    }

    const newComment = new MeetingComments({
      commenterId: userId,
      content,
      meetingId,
      commenterType: userType,
    });

    await newComment.save();

    res.status(201).json({
      message: "Bình luận đã được gửi",
      newComment: {
        ...newComment.toObject(),
        createdAt: newComment.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getCommentsForMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;

    const comments = await MeetingComments.find({ meetingId })
      .populate("commenterId", "email description") 
      .sort({ createdAt: 1 }); 

    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createMeeting,
  getMeetingsByUser,
  joinMeeting,
  getCommentsForMeeting,
  addCommentToMeeting,
};
