let notify = document.getElementById("notify");
const note = document.createElement("p");
const socket = io();
socket.on("connect", () => {
  console.log("client connected!");
});
socket.on("addedToCart", (data) => {
  note.innerText = data.counter;
  console.log(data.counter);
  notify.appendChild(note);
});
