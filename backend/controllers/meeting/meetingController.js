const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");
const MeetingComments = require("../../models/MeetingCommentsModel");

let io;
const setSocketIo = (socketIoInstance) => {
  io = socketIoInstance;
};

const createMeeting = async (req, res) => {
  try {
    const { name, type, description, tutorId, studentIds, startTime, endTime } = req.body;

    const tutor = await Tutor.findById(tutorId);
    if (!tutor) {
      return res.status(403).json({ error: "Chỉ giáo viên mới có thể tạo cuộc họp" });
    }

    if (type === "private" && studentIds.length !== 1) {
      return res.status(400).json({ error: "Cuộc họp riêng tư chỉ có 1 học sinh" });
    }

    const meetingLink = `http://localhost:5080/meeting/${tutorId}-${Date.now()}`;

    const newMeeting = new Meeting({
      name,
      type,
      description,
      tutorId,
      studentIds,
      startTime,
      endTime,
      meetingLink,
      joinedUsers: [],
    });

    await newMeeting.save();
    io.emit("meeting-created", newMeeting);
    res.status(201).json({ message: "Cuộc họp đã được tạo", meeting: newMeeting });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCommentsForMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const comments = await MeetingComments.find({ meetingId }).populate("commenterId", "name");
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const joinMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.body;

    const meeting = await Meeting.findById(meetingId).populate("tutorId studentIds");
    if (!meeting) {
      return res.status(404).json({ error: "Cuộc họp không tìm thấy" });
    }

    if (!meeting.joinedUsers.includes(userId)) {
      meeting.joinedUsers.push(userId);
      await meeting.save();
      io.emit("user-joined", { meetingId, userId, joinedUsers: meeting.joinedUsers });
    }

    res.json({
      message: "Người dùng đã tham gia cuộc họp.",
      meeting,
      joinedUsers: meeting.joinedUsers,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const leaveMeeting = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { userId } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Cuộc họp không tồn tại" });
    }

    meeting.joinedUsers = meeting.joinedUsers.filter((id) => id !== userId);
    await meeting.save();

    res.json({ message: "User đã rời cuộc họp", joinedUsers: meeting.joinedUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addCommentToMeeting = async (req, res) => {
  try {
    const { meetingId, userId, userType, content } = req.body;

    const meeting = await Meeting.findById(meetingId);
    if (!meeting) {
      return res.status(404).json({ error: "Cuộc họp không tồn tại" });
    }

    const newComment = new MeetingComments({
      commenterId: userId,
      content,
      meetingId,
      commenterType: userType,
    });

    await newComment.save();
    io.emit("new-comment", { meetingId, newComment });

    res.status(201).json({ message: "Bình luận đã được gửi", newComment });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  setSocketIo,
  createMeeting,
  joinMeeting,
  leaveMeeting,
  addCommentToMeeting,
  getCommentsForMeeting,
};
