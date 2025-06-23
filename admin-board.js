import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Config
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

// Room code from URL
const roomCode = new URLSearchParams(window.location.search).get("room");
document.getElementById("roomCode").textContent = roomCode;

let gamePlayers = [];
let amount = 0;
let debtMap = {}; // key: "A-B", value: number
let roundCount = 0;
let historyStack = []; // Store undo data

async function loadGameData() {
  const gameRef = doc(db, "games", roomCode);
  const gameSnap = await getDoc(gameRef);

  if (gameSnap.exists()) {
    const gameData = gameSnap.data();
    const playersContainer = document.getElementById("playersList");
    playersContainer.innerHTML = "";

    gamePlayers = gameData.players;
    amount = parseInt(gameData.amount);
    document.getElementById("amountPerPlayer").textContent = amount;

    // Player buttons
    gamePlayers.forEach(player => {
      const btn = document.createElement("button");
      btn.textContent = player;
      btn.classList.add("player-button");

      btn.addEventListener("click", () => {
        const confirmed = confirm(`Confirm ${player} is the winner?`);
        if (confirmed) {
          updateDebt(player, true);
          addToHistory(player);
        }
      });

      playersContainer.appendChild(btn);
    });

    // Debt Table
    generateDebtTable(gamePlayers);
  } else {
    document.getElementById("playersList").textContent = "Not found";
    document.getElementById("amountPerPlayer").textContent = "--";
  }
}

function generateDebtTable(players) {
  const tableBody = document.querySelector("#debtTable tbody");
  tableBody.innerHTML = "";
  debtMap = {};

  for (let i = 0; i < players.length; i++) {
    for (let j = i + 1; j < players.length; j++) {
      const a = players[i];
      const b = players[j];
      const key = `${a}-${b}`;
      debtMap[key] = 0;

      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${a}</td>
        <td>${b}</td>
        <td id="debt-${key}">0</td>
      `;
      tableBody.appendChild(row);
    }
  }
}

function updateDebt(winner, isForward = true) {
  const roundChanges = [];

  gamePlayers.forEach(player => {
    if (player === winner) return;

    const keyAB = `${winner}-${player}`;
    const keyBA = `${player}-${winner}`;
    let actualKey = "";

    if (debtMap.hasOwnProperty(keyAB)) {
      actualKey = keyAB;
      debtMap[keyAB] += isForward ? amount : -amount;
    } else if (debtMap.hasOwnProperty(keyBA)) {
      actualKey = keyBA;
      debtMap[keyBA] += isForward ? -amount : amount;
    }

    if (actualKey) {
      roundChanges.push({ key: actualKey, change: isForward ? amount : -amount });
      document.getElementById(`debt-${actualKey}`).textContent = debtMap[actualKey];
    }
  });

  if (isForward) {
    historyStack.push({ winner, changes: roundChanges });
  }
}

function addToHistory(winner) {
  roundCount++;
  const tableBody = document.querySelector("#historyTable tbody");

  const fromPlayers = gamePlayers.filter(p => p !== winner).join(", ");
  const totalEarned = (gamePlayers.length - 1) * amount;

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${roundCount}</td>
    <td>${winner}</td>
    <td>${fromPlayers}</td>
    <td>₹${amount}</td>
    <td>₹${totalEarned}</td>
  `;

  tableBody.appendChild(row);
}

// Undo Function
function undoLastRound() {
  if (historyStack.length === 0) {
    alert("No round to undo.");
    return;
  }

  const last = historyStack.pop();
  updateDebt(last.winner, false);

  // Remove last history row
  const tableBody = document.querySelector("#historyTable tbody");
  tableBody.deleteRow(tableBody.rows.length - 1);

  roundCount--;
}

document.getElementById("undoBtn").addEventListener("click", undoLastRound);

loadGameData();
