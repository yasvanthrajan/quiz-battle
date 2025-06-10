/* ==========  MAIN GAME LOGIC  ========== */
let correctAnswer = "";
let score = 0;
let timerInterval;
let timeLeft = 10;
let playerName = "";
let questionCount = 0;

/* ----  Theme toggle  ---- */
const themeToggle = document.getElementById("themeToggle");
const body = document.body;
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");
  themeToggle.classList.toggle("dark");
  createParticles();
});

/* ----  Particles  ---- */
function createParticles() {
  const particlesContainer = document.getElementById("particles");
  particlesContainer.innerHTML = "";
  for (let i = 0; i < 15; i++) {
    setTimeout(() => {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.animationDelay = Math.random() * 3 + "s";
      p.style.animationDuration = Math.random() * 3 + 2 + "s";
      particlesContainer.appendChild(p);
      setTimeout(() => p.remove(), 5000);
    }, i * 200);
  }
}

/* ----  Game Start  ---- */
function startGame() {
  const name = document.getElementById("player-name").value.trim();
  if (!name) {
    // little shake animation for empty name
    const input = document.getElementById("player-name");
    input.style.animation = "incorrectShake 0.6s";
    setTimeout(() => (input.style.animation = ""), 600);
    return;
  }
  playerName = name;
  score = 0;
  questionCount = 0;
  updateScore();
  document.getElementById("player-section").classList.add("hidden");
  document.getElementById("quiz-card").classList.remove("hidden");
  createParticles();
  loadQuestion();
}

/* ----  Fetch & show question  ---- */
async function loadQuestion() {
  clearInterval(timerInterval);
  timeLeft = 10;
  questionCount++;

  // reset UI
  document.getElementById("timer").className = "timer";
  document.getElementById("timer").innerText = "🕒 10s";
  document.getElementById("result").classList.add("hidden");
  document.getElementById("options").innerHTML =
    '<div class="loading"></div>';
  document.getElementById("question").innerHTML =
    '<div class="loading"></div> Loading epic question...';

  try {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=1&type=multiple"
    );
    const data = await res.json();
    const q = data.results[0];
    correctAnswer = q.correct_answer;

    const opts = [...q.incorrect_answers, q.correct_answer];
    shuffle(opts);

    setTimeout(() => {
      document.getElementById(
        "question"
      ).innerHTML = `Q${questionCount}: ${decode(q.question)}`;
      const box = document.getElementById("options");
      box.innerHTML = "";
      opts.forEach((opt, idx) => {
        const div = document.createElement("div");
        div.className = "option";
        div.innerHTML = decode(opt);
        div.onclick = () => checkAnswer(opt, div);
        div.style.animation = `resultFadeIn 0.5s ${idx * 0.1}s both`;
        box.appendChild(div);
      });
      startTimer();
    }, 500);
  } catch (e) {
    document.getElementById("question").innerHTML =
      "❌ Failed to load question. Retrying…";
    setTimeout(loadQuestion, 2000);
  }
}

/* ----  Answer handling  ---- */
function checkAnswer(selected, el) {
  clearInterval(timerInterval);
  const options = document.querySelectorAll(".option");
  options.forEach((o) => {
    o.onclick = null;
    o.style.cursor = "not-allowed";
  });

  const res = document.getElementById("result");
  if (selected === correctAnswer) {
    el.classList.add("correct");
    res.className = "result-message success";
    res.innerText = "🎉 Awesome! Correct answer!";
    score++;
    updateScore();
    createParticles();
    playSound("success");
  } else {
    el.classList.add("incorrect");
    options.forEach((o) => {
      if (decode(o.innerHTML) === correctAnswer) o.classList.add("correct");
    });
    res.className = "result-message error";
    res.innerText = `💥 Oops! The correct answer was: ${correctAnswer}`;
    playSound("error");
  }
  res.classList.remove("hidden");
}

/* ----  Timer  ---- */
function startTimer() {
  const t = document.getElementById("timer");
  timerInterval = setInterval(() => {
    timeLeft--;
    t.innerText = `🕒 ${timeLeft}s`;
    if (timeLeft <= 3) t.classList.add("danger");
    if (timeLeft === 0) {
      clearInterval(timerInterval);
      t.innerText = "⏰ Time's Up!";
      const res = document.getElementById("result");
      res.className = "result-message error";
      res.innerText = "⏰ Time's up! Too slow, warrior!";
      res.classList.remove("hidden");
      // disable options & show correct
      document.querySelectorAll(".option").forEach((o) => {
        o.onclick = null;
        o.style.cursor = "not-allowed";
        if (decode(o.innerHTML) === correctAnswer) o.classList.add("correct");
      });
      playSound("error");
    }
  }, 1000);
}

/* ----  Quit / Restart  ---- */
function quitQuiz() {
  clearInterval(timerInterval);
  document.getElementById("quiz-card").classList.add("hidden");
  document.getElementById("final-score").classList.remove("hidden");

  const msg =
    `${playerName}, you scored ${score} of ${questionCount}! ` +
    (score === questionCount && score
      ? "🏆 PERFECT SCORE!"
      : score >= questionCount * 0.8
      ? "🎖️ Excellent!"
      : score >= questionCount * 0.6
      ? "👍 Great job!"
      : score >= questionCount * 0.4
      ? "📚 Keep learning!"
      : "💪 Try again!");
  document.getElementById("summary").innerText = msg;
  createParticles();
}

function restart() {
  score = 0;
  questionCount = 0;
  updateScore();
  document.getElementById("final-score").classList.add("hidden");
  document.getElementById("player-section").classList.remove("hidden");
  document.getElementById("player-name").value = "";
}

/* ----  Helpers  ---- */
function updateScore() {
  document.getElementById("score").innerText = `Score: ${score}`;
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function decode(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

/* ----  Simple sound generator  ---- */
function playSound(type) {
  const ctx =
    window.AudioContext ? new AudioContext() : new webkitAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.connect(gain);
  gain.connect(ctx.destination);

  if (type === "success") {
    osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
    osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
  } else {
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.setValueAtTime(150, ctx.currentTime + 0.1);
  }

  gain.gain.setValueAtTime(0.3, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

  osc.start();
  osc.stop(ctx.currentTime + 0.3);
}

/* ----  Kick-off particles once page loads  ---- */
window.addEventListener("load", () => setTimeout(createParticles, 1000));
