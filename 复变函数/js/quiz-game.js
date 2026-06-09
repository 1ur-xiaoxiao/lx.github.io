// ============================================================
// 复变函数闯关答题 — 游戏核心引擎
// ============================================================

// ==================== localStorage 管理 ====================
const QuizStorage = {
  KEY: 'fuben_quiz',

  defaults() {
    const chDefaults = {};
    ['ch1','ch2','ch3','ch4','ch5','ch6'].forEach((ch, i) => {
      chDefaults[ch] = {
        unlocked: i === 0,
        bossDefeated: false,
        highScore: 0,
        bestAccuracy: 0,
        attempts: 0,
        // 困难模式字段
        hardUnlocked: false,
        hardBossDefeated: false,
        hardHighScore: 0,
        hardBestAccuracy: 0,
        hardAttempts: 0
      };
    });
    return {
      playerName: '复变勇者',
      totalScore: 0,
      chapters: chDefaults,
      settings: { soundEnabled: true }
    };
  },

  load() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return this.defaults();
      const data = JSON.parse(raw);
      // 深度合并，防止新增字段缺失
      return this.merge(this.defaults(), data);
    } catch (e) {
      return this.defaults();
    }
  },

  save(data) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('localStorage 存储失败', e);
    }
  },

  reset() {
    localStorage.removeItem(this.KEY);
    return this.defaults();
  },

  merge(def, data) {
    const out = { ...def };
    for (const key of Object.keys(def)) {
      if (key === 'chapters' && data.chapters) {
        out.chapters = {};
        for (const ch of Object.keys(def.chapters)) {
          out.chapters[ch] = { ...def.chapters[ch], ...(data.chapters[ch] || {}) };
        }
      } else if (key === 'settings' && data.settings) {
        out.settings = { ...def.settings, ...data.settings };
      } else if (data[key] !== undefined) {
        out[key] = data[key];
      }
    }
    return out;
  }
};

// ==================== 战斗状态管理 ====================
const QuizState = {
  data: null,
  currentChapter: null,
  questions: [],
  currentIndex: 0,
  score: 0,
  playerHP: 5,
  bossHP: 10,
  maxPlayerHP: 5,
  maxBossHP: 7,
  combo: 0,
  maxCombo: 0,
  correctCount: 0,
  isAnswering: false,
  difficulty: 'normal', // 'normal' | 'hard'

  init() {
    this.data = QuizStorage.load();
  },

  startBattle(chapter, difficulty) {
    this.currentChapter = chapter;
    this.difficulty = difficulty || 'normal';
    this.score = 0;
    this.battleEnded = false;
    this.combo = 0;
    this.maxCombo = 0;
    this.correctCount = 0;
    this.currentIndex = 0;
    this.isAnswering = false;
    this.results = [];

    const isHard = this.difficulty === 'hard';
    if (isHard) {
      this.questionCount = 15;
      this.playerHP = 3;
      this.bossHP = 10;
      this.maxPlayerHP = 3;
      this.maxBossHP = 10;
      // 合并普通题库和困难题库
      const poolNormal = QUIZ_QUESTIONS[chapter] || [];
      const poolHard = QUIZ_QUESTIONS_HARD[chapter] || [];
      this.questions = shuffleArray([...poolNormal, ...poolHard]).slice(0, this.questionCount);
    } else {
      this.questionCount = 10;
      this.playerHP = 5;
      this.bossHP = 7;
      this.maxPlayerHP = 5;
      this.maxBossHP = 7;
      const pool = QUIZ_QUESTIONS[chapter] || [];
      this.questions = shuffleArray([...pool]).slice(0, this.questionCount);
    }
  },

  currentQuestion() {
    return this.questions[this.currentIndex];
  },

  isLastQuestion() {
    return this.currentIndex >= this.questions.length - 1;
  },

  isBattleOver() {
    return this.playerHP <= 0 || this.bossHP <= 0 || this.currentIndex >= this.questions.length;
  },

  isVictory() {
    return this.bossHP <= 0;
  },

  answerCorrect() {
    this.results.push(true);
    this.correctCount++;
    this.bossHP = Math.max(0, this.bossHP - 1);
    this.combo++;
    if (this.combo > this.maxCombo) this.maxCombo = this.combo;
    const comboMultiplier = this.combo >= 5 ? 3 : this.combo >= 3 ? 2 : this.combo >= 2 ? 1.5 : 1;
    const difficultyMultiplier = this.difficulty === 'hard' ? 1.5 : 1;
    const earned = Math.round(10 * comboMultiplier * difficultyMultiplier);
    this.score += earned;
    return earned;
  },

  answerWrong() {
    this.results.push(false);
    this.combo = 0;
    this.playerHP = Math.max(0, this.playerHP - 1);
  },

  advanceQuestion() {
    this.currentIndex++;
    this.isAnswering = false;
  },

  accuracy() {
    const answered = this.currentIndex + 1;
    if (answered === 0) return 0;
    return Math.round((this.correctCount / answered) * 100);
  },

  saveProgress() {
    const ch = this.data.chapters[this.currentChapter];
    const isHard = this.difficulty === 'hard';

    if (isHard) {
      ch.hardAttempts++;
      if (this.score > ch.hardHighScore) ch.hardHighScore = this.score;
      const acc = this.accuracy();
      if (acc > ch.hardBestAccuracy) ch.hardBestAccuracy = acc;
      if (this.isVictory()) {
        ch.hardBossDefeated = true;
      }
    } else {
      ch.attempts++;
      if (this.score > ch.highScore) ch.highScore = this.score;
      const acc = this.accuracy();
      if (acc > ch.bestAccuracy) ch.bestAccuracy = acc;
      if (this.isVictory()) {
        ch.bossDefeated = true;
        // 解锁下一章的普通模式 + 当前章的困难模式
        ch.hardUnlocked = true;
        const chapters = ['ch1','ch2','ch3','ch4','ch5','ch6'];
        const idx = chapters.indexOf(this.currentChapter);
        if (idx >= 0 && idx < chapters.length - 1) {
          this.data.chapters[chapters[idx + 1]].unlocked = true;
        }
      }
    }
    // 更新总分
    this.data.totalScore = 0;
    Object.values(this.data.chapters).forEach(c => {
      this.data.totalScore += c.highScore + c.hardHighScore;
    });
    QuizStorage.save(this.data);
  }
};

// ==================== UI 渲染 ====================
const QuizRenderer = {
  container: null,

  init() {
    this.container = document.getElementById('quiz-app');
  },

  // ---------- 更新总分显示 ----------
  updateTotalScore() {
    const el = document.getElementById('total-score');
    if (el) el.textContent = `总分：${QuizState.data.totalScore}`;
  },

  // ---------- 关卡选择画面 ----------
  renderChapterSelect() {
    const data = QuizState.data;
    this.updateTotalScore();
    const chapters = [
      { key: 'ch1', label: '第一章', topic: '复数与复变函数' },
      { key: 'ch2', label: '第二章', topic: '解析函数' },
      { key: 'ch3', label: '第三章', topic: '初等函数' },
      { key: 'ch4', label: '第四章', topic: '复积分' },
      { key: 'ch5', label: '第五章', topic: '级数' },
      { key: 'ch6', label: '第六章', topic: '留数' }
    ];

    if (!this.container) {
      console.error('[QuizGame] quiz-app 容器不存在');
      return;
    }
    let cardsHTML = '';
    chapters.forEach(ch => {
      const save = data.chapters[ch.key];
      const boss = BOSS_INFO[ch.key];
      const defeated = save.bossDefeated;
      const unlocked = save.unlocked;

      let stateClass = 'locked';
      if (defeated) stateClass = 'defeated';
      else if (unlocked) stateClass = 'unlocked';

      const hardDefeated = save.hardBossDefeated;
      const hardUnlocked = save.hardUnlocked;

      const statusBadge = defeated
        ? '<span class="status-badge cleared">✓ 已通关</span>'
        : (!unlocked ? '<span class="status-badge locked-badge">🔒 未解锁</span>' : '');

      // 普通模式按钮
      const normalBtnText = defeated ? '🔄 再战' : (unlocked ? '⚔️ 挑战' : '🔒 锁定');
      const normalBtnDisabled = !unlocked ? 'disabled' : '';

      // 困难模式按钮
      let hardBtnText, hardBtnDisabled, hardBtnClass;
      if (hardDefeated) {
        hardBtnText = '🔥 再战';
        hardBtnDisabled = '';
        hardBtnClass = 'hard-defeated';
      } else if (hardUnlocked) {
        hardBtnText = '🔥 困难';
        hardBtnDisabled = '';
        hardBtnClass = 'hard-unlocked';
      } else {
        hardBtnText = '🔒 困难';
        hardBtnDisabled = 'disabled';
        hardBtnClass = 'hard-locked';
      }

      cardsHTML += `
        <div class="boss-card ${stateClass}" data-chapter="${ch.key}">
          <span class="boss-emoji">${boss.emoji}</span>
          <div class="boss-name">${boss.name}</div>
          <div class="boss-title">${boss.title}</div>
          <div class="chapter-label">${ch.label} · ${ch.topic}</div>
          <div class="boss-stats">
            <span>🏆 ${save.highScore}分</span>
            <span>🎯 ${save.bestAccuracy}%</span>
            <span>💪 ${save.attempts}次</span>
          </div>
          ${statusBadge}
          <div class="challenge-btns">
            <button class="challenge-btn normal-btn" ${normalBtnDisabled} onclick="QuizApp.startBattle('${ch.key}','normal')">${normalBtnText}</button>
            <button class="challenge-btn hard-btn ${hardBtnClass}" ${hardBtnDisabled} onclick="QuizApp.startBattle('${ch.key}','hard')">${hardBtnText}</button>
          </div>
        </div>
      `;
    });

    this.container.innerHTML = `
      <h2 class="chapter-select-title">选择关卡</h2>
      <p class="chapter-select-subtitle">击败当前章节的 Boss 即可解锁下一章</p>
      <div class="chapter-grid">${cardsHTML}</div>
    `;
  },

  // ---------- 战斗画面 ----------
  renderBattle() {
    const q = QuizState.currentQuestion();
    if (!q) return;

    const isHard = QuizState.difficulty === 'hard';
    const progressDots = QuizState.questions.map((_, i) => {
      if (i < QuizState.currentIndex) {
        const cls = QuizState.results[i] ? 'done-correct' : 'done-wrong';
        return `<span class="progress-dot ${cls}"></span>`;
      }
      if (i === QuizState.currentIndex) return '<span class="progress-dot current"></span>';
      return '<span class="progress-dot"></span>';
    }).join('');

    const boss = BOSS_INFO[QuizState.currentChapter];
    const letters = ['A', 'B', 'C', 'D'];
    const maxPHP = QuizState.maxPlayerHP;
    const maxBHP = QuizState.maxBossHP;

    const optionsHTML = q.options.map((opt, i) => `
      <button class="option-btn" data-index="${i}" onclick="QuizApp.selectAnswer(${i}, this)">
        <span class="opt-letter">${letters[i]}</span>
        <span>${opt}</span>
      </button>
    `).join('');

    this.container.innerHTML = `
      <button class="back-to-chapters" onclick="QuizApp.showChapterSelect()">← 返回关卡选择</button>
      <div class="battle-screen">
        <div class="difficulty-badge ${isHard ? 'hard' : 'normal'}">${isHard ? '🔥 困难模式' : '📘 普通模式'}</div>
        <div class="hp-zone">
          <div class="hp-block player">
            <div class="hp-label">🧑 勇者</div>
            <div class="hp-bar"><div class="hp-fill player-hp" style="width:${(QuizState.playerHP / maxPHP) * 100}%"></div></div>
            <div class="hp-text">${'❤️'.repeat(QuizState.playerHP)}${'🖤'.repeat(maxPHP - QuizState.playerHP)}</div>
          </div>
          <div class="vs-divider">VS</div>
          <div class="hp-block boss">
            <div class="hp-label">${boss.emoji} ${boss.name}</div>
            <div class="hp-bar"><div class="hp-fill boss-hp" id="boss-hp-fill" style="width:${(QuizState.bossHP / maxBHP) * 100}%"></div></div>
            <div class="hp-text" id="boss-hp-text">${QuizState.bossHP}/${maxBHP}</div>
          </div>
        </div>

        <div class="boss-display" id="boss-display">
          <span class="battle-emoji">${boss.emoji}</span>
          <div class="battle-boss-name">${boss.name}</div>
        </div>

        <div class="question-progress">${progressDots}</div>

        <div class="score-display" id="score-display">
          得分：<span id="current-score">${QuizState.score}</span>
          <span id="combo-area"></span>
        </div>

        <div class="question-card" id="question-card">
          <div class="q-number">第 ${QuizState.currentIndex + 1} / ${QuizState.questions.length} 题</div>
          <div class="q-text" id="q-text">${q.question}</div>
        </div>

        <div class="options-list" id="options-list">${optionsHTML}</div>

        <div class="explanation-box" id="explanation"></div>

        <button class="next-btn" id="next-btn" onclick="QuizApp.nextQuestion()">下一题 →</button>
      </div>
    `;

    // 渲染新插入的 LaTeX
    this.retypeset();
  },

  // ---------- 显示答题反馈 ----------
  showFeedback(selectedBtn, correctIndex, isCorrect) {
    QuizState.isAnswering = true;
    const allBtns = document.querySelectorAll('.option-btn');
    allBtns.forEach(b => b.classList.add('disabled'));

    // 高亮正确答案
    allBtns[correctIndex].classList.add('correct-choice');
    // 高亮用户选择（如果错了）
    if (!isCorrect) {
      selectedBtn.classList.add('wrong-choice');
      document.getElementById('question-card').classList.add('wrong-flash');
    } else {
      document.getElementById('question-card').classList.add('correct-flash');
      this.showScorePop(selectedBtn, QuizState.combo);
    }

    // 显示解析
    const q = QuizState.currentQuestion();
    const exp = document.getElementById('explanation');
    exp.innerHTML = `<div class="exp-label">📖 解析</div>${q.explanation}`;
    exp.classList.add('show');

    // 显示下一题按钮
    const nextBtn = document.getElementById('next-btn');
    if (QuizState.isLastQuestion() || QuizState.playerHP <= 0 || QuizState.bossHP <= 0) {
      nextBtn.textContent = '查看结果 →';
    }
    nextBtn.classList.add('show');

    // 更新 combo 显示
    this.updateComboDisplay();

    // 重渲染解析中的 LaTeX
    this.retypeset();
  },

  // ---------- 更新 Boss HP 显示 ----------
  updateBossHP() {
    const fill = document.getElementById('boss-hp-fill');
    const text = document.getElementById('boss-hp-text');
    const maxBHP = QuizState.maxBossHP;
    if (fill) fill.style.width = `${(QuizState.bossHP / maxBHP) * 100}%`;
    if (text) text.textContent = `${QuizState.bossHP}/${maxBHP}`;

    // Boss 受击动画
    const display = document.getElementById('boss-display');
    if (display) {
      display.classList.add('hit');
      setTimeout(() => display.classList.remove('hit'), 400);
    }
  },

  // ---------- 更新玩家 HP 显示 ----------
  updatePlayerHP() {
    const hpBar = document.querySelector('.hp-fill.player-hp');
    const hpText = document.querySelector('.hp-block.player .hp-text');
    const maxPHP = QuizState.maxPlayerHP;
    if (hpBar) hpBar.style.width = `${(QuizState.playerHP / maxPHP) * 100}%`;
    if (hpText) hpText.innerHTML = `${'❤️'.repeat(QuizState.playerHP)}${'🖤'.repeat(maxPHP - QuizState.playerHP)}`;
  },

  // ---------- 更新得分显示 ----------
  updateScore() {
    const scoreEl = document.getElementById('current-score');
    if (scoreEl) scoreEl.textContent = QuizState.score;
  },

  // ---------- Combo 显示 ----------
  updateComboDisplay() {
    const area = document.getElementById('combo-area');
    if (!area) return;
    if (QuizState.combo >= 3) {
      const label = QuizState.combo >= 5 ? '🔥 MAX COMBO!' : '⚡ COMBO';
      area.innerHTML = `<span class="combo-badge">${label} ×${QuizState.combo}</span>`;
    } else {
      area.innerHTML = '';
    }
  },

  // ---------- 得分飘出动画 ----------
  showScorePop(btn, combo) {
    const rect = btn.getBoundingClientRect();
    const diffMul = QuizState.difficulty === 'hard' ? 1.5 : 1;
    let points = 10;
    if (combo >= 5) points *= 3;
    else if (combo >= 3) points *= 2;
    else if (combo >= 2) points = Math.round(points * 1.5);
    points = Math.round(points * diffMul);

    const pop = document.createElement('div');
    pop.className = 'score-pop positive';
    pop.textContent = `+${points}`;
    pop.style.left = `${rect.left + rect.width / 2 - 20}px`;
    pop.style.top = `${rect.top - 10}px`;
    document.body.appendChild(pop);
    setTimeout(() => pop.remove(), 1300);
  },

  // ---------- Boss 击败动画 ----------
  showBossDefeat() {
    const display = document.getElementById('boss-display');
    if (display) {
      display.classList.add('defeated-anim');
    }
  },

  // ---------- 结算画面 ----------
  renderResult() {
    const isWin = QuizState.isVictory();
    const isHard = QuizState.difficulty === 'hard';
    const boss = BOSS_INFO[QuizState.currentChapter];
    const chData = QuizState.data.chapters[QuizState.currentChapter];
    const bestScore = isHard ? chData.hardHighScore : chData.highScore;
    const isNewRecord = QuizState.score >= bestScore && bestScore > 0;
    const difficultyLabel = isHard ? '🔥 困难模式' : '📘 普通模式';

    this.container.innerHTML = `
      <div class="result-screen ${isWin ? 'victory' : 'defeat'}">
        <span class="result-icon">${isWin ? '🎉' : '💔'}</span>
        <div class="result-title">${isWin ? '挑战成功！' : '挑战失败'}</div>
        <div class="difficulty-badge ${isHard ? 'hard' : 'normal'}" style="display:inline-block;margin-bottom:0.5rem;">${difficultyLabel}</div>
        <div class="result-subtitle">
          ${isWin
            ? `你击败了<strong>${boss.name}</strong>！${isHard ? '困难模式的挑战被你征服！' : (QuizState.currentChapter === 'ch6' ? '恭喜你征服了复变函数所有关卡！' : '下一章已解锁。')}`
            : `你被<strong>${boss.name}</strong>击败了……不要气馁，复习一下再来挑战吧。`}
        </div>
        <div class="result-stats">
          <div class="result-stat">
            <div class="stat-value">${QuizState.score}</div>
            <div class="stat-label">得分${isNewRecord ? ' 🆕新纪录' : ''}</div>
          </div>
          <div class="result-stat">
            <div class="stat-value">${QuizState.accuracy()}%</div>
            <div class="stat-label">正确率</div>
          </div>
          <div class="result-stat">
            <div class="stat-value">${QuizState.maxCombo}×</div>
            <div class="stat-label">最大连击</div>
          </div>
        </div>
        ${isNewRecord ? '<span class="new-record">🏆 新纪录！</span>' : ''}
        <div class="result-actions" style="margin-top:1.25rem;">
          <button class="btn btn-primary" onclick="QuizApp.retryBattle()">🔄 再来一次</button>
          <button class="btn btn-secondary" onclick="QuizApp.showChapterSelect()">📋 返回关卡选择</button>
        </div>
      </div>
    `;
  },

  // ---------- MathJax 重新渲染 ----------
  retypeset() {
    if (window.MathJax && window.MathJax.typesetPromise) {
      MathJax.typesetPromise([this.container]).catch(err => console.warn('MathJax 渲染失败', err));
    }
  }
};

// ==================== 战斗流程控制 ====================
const QuizBattle = {
  selectAnswer(index, btn) {
    if (QuizState.isAnswering) return; // 防止重复点击

    const q = QuizState.currentQuestion();
    const isCorrect = (index === q.correct);

    if (isCorrect) {
      const earned = QuizState.answerCorrect();
      QuizRenderer.updateBossHP();
      QuizRenderer.updateScore();
    } else {
      QuizState.answerWrong();
      QuizRenderer.updatePlayerHP();
    }

    QuizRenderer.showFeedback(btn, q.correct, isCorrect);
  },

  nextQuestion() {
    // 检查战斗是否结束
    if (QuizState.playerHP <= 0 || QuizState.bossHP <= 0) {
      this.endBattle();
      return;
    }

    // 如果是最后一题，也结束战斗
    if (QuizState.isLastQuestion()) {
      this.endBattle();
      return;
    }

    QuizState.advanceQuestion();
    QuizRenderer.renderBattle();
  },

  endBattle() {
    if (QuizState.battleEnded) return;
    QuizState.battleEnded = true;
    if (QuizState.isVictory()) {
      QuizRenderer.showBossDefeat();
    }
    QuizState.saveProgress();
    setTimeout(() => {
      QuizRenderer.renderResult();
    }, QuizState.isVictory() ? 900 : 300);
  }
};

// ==================== 顶层应用 ====================
const QuizApp = {
  init() {
    try {
      QuizState.init();
      QuizRenderer.init();
      this.showChapterSelect();
    } catch (e) {
      console.error('QuizApp 初始化失败:', e);
      const app = document.getElementById('quiz-app');
      if (app) {
        app.innerHTML = `<p style="text-align:center;color:var(--danger);padding:2rem;">游戏加载失败：${e.message}<br><small>请尝试刷新页面或清除浏览器数据后重试。</small></p>`;
      }
    }
  },

  showChapterSelect() {
    QuizState.data = QuizStorage.load(); // 刷新数据
    QuizRenderer.renderChapterSelect();
  },

  startBattle(chapter, difficulty) {
    const ch = QuizState.data.chapters[chapter];
    if (!ch) return;
    const diff = difficulty || 'normal';
    if (diff === 'hard' && !ch.hardUnlocked) return; // 困难模式未解锁
    if (diff === 'normal' && !ch.unlocked) return;   // 普通模式未解锁
    QuizState.startBattle(chapter, diff);
    QuizRenderer.renderBattle();
  },

  selectAnswer(index, btn) {
    QuizBattle.selectAnswer(index, btn);
  },

  nextQuestion() {
    QuizBattle.nextQuestion();
  },

  retryBattle() {
    const ch = QuizState.currentChapter;
    const diff = QuizState.difficulty;
    QuizState.startBattle(ch, diff);
    QuizRenderer.renderBattle();
  },

  resetAll() {
    if (confirm('确定要清除所有游戏记录吗？此操作不可恢复。')) {
      QuizState.data = QuizStorage.reset();
      this.showChapterSelect();
    }
  }
};

// ==================== 工具函数 ====================
function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ==================== 启动 ====================
document.addEventListener('DOMContentLoaded', () => {
  // 注意：initNavToggle, initCollapsibles, initBackToTop, initActiveNav
  // 已在 main.js 的 DOMContentLoaded 中注册，这里不需要重复调用。

  console.log('[QuizGame] DOMContentLoaded, 开始初始化...');

  // 检查依赖是否加载
  if (typeof QUIZ_QUESTIONS === 'undefined') {
    console.error('[QuizGame] quiz-questions.js 未加载！');
    document.getElementById('quiz-app').innerHTML =
      '<p style="text-align:center;color:var(--danger);padding:2rem;">题库文件加载失败，请刷新页面重试。</p>';
    return;
  }
  if (typeof BOSS_INFO === 'undefined') {
    console.error('[QuizGame] BOSS_INFO 未加载！');
    return;
  }

  // 启动游戏
  QuizApp.init();

  // 暴露 resetAll 给全局（供 header 中的重置按钮使用）
  window.QuizApp = QuizApp;
  console.log('[QuizGame] 初始化完成');
});
