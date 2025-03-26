import React, { useEffect, useState } from "react";
import { Layout, Button, List, message } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Content } = Layout;

export default function MeetingPage({ tutorId }) {
  const [meetingHistory, setMeetingHistory] = useState([]);
  const [loading, setLoading] = useState(false); // Trạng thái chờ khi tạo phòng
  const navigate = useNavigate();

  // Fetch meeting history khi load trang
  const fetchMeetingHistory = async () => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/meeting/user/${tutorId}/tutor`);
      setMeetingHistory(data);
    } catch (error) {
      console.error("Lỗi khi lấy lịch sử cuộc họp:", error);
      message.error("Không thể tải lịch sử cuộc họp");
    }
  };

  useEffect(() => {
    fetchMeetingHistory();
  }, []);

  // Tạo cuộc họp mới & Redirect ngay sau khi tạo
  const createRoom = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post("http://localhost:5000/api/meeting/create", {
        name: `Meeting by Tutor ${tutorId}`,
        description: "Tạo tự động bởi tutor",
        tutorId,
        startTime: new Date(),
        endTime: null,
      });

      navigate(`/room/${data._id}`); // 🚀 Redirect ngay sau khi tạo thành công
    } catch (error) {
      console.error("Lỗi khi tạo cuộc họp:", error);
      message.error("Không thể tạo cuộc họp");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Quản lý cuộc họp</h2>
      <Button 
        onClick={createRoom} 
        type="primary" 
        loading={loading} // Hiển thị hiệu ứng loading khi đang tạo phòng
        style={{ marginBottom: "20px" }}
      >
        Tạo Phòng Mới
      </Button>

      <h3>Lịch sử cuộc họp</h3>
      <List
        bordered
        dataSource={meetingHistory}
        renderItem={(meeting) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => navigate(`/room/${meeting._id}`)}>Tham gia</Button>
            ]}
          >
            <strong>{meeting.name}</strong> - {new Date(meeting.startTime).toLocaleString()}
          </List.Item>
        )}
      />
    </Content>
  );
}
