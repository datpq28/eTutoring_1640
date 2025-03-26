import React, { useState } from "react";
import { LikeOutlined, MessageOutlined, TagOutlined } from "@ant-design/icons";
import {
  Avatar,
  Space,
  Typography,
  message,
  Modal,
  List,
  Image,
  Tooltip,
} from "antd";

import {
  editBlog,
  deleteBlog,
  likeBlog,
} from "../../../../api_service/blog_service.js";
import { formatCustomDate } from "../../../utils/Date.js";
import dayjs from "dayjs";

const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1550895030-823330fc2551?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

export default function CardBlog({ blog, fetchBlogs }) {
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(blog.title);
  const [editedContent, setEditedContent] = useState(blog.content);
  const [likes, setLikes] = useState(blog.likes);
  const [hasLiked, setHasLiked] = useState(false); // Kiểm soát trạng thái like

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
          console.log(error, "In Card Blog");
        }
      },
    });
  };

  // Xử lý like bài viết
  const handleLike = async () => {
    if (processing) return;
    setLikes((prevLike) => (hasLiked ? prevLike - 1 : prevLike + 1));
    setHasLiked((prev) => !prev);
    setIsProcessing(true);
    try {
      if (!hasLiked) {
        await likeBlog(blog._id, { action: "like" });
        setLikes(likes + 1);
        setHasLiked(true);
        message.success("Bạn đã thích bài viết!");
      } else {
        await likeBlog(blog._id, { action: "unlike" });
        setLikes(likes - 1);
        setHasLiked(false);
        message.success("Bạn đã bỏ thích bài viết!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi thực hiện thao tác!");
    }
  };

  return (
    <>
      <List.Item
        actions={listItemAction}
        extra={
          <Image
            width={272}
            height={150}
            alt="logo"
            src={blog.imageUrl}
            preview={false}
            style={{ objectFit: "cover" }}
            onError={(e) => (e.currentTarget.src = DEFAULT_IMAGE_URL)}
          />
        }
      >
        <List.Item.Meta
          avatar={
            <Avatar
              src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${dayjs(
                blog.createdAt
              ).second()}`}
            />
          }
          title={blog.title}
          description={`Post Date: ${formatCustomDate(blog.createdAt)}`}
        />
        {blog.content}
      </List.Item>
    </>
  );
}

{
  /* <Card
      style={{ width: "200rem", margin: "auto" }}
      hoverable
      //  cover={<img alt="blog cover" src={blog.imageUrl} />}
    >
      <Flex justify="space-between" align="center">
        <Card.Meta
          // avatar={
          //   <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
          // }
          title={blog.title}
          description={blog.content}
        />
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: "edit",
                  label: "Chỉnh sửa",
                  onClick: () => setIsEditing(true),
                },
                {
                  key: "delete",
                  label: "Xóa",
                  danger: true,
                  onClick: handleDelete,
                },
              ]}
            />
          }
          trigger={["click"]}
        >
          <EllipsisOutlined style={{ fontSize: "1.5rem", cursor: "pointer" }} />
        </Dropdown>
      </Flex>

      <Flex justify="space-between" style={{ marginTop: "1.6rem" }}>
        <Space size="small">
          <ClockCircleOutlined />
          <Text>{new Date(blog.createdAt).toLocaleDateString()}</Text>
        </Space>
        <Space size="small">
          <Space 
            size="small" 
            style={{ cursor: "pointer" }} 
            onClick={handleLike}
          >
            <LikeOutlined style={{ color: hasLiked ? "red" : "gray" }} />
            <Text>{likes}</Text>
          </Space>
          <Space size="small">
            <CommentOutlined />
            <Text>{blog.commentIds.length}</Text>
          </Space>
        </Space>
      </Flex>
      <Modal
        // title="Chỉnh sửa bài viết" Modal chỉnh sửa 
        open={isEditing}
        onCancel={() => setIsEditing(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsEditing(false)}>
            Hủy
          </Button>,
          <Button key="submit" type="primary" onClick={handleEdit}>
            Lưu thay đổi
          </Button>,
        ]}
      >
        <Input
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
        />
        <Input.TextArea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          rows={4}
          style={{ marginTop: "1rem" }}
        />
      </Modal>
    </Card> */
}
