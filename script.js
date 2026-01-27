/* ===============================
   CARD CAROUSEL (PHOTO STYLE)
================================ */

const cards = document.querySelectorAll(".card");
let current = 0;

function updateCards() {
  cards.forEach((card, i) => {
    card.className = "card";

    const diff = i - current;

    if (diff === 0) card.classList.add("active");
    else if (diff === -1) card.classList.add("left");
    else if (diff === 1) card.classList.add("right");
    else if (diff === -2) card.classList.add("far-left");
    else if (diff === 2) card.classList.add("far-right");
  });
}

updateCards();

setInterval(() => {
  current = (current + 1) % cards.length;
  updateCards();
},5000);


/* ===============================
   CHATBOT (UNCHANGED)
================================ */

let welcomeShown = false;

window.toggleChatbot = function () {
  const chat = document.getElementById("chatbot-container");
  const chatBox = document.getElementById("chatMessages");

  if (!chat || !chatBox) return;

  chat.style.display = chat.style.display === "flex" ? "none" : "flex";

  if (chat.style.display === "flex" && !welcomeShown) {
    chatBox.innerHTML += `
      <div class="bot-msg">
        👋 <b>Welcome!</b><br>
        Ask me something or choose a quick option below 👇
      </div>
    `;
    showPredefinedQuestions();
    welcomeShown = true;
  }
};

async function sendChat() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML += `<div><b>You:</b> ${msg}</div>`;
  input.value = "";

  const res = await fetch("https://chatbot-newsletter.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();
  chatBox.innerHTML += `<div><b>Bot:</b> ${data.reply}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showPredefinedQuestions() {
  const chatBox = document.getElementById("chatMessages");

  chatBox.innerHTML += `
    <div class="quick-questions">
      <button onclick="sendQuick('download free newsletter')">📄 Download newsletter</button>
      <button onclick="sendQuick('What is this newsletter about?')">ℹ️ About newsletter</button>
      <button onclick="sendQuick('Who should I contact for more info?')">📞 Contact details</button>
      <button onclick="sendQuick('What departments are covered?')">🏫 Departments</button>
      <button onclick="sendQuick('How to subscribe')">⭐ Subscribe</button>
    </div>
  `;
}

function sendQuick(text) {
  document.getElementById("chatInput").value = text;
  sendChat();
}
const chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();   
    sendChat();           
  }
});
const enterBtn = document.querySelector(".enter-btn");
const overlay = document.getElementById("welcome-overlay");

enterBtn.addEventListener("click", () => {
  // show black screen
  overlay.classList.add("active");

  // after 2.5 sec, hide overlay & start newsletter
  setTimeout(() => {
    overlay.classList.remove("active");

    // yahan future me tu
    // window.location = "newsletter.html";
    // ya start animation
    console.log("Newsletter started");
  }, 2500);
});
