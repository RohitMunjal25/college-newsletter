/* ===============================
   1. CARD CAROUSEL (HOMEPAGE)
================================ */
const cards = document.querySelectorAll(".card");
let cardCurrent = 0; 

function updateCards() {
  cards.forEach((card, i) => {
    card.classList.remove("active", "left", "right", "far-left", "far-right", "extreme-right", "hidden");
    const diff = i - cardCurrent;
    if (diff === 0) card.classList.add("active");
    else if (diff === 1) card.classList.add("right");
    else if (diff === 2) card.classList.add("far-right");
    else if (diff === 3) card.classList.add("extreme-right");
    else if (diff === -1) card.classList.add("left");
    else if (diff === -2) card.classList.add("far-left");
  });
}
if(cards.length > 0) {
    updateCards();
    setInterval(() => {
      cardCurrent = (cardCurrent + 1) % cards.length;
      updateCards();
    }, 5000);
}

/* ===============================
   2. CHATBOT LOGIC
================================ */
let welcomeShown = false;
let chatMode = "quick";

function openChatbot(mode = "normal") {
  history.pushState({ mode: 'bot' }, "", "#chatbot");
  const chat = document.getElementById("chatbot-container");
  const chatBox = document.getElementById("chatMessages");
  const input = document.getElementById("chatInput");

  if (!chat || !chatBox) return;

  chat.style.display = "flex";

  if (mode === "focus") {
    chat.classList.add("focus-mode");
    document.body.classList.add("chatbot-focus");
  } else {
    chat.classList.remove("focus-mode");
    document.body.classList.remove("chatbot-focus");
  }

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
  
  input.disabled = true;
  input.placeholder = "Choose a quick option above";
}

function closeChatbot() {
  const chat = document.getElementById("chatbot-container");
  if(chat) {
      chat.style.display = "none";
      chat.classList.remove("focus-mode");
  }
  document.body.classList.remove("chatbot-focus");
}

async function sendChat() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;

  const chatBox = document.getElementById("chatMessages");

  if (chatMode === "email") {
    // ... (Email Logic Same as before) ...
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(msg)) {
      chatBox.innerHTML += `<div class="bot-msg">❌ Enter a valid email address</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }
    chatBox.innerHTML += `<div class="user-msg">${msg}</div>`;
    // Simulated API call for brevity in fix
    chatBox.innerHTML += `<div class="bot-msg">✅ <b>Subscribed successfully!</b></div>`;
    
    chatMode = "quick";
    input.value = "";
    input.disabled = true;
    input.type = "text";
    input.placeholder = "Choose a quick option below";
    showPredefinedQuestions();
    return;
  }

  chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${msg}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";

  // Simulating Chat Response for UI (Replace with real Fetch if needed)
  chatBox.innerHTML += `<div class="bot-msg">⚠️ Demo Mode: Server connect code here.</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showPredefinedQuestions() {
  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML += `
    <div class="quick-questions">
      <button onclick="sendQuick('download free newsletter')">📄 Download</button>
      <button onclick="sendQuick('How to subscribe')">⭐ Subscribe</button>
      <button onclick="sendQuick('About Department')">ℹ️ Dept Info</button>
      <button onClick="sendQuick('seminar and workshops')">seminar and workshops</button>
    </div>
  `;
}

function sendQuick(text) {
  if (text.toLowerCase().includes("subscribe")) {
    chatMode = "email";
    const input = document.getElementById("chatInput");
    input.disabled = false;
    input.type = "email";
    input.placeholder = "Enter email 📧";
    input.focus();
    const chatBox = document.getElementById("chatMessages");
    chatBox.innerHTML += `<div class="bot-msg">⭐ Please enter your email address 👇</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }
  const input = document.getElementById("chatInput");
  input.disabled = false;
  input.value = text;
  sendChat();
}

/* ===============================
   3. ABOUT OVERLAY LOGIC
================================ */
function changeAboutVideo(videoSrc) {
  history.pushState({ mode: 'about' }, "", "#about");
  const overlay = document.getElementById("aboutOverlay");
  const loader = document.getElementById("aboutLoader");
  const content = document.getElementById("aboutContent");
  const video = document.getElementById("aboutVideo");

  if (!overlay) return;

  overlay.style.display = "block";
  if(loader) loader.style.display = "flex";
  if(content) content.style.display = "none";

  if (video) {
    video.pause();
    video.src = videoSrc;
    video.load();
  }

  setTimeout(() => {
    if(loader) loader.style.display = "none";
    if(content) content.style.display = "block";
  }, 1500);
}

// ... (Open About Functions Same as before) ...
function openAboutCollege() {
  updateAboutText({ name: "Dr. S.K Sharma", role: "Director – MITRC", link: "https://mitrc.ac.in", showContact: true });
  changeAboutVideo("images/director sir video.mp4");
}
function openAboutDepartment() { 
  updateAboutText({ name: "Dr. Arun Kumar", role: "Head of Department", link: null, showContact: false });
  changeAboutVideo("images/department.mp4");
}
function openAboutPlacements() { 
  updateAboutText({ name: "Dr. Pradeep Kumar Sharma", role: "Training & Placement Officer", link: null, showContact: false });
  changeAboutVideo("images/tpo video.mp4");
}
function openAboutNewsletter() {
  updateAboutText({ name: "Dr. R. Anusuya", role: "Editors Head", link: null, showContact: false });
  changeAboutVideo("images/newsletter.mp4");
}

function updateAboutText({ name, role, link, showContact }) {
    const nameEl = document.getElementById("aboutName");
    const roleEl = document.getElementById("aboutRole");
    const linkEl = document.getElementById("aboutLink");
    const visitLine = document.getElementById("aboutVisit");
    const contactEl = document.getElementById("aboutContact");

    if(nameEl) nameEl.innerText = name;
    if(roleEl) roleEl.innerText = role;
    if (link && visitLine && linkEl) {
      visitLine.style.display = "block";
      linkEl.href = link;
    } else if (visitLine) {
      visitLine.style.display = "none";
    }
    if (showContact && contactEl) {
      contactEl.style.display = "block";
      contactEl.innerHTML = `📞 +91 7597676193/7597244813 <br> Email : hr@mitrc.ac.in`;
    } else if (contactEl) {
      contactEl.style.display = "none";
    }
}

function closeAbout() {
  document.getElementById("aboutOverlay").style.display = "none";
  const vids = document.querySelectorAll("video");
  vids.forEach(v => { v.pause(); v.currentTime = 0; });
}

/* ===============================
   4. SIDE BUTTON SCROLL LOGIC
================================ */
const sideButtons = document.querySelectorAll(".side-actions");
window.addEventListener("scroll", () => {
  if (window.scrollY > 120) {
    sideButtons.forEach(btn => btn.classList.add("hide"));
  } else {
    sideButtons.forEach(btn => btn.classList.remove("hide"));
  }
});

/* ===============================
   5. NEW STACK LOGIC (Replaces Book Logic)
================================ */
let stackIndex = 0; 
const totalStackCards = 12; // Total pages
const stackCards = document.querySelectorAll('.stack-card'); 
const stackCounter = document.getElementById('currentCardNum');

// NEXT Button Logic
function nextCard() {
  if (stackIndex < totalStackCards - 1) {
    // Current card ko uda do
    if(stackCards[stackIndex]) {
        stackCards[stackIndex].classList.add('fly-left');
    }
    stackIndex++;
    updateStackCounter();
  }
}

// PREV Button Logic
function prevCard() {
  if (stackIndex > 0) {
    stackIndex--;
    // Card wapas le aao
    if(stackCards[stackIndex]) {
        stackCards[stackIndex].classList.remove('fly-left');
    }
    updateStackCounter();
  }
}

// Update Counter
function updateStackCounter() {
  if(stackCounter) {
      stackCounter.innerText = stackIndex + 1;
  }
}

/* ===============================
   6. CINEMATIC INTRO & TRANSITIONS
================================ */
const enterBtn = document.getElementById("enterNewsletter");
const cinematicOverlay = document.getElementById("cinematicOverlay");
const introVideo = document.getElementById("introVideo");
const cinematicContent = document.getElementById("cinematicContent");
const bookContainer = document.getElementById("bookContainer"); 

// A. ENTER BUTTON CLICK
if(enterBtn) {
  enterBtn.addEventListener("click", () => {
    history.pushState({ mode: 'immersive' }, "", "#immersive");

    // Hide Homepage Elements
    document.querySelector('.hero').style.display = 'none'; 
    document.querySelector('.bottom-actions').style.display = 'none';

    // Show Cinematic Overlay
    cinematicOverlay.style.display = "flex";
    cinematicOverlay.classList.add("active");

    // Show Text Content First
    cinematicContent.style.opacity = "1";
    cinematicContent.style.display = "block";
    
    if(introVideo) {
        introVideo.style.display = "none";
        introVideo.style.opacity = "1";
        introVideo.style.transform = "scale(1)";
    }

    // 3 Seconds later -> Hide Text, Play Video
    setTimeout(() => {
      cinematicContent.style.opacity = "0";
      setTimeout(() => {
        cinematicContent.style.display = "none";
        introVideo.style.display = "block";
        introVideo.play();
      }, 500);
    }, 3000);
  });
}

// B. VIDEO END -> OPEN STACK
if(introVideo) {
  introVideo.addEventListener("ended", () => {
    // Video Zoom Out Effect
    introVideo.style.transition = "all 1s ease";
    introVideo.style.transform = "scale(2.5)";
    introVideo.style.opacity = "0";

    setTimeout(() => {
      // Hide Cinematic Overlay
      cinematicOverlay.style.display = "none";
      
      // SHOW STACK CONTAINER
      if(bookContainer) {
          bookContainer.classList.add('active'); // CSS display:flex karega
          // Optional: Add entry animation class
          bookContainer.classList.add('fade-in'); 
      }
    }, 1000);
  });
}

// C. GLOBAL BACK BUTTON (Fixes everything)
window.addEventListener("popstate", function (event) {
  const isCinematicOpen = cinematicOverlay && cinematicOverlay.style.display === "flex";
  // Check if Stack is open
  const isStackOpen = bookContainer && bookContainer.classList.contains("active");

  if (isCinematicOpen || isStackOpen) {
    if(cinematicOverlay) cinematicOverlay.style.display = "none";
    
    // Close Stack
    if(bookContainer) {
        bookContainer.classList.remove("active");
        bookContainer.classList.remove("fade-in");
    }
    
    // Show Homepage again
    document.querySelector('.hero').style.display = 'flex'; 
    document.querySelector('.bottom-actions').style.display = 'flex';

    if(introVideo) {
        introVideo.pause();
        introVideo.currentTime = 0;
    }
  }

  // Close other overlays
  const aboutOverlay = document.getElementById("aboutOverlay");
  if (aboutOverlay && aboutOverlay.style.display === "block") closeAbout();

  const chatbotContainer = document.getElementById("chatbot-container");
  if (chatbotContainer && chatbotContainer.style.display === "flex") closeChatbot();
});

/* ===============================
   7. TOUCH SWIPE LOGIC (UPDATED FOR STACK)
================================ */
let touchStartX = 0;
let touchEndX = 0;
const stackArea = document.getElementById("bookContainer");

if (stackArea) {
  stackArea.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  stackArea.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
}

function handleSwipe() {
  const threshold = 50;
  if (touchStartX - touchEndX > threshold) {
    nextCard(); // Swipe Left -> Next Card
  }
  if (touchEndX - touchStartX > threshold) {
    prevCard(); // Swipe Right -> Prev Card
  }
}

/* ===============================
   8. KEYBOARD NAVIGATION (UPDATED FOR STACK)
================================ */
document.addEventListener("keydown", function(e) {
  const bookContainer = document.getElementById("bookContainer");
  
  // Only work if stack is visible
  if (bookContainer && bookContainer.classList.contains("active")) {
    if (e.key === "ArrowRight") {
      nextCard();
    }
    if (e.key === "ArrowLeft") {
      prevCard();
    }
  }
});