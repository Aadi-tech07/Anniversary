/* ══════════════════════════════════════════════════════════════
   COUPLE PHOTO CONFIGURATION  (host edits this, guests cannot)
   Replace the empty string with your image URL or base64 string.
   Leave it as "" to show the illustrated placeholder instead.
   ══════════════════════════════════════════════════════════════ */

const COUPLE_PHOTO_URL = "photo/17.jpeg";

(function applyPhoto() {
  if (!COUPLE_PHOTO_URL) return;
  const img = document.getElementById('couplePhoto');
  const svg = document.getElementById('svgPlaceholder');
  img.src = COUPLE_PHOTO_URL;
  img.style.display = 'block';
  svg.style.display = 'none';
})();

/* ══════════════════════════ Stars ══════════════════════════ */
const starsEl = document.getElementById('stars');
for (let i = 0; i < 160; i++) {
  const s = document.createElement('div');
  s.className = 'star';
  const sz = Math.random() * 2.5 + 0.5;
  s.style.cssText = `width:${sz}px;height:${sz}px;top:${Math.random()*100}%;left:${Math.random()*100}%;--d:${(Math.random()*3+1.5).toFixed(1)}s;animation-delay:${(Math.random()*4).toFixed(1)}s;`;
  starsEl.appendChild(s);
}

/* ══════════════════════════ Petals ══════════════════════════ */
const petalsEl = document.getElementById('petals');
const petalColors = ['rgba(232,160,176,0.7)','rgba(201,168,76,0.5)','rgba(255,255,255,0.35)','rgba(255,200,210,0.6)'];
for (let i = 0; i < 28; i++) {
  const p = document.createElement('div');
  p.className = 'petal';
  p.style.cssText = `left:${Math.random()*100}%;background:${petalColors[i%4]};--fd:${(Math.random()*8+7).toFixed(1)}s;--fdelay:-${(Math.random()*12).toFixed(1)}s;transform:rotate(${Math.random()*360}deg);`;
  petalsEl.appendChild(p);
}

/* ══════════════════════════ RSVP ══════════════════════════ */
const STORAGE_KEY = 'rsvp_guests_singh25';

async function saveRSVP(name) {
  let guests = [];
  try {
    const result = await window.storage.get(STORAGE_KEY, true);
    guests = result ? JSON.parse(result.value) : [];
  } catch { guests = []; }

  const isDuplicate = guests.some(g => g.toLowerCase() === name.toLowerCase());
  if (!isDuplicate) {
    guests.push(name);
    try { await window.storage.set(STORAGE_KEY, JSON.stringify(guests), true); }
    catch (e) { console.error('Storage error', e); }
  }
  return isDuplicate;
}

async function handleRSVP() {
  const nameInput = document.getElementById('guestName');
  const name = nameInput.value.trim();

  if (!name) {
    nameInput.style.borderColor = 'rgba(232,80,80,0.6)';
    nameInput.placeholder = 'Please enter your name first…';
    setTimeout(() => { nameInput.style.borderColor = ''; nameInput.placeholder = 'Enter your name…'; }, 2200);
    return;
  }

  const btn = document.getElementById('rsvpBtn');
  btn.disabled = true;
  document.getElementById('rsvpBtnText').textContent = 'Confirming…';

  const isDuplicate = await saveRSVP(name);
  const successEl = document.getElementById('rsvpSuccess');

  if (isDuplicate) {
    successEl.innerHTML = `You're already on the list, <em>${name}</em>! 💛<br><span style="font-size:18px;font-family:'Cormorant Garamond',serif;font-style:normal;">We look forward to celebrating with you.</span>`;
  } else {
    successEl.innerHTML = `Welcome, <em>${name}</em>! 💛<br><span style="font-size:18px;font-family:'Cormorant Garamond',serif;font-style:normal;">Your presence is truly memorable. We can't wait to see you on 18th May!</span>`;
    nameInput.style.display = 'none';
  }

  document.getElementById('rsvpBtnText').textContent = 'Confirmed ✓';
  successEl.style.display = 'block';
}