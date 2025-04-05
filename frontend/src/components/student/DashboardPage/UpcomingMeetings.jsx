import { CalendarOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Divider, Flex, Space, Typography } from "antd";

const { Title, Text } = Typography;

export default function UpcomingMeetings() {
  return (
    <Card
      title={
        <Flex vertical gap="small">
          <Title level={3} style={{ margin: 0 }}>
            Upcoming Meetings
          </Title>
          <Text level={5} style={{ margin: 0, color: "#7b889c" }}>
            Your scheduled meetings
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
          paddingTop: "1.6rem",
          paddingBottom: "1.6rem",
        },
      }}
      extra={
        <Button color="default" variant="filled" icon={<CalendarOutlined />}>
          View All
        </Button>
      }
    >
      <Flex vertical gap="middle">
        <MeetingItem />
        <MeetingItem />
        <MeetingItem />
      </Flex>
    </Card>
  );
}

function MeetingItem() {
  return (
    <Card>
      <Flex vertical gap="middle">
        <Flex justify="space-between" align="center">
          <Title level={4} style={{ margin: 0 }}>
            Weekly Check-in
          </Title>
          <Avatar size={40} />
        </Flex>
        <Space>
          <Flex gap="small">
            <CalendarOutlined />
            <Text level={5} style={{ margin: 0 }}>
              Tomorrow
            </Text>
          </Flex>
          <Divider type="vertical" />
          <Text level={5} style={{ margin: 0 }}>
            10:10 AM
          </Text>
          <Divider type="vertical" />
          <Text level={5} style={{ margin: 0, color: "#1677ff" }}>
            Virtual
          </Text>
        </Space>
        <Flex gap="middle">
          <Button type="primary">Join Meeting</Button>
          <Button color="default" variant="filled">
            View Details
          </Button>
        </Flex>
      </Flex>
    </Card>
  );
}
