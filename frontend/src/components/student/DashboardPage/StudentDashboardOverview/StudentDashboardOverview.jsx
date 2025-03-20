import { Card, Col, Row } from "antd";

export default function StudentDashboardOverview() {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={24} md={12} lg={12}>
        <Card title="Buổi học sắp tới" variant="borderless">
          Nội dung buổi học
        </Card>
      </Col>

      <Col xs={24} sm={24} md={12} lg={12}>
        <Card title="Tài liệu mới" variant="borderless">
          Nội dung tài liệu
        </Card>
      </Col>

      <Col xs={24} sm={24} md={12} lg={12}>
        <Card title="Tin nhắn chưa đọc" variant="borderless">
          Nội dung tin nhắn
        </Card>
      </Col>

      <Col xs={24} sm={24} md={12} lg={12}>
        <Card title="Tiến độ học tập" variant="borderless">
          Nội dung tiến độ
        </Card>
      </Col>
    </Row>
  );
}
