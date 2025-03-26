import React, { useEffect, useRef, useState } from "react";
import { Layout, Button, Input, List } from "antd";
import Peer from "peerjs";
import { io } from "socket.io-client";

const { Content } = Layout;
const socket = io("http://localhost:5000");

export default function MeetingPage() {
  const [roomId, setRoomId] = useState("");
  const [peers, setPeers] = useState([]);
  const [peerId, setPeerId] = useState("");
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const peer = useRef(null);
  const localStream = useRef(null);
  const localVideoRef = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    socket.on("user-joined", ({ users }) => {
      setPeers(users);
      users.forEach((user) => {
        if (user.peerId !== peerId) {
          callUser(user.peerId);
        }
      });
    });

    socket.on("user-left", ({ users }) => {
      setPeers(users);
    });

    return () => {
      socket.disconnect();
      if (peer.current) peer.current.destroy();
    };
  }, [peerId]);

  const createRoom = async () => {
    if (!roomId) return alert("Nhập ID phòng trước!");
    setIsRoomCreated(true);

    // Lấy quyền truy cập camera/micro
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStream.current = stream;

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Khởi tạo PeerJS
      peer.current = new Peer();
      peer.current.on("open", (id) => {
        setPeerId(id);
        socket.emit("join-room", { roomId, peerId: id });

        peer.current.on("call", (incomingCall) => {
          incomingCall.answer(stream);
          incomingCall.on("stream", (remoteStream) => {
            addVideoStream(remoteStream, incomingCall.peer);
          });
        });
      });
    } catch (error) {
      console.error("Lỗi khi truy cập camera/micro:", error);
      alert("Vui lòng cho phép truy cập camera & micro.");
    }
  };

  const callUser = (remotePeerId) => {
    if (!localStream.current) return;
    const call = peer.current.call(remotePeerId, localStream.current);
    call.on("stream", (remoteStream) => {
      addVideoStream(remoteStream, remotePeerId);
    });
  };

  const addVideoStream = (stream, id) => {
    if (!videoRefs.current[id]) {
      videoRefs.current[id] = React.createRef();
    }
    setTimeout(() => {
      if (videoRefs.current[id].current) {
        videoRefs.current[id].current.srcObject = stream;
      }
    }, 500);
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Tutor Meeting Room</h2>
      <Input placeholder="Nhập ID phòng" onChange={(e) => setRoomId(e.target.value)} />
      <Button onClick={createRoom} type="primary" style={{ marginTop: "10px" }} disabled={isRoomCreated}>
        Tạo Phòng
      </Button>

      <h3 style={{ marginTop: "20px" }}>Video Call:</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginTop: "10px" }}>
        <video ref={localVideoRef} autoPlay playsInline muted style={{ width: "45%", border: "1px solid black" }} />
        {peers.map((user) => (
          <video key={user.peerId} ref={videoRefs.current[user.peerId]} autoPlay playsInline style={{ width: "45%", border: "1px solid black" }} />
        ))}
      </div>

      <h3 style={{ marginTop: "20px" }}>Người tham gia:</h3>
      <List
        bordered
        dataSource={peers}
        renderItem={(user) => <List.Item key={user.peerId}>{user.peerId}</List.Item>}
      />
    </Content>
  );
}
