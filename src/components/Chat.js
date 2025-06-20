// src/components/Chat.js
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
import { collection, query, orderBy, addDoc, onSnapshot } from "firebase/firestore";
import MessageInput from "./MessageInput";

export default function Chat({ chatId, user }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, "chats", chatId, "messages"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });
    return () => unsubscribe();
  }, [chatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section>
      <div className="messages">
        {messages.map((msg, i) => (
          <div key={i} className={msg.sender === user.uid ? "my-msg" : "other-msg"}>
            <span>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput chatId={chatId} user={user} />
    </section>
  );
}
