import { LeftOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Layout, Typography } from "antd";
import { useEffect, useState } from "react";
const { Title } = Typography;
const { Content } = Layout;
const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];
export default function MessagePage() {
  const [cardWidth, setCardWidth] = useState("50rem");

  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 875) {
        setCardWidth("20rem"); // Khi màn nhỏ thì card thu nhỏ
      } else if (window.innerWidth < 1300) {
        setCardWidth("30rem"); // Khi màn trung bình thì card thu nhỏ
      } else {
        setCardWidth("50rem"); // Khi màn lớn thì giữ nguyên 50rem
      }
    };
    updateWidth(); // Gọi ngay khi component mount
    window.addEventListener("resize", updateWidth); // Lắng nghe sự kiện resize

    return () => window.removeEventListener("resize", updateWidth); // Cleanup khi unmount
  }, []);
  return (
    <Content style={stylesInline.content}>
      <Flex gap="middle">
        <Card style={{ width: cardWidth, transition: "width 0.3s ease" }}>
          <div
            style={{
              height: "calc(100vh - 16rem)",
              overflowY: "auto",
              scrollbarWidth: "none",
            }}
          >
            <Flex gap="small" vertical>
              {data.map((item, index) => (
                <Card
                  style={{
                    cursor: "pointer",
                    border: "none",
                    marginLeft: "0.5rem",
                    marginRight: "0.5rem",
                  }}
                  size="small"
                  hoverable
                  key={index}
                >
                  <Card.Meta
                    avatar={
                      <Avatar
                        src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${index}`}
                      />
                    }
                    title={<a href="https://ant.design">{item.title}</a>}
                    description="Ant Design,....."
                  />
                </Card>
              ))}
            </Flex>
          </div>
        </Card>
        <Card style={{ flex: 1 }} title={<TitleMessage />}>
          <p>Chatbox</p>
        </Card>
      </Flex>
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
