// src/App.js
import React, { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import ChatList from "./components/ChatList";
import Chat from "./components/Chat";
import { auth } from "./firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

function App() {
  const [user, setUser] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  if (!user)
    return (
      <div>
        <h1>TakeSure</h1>
        <Login />
        <Register />
      </div>
    );

  return (
    <div className="app-container">
      <header>
        <h2>TakeSure</h2>
        <button onClick={() => signOut(auth)}>התנתק</button>
      </header>
      <main style={{ display: "flex" }}>
        <ChatList user={user} onSelectChat={setSelectedChat} />
        {selectedChat && <Chat chatId={selectedChat} user={user} />}
      </main>
    </div>
  );
}

export default App;
