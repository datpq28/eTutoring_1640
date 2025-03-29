import { useEffect, useState } from "react";
import { Button, Card, Space, Table } from "antd";
import { DownloadOutlined, ExpandOutlined } from "@ant-design/icons";
import { getDocuments } from "../../../../api_service/document_service.js";
import { convertSizeToBytes } from "../../../utils/Common.js";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "#", key: "index", render: (_, __, index) => index + 1 },
    { title: "Title", dataIndex: "title", key: "title" },
    {
      title: "Tutor",
      dataIndex: ["uploadedBy", "firstname"],
      key: "tutor",
      render: (_, record) => `${record.uploadedBy.firstname} ${record.uploadedBy.lastname}`,
    },
    { title: "Subject", dataIndex: "subject", key: "subject" },
    { title: "Type File", dataIndex: "typeFile", key: "typeFile" },
    {
      title: "Upload Date",
      dataIndex: "createdAt",
      key: "uploadDate",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (date) => new Date(date).toLocaleDateString("vi-VN"),
    },
    {
      title: "Size",
      dataIndex: "sizeFile",
      key: "sizeFile",
      sorter: (a, b) => convertSizeToBytes(a.sizeFile) - convertSizeToBytes(b.sizeFile),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button>
            <Space size="small" align="center">
              <ExpandOutlined />
              Xem trước
            </Space>
          </Button>
          <Button type="primary" href={record.fileUrl} download>
            <Space size="small" align="center">
              <DownloadOutlined />
              Tải về
            </Space>
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Danh sách tài liệu">
      <Table dataSource={documents} columns={columns} rowKey="_id" loading={loading} />
    </Card>
  );
}
