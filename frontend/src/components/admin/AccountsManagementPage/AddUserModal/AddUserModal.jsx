import { Button, Flex, Input, Modal, Select, Space, Form } from "antd";

export default function AddUserModal({ isModalOpen, hideModal }) {
  const handleOk = () => {
    hideModal();
  };
  const handleCancel = () => {
    hideModal();
  };
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Modal
      title="Add New User"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      centered
      footer={null}
    >
      <Form
        layout="vertical"
        name="basic"
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Username"
          name="username"
          rules={[
            {
              required: true,
              message: "Please input username!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: "Please input password!",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item label="Role" name="role">
          <Select
            defaultValue="student"
            onChange={handleChange}
            options={[
              {
                value: "student",
                label: "Student",
              },
              {
                value: "tutor",
                label: "Tutor",
              },
              {
                value: "admin",
                label: "Admin",
              },
            ]}
          />
        </Form.Item>

        <Form.Item label={null}>
          <Flex justify="end">
            <Space size="small">
              <Button onClick={handleCancel}>Cancel</Button>
              <Button type="primary" htmlType="submit" onClick={onFinish}>
                Create
              </Button>
            </Space>
          </Flex>
        </Form.Item>
      </Form>
    </Modal>
  );
}
