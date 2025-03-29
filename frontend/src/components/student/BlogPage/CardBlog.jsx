import React, { useEffect, useState } from "react";
import {
  CloseOutlined,
  EllipsisOutlined,
  ExclamationCircleFilled,
  LikeOutlined,
  MessageOutlined,
  SendOutlined,
  TagOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Space,
  message,
  Modal,
  List,
  Image,
  Tooltip,
  Card,
  Flex,
  Form,
  Input,
  Button,
  Popover,
  Typography,
} from "antd";

import {
  deleteBlog,
  likeBlog,
  unlikeBlog,
} from "../../../../api_service/blog_service.js";
import {
  createComment,
  getComments,
  editComment,
  deleteComment,
} from "../../../../api_service/comment_service.js";
import { formatCustomDate } from "../../../utils/Date.js";
import dayjs from "dayjs";
import ModalBlogActions from "./ModalBlogActions.jsx";
const DEFAULT_IMAGE_URL =
  "https://images.unsplash.com/photo-1550895030-823330fc2551?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

const userId = localStorage.getItem("userId");

export default function CardBlog({ blog, fetchBlogs }) {
  const [likes, setLikes] = useState(blog.likes);
  const [hasLiked, setHasLiked] = useState(false);
  const [processing, setIsProcessing] = useState(false);
  const [isModalCommentVisible, setIsModalCommentVisible] = useState(false);
  const [isModalEditBlogVisible, setIsModalEditBlogVisible] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [form] = Form.useForm();
  const { TextArea } = Input;
  
  console.log(blog);
  
  useEffect(() => {
    if (blog.likedBy.some((item) => item === userId)) {
      setHasLiked(true);
    }
  }, [blog]);

  // Fetch comments when comment modal is opened
  useEffect(() => {
    if (isModalCommentVisible) {
      fetchComments();
    }
  }, [isModalCommentVisible]);

  // Fetch comments function
  const fetchComments = async () => {
    try {
      const commentsData = await getComments(blog._id);
      setComments(commentsData);
    } catch (error) {
      message.error("Failed to load comments");
      console.error("Error fetching comments:", error);
    }
  };

  const handleOpenModalEditBlog = () => {
    setIsModalEditBlogVisible(true);
  };

  const handleCloseModalEditBlog = () => {
    setIsModalEditBlogVisible(false);
  };

  const handleUpdatedBlog = () => {
    setIsModalEditBlogVisible(false);
    fetchBlogs();
  };

  const toggleOpenModalComment = () => {
    setIsModalCommentVisible((prev) => !prev);
  };

  // Xóa bài viết
  const handleDelete = async () => {
    Modal.confirm({
      title: `Are you sure delete blog ${blog.title}?`,
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteBlog(blog._id);
          message.success(`Deleted ${blog.title} successfully`);
          fetchBlogs(); // Reload danh sách blog
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa bài viết!");
          console.log(error, "In Card Blog");
        }
      },
    });
  };

  // Xử lý like/unlike bài viết
  const handleLike = async () => {
    if (processing) return;
    setLikes((prevLike) => (hasLiked ? prevLike - 1 : prevLike + 1));
    setHasLiked((prev) => !prev);
    setIsProcessing(true);
    try {
      if (!hasLiked) {
        //Chỗ gọi API
        await likeBlog(blog._id);
        message.success(`You liked the ${blog.title}`);
      } else {
        //Chỗ gọi API
        await unlikeBlog(blog._id);
        message.success(`You unlike the ${blog.title}`);
      }
    } catch (error) {
      message.error("Error like!");
      console.log(error, "In Card Blog");
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle comment submission
const handleSubmitComment = async () => {
  if (!commentContent.trim()) return;
  
  try {
      if (editingComment) {
          // Edit existing comment
          await editComment(editingComment._id, commentContent);
          message.success("Comment updated successfully");
          setEditingComment(null);
      } else {
          // Create new comment
          // Make sure you're passing the content correctly:
          await createComment(blog._id, { content: commentContent });
          message.success("Comment added successfully");
      }
      
      // Reset form and refetch comments
      setCommentContent("");
      form.resetFields();
      fetchComments();
  } catch (error) {
      message.error("Failed to submit comment");
      console.error("Error submitting comment:", error);
  }
};

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingComment(comment);
    setCommentContent(comment.content);
    form.setFieldsValue({ comment: comment.content });
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId) => {
    Modal.confirm({
      title: "Are you sure you want to delete this comment?",
      icon: <ExclamationCircleFilled />,
      okText: "Yes",
      okType: "danger",
      cancelText: "No",
      onOk: async () => {
        try {
          await deleteComment(commentId);
          message.success("Comment deleted successfully");
          fetchComments();
        } catch (error) {
          message.error("Failed to delete comment");
          console.error("Error deleting comment:", error);
        }
      },
    });
  };
  
  // Cancel editing
  const handleCancelEdit = () => {
    setEditingComment(null);
    setCommentContent("");
    form.resetFields();
  };

  const IconText = ({ icon, text, onClick, toolTipText, color = "8c8c8c" }) => (
    <Tooltip placement="top" title={toolTipText}>
      <span
        onClick={onClick}
        style={{ cursor: "pointer", userSelect: "none", color: color }}
      >
        <Space>
          {React.createElement(icon)}
          {text}
        </Space>
      </span>
    </Tooltip>
  );
  
  const listItemAction = [
    <IconText
      icon={LikeOutlined}
      text={likes}
      key="list-vertical-like-o"
      onClick={handleLike}
      toolTipText="Like"
      color={hasLiked ? "#1677ff" : "8c8c8c"}
    />,
    <IconText
      icon={MessageOutlined}
      text={blog.commentIds.length}
      key="list-vertical-message"
      toolTipText="Comment"
      color={isModalCommentVisible ? "#1677ff" : "8c8c8c"}
      onClick={toggleOpenModalComment}
    />,
    ...blog.tags.map((item, i) => (
      <IconText
        key={`${item}${i}`}
        icon={TagOutlined}
        text={item}
        toolTipText="Tags"
      />
    )),
  ];

  return (
    <Flex gap="middle" vertical style={{ marginBottom: "1.6rem" }}>
      {isModalEditBlogVisible && (
        <ModalBlogActions
          isModalOpen={isModalEditBlogVisible}
          blogProp={blog}
          onOK={handleUpdatedBlog}
          onCancel={handleCloseModalEditBlog}
        />
      )}
      <Card
        extra={
          blog.uploaderId._id === userId && (
            <Popover
              trigger="hover"
              content={
                <Flex gap="small" vertical>
                  <Button type="text" onClick={handleOpenModalEditBlog}>
                    Edit
                  </Button>

                  <Button type="text" onClick={handleDelete}>
                    Delete
                  </Button>
                </Flex>
              }
            >
              <Button type="text">
                <EllipsisOutlined />
              </Button>
            </Popover>
          )
        }
      >
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
      </Card>
      {isModalCommentVisible && (
        <Card
          title="Comments Box"
          extra={
            <Button type="text" onClick={toggleOpenModalComment}>
              <Tooltip title="Close">
                <CloseOutlined />
              </Tooltip>
            </Button>
          }
        >
          <Flex vertical gap="middle">
            <div style={{ height: "30rem", overflowY: "auto" }}>
              <List
                itemLayout="horizontal"
                dataSource={comments}
                locale={{ emptyText: "No comments yet. Be the first to comment!" }}
                renderItem={(item) => (
                  <List.Item
                    actions={
                      item.userId === userId
                        ? [
                            <Button 
                              type="text" 
                              icon={<EditOutlined />} 
                              onClick={() => handleEditComment(item)}
                            />,
                            <Button 
                              type="text" 
                              danger 
                              icon={<DeleteOutlined />} 
                              onClick={() => handleDeleteComment(item._id)}
                            />
                          ]
                        : []
                    }
                  >
                    <List.Item.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${item._id}`}
                        />
                      }
                      title={
                        <Space>
                          <Typography.Text strong>
                            {item.authorName || "Anonymous"}
                          </Typography.Text>
                          <Typography.Text type="secondary" style={{ fontSize: '12px' }}>
                            {formatCustomDate(item.createdAt)}
                          </Typography.Text>
                        </Space>
                      }
                      description={item.content}
                    />
                  </List.Item>
                )}
              />
            </div>
            <Form form={form} onFinish={handleSubmitComment}>
              <Flex gap="small" align="center">
                <Form.Item 
                  name="comment" 
                  style={{ margin: 0, flex: 1 }}
                  rules={[{ required: true, message: 'Please input your comment!' }]}
                >
                  <TextArea 
                    rows={1} 
                    placeholder="Write a comment..." 
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                  />
                </Form.Item>
                <Space>
                  {editingComment && (
                    <Button onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                  )}
                  <Button type="primary" htmlType="submit">
                    <SendOutlined />
                  </Button>
                </Space>
              </Flex>
            </Form>
          </Flex>
        </Card>
      )}
    </Flex>
  );
}