// src/components/ChatList.js
import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, onSnapshot } from "firebase/firestore";
import UserSearch from "./UserSearch";

export default function ChatList({ user, onSelectChat }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user.uid]);

  return (
    <aside>
      <UserSearch user={user} />
      <h4>השיחות שלי</h4>
      <ul>
        {chats.map(chat => (
          <li key={chat.id} onClick={() => onSelectChat(chat.id)}>
            {chat.participants.filter(uid => uid !== user.uid).join(", ")}
          </li>
        ))}
      </ul>
    </aside>
  );
}
