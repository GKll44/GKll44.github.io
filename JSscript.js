// ===== 日期显示 =====
let dateElement = document.getElementById('date');
let currentDate = new Date();
let formattedDate = currentDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
});
if (dateElement) dateElement.textContent = formattedDate;

// ===== 时间显示（实时时钟） =====
let timeElement = document.getElementById('time');

function updateTime() {
    currentDate = new Date();
    let formattedTime = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
    if (timeElement) timeElement.textContent = formattedTime;
}

updateTime();
setInterval(updateTime, 1000);

// ===== 动画标题 =====
const spans = document.querySelectorAll('#text-wrapper span');
let start = null;

function animate(timestamp) {
    if (!start) start = timestamp;
    const t = (timestamp - start) / 1000;

    spans.forEach((el, i) => {
        const phase = t * 2 + i * 0.8;
        const y = Math.sin(phase) * 20;
        const hue = (t * 30 + i * 45) % 360;
        const color = `hsl(${hue}, 70%, 75%)`;
        el.style.transform = `translateY(${y}px)`;
        el.style.color = color;
    });

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);

// ===== 标签系统 =====
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

// ===== 按钮演示 =====
const btnDemo = document.getElementById('btn-demo');
const btnCounter = document.getElementById('btn-counter');
let clickCount = 0;

if (btnDemo && btnCounter) {
    btnDemo.addEventListener('click', () => {
        clickCount++;
        btnCounter.textContent = `Clicked ${clickCount} time${clickCount !== 1 ? '秒' : ''}`;
        btnDemo.style.transform = 'scale(0.95)';
        setTimeout(() => { btnDemo.style.transform = 'scale(1)'; }, 100);
    });
}

// ===== 滑块演示 =====
const demoSlider = document.getElementById('demo-slider');
const sliderValue = document.getElementById('slider-value');

if (demoSlider && sliderValue) {
    demoSlider.addEventListener('input', () => {
        sliderValue.textContent = demoSlider.value;
    });
}

// ===== 页面加载计数器 =====
const loadCountEl = document.getElementById('load-count');
const currentDateEl = document.getElementById('current-date');
const currentTimeEl = document.getElementById('current-time');

if (currentDateEl) currentDateEl.textContent = formattedDate;
if (currentTimeEl) {
    currentTimeEl.textContent = currentDate.toLocaleTimeString('en-US', {
        hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
    });
    setInterval(() => {
        currentTimeEl.textContent = new Date().toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true
        });
    }, 1000);
}

let pageLoadCount = parseInt(localStorage.getItem('pageLoadCount'), 10) || 0;
pageLoadCount++;
localStorage.setItem('pageLoadCount', pageLoadCount);

function formatCountWord(n) {
    if (n === 1) return 'once';
    if (n === 2) return '两次';
    return `${n} times`;
}

if (loadCountEl) {
    loadCountEl.textContent = pageLoadCount;
    const msgEl = document.getElementById('page-load-message');
    if (msgEl) msgEl.innerHTML = `And now, you've already loaded this page ${formatCountWord(pageLoadCount)}!`;
}

const resetBtn = document.getElementById('reset-count');
if (resetBtn) {
    resetBtn.addEventListener('click', () => {
        localStorage.removeItem('pageLoadCount');
        pageLoadCount = 1;
        if (loadCountEl) loadCountEl.textContent = pageLoadCount;
        const msgEl = document.getElementById('page-load-message');
        if (msgEl) msgEl.innerHTML = `And now, you've already loaded this page once!`;
    });
}

// ===== 输入回显演示 =====
const demoInput = document.getElementById('demo-input');
const inputEcho = document.getElementById('input-echo');

if (demoInput && inputEcho) {
    demoInput.addEventListener('input', () => {
        const val = demoInput.value.trim();
        inputEcho.textContent = val ? val : '(nothing yet)';
    });
}

// ============================================================================
// ============================= 小游戏 ===================================
// ============================================================================

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gameNameEl = document.getElementById('game-name');
const gameScoreEl = document.getElementById('game-score');
const gameHighEl = document.getElementById('game-high');
const startBtn = document.getElementById('game-start');
const pauseBtn = document.getElementById('game-pause');
const changeBtn = document.getElementById('change-game');
const sidePanel = document.getElementById('game-side-panel');

const GAMES = ['贪吃蛇', '乒乓球', '打砖块', '像素鸟', '记忆配对'];
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
    canvas.width = w;
    canvas.height = h;
}

function clearCanvas() {
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function stopCurrentGame() {
    if (currentGame && currentGame.stop) currentGame.stop();
    currentGame = null;
}

function updateUI(name, score, high) {
    if (gameNameEl) gameNameEl.textContent = name;
    if (gameScoreEl) gameScoreEl.textContent = score !== undefined ? score : '0';
    if (gameHighEl) gameHighEl.textContent = high !== undefined ? high : '0';
}

function showSidePanel(show) {
    if (sidePanel) sidePanel.style.display = show ? 'flex' : 'none';
}

function switchGame() {
    stopCurrentGame();
    currentGameIndex = (currentGameIndex + 1) % GAMES.length;
    const name = GAMES[currentGameIndex];
    updateUI(name, 0, highScores[Object.keys(highScores)[currentGameIndex]]);

    switch (name) {
        case '贪吃蛇': currentGame = new SnakeGame(); break;
        case '乒乓球': currentGame = new PongGame(); break;
        case '打砖块': currentGame = new BreakoutGame(); break;
        case '像素鸟': currentGame = new FlappyGame(); break;
        case '记忆配对': currentGame = new MemoryGame(); break;
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
// 游戏 1：贪吃蛇
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
        updateUI('贪吃蛇', score, highScores.snake);
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
            ctx.fillRect(seg.x*gridSize+1, seg.y*gridSize+1, gridSize, gridSize);
        });
        ctx.fillStyle = '#ff4444';
        ctx.beginPath();
        ctx.arc(food.x*gridSize+gridSize/2, food.y*gridSize+gridSize/2, gridSize/2, 0, Math.PI*2);
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
            updateUI('贪吃蛇', score, highScores.snake);
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
        ctx.fillText('游戏结束！', canvas.width/2, canvas.height/2-10);
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
            ctx.fillText('已暂停', canvas.width/2, canvas.height/2);
        } else {
            this.draw();
        }
    };

    this.stop = function() { clearInterval(loop); running = false; showSnakeMobileControls(false); };

    this.handleKey = function(e) {
        if (!running || paused) return;
        const k = e.key.toLowerCase();
        if ((k === 'arrowup' || k === 'w') && dy === 0) nextDir = {dx:0, dy:-1};
        else if ((k === 'arrowdown' || k === '秒') && dy === 0) nextDir = {dx:0, dy:1};
        else if ((k === 'arrowleft' || k === 'a') && dx === 0) nextDir = {dx:-1, dy:0};
        else if ((k === 'arrowright' || k === 'd') && dx === 0) nextDir = {dx:1, dy:0};
    };

    init();
    this.draw();
}

// ============================================================================
// 游戏 2：乒乓球
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
        if (ball.x < 0) { aScore++; if (aScore >= 5) { gameOver('AI 赢了！'); return; } resetBall(); }
        if (ball.x > canvas.width) { pScore++; if (pScore >= 5) { gameOver('你赢了！'); return; } resetBall(); }
        const c = ai.y + ai.h/2;
        if (c < ball.y - 10) ai.y += 3.5; else if (c > ball.y + 10) ai.y -= 3.5;
        ai.y = Math.max(0, Math.min(canvas.height - ai.h, ai.y));
        player.y = Math.max(0, Math.min(canvas.height - player.h, mouseY - player.h/2));
        updateUI('乒乓球', `${pScore} - ${aScore}`, '-');
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
            ctx.fillText('已暂停', canvas.width/2, canvas.height/2);
        } else { this.draw(); }
    };

    this.stop = function() { clearInterval(loop); running = false; showSnakeMobileControls(false); };
    this.handleKey = function(){};

    canvas.addEventListener('mousemove', (e) => {
        const r = canvas.getBoundingClientRect(); mouseY = e.clientY - r.top;
    });

    resetBall(); this.draw();
}

// 游戏 4：打砖块
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
        bricks.forEach(b=>{ if(b.alive&&ball.x>b.x&&ball.x<b.x+b.w&&ball.y>b.y&&ball.y<b.y+b.h){ b.alive=false; ball.dy*=-1; score+=10*lvl; if(score>highScores.breakout){highScores.breakout=score;localStorage.setItem('breakoutHigh',score);} updateUI('打砖块',score,highScores.breakout); } });
        if (ball.y+ball.r>canvas.height) {
            lives--; if(lives<=0){gameOver();return;}
            ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-10; ball.dx=3; ball.dy=-3;
            updateUI('打砖块', score, highScores.breakout);
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
        ctx.fillText('游戏结束！', canvas.width/2, canvas.height/2-10);
        ctx.font='16px "Segoe UI",sans-serif'; ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+20);
    }

    this.start = function() {
        clearInterval(loop); score=0; lives=3; lvl=1; initBricks(); paddle.x=200;
        ball.x=paddle.x+paddle.w/2; ball.y=paddle.y-10; ball.dx=3; ball.dy=-3;
        updateUI('打砖块', 0, highScores.breakout); running=true; paused=false; this.draw(); loop=setInterval(()=>update.call(this),16);
    };

    this.pause = function() {
        if (!running) return; paused=!paused;
        if (paused) { ctx.fillStyle='rgba(0,0,0,0.5)'; ctx.fillRect(0,0,canvas.width,canvas.height); ctx.fillStyle='#fff'; ctx.font='bold 24px "Segoe UI",sans-serif'; ctx.textAlign='center'; ctx.fillText('已暂停',canvas.width/2,canvas.height/2); }
        else { this.draw(); }
    };

    this.stop = function() { clearInterval(loop); running=false; };
    this.handleKey = function(){};

    document.addEventListener('keydown', (e)=>{ if(e.key==='ArrowRight')rightDown=true; if(e.key==='ArrowLeft')leftDown=true; });
    document.addEventListener('keyup', (e)=>{ if(e.key==='ArrowRight')rightDown=false; if(e.key==='ArrowLeft')leftDown=false; });
    canvas.addEventListener('mousemove', (e)=>{ const r=canvas.getBoundingClientRect(); mouseX=e.clientX-r.left; });

    initBricks(); this.draw();
}

// ============================================================================
// 游戏 5：像素鸟
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
    let bgX = 0;
    let groundX = 0;
    const G=0.4, JUMP=-7, GAP=130, PW=50, SPEED=2.5, BG_SPEED=0.35;

    function reset() {
        bird={x:80,y:200,vy:0,r:10}; pipes=[]; score=0; frameCount=0; bgX=0; groundX=0;
        updateUI('像素鸟', 0, highScores.flappy);
    }

    function drawBackground() {
        const bgImg = FLAPPY_ASSETS.bg;
        if (bgImg.complete) {
            const bgWidth = bgImg.naturalWidth || canvas.width;
            const offset = bgX % bgWidth;
            for (let x = -offset; x < canvas.width + bgWidth; x += bgWidth) {
                ctx.drawImage(bgImg, x, 0, bgWidth, canvas.height);
            }
            return;
        }
        ctx.fillStyle='#87CEEB'; ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    function drawGround() {
        const baseImg = FLAPPY_ASSETS.base;
        if (baseImg.complete) {
            const baseWidth = baseImg.naturalWidth || 336;
            const groundY = canvas.height - 35;
            const offset = groundX % baseWidth;
            for (let x = -offset; x < canvas.width + baseWidth; x += baseWidth) {
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
        bgX += BG_SPEED;
        groundX += SPEED;
        bird.vy+=G; bird.y+=bird.vy;
        if (frameCount%100===0) { const top=50+Math.random()*(canvas.height-GAP-120); pipes.push({x:canvas.width,top:top,bottom:top+GAP,passed:false}); }
        pipes.forEach(p=>{ p.x-=SPEED; if(!p.passed&&p.x+PW<bird.x){p.passed=true;score++;updateUI('像素鸟',score,highScores.flappy);} });
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
        ctx.fillText('游戏结束！', canvas.width/2, canvas.height/2-20);
        ctx.font='18px "Segoe UI",sans-serif'; ctx.fillText(`Score: ${score}`, canvas.width/2, canvas.height/2+10);
        if (score===highScores.flappy&&score>0) { ctx.fillStyle='#FFD700'; ctx.fillText('新纪录！', canvas.width/2, canvas.height/2+35); }
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
// 游戏 6：记忆配对（基于画布）
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
        updateUI('记忆配对', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
    }

    this.draw = function() {
        clearCanvas();
        cards.forEach(c => {
            const cx = c.x + CW/2, cy = c.y + CH/2;
            ctx.save();
            ctx.translate(cx, cy);

            // 翻牌动画：计算当前翻转角度（0 = 背面，PI = 正面）
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

            // 3D 翻转效果
            const scaleX = Math.abs(Math.cos(flipAngle));
            const isFront = flipAngle > Math.PI / 2;

            ctx.scale(scaleX, 1);

            if (isFront) {
                // 正面（显示 emoji）
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
                // 背面（显示 ?）
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
            updateUI('记忆配对', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
            if (matched === 8) {
                clearInterval(timer);
                setTimeout(() => {
                    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.fillStyle = '#fff'; ctx.font = 'bold 24px "Segoe UI",sans-serif'; ctx.textAlign = 'center';
                    ctx.fillText('你赢了！', canvas.width/2, canvas.height/2 - 15);
                    ctx.font = '16px "Segoe UI",sans-serif';
                    ctx.fillText(`Moves: ${moves}, Time: ${seconds}s`, canvas.width/2, canvas.height/2 + 15);
                    if (moves < highScores.memory) {
                        highScores.memory = moves;
                        localStorage.setItem('memoryBest', moves);
                        ctx.fillStyle = '#FFD700'; ctx.fillText('新纪录！', canvas.width/2, canvas.height/2 + 40);
                    }
                }, 300);
            }
        } else {
            // 不匹配：翻回动画
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
        timer = setInterval(() => { seconds++; updateUI('记忆配对', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`); }, 1000);
    };

    this.pause = function() {};
    this.stop = function() { clearInterval(timer); running = false; };
    this.handleKey = function(){};

    canvas.addEventListener('click', (e) => {
        if (!running || isLocked) return;
        const r = canvas.getBoundingClientRect();
        const mx = e.clientX - r.left, my = e.clientY - r.top;
        const card = cards.find(c => mx >= c.x && mx <= c.x + CW && my >= c.y && my <= c.y + CH && !c.flipped && !c.matched && !c.animating);
        if (!card) return;

        // 启动翻牌动画
        card.animating = true;
        card.animStart = Date.now();
        card.animDuration = 300; // 300ms 翻牌动画
        card.animTarget = 'front';
        flipped.push(card);

        // 动画循环
        const animLoop = () => {
            this.draw();
            if (card.animating) {
                requestAnimationFrame(animLoop);
            } else {
                if (flipped.length === 2) {
                    moves++;
                    updateUI('记忆配对', `Moves: ${moves}`, `Best: ${highScores.memory === 9999 ? '-' : highScores.memory}`);
                    isLocked = true; checkMatch.call(this);
                }
            }
        };
        requestAnimationFrame(animLoop);
    });

    init(); this.draw();
}

document.addEventListener('keydown', (e) => {
    const gameKeys = ['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' ','w','a','秒','d','W','A','S','D'];
    if (gameKeys.includes(e.key) && currentGame && currentGame.running) {
        e.preventDefault();
    }
    if (currentGame && currentGame.handleKey) currentGame.handleKey(e);
});

// Init first game
currentGame = new SnakeGame();
updateUI('贪吃蛇', 0, highScores.snake);

// ===== 控制台横幅 =====
console.log(' ██████╗ ██╗  ██╗██╗     ██╗██╗  ██╗██╗  ██╗');
console.log('██╔════╝ ██║ ██╔╝██║     ██║██║  ██║██║  ██║');
console.log('██║  ███╗█████╔╝ ██║     ██║███████║███████║');
console.log('██║   ██║██╔═██╗ ██║     ██║╚════██║╚══════╝');
console.log('╚██████╔╝██║  ██╗███████╗███████╗██║     ██║');
console.log(' ╚═════╝ ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝     ╚═╝');

// ===== 贪吃蛇移动端控制 =====
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

        // 绑定方向键事件
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
                btn.style.background = 'linear-gradient(to bottom, #dcdcdc 0%, #fefefe 100%)';
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
let uptimeSeconds = 0;
const uptimeEl = document.getElementById('stat-uptime');
if (uptimeEl) {
    setInterval(() => {
        uptimeSeconds++;
        uptimeEl.textContent = uptimeSeconds;
    }, 1000);
}

// ===== 回到顶部按钮 =====
const scrollTopBtn = document.createElement('button');
scrollTopBtn.className = 'scroll-top';
scrollTopBtn.innerHTML = '▲';
scrollTopBtn.title = 'Scroll to top';
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

// ===== 消息提示系统 =====
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

// ===== 计算器 =====
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

// ===== 颜色选择器 =====
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

// ===== 随机名言 =====
const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "Innovation distinguishes between a leader and a follower.", author: "Steve Jobs" },
    { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "It is during our darkest moments that we must focus to see the light.", author: "Aristotle" },
    { text: "Do not go where the path may lead, go instead where there is no path and leave a trail.", author: "Ralph Waldo Emerson" },
    { text: "The greatest glory in living lies not in never falling, but in rising every time we fall.", author: "Nelson Mandela" },
    { text: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { text: "Your time is limited, so don't waste it living someone else's life.", author: "Steve Jobs" },
    { text: "If life were predictable it would cease to be life, and be without flavor.", author: "Eleanor Roosevelt" },
    { text: "Spread love everywhere you go. Let no one ever come to you without leaving happier.", author: "Mother Teresa" },
    { text: "Tell me and I forget. Teach me and I remember. Involve me and I learn.", author: "Benjamin Franklin" },
    { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
    { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" },
    { text: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { text: "The best way to predict the future is to invent it.", author: "Alan Kay" },
    { text: "I have not failed. I've just found 10,000 ways that won't work.", author: "Thomas A. Edison" },
    { text: "The only limit to our realization of tomorrow will be our doubts of today.", author: "Franklin D. Roosevelt" },
    { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" }
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

// ===== 密码生成器 =====
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
                showToast('请先生成密码！');
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

// ===== 键盘快捷键 =====
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + 数字键切换标签
    if ((e.ctrlKey || e.metaKey) && e.key >= '1' && e.key <= '5') {
        const tabIndex = parseInt(e.key) - 1;
        const tab = document.querySelector(`.tab[data-tab="${tabIndex}"]`);
        if (tab) tab.click();
    }
});
