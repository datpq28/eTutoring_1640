import { useEffect, useState } from "react";
import { Button, Card, Space, Table, Modal, Form, Input, message } from "antd";
import { DownloadOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { getDocuments, createDocument, editDocument, deleteDocument } from "../../../../api_service/document_service.js";
import { convertSizeToBytes } from "../../../utils/Common.js";

export default function DocumentList() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [form] = Form.useForm();

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

  const confirmDelete = (id) => {
    Modal.confirm({
      title: "Xác nhận xoá",
      content: "Bạn có chắc chắn muốn xoá tài liệu này không?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Hủy",
      onOk: () => handleDelete(id),
    });
  };

  const handleDelete = async (id) => {
    try {
      await deleteDocument(id);
      message.success("Tài liệu đã được xoá");
      fetchDocuments();
    } catch (error) {
      console.error("Error deleting document:", error);
      message.error("Có lỗi xảy ra khi xoá tài liệu");
    }
  };

  const confirmAddOrEdit = (values) => {
    Modal.confirm({
      title: editingDocument ? "Xác nhận chỉnh sửa" : "Xác nhận thêm mới",
      content: editingDocument
        ? "Bạn có chắc chắn muốn chỉnh sửa tài liệu này không?"
        : "Bạn có chắc chắn muốn thêm tài liệu này không?",
      okText: "Lưu",
      cancelText: "Hủy",
      onOk: () => handleAddOrEdit(values),
    });
  };

  const handleAddOrEdit = async (values) => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        message.error("Không tìm thấy ID người dùng");
        return;
      }

      const documentData = { ...values, uploadedBy: userId };

      if (editingDocument) {
        await editDocument(editingDocument._id, documentData);
        message.success("Tài liệu đã được cập nhật");
      } else {
        await createDocument(documentData);
        message.success("Tài liệu đã được tạo thành công");
      }

      setIsModalOpen(false);
      form.resetFields();
      fetchDocuments();
    } catch (error) {
      console.error("Error saving document:", error);
      message.error("Có lỗi xảy ra khi lưu tài liệu");
    }
  };

  const columns = [
    { title: "#", key: "index", render: (_, __, index) => index + 1 },
    { title: "Title", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
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
          <Button
            onClick={() => {
              setEditingDocument(record);
              form.setFieldsValue(record);
              setIsModalOpen(true);
            }}
          >
            <EditOutlined /> Sửa
          </Button>
          <Button danger onClick={() => confirmDelete(record._id)}>
            <DeleteOutlined /> Xoá
          </Button>
          <Button type="primary" href={record.fileUrl} download>
            <DownloadOutlined /> Tải về
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Danh sách tài liệu"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingDocument(null);
            setIsModalOpen(true);
            form.resetFields();
          }}
        >
          Thêm tài liệu
        </Button>
      }
    >
      <Table dataSource={documents} columns={columns} rowKey="_id" loading={loading} />
      <Modal
        title={editingDocument ? "Chỉnh sửa tài liệu" : "Thêm tài liệu"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={confirmAddOrEdit}>
          <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea />
          </Form.Item>
          <Form.Item name="subject" label="Môn học" rules={[{ required: true, message: "Vui lòng nhập môn học" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="typeFile" label="Loại tệp" rules={[{ required: true, message: "Vui lòng nhập loại tệp" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="sizeFile" label="Kích thước tệp" rules={[{ required: true, message: "Vui lòng nhập kích thước tệp" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="fileUrl" label="URL tệp" rules={[{ required: true, message: "Vui lòng nhập URL tệp" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}