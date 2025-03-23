import {
  CheckCircleTwoTone,
  DeleteTwoTone,
  ImportOutlined,
  LockTwoTone,
  TeamOutlined,
  ToolOutlined,
  UnlockTwoTone,
  UserAddOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Flex,
  Input,
  Layout,
  Segmented,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import { useState } from "react";
import AddUserModal from "../../../components/admin/AccountsManagementPage/AddUserModal/AddUserModal";
const { Content } = Layout;
const { Text } = Typography;
const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "Phone",
    dataIndex: "phone",
    key: "phone",
  },
  {
    title: "Password",
    dataIndex: "password",
    key: "password",
  },
  //"geekblue" : "green" : "volcano"
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    render: (_, { role }) => {
      const color =
        role === "admin"
          ? "volcano"
          : role === "student"
          ? "green"
          : "geekblue";
      return <Tag color={color}>{role.toUpperCase()}</Tag>;
    },
  },

  //"#87d068",  "#108ee9", "#f50"
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    render: (_, { status }) => {
      const color =
        status === "active"
          ? "#87d068"
          : status === "locked"
          ? "#f50"
          : "#108ee9";
      return <Tag color={color}>{status.toUpperCase()}</Tag>;
    },
  },

  //"#ff4d4f", "#faad14", "#52c41a"
  {
    title: "Actions",
    key: "actions",
    align: "right",
    render: (_, record) => {
      const status = record.status;
      const approveButton = (
        <Button color="lime" variant="filled">
          <Space size="small">
            <CheckCircleTwoTone twoToneColor="#52c41a" />
            <Text type="success">Approve</Text>
          </Space>
        </Button>
      );
      const unlockButton = (
        <Button color="lime" variant="filled">
          <Space size="small">
            <UnlockTwoTone twoToneColor="#52c41a" />
            <Text type="success">Unlock</Text>
          </Space>
        </Button>
      );
      const lockButton = (
        <Button color="gold" variant="filled">
          <Space size="small">
            <LockTwoTone twoToneColor="#faad14" />
            <Text type="warning">Lock</Text>
          </Space>
        </Button>
      );
      const deleteButton = (
        <Button color="red" variant="filled">
          <Space size="small">
            <LockTwoTone twoToneColor="#ff4d4f" />
            <Text type="danger">Delete</Text>
          </Space>
        </Button>
      );
      return (
        <Flex gap="middle" justify="end">
          {status === "pending"
            ? approveButton
            : status === "locked"
            ? unlockButton
            : lockButton}
          {deleteButton}
        </Flex>
      );
    },
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "student",
    status: "pending",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "tutor",
    status: "active",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "admin",
    status: "locked",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "student",
    status: "pending",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "tutor",
    status: "active",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "admin",
    status: "locked",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "student",
    status: "pending",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "tutor",
    status: "active",
  },
  {
    key: "1",
    name: "John Brown",
    email: "john.brown@example.com",
    phone: "123-456-7890",
    password: "password123",
    role: "admin",
    status: "locked",
  },
];

const segmentedOptions = [
  {
    label: "All Users",
    value: "allUsers",
    icon: <TeamOutlined />,
  },
  {
    label: "Students",
    value: "students",
    icon: <UserOutlined />,
  },
  {
    label: "Tutors",
    value: "tutors",
    icon: <UserOutlined />,
  },
  {
    label: "Admin",
    value: "admin",
    icon: <ToolOutlined />,
  },
  {
    label: "Requests",
    value: "requests",
    icon: <ImportOutlined />,
  },
];
export default function AccountsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmented, setSegmented] = useState(segmentedOptions[0].value);
  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const filteredData = data.filter((item) => {
    if (segmented === "students") return item.role === "student";
    if (segmented === "tutors") return item.role === "tutor";
    if (segmented === "admin") return item.role === "admin";
    if (segmented === "requests") return item.status === "pending";
    return true; // "allUsers"
  });
  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <Card>
          <Flex justify="space-between">
            <Segmented
              value={segmented}
              options={segmentedOptions}
              onChange={(segmented) => {
                setSegmented(segmented);
              }}
            />
            <Space size="middle">
              <Input.Search
                placeholder="Search User"
                onSearch={onSearch}
                enterButton
                style={{
                  width: "30rem",
                }}
              />
              <Button type="primary" onClick={showModal}>
                <UserAddOutlined />
                Add New User
              </Button>
            </Space>
          </Flex>
        </Card>
        <Card>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{ pageSize: 5 }}
          />
        </Card>
      </Flex>

      {/* Modal add New User */}
      <AddUserModal isModalOpen={isModalOpen} hideModal={hideModal} />
    </Content>
  );
}
const stylesInline = {
  content: {
    padding: "2rem",
  },
};
