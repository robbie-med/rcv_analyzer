/* RCV Checker — core logic (no DOM).
 * Parsing pasted lab text, reference change value maths, and cross-lab rules.
 * Loaded as a classic <script> in the browser (window.RCVCore) and via require() in tests.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  else root.RCVCore = mod;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  // ---------------------------------------------------------------------------
  // Statistics
  // ---------------------------------------------------------------------------

  const Z = { "95": 1.96, "95-1": 1.645, "99": 2.576 };
  const ALPHA = { "95": 0.05, "95-1": 0.05, "99": 0.01 };

  function totalCV(cvi, cva) {
    return Math.sqrt(cvi * cvi + cva * cva);
  }

  // SD of ln(x) for a log-normal variable with the given CV (%).
  function lnSigma(cvPct) {
    const cv = cvPct / 100;
    return Math.sqrt(Math.log(1 + cv * cv));
  }

  // Asymmetric (log-normal) reference change value, Fokkema et al. Clin Chem 2006.
  // Returns the % change needed upward and downward, plus the log-space limits.
  function rcv(cvi, cva, z) {
    const s = lnSigma(totalCV(cvi, cva));
    const k = z * Math.SQRT2 * s;
    return {
      up: (Math.exp(k) - 1) * 100,
      down: (Math.exp(-k) - 1) * 100,
      k,
      // One SD of the difference between two results; used to call a step "moving".
      k1: Math.SQRT2 * s,
      cvt: totalCV(cvi, cva),
    };
  }

  // Classic symmetric formula, shown for comparison: 1.96 * sqrt(2) * CVt.
  function rcvSymmetric(cvi, cva, z) {
    return z * Math.SQRT2 * totalCV(cvi, cva);
  }

  // ---------------------------------------------------------------------------
  // Text normalisation and alias lookup
  // ---------------------------------------------------------------------------

  // Lowercase, strip Latin accents (é -> e), keep Hangul intact.
  function normText(s) {
    return s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .normalize("NFC")
      .toLowerCase()
      .replace(/[   ]/g, " ");
  }

  function buildAliasIndex(analytes, lang) {
    const list = [];
    for (const a of analytes) {
      for (const al of a.aliases) {
        const entry = typeof al === "string" ? { t: al } : al;
        if (entry.langs && !entry.langs.includes(lang)) continue;
        list.push({ alias: normText(entry.t), key: a.key });
      }
    }
    list.sort((x, y) => y.alias.length - x.alias.length);
    return list;
  }

  const WORDCHAR = /[a-zÀ-ɏ가-힯㄰-㆏]/;

  function matchAlias(normLine, index) {
    for (const { alias, key } of index) {
      if (!normLine.startsWith(alias)) continue;
      const next = normLine.charAt(alias.length);
      if (next && WORDCHAR.test(next)) continue;
      // "CO2" style aliases end in a digit; make sure we did not cut a number in half.
      if (/\d$/.test(alias) && /\d/.test(next)) continue;
      return { key, len: alias.length };
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Dates
  // ---------------------------------------------------------------------------

  const MON =
    "jan(?:uary|vier|v)?|feb(?:ruary)?|fev(?:r(?:ier)?)?|mar(?:ch|s)?|apr(?:il)?|avr(?:il)?|may|mai|" +
    "june?|juin|july?|juil(?:let)?|aug(?:ust)?|aout|sept?(?:ember|embre)?|oct(?:ober|obre)?|" +
    "nov(?:ember|embre)?|dec(?:ember|embre)?";

  function monthNum(s) {
    s = s.toLowerCase();
    const table = [
      ["jan", 1], ["fe", 2], ["mar", 3], ["ap", 4], ["av", 4], ["ma", 5],
      ["juin", 6], ["jun", 6], ["juil", 7], ["jul", 7], ["au", 8], ["ao", 8],
      ["se", 9], ["oc", 10], ["no", 11], ["de", 12],
    ];
    for (const [p, n] of table) if (s.startsWith(p)) return n;
    return null;
  }

  function normYear(y) {
    if (!y) return null;
    const n = +y;
    return y.length === 2 ? 2000 + n : n;
  }

  // Each source is an un-anchored pattern plus a converter; reused for tokens and paren contents.
  const DATE_SRC = [
    ["(\\d{4})[-./](\\d{1,2})[-./](\\d{1,2})", (m) => ({ y: +m[1], m: +m[2], d: +m[3] })],
    ["(?:(\\d{4})\\s*년\\s*)?(\\d{1,2})\\s*월\\s*(\\d{1,2})\\s*일", (m) => ({ y: m[1] ? +m[1] : null, m: +m[2], d: +m[3] })],
    [
      "(?<![a-z])(" + MON + ")\\.?\\s*(\\d{1,2})(?:(?:,\\s*|\\s+)(\\d{4}))?(?![\\d]|[.,]\\d)",
      (m) => ({ m: monthNum(m[1]), d: +m[2], y: m[3] ? +m[3] : null }),
    ],
    [
      "(?<![\\d.,])(\\d{1,2})\\s*(" + MON + ")(?![a-z])\\.?(?:\\s+(\\d{4}))?",
      (m) => ({ d: +m[1], m: monthNum(m[2]), y: m[3] ? +m[3] : null }),
    ],
    ["(?<![\\d.])(\\d{1,2})\\.(\\d{1,2})\\.(\\d{2,4})(?![\\d])", (m) => ({ d: +m[1], m: +m[2], y: normYear(m[3]) })],
    [
      "(?<![\\d.])(\\d{1,2})/(\\d{1,2})(?:/(\\d{2,4}))?(?![\\d])",
      (m) => ({ a: +m[1], b: +m[2], y: normYear(m[3]) }),
    ],
  ];

  function findDate(text) {
    for (const [src, conv] of DATE_SRC) {
      const m = new RegExp(src, "i").exec(text);
      if (m) return conv(m);
    }
    return null;
  }

  // Candidate sort keys for a date. Slash dates are ambiguous (MM/DD vs DD/MM).
  function dateKeys(d) {
    if (!d) return null;
    const y = d.y || 0;
    if (d.a != null) return { md: y * 10000 + d.a * 100 + d.b, dm: y * 10000 + d.b * 100 + d.a };
    return { md: y * 10000 + d.m * 100 + d.d, dm: y * 10000 + d.m * 100 + d.d };
  }

  // Returns "newest" | "oldest" | null from the printed order of dated points.
  function detectOrder(points) {
    const dated = points.filter((p) => p.date && p.date.parsed);
    if (dated.length < 2) return null;
    for (const variant of ["md", "dm"]) {
      const keys = dated.map((p) => dateKeys(p.date.parsed)[variant]);
      let inc = 0, dec = 0;
      for (let i = 1; i < keys.length; i++) {
        if (keys[i] > keys[i - 1]) inc++;
        else if (keys[i] < keys[i - 1]) dec++;
      }
      if (inc && !dec) return "oldest";
      if (dec && !inc) return "newest";
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // Line tokenizer
  // ---------------------------------------------------------------------------

  const TOKEN_SRC = [
    "(\\([^)]*\\)|\\[[^\\]]*\\])", // 1 bracketed group: date, flag, unit or range
    "(" + DATE_SRC.map((d) => "(?:" + d[0].replace(/\((?!\?)/g, "(?:") + ")").join("|") + ")", // 2 bare date
    "(\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\s*[ap]\\.?m\\.?)?)", // 3 time
    "(\\d+(?:[.,]\\d+)?\\s*[-–—]\\s*\\d+(?:[.,]\\d+)?)", // 4 reference range
    "([^\\s()]*[/^*][^\\s()]*)", // 5 unit such as mmol/L, x10^9/L, 10*3/uL
    "(?<![a-z0-9.])([<>≤≥]=?\\s*)?([-+]?\\d+(?:\\.\\d+|,\\d{1,2}(?!\\d))?)", // 6 censor, 7 value
  ];
  const TOKEN_RE = new RegExp(TOKEN_SRC.join("|"), "gi");

  function toNumber(s) {
    return parseFloat(s.replace(",", "."));
  }

  function splitName(normLine, index) {
    const hit = matchAlias(normLine, index);
    if (hit) {
      return { key: hit.key, name: null, rest: normLine.slice(hit.len), nameLen: hit.len };
    }
    // Unknown analyte: the first word is always the name; keep going until something numeric.
    const words = normLine.split(/(\s+)/);
    let name = "";
    let i = 0;
    for (; i < words.length; i++) {
      const w = words[i];
      if (/^\s+$/.test(w) || w === "") { name += w; continue; }
      const isFirst = name.trim() === "";
      if (!isFirst && (/^[<>≤≥]?[-+]?\d/.test(w) || /^[([]/.test(w) || /^[:=]$/.test(w))) break;
      name += w;
    }
    name = name.trim().replace(/[:=]+$/, "").trim();
    return { key: null, name, rest: words.slice(i).join(""), nameLen: name.length };
  }

  // `display` is the same text before normalisation (same length), used for date labels.
  function tokenize(rest, display) {
    const shown = display && display.length === rest.length ? display : rest;
    const events = [];
    TOKEN_RE.lastIndex = 0;
    let m;
    while ((m = TOKEN_RE.exec(rest)) !== null) {
      if (m[1]) {
        const inner = m[1].slice(1, -1);
        const d = findDate(inner);
        if (d) events.push({ type: "date", label: shown.substr(m.index + 1, inner.length).trim(), parsed: d });
      } else if (m[2]) {
        events.push({ type: "date", label: shown.substr(m.index, m[2].length).trim(), parsed: findDate(m[2]) });
      } else if (m[7]) {
        events.push({ type: "val", v: toNumber(m[7]), censored: !!m[6], text: (m[6] || "").replace(/\s+/g, "") + m[7] });
      }
      if (m[0] === "") TOKEN_RE.lastIndex++;
    }
    return events;
  }

  function parseLine(line, index) {
    const raw = line.replace(/\t/g, "  ").trim();
    if (!raw) return null;
    const norm = normText(raw);
    const { key, name, rest, nameLen } = splitName(norm, index);
    const display = raw.length === norm.length ? raw.slice(raw.length - rest.length) : null;
    const events = tokenize(rest, display);
    const vals = events.filter((e) => e.type === "val");
    if (!vals.length) return null;

    const pre = events[0].type === "date";
    const points = [];
    let pending = null;
    for (const e of events) {
      if (e.type === "date") {
        if (pre) pending = e;
        else if (points.length && !points[points.length - 1].date) points[points.length - 1].date = e;
      } else {
        points.push({ v: e.v, censored: e.censored, text: e.text, date: pre ? pending : null });
        pending = null;
      }
    }
    const label = raw.slice(0, nameLen).trim() || (name || "?");
    return { raw, label, key, points };
  }

  function parse(text, analytes, lang) {
    const index = buildAliasIndex(analytes, lang || "en");
    const entries = [];
    const skipped = [];
    for (const line of text.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const p = parseLine(line, index);
      if (p) entries.push(p);
      else skipped.push(line.trim());
    }
    return { entries, skipped };
  }

  // ---------------------------------------------------------------------------
  // Series analysis
  // ---------------------------------------------------------------------------

  function orderPoints(points, order) {
    let used = order;
    let source = "setting";
    if (order === "auto") {
      const det = detectOrder(points);
      used = det || "newest";
      source = det ? "dates" : "default";
    }
    const chrono = used === "newest" ? points.slice().reverse() : points.slice();
    return { chrono, used, source };
  }

  function usable(p) {
    return !p.censored && p.v > 0;
  }

  function compare(a, b, lim) {
    const out = { from: a, to: b, pct: null, sig: null, dir: 0, moved: false, assessable: false };
    if (!(a.v > 0) || !(b.v > 0)) return out;
    const lr = Math.log(b.v / a.v);
    out.pct = (Math.exp(lr) - 1) * 100;
    out.lr = lr;
    if (!lim || !usable(a) || !usable(b)) return out;
    out.assessable = true;
    out.sig = Math.abs(lr) > lim.k;
    out.moved = Math.abs(lr) >= lim.k1;
    out.dir = out.sig ? Math.sign(lr) : 0;
    return out;
  }

  function trendOf(steps, overall) {
    const moving = steps.filter((s) => s.assessable && s.moved).map((s) => Math.sign(s.lr));
    const ovSig = overall && overall.sig;
    const ovDir = overall && overall.lr ? Math.sign(overall.lr) : 0;
    if (!moving.length) return ovSig ? (ovDir > 0 ? "rising" : "falling") : "stable";
    const same = moving.every((x) => x === moving[0]);
    if (same) {
      if (ovSig) return moving[0] > 0 ? "rising" : "falling";
      return moving[0] > 0 ? "driftUp" : "driftDown";
    }
    if (ovSig) return ovDir > 0 ? "netUp" : "netDown";
    return "fluctuating";
  }

  function analyzeEntry(entry, def, opts) {
    const z = Z[opts.conf] || Z["95"];
    const { chrono, used, source } = orderPoints(entry.points, opts.order || "auto");
    const hasRcv = !!(def && def.cvi != null);
    const cva = hasRcv ? (opts.cvaOverrides && opts.cvaOverrides[def.key] != null ? opts.cvaOverrides[def.key] : def.cva) : null;
    const lim = hasRcv ? rcv(def.cvi, cva, z) : null;

    const steps = [];
    for (let i = 1; i < chrono.length; i++) steps.push(compare(chrono[i - 1], chrono[i], lim));
    const n = chrono.length;
    const last = steps.length ? steps[steps.length - 1] : null;
    const overall = n >= 3 ? compare(chrono[0], chrono[n - 1], lim) : null;

    let verdict;
    if (n < 2) verdict = "single";
    else if (!def) verdict = "unknown";
    else if (!hasRcv) verdict = "nodata";
    else if (!last.assessable) verdict = "censored";
    else verdict = last.sig ? "real" : "noise";

    const trend = n < 3 ? "insufficient" : hasRcv ? trendOf(steps, overall) : null;

    return {
      entry, def, key: def ? def.key : null, chrono, order: used, orderSource: source,
      cva, lim, steps, last, overall, trend, verdict,
      latest: chrono[n - 1], previous: n > 1 ? chrono[n - 2] : null,
      sigSteps: steps.filter((s) => s.sig).length,
    };
  }

  function analyzeAll(parsed, analytes, opts) {
    const byKey = new Map(analytes.map((a) => [a.key, a]));
    return parsed.entries.map((e) => analyzeEntry(e, e.key ? byKey.get(e.key) : null, opts));
  }

  // ---------------------------------------------------------------------------
  // Unit guesses (only used by the cross-lab rules; RCV itself is unit-free)
  // ---------------------------------------------------------------------------

  const U = {
    glucoseMgdl: (v) => (v > 35 ? v : v * 18.016),
    creatMgdl: (v) => (v > 20 ? v / 88.4 : v),
    creatIsSI: (v) => v > 20,
    albGdl: (v) => (v > 10 ? v / 10 : v),
    proteinGdl: (v) => (v > 20 ? v / 10 : v),
    tgMgdl: (v) => (v > 30 ? v : v * 88.57),
    hgbGdl: (v) => (v > 30 ? v / 10 : v),
    hctPct: (v) => (v < 1.5 ? v * 100 : v),
    countE9: (v) => (v > 2000 ? v / 1000 : v),
  };

  // ---------------------------------------------------------------------------
  // Cross-lab rules: patterns across analytes that suggest "don't trust the number"
  // ---------------------------------------------------------------------------

  function rules(results) {
    const get = {};
    for (const r of results) if (r.key && !get[r.key] && r.chrono.length) get[r.key] = r;
    const has = (k) => !!get[k];
    const up = (k) => has(k) && get[k].last && get[k].last.sig && get[k].last.dir > 0;
    const down = (k) => has(k) && get[k].last && get[k].last.sig && get[k].last.dir < 0;
    const latest = (k) => (has(k) ? get[k].latest.v : null);
    const lastPct = (k) => (has(k) && get[k].last ? get[k].last.pct : null);
    const out = [];
    const add = (id, level, keys, params) => out.push({ id, level, keys, params: params || {} });

    // 1. In-vitro hemolysis: K up together with intracellular analytes.
    if (up("K")) {
      const with_ = ["LDH", "AST", "PHOS", "MG"].filter(up);
      if (with_.length) add("hemolysis", "warn", ["K", ...with_], { with: with_ });
    }

    // 2. EDTA (lavender top) contamination: K up while Ca / ALP / Mg fall.
    if (up("K")) {
      const low = ["CA", "ALP", "MG"].filter(down);
      if (low.length) add("edta", "warn", ["K", ...low], { low });
    }

    // 3. Pseudohyperkalaemia from thrombocytosis or extreme leukocytosis.
    if (has("K")) {
      const plt = has("PLT") ? U.countE9(latest("PLT")) : null;
      const wbc = has("WBC") ? U.countE9(latest("WBC")) : null;
      if ((plt && plt > 500) || (wbc && wbc > 50)) {
        add("pseudoK", "warn", ["K", plt > 500 ? "PLT" : "WBC"], { plt, wbc });
      }
    }

    // 4. Dilution / haemoconcentration / posture: many "concentration" analytes shift together.
    {
      const pool = ["HGB", "HCT", "RBC", "ALB", "TP", "PLT", "CA", "CHOL"].filter(
        (k) => has(k) && get[k].last && get[k].last.assessable
      );
      for (const dir of [1, -1]) {
        const moved = pool.filter((k) => get[k].last.moved && Math.sign(get[k].last.lr) === dir);
        const against = pool.filter((k) => get[k].last.sig && get[k].last.dir === -dir);
        if (moved.length >= 3 && !against.length) {
          const pcts = moved.map((k) => get[k].last.pct);
          add(dir < 0 ? "dilution" : "concentration", "warn", moved, {
            keys: moved, min: Math.min(...pcts), max: Math.max(...pcts),
          });
        }
      }
    }

    // 5. Hyperglycaemia and sodium: translocational hyponatraemia.
    if (has("NA") && has("GLU")) {
      const g = U.glucoseMgdl(latest("GLU"));
      if (g > 200) {
        const na = latest("NA");
        add("glucoseNa", "info", ["NA", "GLU"], {
          na, katz: na + (1.6 * (g - 100)) / 100, hillier: na + (2.4 * (g - 100)) / 100,
        });
      }
      if ((up("GLU") && down("NA")) || (down("GLU") && up("NA"))) {
        add("glucoseNaShift", "info", ["NA", "GLU"], {});
      }
    }

    // 6. Pseudohyponatraemia from lipids / paraprotein.
    if (has("NA")) {
      const tg = has("TG") ? U.tgMgdl(latest("TG")) : null;
      const tp = has("TP") ? U.proteinGdl(latest("TP")) : null;
      if ((tg && tg > 1000) || (tp && tp > 10)) add("pseudoNa", "warn", ["NA", tg > 1000 ? "TG" : "TP"], {});
    }

    // 7. Calcium tracks albumin.
    if (has("CA") && has("ALB")) {
      if (down("CA") && get.ALB.last && get.ALB.last.lr < 0 && get.ALB.last.moved) add("caAlbFall", "info", ["CA", "ALB"], {});
      else if (U.albGdl(latest("ALB")) < 3.5) add("caAlbLow", "info", ["CA", "ALB"], {});
    }

    // 8. Anion gap, albumin-corrected, and electroneutrality check on a bicarbonate drop.
    if (has("NA") && has("CL") && has("CO2")) {
      const ag = latest("NA") - latest("CL") - latest("CO2");
      const alb = has("ALB") ? U.albGdl(latest("ALB")) : null;
      const agc = alb != null ? ag + 2.5 * (4.0 - alb) : null;
      add(ag < 3 ? "agLow" : "ag", ag < 3 ? "warn" : "info", ["NA", "CL", "CO2"].concat(alb != null ? ["ALB"] : []), { ag, agc, alb });

      if (down("CO2")) {
        const prev = (k) => (get[k].previous ? get[k].previous.v : null);
        const agPrev = [prev("NA"), prev("CL"), prev("CO2")].every((x) => x != null)
          ? prev("NA") - prev("CL") - prev("CO2")
          : null;
        const clRose = up("CL");
        if (agPrev != null && !clRose && ag - agPrev < 3) {
          add("co2Isolated", "warn", ["CO2", "CL", "NA"], { agPrev, ag });
        }
      }
    }

    // 9. Urea/BUN up with creatinine flat.
    if (up("BUN") && has("CR") && get.CR.last && get.CR.last.assessable && !up("CR")) add("bunAlone", "info", ["BUN", "CR"], {});

    // 10. Creatinine: KDIGO absolute criterion vs RCV.
    if (has("CR") && get.CR.last && get.CR.last.assessable) {
      const a = get.CR.last.from.v, b = get.CR.last.to.v;
      const si = U.creatIsSI(b);
      const delta = b - a;
      const kdigo = si ? delta >= 26.5 - 1e-9 : delta >= 0.3 - 1e-9;
      if (kdigo && !get.CR.last.sig) add("kdigoNoise", "warn", ["CR"], { delta, si });
      else if (get.CR.last.sig && get.CR.last.dir > 0 && !kdigo) add("rcvNotKdigo", "info", ["CR"], { delta, si });
    }

    // 11. Ferritin is an acute-phase reactant.
    if (has("FER") && has("CRP")) add("ferritinCrp", "info", ["FER", "CRP"], {});

    // 12. HbA1c with anaemia or a changing haemoglobin.
    if (has("A1C") && has("HGB")) {
      const h = U.hgbGdl(latest("HGB"));
      if (h < 11 || (get.HGB.last && get.HGB.last.sig)) add("a1cHgb", "warn", ["A1C", "HGB"], { hgb: h });
    }

    // 13. Troponin with CK rising: skeletal muscle.
    if (has("TROP") && up("CK")) add("tropCk", "info", ["TROP", "CK"], {});

    // 14. Transaminases with CK rising: muscle source.
    if (up("CK") && (up("AST") || up("ALT"))) add("astCk", "info", ["CK", up("AST") ? "AST" : "ALT"], {});

    // 15. Hgb and Hct disagree.
    if (has("HGB") && has("HCT") && get.HGB.last && get.HCT.last && get.HGB.last.assessable && get.HCT.last.assessable) {
      const h = get.HGB.last, t = get.HCT.last;
      const disagree = (h.sig && (!t.moved || Math.sign(t.lr) !== h.dir)) || (t.sig && (!h.moved || Math.sign(h.lr) !== t.dir));
      if (disagree) add("hgbHct", "warn", ["HGB", "HCT"], { hgb: h.pct, hct: t.pct });
    }

    // 16. Isolated platelet drop.
    if (down("PLT")) {
      const others = ["HGB", "WBC"].filter((k) => has(k) && get[k].last && get[k].last.assessable);
      if (others.length && others.every((k) => !get[k].last.sig)) add("pltIsolated", "warn", ["PLT"], { pct: lastPct("PLT") });
    }

    // 17. Glucose falling in a sample with high WBC (in-tube glycolysis).
    if (down("GLU") && has("WBC") && U.countE9(latest("WBC")) > 25) add("glycolysis", "info", ["GLU", "WBC"], {});

    // 18. Discordant thyroid pattern: biotin / assay interference.
    if (has("TSH") && has("FT4") && down("TSH") && up("FT4")) add("biotin", "info", ["TSH", "FT4"], {});

    // 19. High haematocrit and citrate ratio.
    if ((has("INR") || has("APTT") || has("PT")) && has("HCT") && U.hctPct(latest("HCT")) > 55) {
      add("citrateHct", "warn", [has("INR") ? "INR" : has("PT") ? "PT" : "APTT", "HCT"], { hct: U.hctPct(latest("HCT")) });
    }

    // 20. Lipaemia: very high triglycerides interfere with many assays.
    if (has("TG") && U.tgMgdl(latest("TG")) > 1000) add("lipemia", "warn", ["TG"], {});

    return out;
  }

  // Probability of at least one false "real change" across m independent comparisons.
  function falseAlarm(m, conf) {
    const a = ALPHA[conf] || 0.05;
    return { expected: m * a, pAny: 1 - Math.pow(1 - a, m), alpha: a };
  }

  return {
    Z, ALPHA, totalCV, lnSigma, rcv, rcvSymmetric,
    normText, buildAliasIndex, matchAlias, findDate, detectOrder,
    parseLine, parse, analyzeEntry, analyzeAll, rules, falseAlarm, U,
  };
});
