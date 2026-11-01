/* Utilidades compartidas por las experiencias de JavaScript.
   Script clásico (no módulo) para que funcione abriendo el HTML con doble click. */
(function () {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const sleep = (ms) => new Promise(r => setTimeout(r, ms));
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  function confetti(n = 80) {
    const colors = ["#e44d26", "#2a9d8f", "#1a5fb4", "#7b2cbf", "#d6336c", "#ffd166"];
    for (let k = 0; k < n; k++) {
      const c = document.createElement("div"); c.className = "confetti";
      c.style.cssText = `left:${Math.random() * 100}vw;background:${colors[k % 6]};animation-duration:${1.6 + Math.random() * 1.8}s;animation-delay:${Math.random() * .4}s`;
      document.body.appendChild(c); setTimeout(() => c.remove(), 4000);
    }
  }

  // botones segmentados: <div class="seg" id="x"><button data-v="a">…</button></div>
  function bindSeg(sel, fn) {
    const el = typeof sel === "string" ? $(sel) : sel;
    el.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b || b.disabled) return;
      el.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b));
      fn(b.dataset.v, b);
    });
  }
  function setSeg(sel, v) { $$(`${sel} button`).forEach(x => x.setAttribute("aria-pressed", x.dataset.v === String(v))); }

  // resaltado de JavaScript
  function hlJS(src) {
    const re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*'|`(?:[^`\\]|\\.)*`)|\b(function|return|if|else|for|of|in|while|let|const|var|new|true|false|null|undefined|switch|case|break|default|this|typeof|do|continue)\b|\b(document|window|console|Math|Number|String|Array|JSON|Object)\b|\b(\d+(?:\.\d+)?)\b|([A-Za-z_$][\w$]*)(?=\s*\()|(=&gt;|=>|===|!==|&&|\|\||[<>]=?|!)/g;
    let out = "", last = 0, m;
    while ((m = re.exec(src))) {
      out += esc(src.slice(last, m.index));
      const [t, com, str, kw, bi, num, fn, op] = m;
      out += com ? `<span class="tk-c">${esc(t)}</span>` : str ? `<span class="tk-s">${esc(t)}</span>` : kw ? `<span class="tk-k">${t}</span>` : bi ? `<span class="tk-b">${t}</span>` : num ? `<span class="tk-n">${t}</span>` : fn ? `<span class="tk-f">${esc(t)}</span>` : `<span class="tk-o">${esc(t)}</span>`;
      last = m.index + t.length;
    }
    return out + esc(src.slice(last));
  }
  // bloque de código con líneas que se pueden resaltar
  function codeBox(el, code, opts = {}) {
    el.classList.add("codebox");
    if (opts.nonum) el.classList.add("nonum");
    el.innerHTML = code.replace(/\n$/, "").split("\n").map(l => `<span class="l">${hlJS(l) || " "}</span>`).join("");
    const lines = () => $$(".l", el);
    return {
      mark(nums, kind = "hl") { lines().forEach((l, i) => { l.classList.remove("hl", "ok", "bad"); if (nums.includes(i + 1)) l.classList.add(kind); }); },
      dim(nums) { lines().forEach((l, i) => l.classList.toggle("dim", nums.includes(i + 1))); },
      clear() { lines().forEach(l => l.classList.remove("hl", "ok", "bad", "dim")); },
    };
  }
  function consoleLog(el, text, kind = "") {
    const d = document.createElement("div"); d.className = kind; d.textContent = text;
    el.appendChild(d); el.scrollTop = 1e9;
  }

  // juego de preguntas reutilizable
  // questions: [{ prompt, code?, options: [html], right, why, after?(q) }]
  function quiz(root, { questions, summary, shuffle = true, onShow, onAnswer }) {
    root.classList.add("quiz");
    root.innerHTML = `<div class="scoreboard"><span class="q-score">⭐ 0</span><div class="progress"><i></i></div><span class="q-round"></span></div>
      <div class="q-prompt"></div><div class="q-code"></div><div class="answers"></div>
      <div class="explain q-explain" hidden></div><button class="btn primary big q-next" hidden style="margin-top:10px">Siguiente ▶</button>`;
    let order = [], i = 0, score = 0, answered = false, over = false;
    const set = (s, h) => { $(s, root).innerHTML = h; };
    function start() { order = shuffle ? [...questions].sort(() => Math.random() - .5) : [...questions]; i = 0; score = 0; over = false; show(); }
    function show() {
      const q = order[i]; answered = false;
      set(".q-prompt", q.prompt);
      if (q.code) codeBox($(".q-code", root), q.code); else set(".q-code", "");
      set(".answers", q.options.map((o, k) => `<button data-k="${k}">${o}</button>`).join(""));
      $(".q-explain", root).hidden = true; $(".q-next", root).hidden = true;
      set(".q-round", `${i + 1} de ${order.length}`);
      $(".progress i", root).style.width = (i / order.length) * 100 + "%";
      set(".q-score", `⭐ ${score}`);
      onShow && onShow(q);
    }
    $(".answers", root).addEventListener("click", (e) => {
      const b = e.target.closest("button[data-k]"); if (!b || answered) return;
      answered = true;
      const q = order[i], ok = +b.dataset.k === q.right;
      if (ok) score++;
      $$(".answers button", root).forEach(x => { x.disabled = true; if (+x.dataset.k === q.right) x.classList.add("right"); });
      if (!ok) b.classList.add("wrong");
      const ex = $(".q-explain", root); ex.hidden = false; ex.className = "explain q-explain " + (ok ? "ok" : "bad");
      ex.innerHTML = (ok ? "🎯 <strong>¡Bien!</strong> " : "😅 ") + q.why;
      set(".q-score", `⭐ ${score}`);
      $(".progress i", root).style.width = ((i + 1) / order.length) * 100 + "%";
      const nx = $(".q-next", root); nx.hidden = false; nx.textContent = i === order.length - 1 ? "Ver resultado ▶" : "Siguiente ▶";
      onAnswer && onAnswer(q, ok);
    });
    $(".q-next", root).addEventListener("click", () => {
      if (over) return start();
      if (i < order.length - 1) { i++; return show(); }
      over = true;
      set(".q-prompt", `<div class="final">${score} de ${order.length} ${score >= order.length - 1 ? "🏆" : score >= order.length / 2 ? "👏" : "💪"}</div>`);
      set(".q-code", ""); set(".answers", "");
      const ex = $(".q-explain", root); ex.hidden = false; ex.className = "explain q-explain ok"; ex.innerHTML = summary;
      $(".q-next", root).textContent = "Jugar de nuevo ↻";
      if (score >= order.length / 2) confetti();
    });
    start();
    return { restart: start };
  }

  window.UI = { $, $$, sleep, esc, confetti, bindSeg, setSeg, hlJS, codeBox, consoleLog, quiz };
})();
