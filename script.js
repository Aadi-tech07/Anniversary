/* ══════════════════════════════════════════════════════════════
   PHOTO SLIDESHOW — add/change your photo filenames here
   ══════════════════════════════════════════════════════════════ */
const PHOTOS = [
  "photo/02.jpeg",
  "photo/17.jpeg",
  "photo/11.jpeg",
  "photo/19.jpeg",
  "photo/20.jpeg",
  "photo/21.jpg",
];

const SHOW_DURATION_MS = 4000;  // each photo fully visible for 4 seconds
const FADE_DURATION_MS = 1000;  // fade out/in takes 1 second

/* ══════════════════════════════════════════════════════════════
   SLIDESHOW
   Single image: fade OUT → swap src → fade IN
   No two images ever overlap = no mixing at all
   ══════════════════════════════════════════════════════════════ */
(function initSlideshow() {
  if (!PHOTOS || PHOTOS.length === 0) return;

  const frame = document.querySelector('.frame-ring');

  // Preload all photos upfront so swaps are instant
  PHOTOS.forEach(src => { const t = new Image(); t.src = src; });

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

  let current = 0;
  img.src = PHOTOS[0];

  function switchPhoto() {
    img.style.opacity = '0';                          // Step 1: fade out

    setTimeout(() => {
      current = (current + 1) % PHOTOS.length;
      img.src = PHOTOS[current];                      // Step 2: swap while invisible

      const fadeIn = () => { img.style.opacity = '1'; };
      if (img.complete) fadeIn();                     // Step 3: fade in
      else { img.onload = fadeIn; setTimeout(fadeIn, 150); }

    }, FADE_DURATION_MS);
  }

  setInterval(switchPhoto, SHOW_DURATION_MS + FADE_DURATION_MS);
})();

/* ══════════════════════════════════════════════════════════════
   STARS
   ══════════════════════════════════════════════════════════════ */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 160; i++) {
  const s  = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2.5 + 0.5;
  s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+1.5).toFixed(1)}s;animation-delay:${(Math.random()*4).toFixed(1)}s;`;
  starsEl.appendChild(s);
}

/* ══════════════════════════════════════════════════════════════
   PETALS
   ══════════════════════════════════════════════════════════════ */
const petalsEl    = document.getElementById('petals');
const petalColors = [
  'rgba(232,160,176,0.7)',
  'rgba(201,168,76,0.5)',
  'rgba(255,255,255,0.35)',
  'rgba(255,200,210,0.6)',
];
for (let i = 0; i < 28; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = `left:${Math.random()*100}%;background:${petalColors[i%4]};--fd:${(Math.random()*8+7).toFixed(1)}s;--fdelay:-${(Math.random()*12).toFixed(1)}s;transform:rotate(${Math.random()*360}deg);`;
  petalsEl.appendChild(p);
}

/* ══════════════════════════════════════════════════════════════
   RSVP — shows confirmation message (no server/storage needed)
   ══════════════════════════════════════════════════════════════ */
function handleRSVP() {
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

  const btn       = document.getElementById('rsvpBtn');
  const btnText   = document.getElementById('rsvpBtnText');
  const successEl = document.getElementById('rsvpSuccess');

  btn.disabled            = true;
  btnText.textContent     = 'Confirmed ✓';
  nameInput.style.display = 'none';

  successEl.innerHTML = `Welcome, <em>${name}</em>! 💛<br>
    <span style="font-size:18px;font-family:'Cormorant Garamond',serif;font-style:normal;">
      Your presence is truly memorable. We can't wait to see you on 18th May!
    </span>`;
  successEl.style.display = 'block';
}