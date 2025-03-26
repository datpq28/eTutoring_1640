import React, { useEffect, useRef, useState } from "react";
import { Layout, Button, Input } from "antd";
import Peer from "peerjs";

const { Content } = Layout;

export default function MeetingPage() {
  const [peerId, setPeerId] = useState("");
  const [remotePeerId, setRemotePeerId] = useState("");
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);
  const userVideoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    const newPeer = new Peer(); // Khởi tạo PeerJS
    newPeer.on("open", (id) => {
      setPeerId(id);
    });

    newPeer.on("call", (incomingCall) => {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
        userVideoRef.current.srcObject = stream;
        incomingCall.answer(stream);
        incomingCall.on("stream", (remoteStream) => {
          remoteVideoRef.current.srcObject = remoteStream;
        });
      });
      setCall(incomingCall);
    });

    setPeer(newPeer);
  }, []);

  const startCall = () => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
      userVideoRef.current.srcObject = stream;
      const outgoingCall = peer.call(remotePeerId, stream);
      outgoingCall.on("stream", (remoteStream) => {
        remoteVideoRef.current.srcObject = remoteStream;
      });
      setCall(outgoingCall);
    });
  };

  return (
    <Content style={{ padding: "2rem" }}>
      <h2>Meeting Room</h2>
      <p>Your Peer ID: {peerId}</p>
      <Input
        placeholder="Enter Remote Peer ID"
        onChange={(e) => setRemotePeerId(e.target.value)}
        style={{ marginBottom: "10px" }}
      />
      <Button onClick={startCall} type="primary">
        Start Call
      </Button>
      <div style={{ display: "flex", marginTop: "20px" }}>
        <video ref={userVideoRef} autoPlay playsInline style={{ width: "45%", border: "1px solid black" }} />
        <video ref={remoteVideoRef} autoPlay playsInline style={{ width: "45%", border: "1px solid black" }} />
      </div>
    </Content>
  );
}
