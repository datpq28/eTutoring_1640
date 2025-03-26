import { CloseOutlined, DiffOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Space, notification } from "antd";
import { createBlog } from "../../../../api_service/blog_service";
const userId = localStorage.getItem("userId");
const userRole = localStorage.getItem("role") || "Student";
export default function ModalBlogActions({ isModalOpen, onOK, onCancel }) {
  const [form] = Form.useForm();
  const handleSubmitForm = async () => {
    try {
      const values = await form.validateFields();
      console.log(values);
      const blog = {
        title: values.title,
        content: values.content,
        uploaderId: userId, // Lấy từ localStorage
        uploaderType: userRole, // Lấy từ localStorage
        tags: values.tags
          ? values.tags.split(",").map((tag) => tag.trim())
          : [],
        imageUrl: values.imageUrl,
      };
      await createBlog(blog);
      notification.success({
        message: `Post ${blog.title} Blog successful`,
        duration: 3, // Thời gian tự động đóng (giây)
      });
      onOK();
      form.resetFields();
    } catch (error) {
      console.log("Validation Failed:", error);
    }
  };
  const handleCloseModal = () => {
    form.resetFields();
    onCancel();
  };
  return (
    <Modal
      title={
        <Space size="small">
          <DiffOutlined />
          Post New Blog
        </Space>
      }
      onCancel={onCancel}
      open={isModalOpen}
      footer={[
        <Button key="cancel" onClick={handleCloseModal}>
          <Space size="small">
            <CloseOutlined />
            Cancel
          </Space>
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmitForm}>
          <Space size="small">
            <DiffOutlined />
            Post New Blog
          </Space>
        </Button>,
      ]}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Title Post"
          name="title"
          rules={[{ required: true, message: "Please input your Title Post!" }]}
        >
          <Input placeholder="Title Post" />
        </Form.Item>

        <Form.Item
          label="Content"
          name="content"
          rules={[{ required: true, message: "Please input the content!" }]}
        >
          <Input.TextArea rows={4} placeholder="Content" />
        </Form.Item>

        <Form.Item
          label="Tags (separated by commas)"
          name="tags"
          rules={[
            { required: true, message: "Please input at least one tag!" },
          ]}
        >
          <Input placeholder="Tags (separated by commas)" />
        </Form.Item>

        <Form.Item
          label="Image"
          name="imageUrl"
          rules={[
            {
              required: true,
              message: "Please input the image URL!",
            },
          ]}
        >
          <Input placeholder="URL image" />
        </Form.Item>
      </Form>
    </Modal>
  );
}
