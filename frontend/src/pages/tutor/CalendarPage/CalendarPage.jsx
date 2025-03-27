import { useEffect, useState } from "react";
import { Card, Layout, Calendar, Modal, Input, Select, Button, message, Badge, TimePicker } from "antd";
import moment from "moment";
import { fetchMeetings, fetchStudentsOfTutor, createMeeting } from "../../../../api_service/meeting_service";

const { Content } = Layout;
const { Option } = Select;

export default function CalendarPage() {
  const [user, setUser] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [meetings, setMeetings] = useState([]);
  const [studentIds, setStudentIds] = useState([]);
  const [meetingInfo, setMeetingInfo] = useState({
    name: "",
    description: "",
    type: "group",
    startTime: null,
    endTime: null,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser.role === "tutor") {
        setUser(parsedUser);
      } else {
        message.warning("Bạn không có quyền truy cập trang này!");
      }
    } else {
      message.error("Không tìm thấy thông tin người dùng!");
    }
  }, []);

  useEffect(() => {
    const loadMeetings = async () => {
      try {
        const data = await fetchMeetings();
        console.log("Meetings", data);
        setMeetings(data);
      } catch (error) {
        message.error("Không thể lấy danh sách cuộc họp!");
      }
    };
    loadMeetings();
  }, []);

  // Khi tutor click vào ngày, mở modal và đặt ngày được chọn
  const handleDateClick = async (date) => {
    if (user?.role !== "tutor") {
      message.warning("Bạn không có quyền tạo cuộc họp!");
      return;
    }

    setSelectedDate(date.format("YYYY-MM-DD"));
    setIsModalVisible(true);

    try {
      const students = await fetchStudentsOfTutor(user.userId);
      setStudentIds(students);
      console.log("Students", students);
    } catch (error) {
      message.error("Không thể lấy danh sách học sinh!");
    }
  };

  // Xử lý tạo cuộc họp
  const handleCreateMeeting = async () => {
    try {
      if (!meetingInfo.startTime || !meetingInfo.endTime) {
        message.error("Vui lòng chọn giờ bắt đầu và kết thúc!");
        return;
      }

      const startTime = moment(`${selectedDate} ${meetingInfo.startTime}`).toISOString();
      const endTime = moment(`${selectedDate} ${meetingInfo.endTime}`).toISOString();

      const meetingData = {
        tutorId: user.userId,
        name: meetingInfo.name,
        description: meetingInfo.description,
        type: meetingInfo.type,
        startTime,
        endTime,
        studentIds,
      };

      await createMeeting(meetingData);
      message.success("Cuộc họp đã được tạo!");
      setIsModalVisible(false);

      const updatedMeetings = await fetchMeetings();
      setMeetings(updatedMeetings);
    } catch (error) {
      message.error("Không thể tạo cuộc họp!");
    }
  };

  // Hiển thị cuộc họp trên lịch
  const cellRender = (current) => {
    if (!meetings || !Array.isArray(meetings)) return null;
  
    const dateString = current.format("YYYY-MM-DD");
  
    const dailyMeetings = meetings.filter((meeting) => {
      const meetingDate = moment(meeting.startTime).format("YYYY-MM-DD");
      return meetingDate === dateString;
    });
  
    if (dailyMeetings.length === 0) return null;
  
    return (
      <ul style={{ padding: 0, listStyle: "none" }}>
        {dailyMeetings.map((meeting) => (
          <li key={meeting._id}>
            <Badge
              status="success"
              text={`${meeting.name} (${moment(meeting.startTime).format("HH:mm")})`}
            />
          </li>
        ))}
      </ul>
    );
  };
  

  return (
    <Content style={{ padding: "2rem" }}>
      <Card>
        <Calendar onSelect={handleDateClick} cellRender={cellRender} />
      </Card>

      {/* Modal tạo cuộc họp */}
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
          style={{ width: "100%", marginBottom: 10 }}
        >
          <Option value="group">Nhóm</Option>
          <Option value="private">Riêng tư</Option>
        </Select>

        {/* Chọn giờ bắt đầu và kết thúc */}
        <TimePicker
          use12Hours
          format="h:mm A"
          placeholder="Chọn giờ bắt đầu"
          onChange={(time, timeString) => setMeetingInfo({ ...meetingInfo, startTime: timeString })}
          style={{ width: "100%", marginBottom: 10 }}
        />
        <TimePicker
          use12Hours
          format="h:mm A"
          placeholder="Chọn giờ kết thúc"
          onChange={(time, timeString) => setMeetingInfo({ ...meetingInfo, endTime: timeString })}
          style={{ width: "100%" }}
        />
      </Modal>
    </Content>
  );
}
