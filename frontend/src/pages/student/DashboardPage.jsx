import StudentDashboardOverview from "../../components/student/DashboardPage/StudentDashboardOverview.jsx";
import StudySchedule from "../../components/student/DashboardPage/StudySchedule.jsx";
import { Flex, Layout } from "antd";
const { Content } = Layout;

export default function DashboardPage() {
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <StudentDashboardOverview />
        <StudySchedule />
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
