import {
  AppstoreOutlined,
  UnorderedListOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { Button, Card, Flex, Input, Segmented, Select, Space } from "antd";
const selectTypeFile = [
  {
    value: "empty",
    label: "Select Type File",
  },
  {
    value: "jack",
    label: "Jack",
  },
  {
    value: "lucy",
    label: "Lucy",
  },
  {
    value: "Yiminghe",
    label: "yiminghe",
  },
  {
    value: "disabled",
    label: "Disabled",
    disabled: true,
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
];

const layoutOption = [
  {
    value: "List",
    icon: <UnorderedListOutlined />,
  },
  {
    value: "Kanban",
    icon: <AppstoreOutlined />,
  },
];

export default function DocumentActionsBar() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
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
            defaultValue="empty"
            style={{
              width: 200,
            }}
            placement="bottomLeft"
            onChange={handleChange}
            options={selectSubject}
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
          <Button type="primary">
            <Space size="small" align="center">
              <UploadOutlined />
              Upload File
            </Space>
          </Button>
          <Segmented
            options={layoutOption}
            onChange={(value) => {
              console.log(value); // string
            }}
          />
        </Flex>
      </Flex>
    </Card>
  );
}
