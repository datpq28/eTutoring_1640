const Blog = require("../../models/BlogModel");
const Tutor = require("../../models/TutorStudent");
const Student = require("../../models/StudentModel");

const createBlog = async (req, res) => {
  try {
    const { title, content, uploaderId, uploaderType, tags, imageUrl } =
      req.body;

    const formattedUploaderType =
      uploaderType.charAt(0).toUpperCase() +
      uploaderType.slice(1).toLowerCase();

    if (!["student", "tutor"].includes(uploaderType)) {
      console.error("Lỗi: Uploader type không hợp lệ:", uploaderType);
      return res.status(400).json({ error: "Uploader type không hợp lệ" });
    }

    const uploaderModel = uploaderType === "Tutor" ? Tutor : Student;
    const uploader = await uploaderModel.findById(uploaderId);
    if (!uploader) {
      console.error("Lỗi: Người đăng không tồn tại với ID:", uploaderId);
      return res.status(404).json({ error: "Người đăng không tồn tại" });
    }

    const newBlog = new Blog({
      title,
      content,
      uploaderId,
      uploaderType,
      tags: tags || [],
      imageUrl: imageUrl || "",
      likes: 0,
    });

    await newBlog.save();

    uploader.blogIds = uploader.blogIds || [];
    uploader.blogIds.push(newBlog._id);
    await uploader.save();

    console.log("Bài blog đã được tạo:", newBlog);
    res.status(201).json({ message: "Bài blog đã được tạo", blog: newBlog });
  } catch (error) {
    console.error("Lỗi trong quá trình tạo blog:", error);
    res.status(500).json({ error: error.message });
  }
};

const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .sort({ createdAt: -1 })
      .populate("uploaderId", "firstname lastname email");

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findById(blogId).populate(
      "uploaderId",
      "firstname lastname email"
    );

    if (!blog) {
      return res.status(404).json({ error: "Bài blog không tồn tại" });
    }

    blog.views = (blog.views || 0) + 1;
    await blog.save();

    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const editBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { title, content, tags, imageUrl } = req.body;

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({ error: "Bài blog không tồn tại" });
    }

    blog.title = title || blog.title;
    blog.content = content || blog.content;
    blog.tags = tags || blog.tags;
    blog.imageUrl = imageUrl || blog.imageUrl;

    await blog.save();

    res.status(200).json({ message: "Bài blog đã được cập nhật", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndDelete(blogId);

    if (!blog) {
      return res.status(404).json({ error: "Bài blog không tồn tại" });
    }

    const uploaderModel = blog.uploaderType === "Tutor" ? Tutor : Student;
    await uploaderModel.findByIdAndUpdate(blog.uploaderId, {
      $pull: { blogIds: blogId },
    });

    res.status(200).json({ message: "Bài blog đã được xóa" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const likeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const blog = await Blog.findByIdAndUpdate(
      blogId,
      { $inc: { likes: 1 } },
      { new: true }
    );

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.error("Blog not found:", blogId);
      return res.status(404).json({ error: "Bài blog không tồn tại" });
    }

    if (blog.likedBy.includes(userId)) {
      console.warn("User already liked this blog:", { blogId, userId });
      return res.status(400).json({ error: "Bạn đã thích bài blog này rồi" });
    }

    blog.likes += 1;
    blog.likedBy.push(userId);
    await blog.save();

    console.log("Blog liked successfully:", { blogId, likes: blog.likes });

    res.status(200).json({ message: "Đã thích bài blog", blog });
  } catch (error) {
    console.error("Error in likeBlog:", error);
    res.status(500).json({ error: error.message });
  }
};

const unlikeBlog = async (req, res) => {
  try {
    const { blogId } = req.params;
    const { userId } = req.body;

    console.log("Unlike request received:", { blogId, userId });

    const blog = await Blog.findById(blogId);
    if (!blog) {
      console.error("Blog not found:", blogId);
      return res.status(404).json({ error: "Bài blog không tồn tại" });
    }

    // Kiểm tra nếu likedBy không phải là mảng hoặc userId không tồn tại trong danh sách
    if (
      !Array.isArray(blog.likedBy) ||
      !blog.likedBy.some((id) => id && id.toString() === userId)
    ) {
      console.warn("User has not liked this blog:", { blogId, userId });
      return res.status(400).json({ error: "Bạn chưa thích bài blog này" });
    }

    blog.likes = Math.max(0, blog.likes - 1); // Đảm bảo số likes không âm
    blog.likedBy = blog.likedBy.filter((id) => id && id.toString() !== userId);

    await blog.save();

    console.log("Blog unliked successfully:", { blogId, likes: blog.likes });

    res.status(200).json({ message: "Đã bỏ thích bài blog", blog });
  } catch (error) {
    console.error("Error in unlikeBlog:", error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
  editBlog,
  deleteBlog,
  likeBlog,
  unlikeBlog,
};
