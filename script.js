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
