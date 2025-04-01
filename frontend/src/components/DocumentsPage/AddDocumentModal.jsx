import { UploadOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Select,
  Upload,
} from "antd";
import { useEffect, useState } from "react";
import {
  createDocument,
  editDocument,
} from "../../../api_service/document_service.js";

const userId = localStorage.getItem("userId");

const selectSubject = [
  {
    value: "math",
    label: "Math",
  },
  {
    value: "literature",
    label: "Literature",
  },
  {
    value: "biology",
    label: "Biology",
  },
  {
    value: "history",
    label: "History",
  },
  {
    value: "geology",
    label: "Geology",
  },
];
const fileTypes = [
  ".pdf", // PDF file
  ".doc", // Word .doc
  ".docx", // Word .docx
  ".ppt", // PowerPoint .ppt
  ".pptx", // PowerPoint .pptx
];
export default function AddDocumentModal({
  open,
  onCancel,
  fetchDocuments,
  fileUpdate = null,
}) {
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  useEffect(() => {
    if (fileUpdate) {
      form.setFieldsValue({
        title: fileUpdate.title,
        description: fileUpdate.description,
        subject: fileUpdate.subject,
      });
    }
  }, [fileUpdate, form]);

  const handleRemove = () => {
    setFile(null);
  };

  const handleBeforeUploadFile = (file) => {
    const isValidType = fileTypes.some((ext) => file.name.endsWith(ext));
    if (!isValidType) {
      message.error("Only PDF, Word, and PowerPoint files are allowed!");
      return isValidType;
    }
    setFile(file);
    return false;
  };

  // Xử lý khi submit form
  const handleSubmit = async () => {
    if (!file && !fileUpdate) {
      message.error("Please choose one file to upload!");
      return;
    }
    const values = await form.validateFields();
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("subject", values.subject);
    formData.append("uploadedBy", userId);
    if (file) {
      formData.append("file", file);
    }

    try {
      if (fileUpdate) {
        await editDocument(fileUpdate._id, formData);
      } else {
        await createDocument(formData);
      }
      onCancel();
      form.resetFields();
      setFile(null);
      notification.success({
        message: `${fileUpdate ? "Edit" : "Upload"} Success`,
        duration: 3,
      });
      await fetchDocuments();
    } catch (error) {
      message.error("Error when uploading file");
      console.error(error);
    }
  };

  return (
    <Modal
      title={fileUpdate ? "Update Document" : "Upload Document"}
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          name="title"
          label="Title"
          rules={[{ required: true, message: "Please enter title" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name="description"
          label="Description Document"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please input!" }]}
        >
          <Select placement="bottomLeft" options={selectSubject} />
        </Form.Item>
        <Form.Item label="Select File">
          <Upload
            beforeUpload={handleBeforeUploadFile}
            fileList={file ? [file] : []} // Chỉ có 1 file duy nhất
            maxCount={1}
            onRemove={handleRemove}
          >
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}
