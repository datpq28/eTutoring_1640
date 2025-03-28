import React, { useEffect, useRef, useState } from "react";
import { Layout, Button } from "antd";
import Peer from "peerjs";
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";

const { Content } = Layout;

export default function MeetingPage() {
  const { meetingId } = useParams();
  const [peerId, setPeerId] = useState("");
  const [peers, setPeers] = useState({});
  const peer = useRef(null);
  const socket = useRef(io("http://localhost:5090"));
  const userStream = useRef(null);
  const videoRefs = useRef({});

  useEffect(() => {
    if (!meetingId) return;

    peer.current = new Peer();

    peer.current.on("open", (id) => {
      setPeerId(id);
      socket.current.emit("join_meeting", { meetingId, peerId: id });
    });

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userStream.current = stream;

      // Thêm video của chính mình vào danh sách
      setPeers((prev) => ({
        ...prev,
        [peer.current.id]: { stream },
      }));
    });

    socket.current.on("user_connected", ({ peerId }) => {
      console.log(`🔗 User connected: ${peerId}`);

      setPeers((prev) => ({
        ...prev,
        [peerId]: { stream: null },
      }));
    });

    peer.current.on("call", (call) => {
      console.log("📞 Incoming call from", call.peer);
      call.answer(userStream.current);

      call.on("stream", (remoteStream) => {
        console.log("🎥 Received remote stream from", call.peer);
        setPeers((prev) => ({
          ...prev,
          [call.peer]: { stream: remoteStream },
        }));
      });
    });

    return () => {
      peer.current.destroy();
      socket.current.disconnect();
    };
  }, [meetingId]);

  const startCall = () => {
    if (!userStream.current) return;

    Object.keys(peers).forEach((remotePeerId) => {
      if (remotePeerId !== peer.current.id) {
        console.log(`📞 Calling ${remotePeerId}`);
        const call = peer.current.call(remotePeerId, userStream.current);

        call.on("stream", (remoteStream) => {
          console.log(`🎥 Received remote stream from ${remotePeerId}`);
          setPeers((prev) => ({
            ...prev,
            [remotePeerId]: { stream: remoteStream },
          }));
        });
      }
    });
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Meeting Room: {meetingId || "Loading..."}</h2>
      <p>Your Peer ID: {peerId}</p>
      <Button onClick={startCall} type="primary">Start Call</Button>

      <div style={{ display: "flex", flexWrap: "wrap", marginTop: "20px" }}>
        {Object.entries(peers).map(([id, { stream }]) => (
          <video
            key={id}
            ref={(el) => {
              if (el && stream) {
                el.srcObject = stream;
              }
            }}
            autoPlay
            playsInline
            style={{ width: "30%", border: "1px solid black" }}
          />
        ))}
      </div>
    </Content>
  );
}
