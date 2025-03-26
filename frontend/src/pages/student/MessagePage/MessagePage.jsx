import {
  LeftOutlined,
  UserOutlined,
  PlusOutlined,
  SendOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Card,
  Flex,
  Layout,
  Typography,
  Input,
  FloatButton,
  Button,
  Modal,
  List,
} from "antd";
import ChatBox from "../../../components/student/MessagePage/ChatBox/ChatBox";
import { useEffect, useState, useRef } from "react";
import {
  getConversations,
  getConversationById,
  getAllUser,
  createConversations,
  sendMessage,
} from "../../../../api_service/mesages_service";
import dayjs from "dayjs";
import io from "socket.io-client";

const { Title } = Typography;
const { Content } = Layout;
const { Search, TextArea } = Input;

export default function MessagePage() {
  const [cardWidth, setCardWidth] = useState("50rem");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]); // Lưu tin nhắn
  const [newMessage, setNewMessage] = useState(""); // Tin nhắn mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isAddConversationModalOpen, setIsAddConversationModalOpen] =
    useState(false); // Modal thêm cuộc trò chuyện
  const [selectedUser, setSelectedUser] = useState(null); // State cho user được chọn
  const [data, setData] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [socket, setSocket] = useState(null); // Socket state
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesContainerRef = useRef(null); // Tham chiếu đến container tin nhắn

  useEffect(() => {
    const fetchConversations = async () => {
      const userId = localStorage.getItem("userId");
      const userModel = localStorage.getItem("role");
      if (userId && userModel) {
        try {
          const data = await getConversations(userId, userModel);
          if (Array.isArray(data) && data.length > 0) {
            const updatedConversations = await Promise.all(
              data.map(async (conversation) => {
                const convoData = await getConversationById(conversation._id);
                const lastMessage =
                  convoData.messages.length > 0
                    ? convoData.messages[
                        convoData.messages.length - 1
                      ].contents.pop().content
                    : "No messages yet";

                const updatedParticipants = await Promise.all(
                  conversation.participants.map(async (participant) => {
                    const userDetails = await getUserDetails(
                      participant.participantId
                    );
                    return {
                      ...participant,
                      fullName: `${userDetails.firstname} ${userDetails.lastname}`,
                    };
                  })
                );

                return {
                  ...conversation,
                  lastMessage,
                  participants: updatedParticipants,
                };
              })
            );
            setConversations(updatedConversations);
            handleSelectConversation(updatedConversations[0]._id);
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

  const filteredData = conversations
    .filter((item) =>
      item.participants.some(
        (participant) =>
          participant.participantId !== localStorage.getItem("userId")
      )
    )
    .filter((item) => {
      return item.participants.some((participant) =>
        participant.fullName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

  useEffect(() => {
    const socketIo = io("http://localhost:5080");
    setSocket(socketIo);

    socketIo.on("receiveMessage", (message) => {
      if (selectedConversation === message.conversationId && !sendingMessage) {
        setMessages((prevMessages) => {
          // Check if the message already exists in the list
          if (
            !prevMessages.some(
              (msg) =>
                msg.content === message.content &&
                msg.timestamp === message.timestamp
            )
          ) {
            return [...prevMessages, message].sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            ); // Sort by timestamp
          }
          return prevMessages;
        });
      }
    });

    return () => {
      socketIo.disconnect();
    };
  }, [selectedConversation, sendingMessage]);

  const fetchData = async () => {
    try {
      const result = await getAllUser();
      if (
        result &&
        typeof result === "object" &&
        "students" in result &&
        Array.isArray(result.students) &&
        "tutors" in result &&
        Array.isArray(result.tutors)
      ) {
        setData(result);
      } else {
        console.error("Invalid data structure received from API:", result);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getUserDetails = async (participantId) => {
    try {
      const response = await getAllUser();
      const user = [...response.students, ...response.tutors].find(
        (u) => u._id === participantId
      );
      return user ? user : { firstname: "Unknown", lastname: "" };
    } catch (error) {
      console.error("Error fetching user details:", error);
      return { firstname: "Unknown", lastname: "" };
    }
  };

  const handleSelectConversation = async (conversationId) => {
    setSelectedConversation(conversationId);
    setCurrentConversationId(conversationId);
    try {
      const data = await getConversationById(conversationId);
      const formattedMessages = data.messages.flatMap((msg) =>
        msg.contents.map((content) => ({
          senderId: msg.senderId,
          content: content.content,
          timestamp: dayjs(content.timestamp).format("DD/MM/YYYY HH:mm"),
        }))
      );

      // Sắp xếp tin nhắn theo thời gian (cũ đến mới)
      setMessages(
        formattedMessages.sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        )
      );
    } catch (error) {
      console.error("Error loading conversation messages:", error);
    }
  };
  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;

    const userId = localStorage.getItem("userId");
    const senderModel = localStorage.getItem("role");

    const newMsg = {
      conversationId: currentConversationId,
      senderId: userId,
      senderModel: senderModel,
      content: newMessage,
      timestamp: dayjs().format("DD/MM/YYYY HH:mm"),
    };

    try {
      setSendingMessage(true);
      await sendMessage(
        newMsg.conversationId,
        newMsg.senderId,
        newMsg.senderModel,
        newMsg.content
      );
      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMsg].sort(
          (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
        );
        return updatedMessages;
      });
      setNewMessage(""); // Clear input
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setSendingMessage(false);
    }
  };

  const handleOpenUserModal = async () => {
    await fetchData();
    setIsAddConversationModalOpen(true);
  };

  const handleCreateConversation = async (
    selectedUserId,
    selectedUserModel
  ) => {
    try {
      const userId = localStorage.getItem("userId");
      const userModel = localStorage.getItem("role");

      const participants = [
        { participantId: userId, participantModel: userModel },
        { participantId: selectedUserId, participantModel: selectedUserModel },
      ];

      await createConversations(participants);
      setIsAddConversationModalOpen(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const userId = localStorage.getItem("userId");

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Content style={stylesInline.content}>
      <Flex gap="middle">
        {/* Danh sách cuộc trò chuyện */}
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
              {filteredData.map((item, index) => {
                const otherParticipant = item.participants.find(
                  (participant) => participant.participantId !== userId
                );
                const lastMessage = item.lastMessage || "No messages yet";
                return (
                  <Card
                    key={item._id || index}
                    style={{
                      cursor: "pointer",
                      border: "none",
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                    size="small"
                    hoverable
                    onClick={() => handleSelectConversation(item._id)}
                  >
                    <Card.Meta
                      avatar={
                        <Avatar
                          src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${otherParticipant.participantId}`}
                        />
                      }
                      title={<a href="#">{otherParticipant.fullName}</a>}
                      description={lastMessage}
                    />
                  </Card>
                );
              })}
            </Flex>
          </div>
          {/* Nút mở modal để chọn người trò chuyện */}
          <FloatButton
            icon={<PlusOutlined />}
            type="primary"
            style={{ position: "absolute", right: 24, bottom: 24 }}
            onClick={handleOpenUserModal}
          />
        </Card>

        {/* Khung chat */}
        <Card style={{ flex: 1 }} title={<TitleMessage />}>
          <div
            style={{ height: "65vh", overflowY: "auto", padding: "1rem" }}
            ref={messagesContainerRef}
          >
            {messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages.map((msg, index) => (
                <Flex
                  key={index}
                  align="center"
                  justify={msg.senderId === userId ? "end" : "start"} // Thay đổi vị trí căn của người gửi và người nhận
                  style={{ marginTop: "1.6rem" }}
                >
                  {msg.senderId !== userId && (
                    <Avatar style={{ marginRight: "0.5rem" }}>
                      {msg.senderId.charAt(0).toUpperCase()}
                    </Avatar>
                  )}

                  <Card
                    size="small"
                    style={{
                      background: msg.senderId === userId ? "#4096ff" : "#fff",
                      color: msg.senderId === userId ? "#fff" : "#000",
                    }}
                  >
                    <Typography.Text
                      style={{
                        color: msg.senderId === userId ? "white" : "black",
                      }}
                    >
                      {msg.content}
                    </Typography.Text>
                  </Card>
                  {msg.senderId === userId && (
                    <Avatar style={{ marginLeft: "0.5rem" }}>U</Avatar>
                  )}
                </Flex>
              ))
            )}
          </div>

          {/* Ô nhập tin nhắn và nút gửi */}
          <Flex gap="small" align="center" style={{ marginTop: "1rem" }}>
            <TextArea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
            <Button
              type="primary"
              icon={<SendOutlined />}
              onClick={handleSendMessage}
            />
          </Flex>
        </Card>
      </Flex>

      {/* Modal chọn user */}
      <Modal
        title="Select User to Start Conversation"
        visible={isAddConversationModalOpen}
        onCancel={() => setIsAddConversationModalOpen(false)}
        onOk={handleCreateConversation}
      >
        {data ? (
          <>
            <Title level={5}>Students</Title>
            <List
              dataSource={data.students}
              renderItem={(student) => (
                <List.Item
                  onClick={() =>
                    handleCreateConversation(student._id, "student")
                  }
                >
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${student._id}`}
                    style={{ marginRight: "10px" }}
                  />
                  {`${student.firstname} ${student.lastname}`}
                </List.Item>
              )}
            />
            <List
              dataSource={data.tutors}
              renderItem={(tutor) => (
                <List.Item
                  onClick={() => handleCreateConversation(tutor._id, "tutor")}
                >
                  <Avatar
                    src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${tutor._id}`}
                    style={{ marginRight: "10px" }}
                  />
                  {`${tutor.firstname} ${tutor.lastname}`}
                </List.Item>
              )}
            />
          </>
        ) : (
          <p>Loading users...</p>
        )}
      </Modal>
    </Content>
  );
}

function TitleMessage() {
  return (
    <Flex gap="small" align="center">
      <Avatar size="default" icon={<UserOutlined />} />
      <Title level={5}>Chat</Title>
    </Flex>
  );
}

const stylesInline = {
  content: {
    padding: "1rem",
  },
};
