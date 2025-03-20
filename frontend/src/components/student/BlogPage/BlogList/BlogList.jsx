import { Card, Flex, Pagination } from "antd";
import { useState } from "react";
import CardBlog from "./CardBlog/CardBlog";

const blogs = [
  { id: 1, title: "Bài viết 1", content: "Nội dung bài viết 1" },
  { id: 2, title: "Bài viết 2", content: "Nội dung bài viết 2" },
  { id: 3, title: "Bài viết 3", content: "Nội dung bài viết 3" },
  { id: 4, title: "Bài viết 4", content: "Nội dung bài viết 4" },
  { id: 5, title: "Bài viết 5", content: "Nội dung bài viết 5" },
  { id: 6, title: "Bài viết 6", content: "Nội dung bài viết 6" },
];

export default function BlogList() {
  const pageSize = 6; // Số bài trên mỗi trang
  const [currentPage, setCurrentPage] = useState(1);

  // Cắt danh sách theo trang
  const paginatedBlogs = blogs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <Card>
      <Flex gap="middle" align="center" vertical>
        <Flex gap="middle" wrap justify="center">
          {paginatedBlogs.map((item, index) => (
            <CardBlog key={index} />
          ))}
        </Flex>
        <Pagination
          current={currentPage}
          total={blogs.length}
          pageSize={pageSize}
          onChange={(page) => setCurrentPage(page)}
          showSizeChanger={false}
          style={{ marginTop: "1.6rem" }}
        />
      </Flex>
    </Card>
  );
}
