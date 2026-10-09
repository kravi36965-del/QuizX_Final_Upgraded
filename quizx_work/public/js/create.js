const socket = io();
function createRoom() {
  const quizName = document.getElementById("quizName").value.trim();
  const maxPlayers = Number(document.getElementById("maxPlayers").value);
  const durationMinutes = Number(document.getElementById("durationMinutes").value);
  document.getElementById("error").textContent = "";
  if (!quizName) return document.getElementById("error").textContent = "Please enter a quiz name.";
  if (!Number.isInteger(maxPlayers) || maxPlayers < 1 || maxPlayers > 50) return document.getElementById("error").textContent = "Participants must be between 1 and 50.";
  if (!Number.isInteger(durationMinutes) || durationMinutes < 5 || durationMinutes > 180) return document.getElementById("error").textContent = "Quiz time must be between 5 and 180 minutes.";
  sessionStorage.clear();
  socket.emit("createRoom", { quizName, maxPlayers, durationMinutes });
}
socket.on("roomCreated", room => {
  sessionStorage.setItem("room", JSON.stringify(room));
  sessionStorage.setItem("roomCode", room.code);
  sessionStorage.setItem("sessionToken", room.hostToken); localStorage.setItem("quizxHostToken", room.hostToken);
  sessionStorage.setItem("isHost", "true");
  location.href = "/lobby.html";
});
socket.on("roomError", msg => document.getElementById("error").textContent = msg);
