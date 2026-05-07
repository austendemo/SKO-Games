// 🎰 SIGMA SLOTS - THE MOST BRAINROT SLOT MACHINE FR FR
// no cap, this code is bussin

const SYMBOLS = [
  { emoji: '🗿', name: 'moai',    weight: 1  },
  { emoji: '🐸', name: 'pepe',    weight: 2  },
  { emoji: '💀', name: 'skull',   weight: 3  },
  { emoji: '🔥', name: 'fire',    weight: 4  },
  { emoji: '✨', name: 'sparkle', weight: 5  },
  { emoji: '🚀', name: 'rocket',  weight: 6  },
  { emoji: '🎭', name: 'mask',    weight: 7  },
  { emoji: '🤡', name: 'clown',   weight: 8  },
  { emoji: '😤', name: 'sigma',   weight: 8  },
  { emoji: '🎪', name: 'circus',  weight: 9  },
];

const PAYOUTS = {
  moai:    500,
  pepe:    200,
  skull:   150,
  fire:    100,
  sparkle:  75,
  rocket:   50,
  mask:     30,
};

const WIN_MESSAGES = [
  { emoji: '🗿', text: 'GIGACHAD ENERGY', sub: 'bro really said W' },
  { emoji: '💰', text: 'RIZZ OVERLOAD',   sub: 'too much drip' },
  { emoji: '🔥', text: 'BUSSIN FR',       sub: 'no cap bestie' },
  { emoji: '✨', text: 'SLAY MOMENT',     sub: 'the audacity of winning' },
  { emoji: '🎯', text: 'UNDERSTOOD KING', sub: 'secured the bag' },
];

const LOSE_MESSAGES = [
  { emoji: '💀', text: 'L + RATIO',      sub: 'skill issue (jk keep going bestie)' },
  { emoji: '🤡', text: 'CLOWN BEHAVIOR', sub: 'get clowned fr' },
  { emoji: '😭', text: 'RIP BOZO',       sub: 'the machine ate well today' },
  { emoji: '🗿', text: 'TOUCH GRASS',    sub: 'nah you still bussin tho' },
  { emoji: '📉', text: 'GOING DELULU',   sub: 'manifesting next spin W' },
];

const MEME_BANNERS = [
  '💀 the machine said "no cap you lose" 💀',
  '🗿 bro really bet everything and survived 🗿',
  '🔥 ohio moment detected in the slots 🔥',
  '✨ sigma grindset = winning slots fr ✨',
  '🤌 italian hands could not save you this time 🤌',
  '🎪 welcome to the circus (you are the clown) 🎪',
  '🚀 to the moon but the rocket ran out of fuel 🚀',
];

// ====== STATE ======
let balance = 1000;
let currentBet = 10;
let isSpinning = false;
let history = [];
let spinCount = 0;

// ====== DOM ======
const balanceEl   = document.getElementById('balance');
const spinBtn     = document.getElementById('spin-btn');
const maxBtn      = document.getElementById('max-btn');
const resultEl    = document.getElementById('result-display');
const historyList = document.getElementById('history-list');
const memeBanner  = document.getElementById('meme-banner');
const winOverlay  = document.getElementById('win-overlay');
const loseOverlay = document.getElementById('lose-overlay');

const reelInners = [
  document.getElementById('reel1-inner'),
  document.getElementById('reel2-inner'),
  document.getElementById('reel3-inner'),
];

const reels = [
  document.getElementById('reel1'),
  document.getElementById('reel2'),
  document.getElementById('reel3'),
];

// ====== INIT ======
function buildReels() {
  reelInners.forEach(inner => {
    inner.innerHTML = '';
    // Build a long strip of symbols for animation feel
    for (let i = 0; i < 20; i++) {
      const sym = randomSymbol();
      const div = document.createElement('div');
      div.className = 'reel-symbol';
      div.textContent = sym.emoji;
      inner.appendChild(div);
    }
  });
}

function weightedRandom(symbols) {
  const total = symbols.reduce((acc, s) => acc + s.weight, 0);
  let r = Math.random() * total;
  for (const sym of symbols) {
    r -= sym.weight;
    if (r <= 0) return sym;
  }
  return symbols[symbols.length - 1];
}

function randomSymbol() {
  // Inverse weight — heavier = less likely (more common = lower payout)
  const inverted = SYMBOLS.map(s => ({ ...s, weight: 1 / s.weight }));
  return weightedRandom(inverted);
}

// ====== PARTICLES ======
function spawnParticles() {
  const container = document.getElementById('particles');
  const emojis = ['💸', '⭐', '🌟', '✨', '💫', '🎉', '🎊', '🔥', '💎'];
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      p.style.left = Math.random() * 100 + 'vw';
      p.style.animationDuration = (2 + Math.random() * 3) + 's';
      p.style.animationDelay = '0s';
      p.style.fontSize = (1 + Math.random() * 1.5) + 'rem';
      container.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }, i * 100);
  }
}

function spawnConfetti() {
  const colors = ['#ff006e','#00f5ff','#ffff00','#39ff14','#bf00ff','#ff9500'];
  for (let i = 0; i < 80; i++) {
    setTimeout(() => {
      const c = document.createElement('div');
      c.className = 'confetti';
      c.style.left = Math.random() * 100 + 'vw';
      c.style.background = colors[Math.floor(Math.random() * colors.length)];
      c.style.width  = (6 + Math.random() * 8) + 'px';
      c.style.height = (6 + Math.random() * 8) + 'px';
      c.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
      c.style.animationDuration = (2 + Math.random() * 3) + 's';
      document.body.appendChild(c);
      setTimeout(() => c.remove(), 5000);
    }, i * 30);
  }
}

// ====== SPIN ======
function getResult() {
  return [randomSymbol(), randomSymbol(), randomSymbol()];
}

function animateReel(reelInner, finalSymbol, delay, duration) {
  return new Promise(resolve => {
    setTimeout(() => {
      // Rapid symbol cycling
      let ticks = 0;
      const maxTicks = Math.floor(duration / 60);
      const interval = setInterval(() => {
        const syms = reelInner.querySelectorAll('.reel-symbol');
        if (syms.length > 0) {
          const rand = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
          // Shift top symbol to bottom to simulate rolling
          reelInner.style.transform = `translateY(-${ticks * 2}px)`;
        }
        ticks++;
        if (ticks >= maxTicks) {
          clearInterval(interval);
          reelInner.style.transform = '';
          // Set middle symbol (index 1 of 3 visible) to final result
          const allSyms = reelInner.querySelectorAll('.reel-symbol');
          allSyms.forEach((s, i) => {
            const offset = i - Math.floor(allSyms.length / 2);
            if (offset === 0) {
              s.textContent = finalSymbol.emoji;
              s.style.fontSize = '3.5rem';
            } else {
              s.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)].emoji;
            }
          });
          resolve();
        }
      }, 60);
    }, delay);
  });
}

async function spin() {
  if (isSpinning) return;
  if (balance < currentBet) {
    showMeme('❌ broke behavior detected. zero rizz coins = zero spins ❌');
    return;
  }

  isSpinning = true;
  spinCount++;
  balance -= currentBet;
  updateBalance();

  spinBtn.disabled = true;
  spinBtn.classList.add('spinning');
  spinBtn.textContent = '🌀 SPINNING...';
  resultEl.textContent = '';

  reels.forEach(r => {
    r.classList.remove('winner');
    r.classList.add('spinning');
  });

  spawnParticles();

  const result = getResult();

  // Animate each reel with staggered stop times
  await Promise.all([
    animateReel(reelInners[0], result[0], 0,    800),
    animateReel(reelInners[1], result[1], 300,  1100),
    animateReel(reelInners[2], result[2], 600,  1400),
  ]);

  reels.forEach(r => r.classList.remove('spinning'));

  // Evaluate
  const [a, b, c] = result;
  let payout = 0;
  let isWin = false;

  if (a.name === b.name && b.name === c.name) {
    // Jackpot
    const mult = PAYOUTS[a.name] || 10;
    payout = currentBet * mult;
    isWin = true;
    reels.forEach(r => r.classList.add('winner'));
  } else if (a.name === b.name || b.name === c.name || a.name === c.name) {
    // Two of a kind
    payout = currentBet * 2;
    isWin = true;
    reels.forEach((r, i) => {
      if ((i === 0 && (a.name === b.name || a.name === c.name)) ||
          (i === 1 && (a.name === b.name || b.name === c.name)) ||
          (i === 2 && (a.name === c.name || b.name === c.name))) {
        r.classList.add('winner');
      }
    });
  }

  if (isWin) {
    balance += payout;
    updateBalance();
    recordHistory(result, payout, true);
    setTimeout(() => showWin(payout, result), 300);
  } else {
    recordHistory(result, 0, false);
    setTimeout(() => showLoss(result), 300);
  }

  // Periodic meme banners
  if (spinCount % 5 === 0) {
    const m = MEME_BANNERS[Math.floor(Math.random() * MEME_BANNERS.length)];
    showMeme(m);
  }

  spinBtn.disabled = false;
  spinBtn.classList.remove('spinning');
  spinBtn.textContent = '🎰 SPIN (no cap)';
  isSpinning = false;
}

// ====== UI HELPERS ======
function updateBalance() {
  balanceEl.textContent = balance.toLocaleString();
  balanceEl.style.animation = 'none';
  void balanceEl.offsetWidth;
  balanceEl.style.animation = 'title-pulse 0.5s ease-in-out';
}

function showMeme(msg) {
  memeBanner.textContent = msg;
  memeBanner.classList.remove('hidden');
  memeBanner.style.animation = 'none';
  void memeBanner.offsetWidth;
  memeBanner.style.animation = 'banner-shake 0.5s ease-in-out';
  setTimeout(() => memeBanner.classList.add('hidden'), 4000);
}

function showWin(amount, result) {
  const msg = WIN_MESSAGES[Math.floor(Math.random() * WIN_MESSAGES.length)];
  document.getElementById('win-emoji').textContent = msg.emoji;
  document.getElementById('win-text').textContent  = msg.text;
  document.getElementById('win-amount').textContent = `+${amount.toLocaleString()} RIZZ COINS 💰`;
  winOverlay.classList.remove('hidden');
  spawnConfetti();
}

function showLoss(result) {
  const msg = LOSE_MESSAGES[Math.floor(Math.random() * LOSE_MESSAGES.length)];
  document.getElementById('lose-emoji').textContent = msg.emoji;
  document.getElementById('lose-text').textContent  = msg.text;
  loseOverlay.classList.remove('hidden');
}

function recordHistory(result, payout, win) {
  const emojis = result.map(r => r.emoji).join(' ');
  const item = {
    emojis,
    payout,
    bet: currentBet,
    win,
    time: new Date().toLocaleTimeString(),
  };
  history.unshift(item);
  if (history.length > 20) history.pop();
  renderHistory();
}

function renderHistory() {
  historyList.innerHTML = history.map(h => {
    const cls = h.win ? 'win' : 'loss';
    const label = h.win
      ? `W +${h.payout.toLocaleString()} 🤑`
      : `L -${h.bet} 💀`;
    return `<li class="${cls}"><span>${h.emojis}</span><span>${label}</span></li>`;
  }).join('');
}

// ====== EVENT LISTENERS ======
spinBtn.addEventListener('click', spin);

maxBtn.addEventListener('click', () => {
  const btns = document.querySelectorAll('.bet-btn');
  btns.forEach(b => b.classList.remove('active'));
  const maxBetBtn = document.querySelector('[data-bet="250"]');
  if (maxBetBtn) maxBetBtn.classList.add('active');
  currentBet = 250;
  showMeme('🗿 MAX BET ACTIVATED. sigma behavior detected 🗿');
});

document.querySelectorAll('.bet-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.bet-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentBet = parseInt(btn.dataset.bet);
  });
});

document.getElementById('win-close').addEventListener('click', () => {
  winOverlay.classList.add('hidden');
  reels.forEach(r => r.classList.remove('winner'));
});

document.getElementById('lose-close').addEventListener('click', () => {
  loseOverlay.classList.add('hidden');
});

// Keyboard shortcut: Space to spin
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && !isSpinning) {
    e.preventDefault();
    spin();
  }
});

// Ambient background particles
function ambientParticles() {
  const emojis = ['🗿', '💀', '🔥', '✨', '💸', '🎰', '🤑'];
  const p = document.createElement('div');
  p.className = 'particle';
  p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
  p.style.left = Math.random() * 100 + 'vw';
  p.style.animationDuration = (5 + Math.random() * 8) + 's';
  p.style.opacity = '0.15';
  p.style.fontSize = (0.8 + Math.random()) + 'rem';
  document.getElementById('particles').appendChild(p);
  setTimeout(() => p.remove(), 13000);
}
setInterval(ambientParticles, 800);

// ====== BOOT ======
buildReels();
updateBalance();
console.log('🎰 sigma slots loaded. no cap.');
