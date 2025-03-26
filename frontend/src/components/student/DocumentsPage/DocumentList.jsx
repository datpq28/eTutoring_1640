import { Button, Card, Space, Table } from "antd";
import { convertSizeToBytes } from "../../../utils/Common.js";
import { DownloadOutlined, ExpandOutlined } from "@ant-design/icons";
const columns = [
  {
    title: "#",
    key: "index",
    render: (_, __, index) => index + 1, // Hiển thị số thứ tự bắt đầu từ 1
  },
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Tutor",
    dataIndex: "tutor",
    key: "tutor",
  },
  {
    title: "Subject",
    dataIndex: "subject",
    key: "subject",
  },
  {
    title: "Type File",
    dataIndex: "typeFile",
    key: "typeFile",
  },
  {
    title: "Upload date",
    dataIndex: "uploadDate",
    key: "uploadDate",
    sorter: (a, b) => {
      // Chuyển đổi chuỗi ngày thành Date để so sánh
      return (
        new Date(a.uploadDate.split("/").reverse().join("-")) -
        new Date(b.uploadDate.split("/").reverse().join("-"))
      );
    },
  },
  {
    title: "Sizes",
    key: "sizes",
    dataIndex: "sizes",
    sorter: (a, b) => convertSizeToBytes(a.sizes) - convertSizeToBytes(b.sizes),
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button color="default" variant="filled">
          <Space size="small" align="center">
            <ExpandOutlined />
            Xem trước
          </Space>
        </Button>
        <Button type="primary">
          <Space size="small" align="center">
            <DownloadOutlined />
            Tải về
          </Space>
        </Button>
      </Space>
    ),
  },
];
const data = [
  {
    key: "1",
    name: "Bài tập Toán cao cấp.pdf",
    subject: "Math",
    typeFile: "docx",
    tutor: "Thoa",
    uploadDate: "18/03/2025",
    sizes: "1.2MB",
  },
  {
    key: "2",
    name: "Bài tập Toán cao cấp.pdf",
    subject: "Math",
    typeFile: "pdf",
    tutor: "Thoa",
    uploadDate: "19/03/2025",
    sizes: "1.2MB",
  },
  {
    key: "3",
    name: "Bài tập Toán cao cấp.pdf",
    subject: "Math",
    typeFile: "csv",
    tutor: "Thoa",
    uploadDate: "21/03/2025",
    sizes: "1.2MB",
  },
];
export default function DocumentList() {
  return (
    <Card title="Document List">
      <Table dataSource={data} columns={columns} />
    </Card>
  );
}
