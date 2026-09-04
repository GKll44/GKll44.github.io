// ============================================================================
// ========================= CLOCK & DATE =====================================
// ============================================================================

const clockTimeElement = document.getElementById('clock-time');
const clockMinuteElement = document.getElementById('clock-minute');
const clockAmPmElement = document.getElementById('clock-am-pm');
const dateElement = document.getElementById('date');

function updateClock() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const amPm = hours >= 12 ? 'PM' : 'AM';
  const displayHours = String(hours % 12 || 12).padStart(2, '0');

  if (clockTimeElement) clockTimeElement.textContent = displayHours;
  if (clockMinuteElement) clockMinuteElement.textContent = minutes;
  if (clockAmPmElement) clockAmPmElement.textContent = amPm;

  if (dateElement) {
    dateElement.textContent = now.toLocaleDateString('zh-CN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
}

setInterval(updateClock, 1000);
updateClock();

// ============================================================================
// ========================= TYPING EFFECT ====================================
// ============================================================================

const typingTextElement = document.getElementById('typing-text');
const typingContainer = document.getElementById('typing-container');
const initialText = "欢迎来到GKll44的主页！";
const wowText = "哎呀！点我干嘛？>_<";
let isTyping = false;
let currentMode = 'initial';

function typeInitialText() {
  if (isTyping) return;
  isTyping = true;
  currentMode = 'initial';
  typingTextElement.innerHTML = '';
  typingTextElement.className = 'typing-text';
  let currentIndex = 0;

  function type() {
    if (currentIndex < initialText.length) {
      const charSpan = document.createElement('span');
      charSpan.textContent = initialText[currentIndex];
      charSpan.classList.add('char');
      charSpan.style.color = '#212121';
      typingTextElement.appendChild(charSpan);
      currentIndex++;
      setTimeout(type, 50);
    } else {
      isTyping = false;
    }
  }
  type();
}

function typeWowText() {
  if (isTyping) return;
  isTyping = true;
  currentMode = 'wow';
  let currentLength = typingTextElement.children.length;

  function backspace() {
    if (currentLength > 0) {
      typingTextElement.removeChild(typingTextElement.lastChild);
      currentLength--;
      setTimeout(backspace, 30);
    } else {
      let wowIndex = 0;
      function typeWow() {
        if (wowIndex < wowText.length) {
          const charSpan = document.createElement('span');
          charSpan.textContent = wowText[wowIndex];
          charSpan.classList.add('char');
          charSpan.style.color = '#ff4081';
          typingTextElement.appendChild(charSpan);
          wowIndex++;
          setTimeout(typeWow, 100);
        } else {
          typingTextElement.classList.add('wow-text');
          isTyping = false;
        }
      }
      typeWow();
    }
  }
  backspace();
}

if (typingContainer) {
  typingContainer.addEventListener('click', function() {
    if (currentMode === 'initial') {
      typeWowText();
    } else {
      typeInitialText();
    }
  });
}

setTimeout(typeInitialText, 500);

// ============================================================================
// ========================= TAB SYSTEM =======================================
// ============================================================================

const tabs = document.querySelectorAll('.tab');
const contents = document.querySelectorAll('.content');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetIndex = tab.getAttribute('data-tab');
    tabs.forEach(t => t.classList.remove('active'));
    contents.forEach(c => c.classList.remove('active'));
    tab.classList.add('active');
    const targetContent = document.querySelector(`.content[data-content="${targetIndex}"]`);
    if (targetContent) targetContent.classList.add('active');
  });
});

// ============================================================================
// ========================= PAGE LOAD COUNTER ================================
// ============================================================================

const loadCountEl = document.getElementById('load-count');
const currentDateEl = document.getElementById('current-date');
const currentTimeEl = document.getElementById('current-time');

let pageLoadCount = parseInt(localStorage.getItem('pageLoadCount'), 10) || 0;
pageLoadCount++;
localStorage.setItem('pageLoadCount', pageLoadCount);

function formatCountWord(n) {
  if (n === 1) return '1 次';
  return `${n} 次`;
}

if (loadCountEl) {
  loadCountEl.textContent = pageLoadCount;
  const msgEl = document.getElementById('page-load-message');
  if (msgEl) msgEl.innerHTML = `你已经加载本页面 ${formatCountWord(pageLoadCount)}啦！`;
}

if (currentDateEl) {
  currentDateEl.textContent = new Date().toLocaleDateString('zh-CN', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
}
if (currentTimeEl) {
  currentTimeEl.textContent = new Date().toLocaleTimeString('zh-CN', {
    hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
  });
  setInterval(() => {
    currentTimeEl.textContent = new Date().toLocaleTimeString('zh-CN', {
      hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
  }, 1000);
}

const resetBtn = document.getElementById('reset-count');
if (resetBtn) {
  resetBtn.addEventListener('click', () => {
    localStorage.removeItem('pageLoadCount');
    pageLoadCount = 1;
    if (loadCountEl) loadCountEl.textContent = pageLoadCount;
    const msgEl = document.getElementById('page-load-message');
    if (msgEl) msgEl.innerHTML = `你已经加载本页面 1 次啦！`;
    showToast('计数已重置');
  });
}

// ============================================================================
// ========================= PAGE UPTIME COUNTER ==============================
// ============================================================================

let uptimeSeconds = 0;
const uptimeEl = document.getElementById('stat-uptime');
if (uptimeEl) {
  setInterval(() => {
    uptimeSeconds++;
    uptimeEl.textContent = uptimeSeconds;
  }, 1000);
}

// ============================================================================
// ========================= SCROLL TO TOP ====================================
// ============================================================================

const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '▲';
scrollTopBtn.title = '回到顶部';
document.body.appendChild(scrollTopBtn);

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    scrollTopBtn.classList.add('visible');
  } else {
    scrollTopBtn.classList.remove('visible');
  }
});

// ============================================================================
// ========================= TOAST NOTIFICATION ===============================
// ============================================================================

const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, duration = 3000) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  toastContainer.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.parentNode.removeChild(toast);
  }, duration);
}

// ============================================================================
// ========================= CALCULATOR =======================================
// ============================================================================

(function initCalculator() {
  const display = document.getElementById('calc-display');
  const buttons = document.querySelectorAll('.calc-btn');
  if (!display || buttons.length === 0) return;

  let current = '0';
  let previous = '';
  let op = null;
  let shouldReset = false;

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.getAttribute('data-val');
      if (!val) return;

      if (val === 'C') {
        current = '0'; previous = ''; op = null; shouldReset = false;
      } else if (val === 'DEL') {
        current = current.length > 1 ? current.slice(0, -1) : '0';
      } else if (['+', '-', '*', '/', '%'].includes(val)) {
        if (op && !shouldReset) {
          current = String(calc(parseFloat(previous), parseFloat(current), op));
        }
        op = val; previous = current; shouldReset = true;
      } else if (val === '=') {
        if (op && previous) {
          current = String(calc(parseFloat(previous), parseFloat(current), op));
          op = null; previous = ''; shouldReset = true;
        }
      } else {
        if (current === '0' || shouldReset) { current = val; shouldReset = false; }
        else { current += val; }
      }
      display.value = current;
    });
  });

  function calc(a, b, operator) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : 'Error';
      case '%': return a % b;
      default: return b;
    }
  }
})();

// ============================================================================
// ========================= COLOR PICKER =====================================
// ============================================================================

(function initColorPicker() {
  const picker = document.getElementById('color-picker');
  const preview = document.getElementById('color-preview');
  const hexEl = document.getElementById('color-hex');
  const rgbEl = document.getElementById('color-rgb');
  const paletteColors = document.querySelectorAll('.palette-color');

  if (!picker) return;

  function updateColor(hex) {
    picker.value = hex;
    if (preview) preview.style.background = hex;
    if (hexEl) hexEl.textContent = hex.toUpperCase();
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    if (rgbEl) rgbEl.textContent = `rgb(${r}, ${g}, ${b})`;
  }

  picker.addEventListener('input', () => updateColor(picker.value));

  paletteColors.forEach(pc => {
    pc.addEventListener('click', () => {
      updateColor(pc.getAttribute('data-color'));
    });
  });
})();

// ============================================================================
// ========================= RANDOM QUOTE =====================================
// ============================================================================

const quotes = [
  { text: "做伟大的工作的唯一方法就是热爱你所做的事。", author: "史蒂夫·乔布斯" },
  { text: "创新区分了领导者和追随者。", author: "史蒂夫·乔布斯" },
  { text: "生活就是当你忙于制定其他计划时发生的事。", author: "约翰·列侬" },
  { text: "未来属于那些相信梦想之美的人。", author: "埃莉诺·罗斯福" },
  { text: "在最黑暗的时刻，我们必须集中精力看到光明。", author: "亚里士多德" },
  { text: "不要走别人走过的路，去没有路的地方，留下自己的足迹。", author: "拉尔夫·沃尔多·爱默生" },
  { text: "生命中最大的荣耀不在于从不跌倒，而在于每次跌倒后都能站起来。", author: "纳尔逊·曼德拉" },
  { text: "开始的方法就是停止空谈，开始行动。", author: "华特·迪士尼" },
  { text: "你的时间有限，不要浪费在过别人的生活上。", author: "史蒂夫·乔布斯" },
  { text: "如果生活是可预测的，它就不再是生活，也就没有味道了。", author: "埃莉诺·罗斯福" },
  { text: "到处传播爱。不要让任何人来找你时，离开时比来时更不快乐。", author: "特蕾莎修女" },
  { text: "告诉我，我会忘记。教给我，我会记住。让我参与，我会学会。", author: "本杰明·富兰克林" },
  { text: "走得多慢不重要，重要的是不要停下来。", author: "孔子" },
  { text: "你想要的一切都在恐惧的另一边。", author: "乔治·阿代尔" },
  { text: "成功不是终点，失败不是致命的：继续前进的勇气才是最重要的。", author: "温斯顿·丘吉尔" },
  { text: "相信你能做到，你就已经成功了一半。", author: "西奥多·罗斯福" },
  { text: "预测未来的最好方法就是创造它。", author: "艾伦·凯" },
  { text: "我没有失败。我只是发现了一万种行不通的方法。", author: "托马斯·爱迪生" },
  { text: "我们实现明天的唯一限制是我们今天的怀疑。", author: "富兰克林·罗斯福" },
  { text: "做你能做的，用你拥有的，在你所在的地方。", author: "西奥多·罗斯福" }
];

(function initQuote() {
  const quoteText = document.getElementById('quote-text');
  const quoteAuthor = document.getElementById('quote-author');
  const newQuoteBtn = document.getElementById('new-quote-btn');

  if (!quoteText || !newQuoteBtn) return;

  function showRandomQuote() {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    quoteText.textContent = '"' + q.text + '"';
    if (quoteAuthor) quoteAuthor.textContent = '— ' + q.author;
  }

  newQuoteBtn.addEventListener('click', showRandomQuote);
})();

// ============================================================================
// ========================= PASSWORD GENERATOR ===============================
// ============================================================================

(function initPasswordGen() {
  const output = document.getElementById('password-output');
  const lengthSlider = document.getElementById('pw-length');
  const lengthVal = document.getElementById('pw-length-val');
  const upperCheck = document.getElementById('pw-upper');
  const lowerCheck = document.getElementById('pw-lower');
  const numCheck = document.getElementById('pw-numbers');
  const symCheck = document.getElementById('pw-symbols');
  const genBtn = document.getElementById('generate-pw');
  const copyBtn = document.getElementById('copy-pw');

  if (!output || !genBtn) return;

  const upperChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lowerChars = 'abcdefghijklmnopqrstuvwxyz';
  const numChars = '0123456789';
  const symChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (lengthSlider && lengthVal) {
    lengthSlider.addEventListener('input', () => {
      lengthVal.textContent = lengthSlider.value;
    });
  }

  genBtn.addEventListener('click', () => {
    let chars = '';
    if (upperCheck && upperCheck.checked) chars += upperChars;
    if (lowerCheck && lowerCheck.checked) chars += lowerChars;
    if (numCheck && numCheck.checked) chars += numChars;
    if (symCheck && symCheck.checked) chars += symChars;

    if (chars === '') {
      showToast('请至少选择一种字符类型！');
      return;
    }

    const len = parseInt(lengthSlider ? lengthSlider.value : 12);
    let pw = '';
    for (let i = 0; i < len; i++) {
      pw += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    output.value = pw;
  });

  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      if (!output.value) {
        showToast('先生成密码！');
        return;
      }
      navigator.clipboard.writeText(output.value).then(() => {
        showToast('密码已复制到剪贴板！');
      }).catch(() => {
        output.select();
        document.execCommand('copy');
        showToast('密码已复制到剪贴板！');
      });
    });
  }
})();

// ============================================================================
// ============================= MINI GAMES ===================================
// ============================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas ? canvas.getContext('2d') : null;
const gameNameEl = document.getElementById('game-name');
const gameScoreEl = document.getElementById('game-score');
const gameHighEl = document.getElementById('game-high');
const gameScoreText = document.getElementById('game-score-text');
const gameHighText = document.getElementById('game-high-text');
const startBtn = document.getElementById('game-start');
const pauseBtn = document.getElementById('game-pause');
const changeBtn = document.getElementById('change-game');
const sidePanel = document.getElementById('game-side-panel');

const GAMES = ['Snake', 'Pong', 'Breakout', 'Flappy Bird', 'Memory Match'];
let currentGameIndex = 0;
let currentGame = null;

const highScores = {
  snake: parseInt(localStorage.getItem('snakeHigh') || '0'),
  pong: 0,
  breakout: parseInt(localStorage.getItem('breakoutHigh') || '0'),
  flappy: parseInt(localStorage.getItem('flappyBest') || '0'),
  memory: parseInt(localStorage.getItem('memoryBest') || '9999')
};

function setCanvasSize(w, h) {
  if (canvas) { canvas.width = w; canvas.height = h; }
}

function clearCanvas() {
  if (!ctx) return;
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function stopCurrentGame() {
  if (currentGame && currentGame.stop) currentGame.stop();
  currentGame = null;
}

function updateUI(name, score, high) {
  if (gameNameEl) gameNameEl.textContent = name;
  const s = score !== undefined ? score : '0';
  const h = high !== undefined ? high : '0';
  if (gameScoreEl) gameScoreEl.textContent = s;
  if (gameHighEl) gameHighEl.textContent = h;
  if (gameScoreText) gameScoreText.textContent = s;
  if (gameHighText) gameHighText.textContent = h;
}

function showSidePanel(show) {
  if (sidePanel) sidePanel.style.display = show ? 'flex' : 'none';
}

function switchGame() {
  stopCurrentGame();
  currentGameIndex = (currentGameIndex + 1) % GAMES.length;
  const name = GAMES[currentGameIndex];
  const scoreKeys = ['snake', 'pong', 'breakout', 'flappy', 'memory'];
  updateUI(name, 0, highScores[scoreKeys[currentGameIndex]]);

  switch (name) {
    case 'Snake': currentGame = new SnakeGame(); break;
    case 'Pong': currentGame = new PongGame(); break;
    case 'Breakout': currentGame = new BreakoutGame(); break;
    case 'Flappy Bird': currentGame = new FlappyGame(); break;
    case 'Memory Match': currentGame = new MemoryGame(); break;
  }
  if (currentGame) currentGame.draw();
}

if (startBtn) startBtn.addEventListener('click', () => {
  if (currentGame) currentGame.start();
});

if (pauseBtn) pauseBtn.addEventListener('click', () => {
  if (currentGame) currentGame.pause();
});

if (changeBtn) changeBtn.addEventListener('click', switchGame);

// ============================================================================
// GAME 1: SNAKE
// ============================================================================
function SnakeGame() {
  setCanvasSize(400, 400);
  const gridSize = 20;
  const tileCount = canvas.width / gridSize;
  let snake = [];
  let food = {};
  let dx = 0, dy = 0;
  let score = 0;
  let loop = null;
  let paused = false;
  let running = false;
  let nextDir = null;

  function init() {
    snake = [{x: 10, y: 10}];
    dx = 1; dy = 0; nextDir = null;
    score = 0;
    placeFood();
    updateUI('Snake', score, highScores.snake);
  }

  function placeFood() {
    do {
      food = {
        x: Math.floor(Math.random() * tileCount),
        y: Math.floor(Math.random() * tileCount)
      };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
  }

  this.draw = function() {
    clearCanvas();
    snake.forEach((seg, i) => {
      const g = Math.max(100, 200 - i * 5);
      ctx.fillStyle = i === 0 ? '#4aff4a' : `rgb(50,${g},50)`;
      ctx.fillRect(seg.x*gridSize+1, seg.y*gridSize+1, gridSize-2, gridSize-2);
    });
    ctx.fillStyle = '#ff4444';
    ctx.beginPath();
    ctx.arc(food.x*gridSize+gridSize/2, food.y*gridSize+gridSize/2, gridSize/2-2, 0, Math.PI*2);
    ctx.fill();
  };

  function update() {
    if (paused || !running) return;
    if (nextDir) { dx = nextDir.dx; dy = nextDir.dy; nextDir = null; }
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
      gameOver(); return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score += 10;
      if (score > highScores.snake) {
        highScores.snake = score;
        localStorage.setItem('snakeHigh', score);
      }
      updateUI('Snake', score, highScores.snake);
      placeFood();
    } else {
      snake.pop();
    }
    this.draw();
  }

  function gameOver() {
    running = false;
    clearInterval(loop);
    showSnakeMobileControls(false);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 28px "Segoe UI",sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2-10);
    ctx.font = '16px "Segoe UI",sans-serif';
    ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+20);
  }

  this.start = function() {
    clearInterval(loop);
    init();
    running = true; paused = false;
    this.draw();
    loop = setInterval(() => update.call(this), 100);
    showSnakeMobileControls(true);
  };

  this.pause = function() {
    if (!running) return;
    paused = !paused;
    if (paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 24px "Segoe UI",sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('Paused', canvas.width/2, canvas.height/2);
    } else {
      this.draw();
    }
  };

  this.stop = function() { clearInterval(loop); running = false; showSnakeMobileControls(false); };

  this.handleKey = function(e) {
    if (!running || paused) return;
    const k = e.key.toLowerCase();
    if ((k === 'arrowup' || k === 'w') && dy === 0) nextDir = {dx:0, dy:-1};
    else if ((k === 'arrowdown' || k === 's') && dy === 0) nextDir = {dx:0, dy:1};
    else if ((k === 'arrowleft' || k === 'a') && dx === 0) nextDir = {dx:-1, dy:0};
    else if ((k === 'arrowright' || k === 'd') && dx === 0) nextDir = {dx:1, dy:0};
  };

  init();
  this.draw();
}

// ============================================================================
// GAME 2: PONG
// ============================================================================
function PongGame() {
  setCanvasSize(500, 300);
  let ball = {x: 250, y: 150, dx: 4, dy: 3, r: 6};
  let player = {x: 10, y: 120, w: 10, h: 60};
  let ai = {x: 480, y: 120, w: 10, h: 60};
  let pScore = 0, aScore = 0;
  let loop = null;
  let paused = false;
  let running = false;
  let mouseY = 150;

  function resetBall() {
    ball.x = canvas.width/2; ball.y = canvas.height/2;
    ball.dx = (Math.random()>0.5?1:-1)*(3+Math.random()*2);
    ball.dy = (Math.random()>0.5?1:-1)*(2+Math.random()*2);
  }

  this.draw = function() {
    clearCanvas();
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.setLineDash([5, 5]);
    ctx.beginPath(); ctx.moveTo(canvas.width/2,0); ctx.lineTo(canvas.width/2,canvas.height); ctx.stroke(); ctx.setLineDash([]);
    ctx.fillStyle = '#4aff4a'; ctx.fillRect(player.x, player.y, player.w, player.h);
    ctx.fillStyle = '#ff4444'; ctx.fillRect(ai.x, ai.y, ai.w, ai.h);
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#4aff4a'; ctx.font = 'bold 20px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(pScore, canvas.width/4, 30);
    ctx.fillStyle = '#ff4444'; ctx.fillText(aScore, canvas.width*3/4, 30);
  };

  function update() {
    if (paused || !running) return;
    ball.x += ball.dx; ball.y += ball.dy;
    if (ball.y - ball.r < 0 || ball.y + ball.r > canvas.height) ball.dy *= -1;
    if (ball.x - ball.r < player.x + player.w && ball.y > player.y && ball.y < player.y + player.h) {
      ball.dx = Math.abs(ball.dx) * 1.05;
      ball.dy += (ball.y - (player.y + player.h/2)) * 0.1;
    }
    if (ball.x + ball.r > ai.x && ball.y > ai.y && ball.y < ai.y + ai.h) {
      ball.dx = -Math.abs(ball.dx) * 1.05;
      ball.dy += (ball.y - (ai.y + ai.h/2)) * 0.1;
    }
    if (ball.x < 0) { aScore++; if (aScore >= 5) { gameOver('AI Wins!'); return; } resetBall(); }
    if (ball.x > canvas.width) { pScore++; if (pScore >= 5) { gameOver('You Win!'); return; } resetBall(); }
    const c = ai.y + ai.h/2;
    if (c < ball.y - 10) ai.y += 3.5; else if (c > ball.y + 10) ai.y -= 3.5;
    ai.y = Math.max(0, Math.min(canvas.height - ai.h, ai.y));
    player.y = Math.max(0, Math.min(canvas.height - player.h, mouseY - player.h/2));
    updateUI('Pong', `${pScore} - ${aScore}`, '-');
    this.draw();
  }

  function gameOver(msg) {
    running = false; clearInterval(loop);
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = '#fff'; ctx.font = 'bold 28px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(msg, canvas.width/2, canvas.height/2);
  }

  this.start = function() {
    clearInterval(loop); pScore = 0; aScore = 0; resetBall();
    running = true; paused = false; this.draw();
    loop = setInterval(() => update.call(this), 16);
  };

  this.pause = function() {
    if (!running) return; paused = !paused;
    if (paused) {
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(0,0,canvas.width,canvas.height);
      ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
      ctx.fillText('Paused', canvas.width/2, canvas.height/2);
    } else { this.draw(); }
  };

  this.stop = function() { clearInterval(loop); running = false; showSnakeMobileControls(false); };
  this.handleKey = function(){};

  if (canvas) {
    canvas.addEventListener('mousemove', (e) => {
      const r = canvas.getBoundingClientRect(); mouseY = e.clientY - r.top;
    });
  }

  resetBall(); this.draw();
}

// ============================================================================
// GAME 3: BREAKOUT
// ============================================================================
function BreakoutGame() {
  setCanvasSize(480, 320);
  let paddle = {x:200, y:300, w:80, h:10};
  let ball = {x:240, y:290, dx:3, dy:-3, r:5};
  let bricks = [];
  let score = 0, lives = 3, lvl = 1;
  let loop = null;
  let paused = false;
  let running = false;
  let rightDown = false, leftDown = false;
  let mouseX = 240;

  const ROWS=5, COLS=8, BW=50, BH=18, PAD=4, OFF_TOP=40, OFF_L=20;
  const B_COLORS = ['#ff4444','#ff8844','#ffcc44','#44ff44','#4444ff'];

  function initBricks() {
    bricks=[];
    for (let r=0; r<ROWS; r++) for (let c=0; c<COLS; c++)
      bricks.push({x:OFF_L+c*(BW+PAD), y:OFF_TOP+r*(BH+PAD), w:BW, h:BH, color:B_COLORS[r], alive:true});
  }

  this.draw = function() {
    clearCanvas();
    bricks.forEach(b=>{ if(b.alive){ ctx.fillStyle=b.color; ctx.fillRect(b.x,b.y,b.w,b.h); ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(b.x,b.y,b.w,3); ctx.fillStyle='rgba(0,0,0,0.2)'; ctx.fillRect(b.x,b.y+BH-3,b.w,3); } });
    ctx.fillStyle='#aaaaaa'; ctx.fillRect(paddle.x,paddle.y,paddle.w,paddle.h); ctx.fillStyle='rgba(255,255,255,0.3)'; ctx.fillRect(paddle.x,paddle.y,paddle.w,3);
    ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(ball.x,ball.y,ball.r,0,Math.PI*2); ctx.fill();
  };

  function update() {
    if (paused||!running) return;
    ball.x+=ball.dx; ball.y+=ball.dy;
    if (ball.x-ball.r<0||ball.x+ball.r>canvas.width) ball.dx*=-1;
    if (ball.y-ball.r<0) ball.dy*=-1;
    if (ball.y+ball.r>paddle.y&&ball.y-ball.r<paddle.y+paddle.h&&ball.x>paddle.x&&ball.x<paddle.x+paddle.w) {
      ball.dy=-Math.abs(ball.dy); ball.dx+=(ball.x-(paddle.x+paddle.w/2))*0.05; ball.dx=Math.max(-6,Math.min(6,ball.dx));
    }
    bricks.forEach(b=>{ if(b.alive&&ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){ b.alive=false; ball.dy*=-1; score+=10*lvl; if(score>highScores.breakout){highScores.breakout=score;localStorage.setItem('breakoutHigh',score);} updateUI('Breakout',score,highScores.breakout); } });
    if (ball.y+ball.r>canvas.height) {
      lives--; if(lives<=0){gameOver();return;}
      ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-10; ball.dx=3; ball.dy=-3;
      updateUI('Breakout', score, highScores.breakout);
    }
    if (bricks.every(b=>!b.alive)) {
      lvl++; initBricks(); ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-10; ball.dx=3+lvl*0.5; ball.dy=-(3+lvl*0.5);
    }
    if (rightDown) paddle.x=Math.min(canvas.width-paddle.w,paddle.x+6);
    if (leftDown) paddle.x=Math.max(0,paddle.x-6);
    paddle.x=Math.max(0,Math.min(canvas.width-paddle.w,mouseX-paddle.w/2));
    this.draw();
  }

  function gameOver() {
    running=false; clearInterval(loop);
    ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.fillRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle='#fff'; ctx.font='bold 28px "Segoe UI",sans-serif'; ctx.textAlign='center';
    ctx.fillText('Game Over!', canvas.width/2, canvas.height/2-10);
    ctx.font='16px "Segoe UI",sans-serif'; ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+20);
  }

  this.start = function() {
    clearInterval(loop); score=0; lives=3; lvl=1; initBricks(); paddle.x=200;
    ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-10; ball.dx=3; ball.dy=-3;
    updateUI('Breakout', 0, highScores.breakout); running=true; paused=false; this.draw(); loop=setInterval(()=>update.call(this),16);
  };

  this.pause = function() {
    if (!running) return; paused=!paused;
    if (paused) { ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.font='bold 24px "Segoe UI",sans-serif'; ctx.textAlign='center'; ctx.fillText('Paused',canvas.width/2,canvas.height/2); }
    else { this.draw(); }
  };

  this.stop = function() { clearInterval(loop); running=false; };
  this.handleKey = function(){};

  document.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight')rightDown=true; if(e.key==='ArrowLeft')leftDown=true; });
  document.addEventListener('keyup', (e)=>{ if(e.key==='ArrowRight')rightDown=false; if(e.key==='ArrowLeft')leftDown=false; });
  if (canvas) {
    canvas.addEventListener('mousemove', (e)=>{ const r=canvas.getBoundingClientRect(); mouseX=e.clientX-r.left; });
  }

  initBricks(); this.draw();
}

// ============================================================================
// GAME 5: FLAPPY BIRD
// ============================================================================
const FLAPPY_ASSETS = {
    bg: new Image(),
    base: new Image(),
    pipe: new Image(),
    birdUp: new Image(),
    birdMid: new Image(),
    birdDown: new Image()
};

FLAPPY_ASSETS.bg.src = 'resources/sprites/background-day.png';
FLAPPY_ASSETS.base.src = 'resources/sprites/base.png';
FLAPPY_ASSETS.pipe.src = 'resources/sprites/pipe-green.png';
FLAPPY_ASSETS.birdUp.src = 'resources/sprites/yellowbird-upflap.png';
FLAPPY_ASSETS.birdMid.src = 'resources/sprites/yellowbird-midflap.png';
FLAPPY_ASSETS.birdDown.src = 'resources/sprites/yellowbird-downflap.png';

function FlappyGame() {
    setCanvasSize(288, 512);
    let bird = {x:80, y:200, vy:0, r:10};
    let pipes = [];
    let score = 0;
    let loop = null;
    let running = false;
    let frameCount = 0;
    const G=0.4, JUMP=-7, GAP=130, PW=50, SPEED=2.5;

    function reset() {
        bird={x:80,y:200,vy:0,r:10}; pipes=[]; score=0; frameCount=0;
        updateUI('Flappy Bird', 0, highScores.flappy);
    }

    function drawBackground() {
        if (FLAPPY_ASSETS.bg.complete) {
            ctx.drawImage(FLAPPY_ASSETS.bg, 0, 0, canvas.width, canvas.height);
            return;
        }
        ctx.fillStyle='#87CEEB'; ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function drawGround() {
        const baseImg = FLAPPY_ASSETS.base;
        if (baseImg.complete) {
            const baseWidth = 336;
            const baseHeight = 112;
            const groundY = canvas.height - 35;
            for (let x = -baseWidth; x < canvas.width + baseWidth; x += baseWidth) {
                ctx.drawImage(baseImg, x, groundY, baseWidth, 35);
            }
            ctx.fillStyle='#228B22'; ctx.fillRect(0, canvas.height - 35, canvas.width, 5);
            return;
        }
        ctx.fillStyle='#DEB887'; ctx.fillRect(0,canvas.height-30,canvas.width,30);
        ctx.fillStyle='#228B22'; ctx.fillRect(0,canvas.height-35,canvas.width,5);
    }

    function drawPipe(p) {
        const pipeImg = FLAPPY_ASSETS.pipe;
        const pipeWidth = 52;
        if (pipeImg.complete) {
            // 上管道：需要开口朝下（朝向间隙），所以翻转图片
            ctx.save();
            ctx.translate(p.x + pipeWidth / 2, p.top / 2);
            ctx.scale(1, -1);
            ctx.translate(-pipeWidth / 2, -p.top / 2);
            ctx.drawImage(pipeImg, 0, 0, pipeWidth, p.top);
            ctx.restore();

            // 下管道：需要开口朝上（朝向间隙），保持原样直接绘制
            const bottomHeight = canvas.height - p.bottom - 35;
            ctx.drawImage(pipeImg, p.x, p.bottom, pipeWidth, bottomHeight);
            return;
        }
        // Fallback
        ctx.fillStyle='#228B22'; ctx.fillRect(p.x,0,PW,p.top); ctx.fillRect(p.x,p.bottom,PW,canvas.height-p.bottom-35);
        ctx.fillStyle='#2E8B57'; ctx.fillRect(p.x-3,p.top-20,PW+6,20); ctx.fillRect(p.x-3,p.bottom,PW+6,20);
    }

    function drawBird() {
        const sprite = bird.vy < -2 ? FLAPPY_ASSETS.birdUp : bird.vy > 2 ? FLAPPY_ASSETS.birdDown : FLAPPY_ASSETS.birdMid;
        const birdSpriteX = 34;
        const birdSpriteY = 24;
        ctx.save();
        ctx.translate(bird.x, bird.y);
        ctx.rotate(Math.min(Math.PI/4, Math.max(-Math.PI/4, bird.vy * 0.05)));
        if (sprite && sprite.complete) {
            ctx.drawImage(sprite, -birdSpriteX/2, -birdSpriteY/2, birdSpriteX, birdSpriteY);
        } else {
            ctx.fillStyle='#FFD700'; ctx.beginPath(); ctx.arc(0,0,bird.r,0,Math.PI*2); ctx.fill();
            ctx.fillStyle='#fff'; ctx.beginPath(); ctx.arc(4,-4,4,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#000'; ctx.beginPath(); ctx.arc(6,-4,2,0,Math.PI*2); ctx.fill();
            ctx.fillStyle='#FF8C00'; ctx.beginPath(); ctx.moveTo(8,2); ctx.lineTo(18,5); ctx.lineTo(8,8); ctx.closePath(); ctx.fill();
            ctx.fillStyle='#FFA500'; ctx.beginPath(); ctx.ellipse(-4,4,8,5,0,0,Math.PI*2); ctx.fill();
        }
        ctx.restore();
    }

    this.draw = function() {
        drawBackground();
        pipes.forEach(drawPipe);
        drawGround();
        drawBird();
    };

    function update() {
        if (!running) return; frameCount++;
        bird.vy+=G; bird.y+=bird.vy;
        if (frameCount%100===0) { const top=50+Math.random()*(canvas.height-GAP-120); pipes.push({x:canvas.width,top:top,bottom:top+GAP,passed:false}); }
        pipes.forEach(p=>{ p.x-=SPEED; if(!p.passed&&p.x+PW<bird.x){p.passed=true;score++;updateUI('Flappy Bird',score,highScores.flappy);} });
        pipes=pipes.filter(p=>p.x>-PW);
        if (bird.y+bird.r>canvas.height-35||bird.y-bird.r<0){gameOver();return;}
        for (let p of pipes) if (bird.x+bird.r>p.x&&bird.x-bird.r<p.x+PW&&(bird.y-bird.r<p.top||bird.y+bird.r>p.bottom)){gameOver();return;}
        this.draw(); loop=requestAnimationFrame(()=>update.call(this));
    }

    function gameOver() {
        running=false; cancelAnimationFrame(loop);
        if (score>highScores.flappy) { highScores.flappy=score; localStorage.setItem('flappyBest',score); }
        ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#fff'; ctx.font='bold 28px "Segoe UI",sans-serif'; ctx.textAlign='center';
        ctx.fillText('Game Over!', canvas.width/2, canvas.height/2-20);
        ctx.font='18px "Segoe UI",sans-serif'; ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+10);
        if (score===highScores.flappy&&score>0) { ctx.fillStyle='#FFD700'; ctx.fillText('New Best!', canvas.width/2, canvas.height/2+35); }
    }

    this.start = function() { cancelAnimationFrame(loop); reset(); running=true; this.draw(); update.call(this); };
    this.pause = function() {};
    this.stop = function() { running=false; cancelAnimationFrame(loop); };
    this.handleKey = function(){};

    function flap() { if (!running) return; bird.vy=JUMP; }
    canvas.addEventListener('click', flap);
    canvas.addEventListener('touchstart', (e)=>{ e.preventDefault(); flap(); });

    reset(); this.draw();
}

// ============================================================================
// GAME 5: MEMORY MATCH
// ============================================================================
function MemoryGame() {
  setCanvasSize(400, 400);
  const EMOJIS = ['🍎','🍌','🍇','🍊','🍓','🍉','🍒','🥝'];
  let cards = [];
  let flipped = [];
  let matched = 0;
  let moves = 0;
  let isLocked = false;
  let timer = null;
  let seconds = 0;
  let running = false;
  const COLS = 4, ROWS = 4;
  const CW = 85, CH = 85, PAD = 10;
  const OFF_X = 20, OFF_Y = 20;

  function shuffle(arr) { for(let i=arr.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[arr[i],arr[j]]=[arr[j],arr[i]];} return arr; }

  function init() {
    const sel = EMOJIS.slice(0, 8);
    cards = shuffle([...sel, ...sel]).map((e,i)=>({
      emoji: e, index: i, flipped: false, matched: false,
      x: OFF_X + (i % COLS) * (CW + PAD), y: OFF_Y + Math.floor(i / COLS) * (CH + PAD)
    }));
    flipped = []; matched = 0; moves = 0; seconds = 0; isLocked = false;
    updateUI('Memory Match', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
  }

  this.draw = function() {
    clearCanvas();
    cards.forEach(c => {
      const cx = c.x + CW/2, cy = c.y + CH/2;
      ctx.save();
      ctx.translate(cx, cy);
      let flipAngle = 0;
      if (c.animating) {
        const progress = Math.min(1, (Date.now() - c.animStart) / c.animDuration);
        flipAngle = c.animTarget === 'front' ? progress * Math.PI : (1 - progress) * Math.PI;
        if (progress >= 1) {
          c.animating = false;
          if (c.animTarget === 'front') c.flipped = true;
          else c.flipped = false;
        }
      } else {
        flipAngle = c.flipped ? Math.PI : 0;
      }
      const scaleX = Math.abs(Math.cos(flipAngle));
      const isFront = flipAngle > Math.PI / 2;
      ctx.scale(scaleX, 1);
      if (isFront) {
        ctx.fillStyle = c.matched ? '#88dd88' : '#ffffff';
        ctx.fillRect(-CW/2, -CH/2, CW, CH);
        ctx.strokeStyle = c.matched ? '#228822' : '#333';
        ctx.lineWidth = 2;
        ctx.strokeRect(-CW/2, -CH/2, CW, CH);
        if (!c.matched) {
          ctx.fillStyle = '#333';
          ctx.font = '40px "Segoe UI",sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(c.emoji, 0, 0);
        }
      } else {
        ctx.fillStyle = '#aaaaaa';
        ctx.fillRect(-CW/2, -CH/2, CW, CH);
        ctx.strokeStyle = '#666';
        ctx.lineWidth = 2;
        ctx.strokeRect(-CW/2, -CH/2, CW, CH);
        ctx.fillStyle = '#777';
        ctx.font = 'bold 24px "Segoe UI",sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('?', 0, 0);
      }
      ctx.restore();
    });
  };

  function checkMatch() {
    if (flipped[0].emoji === flipped[1].emoji) {
      flipped[0].matched = true; flipped[1].matched = true;
      flipped = []; isLocked = false; matched++;
      updateUI('Memory Match', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
      if (matched === 8) {
        clearInterval(timer);
        setTimeout(() => {
          ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
          ctx.fillText('You Won!', canvas.width/2, canvas.height/2 - 15);
          ctx.font = '16px "Segoe UI",sans-serif';
          ctx.fillText(`Moves: ${moves}, Time: ${seconds}s`, canvas.width/2, canvas.height/2 + 15);
          if (moves < highScores.memory) {
            highScores.memory = moves;
            localStorage.setItem('memoryBest', moves);
            ctx.fillStyle = '#FFD700'; ctx.fillText('New Best!', canvas.width/2, canvas.height/2 + 40);
          }
        }, 300);
      }
    } else {
      setTimeout(() => {
        flipped.forEach(card => {
          card.animating = true;
          card.animStart = Date.now();
          card.animDuration = 300;
          card.animTarget = 'back';
        });
        const animLoop = () => {
          this.draw();
          if (flipped.some(c => c.animating)) {
            requestAnimationFrame(animLoop);
          } else {
            flipped = []; isLocked = false;
          }
        };
        requestAnimationFrame(animLoop);
      }, 600);
    }
  }

  this.start = function() {
    clearInterval(timer); init(); running = true; this.draw();
    timer = setInterval(() => { seconds++; updateUI('Memory Match', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`); }, 1000);
  };

  this.pause = function() {};
  this.stop = function() { clearInterval(timer); running = false; };
  this.handleKey = function(){};

  if (canvas) {
    canvas.addEventListener('click', (e) => {
      if (!running || isLocked) return;
      const r = canvas.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      const card = cards.find(c => mx >= c.x && mx <= c.x + CW && my >= c.y && my <= c.y + CH && !c.flipped && !c.matched && !c.animating);
      if (!card) return;
      card.animating = true;
      card.animStart = Date.now();
      card.animDuration = 300;
      card.animTarget = 'front';
      flipped.push(card);
      const animLoop = () => {
        this.draw();
        if (card.animating) {
          requestAnimationFrame(animLoop);
        } else {
          if (flipped.length === 2) {
            moves++;
            updateUI('Memory Match', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
            isLocked = true; checkMatch.call(this);
          }
        }
      };
      requestAnimationFrame(animLoop);
    });
  }

  init(); this.draw();
}

// ============================================================================
// ========================= KEYBOARD HANDLING ================================
// ============================================================================

document.addEventListener('keydown', (e) => {
  const gameKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','s','d','W','A','S','D'];
  if (gameKeys.includes(e.key) && currentGame && currentGame.running) {
    e.preventDefault();
  }
  if (currentGame && currentGame.handleKey) currentGame.handleKey(e);

  // Ctrl/Cmd + number to switch tabs (4 tabs now)
  if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '4') {
    const tabIndex = parseInt(e.key) - 1;
    const tab = document.querySelector(`.tab[data-tab="${tabIndex}"]`);
    if (tab) tab.click();
  }
});

// Init first game
if (canvas && ctx) {
  currentGame = new SnakeGame();
  updateUI('Snake', 0, highScores.snake);
}

// ============================================================================
// ========================= MOBILE CONTROLS ==================================
// ============================================================================

function showSnakeMobileControls(show) {
  let controls = document.getElementById('snake-mobile-controls');
  if (!controls) {
    controls = document.createElement('div');
    controls.id = 'snake-mobile-controls';
    controls.innerHTML = `
      <div class="snake-dpad">
        <button class="dpad-btn dpad-up" data-dir="up">▲</button>
        <div class="dpad-mid">
          <button class="dpad-btn dpad-left" data-dir="left">◀</button>
          <button class="dpad-btn dpad-center"></button>
          <button class="dpad-btn dpad-right" data-dir="right">▶</button>
        </div>
        <button class="dpad-btn dpad-down" data-dir="down">▼</button>
      </div>
    `;
    const gameWrapper = document.getElementById('game-wrapper');
    if (gameWrapper) gameWrapper.appendChild(controls);

    controls.querySelectorAll('.dpad-btn[data-dir]').forEach(btn => {
      btn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        const dir = btn.getAttribute('data-dir');
        if (currentGame && currentGame.handleKey) {
          const keyMap = {
            'up': {key: 'ArrowUp', preventDefault: () => {}},
            'down': {key: 'ArrowDown', preventDefault: () => {}},
            'left': {key: 'ArrowLeft', preventDefault: () => {}},
            'right': {key: 'ArrowRight', preventDefault: () => {}}
          };
          currentGame.handleKey(keyMap[dir]);
        }
        btn.style.transform = 'scale(0.9)';
        btn.style.background = 'rgba(255,255,255,0.4)';
      });
      btn.addEventListener('touchend', (e) => {
        e.preventDefault();
        btn.style.transform = 'scale(1)';
        btn.style.background = '';
      });
      btn.addEventListener('mousedown', (e) => {
        const dir = btn.getAttribute('data-dir');
        if (currentGame && currentGame.handleKey) {
          const keyMap = {
            'up': {key: 'ArrowUp', preventDefault: () => {}},
            'down': {key: 'ArrowDown', preventDefault: () => {}},
            'left': {key: 'ArrowLeft', preventDefault: () => {}},
            'right': {key: 'ArrowRight', preventDefault: () => {}}
          };
          currentGame.handleKey(keyMap[dir]);
        }
        btn.style.transform = 'scale(0.9)';
      });
      btn.addEventListener('mouseup', () => {
        btn.style.transform = 'scale(1)';
      });
    });
  }
  controls.style.display = show ? 'flex' : 'none';
}

// ============================================================================
// ========================= VISIBILITY CHANGE ================================
// ============================================================================

document.addEventListener('visibilitychange', function() {
  if (document.hidden) {
    document.title = "ヾ(￣▽￣)Bye~Bye~";
  } else {
    document.title = "又见面了哦(❁´◡`❁)";
    setTimeout(() => {
      document.title = "GKll44主页";
    }, 1000);
  }
});

// ============================================================================
// ========================= CONSOLE BANNER ===================================
// ============================================================================

console.log(' ██████╗ ██╗  ██╗██╗     ██╗██╗  ██╗██╗  ██╗');
console.log('██╔════╝ ██║ ██╔╝██║     ██║██║  ██║██║  ██║');
console.log('██║  ███╗█████╔╝ ██║     ██║███████║███████║');
console.log('██║   ██║██╔═██╗ ██║     ██║╚════██║╚══════╝');
console.log('╚██████╔╝██║  ██╗███████╗███████╗██║     ██║');
console.log(' ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝');