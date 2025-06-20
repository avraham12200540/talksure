// src/components/Register.js
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName: username });
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email,
        username
      });
    } catch (err) {
      setError("שגיאה בהרשמה: " + err.message);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h3>הרשמה</h3>
      <input type="text" placeholder="שם משתמש" value={username} onChange={e => setUsername(e.target.value)} required />
      <input type="email" placeholder="מייל" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">הרשם</button>
      {error && <div>{error}</div>}
    </form>
  );
}
