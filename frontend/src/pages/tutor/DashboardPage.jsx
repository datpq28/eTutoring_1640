import BlogList from "../../components/student/DashboardPage/BlogList.jsx";
import DocumentList from "../../components/student/DashboardPage/DocumentList.jsx";
import RecentMessages from "../../components/student/DashboardPage/RecentMessages.jsx";
import StudentDashboardOverview from "../../components/student/DashboardPage/StudentDashboardOverview.jsx";
import StudySchedule from "../../components/student/DashboardPage/StudySchedule.jsx";
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
