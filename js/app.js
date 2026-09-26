/* RCV Checker — DOM layer. Depends on RCVCore, RCV_ANALYTES, RCV_I18N globals. */
(function () {
  "use strict";

  const C = window.RCVCore;
  const ANALYTES = window.RCV_ANALYTES;
  const I18N = window.RCV_I18N;
  const LANGS = ["en", "fr", "ko"];
  const byKey = new Map(ANALYTES.map((a) => [a.key, a]));

  // ------------------------------------------------------------------ storage (best effort)
  const store = {
    get(k) {
      try { return JSON.parse(localStorage.getItem("rcv:" + k)); } catch (e) { return null; }
    },
    set(k, v) {
      try { localStorage.setItem("rcv:" + k, JSON.stringify(v)); } catch (e) { /* private mode */ }
    },
  };

  function initialLang() {
    const q = new URLSearchParams(location.search).get("lang");
    if (LANGS.includes(q)) return q;
    const saved = store.get("lang");
    if (LANGS.includes(saved)) return saved;
    for (const l of navigator.languages || [navigator.language || "en"]) {
      const s = String(l).slice(0, 2).toLowerCase();
      if (LANGS.includes(s)) return s;
    }
    return "en";
  }

  const state = {
    lang: initialLang(),
    conf: store.get("conf") || "95",
    order: store.get("order") || "auto",
    cva: store.get("cva") || {},
    analysed: false,
  };

  const $ = (id) => document.getElementById(id);
  const t = () => I18N[state.lang];

  // ------------------------------------------------------------------ formatting
  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }
  function num(x, d) {
    if (x == null || !isFinite(x)) return "–";
    return new Intl.NumberFormat(state.lang, { maximumFractionDigits: d, minimumFractionDigits: d }).format(x);
  }
  function pct(x, d = 1) {
    if (x == null || !isFinite(x)) return "–";
    return new Intl.NumberFormat(state.lang, {
      style: "percent", signDisplay: "exceptZero", maximumFractionDigits: d, minimumFractionDigits: d,
    }).format(x / 100);
  }
  function pct0(x) {
    return new Intl.NumberFormat(state.lang, { style: "percent", maximumFractionDigits: 0 }).format(x);
  }
  function aname(key) {
    const a = byKey.get(key);
    return a ? a.names[state.lang] || a.names.en : key;
  }
  function list(keys) {
    const names = keys.map(aname);
    try {
      return new Intl.ListFormat(state.lang, { style: "long", type: "conjunction" }).format(names);
    } catch (e) {
      return names.join(", ");
    }
  }
  const H = { name: aname, list: (k) => esc(list(k)), num, pct, pct0 };

  // ------------------------------------------------------------------ static text
  function applyStatic() {
    const L = t();
    document.documentElement.lang = L.htmlLang;
    document.title = L.title;
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const v = L[el.dataset.i18n];
      if (typeof v === "string") el.textContent = v;
    });
    document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
      el.placeholder = L[el.dataset.i18nPh];
    });
    document.querySelectorAll("#lang button").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang));
    });

    const conf = $("conf");
    conf.innerHTML = ["95", "95-1", "99"].map((v) => `<option value="${v}">${esc(L["conf" + v])}</option>`).join("");
    conf.value = state.conf;
    const order = $("order");
    order.innerHTML = [["auto", "orderAuto"], ["newest", "orderNewest"], ["oldest", "orderOldest"]]
      .map(([v, k]) => `<option value="${v}">${esc(L[k])}</option>`).join("");
    order.value = state.order;

    $("general").innerHTML = L.general.map((g) => `<li>${esc(g)}</li>`).join("");
    renderSettings();
  }

  // ------------------------------------------------------------------ sparkline
  function sparkline(r) {
    const pts = r.chrono.filter((p) => p.v > 0);
    if (pts.length < 2) return "";
    const W = 132, Hh = 36, pad = 4;
    const vs = pts.map((p) => p.v);
    let lo = Math.min(...vs), hi = Math.max(...vs);
    if (hi === lo) { hi += 1; lo -= 1; }
    const x = (i) => pad + (i * (W - 2 * pad)) / (pts.length - 1);
    const y = (v) => Hh - pad - ((v - lo) * (Hh - 2 * pad)) / (hi - lo);
    let segs = "";
    for (let i = 1; i < pts.length; i++) {
      const step = r.steps[r.chrono.indexOf(pts[i]) - 1];
      const cls = step && step.sig ? "seg sig" : "seg";
      segs += `<line class="${cls}" x1="${x(i - 1).toFixed(1)}" y1="${y(pts[i - 1].v).toFixed(1)}" x2="${x(i).toFixed(1)}" y2="${y(pts[i].v).toFixed(1)}"/>`;
    }
    const dots = pts
      .map((p, i) => `<circle class="${i === pts.length - 1 ? "dot last" : "dot"}" cx="${x(i).toFixed(1)}" cy="${y(p.v).toFixed(1)}" r="${i === pts.length - 1 ? 3.2 : 2.2}"/>`)
      .join("");
    return `<svg class="spark" viewBox="0 0 ${W} ${Hh}" width="${W}" height="${Hh}" aria-hidden="true">${segs}${dots}</svg>`;
  }

  // ------------------------------------------------------------------ result card
  function cmpRow(label, c) {
    if (!c) return "";
    let tag = "";
    if (c.assessable) tag = c.sig ? `<span class="mini real">✓</span>` : `<span class="mini noise">≈</span>`;
    const dates = c.from.date && c.to.date ? `<span class="dates">${esc(c.from.date.label)} → ${esc(c.to.date.label)}</span>` : "";
    return `<div class="row"><dt>${esc(label)}</dt><dd><b class="${c.sig ? "hl" : ""}">${pct(c.pct)}</b> ${tag} ${dates}</dd></div>`;
  }

  function card(r, i) {
    const L = t();
    const def = r.def;
    const title = def ? aname(def.key) : r.entry.label;
    const showRaw = def && r.entry.label.toLowerCase() !== title.toLowerCase();
    const n = r.chrono.length;
    const verdict = L.verdict[r.verdict];

    let meta = "";
    if (n > 1) {
      meta = r.orderSource === "dates" ? L.orderDates : r.orderSource === "default" ? L.orderDefault : L.orderSet(r.order);
    }

    const series = r.chrono
      .map((p) => `<li${p === r.latest ? ' class="cur"' : ""}><span class="v">${esc(p.text)}</span>${p.date ? `<span class="d">${esc(p.date.label)}</span>` : ""}</li>`)
      .join("");

    let body = "";
    if (n >= 2) {
      body += `<dl class="cmp">`;
      body += cmpRow(L.vsPrev, r.last);
      if (r.overall) body += cmpRow(L.vsFirst, r.overall);
      if (r.lim) {
        body += `<div class="row"><dt>${esc(L.needed)}</dt><dd>${pct(r.lim.up)} / ${pct(r.lim.down)}</dd></div>`;
      }
      if (r.trend && r.lim) {
        body += `<div class="row"><dt>${esc(L.trend)}</dt><dd>${esc(L.trends[r.trend])}${n > 2 ? ` <span class="sub">· ${esc(L.steps(r.sigSteps, r.steps.length))}</span>` : ""}</dd></div>`;
      }
      body += `</dl>`;
    }
    if (def && def.cvi == null) body += `<p class="why">${esc(L.noRcv[def.noRcv || "none"])}</p>`;
    if (!def) body += `<p class="why">${esc(L.unknownHint)}</p>`;

    let src = "";
    if (r.lim) {
      const srcTxt = def.src === "EFLM" ? L.srcEFLM : def.src === "Ricos" ? L.srcRicos : L.srcDerived;
      src = `<p class="src">${esc(L.cvLine(num(def.cvi, 1), num(r.cva, 1), num(r.lim.cvt, 1)))} · ${esc(srcTxt)}</p>`;
    }

    let notes = "";
    if (def && def.notes.length) {
      notes = `<details class="caveats"><summary><span class="warnicon" aria-hidden="true">!</span>${esc(L.caveats(def.notes.length))}</summary><ul>${def.notes
        .map((x) => `<li>${esc(x[state.lang] || x.en)}</li>`)
        .join("")}</ul></details>`;
    }

    return `<article class="res v-${r.verdict}" id="res-${i}">
      <div class="res-id">
        <h3>${esc(title)}${showRaw ? ` <span class="raw">${esc(r.entry.label)}</span>` : ""}</h3>
        <div class="latest"><span class="lv">${esc(r.latest.text)}</span>${r.previous ? `<span class="pv">${esc(L.previous)} ${esc(r.previous.text)}</span>` : ""}</div>
        ${sparkline(r)}
        <ol class="series">${series}</ol>
        ${meta ? `<p class="meta">${esc(meta)}</p>` : ""}
      </div>
      <div class="res-main">
        <p class="verdict"><span class="pill p-${r.verdict}">${esc(verdict)}</span></p>
        ${body}
        ${src}
        ${notes}
      </div>
    </article>`;
  }

  // ------------------------------------------------------------------ main render
  function run() {
    const L = t();
    const text = $("input").value;
    store.set("text", text);
    const parsed = C.parse(text, ANALYTES, state.lang);
    const results = C.analyzeAll(parsed, ANALYTES, { conf: state.conf, order: state.order, cvaOverrides: state.cva });
    state.analysed = true;

    const out = $("results");
    const summary = $("summary");
    const alerts = $("alerts");
    const skipped = $("skipped");

    if (!results.length) {
      summary.innerHTML = `<p class="empty">${esc(L.empty)}</p>`;
      alerts.innerHTML = out.innerHTML = skipped.innerHTML = "";
      return;
    }

    // summary
    const real = results.map((r, i) => [r, i]).filter(([r]) => r.verdict === "real");
    const noise = results.filter((r) => r.verdict === "noise").length;
    const other = results.length - real.length - noise;
    const m = real.length + noise;
    let s = `<div class="counts">
      <span class="count c-real"><b>${real.length}</b> ${esc(L.sumReal(real.length))}</span>
      <span class="count c-noise"><b>${noise}</b> ${esc(L.sumNoise(noise))}</span>
      ${other ? `<span class="count c-other"><b>${other}</b> ${esc(L.sumOther(other))}</span>` : ""}
    </div>`;
    if (real.length) {
      s += `<p class="reallist">${esc(L.realList)} ${real
        .map(([r, i]) => `<a href="#res-${i}">${esc(r.def ? aname(r.def.key) : r.entry.label)} <span>${pct(r.last.pct, 0)}</span></a>`)
        .join(" ")}</p>`;
    }
    if (m >= 5) {
      const fa = C.falseAlarm(m, state.conf);
      s += `<p class="multi">${L.multi({ m, pAny: fa.pAny, expected: fa.expected }, H)}</p>`;
    }
    summary.innerHTML = s;

    // cross-lab alerts
    const found = C.rules(results);
    if (found.length) {
      found.sort((a, b) => (a.level === b.level ? 0 : a.level === "warn" ? -1 : 1));
      alerts.innerHTML = `<h2>${esc(L.alertsTitle)}</h2><p class="sub">${esc(L.alertsSub)}</p><ul class="alerts">${found
        .map((f) => `<li class="al al-${f.level}"><span class="tags">${f.keys.map((k) => `<span class="tag">${esc(aname(k))}</span>`).join("")}</span><span class="msg">${L.rules[f.id](f.params, H)}</span></li>`)
        .join("")}</ul>`;
    } else {
      alerts.innerHTML = "";
    }

    out.innerHTML = results.map(card).join("");
    skipped.innerHTML = parsed.skipped.length
      ? `<details><summary>${esc(L.skipped(parsed.skipped.length))}</summary><pre>${esc(parsed.skipped.join("\n"))}</pre></details>`
      : "";
  }

  // ------------------------------------------------------------------ settings table
  function renderSettings() {
    const L = t();
    const z = C.Z[state.conf];
    const rows = ANALYTES.filter((a) => a.cvi != null)
      .map((a) => {
        const cva = state.cva[a.key] != null ? state.cva[a.key] : a.cva;
        const lim = C.rcv(a.cvi, cva, z);
        const changed = state.cva[a.key] != null;
        return `<tr>
          <th scope="row">${esc(a.names[state.lang] || a.names.en)}</th>
          <td class="num">${num(a.cvi, 2)}<span class="srcmark" title="${esc(a.src)}">${a.src === "EFLM" ? "" : "*"}</span></td>
          <td class="num"><input type="number" step="0.1" min="0" max="50" inputmode="decimal" data-key="${a.key}" value="${cva}" class="${changed ? "changed" : ""}" aria-label="${esc(L.thCva)} ${esc(a.names[state.lang])}"></td>
          <td class="num">${pct(lim.up)}</td>
          <td class="num">${pct(lim.down)}</td>
        </tr>`;
      })
      .join("");
    $("settings-table").innerHTML = `<thead><tr><th scope="col">${esc(L.thAnalyte)}</th><th scope="col" class="num">${esc(L.thCvi)}</th><th scope="col" class="num">${esc(L.thCva)}</th><th scope="col" class="num">${esc(L.thUp)}</th><th scope="col" class="num">${esc(L.thDown)}</th></tr></thead><tbody>${rows}</tbody>`;
  }

  // ------------------------------------------------------------------ events
  function rerun() {
    renderSettings();
    if (state.analysed) run();
  }

  function init() {
    $("input").value = store.get("text") || "";
    applyStatic();

    $("lang").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-lang]");
      if (!b) return;
      state.lang = b.dataset.lang;
      store.set("lang", state.lang);
      applyStatic();
      if (state.analysed) run();
    });
    $("analyze").addEventListener("click", run);
    $("example").addEventListener("click", () => {
      $("input").value = t().example;
      run();
    });
    $("clear").addEventListener("click", () => {
      $("input").value = "";
      store.set("text", "");
      state.analysed = false;
      ["summary", "alerts", "results", "skipped"].forEach((id) => ($(id).innerHTML = ""));
      $("input").focus();
    });
    $("input").addEventListener("keydown", (e) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) run();
    });
    $("conf").addEventListener("change", (e) => {
      state.conf = e.target.value;
      store.set("conf", state.conf);
      rerun();
    });
    $("order").addEventListener("change", (e) => {
      state.order = e.target.value;
      store.set("order", state.order);
      rerun();
    });
    $("settings-table").addEventListener("change", (e) => {
      const inp = e.target.closest("input[data-key]");
      if (!inp) return;
      const key = inp.dataset.key;
      const v = parseFloat(String(inp.value).replace(",", "."));
      if (isFinite(v) && v >= 0 && v !== byKey.get(key).cva) state.cva[key] = v;
      else delete state.cva[key];
      store.set("cva", state.cva);
      rerun();
    });
    $("reset").addEventListener("click", () => {
      state.cva = {};
      store.set("cva", state.cva);
      rerun();
    });

    if ($("input").value.trim()) run();
  }

  init();
})();
