import { Button, Card } from "antd";
import { Link } from "react-router";

import { Space, Table, Tag } from "antd";
const columns = [
  {
    title: "Date",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "Time",
    dataIndex: "time",
    key: "time",
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
  },
  {
    title: "Tutor",
    dataIndex: "tutor",
    key: "tutor",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
    render: (status) => {
      let color = "";
      if (status === "Chưa lên lịch") {
        color = "volcano";
      }
      if (status === "Đã lên lịch") {
        color = "green";
      }
      if (status === "Đã hoàn thành") {
        color = "geekblue";
      }
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },
  {
    title: "Action",
    key: "action",
    dataIndex: "action",
    render: (_, record) => {
      let buttonText = "Join";
      let buttonType = "primary";
      let disabled = false;

      if (record.status === "Chưa lên lịch") {
        buttonText = "Schedule";
        buttonType = "default";
        disabled = false;
      } else if (record.status === "Đã lên lịch") {
        buttonText = "Join";
        buttonType = "primary";
        disabled = false;
      } else if (record.status === "Đã hoàn thành") {
        buttonText = "Ended";
        buttonType = "default";
        disabled = true;
      }

      return (
        <Button type={buttonType} disabled={disabled}>
          {buttonText}
        </Button>
      );
    },
  },
];
const data = [
  {
    key: "1",
    date: "20/03/2025",
    time: "15:00 - 16:30",
    subject: "Math",
    tutor: "Thoa ♥",
    status: "Đã hoàn thành",
    action: "Join",
  },
  {
    key: "2",
    date: "20/03/2025",
    time: "15:00 - 16:30",
    subject: "Math",
    tutor: "Thoa ♥",
    status: "Chưa lên lịch",
    action: "Join",
  },
  {
    key: "3",
    date: "20/03/2025",
    time: "15:00 - 16:30",
    subject: "Math",
    tutor: "Thoa ♥",
    status: "Đã lên lịch",
    action: "Ended",
  },
  {
    key: "4",
    date: "20/03/2025",
    time: "15:00 - 16:30",
    subject: "Math",
    tutor: "Thoa ♥",
    status: "Đã lên lịch",
    action: "Ended",
  },
  {
    key: "5",
    date: "20/03/2025",
    time: "15:00 - 16:30",
    subject: "Math",
    tutor: "Thoa ♥",
    status: "Đã lên lịch",
    action: "Ended",
  },
];

export default function StudySchedule() {
  return (
    <Card title="Lịch học sắp tới" extra={<Link>See All</Link>}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </Card>
  );
}
