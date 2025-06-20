// src/Chat.js
import React, { useState, useEffect } from "react";
import { sendMessage, listenForMessages } from "./chatService";

export default function Chat({ currentUser, otherUser }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!currentUser?.uid || !otherUser?.uid) return;
    const unsubscribe = listenForMessages(currentUser.uid, otherUser.uid, setMessages);
    return () => unsubscribe();
  }, [currentUser, otherUser]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (text.trim()) {
      await sendMessage(currentUser.uid, otherUser.uid, text.trim());
      setText("");
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg) => (
          <div key={msg.id} className={`mb-2 ${msg.senderId === currentUser.uid ? "text-right" : "text-left"}`}>
            <span className="inline-block px-3 py-2 rounded bg-blue-200">{msg.text}</span>
          </div>
        ))}
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
