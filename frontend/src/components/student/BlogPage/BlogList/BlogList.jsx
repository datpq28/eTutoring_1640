import { useEffect, useState } from "react";
import { Card, Flex, Spin, message, Button, Modal, Input, Select } from "antd";
import CardBlog from "./CardBlog/CardBlog";
import { getBlogs, createBlog } from "../../../../../api_service/blog_service";

export default function BlogList() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [tags, setTags] = useState(""); // Tags cách nhau bằng dấu phẩy
  const [imageUrl, setImageUrl] = useState(""); // URL hình ảnh bài viết

  // Lấy uploaderId và uploaderType từ localStorage
  const userId = localStorage.getItem("userId");
  const userRole = localStorage.getItem("role") || "Student";

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const data = await getBlogs();
      setBlogs(data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách blog");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleCreate = async () => {
    if (!newTitle || !newContent) {
      message.warning("Vui lòng nhập đầy đủ tiêu đề và nội dung!");
      return;
    }

    try {
      await createBlog({
        title: newTitle,
        content: newContent,
        uploaderId: userId, // Lấy từ localStorage
        uploaderType: userRole, // Lấy từ localStorage
        tags: tags ? tags.split(",").map(tag => tag.trim()) : [],
        imageUrl
      });

      message.success("Tạo bài viết thành công!");
      setIsCreating(false);
      setNewTitle("");
      setNewContent("");
      setTags("");
      setImageUrl("");
      fetchBlogs();
    } catch (error) {
      message.error("Có lỗi xảy ra khi tạo bài viết!");
    }
  };

  return (
    <Card style={{ maxWidth: "100%", margin: "auto", padding: "1.5rem" }}>
      <Flex justify="space-between" align="center" style={{ marginBottom: "1rem" }}>
        <h2>Danh sách bài viết</h2>
        <Button type="primary" onClick={() => setIsCreating(true)}>Tạo bài viết</Button>
      </Flex>

      <Flex gap="large" vertical>
        {loading ? (
          <Spin size="large" style={{ textAlign: "center", marginTop: 20 }} />
        ) : (
          <Flex gap="large" vertical>
            {blogs.map((blog) => (
              <CardBlog key={blog._id} blog={blog} fetchBlogs={fetchBlogs} />
            ))}
          </Flex>
        )}
      </Flex>

      {/* Modal tạo bài viết */}
      <Modal
        title="Tạo bài viết mới"
        open={isCreating}
        onCancel={() => setIsCreating(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsCreating(false)}>Hủy</Button>,
          <Button key="submit" type="primary" onClick={handleCreate}>Tạo</Button>
        ]}
      >
        <Input
          placeholder="Tiêu đề bài viết"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
        />
        <Input.TextArea
          placeholder="Nội dung bài viết"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          rows={4}
          style={{ marginTop: "1rem" }}
        />
        <Select
          value={userRole}
          disabled // Không cần cho phép chỉnh sửa vì lấy từ localStorage
          style={{ width: "100%", marginTop: "1rem" }}
        >
          <Select.Option value="Student">Học viên</Select.Option>
          <Select.Option value="Tutor">Gia sư</Select.Option>
        </Select>
        <Input
          placeholder="Tags (cách nhau bằng dấu phẩy)"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          style={{ marginTop: "1rem" }}
        />
        <Input
          placeholder="URL hình ảnh"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          style={{ marginTop: "1rem" }}
        />
      </Modal>
    </Card>
  );
}
