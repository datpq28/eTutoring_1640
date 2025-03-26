import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { Button, Layout } from "antd";
import Peer from "peerjs";
import io from "socket.io-client";

const { Content } = Layout;
const socket = io("http://localhost:5000");

export default function RoomMeetingPage() {
  const { meetingId } = useParams();
  const myVideoRef = useRef(null);
  const peer = useRef(null);
  const [peers, setPeers] = useState({});
  const [usersInRoom, setUsersInRoom] = useState([]);

  useEffect(() => {
    peer.current = new Peer();

    peer.current.on("open", (peerId) => {
      socket.emit("join-room", { meetingId, peerId });
    });

    peer.current.on("call", (call) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        call.answer(stream);
        call.on("stream", (userVideoStream) => {
          addVideoStream(userVideoStream);
        });
      });
    });

    socket.on("user-connected", (peerId) => {
      connectToNewUser(peerId);
    });

    return () => {
      socket.emit("leave-room", meetingId);
      peer.current.destroy();
    };
  }, [meetingId]);

  const connectToNewUser = (peerId) => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      const call = peer.current.call(peerId, stream);
      call.on("stream", (userVideoStream) => {
        addVideoStream(userVideoStream);
      });

      setPeers((prev) => ({ ...prev, [peerId]: call }));
    });
  };

  const addVideoStream = (stream) => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.autoplay = true;
    document.getElementById("video-grid").appendChild(video);
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Meeting Room</h2>
      <div id="video-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}></div>
      <Button type="primary" danger onClick={() => window.location.href = "/"}>
        Rời cuộc họp
      </Button>
    </Content>
  );
}
