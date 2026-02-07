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
   2. CHATBOT LOGIC (API RESTORED ✅)
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
      // 🔥 REAL API CALL RESTORED
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
    showPredefinedQuestions();
    return;
  }

  // --- NORMAL CHAT MODE ---
  chatBox.innerHTML += `<div class="user-msg"><b>You:</b> ${msg}</div>`;
  chatBox.scrollTop = chatBox.scrollHeight;
  input.value = "";

  try {
    // 🔥 REAL API CALL RESTORED
    const res = await fetch("https://chatbot-newsletter.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();
    
    let botHTML = `<div class="bot-msg"><b>Bot:</b><br>`;
    
    if (typeof data.reply === "object" && data.reply !== null) {
       if (data.reply.text) botHTML += `<p>${data.reply.text}</p>`;
       if (data.reply.image) botHTML += `<img src="${data.reply.image}" class="chat-img" loading="lazy">`;
    } else if (typeof data.reply === "string" && data.reply.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
       botHTML += `<img src="${data.reply}" class="chat-img" loading="lazy">`;
    } else {
       botHTML += data.reply;
    }
    botHTML += `</div>`;
    
    chatBox.innerHTML += botHTML;

  } catch (error) {
    chatBox.innerHTML += `<div class="bot-msg">⚠️ Server is waking up (Free Tier). Please wait 30s and try again.</div>`;
  }
  
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

// Enable Enter Key
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
   3. ABOUT OVERLAY LOGIC (Specific Videos)
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

// 1. College (Director)
function openAboutCollege() {
  updateAboutText({ name: "Dr. S.K Sharma", role: "Director – MITRC", link: "https://mitrc.ac.in", showContact: true });
  changeAboutVideo("images/director sir video.mp4");
}
// 2. Department (HOD)
function openAboutDepartment() { 
  updateAboutText({ name: "Dr. Arun Kumar", role: "Head of Department", link: null, showContact: false });
  changeAboutVideo("images/department.mp4");
}
// 3. Placements (TPO)
function openAboutPlacements() { 
  updateAboutText({ name: "Dr. Pradeep Kumar Sharma", role: "Training & Placement Officer", link: null, showContact: false });
  changeAboutVideo("images/tpo video.mp4");
}
// 4. Newsletter (Editor)
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
   5. CINEMATIC INTRO & BOOK LOGIC
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

// B. VIDEO END
// B. VIDEO END
if(introVideo) {
  introVideo.addEventListener("ended", () => {
    introVideo.style.transition = "all 1s ease";
    introVideo.style.transform = "scale(2.5)";
    introVideo.style.opacity = "0";

    setTimeout(() => {
      cinematicOverlay.style.display = "none";
      bookContainer.style.display = "flex";
      
      // 🔥 IMPORTANT FIX: Book dikhane se pehle usse reset karo
      resetBook(); 
      
      bookContainer.classList.add('active'); 
      if(newsletterFrame) newsletterFrame.style.display = "none";
    }, 1000);
  });
}

// C. GLOBAL BACK BUTTON HANDLER
window.addEventListener("popstate", function (event) {
  
  const isCinematicOpen = cinematicOverlay && cinematicOverlay.style.display === "flex";
  const isBookOpen = bookContainer && bookContainer.style.display === "flex";
  
  if (isCinematicOpen || isBookOpen) {
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
   6. BOOK NAVIGATION (FIXED & RESET LOGIC)
================================ */
let currentBookPage = 0;
const bookPages = document.querySelectorAll('.book-page');
const pageDisplay = document.getElementById("currentPageDisplay");

// 🔥 NEW FUNCTION: Book ko hamesha Page 1 se start karne ke liye
function resetBook() {
  currentBookPage = 0; // Counter 0 par set karo
  
  bookPages.forEach((page, index) => {
    page.classList.remove('flipped'); // Saare page wapas palto (band karo)
    
    // Z-Index sahi karo (Pehla page sabse upar)
    page.style.zIndex = bookPages.length - index; 
  });
  
  updateCounter();
}

// Window load hote hi setup karo
window.addEventListener('load', resetBook);

function updateCounter() {
  if(pageDisplay) {
    pageDisplay.innerText = currentBookPage + 1;
  }
}

function nextPage() {
  if (currentBookPage < bookPages.length) {
    const page = bookPages[currentBookPage];
    page.classList.add('flipped');
    page.style.zIndex = currentBookPage + 1; 
    currentBookPage++;
    updateCounter();
  }
}

function prevPage() {
  if (currentBookPage > 0) {
    currentBookPage--;
    const page = bookPages[currentBookPage];
    page.classList.remove('flipped');
    page.style.zIndex = bookPages.length - currentBookPage;
    updateCounter();
  }
}
/* ===============================
   7. TOUCH SWIPE & KEYBOARD LOGIC
================================ */
let touchStartX = 0;
let touchEndX = 0;
const bookArea = document.getElementById("bookContainer");

// Swipe Logic
if (bookArea) {
  bookArea.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, {passive: true});

  bookArea.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, {passive: true});
}

function handleSwipe() {
  const threshold = 50;
  if (touchStartX - touchEndX > threshold) {
    nextPage(); // Swipe Left -> Next
  }
  if (touchEndX - touchStartX > threshold) {
    prevPage(); // Swipe Right -> Prev
  }
}

// Keyboard Logic
document.addEventListener("keydown", function(e) {
  // Only work if book is open
  if (bookContainer && bookContainer.style.display === "flex") {
    if (e.key === "ArrowRight") nextPage();
    if (e.key === "ArrowLeft") prevPage();
  }
});
