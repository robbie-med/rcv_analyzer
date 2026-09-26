# rcv_analyzer

Is the change real? A static page (rcv.robbiemed.org) that takes pasted lab results and says whether the
latest change is bigger than analytical imprecision plus normal within-person biological variation, the
**reference change value (RCV)**. English, français, 한국어.

## What it does

- **Parses messy pastes**: Epic-style `value (date)` lists, tables and tab-separated columns, H/L flags,
  units (`mmol/L`, `x10^9/L`), reference ranges, times, decimal commas, English/French/Korean lab names and
  month names. Order (newest or oldest first) is read from the dates when possible.
- **Log-normal RCV** (Fokkema 2006): `exp(±Z·√2·σ) − 1`, `σ = √ln(1 + CVt²)`, `CVt² = CVI² + CVA²`.
  Rises must be larger than falls, which matters for WBC, CRP, TSH, bilirubin and triglycerides.
- **CVI** from the EFLM Biological Variation Database meta-analysis medians
  (`https://biologicalvariation.eu/api/meta_calculations`, retrieved 2026-09). Ionised Ca and lactate use Ricos
  because EFLM has no estimate. eGFR's CVI is derived from creatinine's.
- **CVA** defaults are typical routine-analyser values. They can be edited per analyte in the page, and the
  edits are saved in the browser. Put in your own lab's QC CV for a sharper threshold.
- **Caveats per analyte**: pre-analytical, drug and method interferences that make a number untrustworthy.
- **Cross-lab checks**: haemolysis (K with LDH/AST/phos/Mg), EDTA contamination, pseudohyperkalaemia,
  concordant dilution or haemoconcentration, glucose-corrected Na, pseudohyponatraemia, albumin and Ca,
  anion gap (albumin-corrected), isolated bicarbonate drop without AG/Cl change, BUN vs creatinine, KDIGO vs
  RCV, ferritin with CRP, HbA1c with anaemia, troponin/transaminases with CK, Hgb–Hct disagreement,
  isolated platelet drop, in-tube glycolysis, biotin pattern, citrate/Hct > 55 %, lipaemia.
- **Multiple-comparison warning** when many analytes are checked at once.

Troponin, NT-proBNP, BNP, procalcitonin and ammonia get caveats but no % verdict.

## Layout

```
index.html        markup
css/style.css     styles (light/dark, mobile)
js/analytes.js    analyte table: CVI, CVA, aliases, names and caveats in en/fr/ko
js/i18n.js        interface strings and cross-lab messages in en/fr/ko
js/core.js        parser, RCV maths, cross-lab rules (no DOM; also loads in Node)
js/app.js         rendering
tests/            node --test tests/*.test.js
```

No build step, and everything runs in the browser.
