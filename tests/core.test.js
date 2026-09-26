// Run with: node --test tests/
const test = require("node:test");
const assert = require("node:assert/strict");
const C = require("../js/core.js");
const A = require("../js/analytes.js");
const I = require("../js/i18n.js");

const byKey = new Map(A.map((a) => [a.key, a]));
const run = (text, opts = {}, lang = "en") => {
  const parsed = C.parse(text, A, lang);
  return { parsed, results: C.analyzeAll(parsed, A, { conf: "95", order: "auto", ...opts }) };
};
const near = (a, b, tol = 0.05) => assert.ok(Math.abs(a - b) <= tol, `${a} not within ${tol} of ${b}`);

test("symmetric RCV matches the textbook 2.77 × CVt", () => {
  near(C.rcvSymmetric(3.9, 1.5, 1.96), 2.772 * Math.hypot(3.9, 1.5), 0.01);
});

test("log-normal RCV converges to symmetric for small CVs and is asymmetric for large ones", () => {
  const na = C.rcv(0.55, 0.8, 1.96);
  near(na.up, 2.73, 0.02);
  near(na.down, -2.65, 0.02);
  const crp = C.rcv(34.68, 4, 1.96);
  assert.ok(crp.up > 150 && crp.down > -65 && crp.down < -55);
});

test("every analyte has names and notes in all three languages", () => {
  for (const a of A) {
    for (const l of ["en", "fr", "ko"]) {
      assert.ok(a.names[l], `${a.key} name ${l}`);
      for (const n of a.notes) assert.ok(n[l], `${a.key} note ${l}`);
    }
  }
});

test("every rule has a message in every language", () => {
  const ids = Object.keys(I.en.rules);
  for (const l of ["fr", "ko"]) assert.deepEqual(Object.keys(I[l].rules).sort(), ids.slice().sort());
});

test("aliases are unique across analytes", () => {
  const seen = new Map();
  for (const a of A) {
    for (const al of a.aliases) {
      const t = C.normText(typeof al === "string" ? al : al.t);
      const langs = typeof al === "string" ? ["en", "fr", "ko"] : al.langs;
      for (const l of langs) {
        const k = l + ":" + t;
        assert.ok(!seen.has(k) || seen.get(k) === a.key, `alias ${t} used by ${seen.get(k)} and ${a.key}`);
        seen.set(k, a.key);
      }
    }
  }
});

test("parses Epic-style value (date) lists with flags, newest first", () => {
  const { results } = run("K H 5.9 (Jan 5) 4.3 (Jan 4) 4.2 (Jan 3)");
  const r = results[0];
  assert.equal(r.key, "K");
  assert.deepEqual(r.chrono.map((p) => p.v), [4.2, 4.3, 5.9]);
  assert.equal(r.orderSource, "dates");
  assert.equal(r.verdict, "real");
});

test("detects oldest-first order from dates", () => {
  const { results } = run("Na 140 (01/01/2026) 138 (01/03/2026) 135 (01/05/2026)");
  assert.equal(results[0].order, "oldest");
  assert.equal(results[0].latest.v, 135);
});

test("ignores units, reference ranges and times; handles tabs", () => {
  const { results } = run("Sodium (mmol/L)\t138\t135-145\t141 01/05 06:12\t140");
  assert.deepEqual(results[0].entry.points.map((p) => p.v), [138, 141, 140]);
});

test("strips x10^9/L style units", () => {
  const { results } = run("Plt 250 x10^9/L (Jan 5) 180 x10^9/L (Jan 4)");
  assert.deepEqual(results[0].entry.points.map((p) => p.v), [250, 180]);
});

test("French decimal commas and month names", () => {
  const { results } = run("Potassium 5,9 (5 janv.) 4,3 (4 janv.)", {}, "fr");
  assert.equal(results[0].key, "K");
  assert.deepEqual(results[0].entry.points.map((p) => p.v), [5.9, 4.3]);
  assert.equal(results[0].entry.points[0].date.label, "5 janv.");
});

test("comma-separated lists are not read as decimals", () => {
  const { results } = run("Creatinine 1.32,1.18,1.10");
  assert.deepEqual(results[0].entry.points.map((p) => p.v), [1.32, 1.18, 1.1]);
});

test("Korean names and dates", () => {
  const { results } = run("혈색소 11.9 (1월 5일) 12.6 (1월 4일)", {}, "ko");
  assert.equal(results[0].key, "HGB");
  assert.equal(results[0].orderSource, "dates");
});

test("accent-insensitive French names", () => {
  const { results } = run("Hemoglobine 119 126\nCréatinine 117 104\nUrée 7,1 6,0", {}, "fr");
  assert.deepEqual(results.map((r) => r.key), ["HGB", "CR", "BUN"]);
});

test("'TP' means total protein in English but is not guessed in French", () => {
  assert.equal(run("TP 7.1 6.2").results[0].key, "TP");
  assert.equal(run("TP 85 60", {}, "fr").results[0].key, null);
});

test("longest alias wins (LDL vs LDH vs LD, HbA1c vs Hb, iCa vs Ca)", () => {
  const { results } = run("LDL 100 90\nLDH 200 210\nHbA1c 7.1 6.8\nHb 12 11\niCa 1.1 1.2\nCa 9.1 9.0");
  assert.deepEqual(results.map((r) => r.key), ["LDL", "LDH", "A1C", "HGB", "ICA", "CA"]);
});

test("censored values are not assessed", () => {
  const { results } = run("eGFR >90 (Jan 5) 78 (Jan 4)");
  assert.equal(results[0].verdict, "censored");
});

test("unknown analytes are kept with their name", () => {
  const { results } = run("Vitamin D 25 30");
  assert.equal(results[0].key, null);
  assert.equal(results[0].entry.label, "Vitamin D");
  assert.equal(results[0].verdict, "unknown");
});

test("troponin shows no % verdict", () => {
  assert.equal(run("hs-TnT 18 12").results[0].verdict, "nodata");
});

test("sodium 138 → 140 is noise (the old 1.4 % threshold flagged it)", () => {
  assert.equal(run("Na 140 138").results[0].verdict, "noise");
});

test("rule: haemolysis pattern", () => {
  const ids = C.rules(run("K 5.9 4.3\nLDH 410 220\nAST 58 31").results).map((r) => r.id);
  assert.ok(ids.includes("hemolysis"));
});

test("rule: EDTA contamination", () => {
  const ids = C.rules(run("K 7.9 4.3\nCa 6.1 9.2").results).map((r) => r.id);
  assert.ok(ids.includes("edta"));
});

test("rule: concordant dilution", () => {
  const ids = C.rules(run("Hgb 11.0 12.4\nAlb 3.2 3.7\nPlt 180 215\nWBC 8 8.1").results).map((r) => r.id);
  assert.ok(ids.includes("dilution"));
});

test("rule: KDIGO rise within noise at high baseline", () => {
  const ids = C.rules(run("Cr 3.3 3.0").results).map((r) => r.id);
  assert.ok(ids.includes("kdigoNoise"));
});

test("rule: pseudohyperkalaemia with thrombocytosis", () => {
  const ids = C.rules(run("K 5.8 5.6\nPlt 820 790").results).map((r) => r.id);
  assert.ok(ids.includes("pseudoK"));
});

test("rule messages render in all languages without throwing", () => {
  const { results } = run(I.en.example);
  const found = C.rules(results);
  const h = { name: (k) => k, list: (k) => k.join(", "), num: (x) => String(x), pct: (x) => String(x), pct0: (x) => String(x) };
  for (const l of ["en", "fr", "ko"]) for (const f of found) assert.ok(I[l].rules[f.id](f.params, h).length > 10);
});

test("the three bundled examples parse identically", () => {
  const verdicts = (l) => run(I[l].example, {}, l).results.map((r) => `${r.key}:${r.verdict}`);
  assert.deepEqual(verdicts("fr"), verdicts("en"));
  assert.deepEqual(verdicts("ko"), verdicts("en"));
  assert.ok(byKey.get("NA"));
});
