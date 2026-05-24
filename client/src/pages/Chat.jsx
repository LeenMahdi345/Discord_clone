import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../Style/Chat.css";

const socket = io("http://localhost:5000", {
  auth: {
    token: localStorage.getItem("token"),
  },
});

function Chat() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [channel, setChannel] = useState("general");

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const token = localStorage.getItem("token");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!token) navigate("/");
  }, [token, navigate]);

  useEffect(() => {
    socket.emit("join_channel", channel);
  }, [channel]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${channel}`
        );
        setMessages(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchMessages();
  }, [channel]);

  useEffect(() => {
    const handleMessage = (data) => {
      if (data.channel === channel) {
        setMessages((prev) => [...prev, data]);
      }
    };

    socket.on("receive_message", handleMessage);

    return () => socket.off("receive_message", handleMessage);
  }, [channel]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("send_message", {
      user: user.username || "Anonymous",
      message,
      channel,
    });

    setMessage("");
  };

  const logout = () => {
    socket.disconnect();
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="chat-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <h2 className="logo">Discord Clone</h2>

        <button
          className={channel === "general" ? "active" : ""}
          onClick={() => setChannel("general")}
        >
          # general
        </button>

        <button
          className={channel === "gaming" ? "active" : ""}
          onClick={() => setChannel("gaming")}
        >
          # gaming
        </button>

        <button
          className={channel === "music" ? "active" : ""}
          onClick={() => setChannel("music")}
        >
          # music
        </button>
      </div>

      {/* CHAT */}
      <div className="chat-box">
        <div className="chat-header">
          <div>
            <h3># {channel}</h3>
            <p>Logged in as: {user.username}</p>
          </div>

          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="messages">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message-wrapper ${
                msg.user === user.username ? "my-message" : "other-message"
              }`}
            >
              <div className="message-card">
                <span className="message-user">{msg.user}</span>
                <div className="message-text">{msg.message}</div>
              </div>
            </div>
          ))}

          <div ref={messagesEndRef} />
        </div>

        <div className="input-area">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type message..."
          />

          <button onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;