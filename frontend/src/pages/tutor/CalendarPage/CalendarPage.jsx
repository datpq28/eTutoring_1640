import { useEffect, useState } from "react";
import { Card, Layout, Calendar, Modal, Input, Select, Button, message, Badge } from "antd";
import moment from "moment/moment";
import { fetchMeetings, fetchStudentsOfTutor, createMeeting } from "../../../../api_service/meeting_service"; // Import API

const { Content } = Layout;
const { Option } = Select;

export default function CalendarPage() {
  const [user, setUser] = useState(null); // Lưu thông tin người dùng
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState({
    name: "",
    description: "",
    type: "group",
  });

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log("User info:", parsedUser);
      // Kiểm tra nếu là Tutor thì lưu user vào state
      if (parsedUser.role === "tutor") {
        setUser(parsedUser);
      } else {
        message.warning("Bạn không có quyền truy cập trang này!");
      }
    } else {
      message.error("Không tìm thấy thông tin người dùng!");
    }
  }, []);

  // Fetch danh sách cuộc họp
  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const data = await fetchMeetings();
        setMeetings(data);
      } catch (error) {
        message.error("Không thể lấy danh sách cuộc họp!");
      }
    };
    loadMeetings();
  }, []);

  // Khi tutor click vào ngày, mở popup tạo cuộc họp
  const handleDateClick = (date) => {
    if (user?.role === "tutor") {
      setSelectedDate(date.format("YYYY-MM-DD"));
      setIsModalVisible(true);
    } else {
      message.warning("Bạn không có quyền tạo cuộc họp!");
    }
  };

  // Tạo cuộc họp mới
  const handleCreateMeeting = async () => {
    try {
      if (!user || !user.userId) {
        message.error("Không tìm thấy thông tin Tutor!");
        return;
      }

      const studentIds = await fetchStudentsOfTutor(user.id);

      const meetingData = {
        tutorId: user.id,
        name: meetingInfo.name,
        description: meetingInfo.description,
        type: meetingInfo.type,
        startTime: selectedDate,
        joinedUsers: studentIds,
      };

      await createMeeting(meetingData);
      message.success("Cuộc họp đã được tạo!");
      setIsModalVisible(false);

      // Cập nhật danh sách cuộc họp
      const updatedMeetings = await fetchMeetings();
      setMeetings(updatedMeetings);
    } catch (error) {
      message.error("Không thể tạo cuộc họp!");
    }
  };

  // Hiển thị cuộc họp trên lịch
  const dateCellRender = (value) => {
    if (!Array.isArray(meetings)) return null; // Kiểm tra xem meetings có phải là mảng không
  
    const dateString = value.format("YYYY-MM-DD");
    const dailyMeetings = meetings.filter((meeting) =>
      moment(meeting.startTime).format("YYYY-MM-DD") === dateString
    );
  
    return (
      <ul style={{ padding: 0 }}>
        {dailyMeetings.map((meeting) => (
          <li key={meeting._id} style={{ listStyle: "none" }}>
            <Badge status="success" text={meeting.name} />
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <Card>
        <Calendar onSelect={handleDateClick} dateCellRender={dateCellRender} />
      </Card>

      {/* Popup tạo cuộc họp */}
      <Modal
        title="Tạo Cuộc Họp"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            Hủy
          </Button>,
          <Button key="create" type="primary" onClick={handleCreateMeeting}>
            Tạo
          </Button>,
        ]}
      >
        <Input
          placeholder="Tên cuộc họp"
          value={meetingInfo.name}
          onChange={(e) => setMeetingInfo({ ...meetingInfo, name: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <Input.TextArea
          placeholder="Mô tả"
          value={meetingInfo.description}
          onChange={(e) => setMeetingInfo({ ...meetingInfo, description: e.target.value })}
          style={{ marginBottom: 10 }}
        />
        <Select
          value={meetingInfo.type}
          onChange={(value) => setMeetingInfo({ ...meetingInfo, type: value })}
          style={{ width: "100%" }}
        >
          <Option value="group">Nhóm</Option>
          <Option value="private">Riêng tư</Option>
        </Select>
      </Modal>
    </Content>
  );
}
