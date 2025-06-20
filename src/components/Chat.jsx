import React, { useState, useEffect, useRef } from "react";
import { sendMessage, listenForMessages } from "../chatService";

export default function Chat({ currentUser, otherUserId }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!currentUser?.uid || !otherUserId) return;
    const unsubscribe = listenForMessages(currentUser.uid, otherUserId, setMessages);
    return () => unsubscribe();
  }, [currentUser, otherUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await sendMessage(currentUser.uid, otherUserId, text.trim());
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full border rounded w-full max-w-xl mx-auto bg-white">
      <div className="flex-1 overflow-y-auto p-4" style={{ minHeight: "300px" }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 flex ${msg.senderId === currentUser.uid ? "justify-end" : "justify-start"}`}
          >
            <span
              className={`inline-block px-3 py-2 rounded ${
                msg.senderId === currentUser.uid ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {msg.text}
            </span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="flex p-2 border-t">
        <input
          className="flex-1 border rounded px-2"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="הקלד הודעה..."
        />
        <button className="ml-2 px-4 py-2 bg-blue-500 text-white rounded" type="submit">
          שלח
        </button>
      </form>
    </div>
  );
}
