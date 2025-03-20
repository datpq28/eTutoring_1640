import { Flex, Layout } from "antd";
import DocumentActionsBar from "../../../components/student/DocumentsPage/DocumentActionsBar/DocumentActionsBar";
import DocumentList from "../../../components/student/DocumentsPage/DocumentList/DocumentList";
const { Content } = Layout;

export default function DocumentsPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="large">
        <p>DocumentsPage</p>
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
