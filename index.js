import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

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

// Generate 4-digit code
function generateRoomCode() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

// Show modal
document.getElementById("addGameBtn").addEventListener("click", () => {
  document.getElementById("addGameModal").style.display = "block";
});

// Close modal
window.closeModal = () => {
  document.getElementById("addGameModal").style.display = "none";
};

// Submit form
document.getElementById("gameForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const playersInput = document.getElementById("playersInput").value.trim();
  const amountInput = parseInt(document.getElementById("amountInput").value);

  if (!playersInput || isNaN(amountInput)) {
    alert("Please enter valid inputs.");
    return;
  }

  const players = playersInput
    .split(",")
    .map(p => p.trim())
    .filter(p => p !== "");

  let roomCode = generateRoomCode();

  try {
    // Optional: check if room code exists already (skip for now)
    await setDoc(doc(db, "games", roomCode), {
      createdAt: new Date(),
      players: players,
      amount: amountInput
    });

    window.location.href = `admin-board.html?room=${roomCode}`;


  } catch (err) {
    alert("Error creating game: " + err.message);
  }
});
