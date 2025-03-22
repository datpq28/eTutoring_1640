import BlogList from "../../../components/student/DashboardPage/BlogList/BlogList";
import DocumentList from "../../../components/student/DashboardPage/DocumentList/DocumentList";
import RecentMessages from "../../../components/student/DashboardPage/RecentMessages/RecentMessages";
import StudentDashboardOverview from "../../../components/student/DashboardPage/StudentDashboardOverview/StudentDashboardOverview";
import StudySchedule from "../../../components/student/DashboardPage/StudySchedule/StudySchedule";
import styles from "./DashboardPage.module.css";
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
