import { useState, useEffect } from "react";
import { Layout, Calendar, Badge, Card, Modal, List, Button, Form, Input, Select, DatePicker, TimePicker, message, Popconfirm } from "antd";
import dayjs from "dayjs";
import { fetchAllMeetings, fetchTutors, fetchStudentsByTutor, createMeeting, editMeeting, deleteMeeting } from "../../../api_service/meeting_service";

const { Content } = Layout;
const { Option } = Select;

export default function AdminCalendarPage() {
  const [meetings, setMeetings] = useState([]);
  const [selectedDateMeetings, setSelectedDateMeetings] = useState([]);
  const [isMeetingListVisible, setIsMeetingListVisible] = useState(false);
  const [isCreateMeetingVisible, setIsCreateMeetingVisible] = useState(false);
  const [isEditMeetingVisible, setIsEditMeetingVisible] = useState(false);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [students, setStudents] = useState([]);
  const [form] = Form.useForm();

  useEffect(() => {
    loadAllMeetings();
    loadTutors();
  }, []);

  const loadAllMeetings = async () => {
    const data = await fetchAllMeetings();
    setMeetings(data);
  };

  const loadTutors = async () => {
    const tutorList = await fetchTutors();
    setTutors(tutorList);
  };

  const handleTutorChange = async (tutorId) => {
    const studentsData = await fetchStudentsByTutor(tutorId);
    setStudents(studentsData);
  };

  const handleCreateMeeting = async (values) => {
    const { name, type, description, tutorId, dayOfWeek, startTime, endTime } = values;

    const formattedData = {
      name,
      type,
      description,
      tutorId,
      dayOfWeek: dayOfWeek.format("YYYY-MM-DD"), // Ensure the date is in the correct format
      startTime: `${dayOfWeek.format("YYYY-MM-DD")}T${startTime.format("HH:mm")}:00`, // Combine date and time
      endTime: `${dayOfWeek.format("YYYY-MM-DD")}T${endTime.format("HH:mm")}:00`, // Combine date and time
    };

    const response = await createMeeting(formattedData);
    if (response.error) {
        message.error(response.error);
    } else {
        message.success("Cuộc họp đã được tạo thành công!");
        form.resetFields();
        setIsCreateMeetingVisible(false);
        loadAllMeetings();
    }
};

  
  const handleEditMeeting = async (values) => {
    const { name, type, description, tutorId, dayOfWeek, startTime, endTime } = values;

  
    const updatedMeeting = {
      name,
      type,
      description,
      tutorId,
      dayOfWeek: dayOfWeek.format("YYYY-MM-DD"), // Ensure the date is in the correct format
      startTime: `${dayOfWeek.format("YYYY-MM-DD")}T${startTime.format("HH:mm")}:00`, // Combine date and time
      endTime: `${dayOfWeek.format("YYYY-MM-DD")}T${endTime.format("HH:mm")}:00`, // Combine date and time
    };
  
    const response = await editMeeting(editingMeeting._id, updatedMeeting);
    if (response.error) {
      message.error(response.error);
    } else {
      message.success("Cập nhật cuộc họp thành công!");
      setIsEditMeetingVisible(false);
      loadAllMeetings();
    }
  };
  

  const handleDeleteMeeting = async (meetingId) => {
    const response = await deleteMeeting(meetingId);
    if (response.error) {
      message.error(response.error);
    } else {
      message.success("Xóa cuộc họp thành công!");
      
      // Cập nhật danh sách cuộc họp sau khi xóa
      const updatedMeetings = selectedDateMeetings.filter(meeting => meeting._id !== meetingId);
      setSelectedDateMeetings(updatedMeetings);
  
      // Nếu không còn cuộc họp nào, đóng modal
      if (updatedMeetings.length === 0) {
        setIsMeetingListVisible(false);
      }
  
      // Tải lại toàn bộ lịch
      loadAllMeetings();
    }
  };

  const openEditModal = (meeting) => {
    setEditingMeeting(meeting);
    form.setFieldsValue({
      name: meeting.name,
      type: meeting.type,
      description: meeting.description,
      tutorId: meeting.tutorId,
      dayOfWeek: dayjs(meeting.dayOfWeek),
      startTime: dayjs(meeting.startTime),
      endTime: dayjs(meeting.endTime),
    });
    setIsEditMeetingVisible(true);
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
        <Button type="primary" onClick={() => setIsCreateMeetingVisible(true)} style={{ marginBottom: "1rem" }}>
          Tạo cuộc họp mới
        </Button>
        <Calendar dateCellRender={dateCellRender} />
      </Card>

      {/* Modal danh sách cuộc họp */}
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
            <List.Item key={meeting._id} actions={[
              <Button type="link" onClick={() => openEditModal(meeting)}>Chỉnh sửa</Button>,
              <Popconfirm title="Bạn có chắc chắn muốn xóa?" onConfirm={() => handleDeleteMeeting(meeting._id)} okText="Xóa" cancelText="Hủy">
                <Button type="link" danger>Xóa</Button>
              </Popconfirm>
            ]}>
              <h3>{meeting.name}</h3>
              <p><strong>Loại:</strong> {meeting.type === "group" ? "Nhóm" : "Riêng tư"}</p>
              <p><strong>Thời gian:</strong> {dayjs(meeting.startTime).format("HH:mm")} - {dayjs(meeting.endTime).format("HH:mm")}</p>
              <p><strong>Mô tả:</strong> {meeting.description || "Không có mô tả"}</p>
              
            </List.Item>
          )}
        />
      </Modal>

       {/* Modal tạo cuộc họp */}
       <Modal
        title="Tạo cuộc họp mới"
        open={isCreateMeetingVisible}
        onCancel={() => {
          form.resetFields(); // Reset all form fields to empty values
          setIsCreateMeetingVisible(false); // Close the modal
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreateMeeting} layout="vertical">
          <Form.Item name="name" label="Tên cuộc họp" rules={[{ required: true, message: "Vui lòng nhập tên cuộc họp!" }]}>
            <Input />
          </Form.Item>

          <Form.Item name="type" label="Loại cuộc họp" rules={[{ required: true }]}>
            <Select>
              <Option value="group">Nhóm</Option>
              <Option value="private">Riêng tư</Option>
            </Select>
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item name="tutorId" label="Gia sư" rules={[{ required: true }]}>
            <Select onChange={handleTutorChange}>
              {tutors.map(tutor => (
                <Option key={tutor._id} value={tutor._id}>{tutor.firstname} {tutor.lastname}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item name="dayOfWeek" label="Ngày họp" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>

          <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
  <TimePicker format="HH:mm" />
</Form.Item>

<Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true }]}>
  <TimePicker format="HH:mm" />
</Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Tạo cuộc họp</Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal chỉnh sửa cuộc họp */}
      <Modal
        title="Chỉnh sửa cuộc họp"
        open={isEditMeetingVisible}
        onCancel={() => setIsEditMeetingVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleEditMeeting} layout="vertical">
          <Form.Item name="name" label="Tên cuộc họp" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item name="dayOfWeek" label="Ngày họp" rules={[{ required: true }]}>
            <DatePicker />
          </Form.Item>
          <Form.Item name="startTime" label="Giờ bắt đầu" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item name="endTime" label="Giờ kết thúc" rules={[{ required: true }]}>
            <TimePicker format="HH:mm" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Lưu thay đổi</Button>
          </Form.Item>
        </Form>
      </Modal>
    </Content>
  );
}
