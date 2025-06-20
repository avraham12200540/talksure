// src/components/MessageInput.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export default function MessageInput({ chatId, user }) {
  const [text, setText] = useState("");

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      sender: user.uid,
      timestamp: serverTimestamp()
    });
    setText("");
  };

  return (
    <form onSubmit={handleSend}>
      <input value={text} onChange={e => setText(e.target.value)} placeholder="הקלד הודעה..." />
      <button type="submit">שלח</button>
    </form>
  );
}
