import { SendOutlined } from "@ant-design/icons";
import { Avatar, Button, Card, Flex, Input, List, Typography } from "antd";
import { useState } from "react";

export default function ChatBox() {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello!", sender: "user" },
    { id: 2, text: "Hi there! How can I assist you today?", sender: "bot" },
    { id: 3, text: "Can you tell me today's weather?", sender: "user" },
    { id: 4, text: "Sure! It's sunny with a high of 28°C.", sender: "bot" },
    { id: 5, text: "That sounds great! What about tomorrow?", sender: "user" },
    {
      id: 6,
      text: "Tomorrow will be partly cloudy with a high of 26°C.",
      sender: "bot",
    },
    {
      id: 7,
      text: "Thanks! Do you know any good restaurants nearby?",
      sender: "user",
    },
    {
      id: 8,
      text: "Yes! There's a great Italian restaurant called 'Pasta Palace'.",
      sender: "bot",
    },
    { id: 9, text: "Nice! What dishes do they serve?", sender: "user" },
    {
      id: 10,
      text: "They serve a variety of pasta dishes, pizzas, and salads.",
      sender: "bot",
    },
    {
      id: 11,
      text: "Sounds delicious! Can I make a reservation online?",
      sender: "user",
    },
    {
      id: 12,
      text: "Yes, you can book a table through their website.",
      sender: "bot",
    },
    {
      id: 13,
      text: "Great! Also, can you suggest a good movie?",
      sender: "user",
    },
    {
      id: 14,
      text: "Sure! I recommend watching 'Interstellar'. It's a fantastic sci-fi movie.",
      sender: "bot",
    },
    {
      id: 15,
      text: "I’ve heard a lot about it! I’ll check it out.",
      sender: "user",
    },
    {
      id: 16,
      text: "Hope you enjoy it! Let me know what you think.",
      sender: "bot",
    },
    {
      id: 17,
      text: "By the way, do you know any fun weekend activities?",
      sender: "user",
    },
    {
      id: 18,
      text: "You can try hiking, visiting a museum, or going to a theme park.",
      sender: "bot",
    },
    {
      id: 19,
      text: "That sounds like fun! Thanks for the suggestions.",
      sender: "user",
    },
    {
      id: 20,
      text: "You're welcome! Let me know if you need anything else.",
      sender: "bot",
    },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      { id: messages.length + 1, text: input, sender: "user" },
    ]);
    setInput("");
  };

  return (
    <Flex
      vertical
      style={{
        height: "calc(100vh - 22rem)",
      }}
    >
      {/* Danh sách tin nhắn */}
      <Flex
        vertical
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "1rem",
          //   scrollbarWidth: "none",
        }}
      >
        <List
          itemLayout="vertical"
          dataSource={messages}
          renderItem={(msg) => (
            <Flex
              justify={msg.sender === "user" ? "end" : "start"}
              key={msg.id}
              align="center"
              style={{ marginTop: "1.6rem" }}
            >
              {msg.sender !== "user" && (
                <Avatar style={{ marginRight: "0.5rem" }}>B</Avatar>
              )}
              <Card
                size="small"
                style={{
                  background: msg.sender === "user" ? "#4096ff" : "#fff",
                  color: msg.sender === "user" ? "#fff" : "#000",
                }}
              >
                <Typography.Text
                  style={{
                    color: msg.sender === "user" ? "white" : "black",
                  }}
                >
                  {msg.text}
                </Typography.Text>
              </Card>
              {msg.sender === "user" && (
                <Avatar style={{ marginLeft: "0.5rem" }}>U</Avatar>
              )}
            </Flex>
          )}
        />
      </Flex>

      {/* Ô nhập tin nhắn */}
      <Flex gap="small" style={{ marginTop: "1.6rem" }}>
        <Input.TextArea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Nhập tin nhắn..."
        />
        <Button type="primary" onClick={sendMessage}>
          <SendOutlined />
        </Button>
      </Flex>
    </Flex>
  );
}
