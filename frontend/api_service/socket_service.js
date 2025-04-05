import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5090";  // Đổi URL tùy theo môi trường backend
const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

export default socket;
