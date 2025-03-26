import React, { useEffect, useState } from "react";
import { List, Button, message } from "antd";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

export default function MeetingPage({ userId }) {
  const [meetings, setMeetings] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const { data } = await axios.get(`http://localhost:5000/api/meeting/user/${userId}/student`);
        setMeetings(data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cuộc họp:", error);
      }
    };
    fetchMeetings();
  
    socket.on("meeting-notification", (notification) => {
      setNotifications((prev) => [notification.message, ...prev]);
      message.info(notification.message);
      setMeetings((prev) => [...prev, { _id: notification.meetingId, name: notification.message }]);
    });
  
    return () => socket.off("meeting-notification");
  }, [userId]);

  const joinMeeting = async (meetingId) => {
    try {
      await axios.post(`http://localhost:5000/api/meeting/join/${meetingId}`, { userId });
      window.location.href = `/meeting/${meetingId}`;
    } catch (error) {
      console.error("Lỗi khi tham gia cuộc họp:", error);
      message.error("Không thể tham gia cuộc họp.");
    }
  };

  return (
    <div>
      <h2>Danh sách cuộc họp</h2>
      <List
        bordered
        dataSource={meetings}
        renderItem={(meeting) => (
          <List.Item>
            {meeting.name}
            <Button type="primary" onClick={() => joinMeeting(meeting._id)}>Tham gia</Button>
          </List.Item>
        )}
      />
      <h3>Thông báo mới:</h3>
      <List bordered dataSource={notifications} renderItem={(notif) => <List.Item>{notif}</List.Item>} />
    </div>
  );
}
