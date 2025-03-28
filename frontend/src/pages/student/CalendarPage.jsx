import { useState, useEffect } from "react";
import { Layout, Calendar, Badge, Card, Modal, List, Button } from "antd";
import dayjs from "dayjs";
import { fetchMeetingsByStudent } from "../../../api_service/meeting_service";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

const socket = io("http://localhost:5090");
const { Content } = Layout;

export default function CalendarPage() {
  const [meetings, setMeetings] = useState([]); // Danh sách cuộc họp của học sinh
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]); // Danh sách cuộc họp cho pop-up
  const [isMeetingListVisible, setIsMeetingListVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const studentId = localStorage.getItem("userId"); // Lấy studentId từ localStorage
    if (studentId) {
      loadMeetings(studentId);
    }

    // Lắng nghe sự kiện tutor bắt đầu cuộc gọi
    socket.on("meeting_started", ({ meetingId }) => {
      setMeetings((prev) =>
        prev.map((m) => (m._id === meetingId ? { ...m, isLive: true } : m))
      );
    });

    return () => {
      socket.off("meeting_started");
    };
  }, []);

  // Lấy danh sách cuộc họp từ API
  const loadMeetings = async (studentId) => {
    const data = await fetchMeetingsByStudent(studentId);
    const approvedMeetings = data.filter((meeting) => meeting.status === "approved");
    setMeetings(approvedMeetings);
  };

  // Khi student ấn "Join Call"
  const handleJoinMeeting = (meetingId) => {
    navigate(`/tutor/meeting/${meetingId}`);
  };

  // Render danh sách cuộc họp trên từng ngày của Calendar
  const dateCellRender = (value) => {
    const formattedDate = value.format("YYYY-MM-DD");
    const meetingsOnThisDay = meetings.filter(
      (meeting) => dayjs(meeting.startTime).format("YYYY-MM-DD") === formattedDate
    );

    return (
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          cursor: meetingsOnThisDay.length > 0 ? "pointer" : "default",
        }}
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
              status={meeting.isLive ? "success" : "processing"}
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
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      {/* Modal danh sách cuộc họp trong ngày */}
      <Modal
        title="Danh sách cuộc họp"
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
              <p>
                <strong>Loại:</strong> {meeting.type === "group" ? "Nhóm" : "Riêng tư"}
              </p>
              <p>
                <strong>Thời gian:</strong>{" "}
                {dayjs(meeting.startTime).format("HH:mm")} -{" "}
                {dayjs(meeting.endTime).format("HH:mm")}
              </p>
              <p>
                <strong>Mô tả:</strong> {meeting.description || "Không có mô tả"}
              </p>
              <p>
                <strong>Giáo viên:</strong> {meeting.tutorId?.firstname}{" "}
                {meeting.tutorId?.lastname}
              </p>

              {/* Nút "Join Call" nếu meeting đang live */}
              {meeting.isLive && (
                <Button type="primary" onClick={() => handleJoinMeeting(meeting._id)}>
                  Join Call
                </Button>
              )}
            </List.Item>
          )}
        />
      </Modal>
    </Content>
  );
}
