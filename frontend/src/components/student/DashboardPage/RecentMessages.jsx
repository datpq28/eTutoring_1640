import { Avatar, Button, Card, Flex, Form, Input, List } from "antd";
import { Link } from "react-router";
const messages = [
  {
    id: "1",
    sender: "Thoa ♥",
    content: "Hôm nay học bài gì vậy?",
    time: "10:30 AM",
  },
  {
    id: "2",
    sender: "John",
    content: "Tôi vừa gửi tài liệu toán!",
    time: "10:45 AM",
  },
  {
    id: "3",
    sender: "Anna",
    content: "Buổi học tiếp theo là khi nào?",
    time: "11:00 AM",
  },
];
export default function RecentMessages() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Card title="Recent Messages" extra={<Link>See All</Link>}>
      <Flex vertical gap="middle">
        <List
          itemLayout="horizontal"
          dataSource={messages}
          renderItem={(message) => (
            <List.Item
              onClick={() => console.log(message)}
              style={{ cursor: "pointer" }}
            >
              <Card hoverable style={{ width: "100%" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <Avatar>{message.sender.charAt(0)}</Avatar>
                    <div>
                      <strong>{message.sender}</strong>
                      <p style={{ margin: 0, color: "gray" }}>
                        {message.content}
                      </p>
                    </div>
                  </div>
                  <span style={{ fontSize: "1.2rem", color: "gray" }}>
                    {message.time}
                  </span>
                </div>
              </Card>
            </List.Item>
          )}
        />
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label={null}>
            <Input.TextArea rows={4} placeholder="Enter" />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Send
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
}
