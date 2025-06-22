import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBF6C85P7K-kqPmc5KrxK0X1wrIAxzbV-M",
  authDomain: "pk-card-website.firebaseapp.com",
  projectId: "pk-card-website",
  storageBucket: "pk-card-website.appspot.com",
  messagingSenderId: "1099269510878",
  appId: "1:1099269510878:web:71db82bd0b05fe8db1144f"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get room code from URL
const roomCode = new URLSearchParams(window.location.search).get("room");
document.getElementById("roomCode").textContent = roomCode;

async function loadGameData() {
  const gameRef = doc(db, "games", roomCode);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    const gameData = gameSnap.data();
    document.getElementById("playersList").textContent = gameData.players.join(", ");
    document.getElementById("amountPerPlayer").textContent = gameData.amount;
  } else {
    document.getElementById("playersList").textContent = "Not found";
    document.getElementById("amountPerPlayer").textContent = "--";
  }
}

loadGameData();
