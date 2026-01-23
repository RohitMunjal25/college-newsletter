const items = document.querySelectorAll('.item');
const total = items.length;
const radius = 190;
let currentStep = 0;

function updatePositions() {
  items.forEach((item, index) => {
    const angleDeg = (360 / total) * (index - currentStep) - 90;
    const angleRad = angleDeg * (Math.PI / 180);

    const x = Math.cos(angleRad) * radius;
    const y = Math.sin(angleRad) * radius;

    item.style.transform = `
      translate(-50%, -50%)
      translate(${x}px, ${y}px)
    `;

    item.classList.remove('active');
  });

  items[currentStep].classList.add('active');
}

updatePositions();
setInterval(() => {
  currentStep = (currentStep + 1) % total;
  updatePositions();
}, 3500);


let welcomeShown = false;

window.toggleChatbot = function () {
  const chat = document.getElementById("chatbot-container");
  const chatBox = document.getElementById("chatMessages");

  if (!chat || !chatBox) {
    console.error("Chatbot elements not found");
    return;
  }

  
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
//////////////////////////////////////////////////////////////////////////////////////
function showPredefinedQuestions() {
  const chatBox = document.getElementById("chatMessages");

  chatBox.innerHTML += `
    <div class="quick-questions">
      <button onclick="sendQuick('Where can I download the newsletter?')">
        📄 Download newsletter
      </button>
      <button onclick="sendQuick('What is this newsletter about?')">
        ℹ️ About newsletter
      </button>
      <button onclick="sendQuick('Who should I contact for more info?')">
        📞 Contact details
      </button>
      <button onclick="sendQuick('What departments are covered in this newsletter?')">
        🏫 Departments
      </button>
      <button onCLick="sendQuick('How to subscribe')">Subscribe for newsletter</button>
    </div>
  `;
}

function sendQuick(text) {
  const input = document.getElementById("chatInput");
  input.value = text;
  sendChat();
}
