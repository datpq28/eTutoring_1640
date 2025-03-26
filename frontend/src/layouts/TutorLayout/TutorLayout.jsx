import { Avatar, Badge, Dropdown, Layout, Menu, Space, Typography } from "antd";
import Logo from "../../components/Logo/Logo";
import MenuList from "../../components/tutor/MenuList/MenuList";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
const { Header, Sider } = Layout;
const { Title } = Typography;
export default function TutorLayout() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992); // Mặc định true nếu màn hình nhỏ

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  const navigate = useNavigate();
  const location = useLocation();
  const titles = {
    "/tutor/dashboard": "🏠 Dashboard",
    "/tutor/calendar": "📅 Calendar",
    "/tutor/messages": "💬 Messages",
    "/tutor/documents": "📁 Documents",
    "/tutor/setting": "⚙️ Settings",
    "/tutor/blog": "📁 Blog",
    "/tutor/meeting": "📹 Meeting",
    "/tutor/room-meeting": "📹 RoomMeeting",
  };
  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Profile",
          icon: <UserOutlined />,
          onClick: () => navigate("/tutor/profile"),
        },
        {
          key: "logout",
          label: "Log out",
          icon: <LogoutOutlined />,
          onClick: () => navigate("/auth/login"),
        },
      ]}
    />
  );
  return (
    <Layout hasSider>
      <Sider
        style={inlineStyles.siderStyle}
        trigger={null}
        collapsible
        collapsed={collapsed}
      >
        <Logo />
        <MenuList />
      </Sider>
      <Layout>
        <Header style={inlineStyles.headerStyle}>
          <Title level={3} style={{ margin: 0, color: "#fff" }}>
            {titles[location.pathname] || "Student Panel"}
          </Title>
          <Space
            size="large"
            style={{ marginLeft: "auto", alignItems: "center" }}
          >
            <Badge count={5} size="small">
              <Avatar icon={<BellOutlined />} />
            </Badge>

            <Dropdown overlay={userMenu} placement="bottomRight">
              <Avatar icon={<UserOutlined />} />
            </Dropdown>
          </Space>
        </Header>
        <Outlet />
      </Layout>
    </Layout>
  );
}

const inlineStyles = {
  siderStyle: {
    overflow: "auto",
    height: "100vh",
    position: "sticky",
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    scrollbarWidth: "thin",
    scrollbarGutter: "stable",
  },
  headerStyle: {
    display: "flex",
    alignItems: "center",
    padding: "0 1.6rem",
    height: "7rem",
    background: "#1890ff", // Màu xanh đẹp của Ant Design
    color: "#fff",
  },
};
