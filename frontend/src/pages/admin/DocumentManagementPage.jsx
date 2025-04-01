import { Flex, Layout } from "antd";
import DocumentActionsBar from "../../components/DocumentsPage/DocumentActionsBar.jsx";
import DocumentList from "../../components/DocumentsPage/DocumentList.jsx";
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
