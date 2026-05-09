/* ══════════════════════════════════════════════════════════════
   PHOTO SLIDESHOW CONFIGURATION
   ══════════════════════════════════════════════════════════════ */
const PHOTOS = [
  "photo/02.jpeg",
  "photo/17.jpeg",
  "photo/11.jpeg",
  "photo/19.jpeg",
  "photo/20.jpeg",
  "photo/21.jpg",
];

const SHOW_DURATION_MS = 4000;  // each photo is fully visible for 4 seconds
const FADE_DURATION_MS = 1000;  // fade out takes 0.5 second

/* ══════════════════════════════════════════════════════════════
   RSVP SERVER CONFIG
   ══════════════════════════════════════════════════════════════ */
const RSVP_SERVER = 'https://anniversary-lcpr.onrender.com';

/* ═══════════════════ Photo Slideshow ═══════════════════════ */
(function initSlideshow() {
  if (!PHOTOS || PHOTOS.length === 0) return;

  const frame       = document.querySelector('.frame-ring');
  const svg         = document.getElementById('svgPlaceholder');
  const existingImg = document.getElementById('couplePhoto');

  if (existingImg) existingImg.remove();
  if (svg) svg.remove();

  /* One single <img> — fade out → change src → fade in
     No two images ever visible at the same time = no mixing */
  const img = document.createElement('img');
  img.alt = 'Mukesh & Abha Singh';
  Object.assign(img.style, {
    position    : 'absolute',
    inset       : '0',
    width       : '100%',
    height      : '100%',
    objectFit   : 'cover',
    borderRadius: '50%',
    opacity     : '1',
    transition  : `opacity ${FADE_DURATION_MS}ms ease-in-out`,
  });
  frame.appendChild(img);

  // Preload all images upfront for smooth switching
  PHOTOS.forEach(src => { const t = new Image(); t.src = src; });

  let current = 0;
  img.src = PHOTOS[0];   // show first photo immediately

  function switchPhoto() {
    // 1️⃣ Fade OUT
    img.style.opacity = '0';

    setTimeout(() => {
      // 2️⃣ Change src while invisible (no mixing possible)
      current = (current + 1) % PHOTOS.length;
      img.src = PHOTOS[current];

      // 3️⃣ Fade IN — triggered after image is ready
      const fadeIn = () => { img.style.opacity = '1'; };
      if (img.complete) {
        fadeIn();
      } else {
        img.onload = fadeIn;
      }

    }, FADE_DURATION_MS); // wait for fade-out to finish first
  }

  // Total cycle = visible time + fade time
  setInterval(switchPhoto, SHOW_DURATION_MS + FADE_DURATION_MS);
})();

/* ═══════════════════════ Stars ════════════════════════════ */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 160; i++) {
  const s  = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2.5 + 0.5;
  s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+1.5).toFixed(1)}s;animation-delay:${(Math.random()*4).toFixed(1)}s;`;
  starsEl.appendChild(s);
}

/* ═══════════════════════ Petals ═══════════════════════════ */
const petalsEl    = document.getElementById('petals');
const petalColors = ['rgba(232,160,176,0.7)','rgba(201,168,76,0.5)','rgba(255,255,255,0.35)','rgba(255,200,210,0.6)'];
for (let i = 0; i < 28; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = `left:${Math.random()*100}%;background:${petalColors[i%4]};--fd:${(Math.random()*8+7).toFixed(1)}s;--fdelay:-${(Math.random()*12).toFixed(1)}s;transform:rotate(${Math.random()*360}deg);`;
  petalsEl.appendChild(p);
}

/* ═══════════════════════ RSVP → MySQL ══════════════════════ */
async function handleRSVP() {
  const nameInput = document.getElementById('guestName');
  const name      = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = 'rgba(232,80,80,0.6)';
    nameInput.placeholder = 'Please enter your name first…';
    setTimeout(() => {
      nameInput.style.borderColor = '';
      nameInput.placeholder = 'Enter your name…';
    }, 2200);
    return;
  }

  const btn     = document.getElementById('rsvpBtn');
  const btnText = document.getElementById('rsvpBtnText');
  btn.disabled  = true;
  btnText.textContent = 'Confirming…';

  try {
    const response = await fetch(RSVP_SERVER, {
      method : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body   : JSON.stringify({ name }),
    });

    if (!response.ok) throw new Error(`Server error ${response.status}`);

    const data      = await response.json();
    const successEl = document.getElementById('rsvpSuccess');

    if (data.duplicate) {
      successEl.innerHTML = `You're already on the list, <em>${name}</em>! 💛<br>
        <span style="font-size:18px;font-family:'Cormorant Garamond',serif;font-style:normal;">
          We look forward to celebrating with you.
        </span>`;
    } else {
      successEl.innerHTML = `Welcome, <em>${name}</em>! 💛<br>
        <span style="font-size:18px;font-family:'Cormorant Garamond',serif;font-style:normal;">
          Your presence is truly memorable. We can't wait to see you on 18th May!
        </span>`;
      nameInput.style.display = 'none';
    }

    btnText.textContent     = 'Confirmed ✓';
    successEl.style.display = 'block';

  } catch (err) {
    console.error('RSVP error:', err);
    btnText.textContent = 'RSVP ✦ Accept Invitation';
    btn.disabled = false;

    const successEl            = document.getElementById('rsvpSuccess');
    successEl.style.color      = 'rgba(232,100,100,0.9)';
    successEl.style.fontFamily = "'Cormorant Garamond', serif";
    successEl.style.fontSize   = '17px';
    successEl.innerHTML        = '⚠️ Could not connect to RSVP server.<br>Please make sure <code>server.js</code> is running.';
    successEl.style.display    = 'block';
  }
}