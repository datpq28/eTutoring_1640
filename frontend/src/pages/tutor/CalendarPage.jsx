import { useState, useEffect } from "react";
import {
  Layout,
  Calendar,
  Badge,
  Card,
  Button,
  Modal,
  Input,
  Select,
  DatePicker,
  TimePicker,
  notification,
  List,
} from "antd";
import dayjs from "dayjs";
import { fetchStudentsByTutor, createMeeting, fetchMeetingsByTutor } from "../../../api_service/meeting_service";
import { io } from "socket.io-client";
const socket = io("http://localhost:5090");

import { useNavigate } from "react-router-dom"; 

const { Content } = Layout;
const { Option } = Select;

export default function CalendarPage() {
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isMeetingListVisible, setIsMeetingListVisible] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [meetingName, setMeetingName] = useState("");
  const [meetingType, setMeetingType] = useState("group");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [dayOfWeek, setDayOfWeek] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [role, setRole] = useState(null);
  const [tutorId, setTutorId] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]); // Danh sách cuộc họp cho pop-up
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedTutorId = localStorage.getItem("userId");

    if (storedRole === "tutor" && storedTutorId) {
      setRole("tutor");
      setTutorId(storedTutorId);
      loadStudents(storedTutorId);
      loadMeetings(storedTutorId);
    }
  }, []);

  const loadStudents = async (tutorId) => {
    const data = await fetchStudentsByTutor(tutorId);
    setStudents(data);
  };

  const loadMeetings = async (tutorId) => {
    const data = await fetchMeetingsByTutor(tutorId);
    setMeetings(data.filter((meeting) => meeting.status === "approved")); // Chỉ hiển thị cuộc họp đã duyệt
  };

  const handleCreateMeeting = async () => {
    if (!meetingName || !dayOfWeek || !startTime || !endTime || selectedStudents.length === 0) {
      notification.error({ message: "Vui lòng nhập đầy đủ thông tin" });
      return;
    }
  
    const startDateTime = dayOfWeek.hour(startTime.hour()).minute(startTime.minute());
    const endDateTime = dayOfWeek.hour(endTime.hour()).minute(endTime.minute());
  
    const newMeeting = {
      name: meetingName,
      type: meetingType,
      description: meetingDescription,
      tutorId: tutorId,
      studentIds: selectedStudents,
      startTime: startDateTime.toISOString(),
      endTime: endDateTime.toISOString(),
      dayOfWeek: dayOfWeek.format("YYYY-MM-DD"),
      status: "pending", // Luôn đặt trạng thái pending
    };
  
    const result = await createMeeting(newMeeting);
    if (result.error) {
      notification.error({ message: result.error });
    } else {
      notification.success({ message: "Cuộc họp đang chờ duyệt" });
      setIsCreateModalVisible(false);
    }
  };
  
  // Xử lý khi tutor nhấn "Start Meeting"
  const handleStartMeeting = (meeting) => {
    if (!meeting || !meeting._id) {
      console.error("Meeting ID is undefined!", meeting);
      return;
    }
  
    console.log("Starting Meeting:", meeting._id); // Debug để kiểm tra ID nhận được
    socket.emit("start_call", { meetingId: meeting._id, tutorId: meeting.tutorId });
    navigate(`/tutor/meeting/${meeting._id}`);
  };

  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const meetingsOnThisDay = meetings.filter(
      (meeting) => dayjs(meeting.startTime).format("YYYY-MM-DD") === formattedDate
    );

    return (
      <ul
        style={{ listStyle: "none", padding: 0, cursor: meetingsOnThisDay.length > 0 ? "pointer" : "default" }}
        onClick={() => {
          if (meetingsOnThisDay.length > 0) {
            setSelectedDateMeetings(meetingsOnThisDay);
            setIsMeetingListVisible(true);
          }
        }}
      >
        {meetingsOnThisDay.map((meeting) => (
          <li key={meeting._id}>
            <Badge
              status="processing"
              text={`${meeting.name} (${dayjs(meeting.startTime).format("HH:mm")} - ${dayjs(meeting.endTime).format("HH:mm")})`}
            />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <Card>
        {role === "tutor" && (
          <Button
            type="primary"
            onClick={() => setIsCreateModalVisible(true)}
            style={{ marginBottom: "1rem" }}
          >
            Tạo Cuộc Họp
          </Button>
        )}
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      {/* Modal danh sách cuộc họp trong ngày */}
      <Modal
        title={"Danh sách cuộc họp"}
        open={isMeetingListVisible}
        onCancel={() => setIsMeetingListVisible(false)}
        footer={null}
      >
        <List
          itemLayout="vertical"
          dataSource={selectedDateMeetings}
          renderItem={(meeting) => (
            <List.Item key={meeting._id}>
              <h3>{meeting.name}</h3>
              <p><strong>Loại:</strong> {meeting.type === "group" ? "Nhóm" : "Riêng tư"}</p>
              <p><strong>Thời gian:</strong> {dayjs(meeting.startTime).format("HH:mm")} - {dayjs(meeting.endTime).format("HH:mm")}</p>
              <p><strong>Mô tả:</strong> {meeting.description || "Không có mô tả"}</p>
              <p>
                <strong>Học sinh tham gia:</strong>{" "}
                {meeting.studentIds.map((student) => `${student.firstname} ${student.lastname}`).join(", ")}
              </p>

              {/* Chỉ tutor chủ cuộc họp mới có thể bắt đầu */}
              {role === "tutor" && (
                <Button type="primary" onClick={() => handleStartMeeting(meeting)}>
                  Start Meeting
                </Button>
              )}
            </List.Item>
          )}
        />
      </Modal>

      {/* Modal tạo cuộc họp */}
      <Modal
        title="Tạo Cuộc Họp Mới"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        onOk={handleCreateMeeting}
      >
        <Input placeholder="Tên cuộc họp" value={meetingName} onChange={(e) => setMeetingName(e.target.value)} />
        <DatePicker onChange={(date) => setDayOfWeek(dayjs(date))} format="YYYY-MM-DD" style={{ width: "100%" }} />
        <TimePicker onChange={setStartTime} format="HH:mm" style={{ width: "100%" }} placeholder="Bắt đầu" />
        <TimePicker onChange={setEndTime} format="HH:mm" style={{ width: "100%" }} placeholder="Kết thúc" />
        <Select value={meetingType} onChange={setMeetingType} style={{ width: "100%" }}>
          <Option value="group">Nhóm</Option>
          <Option value="private">Riêng tư</Option>
        </Select>
        <Input.TextArea placeholder="Mô tả" value={meetingDescription} onChange={(e) => setMeetingDescription(e.target.value)} />
        <Select mode="multiple" placeholder="Chọn học sinh" value={selectedStudents} onChange={setSelectedStudents} style={{ width: "100%" }}>
          {students.map((student) => (
            <Option key={student.id} value={student.id}>{student.name}</Option>
          ))}
        </Select>
      </Modal>
    </Content>
  );
}
