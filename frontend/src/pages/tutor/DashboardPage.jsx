import { Card, Col, Flex, Layout, Row } from "antd";
const { Content } = Layout;

export default function DashboardPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <p>DashboardPage</p>
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
