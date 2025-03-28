import { useEffect, useState } from "react";
import { Layout, Table, Button, notification, Tag } from "antd";
import { fetchAllMeetings, updateMeetingStatus } from "../../../api_service/admin_service";
import dayjs from "dayjs";

const { Content } = Layout;

export default function MeetingManagementPage() {
  const [meetings, setMeetings] = useState([]);

  useEffect(() => {
    loadMeetings();
  }, []);

  const loadMeetings = async () => {
    try {
      const data = await fetchAllMeetings();
      setMeetings(data);
    } catch (error) {
      notification.error({ message: "Không thể tải danh sách cuộc họp" });
    }
  };

  const handleUpdateMeeting = async (meetingId, status) => {
    console.log("meetingId", meetingId);
    console.log("status", status);
    try {
      await updateMeetingStatus(meetingId, status);
      notification.success({ message: `Cuộc họp đã được ${status === "approved" ? "duyệt" : "từ chối"}` });
      loadMeetings();
    } catch (error) {
      notification.error({ message: "Không thể cập nhật trạng thái cuộc họp" });
    }
  };

  const columns = [
    { title: "Tên", dataIndex: "name" },
    {
      title: "Giáo viên",
      dataIndex: "tutorId",
      render: (tutor) => tutor ? `${tutor.firstname} ${tutor.lastname}` : "Không xác định",
    },
    {
      title: "Thời gian",
      render: (_, record) =>
        `${dayjs(record.startTime).format("HH:mm")} - ${dayjs(record.endTime).format("HH:mm")} (${dayjs(record.startTime).format("DD/MM/YYYY")})`,
    },
    { title: "Mô tả", dataIndex: "description", render: (text) => text || "Không có mô tả" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => {
        const color = status === "pending" ? "orange" : status === "approved" ? "green" : "red";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Hành động",
      render: (_, record) =>
        record.status === "pending" && (
          <>
            <Button type="primary" onClick={() => handleUpdateMeeting(record._id, "approved")}>
              Duyệt
            </Button>
            <Button type="danger" onClick={() => handleUpdateMeeting(record._id, "rejected")} style={{ marginLeft: "10px" }}>
              Từ chối
            </Button>
          </>
        ),
    },
  ];

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Quản lý cuộc họp</h2>
      <Table dataSource={meetings} rowKey="_id" columns={columns} />
    </Content>
  );
}
