import { Col, Layout, Row } from "antd";
import CardOverview from "../../../components/admin/CardOverview/CardOverview";
import {
  FolderOpenOutlined,
  TeamOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";

const { Content } = Layout;
export default function DashboardPage() {
  return (
    <Content style={stylesInline.content}>
      <Row gutter={[16, 16]} wrap>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<TeamOutlined />}
            titleCard="Students"
            colorChart="#9370db"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<UserOutlined />}
            titleCard="Tutors"
            colorChart="#87cefa"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<VideoCameraOutlined />}
            titleCard="Meetings"
            colorChart="#90ee90"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<FolderOpenOutlined />}
            titleCard="Files"
            colorChart="#ffa07a"
          />
        </Col>
      </Row>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
