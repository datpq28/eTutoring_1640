import {
  Avatar,
  Button,
  Card,
  Col,
  Flex,
  Form,
  Input,
  Layout,
  Row,
  Select,
  Typography,
} from "antd";
import { CloseOutlined, EditOutlined } from "@ant-design/icons";
import { useState } from "react";
const { Content } = Layout;

const userId = localStorage.getItem("userId");
const role = localStorage.getItem("role");
const roleSelect = [
  { value: "student", label: "Student" },
  { value: "tutor", label: "Tutor" },
];
export default function ProfilePage() {
  const [isEditForm, setIsEditForm] = useState(true);

  const handleEnableEditForm = () => {
    setIsEditForm(true);
  };

  const handleDisableEditForm = () => {
    setIsEditForm(false);
  };

  return (
    <Content style={stylesInline.content}>
      <Flex gap="middle">
        <Card style={{ width: "35rem" }}>
          <Flex vertical gap="middle" align="center">
            <Typography.Title level={4}>Account Management</Typography.Title>
            <Avatar
              size={200}
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${userId}`}
              style={{ border: "1px solid #ccc" }}
              shape="square"
            />
            <Form layout="vertical" style={{ width: "100%" }}>
              <Form.Item label="Old Password" name="old_password">
                <Input.Password placeholder="Old Password" />
              </Form.Item>
              <Form.Item label="New Password" name="new_password">
                <Input.Password placeholder="New Password" />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
              >
                Change Password
              </Button>
            </Form>
          </Flex>
        </Card>
        <Card style={{ flex: 1 }}>
          <Flex vertical gap="middle">
            <Flex justify="space-between">
              <Typography.Title level={4}>Profile Information</Typography.Title>
              {isEditForm ? (
                <Flex wrap gap="small" align="center">
                  <Button
                    color="danger"
                    variant="outlined"
                    icon={<CloseOutlined />}
                    onClick={handleDisableEditForm}
                  >
                    Cancel
                  </Button>
                  <Button type="primary" icon={<EditOutlined />}>
                    Submit
                  </Button>
                </Flex>
              ) : (
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={handleEnableEditForm}
                >
                  Edit
                </Button>
              )}
            </Flex>
            <Form>
              <Row gutter={[16, 24]}>
                <Col span={12}>
                  <Form.Item
                    layout="vertical"
                    label="First name"
                    name="firtname"
                  >
                    <Input disabled={!isEditForm} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    layout="vertical"
                    label="Last name"
                    name="lastname"
                  >
                    <Input disabled={!isEditForm} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item layout="vertical" label="Email" name="email">
                    <Input disabled={!isEditForm} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item layout="vertical" label="Phone" name="phone">
                    <Input disabled={!isEditForm} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item layout="vertical" label="Role" name="role">
                    <Select options={roleSelect} disabled={!isEditForm} />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Flex>
        </Card>
      </Flex>
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
