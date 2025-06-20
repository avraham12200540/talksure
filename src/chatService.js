import { collection, addDoc, serverTimestamp, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebase";

// שליחת הודעה
export async function sendMessage(senderId, receiverId, text) {
  await addDoc(collection(db, "messages"), {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
  });
}

// האזנה להודעות בין שני משתמשים
export function listenForMessages(currentUserId, otherUserId, callback) {
  const q = query(
    collection(db, "messages"),
    where("senderId", "in", [currentUserId, otherUserId]),
    where("receiverId", "in", [currentUserId, otherUserId]),
    orderBy("timestamp")
  );
  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(
        msg =>
          (msg.senderId === currentUserId && msg.receiverId === otherUserId) ||
          (msg.senderId === otherUserId && msg.receiverId === currentUserId)
      );
    callback(messages);
  });
}
