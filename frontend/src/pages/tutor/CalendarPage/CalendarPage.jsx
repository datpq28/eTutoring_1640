import { useState } from "react";
import {
  Layout,
  Calendar,
  Badge,
  Card,
  Button,
  Select,
  Space,
  Typography,
  Modal,
  List,
  Tag,
  notification,
  Drawer,
  Empty,
} from "antd";

import dayjs from "dayjs";
import {
  BellOutlined,
  ClockCircleOutlined,
  DeleteOutlined,
  CheckOutlined,
} from "@ant-design/icons";
const { Content } = Layout;
const { Option } = Select;

// Task data by date
const taskData = {
  "2025-03-26": [
    {
      type: "success",
      content: "Meeting with team.",
      time: "10:00 AM",
      description: "Weekly team sync to discuss project progress",
      priority: "high",
    },
    {
      type: "warning",
      content: "Project deadline.",
      time: "5:00 PM",
      description: "Final submission for the Q1 project",
      priority: "urgent",
    },
  ],
  "2024-03-15": [
    {
      type: "error",
      content: "Submit report.",
      time: "2:00 PM",
      description: "Submit quarterly performance report",
      priority: "medium",
    },
    {
      type: "success",
      content: "Client call.",
      time: "3:30 PM",
      description: "Review project requirements with the client",
      priority: "high",
    },
  ],
};

// Sample notifications data
const initialNotifications = [
  {
    id: 1,
    title: "Upcoming Meeting",
    description: "Team meeting in 30 minutes",
    time: "10 minutes ago",
    read: false,
    type: "info",
  },
  {
    id: 2,
    title: "Task Due Soon",
    description: "Project presentation due in 2 hours",
    time: "1 hour ago",
    read: false,
    type: "warning",
  },
  {
    id: 3,
    title: "New Comment",
    description: "John commented on your task",
    time: "2 hours ago",
    read: true,
    type: "success",
  },
];

const getListData = (value) => {
  const dateKey = value.format("YYYY-MM-DD");
  return taskData[dateKey] || [];
};

const getMonthData = (value) => {
  if (value.month() === 8) {
    return 1394;
  }
};

const getPriorityColor = (priority) => {
  const colors = {
    low: "blue",
    medium: "orange",
    high: "red",
    urgent: "purple",
  };
  return colors[priority] || "default";
};

export default function CalendarPage() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] =
    useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const onPanelChange = (value, mode) => {
    console.log(value.format("YYYY-MM-DD"), mode);
  };

  const handleDateSelect = (value) => {
    const date = value.format("YYYY-MM-DD");
    const tasks = getListData(value);
    setSelectedDate(date);
    setSelectedTasks(tasks);
    setIsModalVisible(true);
  };

  const handleNotificationClick = () => {
    setIsNotificationDrawerOpen(true);
  };

  const markAsRead = (notificationId) => {
    setNotifications(
      notifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
    notification.success({
      message: "Notification marked as read",
      duration: 2,
    });
  };

  const deleteNotification = (notificationId) => {
    setNotifications(
      notifications.filter((notification) => notification.id !== notificationId)
    );
    notification.success({
      message: "Notification deleted",
      duration: 2,
    });
  };

  const monthCellRender = (value) => {
    const num = getMonthData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
        <span>Backlog number</span>
      </div>
    ) : null;
  };

  const dateCellRender = (value) => {
    const listData = getListData(value);
    return (
      <ul className="events" style={{ listStyle: "none", padding: 0 }}>
        {listData.map((item) => (
          <li key={item.content}>
            <Badge status={item.type} text={item.content} />
          </li>
        ))}
      </ul>
    );
  };

  const cellRender = (current, info) => {
    if (info.type === "date") return dateCellRender(current);
    if (info.type === "month") return monthCellRender(current);
    return info.originNode;
  };

  return (
    <Content style={stylesInline.content}>
      <Card>
        <Calendar
          onPanelChange={onPanelChange}
          cellRender={cellRender}
          onSelect={handleDateSelect}
          headerRender={({ value, onChange }) => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <Button
                type="primary"
                style={{ marginRight: "1rem" }}
                onClick={handleNotificationClick}
                icon={<BellOutlined />}
              >
                <Space size="small" align="center">
                  <Typography.Text style={{ color: "white" }}>
                    Notifications
                    {unreadCount > 0 && (
                      <Badge
                        count={unreadCount}
                        style={{
                          marginLeft: "8px",
                          backgroundColor: "#ff4d4f",
                        }}
                      />
                    )}
                  </Typography.Text>
                </Space>
              </Button>

              <Select
                value={value.year()}
                style={{ width: 100 }}
                onChange={(newYear) => {
                  const now = value.clone().year(newYear);
                  onChange(now);
                }}
              >
                {Array.from({ length: 10 }, (_, i) => (
                  <Option key={i} value={dayjs().year() - 5 + i}>
                    {dayjs().year() - 5 + i}
                  </Option>
                ))}
              </Select>

              <Select
                value={value.month()}
                style={{ width: 120, marginLeft: "1rem" }}
                onChange={(newMonth) => {
                  const now = value.clone().month(newMonth);
                  onChange(now);
                }}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <Option key={i} value={i}>
                    {dayjs().month(i).format("MMMM")}
                  </Option>
                ))}
              </Select>
            </div>
          )}
        />
      </Card>

      <Modal
        title={`Tasks for ${selectedDate}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            Close
          </Button>,
        ]}
        width={600}
      >
        <List
          itemLayout="horizontal"
          dataSource={selectedTasks}
          renderItem={(item) => (
            <List.Item
              extra={
                <Tag color={getPriorityColor(item.priority)}>
                  {item.priority.toUpperCase()}
                </Tag>
              }
            >
              <List.Item.Meta
                avatar={<Badge status={item.type} />}
                title={item.content}
                description={
                  <Space direction="vertical">
                    <Space>
                      <ClockCircleOutlined />
                      {item.time}
                    </Space>
                    <div>{item.description}</div>
                  </Space>
                }
              />
            </List.Item>
          )}
          locale={{ emptyText: "No tasks for this date" }}
        />
      </Modal>

      <Drawer
        title={
          <Space>
            <BellOutlined />
            <span>Notifications</span>
            {unreadCount > 0 && (
              <Badge
                count={unreadCount}
                style={{ backgroundColor: "#ff4d4f" }}
              />
            )}
          </Space>
        }
        placement="right"
        onClose={() => setIsNotificationDrawerOpen(false)}
        open={isNotificationDrawerOpen}
        width={400}
      >
        {notifications.length > 0 ? (
          <List
            itemLayout="horizontal"
            dataSource={notifications}
            renderItem={(item, index) => (
              <List.Item
                actions={[
                  !item.read && (
                    <Button
                      type="text"
                      icon={<CheckOutlined />}
                      onClick={() => markAsRead(item.id)}
                      title="Mark as read"
                    />
                  ),
                  <Button
                    key={index}
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => deleteNotification(item.id)}
                    title="Delete notification"
                  />,
                ]}
                style={{
                  backgroundColor: item.read
                    ? "transparent"
                    : "rgba(24, 144, 255, 0.1)",
                  padding: "12px",
                  borderRadius: "8px",
                  marginBottom: "8px",
                }}
              >
                <List.Item.Meta
                  title={
                    <Space>
                      <Badge status={item.type} />
                      <span>{item.title}</span>
                    </Space>
                  }
                  description={
                    <Space direction="vertical" style={{ width: "100%" }}>
                      <div>{item.description}</div>
                      <div style={{ color: "#8c8c8c", fontSize: "12px" }}>
                        {item.time}
                      </div>
                    </Space>
                  }
                />
              </List.Item>
            )}
          />
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="No notifications"
          />
        )}
      </Drawer>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
