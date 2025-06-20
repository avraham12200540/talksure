import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, onSnapshot } from "firebase/firestore";

export default function ChatList({ user, onSelectChat }) {
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  // שליפת כל המשתמשים (חוץ מהמשתמש הנוכחי)
  useEffect(() => {
    async function fetchUsers() {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersArr = [];
      querySnapshot.forEach((doc) => {
        if (doc.id !== user.uid) {
          usersArr.push(doc.data());
        }
      });
      setUsers(usersArr);
    }
    fetchUsers();
  }, [user.uid]);

  // שליפת כל הצ'אטים של המשתמש
  useEffect(() => {
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setChats(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsubscribe();
  }, [user.uid]);

  // סינון משתמשים לפי חיפוש
  const filteredUsers = users.filter(
    (u) =>
      u.username && u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-64 border-r p-4">
      <h4 className="mb-2 font-bold">חפש משתמש</h4>
      <input
        type="text"
        placeholder="חפש לפי שם משתמש"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2 w-full border rounded px-2"
      />
      <ul>
        {filteredUsers.map(u => (
          <li
            key={u.uid}
            className="cursor-pointer p-2 hover:bg-gray-100 rounded"
            onClick={() => onSelectChat(u.uid)}
          >
            {u.username}
          </li>
        ))}
      </ul>
      <hr className="my-4" />
      <h4 className="mb-2 font-bold">השיחות שלי</h4>
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
