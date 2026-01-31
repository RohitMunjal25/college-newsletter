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
let chatMode="quick";

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
  const input=document.getElementById("chatInput");
  input.disabled=true;
  input.placeholder="Choose a quick option above"
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

  /* ===============================
     EMAIL MODE (NO GPT, NO IMAGE)
  =============================== */
  if (chatMode === "email") {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(msg)) {
      chatBox.innerHTML += `
        <div class="bot-msg">❌ Enter a valid email address</div>
      `;
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }

    chatBox.innerHTML += `<div class="user-msg">${msg}</div>`;

    chatBox.innerHTML += `
      <div class="bot-msg">
        ✅ <b>Subscribed successfully!</b><br>
        Use quick options below 👇
      </div>
    `;

    // RESET BACK TO QUICK MODE
    chatMode = "quick";
    input.value = "";
    input.disabled = true;
    input.type = "text";
    input.placeholder = "Choose a quick option below";

    showPredefinedQuestions();
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  /* ===============================
     NORMAL CHATBOT MODE (WITH IMAGE)
  =============================== */

  // USER MESSAGE
  chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${msg}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";

  // FETCH BOT RESPONSE
  const res = await fetch("https://chatbot-newsletter.onrender.com/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: msg })
  });

  const data = await res.json();

  // BOT MESSAGE (IMAGE + TEXT SUPPORT)
  let botHTML = `<div class="bot-msg"><b>Bot:</b><br>`;

  if (typeof data.reply === "object" && data.reply !== null) {

    if (data.reply.text) {
      botHTML += `<p>${data.reply.text}</p>`;
    }

    if (data.reply.image) {
      botHTML += `<img src="${data.reply.image}" class="chat-img" loading="lazy">`;
    }

  } else if (
    typeof data.reply === "string" &&
    data.reply.match(/\.(jpg|jpeg|png|gif|webp)$/i)
  ) {

    botHTML += `<img src="${data.reply}" class="chat-img" loading="lazy">`;

  } else {
    botHTML += data.reply;
  }

  botHTML += `</div>`;
  chatBox.innerHTML += botHTML;
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
      <button onclick="sendQuick('seminar and workshops')">seminar and workshops</button>
    </div>
  `;
}
function sendQuick(text) {

  // ⭐ SUBSCRIBE FLOW
  if (text.toLowerCase().includes("subscribe")) {

    chatMode = "email";

    const input = document.getElementById("chatInput");
    const chatBox = document.getElementById("chatMessages");

    input.disabled = false;
    input.type = "email";
    input.placeholder = "Enter your email to subscribe 📧";
    input.focus();

    chatBox.innerHTML += `
      <div class="bot-msg">
        ⭐ <b>Subscribe</b><br>
        Please enter your email address 👇
      </div>
    `;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  // NORMAL QUICK QUESTION
  document.getElementById("chatInput").value = text;
  sendChat();
}
const chatInput = document.getElementById("chatInput");

chatInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault();     // new line ruk jaaye
    if (!chatInput.disabled) {
      sendChat();           // SAME as Send button
    }
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
