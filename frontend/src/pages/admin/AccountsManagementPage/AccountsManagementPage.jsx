import {
  CheckCircleTwoTone, DeleteTwoTone, ImportOutlined, LockTwoTone,
  TeamOutlined, ToolOutlined, UnlockTwoTone, UserAddOutlined, UserOutlined
} from "@ant-design/icons";
import { Button, Card, Flex, Input, Layout, Segmented, Space, Table, Tag, Typography, message  } from "antd";
import { useState, useEffect } from "react";
import AddUserModal from "../../../components/admin/AccountsManagementPage/AddUserModal/AddUserModal";
import { viewListUser, lockUser, unLockUser } from "../../../../api_service/admin_service";

const { Content } = Layout;
const { Text } = Typography;

export default function AccountsManagementPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [segmented, setSegmented] = useState("allUsers");
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  const showModal = () => setIsModalOpen(true);
  const hideModal = () => setIsModalOpen(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await viewListUser();
        console.log('Data from API:', data);
        const allUsers = [...data.students, ...data.tutors];
        const mappedUsers = allUsers.map(user => ({
          ...user,
          name: `${user.firstname} ${user.lastname}`,
          status: user.isLocked ? "locked" : "active",
          role: user.role === "student" ? "student" : "tutor",
        }));
        console.log('Mapped Users:', mappedUsers);
        setUsers(mappedUsers);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleLock = async (email) => {
    try {
      await lockUser(email);
      message.success("User locked successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isLocked: true, status: "locked" } : user
        )
      );
    } catch (error) {
      message.error("Failed to lock user");
    }
  };

  const handleUnlock = async (email) => {
    try {
      await unLockUser(email);
      message.success("User unlocked successfully");
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isLocked: false, status: "active" } : user
        )
      );
    } catch (error) {
      message.error("Failed to unlock user");
    }
  };

  const filteredData = users.filter((item) => {
    const matchesSegmented =
      segmented === "allUsers" ||
      (segmented === "students" && item.role === "student") ||
      (segmented === "tutors" && item.role === "tutor") ||
      (segmented === "admin" && item.role === "admin") ||
      (segmented === "requests" && item.status === "pending");
    const matchesSearch = item.name.toLowerCase().includes(searchValue.toLowerCase());
    return matchesSegmented && (searchValue === "" || matchesSearch);
  });

  const segmentedOptions = [
    { label: "All Users", value: "allUsers", icon: <TeamOutlined /> },
    { label: "Students", value: "students", icon: <UserOutlined /> },
    { label: "Tutors", value: "tutors", icon: <UserOutlined /> },
    { label: "Admin", value: "admin", icon: <ToolOutlined /> },
    { label: "Requests", value: "requests", icon: <ImportOutlined /> },
  ];

  const columns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Password", dataIndex: "password", key: "password" },
    {
      title: "Role", dataIndex: "role", key: "role",
      render: (_, { role }) => {
        const color = role === "admin" ? "volcano" : role === "student" ? "green" : "blue";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (_, { status }) => {
        const color = status === "active" ? "#87d068" : status === "locked" ? "#f50" : "#108ee9";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions", key: "actions", align: "right",
      render: (_, record) => {
        const { isLocked } = record;
        
        const unlockButton = (
          <Button color="lime" variant="filled" onClick={() => handleUnlock(record.email)}>
            <Space size="small">
              <UnlockTwoTone twoToneColor="#52c41a" />
              <Text type="success">Unlock</Text>
            </Space>
          </Button>
        );
        
        const lockButton = (
          <Button color="gold" variant="filled" onClick={() => handleLock(record.email)}>
            <Space size="small">
              <LockTwoTone twoToneColor="#faad14" />
              <Text type="warning">Lock</Text>
            </Space>
          </Button>
        );
        
        const deleteButton = (
          <Button color="red" variant="filled">
            <Space size="small">
              <DeleteTwoTone twoToneColor="#ff4d4f" />
              <Text type="danger">Delete</Text>
            </Space>
          </Button>
        );
      
        return (
          <Flex gap="middle" justify="end">
            {isLocked ? unlockButton : lockButton}
            {deleteButton}
          </Flex>
        );
      },      
    },
  ];

  return (
    <Content style={stylesInline.content}>
      <Flex vertical gap="middle">
        <Card>
          <Flex justify="space-between">
            <Segmented value={segmented} options={segmentedOptions} onChange={setSegmented} />
            <Space size="middle">
              <Input
                placeholder="Search User"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                style={{ width: "30rem" }}
              />
              <Button type="primary" onClick={showModal}>
                <UserAddOutlined /> Add New User
              </Button>
            </Space>
          </Flex>
        </Card>
        <Card>
          <Table columns={columns} dataSource={filteredData} pagination={{ pageSize: 5 }} rowKey="email" />
        </Card>
      </Flex>
      <AddUserModal isModalOpen={isModalOpen} hideModal={hideModal} />
    </Content>
  );
}

const stylesInline = { content: { padding: "2rem" } };
