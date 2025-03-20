import { BookOutlined } from "@ant-design/icons";
import styles from "./Logo.module.css";
export default function Logo() {
  return (
    <div className={styles.logo}>
      <div className={styles["logo-icon"]}>
        <BookOutlined />
      </div>
    </div>
  );
}
