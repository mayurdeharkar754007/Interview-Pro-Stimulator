// ====================================================
// InterviewPro Simulator — Main Application Logic
// ====================================================

// ── STATE ──
const state = {
  screen: 'start',
  difficulty: 'easy',
  role: 'all',
  mode: 'timed',
  soundEnabled: localStorage.getItem('interviewpro_sound') !== 'off',
  questions: [],
  currentIndex: 0,
  score: 0,
  totalTime: 0,
  timerValue: 60,
  timerMax: 60,
  timerInterval: null,
  answered: false,
  results: [],
  focusChecksPassed: 0,
  focusCheckActive: false,
  focusInterval: null,
  highScore: parseInt(localStorage.getItem('interviewpro_highscore') || '0'),
  startTime: 0,
  streak: 0,
  bestStreak: 0,
  earnedBadges: JSON.parse(localStorage.getItem('interviewpro_badges') || '[]'),
  sessionHistory: JSON.parse(localStorage.getItem('interviewpro_history') || '[]')
};

// ── THEME MANAGEMENT ──
function initTheme() {
  const saved = localStorage.getItem('interviewpro_theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = saved || (prefersDark ? 'dark' : 'dark');
  applyTheme(theme);
}

function applyTheme(theme) {
  if (theme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) toggleBtn.textContent = theme === 'light' ? '☀️' : '🌙';
  localStorage.setItem('interviewpro_theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('interviewpro_theme') || 'dark';
  applyTheme(current === 'dark' ? 'light' : 'dark');
}

// ── DIFFICULTY SETTINGS ──
const DIFFICULTY_SETTINGS = {
  easy: { time: 90, points: 10, penalty: 0, questionCount: 10, focusFreq: 5 },
  medium: { time: 60, points: 15, penalty: -5, questionCount: 10, focusFreq: 3 },
  hard: { time: 30, points: 20, penalty: -10, questionCount: 10, focusFreq: 2 }
};

// ── DOM REFS ──
const $ = (id) => document.getElementById(id);
const screens = {
  start: $('screen-start'),
  countdown: $('screen-countdown'),
  interview: $('screen-interview'),
  results: $('screen-results')
};

// ── SOUND SYNTHESIS ──
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx;
function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new AudioCtx();
}
function playTone(freq, duration, type = 'sine', vol = 0.15) {
  if (!state.soundEnabled) return;
  try {
    ensureAudioCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    gain.gain.value = vol;
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + duration);
  } catch (e) { /* audio not supported */ }
}
function sfxCorrect() { playTone(523, 0.1); setTimeout(() => playTone(659, 0.1), 100); setTimeout(() => playTone(784, 0.2), 200); }
function sfxIncorrect() { playTone(300, 0.15, 'sawtooth'); setTimeout(() => playTone(200, 0.25, 'sawtooth'), 150); }
function sfxTick() { playTone(800, 0.03, 'square', 0.05); }
function sfxAlert() { playTone(880, 0.1); setTimeout(() => playTone(660, 0.1), 120); setTimeout(() => playTone(880, 0.1), 240); }

// ── SOUND TOGGLE ──
function initSoundToggle() {
  const btn = $('soundToggle');
  btn.textContent = state.soundEnabled ? '🔊' : '🔇';
  btn.addEventListener('click', () => {
    state.soundEnabled = !state.soundEnabled;
    btn.textContent = state.soundEnabled ? '🔊' : '🔇';
    localStorage.setItem('interviewpro_sound', state.soundEnabled ? 'on' : 'off');
  });
}

// ── PARTICLE BACKGROUND ──
(function initParticles() {
  const canvas = $('particleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
  resize();
  window.addEventListener('resize', resize);

  for (let i = 0; i < 50; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 0.5,
      a: Math.random() * 0.3 + 0.05
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      const pc = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '13, 148, 136';
      ctx.fillStyle = `rgba(${pc}, ${p.a})`;
      ctx.fill();
    });
    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const pc2 = getComputedStyle(document.documentElement).getPropertyValue('--particle-color').trim() || '13, 148, 136';
          ctx.strokeStyle = `rgba(${pc2}, ${0.06 * (1 - dist / 120)})`;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

// ── INJECT SVG GRADIENT DEFS ──
(function injectSVGDefs() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.style.position = 'absolute';
  svg.style.width = '0';
  svg.style.height = '0';
  svg.innerHTML = `
    <defs>
      <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d9488"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
      <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0d9488"/>
        <stop offset="100%" stop-color="#2563eb"/>
      </linearGradient>
    </defs>`;
  document.body.prepend(svg);
})();

// ── SCREEN MANAGEMENT ──
function showScreen(name) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[name].classList.add('active');
  state.screen = name;
}

// ── START SCREEN LOGIC ──
function initStartScreen() {
  // Mode buttons
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.mode = btn.dataset.mode;
    });
  });
  // Difficulty buttons
  document.querySelectorAll('.diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.difficulty = btn.dataset.difficulty;
    });
  });
  // Role buttons
  document.querySelectorAll('.role-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.role-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.role = btn.dataset.role;
    });
  });
  // Start button
  $('btnStartInterview').addEventListener('click', beginCountdown);
  // Stats
  updateStartScreenStats();
  renderBadgesShowcase();
}

function updateStartScreenStats() {
  $('highScoreDisplay').textContent = state.highScore > 0 ? state.highScore : '--';
  $('totalSessionsDisplay').textContent = state.sessionHistory.length;
  const totalQ = state.sessionHistory.reduce((a, s) => a + s.total, 0);
  const totalC = state.sessionHistory.reduce((a, s) => a + s.correct, 0);
  $('lifetimeAccuracyDisplay').textContent = totalQ > 0 ? Math.round((totalC / totalQ) * 100) + '%' : '--%';
}

// ── COUNTDOWN ──
function beginCountdown() {
  ensureAudioCtx();
  showScreen('countdown');
  let count = 3;
  $('countdownText').textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) {
      $('countdownText').textContent = count;
      playTone(600, 0.1);
    } else {
      clearInterval(interval);
      playTone(900, 0.2);
      startInterview();
    }
  }, 1000);
}

// ── START INTERVIEW ──
function startInterview() {
  ensureAudioCtx();
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const categories = ROLE_CATEGORIES[state.role];

  // Filter & shuffle questions
  let pool = QUESTION_BANK.filter(q => categories.includes(q.category));
  if (state.difficulty !== 'easy') {
    const diffOrder = ['easy', 'medium', 'hard'];
    const minIdx = diffOrder.indexOf(state.difficulty);
    pool = pool.filter(q => diffOrder.indexOf(q.difficulty) >= minIdx - 1);
  }
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  state.questions = pool.slice(0, Math.min(settings.questionCount, pool.length));
  state.currentIndex = 0;
  state.score = 0;
  state.results = [];
  state.focusChecksPassed = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.startTime = Date.now();
  state.timerMax = settings.time;

  // Practice mode adjustments
  const isPractice = state.mode === 'practice';
  $('timerContainer').style.display = isPractice ? 'none' : '';
  $('interviewBadge').textContent = isPractice ? 'PRACTICE MODE' : 'LIVE INTERVIEW';
  $('interviewBadge').className = isPractice ? 'practice-badge' : 'interview-badge';
  $('btnShowAnswer').style.display = isPractice ? '' : 'none';
  $('streakValue').textContent = '0';
  $('streakDisplay').classList.remove('active');

  $('totalQuestions').textContent = state.questions.length;
  $('scoreDisplay').textContent = '0';
  showScreen('interview');
  loadQuestion();
  if (!isPractice) scheduleFocusCheck();
}

// ── LOAD QUESTION ──
function loadQuestion() {
  if (state.currentIndex >= state.questions.length) {
    endInterview();
    return;
  }

  const q = state.questions[state.currentIndex];
  state.answered = false;

  // Update UI
  $('questionNum').textContent = state.currentIndex + 1;
  $('progressBar').style.width = `${((state.currentIndex + 1) / state.questions.length) * 100}%`;
  $('categoryBadge').textContent = q.category;
  $('questionText').textContent = q.question;

  // Difficulty tag
  const tag = $('questionDiffTag');
  tag.textContent = q.difficulty.toUpperCase();
  tag.className = 'question-difficulty-tag' + (q.difficulty !== 'easy' ? ' ' + q.difficulty : '');

  // Interviewer speech
  const speeches = [
    "Let's see how you handle this one...",
    "Think carefully before answering.",
    "Take your time, but remember the clock is ticking!",
    "Here's your next challenge.",
    "This one tests your fundamentals.",
    "Interesting question coming up..."
  ];
  $('interviewerSpeech').textContent = speeches[Math.floor(Math.random() * speeches.length)];
  setAvatarMood('neutral');

  // Options
  const grid = $('optionsGrid');
  grid.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    btn.innerHTML = `<span class="option-label">${labels[i]}</span><span class="option-text">${opt}</span>`;
    btn.addEventListener('click', () => handleAnswer(i));
    grid.appendChild(btn);
  });

  // Card animation
  $('questionCard').style.animation = 'none';
  $('questionCard').offsetHeight; // reflow
  $('questionCard').style.animation = 'fadeIn 0.4s ease';

  // Show answer button handler for practice mode
  $('btnShowAnswer').onclick = () => {
    if (state.answered) return;
    handleAnswer(-1); // -1 means show answer without selecting
  };

  // Start timer (skip in practice mode)
  if (state.mode === 'timed') startTimer();
}

// ── TIMER ──
function startTimer() {
  clearInterval(state.timerInterval);
  state.timerValue = state.timerMax;
  updateTimerDisplay();
  const container = document.querySelector('.timer-container');
  container.classList.remove('warning', 'danger');

  state.timerInterval = setInterval(() => {
    if (state.answered || state.focusCheckActive) return;
    state.timerValue--;
    updateTimerDisplay();

    if (state.timerValue <= 10 && state.timerValue > 5) {
      container.classList.add('warning');
      container.classList.remove('danger');
      sfxTick();
    } else if (state.timerValue <= 5) {
      container.classList.remove('warning');
      container.classList.add('danger');
      sfxTick();
    }

    if (state.timerValue <= 0) {
      clearInterval(state.timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function updateTimerDisplay() {
  $('timerText').textContent = state.timerValue;
  const circumference = 2 * Math.PI * 52; // r=52
  const offset = circumference * (1 - state.timerValue / state.timerMax);
  $('timerRing').style.strokeDashoffset = offset;
}

function handleTimeout() {
  state.answered = true;
  const q = state.questions[state.currentIndex];
  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
  });

  state.streak = 0;
  updateStreakDisplay();
  state.results.push({ question: q, answered: null, correct: false, timedOut: true });
  if (settings.penalty) {
    state.score = Math.max(0, state.score + settings.penalty);
    $('scoreDisplay').textContent = state.score;
  }

  sfxIncorrect();
  setAvatarMood('sad');
  showFeedback(false, q.explanation, settings.penalty, true);
}

// ── ANSWER HANDLING ──
function handleAnswer(selectedIdx) {
  if (state.answered) return;
  state.answered = true;
  clearInterval(state.timerInterval);

  const q = state.questions[state.currentIndex];
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const isCorrect = selectedIdx === q.correct;
  const isShowAnswer = selectedIdx === -1; // practice mode show answer

  // Highlight options
  document.querySelectorAll('.option-btn').forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.correct) btn.classList.add('correct');
    if (i === selectedIdx && !isCorrect && !isShowAnswer) btn.classList.add('incorrect');
  });

  // Streak tracking
  if (isCorrect) {
    state.streak++;
    if (state.streak > state.bestStreak) state.bestStreak = state.streak;
  } else {
    state.streak = 0;
  }
  updateStreakDisplay();

  // Score (no scoring in practice mode or show-answer)
  const isPractice = state.mode === 'practice';
  const points = isPractice ? 0 : (isCorrect ? settings.points + (state.streak >= 3 ? 5 : 0) : (settings.penalty || 0));
  state.score = Math.max(0, state.score + points);
  $('scoreDisplay').textContent = state.score;

  // Record result
  state.results.push({ question: q, answered: isShowAnswer ? null : selectedIdx, correct: isCorrect, timedOut: false });

  // Effects
  if (isCorrect) { sfxCorrect(); setAvatarMood('happy'); }
  else { sfxIncorrect(); setAvatarMood('sad'); }

  showFeedback(isCorrect, q.explanation, points, false);
}

function updateStreakDisplay() {
  $('streakValue').textContent = state.streak;
  const el = $('streakDisplay');
  if (state.streak >= 2) {
    el.classList.add('active');
    el.style.animation = 'none'; el.offsetHeight; el.style.animation = 'streakGlow 0.6s ease';
  } else {
    el.classList.remove('active');
  }
}

function setAvatarMood(mood) {
  const mouth = document.querySelector('.avatar-mouth');
  mouth.className = 'avatar-mouth ' + mood;
}

function showFeedback(isCorrect, explanation, points, timedOut) {
  $('feedbackIcon').textContent = isCorrect ? '✅' : (timedOut ? '⏰' : '❌');
  $('feedbackTitle').textContent = isCorrect ? 'Correct!' : (timedOut ? 'Time\'s Up!' : 'Incorrect!');
  $('feedbackTitle').className = 'feedback-title ' + (isCorrect ? 'correct-title' : 'incorrect-title');
  $('feedbackExplanation').textContent = explanation;

  const isPractice = state.mode === 'practice';
  $('feedbackScoreChange').textContent = isPractice ? '' : (points >= 0 ? `+${points} points` : `${points} points`);
  $('feedbackScoreChange').className = 'feedback-score-change ' + (points >= 0 ? 'positive' : 'negative');

  // Streak message
  const streakEl = $('feedbackStreak');
  if (state.streak >= 3) {
    streakEl.style.display = '';
    streakEl.textContent = `🔥 ${state.streak} in a row! +5 bonus`;
  } else if (state.streak === 2) {
    streakEl.style.display = '';
    streakEl.textContent = `🔥 ${state.streak} streak! One more for bonus!`;
  } else {
    streakEl.style.display = 'none';
  }

  const overlay = $('feedbackOverlay');
  overlay.classList.add('active');

  $('interviewerSpeech').textContent = isCorrect
    ? ['Great job! You nailed it!', 'Excellent answer!', 'Perfect! Moving on...'][Math.floor(Math.random() * 3)]
    : ['Not quite. Let\'s review.', 'Good effort, but let me explain.', 'That\'s a tricky one.'][Math.floor(Math.random() * 3)];
}

// Next button
$('btnNext').addEventListener('click', () => {
  $('feedbackOverlay').classList.remove('active');
  state.currentIndex++;
  loadQuestion();
});

// ── FOCUS CHECK (ANTI-GRAVITY MODE) ──
function scheduleFocusCheck() {
  clearInterval(state.focusInterval);
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  // Trigger every N questions
  state.focusInterval = setInterval(() => {
    if (state.screen !== 'interview' || state.answered || state.focusCheckActive) return;
    if (Math.random() < 0.4) triggerFocusCheck();
  }, settings.focusFreq * 8000);
}

function triggerFocusCheck() {
  state.focusCheckActive = true;
  sfxAlert();
  const overlay = $('focusCheckOverlay');
  overlay.classList.add('active');

  let countdown = 5;
  $('focusTimer').textContent = countdown;
  const focusCountdown = setInterval(() => {
    countdown--;
    $('focusTimer').textContent = countdown;
    if (countdown <= 0) {
      clearInterval(focusCountdown);
      // Penalty for not responding
      state.score = Math.max(0, state.score - 5);
      $('scoreDisplay').textContent = state.score;
      closeFocusCheck();
    }
  }, 1000);

  $('btnFocusConfirm').onclick = () => {
    clearInterval(focusCountdown);
    state.focusChecksPassed++;
    closeFocusCheck();
  };

  // Store interval ref for cleanup
  overlay.dataset.interval = focusCountdown;
}

function closeFocusCheck() {
  state.focusCheckActive = false;
  $('focusCheckOverlay').classList.remove('active');
}

// ── END INTERVIEW ──
function endInterview() {
  clearInterval(state.timerInterval);
  clearInterval(state.focusInterval);
  state.totalTime = Math.round((Date.now() - state.startTime) / 1000);

  if (state.score > state.highScore) {
    state.highScore = state.score;
    localStorage.setItem('interviewpro_highscore', state.score.toString());
  }

  // Save session history
  const total = state.results.length;
  const correct = state.results.filter(r => r.correct).length;
  state.sessionHistory.push({ date: Date.now(), total, correct, score: state.score, difficulty: state.difficulty });
  if (state.sessionHistory.length > 20) state.sessionHistory = state.sessionHistory.slice(-20);
  localStorage.setItem('interviewpro_history', JSON.stringify(state.sessionHistory));

  showScreen('results');
  renderResults();

  // Check badges
  const newBadges = checkBadges();
  renderNewBadges(newBadges);

  // Confetti for high scores
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;
  if (pct >= 80) fireConfetti();
}

// ── RENDER RESULTS ──
function renderResults() {
  const total = state.results.length;
  const correct = state.results.filter(r => r.correct).length;
  const incorrect = total - correct;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  setTimeout(() => {
    const circumference = 2 * Math.PI * 70;
    $('scoreCircle').style.strokeDashoffset = circumference * (1 - pct / 100);
  }, 100);

  $('scorePercentage').textContent = pct + '%';
  $('scoreFraction').textContent = `${correct}/${total}`;

  const gradeEl = $('scoreGrade');
  if (pct >= 90) { gradeEl.textContent = '⭐ Outstanding'; gradeEl.style.background = 'rgba(34,197,94,0.2)'; gradeEl.style.color = '#22c55e'; }
  else if (pct >= 70) { gradeEl.textContent = '👍 Good Job'; gradeEl.style.background = 'rgba(0,229,255,0.2)'; gradeEl.style.color = '#00e5ff'; }
  else if (pct >= 50) { gradeEl.textContent = '📚 Needs Practice'; gradeEl.style.background = 'rgba(245,158,11,0.2)'; gradeEl.style.color = '#f59e0b'; }
  else { gradeEl.textContent = '💪 Keep Trying'; gradeEl.style.background = 'rgba(239,68,68,0.2)'; gradeEl.style.color = '#ef4444'; }

  $('statTotal').textContent = total;
  $('statCorrect').textContent = correct;
  $('statIncorrect').textContent = incorrect;
  $('statTime').textContent = formatTime(state.totalTime);
  $('statStreak').textContent = state.bestStreak + ' 🔥';
  $('statFocus').textContent = state.focusChecksPassed;

  // Category breakdown
  const catMap = {};
  state.results.forEach(r => {
    const cat = r.question.category;
    if (!catMap[cat]) catMap[cat] = { total: 0, correct: 0 };
    catMap[cat].total++;
    if (r.correct) catMap[cat].correct++;
  });

  const breakdown = $('categoryBreakdown');
  breakdown.innerHTML = '';
  const strengths = [], weaknesses = [];

  Object.entries(catMap).forEach(([cat, data]) => {
    const catPct = Math.round((data.correct / data.total) * 100);
    const barClass = catPct >= 80 ? 'excellent' : catPct >= 60 ? 'good' : catPct >= 40 ? 'average' : 'poor';
    if (catPct >= 70) strengths.push(cat); else weaknesses.push(cat);
    const row = document.createElement('div');
    row.className = 'cat-row';
    row.innerHTML = `<div class="cat-row-header"><span class="cat-name">${cat}</span><span class="cat-score">${data.correct}/${data.total} (${catPct}%)</span></div><div class="cat-bar-track"><div class="cat-bar-fill ${barClass}" style="width: 0%"></div></div>`;
    breakdown.appendChild(row);
    setTimeout(() => { row.querySelector('.cat-bar-fill').style.width = catPct + '%'; }, 200);
  });

  $('strengthsList').innerHTML = strengths.length > 0
    ? strengths.map(s => `<div class="feedback-item strength">✅ Strong in ${s}</div>`).join('')
    : '<div class="feedback-item strength">Keep practicing to build strengths!</div>';
  $('weaknessList').innerHTML = weaknesses.length > 0
    ? weaknesses.map(w => `<div class="feedback-item weakness">⚠️ Improve ${w}</div>`).join('')
    : '<div class="feedback-item strength">✅ No weak areas — amazing!</div>';

  let summary = '';
  if (pct >= 90) summary = '🏆 Outstanding performance! You\'re interview-ready!';
  else if (pct >= 70) summary = '👏 Great job! Focus on your weak areas to reach the next level.';
  else if (pct >= 50) summary = '📖 Good effort! Review the topics you missed and practice more.';
  else summary = '💪 Don\'t give up! Every expert was once a beginner.';
  if (strengths.length > 0 && weaknesses.length > 0) summary += ` Strong in ${strengths.join(', ')}; improve ${weaknesses.join(', ')}.`;
  $('feedbackSummary').textContent = summary;

  // Render answer review
  renderAnswerReview();
}

function renderAnswerReview() {
  const list = $('reviewList');
  list.innerHTML = '';
  const labels = ['A', 'B', 'C', 'D'];
  state.results.forEach((r, i) => {
    const item = document.createElement('div');
    const cls = r.timedOut ? 'review-timeout' : (r.correct ? 'review-correct' : 'review-incorrect');
    item.className = `review-item ${cls}`;
    const yourAns = r.answered !== null ? `${labels[r.answered]}. ${r.question.options[r.answered]}` : (r.timedOut ? 'Timed out' : 'Skipped');
    const correctAns = `${labels[r.question.correct]}. ${r.question.options[r.question.correct]}`;
    item.innerHTML = `<div class="review-q">${i + 1}. ${r.question.question}</div><div class="review-answers"><div class="review-your-answer">Your answer: ${yourAns}</div><div class="review-correct-answer">Correct: ${correctAns}</div></div><div class="review-explanation">${r.question.explanation}</div>`;
    list.appendChild(item);
  });
}

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

// ── ANSWER REVIEW TOGGLE ──
$('btnToggleReview').addEventListener('click', () => {
  const list = $('reviewList');
  const btn = $('btnToggleReview');
  if (list.style.display === 'none') { list.style.display = ''; btn.textContent = 'Hide ▲'; }
  else { list.style.display = 'none'; btn.textContent = 'Show All ▼'; }
});

// ── CONFETTI ──
function fireConfetti() {
  const canvas = $('confettiCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const pieces = [];
  const colors = ['#0d9488', '#2563eb', '#f59e0b', '#22c55e', '#ec4899', '#8b5cf6'];
  for (let i = 0; i < 150; i++) {
    pieces.push({ x: Math.random() * canvas.width, y: -20 - Math.random() * 200, w: Math.random() * 8 + 4, h: Math.random() * 6 + 2, color: colors[Math.floor(Math.random() * colors.length)], vx: (Math.random() - 0.5) * 4, vy: Math.random() * 3 + 2, rot: Math.random() * 360, vr: (Math.random() - 0.5) * 10 });
  }
  let frame = 0;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.vy += 0.05;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot * Math.PI / 180);
      ctx.fillStyle = p.color; ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 180) requestAnimationFrame(draw);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  draw();
}

// ── BADGES SYSTEM ──
const BADGE_DEFS = [
  { id: 'first_interview', icon: '🏅', name: 'First Interview', desc: 'Complete your first session', check: () => state.sessionHistory.length >= 1 },
  { id: 'perfect_score', icon: '🎯', name: 'Perfect Score', desc: '100% on any session', check: () => state.results.every(r => r.correct) && state.results.length > 0 },
  { id: 'streak_3', icon: '🔥', name: 'Hot Streak', desc: '3+ correct in a row', check: () => state.bestStreak >= 3 },
  { id: 'streak_5', icon: '⚡', name: 'Streak Master', desc: '5+ correct in a row', check: () => state.bestStreak >= 5 },
  { id: 'hard_hero', icon: '💎', name: 'Hard Mode Hero', desc: '80%+ on hard difficulty', check: () => state.difficulty === 'hard' && state.results.filter(r => r.correct).length / state.results.length >= 0.8 },
  { id: 'speed_demon', icon: '🚀', name: 'Speed Demon', desc: 'Finish in under 2 min', check: () => state.totalTime < 120 && state.results.length >= 5 },
  { id: 'veteran', icon: '🌟', name: 'Veteran', desc: 'Complete 5 sessions', check: () => state.sessionHistory.length >= 5 },
  { id: 'high_scorer', icon: '📈', name: 'High Scorer', desc: 'Score 100+ points', check: () => state.score >= 100 },
];

function checkBadges() {
  const newBadges = [];
  BADGE_DEFS.forEach(b => {
    if (!state.earnedBadges.includes(b.id) && b.check()) {
      state.earnedBadges.push(b.id);
      newBadges.push(b);
    }
  });
  localStorage.setItem('interviewpro_badges', JSON.stringify(state.earnedBadges));
  return newBadges;
}

function renderNewBadges(newBadges) {
  const card = $('newBadgesCard');
  const grid = $('newBadgesGrid');
  if (newBadges.length === 0) { card.style.display = 'none'; return; }
  card.style.display = '';
  grid.innerHTML = newBadges.map(b => `<div class="new-badge-item"><span>${b.icon}</span> ${b.name}</div>`).join('');
}

function renderBadgesShowcase() {
  const grid = $('badgesGrid');
  grid.innerHTML = BADGE_DEFS.map(b => {
    const earned = state.earnedBadges.includes(b.id);
    return `<div class="badge-item ${earned ? 'earned' : 'locked'}"><span class="badge-icon">${b.icon}</span><div><div class="badge-name">${b.name}</div><div class="badge-desc">${b.desc}</div></div></div>`;
  }).join('');
}

// ── KEYBOARD SHORTCUTS ──
document.addEventListener('keydown', (e) => {
  if (state.screen === 'interview' && !state.focusCheckActive) {
    if (!state.answered) {
      if (e.key >= '1' && e.key <= '4') { e.preventDefault(); handleAnswer(parseInt(e.key) - 1); }
      if (['a','b','c','d'].includes(e.key.toLowerCase())) { e.preventDefault(); handleAnswer('abcd'.indexOf(e.key.toLowerCase())); }
    }
    if (state.answered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      $('feedbackOverlay').classList.remove('active');
      state.currentIndex++;
      loadQuestion();
    }
  }
  if (state.focusCheckActive && (e.key === ' ' || e.key === 'Enter')) {
    e.preventDefault();
    $('btnFocusConfirm').click();
  }
});

// ── DAILY CHALLENGE ──
function getDailyDate() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function getDailySeed() {
  const date = getDailyDate();
  let h = 0;
  for (let i = 0; i < date.length; i++) { h = ((h << 5) - h) + date.charCodeAt(i); h |= 0; }
  return Math.abs(h);
}

function seededShuffle(arr, seed) {
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 16807 + 0) % 2147483647;
    const j = s % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function isDailyChallengeCompleted() {
  return localStorage.getItem('interviewpro_daily_date') === getDailyDate();
}

function startDailyChallenge() {
  if (isDailyChallengeCompleted()) {
    showToast('✅ Daily challenge already completed! Come back tomorrow.');
    return;
  }
  ensureAudioCtx();
  const seed = getDailySeed();
  const pool = seededShuffle(QUESTION_BANK, seed).slice(0, 5);

  state.mode = 'timed';
  state.difficulty = 'medium';
  state.questions = pool;
  state.currentIndex = 0;
  state.score = 0;
  state.results = [];
  state.focusChecksPassed = 0;
  state.streak = 0;
  state.bestStreak = 0;
  state.startTime = Date.now();
  state.timerMax = DIFFICULTY_SETTINGS.medium.time;
  state.isDaily = true;

  $('timerContainer').style.display = '';
  $('interviewBadge').textContent = 'DAILY CHALLENGE';
  $('interviewBadge').className = 'interview-badge';
  $('interviewBadge').style.background = 'rgba(245,158,11,0.12)';
  $('interviewBadge').style.color = '#f59e0b';
  $('interviewBadge').style.borderColor = 'rgba(245,158,11,0.25)';
  $('btnShowAnswer').style.display = 'none';
  $('streakValue').textContent = '0';
  $('streakDisplay').classList.remove('active');
  $('totalQuestions').textContent = state.questions.length;
  $('scoreDisplay').textContent = '0';

  showScreen('countdown');
  let count = 3;
  $('countdownText').textContent = count;
  const interval = setInterval(() => {
    count--;
    if (count > 0) { $('countdownText').textContent = count; playTone(600, 0.1); }
    else {
      clearInterval(interval);
      playTone(900, 0.2);
      showScreen('interview');
      loadQuestion();
      scheduleFocusCheck();
    }
  }, 1000);
}

function updateDailyButton() {
  const btn = $('btnDailyChallenge');
  if (isDailyChallengeCompleted()) {
    btn.classList.add('btn-daily-done');
    btn.innerHTML = '<span class="btn-icon">✅</span> Completed Today';
  } else {
    btn.classList.remove('btn-daily-done');
    btn.innerHTML = '<span class="btn-icon">📅</span> Daily Challenge';
  }
}

// ── SHARE RESULTS ──
function shareResults() {
  const total = state.results.length;
  const correct = state.results.filter(r => r.correct).length;
  const pct = total > 0 ? Math.round((correct / total) * 100) : 0;

  const text = [
    '🎯 InterviewPro Simulator Results',
    '━━━━━━━━━━━━━━━━━━━━━',
    `📊 Score: ${pct}% (${correct}/${total})`,
    `⚡ Difficulty: ${state.difficulty.toUpperCase()}`,
    `🔥 Best Streak: ${state.bestStreak}`,
    `⏱️ Time: ${formatTime(state.totalTime)}`,
    `${state.isDaily ? '📅 Daily Challenge' : ''}`,
    '',
    pct >= 90 ? '⭐ Outstanding!' : pct >= 70 ? '👍 Good Job!' : pct >= 50 ? '📚 Keep Practicing!' : '💪 Never Give Up!',
    '',
    'Try it yourself → InterviewPro Simulator'
  ].filter(Boolean).join('\n');

  if (navigator.share) {
    navigator.share({ title: 'InterviewPro Results', text }).catch(() => {
      copyToClipboard(text);
    });
  } else {
    copyToClipboard(text);
  }
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('📋 Results copied to clipboard!');
    const btn = $('btnShare');
    btn.classList.add('btn-share-copied');
    btn.innerHTML = '<span class="btn-icon">✅</span> Copied!';
    setTimeout(() => {
      btn.classList.remove('btn-share-copied');
      btn.innerHTML = '<span class="btn-icon">📤</span> Share Results';
    }, 2000);
  }).catch(() => {
    showToast('⚠️ Could not copy — try manually.');
  });
}

// ── TOAST NOTIFICATION ──
let toastTimeout;
function showToast(message) {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast toast-success';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => toast.classList.remove('show'), 3000);
}

// ── ARIA LIVE ANNOUNCER ──
function announce(text) {
  let el = document.getElementById('ariaAnnouncer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'ariaAnnouncer';
    el.className = 'sr-only';
    el.setAttribute('aria-live', 'polite');
    el.setAttribute('role', 'status');
    document.body.appendChild(el);
  }
  el.textContent = '';
  setTimeout(() => { el.textContent = text; }, 50);
}

// ── PATCH: Announce on key events ──
const _origShowFeedback = showFeedback;
showFeedback = function(isCorrect, explanation, points, timedOut) {
  _origShowFeedback(isCorrect, explanation, points, timedOut);
  const msg = isCorrect ? 'Correct answer!' : (timedOut ? 'Time is up!' : 'Incorrect answer.');
  announce(`${msg} ${explanation}`);
};

const _origEndInterview = endInterview;
endInterview = function() {
  // Mark daily as complete
  if (state.isDaily) {
    localStorage.setItem('interviewpro_daily_date', getDailyDate());
  }
  state.isDaily = false;
  _origEndInterview();
};

// ── RESULT ACTIONS ──
$('btnRetry').addEventListener('click', () => beginCountdown());
$('btnShare').addEventListener('click', () => shareResults());
$('btnHome').addEventListener('click', () => {
  updateStartScreenStats();
  renderBadgesShowcase();
  updateDailyButton();
  showScreen('start');
});

// ── INIT ──
state.isDaily = false;
initTheme();
initSoundToggle();
document.getElementById('themeToggle').addEventListener('click', toggleTheme);
$('btnDailyChallenge').addEventListener('click', startDailyChallenge);
initStartScreen();
updateDailyButton();
