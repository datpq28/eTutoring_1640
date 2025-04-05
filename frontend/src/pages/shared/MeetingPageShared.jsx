import React, { useEffect, useRef, useState } from "react";
import { Layout, Button, List, Input,Space } from "antd";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const { Content } = Layout;

export default function MeetingPageShared() {
  const { meetingId } = useParams(); // Get meetingId from the URL
  const [peers, setPeers] = useState({});
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");

  const socket = useRef(io("http://localhost:5090")); // Connect to the Socket.IO server
  const localStream = useRef(null);
  const peerConnections = useRef({}); // Store WebRTC peer connections
  const videoRefs = useRef({}); // Store video elements for each peer
  const [socketId, setSocketId] = useState(null);

  useEffect(() => {
    if (!meetingId) return;

    // Get user media (camera and microphone)
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      localStream.current = stream;

      // Display the local video stream
      setPeers((prev) => ({
        ...prev,
        local: { stream },
      }));

      const userId = localStorage.getItem("userId");
      const role = localStorage.getItem("role");
    
      if (userId && role) {
        socket.emit("register_user", { userId, role });
        console.log("Socket registered:", userId);
      }

      // Join the meeting room
      socket.current.emit("join_room", { meetingId });

      // Listen for the 'connect' event to get the socket ID
      socket.current.on("connect", () => {
        setSocketId(socket.current.id); // Store the socket ID in state
        console.log("🔗 Connected to Socket.IO server with ID:", socket.current.id);
      });

      // Handle new user joining the room
      socket.current.on("user_joined", ({ userId }) => {
        console.log(`🔗 User joined: ${userId}`);
        createPeerConnection(userId, true);
      });

      // Handle receiving an offer
      socket.current.on("offer", async ({ userId, offer }) => {
        console.log(`📩 Received offer from ${userId}`);
        const peerConnection = createPeerConnection(userId, false);
        await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await peerConnection.createAnswer();
        await peerConnection.setLocalDescription(answer);
        socket.current.emit("answer", { userId, answer });
      });

      // Handle receiving an answer
      socket.current.on("answer", async ({ userId, answer }) => {
        console.log(`📩 Received answer from ${userId}`);
        const peerConnection = peerConnections.current[userId];
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
      });

      // Handle receiving ICE candidates
      socket.current.on("ice_candidate", ({ userId, candidate }) => {
        console.log(`📩 Received ICE candidate from ${userId}`);
        const peerConnection = peerConnections.current[userId];
        if (peerConnection) {
          peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      // Handle user leaving the room
      socket.current.on("user_left", ({ userId }) => {
        console.log(`❌ User left: ${userId}`);
        if (peerConnections.current[userId]) {
          peerConnections.current[userId].close();
          delete peerConnections.current[userId];
        }
        setPeers((prev) => {
          const updatedPeers = { ...prev };
          delete updatedPeers[userId];
          return updatedPeers;
        });
      });

       // Handle disconnection
  socket.current.on("disconnect", () => {
    console.log("❌ Disconnected from Socket.IO server");
    setSocketId(null); // Reset the socket ID on disconnect
  });
    });

    return () => {
      // Cleanup on component unmount
      socket.current.emit("leave_room", { meetingId });
      Object.values(peerConnections.current).forEach((peerConnection) => peerConnection.close());
      socket.current.disconnect();
      socket.current.off("connect");
      socket.current.off("disconnect");
    };
  }, [meetingId]);

  useEffect(() => {
    console.log("Current socketId:", socket.current);
  }, [socketId]);

  const createPeerConnection = (userId, isInitiator) => {
    const peerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
  
    // Add local stream tracks to the peer connection
    localStream.current.getTracks().forEach((track) => {
      peerConnection.addTrack(track, localStream.current);
    });
  
    // Handle receiving remote streams
    peerConnection.ontrack = (event) => {
      console.log(`🎥 Received remote stream from ${userId}`);
      setPeers((prev) => ({
        ...prev,
        [userId]: { stream: event.streams[0] },
      }));
    };
  
    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("ice_candidate", { userId, candidate: event.candidate });
      }
    };
  
    peerConnections.current[userId] = peerConnection;
  
    if (isInitiator) {
      peerConnection.createOffer().then((offer) => {
        peerConnection.setLocalDescription(offer);
        socket.current.emit("offer", { userId, offer });
      });
    }
  
    return peerConnection;
  };

  const sendMessage = () => {
    if (messageInput.trim() === "") return;
    const socketId = socket.current.id; // Get the socket ID from the current socket instance
    console.log("Current socket ID:", socketId); // Log the socket ID for debugging
  
    if (!socketId) {
      console.error("❌ Socket ID is not available yet.");
      return;
    }
  
    const messageData = {
      meetingId, // Include the meetingId
      sender: socketId, // Use the socket ID as the sender
      text: messageInput,
    };
  
    console.log("📤 Sending message:", messageData);
  
    // Emit the message to the backend
    socket.current.emit("send_message", messageData);
  
    // Add the message to the local chat
    setMessages((prev) => [
      ...prev,
      { sender: "You", text: messageInput, createdAt: new Date() },
    ]);
    setMessageInput("");
  };
  
  useEffect(() => {
    // Handle real-time chat messages
    socket.current.on("receive_message", ({ sender, text }) => {
      console.log(`📩 Received message from ${sender}: ${text}`);
      setMessages((prev) => [...prev, { sender, text }]);
    });
  
    return () => {
      socket.current.off("receive_message");
    };
  }, []);

  
  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Meeting Room: {meetingId || "Loading..."}</h2>

      {/* Video Streams */}
      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {Object.entries(peers).map(([id, { stream }]) => (
          <video
            key={id}
            ref={(el) => {
              if (el && stream && el.srcObject !== stream) {
                el.srcObject = stream;
              }
            }}
            autoPlay
            playsInline
            style={{ width: "30%", border: "1px solid black", margin: "10px" }}
          />
        ))}
      </div>

      {/* Chat Box */}
      <div style={{ flex: 1, border: "1px solid #ddd", padding: "10px", borderRadius: "5px", marginTop: "20px" }}>
        <h3>Chat</h3>
        <List
          size="small"
          bordered
          dataSource={messages}
          renderItem={(item) => (
            <List.Item>
              <strong>{item.sender}:</strong> {item.text}
            </List.Item>
          )}
          style={{ height: "300px", overflowY: "auto" }}
        />
        <Space.Compact style={{ width: "100%" }}>
          <Input
            style={{ width: "80%" }}
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="primary" onClick={sendMessage}>
            Send
          </Button>
        </Space.Compact>
      </div>
    </Content>
  );
}