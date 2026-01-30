/* ===============================
   CARD CAROUSEL (PHOTO STYLE)
================================ */

const cards = document.querySelectorAll(".card");
let current = 5;

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

/* ===============================
   CHATBOT (FOCUS + NORMAL MODE)
================================ */

let welcomeShown = false;

/* OPEN CHATBOT */
function openChatbot(mode = "normal") {
  const chat = document.getElementById("chatbot-container");
  const chatBox = document.getElementById("chatMessages");

  if (!chat || !chatBox) return;

  chat.style.display = "flex";

  if (mode === "focus") {
    chat.classList.add("focus-mode");
    document.body.classList.add("chatbot-focus");
  } else {
    chat.classList.remove("focus-mode");
    document.body.classList.remove("chatbot-focus");
  }

  // welcome message only once
  if (!welcomeShown) {
    chatBox.innerHTML += `
      <div class="bot-msg">
        👋 <b>Welcome!</b><br>
        Ask me something or choose a quick option below 👇
      </div>
    `;
    showPredefinedQuestions();
    welcomeShown = true;
  }
}

/* CLOSE CHATBOT */
function closeChatbot() {
  const chat = document.getElementById("chatbot-container");
  chat.style.display = "none";
  chat.classList.remove("focus-mode");
  document.body.classList.remove("chatbot-focus");
}

/* SEND CHAT */
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

/* QUICK QUESTIONS */
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

/* ENTER KEY = SEND */
const chatInput = document.getElementById("chatInput");
chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendChat();
  }
});
function openAboutCollege() {
  const overlay = document.getElementById("aboutOverlay");
  const loader = document.getElementById("aboutLoader");
  const content = document.getElementById("aboutContent");
  const video = document.getElementById("aboutVideo");

  overlay.style.display = "block";
  loader.style.display = "flex";
  content.style.display = "none";

  setTimeout(() => {
    loader.style.display = "none";
    content.style.display = "block";
    video.play();
  }, 2500); // loading time
}

function closeAbout() {
  const overlay = document.getElementById("aboutOverlay");
  const video = document.getElementById("aboutVideo");

  video.pause();
  video.currentTime = 0;
  overlay.style.display = "none";
}
