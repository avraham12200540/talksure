// src/components/UserSearch.js
import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";

export default function UserSearch({ user }) {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const q = query(collection(db, "users"), where("username", "==", search));
    const snapshot = await getDocs(q);
    setResults(snapshot.docs.map(doc => doc.data()));
  };

  const handleStartChat = async (targetUser) => {
    // חפש אם כבר יש צ'אט
    const chatsRef = collection(db, "chats");
    const q = query(chatsRef, where("participants", "in", [[user.uid, targetUser.uid], [targetUser.uid, user.uid]]));
    const existing = await getDocs(q);
    if (existing.empty) {
      await addDoc(chatsRef, {
        participants: [user.uid, targetUser.uid],
        createdAt: new Date()
      });
    }
    setSearch("");
    setResults([]);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input placeholder="חפש משתמש" value={search} onChange={e => setSearch(e.target.value)} />
        <button type="submit">חפש</button>
      </form>
      <ul>
        {results.map(u => (
          <li key={u.uid}>
            {u.username} <button onClick={() => handleStartChat(u)}>התחל שיחה</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
