import { Flex, Layout } from "antd";
import DocumentActionsBar from "../../components/student/DocumentsPage/DocumentActionsBar.jsx";
import DocumentList from "../../components/tutor/DocumentsPage/DocumentList.jsx";
const { Content } = Layout;

export default function DocumentsPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="large">
        <DocumentActionsBar />
        <DocumentList />
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
