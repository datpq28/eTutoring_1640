import {
  ClockCircleOutlined,
  CommentOutlined,
  LikeOutlined,
} from "@ant-design/icons";
import { Avatar, Card, Flex, Space, Typography } from "antd";
const { Text } = Typography;
export default function CardBlog() {
  return (
    <Card
      style={{
        width: "35rem",
      }}
      hoverable
      cover={
        <img
          alt="example"
          src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
        />
      }
    >
      <Card.Meta
        avatar={
          <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
        }
        title="Card title"
        description="This is the description"
      />
      <div style={{ marginTop: "1.6rem" }}></div>
      <Flex justify="space-between">
        <Space size="small">
          <ClockCircleOutlined />
          <Text>18/03/2025</Text>
        </Space>
        <Space size="small">
          <Space size="small">
            <LikeOutlined />
            <Text>111</Text>
          </Space>
          <Space size="small">
            <CommentOutlined />
            <Text>111</Text>
          </Space>
        </Space>
      </Flex>
    </Card>
  );
}
