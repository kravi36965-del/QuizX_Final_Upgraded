const socket = io();

function joinRoom() {
  const code = document.getElementById("roomCode").value.trim();
  const name = document.getElementById("playerName").value.trim();
  const language = document.getElementById("language").value;
  document.getElementById("error").textContent = "";

  if (!/^\d{6}$/.test(code)) return document.getElementById("error").textContent = "Enter the 6-digit room code.";
  if (!name) return document.getElementById("error").textContent = "Please enter your name.";

  sessionStorage.clear();
  sessionStorage.setItem("playerName", name);
  sessionStorage.setItem("language", language);
  socket.emit("joinRoom", { code, name, language });
}

socket.on("joinedRoom", room => {
  sessionStorage.setItem("room", JSON.stringify(room));
  sessionStorage.setItem("roomCode", room.code);
  sessionStorage.setItem("sessionToken", room.playerToken);
  sessionStorage.setItem("isHost", "false");
  location.href = "/lobby.html";
});
socket.on("roomError", msg => document.getElementById("error").textContent = msg);