import { LeftOutlined, UserOutlined, PlusOutlined, SendOutlined } from "@ant-design/icons";
import { Avatar, Card, Flex, Layout, Typography, Input, FloatButton, Button, Modal, List } from "antd";
import ChatBox from "../../../components/student/MessagePage/ChatBox/ChatBox";
import { useEffect, useState } from "react";
import { getConversations, getConversationById, getAllUser, createConversations} from "../../../../api_service/mesages_service";
import dayjs from "dayjs";

const { Title } = Typography;
const { Content } = Layout;
const { Search, TextArea } = Input;

export default function MessagePage() {
  const [cardWidth, setCardWidth] = useState("50rem");
  const [searchTerm, setSearchTerm] = useState("");
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState(""); // State lưu tin nhắn mới
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [isAddConversationModalOpen, setIsAddConversationModalOpen] = useState(false); // Modal state
  const [selectedUser, setSelectedUser] = useState(null); // State cho user được chọn
  const [data, setData] = useState(null);


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
                const lastMessage = convoData.messages.length > 0
                  ? convoData.messages[convoData.messages.length - 1].contents.pop().content
                  : "No messages yet";
    
                // Add participant names based on participantId
                const updatedParticipants = await Promise.all(
                  conversation.participants.map(async (participant) => {
                    const userDetails = await getUserDetails(participant.participantId);  // Query user details by participantId
                    return {
                      ...participant,
                      fullName: `${userDetails.firstname} ${userDetails.lastname}`,  // Add fullName to participant
                    };
                  })
                );
    
                return { ...conversation, lastMessage, participants: updatedParticipants };
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
    item.participants.some(participant => participant.participantId !== localStorage.getItem("userId"))
  );

  const fetchData = async () => {
    try {
      const result = await getAllUser(); // Bỏ response.json()
      
      // In ra để kiểm tra
      console.log('Fetched data:', result);
  
      if (
        result && typeof result === 'object' &&
        'students' in result && Array.isArray(result.students) &&
        'tutors' in result && Array.isArray(result.tutors)
      ) {
        setData(result);
        console.log('Data fetched successfully:', result);
      } else {
        console.error('Invalid data structure received from API:', result);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  
  // Function to fetch user details by participantId
const getUserDetails = async (participantId) => {
  try {
    const response = await getAllUser(); // Assuming this API fetches all users
    const user = [...response.students, ...response.tutors].find(u => u._id === participantId);
    if (user) {
      return user;
    } else {
      console.error('User not found for participantId:', participantId);
      return { firstname: 'Unknown', lastname: '' };
    }
  } catch (error) {
    console.error('Error fetching user details:', error);
    return { firstname: 'Unknown', lastname: '' };
  }
};

  
  
  const handleSelectConversation = async (conversationId) => {
    setSelectedConversation(conversationId);
    try {
      const data = await getConversationById(conversationId);
      const formattedMessages = data.messages.flatMap(msg =>
        msg.contents.map(content => ({
          senderId: msg.senderId,
          content: content.content,
          timestamp: dayjs(content.timestamp).format('DD/MM/YYYY HH:mm')
        }))
      );
      setMessages(formattedMessages);
    } catch (error) {
      console.error("Error loading conversation messages:", error);
    }
  };

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    const userId = localStorage.getItem("userId");

    const newMsg = {
      senderId: userId,
      content: newMessage,
      timestamp: dayjs().format('DD/MM/YYYY HH:mm')
    };

    // Thêm tin nhắn mới vào danh sách
    setMessages([...messages, newMsg]);
    setNewMessage(""); // Xóa ô nhập sau khi gửi
  };

  const handleOpenUserModal = async () => {
    await fetchData(); // Gọi fetchData để lấy dữ liệu từ API
    setIsAddConversationModalOpen(true); // Mở modal sau khi lấy dữ liệu
  };
  

  const handleCreateConversation = async (selectedUserId, selectedUserModel) => {
    try {
      const userId = localStorage.getItem("userId");
      const userModel = localStorage.getItem("role");
  
      if (!userId || !userModel) {
        alert("User not found!");
        return;
      }
  
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
              {filteredData.map((item, index) => {
                const otherParticipant = item.participants.find(participant => participant.participantId !== userId);        
                const lastMessage = item.lastMessage || "No messages yet";
                return (
                  <Card
                    style={{
                      cursor: "pointer",
                      border: "none",
                      marginLeft: "0.5rem",
                      marginRight: "0.5rem",
                    }}
                    size="small"
                    hoverable
                    key={item._id || index}
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
        </Card>

        {/* Khung chat */}
        <Card style={{ flex: 1 }} title={<TitleMessage />}>
          <div style={{ height: "60vh", overflowY: "auto", padding: "1rem" }}>
            {messages.length === 0 ? (
              <p>No messages yet</p>
            ) : (
              messages.map((msg, index) => (
                <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "1rem", justifyContent: msg.senderId === userId ? "flex-end" : "flex-start" }}>
                  {msg.senderId !== userId && (
                    <Avatar style={{ marginRight: "0.5rem" }}>{msg.senderId.charAt(0).toUpperCase()}</Avatar>
                  )}
                  <div>
                    <Typography.Text style={{ display: "block", fontWeight: "bold" }}>{msg.senderId}</Typography.Text>
                    <div style={{ maxWidth: "60%", padding: "0.5rem 1rem", borderRadius: "10px", background: msg.senderId === userId ? "#dcf8c6" : "#ffffff", boxShadow: "0 1px 1px rgba(0,0,0,0.2)" }}>
                      <Typography.Text>{msg.content}</Typography.Text>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <FloatButton
  icon={<PlusOutlined />}
  type="primary"
  style={{ right: 1200, bottom: 35 }}
  onClick={() => handleOpenUserModal()}
/>


          {/* Ô nhập tin nhắn và nút gửi */}
          <Flex gap="small" align="center" style={{ marginTop: "1rem" }}>
            <TextArea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message..."
              autoSize={{ minRows: 1, maxRows: 4 }}
            />
            <Button type="primary" icon={<SendOutlined />} onClick={handleSendMessage} />
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
    <List.Item onClick={() => handleCreateConversation(student._id, "student")}>
      <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${student._id}`} style={{ marginRight: "10px" }} />
      {`${student.firstname} ${student.lastname}`}
    </List.Item>
  )}
/>

<List
  dataSource={data.tutors}
  renderItem={(tutor) => (
    <List.Item onClick={() => handleCreateConversation(tutor._id, "tutor")}>
      <Avatar src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${tutor._id}`} style={{ marginRight: "10px" }} />
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
