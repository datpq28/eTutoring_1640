import { Flex, Layout } from "antd";
import BlogActionBar from "../../../components/student/BlogPage/BlogActionBar/BlogActionBar";
import BlogList from "../../../components/student/BlogPage/BlogList/BlogList";
const { Content } = Layout;
export default function BlogPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <p>BlogPage</p>
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
