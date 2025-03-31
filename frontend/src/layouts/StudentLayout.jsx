import { Avatar, Badge, Dropdown, Layout, Menu, Space, Typography, message } from "antd";
import Logo from "../components/Logo/Logo.jsx";
import MenuList from "../components/student/MenuList.jsx";
import { Outlet, useLocation, useNavigate } from "react-router";
import { BellOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { logoutUser } from "../../api_service/auth_service.js"; // Import API logout

const { Header, Sider } = Layout;
const { Title } = Typography;

export default function StudentLayout() {
  const [collapsed, setCollapsed] = useState(window.innerWidth < 992);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      setCollapsed(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const titles = {
    "/student/dashboard": "🏠 Dashboard",
    "/student/calendar": "📅 Calendar",
    "/student/messages": "💬 Messages",
    "/student/documents": "📁 Documents",
    "/student/setting": "⚙️ Settings",
    "/student/blog": "📁 Blog",
  };

 
  const handleLogout = async () => {
    try {
      await logoutUser();
      message.success("Logout successful");
      localStorage.removeItem("token");
  
      // 🔴 Gửi thông báo logout cho tất cả tab khác
      const logoutChannel = new BroadcastChannel("logout_channel");
      logoutChannel.postMessage("logout");
  
      navigate("/auth/login");
    } catch (error) {
      message.error("Logout failed!");
    }
  };
  
  useEffect(() => {
    const logoutChannel = new BroadcastChannel("logout_channel");
    logoutChannel.onmessage = () => {
      localStorage.removeItem("token");
      navigate("/auth/login");
    };
  
    return () => {
      logoutChannel.close();
    };
  }, []);
  

  const userMenu = (
    <Menu
      items={[
        {
          key: "profile",
          label: "Profile",
          icon: <UserOutlined />,
          onClick: () => navigate("/student/profile"),
        },
        {
          key: "logout",
          label: "Log out",
          icon: <LogoutOutlined />,
          onClick: handleLogout,
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
    background: "#1890ff",
    color: "#fff",
  },
};
