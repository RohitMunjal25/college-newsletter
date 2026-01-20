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

  // front / top image
  items[currentStep].classList.add('active');
}

// initial position
updatePositions();

// 🔁 rotate ONE STEP every 3.5 seconds
setInterval(() => {
  currentStep = (currentStep + 1) % total;
  updatePositions();
}, 3500);
// 🔗 BACKEND API URL (yahan apna Render wala URL daal)
const API_URL = "https://chatbot-newsletter.onrender.com/api/chat";

// HTML elements
const input = document.getElementById("chat-input");
const chatBox = document.getElementById("chat-body");

// message add function
function addMsg(who, text) {
  const p = document.createElement("p");
  p.innerHTML = `<b>${who}:</b> ${text}`;
  chatBox.appendChild(p);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Enter key se send
input.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    const msg = input.value.trim();
    if (!msg) return;

    addMsg("You", msg);
    input.value = "";

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: msg
      })
    })
    .then(res => res.json())
    .then(data => {
      addMsg("Bot", data.reply);
    })
    .catch(err => {
      console.error(err);
      addMsg("Bot", "Server error");
    });
  }
});
