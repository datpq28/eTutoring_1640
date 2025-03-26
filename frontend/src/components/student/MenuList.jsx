import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router";
import {
  HomeOutlined,
  CalendarOutlined,
  MessageOutlined,
  FileOutlined,
  SettingOutlined,
  LogoutOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <HomeOutlined /> },
  { key: "calendar", label: "Calendar", icon: <CalendarOutlined /> },
  { key: "messages", label: "Messages", icon: <MessageOutlined /> },
  { key: "documents", label: "Documents", icon: <FolderOpenOutlined /> },
  { key: "blog", label: "Blog", icon: <FileOutlined /> },
];

const bottomItems = [
  { key: "setting", label: "Setting", icon: <SettingOutlined /> },
  { key: "logout", label: "Log out", icon: <LogoutOutlined /> },
];

export default function MenuList() {
  let navigate = useNavigate();
  let location = useLocation();

  const currentKey = location.pathname.split("/")[2] || "dashboard";

  return (
      <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 6rem)' }}>
      {/* Menu chính */}
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={(e) => navigate(`/student/${e.key}`)}
      />

      {/* Menu dưới cùng */}
      <div style={{ marginTop: "auto" }}>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[currentKey]}
          items={bottomItems}
          onClick={(e) => navigate(`/student/${e.key}`)}
        />
      </div>
    </div>
  );
}
