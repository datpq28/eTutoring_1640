import { Button, Card } from "antd";
import { Link } from "react-router";
import { Space, Table } from "antd";
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
  },
  {
    title: "Sizes",
    key: "sizes",
    dataIndex: "sizes",
  },
  {
    title: "Action",
    key: "action",
    render: () => (
      <Space size="middle">
        <Button color="default" variant="filled">
          <Space size="small" align="center">
            <ExpandOutlined />
            Preview
          </Space>
        </Button>
        <Button type="primary">
          <Space size="small" align="center">
            <DownloadOutlined />
            Download
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
    <Card title="Tài liệu mới" extra={<Link>See All</Link>}>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} />
    </Card>
  );
}
