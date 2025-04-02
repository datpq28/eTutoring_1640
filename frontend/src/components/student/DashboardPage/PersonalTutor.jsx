import { MessageOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Typography } from "antd";

const { Title, Text } = Typography;

export default function PersonalTutor() {
  return (
    <Card
      title={
        <Flex vertical gap="small">
          <Title level={3} style={{ margin: 0, color: "white" }}>
            My Personal Tutor
          </Title>
          <Text style={{ margin: 0, color: "#cdd9fb" }}>
            Your academic guide and mentor
          </Text>
        </Flex>
      }
      classNames={{
        header: "my-card",
      }}
      styles={{
        header: {
          color: "white",
          width: "100%",
          background: "#1677ff",
          paddingTop: "1.6rem",
          paddingBottom: "1.6rem",
        },
      }}
    >
      <Flex vertical gap="large">
        <Flex gap="large">
          <Avatar size={100} />
          <Flex vertical gap="small">
            <Title level={4} style={{ margin: 0 }}>
              Hoang Hai
            </Title>
            <Text style={{ margin: 0 }}>098080808080</Text>
            <Text style={{ margin: 0 }}>sarah.johnson@university.edu</Text>
          </Flex>
        </Flex>
        <Flex justify="space-between">
          <Button
            type="primary"
            color="default"
            variant="outlined"
            icon={<VideoCameraOutlined />}
          >
            Book meeting
          </Button>
          <Button type="primary" icon={<MessageOutlined />}>
            Message
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
