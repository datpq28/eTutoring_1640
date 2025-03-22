import { Menu } from "antd";
import styles from "./MenuList.module.css";
import { useNavigate, useLocation } from "react-router";
import {
  HomeOutlined,
  CalendarOutlined,
  FileOutlined,
  LogoutOutlined,
  VideoCameraOutlined,
  TeamOutlined,
  UserOutlined,
  FolderOpenOutlined,
} from "@ant-design/icons";

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: <HomeOutlined /> },
  { key: "calendar", label: "Calendar", icon: <CalendarOutlined /> },
  {
    key: "student-management",
    label: "Student management",
    icon: <TeamOutlined />,
  },
  {
    key: "tutor-management",
    label: "Tutor management",
    icon: <UserOutlined />,
  },
  { key: "blog-management", label: "Blog management", icon: <FileOutlined /> },
  {
    key: "document-management",
    label: "Document management",
    icon: <FolderOpenOutlined />,
  },
  {
    key: "meeting-management",
    label: "Meeting management",
    icon: <VideoCameraOutlined />,
  },
];

const bottomItems = [
  { key: "logout", label: "Log out", icon: <LogoutOutlined /> },
];

export default function MenuList() {
  let navigate = useNavigate();
  let location = useLocation();

  const currentKey = location.pathname.split("/")[2] || "dashboard";

  return (
    <div className={styles.menuWrapper}>
      {/* Menu chính */}
      <Menu
        theme="dark"
        mode="inline"
        className={styles.menuContainer}
        selectedKeys={[currentKey]}
        items={menuItems}
        onClick={(e) => navigate(`/admin/${e.key}`)}
      />

      {/* Menu dưới cùng */}
      <div style={{ marginTop: "auto" }}>
        <Menu
          theme="dark"
          mode="inline"
          className={styles.menuContainer}
          selectedKeys={[currentKey]}
          items={bottomItems}
          onClick={(e) => navigate(`/admin/${e.key}`)}
        />
      </div>
    </div>
  );
}
