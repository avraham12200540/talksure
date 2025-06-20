import React, { useEffect, useState } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

export default function ChatList({ user, onSelectChat }) {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

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

  const filteredUsers = users.filter(
    (u) =>
      u.username && u.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <aside className="w-64 border-r p-4">
      <h4 className="mb-2 font-bold">משתמשים</h4>
      <input
        type="text"
        placeholder="חפש לפי שם משתמש"
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-2 w-full border rounded px-2"
      />
      <ul>
        {filteredUsers.length === 0 && <li>לא נמצאו משתמשים</li>}
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
    </aside>
  );
}
