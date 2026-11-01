/* Videos de YouTube con la explicación de algunos temas.
   Para agregar uno: sumá la página y el id del video en VIDEOS.
   En las páginas agrega el botón «🎬 Ver video» arriba a la derecha; en la portada, una marca en la tarjeta. */
(function () {
  const VIDEOS = {
    "html-css/etiquetas-basicas.html": [{ id: "29seNi8hpo8", t: "HTML básico" }],
    "html-css/selectores.html": [{ id: "WyvQimb1AXI", t: "CSS básico" }],
    "html-css/propiedades.html": [{ id: "WyvQimb1AXI", t: "CSS básico" }],
    "js-ts/eventos.html": [{ id: "se9_zvQvNUM", t: "Eventos en JavaScript" }],
    "js-ts/condicionales.html": [{ id: "BQKM8grt_hQ", t: "if en JavaScript" }],
    "js-ts/bucles.html": [{ id: "ABL7vwMni60", t: "for en JavaScript" }],
    "js-ts/funciones.html": [{ id: "Nu-0CrDq-_s", t: "Funciones en JavaScript" }],
    "js-ts/laboratorio.html": [{ id: "2AxEUDA8bjk", t: "Laboratorio · parte 1" }, { id: "iBQfXg8pNfY", t: "Laboratorio · parte 2" }],
    "angular/fetch.html": [{ id: "KABu6tVlgmI", t: "Promesas" }],
  };

  const css = `
  .vid-btn { margin-left: auto; font: inherit; font-weight: 700; font-size: .95rem; border: 2px solid #c3002f; color: #c3002f; background: #fff; border-radius: 999px; padding: 6px 14px; cursor: pointer; display: inline-flex; gap: 6px; align-items: center; }
  .vid-btn:hover { background: #c3002f; color: #fff; }
  .vid-ov { position: fixed; inset: 0; z-index: 500; background: rgba(20,18,26,.72); display: flex; align-items: center; justify-content: center; padding: 20px; animation: vidIn .2s; }
  @keyframes vidIn { from { opacity: 0; } }
  .vid-box { width: min(1000px, 100%); background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,.4); }
  .vid-head { display: flex; align-items: center; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #ddd8d0; flex-wrap: wrap; }
  .vid-head strong { font-size: 1.05rem; }
  .vid-tabs { display: flex; gap: 6px; }
  .vid-tabs button { font: inherit; font-size: .9rem; border: 2px solid #ddd8d0; background: #fff; border-radius: 999px; padding: 3px 12px; cursor: pointer; }
  .vid-tabs button[aria-pressed="true"] { background: #7b2cbf; border-color: #7b2cbf; color: #fff; }
  .vid-head .sp { flex: 1; }
  .vid-head a { font-size: .9rem; color: #57525f; }
  .vid-x { font: inherit; font-size: 1.3rem; border: 0; background: transparent; cursor: pointer; padding: 0 6px; }
  .vid-frame { position: relative; aspect-ratio: 16 / 9; background: #000; }
  .vid-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
  .vid-badge { position: absolute; top: 12px; right: 12px; font-size: .78rem; font-weight: 800; background: #c3002f; color: #fff; border-radius: 999px; padding: 2px 9px; }
  .card.tile { position: relative; }`;
  const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);

  // la página actual, como "carpeta/archivo.html"
  const parts = location.pathname.split("/").filter(Boolean);
  const here = parts.slice(-2).join("/");

  if (VIDEOS[here]) {
    const list = VIDEOS[here];
    const btn = document.createElement("button");
    btn.className = "vid-btn"; btn.type = "button";
    btn.innerHTML = `🎬 Ver ${list.length > 1 ? "videos" : "video"}`;
    (document.querySelector(".topbar") || document.body).appendChild(btn);
    btn.addEventListener("click", () => open(list));
  }

  function open(list) {
    const ov = document.createElement("div"); ov.className = "vid-ov";
    ov.innerHTML = `<div class="vid-box" role="dialog" aria-label="Video">
      <div class="vid-head"><strong>🎬</strong><div class="vid-tabs">${list.map((v, i) => `<button data-i="${i}" aria-pressed="${i === 0}">${v.t}</button>`).join("")}</div>
      <span class="sp"></span><a target="_blank" rel="noopener">¿No se ve? Abrir en YouTube ↗</a><button class="vid-x" title="Cerrar (Esc)">✕</button></div>
      <div class="vid-frame"></div></div>`;
    document.body.appendChild(ov);
    const show = (i) => {
      const v = list[i];
      ov.querySelector(".vid-frame").innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${v.id}?rel=0&autoplay=1" title="${v.t}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
      ov.querySelector(".vid-head a").href = `https://youtu.be/${v.id}`;
      ov.querySelectorAll(".vid-tabs button").forEach(b => b.setAttribute("aria-pressed", +b.dataset.i === i));
    };
    // si hay un solo video, no hace falta mostrar la pestaña como botón
    if (list.length === 1) ov.querySelector(".vid-tabs").innerHTML = `<strong>${list[0].t}</strong>`;
    show(0);
    const close = () => { ov.remove(); document.removeEventListener("keydown", onKey); };
    const onKey = (e) => { if (e.key === "Escape") close(); };
    document.addEventListener("keydown", onKey);
    ov.addEventListener("click", (e) => {
      if (e.target === ov || e.target.closest(".vid-x")) return close();
      const t = e.target.closest(".vid-tabs button[data-i]"); if (t) show(+t.dataset.i);
    });
  }

  // en la portada: marca en las tarjetas que tienen video
  document.querySelectorAll("a.card.tile[href]").forEach(a => {
    const v = VIDEOS[a.getAttribute("href")];
    if (v) { const b = document.createElement("span"); b.className = "vid-badge"; b.textContent = v.length > 1 ? `🎬 ${v.length} videos` : "🎬 video"; a.appendChild(b); }
  });
})();
