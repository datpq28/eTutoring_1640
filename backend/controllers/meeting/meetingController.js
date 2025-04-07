
const Meeting = require("../../models/MeetingModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");
const Notification = require("../../models/NotificationModel");

const dayjs = require('dayjs');

  // const io = require("../../server"); // Import io từ server.js

  const createMeeting = async (req, res) => {
    try {
      let { name, description, tutorId, startTime, endTime, dayOfWeek } = req.body;
  
      if (!dayOfWeek) {
        return res.status(400).json({ error: "Please select a meeting date" });
      }
  
      // Check `dayOfWeek`
      const today = dayjs();
      const meetingDate = dayjs(dayOfWeek);
      if (meetingDate.isBefore(today, 'day')) {
        return res.status(400).json({ error: "Meeting date must be greater than current date" });
      }
  
      // Validate `startTime` and `endTime`
      if (!dayjs(startTime).isValid() || !dayjs(endTime).isValid()) {
        return res.status(400).json({ error: "Invalid time" });
      }
  
      // Ensure `endTime` is at least 2 hours after `startTime`
      if (dayjs(endTime).diff(dayjs(startTime), "hour") < 2) {
        return res.status(400).json({ error: "The end time must be at least 2 hours from the start time." });
      }
  
      // Check for overlapping meetings
      const overlappingMeeting = await Meeting.findOne({
        tutorId,
        dayOfWeek,
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
      });
  
      if (overlappingMeeting) {
        return res.status(400).json({
          error: `Meeting time overlaps with another meeting (${overlappingMeeting.name}) 
          start at ${new Date(overlappingMeeting.startTime).toLocaleTimeString()} to ${new Date(overlappingMeeting.endTime).toLocaleTimeString()}`,
        });
      }
  
      const tutor = await Tutor.findById(tutorId);
      if (!tutor) {
        return res.status(403).json({ error: "Only authorized teachers can create meetings." });
      }
  
      const students = await Student.find({ _id: { $in: tutor.studentId } });
  
      if (students.length === 0) {
        return res.status(400).json({ error: "Tutor must have at least one student to create a meeting" });
      }

      const newMeeting = new Meeting({
        name,
        description,
        tutorId,
        studentIds: students.map(student => student._id),
        startTime, 
        endTime,
        dayOfWeek,
      });
  
      await newMeeting.save();
  
      // ======================== Create NOTIFICATION ========================
      const notificationText = `📅 New meeting "${name}" was created on ${dayOfWeek} 
      start ${dayjs(startTime).format("HH:mm")} to ${dayjs(endTime).format("HH:mm")}`;
  
      const newNotification = new Notification({
        meetingId: newMeeting._id,
        tutorId,
        studentIds: students.map(student => student._id),
        text: notificationText,
        isRead: false,
      });
  
      await newNotification.save();
      console.log("✅ Notification saved:", newNotification);
    
      res.status(201).json({ message: "Meeting has been created", meeting: newMeeting });
  
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  
  
  const editMeeting = async (req, res) => {
    try {
        const { meetingId } = req.params;
        const { name, description, startTime, endTime, dayOfWeek } = req.body;

        const meeting = await Meeting.findById(meetingId);
        if (!meeting) {
            return res.status(404).json({ error: "Meeting does not exist" });
        }
        const today = new Date();
        const meetingDate = new Date(dayOfWeek);
        if (meetingDate <= today) {
            return res.status(400).json({ error: "Meeting date must be greater than current date" });
        }
        const start = new Date(startTime);
        const end = new Date(endTime);
        if ((end - start) / (1000 * 60 * 60) < 2) {
            return res.status(400).json({ error: "The end time must be at least 2 hours from the start time." });
        }
        const overlappingMeeting = await Meeting.findOne({
            _id: { $ne: meetingId },
            tutorId: meeting.tutorId,
            dayOfWeek,
            $or: [
                { startTime: { $lt: end }, endTime: { $gt: start } },
            ],
        });

        if (overlappingMeeting) {
            return res.status(400).json({
                error: `Meeting time overlaps with another meeting (${overlappingMeeting.name})
                 start ${new Date(overlappingMeeting.startTime).toLocaleTimeString()} to ${new Date(overlappingMeeting.endTime).toLocaleTimeString()}`,
            });
        }

        meeting.name = name || meeting.name;
        meeting.description = description || meeting.description;
        meeting.startTime = startTime || meeting.startTime;
        meeting.endTime = endTime || meeting.endTime;
        meeting.dayOfWeek = dayOfWeek || meeting.dayOfWeek;

        await meeting.save();

        const notificationText = `📅 Meeting "${meeting.name}" on ${dayOfWeek} 
        start ${dayjs(startTime).format("HH:mm")} to ${dayjs(endTime).format("HH:mm")} has been edited. Please check the information again.`;

        const newNotification = new Notification({
            meetingId: meeting._id,
            tutorId: meeting.tutorId,
            studentIds: meeting.studentIds,
            text: notificationText,
            isRead: false,
        });

        await newNotification.save();
        console.log("✅ Notification saved:", newNotification);


        res.json({ message: "Meeting update successful", meeting });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
  
  
const deleteMeeting = async (req, res) => {
  try {
      const { meetingId } = req.params;

      const meeting = await Meeting.findById(meetingId);
      if (!meeting) {
          return res.status(404).json({ error: "Meeting does not exist" });
      }

      const { dayOfWeek, startTime, endTime } = meeting;

      const notificationText = `❌ Meeting "${meeting.name}" on ${dayOfWeek} 
      start ${dayjs(startTime).format("HH:mm")} to ${dayjs(endTime).format("HH:mm")} has been canceled.`;

      const newNotification = new Notification({
          meetingId: meeting._id,
          tutorId: meeting.tutorId,
          studentIds: meeting.studentIds,
          text: notificationText,
          isRead: false,
      });

      await newNotification.save();
      console.log("✅ Notification saved:", newNotification);

      await Meeting.findByIdAndDelete(meetingId);
      res.json({ message: "The meeting was successfully deleted." });

  } catch (error) {
      console.error("Error deleting meeting:", error);
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
      return res.status(404).json({ error: "Tutor does not exist" });
    }
    const studentIds = tutor.studentId || [];

    const students = await Student.find(
      { _id: { $in: studentIds } }, 
      { firstname: 1, lastname: 1 }
    );
    const studentList = students.map(student => ({
      id: student._id,
      name: `${student.firstname} ${student.lastname}` 
    }));

    res.json({ students: studentList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const fetchTutors = async (req, res) => {
  try {
    const tutors = await Tutor.find({}, "firstname lastname email"); 

    if (!tutors || tutors.length === 0) {
      return res.status(404).json({ error: "Tutor does not exist" });
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
    console.error("Error while getting list of all meetings:", error);
    res.status(500).json({ error: "Unable to get meeting list" });
  }
};



module.exports = {
  createMeeting,
  joinMeeting,
  getMeetingsByTutor,
  getMeetingsByStudent,
  getStudentsByTutor, 
  fetchTutors,
  fetchAllMeetings,
  editMeeting,
  deleteMeeting,
};
