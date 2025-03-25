import { LeftOutlined, UserOutlined, PlusOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Layout, Typography, Input, FloatButton } from "antd";
import ChatBox from "../../../components/student/MessagePage/ChatBox/ChatBox";
import { useEffect, useState } from "react";
import { getConversations } from "../../../../api_service/mesages_service";

const { Title } = Typography;
const { Content } = Layout;
const { Search } = Input;

export default function MessagePage() {
  const [cardWidth, setCardWidth] = useState("50rem");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = localStorage.getItem("userId");
      const userModel = localStorage.getItem("role");
      if (userId && userModel) {
        try {
          const data = await getConversations(userId, userModel);
          if (Array.isArray(data)) {
            setConversations(data);
          } else {
            console.error("Invalid data format:", data);
          }
        } catch (error) {
          console.error("Error fetching conversations:", error);
        }
      } else {
        console.warn("No userId or userModel found in localStorage");
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 875) {
        setCardWidth("20rem");
      } else if (window.innerWidth < 1300) {
        setCardWidth("30rem");
      } else {
        setCardWidth("50rem");
      }
    };
    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  const filteredData = conversations.filter((item) =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Content style={stylesInline.content}>
      <Flex gap="middle">
        {/* Danh sách người dùng */}
        <Card style={{ width: cardWidth, transition: "width 0.3s ease" }}>
          <Search
            placeholder="Search..."
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <div
            style={{
              height: "calc(100vh - 20rem)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Flex gap="small" vertical>
              {filteredData.map((item, index) => (
                <Card
                  style={{
                    cursor: "pointer",
                    border: "none",
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                  }}
                  size="small"
                  hoverable
                  key={item.id || index}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    title={<a href="https://ant.design">{item.id}</a>}
                    description="Ant Design,....."
                  />
                </Card>
              ))}
            </Flex>
          </div>
        </Card>

        {/* Khung chat */}
        <Card style={{ flex: 1 }} title={<TitleMessage />}>
          <ChatBox />
        </Card>
      </Flex>

      {/* FloatButton thêm đoạn chat */}
      <FloatButton
        icon={<PlusOutlined />}
        type="primary"
        style={{ right: 1200, bottom: 35 }}
        onClick={() => alert("Add new chat")}
      />
    </Content>
  );
}

function TitleMessage() {
  return (
    <Flex gap="small" align="center">
      <Avatar size="default" icon={<UserOutlined />} />
      <Title level={5} style={{ margin: 0 }}>
        Hello
      </Title>
    </Flex>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
