import { Card, Flex, Layout } from "antd";
import BlogActionBar from "../../components/student/BlogPage/BlogActionBar.jsx";
import BlogList from "../../components/student/BlogPage/BlogList.jsx";
const { Content } = Layout;
export default function BlogPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <BlogActionBar />
        <Card></Card>
        <BlogList />
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
