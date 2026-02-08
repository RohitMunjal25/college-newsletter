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

  // --- EMAIL SUBSCRIPTION MODE ---
  if (chatMode === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(msg)) {
      chatBox.innerHTML += `<div class="bot-msg">❌ Enter a valid email address</div>`;
      chatBox.scrollTop = chatBox.scrollHeight;
      return;
    }

    chatBox.innerHTML += `<div class="user-msg">${msg}</div>`;

    try {
      const res = await fetch("https://chatbot-newsletter.onrender.com/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: msg })
      });
      const data = await res.json();

      if (data.status === "exists") {
        chatBox.innerHTML += `<div class="bot-msg">⚠️ This email is already subscribed</div>`;
      } else {
        chatBox.innerHTML += `<div class="bot-msg">✅ <b>Subscribed successfully!</b></div>`;
      }
    } catch (err) {
      chatBox.innerHTML += `<div class="bot-msg">❌ Server error, try again later</div>`;
    }

    chatMode = "quick";
    input.value = "";
    input.disabled = true;
    input.type = "text";
    input.placeholder = "Choose a quick option below";
    input.blur();
    document.activeElement.blur();
    showPredefinedQuestions();
    return;
  }

  // --- NORMAL CHAT MODE ---
  chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${msg}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";

  try {
    const res = await fetch("https://chatbot-newsletter.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    let botHTML = `<div class="bot-msg"><b>Bot:</b><br>`;

    // Case 1: Agar Reply Object hai (Text/Image/Video)
    if (typeof data.reply === "object" && data.reply !== null) {
      
      if (data.reply.text) {
        botHTML += `<p>${data.reply.text}</p>`;
      }

      if (data.reply.image) {
        botHTML += `<img src="${data.reply.image}" class="chat-img" loading="lazy">`;
      }

      if (data.reply.video) {
        if (data.reply.video.includes("youtube.com") || data.reply.video.includes("embed") || data.reply.video.includes("youtu.be")) {
          botHTML += `
            <div class="chat-yt-container">
              <iframe src="${data.reply.video}" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>`;
        } else {
          botHTML += `
            <video controls class="chat-video" width="100%">
              <source src="${data.reply.video}" type="video/mp4">
              Your browser does not support video.
            </video>`;
        }
      }
    } 
    // Case 2: Agar Reply sirf String hai
    else {
      botHTML += data.reply;
    }

    botHTML += `</div>`;
    chatBox.innerHTML += botHTML;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (error) {
    console.error(error);
    chatBox.innerHTML += `<div class="bot-msg">⚠️ Server error. Try again later.</div>`;
  }
}

// ---------------------------------------------------------

function showPredefinedQuestions() {
  const chatBox = document.getElementById("chatMessages");
  chatBox.innerHTML += `
    <div class="quick-questions">
      <button onclick="sendQuick('download free newsletter')">📄 Download</button>
      <button onclick="sendQuick('How to subscribe')">⭐ Subscribe</button>
      <button onclick="sendQuick('About Department')">ℹ️ Dept Info</button>
      <button onClick="sendQuick('seminar and workshops')">seminar and workshops</button>
      <button onClick="sendQuick('sample video')">sample video</button>
    </div>
  `;
}

function sendQuick(text) {

  // 🔒 input ko hamesha locked rakho
  const input = document.getElementById("chatInput");
  input.disabled = true;
  input.blur();

  // ⭐ Subscribe special case
  if (text.toLowerCase().includes("subscribe")) {
    chatMode = "email";
    input.disabled = false;
    input.type = "email";
    input.placeholder = "Enter email 📧";

    setTimeout(() => input.focus(), 100); // keyboard sirf yahin
    const chatBox = document.getElementById("chatMessages");
    chatBox.innerHTML += `<div class="bot-msg">⭐ Please enter your email address 👇</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    return;
  }

  // baaki sab quick replies
  input.value = text;
  sendChat();
}

const chatInputEl = document.getElementById("chatInput");
if(chatInputEl) {
    chatInputEl.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        if (!chatInputEl.disabled) sendChat();
      }
    });
}

/* ===============================
   3. ABOUT OVERLAY LOGIC (YouTube Only)
================================ */

function changeAboutVideo(videoUrl) {
  history.pushState({ mode: 'about' }, "", "#about");
  const overlay = document.getElementById("aboutOverlay");
  const loader = document.getElementById("aboutLoader");
  const content = document.getElementById("aboutContent");
  const iframe = document.getElementById("aboutVideo");

  if (!overlay) return;

  // Show Overlay & Loader
  overlay.style.display = "block";
  if(loader) loader.style.display = "flex";
  if(content) content.style.display = "none";

  // Set YouTube Source
  if (iframe && videoUrl) {
    // Adding autoplay=1 ensures video plays when loaded
    iframe.src = videoUrl + "?autoplay=1&rel=0"; 
  }

  // Fake Loading Effect (1.5s)
  setTimeout(() => {
    if(loader) loader.style.display = "none";
    if(content) content.style.display = "block";
  }, 1500);
}

// --- CONFIGURATION: Replace IDs below with your Real YouTube Video IDs ---

// 1. About College (Director Sir)
function openAboutCollege() {
  updateAboutText({ 
    name: "Dr. S.K Sharma", 
    role: "Director – MITRC", 
    link: "https://mitrc.ac.in", 
    showContact: true 
  });
  // Replace with your VIDEO ID
  changeAboutVideo("https://www.youtube.com/embed/j2QgwM_t10E?si=1L9jzs7uchiX8bDF"); 
}

// 2. About Department (HOD Sir)
function openAboutDepartment() { 
  updateAboutText({ 
    name: "Dr. Arun Kumar", 
    role: "Head of Department", 
    link: null, 
    showContact: false 
  });
  changeAboutVideo("https://www.youtube.com/embed/Pt-cmwRLFes?si=pL9kWM42hxyHJDnP");
}

// 3. About Placements (TPO Sir)
function openAboutPlacements() { 
  updateAboutText({ 
    name: "Dr. Pradeep Kumar Sharma", 
    role: "Training & Placement Officer", 
    link: null, 
    showContact: false 
  });
  changeAboutVideo("https://www.youtube.com/embed/Wb9FBGn_Aus?si=8DIF3adigOOUTHBi");
}

// 4. About Newsletter (Editor)
function openAboutNewsletter() {
  updateAboutText({ 
    name: "Dr. R. Anusuya", 
    role: "Editors Head", 
    link: null, 
    showContact: false 
  });
  changeAboutVideo("https://www.youtube.com/embed/ipj8uJTzgqU?si=z6xs-XA82s0qIXpY");
}

// Helper to update text
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
      contactEl.innerHTML = `📞 +91 7597676193 / 7597244813 <br> Email : hr@mitrc.ac.in`;
    } else if (contactEl) {
      contactEl.style.display = "none";
    }
}

// Close Function (Stops Video)
function closeAbout() {
  document.getElementById("aboutOverlay").style.display = "none";
  const iframe = document.getElementById("aboutVideo");
  if(iframe) {
      iframe.src = ""; // Stop video by clearing source
  }
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
   5. CINEMATIC INTRO & STACK LOGIC
================================ */
const enterBtn = document.getElementById("enterNewsletter");
const cinematicOverlay = document.getElementById("cinematicOverlay");
const introVideo = document.getElementById("introVideo");
const cinematicContent = document.getElementById("cinematicContent");
const bookContainer = document.getElementById("bookContainer"); 
const newsletterFrame = document.getElementById("newsletterFrame");

// A. ENTER BUTTON
if(enterBtn) {
  enterBtn.addEventListener("click", () => {
    history.pushState({ mode: 'immersive' }, "", "#immersive");

    // Hide Homepage
    document.querySelector('.hero').style.display = 'none'; 
    document.querySelector('.bottom-actions').style.display = 'none';

    cinematicOverlay.style.display = "flex";
    cinematicOverlay.classList.add("active");

    cinematicContent.style.opacity = "1";
    cinematicContent.style.display = "block";
    if(introVideo) {
        introVideo.style.display = "none";
        introVideo.style.opacity = "1";
        introVideo.style.transform = "scale(1)";
    }

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

// B. VIDEO END -> SHOW STACK
if(introVideo) {
  introVideo.addEventListener("ended", () => {
    introVideo.style.transition = "all 1s ease";
    introVideo.style.transform = "scale(2.5)";
    introVideo.style.opacity = "0";

    setTimeout(() => {
      cinematicOverlay.style.display = "none";
      
      // Reset Stack before showing to ensure Page 1 is on top
      resetStack();
      
      if(bookContainer) {
          bookContainer.style.display = "flex";
          bookContainer.classList.add('active'); // For visibility/animations
      }
      
      if(newsletterFrame) newsletterFrame.style.display = "none";
    }, 1000);
  });
}

// C. GLOBAL BACK BUTTON HANDLER
window.addEventListener("popstate", function (event) {
  
  const isCinematicOpen = cinematicOverlay && cinematicOverlay.style.display === "flex";
  // Check if stack is open by active class
  const isStackOpen = bookContainer && bookContainer.classList.contains('active');
  
  if (isCinematicOpen || isStackOpen) {
    if(cinematicOverlay) cinematicOverlay.style.display = "none";
    
    if(bookContainer) {
        bookContainer.style.display = "none";
        bookContainer.classList.remove('active');
    }
    
    // Show Homepage Back
    document.querySelector('.hero').style.display = 'flex'; 
    document.querySelector('.bottom-actions').style.display = 'flex';

    if(introVideo) {
        introVideo.pause();
        introVideo.currentTime = 0;
    }
  }

  const aboutOverlay = document.getElementById("aboutOverlay");
  if (aboutOverlay && aboutOverlay.style.display === "block") {
    closeAbout();
  }

  const chatbotContainer = document.getElementById("chatbot-container");
  if (chatbotContainer && chatbotContainer.style.display === "flex") {
    closeChatbot();
  }
});

/* ===============================
   6. STACK NAVIGATION (FLYING CARDS)
================================ */
let currentCardIndex = 0;
const stackCards = document.querySelectorAll('.stack-card');
const stackCounter = document.getElementById('currentCardNum');
const totalCards = stackCards.length;

// Reset function (Ensures Card 1 is top)
function resetStack() {
  currentCardIndex = 0;
  stackCards.forEach(card => card.classList.remove('fly-away'));
  updateStackCounter();
}

function updateStackCounter() {
  if(stackCounter) {
    stackCounter.innerText = currentCardIndex + 1;
  }
}

// Next Card: Upar wale card ko uda do
function nextCard() {
  if (currentCardIndex < totalCards - 1) {
    stackCards[currentCardIndex].classList.add('fly-away');
    currentCardIndex++;
    updateStackCounter();
  }
}

// Prev Card: Pichle card ko wapas le aao
function prevCard() {
  if (currentCardIndex > 0) {
    currentCardIndex--;
    stackCards[currentCardIndex].classList.remove('fly-away');
    updateStackCounter();
  }
}

/* ===============================
   7. KEYBOARD & SWIPE LOGIC (STACK)
================================ */
// Keyboard Logic
document.addEventListener("keydown", function(e) {
  // Check if Stack container is visible
  const cont = document.getElementById("bookContainer");
  if (cont && (cont.style.display === "flex" || cont.classList.contains('active'))) {
    if (e.key === "ArrowRight") nextCard();
    if (e.key === "ArrowLeft") prevCard();
  }
});

// Touch Swipe Logic
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
  // Swipe Left -> Next Card (Uda do)
  if (touchStartX - touchEndX > threshold) {
    nextCard(); 
  }
  // Swipe Right -> Prev Card (Wapas lao)
  if (touchEndX - touchStartX > threshold) {
    prevCard(); 
  }
}
/* ===============================
   8. CHATBOT CLICK HANDLERS
================================ */

// 1. Chatbot Icon Click -> Open Chat
const chatbotIcon = document.getElementById("chatbot-icon");
if (chatbotIcon) {
    chatbotIcon.addEventListener("click", function() {
        openChatbot("normal");
    });
}

// 2. Close Button Click -> Close Chat
// (Ensure karein aapke HTML mein close button par class 'close-btn' ho)
const closeBtn = document.querySelector(".chat-header"); 
if (closeBtn) {
    closeBtn.addEventListener("click", closeChatbot);
}