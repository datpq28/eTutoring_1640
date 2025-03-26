import { useState } from "react";
import {
  ClockCircleOutlined,
  CommentOutlined,
  LikeOutlined,
  EllipsisOutlined
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Flex,
  Space,
  Typography,
  Dropdown,
  Menu,
  message,
  Modal,
  Input,
  Button
} from "antd";

import { editBlog, deleteBlog, likeBlog } from "../../../../../../api_service/blog_service";

const { Text } = Typography;

export default function CardBlog({ blog, fetchBlogs }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog.title);
  const [editedContent, setEditedContent] = useState(blog.content);
  const [likes, setLikes] = useState(blog.likes);

  // Chỉnh sửa bài viết
  const handleEdit = async () => {
    try {
      await editBlog(blog._id, { title: editedTitle, content: editedContent });
      message.success("Cập nhật bài viết thành công!");
      setIsEditing(false);
      fetchBlogs(); // Reload danh sách blog
    } catch (error) {
      message.error("Có lỗi xảy ra khi chỉnh sửa bài viết!");
    }
  };

  // Xóa bài viết
  const handleDelete = async () => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa bài viết này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteBlog(blog._id);
          message.success("Xóa bài viết thành công!");
          fetchBlogs(); // Reload danh sách blog
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa bài viết!");
        }
      },
    });
  };

  // Xử lý like bài viết
  const handleLike = async () => {
    try {
      await likeBlog(blog._id);
      setLikes(likes + 1); // Cập nhật số lượt like ngay lập tức
      message.success("Bạn đã thích bài viết!");
    } catch (error) {
      message.error("Có lỗi xảy ra khi like bài viết!");
    }
  };

  return (
    <Card 
    style={{ width: "200rem", margin: "auto" }}
    hoverable cover={<img alt="blog cover" src={blog.imageUrl} />}>
      <Flex justify="space-between" align="center">
        <Card.Meta
          avatar={<Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />}
          title={blog.title}
          description={blog.content}
        />
        <Dropdown overlay={
          <Menu
            items={[
              { key: "edit", label: "Chỉnh sửa", onClick: () => setIsEditing(true) },
              { key: "delete", label: "Xóa", danger: true, onClick: handleDelete }
            ]}
          />
        } trigger={["click"]}>
          <EllipsisOutlined style={{ fontSize: "1.5rem", cursor: "pointer" }} />
        </Dropdown>
      </Flex>

      <Flex justify="space-between" style={{ marginTop: "1.6rem" }}>
        <Space size="small">
          <ClockCircleOutlined />
          <Text>{new Date(blog.createdAt).toLocaleDateString()}</Text>
        </Space>
        <Space size="small">
          <Space size="small" style={{ cursor: "pointer" }} onClick={handleLike}>
            <LikeOutlined style={{ color: "red" }} />
            <Text>{likes}</Text>
          </Space>
          <Space size="small">
            <CommentOutlined />
            <Text>{blog.commentIds.length}</Text>
          </Space>
        </Space>
      </Flex>

      {/* Modal chỉnh sửa */}
      <Modal
        title="Chỉnh sửa bài viết"
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditing(false)}>Hủy</Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>Lưu thay đổi</Button>
        ]}
      >
        <Input value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
        <Input.TextArea value={editedContent} onChange={(e) => setEditedContent(e.target.value)} rows={4} style={{ marginTop: "1rem" }} />
      </Modal>
    </Card>
  );
}
