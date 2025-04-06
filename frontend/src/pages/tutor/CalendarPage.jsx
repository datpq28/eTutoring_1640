import { useState, useEffect } from "react";
import { Layout, Calendar, Badge, Card, Modal, List, notification, Dropdown, Menu } from "antd";
import { BellOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { fetchMeetingsByTutor } from "../../../api_service/meeting_service";
import { getNotificationsByTutor,markNotificationAsRead  } from "../../../api_service/notification_service";
import { useNavigate } from "react-router";
import { io } from "socket.io-client";

const socket = io("http://localhost:5090");
const { Content } = Layout;

export default function CalendarPage() {
  const [isMeetingListVisible, setIsMeetingListVisible] = useState(false);
  const [meetings, setMeetings] = useState([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]);
  const [role, setRole] = useState(null);
  const [tutorId, setTutorId] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const storedTutorId = localStorage.getItem("userId");

    if (storedRole === "tutor" && storedTutorId) {
      setRole("tutor");
      setTutorId(storedTutorId);
      loadMeetings(storedTutorId);
      loadNotifications(storedTutorId); // Gọi API lấy thông báo khi tutor đăng nhập
    }
  }, []);

  const loadMeetings = async (tutorId) => {
    const data = await fetchMeetingsByTutor(tutorId);
    setMeetings(data.filter(meeting => meeting.tutorId._id === tutorId));
  };

  const loadNotifications = async (tutorId) => {
    const { notifications, unreadCount } = await getNotificationsByTutor(tutorId);
    setNotifications(notifications);
    setUnreadCount(unreadCount);
};

  useEffect(() => {
    socket.on("new-meeting", (data) => {
      if (data.type === "tutor" && data.tutorId === tutorId) {
        setNotifications((prev) => [...prev, data]);
        setUnreadCount((prev) => prev + 1);

        notification.info({
          message: "Cuộc họp mới được tạo",
          description: data.message,
          onClick: () => navigate(`/tutor/meeting/${data.meetingId}`),
        });
      }
    });

    return () => {
      socket.off("new-meeting");
    };
  }, [tutorId]);

  useEffect(() => {
    if (!tutorId) return;
  
    // Đăng ký socket
    socket.emit('register_user', { tutorId, role });
  
    // Lắng nghe thông báo meeting được tạo bởi admin
    socket.on('meeting-created-by-admin', (data) => {
      // Cập nhật state meetings
      setMeetings(prev => [...prev, data.meeting]);
      
      // Hiển thị thông báo
      notification.info({
        message: 'Cuộc họp mới từ Admin',
        description: `Cuộc họp "${data.meeting.name}" đã được tạo bởi Admin`,
        onClick: () => navigate(`/meeting/${data.meeting._id}`),
      });
    });
  
    return () => {
      socket.off('meeting-created-by-admin');
    };
  }, [tutorId, role]);

  const handleStartMeeting = (meeting) => {
    if (!meeting || !meeting._id) {
      console.error("Meeting ID is undefined!", meeting);
      return;
    }
    socket.emit("start_call", { meetingId: meeting._id, tutorId: meeting.tutorId });
    navigate(`/tutor/meeting/${meeting._id}`);
  };

  const handleNotificationClick = async (notif) => {
    if (notif.isRead) return; // Nếu đã đọc, thoát luôn

    // Giảm số lượng thông báo chưa đọc ngay lập tức
    setUnreadCount((prev) => Math.max(prev - 1, 0));

    // Cập nhật trạng thái của thông báo ngay lập tức
    setNotifications((prev) =>
        prev.map((n) => (n._id === notif._id ? { ...n, isRead: true } : n))
    );

    try {
        await markNotificationAsRead(notif._id);
    } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái thông báo:", error);
    }
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

  const notificationMenu = (
    <Menu style={{ width: 320, maxHeight: 400, overflowY: "auto", borderRadius: 8, boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)" }}>
        <Menu.Item style={{ fontWeight: "bold", textAlign: "center", background: "#f0f2f5" }}>
            Thông báo
        </Menu.Item>
        {Array.isArray(notifications) && notifications.length > 0 ?  (
            notifications.map((notif) => (
                <Menu.Item 
                    key={notif._id} 
                    onClick={() => !notif.isRead && handleNotificationClick(notif)} // Chỉ click nếu chưa đọc
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        backgroundColor: notif.isRead ? "#f0f2f5" : "#ffffff", 
                        fontWeight: notif.isRead ? "normal" : "bold",
                        padding: "10px",
                        borderBottom: "1px solid #e0e0e0",
                        cursor: notif.isRead ? "default" : "pointer" // Vô hiệu hóa pointer nếu đã đọc
                    }}
                >
                    <div style={{ flex: 1 }}>
                        <p style={{ margin: 0 }}>{notif.text}</p>
                        <small style={{ color: "#888" }}>{dayjs(notif.time).fromNow()}</small>
                    </div>
                </Menu.Item>
            ))
        ) : (
            <Menu.Item style={{ textAlign: "center", padding: "12px", color: "#888" }}>
                Không có thông báo
            </Menu.Item>
        )}
    </Menu>
);



  return (
    <Content style={{ padding: "2rem" }}>
      <Layout.Header style={{ display: "flex", justifyContent: "flex-end", padding: "0 20px", background: "#fff" }}>
      <Dropdown overlay={notificationMenu} trigger={["click"]}>
        <Badge count={unreadCount} style={{ backgroundColor: "#f5222d" }}>
            <BellOutlined style={{ fontSize: "24px", cursor: "pointer" }} />
        </Badge>
    </Dropdown>
      </Layout.Header>

      <Card>
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      <Modal
        title="Danh sách cuộc họp"
        open={isMeetingListVisible}
        onCancel={() => setIsMeetingListVisible(false)}
        footer={null}
      >
        <List
  itemLayout="vertical"
  dataSource={selectedDateMeetings}
  renderItem={(meeting) => {
    const today = dayjs().startOf("day"); // Get today's date at midnight
    const tomorrow = today.add(1, "day");
    const meetingDate = dayjs(meeting.dayOfWeek).startOf("day"); // Get the meeting's date at midnight

    return (
      <List.Item key={meeting._id}>
        <h3>{meeting.name}</h3>
        <p><strong>Loại:</strong> {meeting.type === "group" ? "Nhóm" : "Riêng tư"}</p>
        <p><strong>Thời gian:</strong> {dayjs(meeting.startTime).format("HH:mm")} - {dayjs(meeting.endTime).format("HH:mm")}</p>
        <p><strong>Mô tả:</strong> {meeting.description || "Không có mô tả"}</p>
        <p>
          <strong>Học sinh tham gia:</strong>{" "}
          {Array.isArray(meeting.studentIds)
            ? meeting.studentIds.map((student) => `${student.firstname} ${student.lastname}`).join(", ")
            : "Không có dữ liệu"}
        </p>

        {/* Conditionally render buttons based on the meeting date */}
        {meetingDate.isBefore(tomorrow) && (
          <button className="attended-btn"
          style={{ backgroundColor: "gray", color: "white", border: "none", padding: "8px 16px", cursor: "not-allowed" }}
          disabled >
            Attended
          </button>
        )}
        {meetingDate.isSame(tomorrow) && role === "tutor" && (
          <button className="start-meeting-btn"
          style={{ backgroundColor: "green", color: "white", border: "none", padding: "8px 16px", cursor: "pointer" }}
          onClick={() => handleStartMeeting(meeting)}>
            Start Meeting
          </button>
        )}
        {meetingDate.isAfter(tomorrow) && (
          <button className="is-coming-btn" 
          style={{ backgroundColor: "blue", color: "white", border: "none", padding: "8px 16px", cursor: "not-allowed" }}
          disabled>
            Is Coming
          </button>
        )}
      </List.Item>
    );
  }}
/>
      </Modal>
    </Content>
  );
}
