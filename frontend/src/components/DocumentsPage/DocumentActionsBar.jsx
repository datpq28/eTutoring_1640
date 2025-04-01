import { TeamOutlined, UploadOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Card, Flex, Input, Segmented, Select } from "antd";
import { useState } from "react";
import AddDocumentModal from "./AddDocumentModal.jsx";
const selectTypeFile = [
  {
    value: "empty",
    label: "Select Type File",
  },
  {
    value: "pdf",
    label: "PDF",
  },
  {
    value: "word",
    label: "Word",
  },
  {
    value: "powerpoint",
    label: "Power Point",
  },
];

const selectSubject = [
  {
    value: "empty",
    label: "Select Subject",
  },
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

const listOption = [
  {
    value: "all_documents",
    label: "All Documents",
    icon: <TeamOutlined />,
  },
  {
    value: "my_documents",
    label: "My Documents",
    icon: <UserOutlined />,
  },
];

export default function DocumentActionsBar({ fetchDocuments }) {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  const [isAddDocumentModalVisible, setIsAddDocumentModalVisible] =
    useState(false);

  const handleOpenAddDocumentModal = () => {
    setIsAddDocumentModalVisible(true);
  };

  const handleCloseAddDocumentModal = () => {
    setIsAddDocumentModalVisible(false);
  };

  return (
    <Card>
      <Flex gap="middle" justify="space-between" wrap>
        <Flex gap="middle" wrap>
          <Select
            defaultValue="empty"
            style={{
              width: 200,
            }}
            placement="bottomLeft"
            onChange={handleChange}
            options={selectTypeFile}
          />
          <Select
            style={{
              width: 200,
            }}
            defaultValue="empty"
            placement="bottomLeft"
            options={selectSubject}
            onChange={handleChange}
          />
        </Flex>
        <Flex gap="middle" wrap>
          <Input.Search
            placeholder="Search File"
            onSearch={onSearch}
            style={{
              width: 200,
            }}
            enterButton
          />
          <Button
            type="primary"
            onClick={handleOpenAddDocumentModal}
            icon={<UploadOutlined />}
          >
            Upload File
          </Button>
          <Segmented
            defaultValue="all_documents"
            options={listOption}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
        </Flex>
      </Flex>
      <AddDocumentModal
        open={isAddDocumentModalVisible}
        onCancel={handleCloseAddDocumentModal}
        fetchDocuments={fetchDocuments}
      />
    </Card>
  );
}
