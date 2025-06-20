// src/components/Login.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      setError("שגיאה בכניסה: " + err.message);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h3>התחברות</h3>
      <input type="email" placeholder="מייל" value={email} onChange={e => setEmail(e.target.value)} required />
      <input type="password" placeholder="סיסמה" value={password} onChange={e => setPassword(e.target.value)} required />
      <button type="submit">התחבר</button>
      {error && <div>{error}</div>}
    </form>
  );
}
