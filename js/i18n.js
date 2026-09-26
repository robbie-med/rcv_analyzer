/* RCV Checker — interface strings (en / fr / ko).
 * Rule messages are functions of (params, helpers). helpers: name(key), list(keys), num(x, digits), pct(x).
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  else root.RCV_I18N = mod;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const EXAMPLE_EN = [
    "Na 136 (Jan 5) 139 (Jan 4) 138 (Jan 3)",
    "K H 5.9 (Jan 5) 4.3 (Jan 4) 4.2 (Jan 3)",
    "Cl 104 (Jan 5) 104 (Jan 4) 103 (Jan 3)",
    "CO2 L 19 (Jan 5) 24 (Jan 4) 25 (Jan 3)",
    "Creatinine 1.32 (Jan 5) 1.18 (Jan 4) 1.10 (Jan 3)",
    "Glucose 112 (Jan 5) 98 (Jan 4) 104 (Jan 3)",
    "AST H 58 (Jan 5) 31 (Jan 4) 29 (Jan 3)",
    "LDH H 410 (Jan 5) 220 (Jan 4) 214 (Jan 3)",
    "Hgb 11.9 (Jan 5) 12.6 (Jan 4) 13.1 (Jan 3)",
    "Plt 212 (Jan 5) 230 (Jan 4) 241 (Jan 3)",
    "WBC 9.8 (Jan 5) 8.1 (Jan 4) 7.9 (Jan 3)",
  ].join("\n");

  const EXAMPLE_FR = [
    "Sodium 136 (5 janv.) 139 (4 janv.) 138 (3 janv.)",
    "Potassium H 5,9 (5 janv.) 4,3 (4 janv.) 4,2 (3 janv.)",
    "Chlore 104 (5 janv.) 104 (4 janv.) 103 (3 janv.)",
    "Bicarbonates L 19 (5 janv.) 24 (4 janv.) 25 (3 janv.)",
    "Créatinine 117 µmol/L (5 janv.) 104 (4 janv.) 97 (3 janv.)",
    "Glycémie 6,2 (5 janv.) 5,4 (4 janv.) 5,8 (3 janv.)",
    "ASAT H 58 (5 janv.) 31 (4 janv.) 29 (3 janv.)",
    "LDH H 410 (5 janv.) 220 (4 janv.) 214 (3 janv.)",
    "Hémoglobine 119 g/L (5 janv.) 126 (4 janv.) 131 (3 janv.)",
    "Plaquettes 212 (5 janv.) 230 (4 janv.) 241 (3 janv.)",
    "Leucocytes 9,8 (5 janv.) 8,1 (4 janv.) 7,9 (3 janv.)",
  ].join("\n");

  const EXAMPLE_KO = [
    "나트륨 136 (1월 5일) 139 (1월 4일) 138 (1월 3일)",
    "칼륨 H 5.9 (1월 5일) 4.3 (1월 4일) 4.2 (1월 3일)",
    "염소 104 (1월 5일) 104 (1월 4일) 103 (1월 3일)",
    "총이산화탄소 L 19 (1월 5일) 24 (1월 4일) 25 (1월 3일)",
    "크레아티닌 1.32 (1월 5일) 1.18 (1월 4일) 1.10 (1월 3일)",
    "혈당 112 (1월 5일) 98 (1월 4일) 104 (1월 3일)",
    "AST H 58 (1월 5일) 31 (1월 4일) 29 (1월 3일)",
    "LDH H 410 (1월 5일) 220 (1월 4일) 214 (1월 3일)",
    "혈색소 11.9 (1월 5일) 12.6 (1월 4일) 13.1 (1월 3일)",
    "혈소판 212 (1월 5일) 230 (1월 4일) 241 (1월 3일)",
    "백혈구 9.8 (1월 5일) 8.1 (1월 4일) 7.9 (1월 3일)",
  ].join("\n");

  const en = {
    htmlLang: "en",
    langName: "English",
    title: "RCV Checker",
    tagline: "Is the change real, or just lab noise plus normal day-to-day biology?",
    inputLabel: "Paste lab results, one analyte per line",
    placeholder: "Na 138 (Jan 5) 141 (Jan 3) 140 (Jan 1)\nK H 5.9 (Jan 5) 4.4 (Jan 3)\nCreatinine 1.32, 1.18, 1.10",
    formatHint:
      "Handles “value (date)” lists, tables and tab-separated columns, H/L flags, units, reference ranges and decimal commas. English, French and Korean lab names are recognised.",
    analyze: "Analyse",
    exampleBtn: "Load example",
    clear: "Clear",
    conf: "Confidence",
    conf95: "95 % two-sided",
    "conf95-1": "95 % one-sided (you predicted the direction)",
    conf99: "99 % (when scanning many labs)",
    order: "Order in the paste",
    orderAuto: "Auto (from dates)",
    orderNewest: "Newest first",
    orderOldest: "Oldest first",
    empty: "Nothing recognised yet. Paste results above and press Analyse.",
    // summary
    sumReal: (n) => (n === 1 ? "real change" : "real changes"),
    sumNoise: () => "within noise",
    sumOther: () => "not assessable",
    multi: (p, h) =>
      `You are checking ${p.m} changes at once. Even if nothing had changed, there would be a ${h.pct0(p.pAny)} chance that at least one looks “real” (about ${h.num(p.expected, 1)} expected by chance). Switch to 99 % when scanning a whole panel.`,
    realList: "Real changes:",
    // alerts
    alertsTitle: "Cross-lab checks",
    alertsSub: "Patterns across these results that suggest an artefact, or need a correction before you trust a number.",
    // card
    latest: "Latest",
    previous: "Previous",
    vsPrev: "Latest vs previous",
    vsFirst: "Latest vs first",
    needed: "Needed to be real",
    trend: "Trend",
    steps: (k, n) => `${k} of ${n} steps significant`,
    orderDates: "order read from dates",
    orderDefault: "order assumed: newest first",
    orderSet: (o) => (o === "newest" ? "newest first" : "oldest first"),
    caveats: (n) => `${n} reason${n > 1 ? "s" : ""} not to trust this number`,
    srcEFLM: "CVI: EFLM Biological Variation Database",
    srcRicos: "CVI: Ricos database (no EFLM estimate)",
    srcDerived: "CVI derived from creatinine",
    cvLine: (cvi, cva, cvt) => `CVI ${cvi} % · CVA ${cva} % · total ${cvt} %`,
    verdict: {
      real: "Real change",
      noise: "Within noise",
      single: "Only one result",
      unknown: "Not recognised",
      nodata: "No % threshold — read notes",
      censored: "Censored value (< or >)",
    },
    noRcv: {
      assay: "Use the assay-specific absolute delta, not a % RCV.",
      wide: "Within-person variation is too large and study-dependent for a reliable % threshold.",
      none: "No reliable biological-variation estimate.",
    },
    unknownHint: "Not in the table, so no threshold. The change is shown for reference only.",
    trends: {
      insufficient: "Need ≥ 3 results",
      stable: "Stable",
      rising: "Rising",
      falling: "Falling",
      driftUp: "Drifting up (not yet significant)",
      driftDown: "Drifting down (not yet significant)",
      netUp: "Net rise, with bumps",
      netDown: "Net fall, with bumps",
      fluctuating: "Fluctuating (noise)",
    },
    skipped: (n) => `${n} line${n > 1 ? "s" : ""} ignored (no numbers found)`,
    // method section
    methodTitle: "How this works, and when not to trust it",
    methodIntro:
      "The reference change value (RCV) is the smallest difference between two results that is unlikely (at the chosen confidence) to come from measurement error plus normal within-person biological variation alone.",
    methodFormula:
      "RCV = exp(± Z · √2 · σ) − 1, with σ = √ln(1 + CVt²) and CVt² = CVI² + CVA². This log-normal form (Fokkema 2006) makes rises need to be larger than falls, which matters for WBC, CRP, TSH, bilirubin and triglycerides.",
    methodSources:
      "CVI values are EFLM Biological Variation Database meta-analysis medians (healthy adults). CVA defaults are typical routine-analyser imprecision. Put in your own lab's QC CVs below for a sharper answer.",
    generalTitle: "Before trusting any change",
    general: [
      "“Real” only means bigger than noise. It doesn't mean clinically important, and “within noise” doesn't mean nothing is happening.",
      "Same lab, same method, same sample type. Blood gas vs chemistry analyser, point-of-care vs lab, serum vs plasma, or two hospitals: the RCV doesn't apply.",
      "The within-person CVs come from healthy people in a steady state. Acutely ill patients vary more, so treat the threshold as a minimum.",
      "Pre-analytical traps cause most false changes: a draw near an IV line, haemolysis, tourniquet time, posture, fasting state, time of day, and delay before processing.",
      "Regression to the mean: an extreme first value tends to come back towards normal on repeat, even with no treatment.",
      "Look at many labs and some will cross the threshold by chance. Use the 99 % setting when scanning a panel.",
    ],
    settingsTitle: "Analytical CV for your lab",
    settingsIntro:
      "The default CVA is a typical routine value. Ask your lab for their between-day QC CV at a level near your patient's result and enter it here. It is saved in this browser only.",
    thAnalyte: "Analyte",
    thCvi: "CVI %",
    thCva: "CVA %",
    thUp: "Rise ≥",
    thDown: "Fall ≥",
    reset: "Reset to defaults",
    footer: "Decision support for clinicians, not a diagnosis. Everything runs in your browser and nothing is uploaded.",
    rules: {
      hemolysis: (p, h) =>
        `Potassium rose together with ${h.list(p.with)}. This is the classic signature of in-vitro haemolysis. Check the haemolysis index before treating hyperkalaemia.`,
      edta: (p, h) =>
        `Potassium rose while ${h.list(p.low)} fell, which is typical of EDTA (lavender-top) contamination or a wrong order of draw. Recollect before acting.`,
      pseudoK: (p, h) =>
        `${p.plt > 500 ? `Platelets ${h.num(p.plt, 0)}` : `WBC ${h.num(p.wbc, 0)}`} ×10⁹/L: serum potassium can be falsely high from release during clotting. Confirm on heparin plasma or a blood gas.`,
      dilution: (p, h) =>
        `${h.list(p.keys)} all fell together (${h.pct(p.max)} to ${h.pct(p.min)}). One shared cause (IV fluids, a sample drawn near an infusion, or supine vs upright posture) is more likely than several separate real changes.`,
      concentration: (p, h) =>
        `${h.list(p.keys)} all rose together (${h.pct(p.min)} to ${h.pct(p.max)}). Think haemoconcentration: upright posture, a long tourniquet or dehydration, rather than several separate real changes.`,
      glucoseNa: (p, h) =>
        `Glucose is high. Corrected sodium ≈ ${h.num(p.katz, 0)} (Katz, ×1.6) to ${h.num(p.hillier, 0)} (Hillier, ×2.4) mmol/L, against ${h.num(p.na, 0)} measured.`,
      glucoseNaShift: () =>
        "Sodium and glucose moved in opposite directions. Part of the sodium change may be water following glucose (translocation), so judge the corrected sodium.",
      pseudoNa: () =>
        "Very high triglycerides or protein: an indirect-ISE sodium may be falsely low. Compare with a blood-gas (direct ISE) sodium.",
      caAlbFall: () =>
        "Total calcium fell together with albumin. The ionised fraction may not have changed, so measure ionised calcium before treating.",
      caAlbLow: () =>
        "Albumin is low: total calcium understates ionised calcium and “corrected” formulas are unreliable. Measure ionised Ca if it matters.",
      ag: (p, h) =>
        `Anion gap = ${h.num(p.ag, 0)} mmol/L${p.agc != null ? `, or ≈ ${h.num(p.agc, 0)} corrected for albumin (${h.num(p.alb, 1)} g/dL)` : ""}.`,
      agLow: (p, h) =>
        `Anion gap = ${h.num(p.ag, 0)} mmol/L, which is very low or negative. Suspect a lab error, bromide or iodide, an IgG paraprotein, lithium toxicity or severe hypoalbuminaemia.`,
      co2Isolated: (p, h) =>
        `Bicarbonate fell, but neither chloride nor the anion gap rose to match (gap ${h.num(p.agPrev, 0)} → ${h.num(p.ag, 0)}). Electroneutrality says one of them should have. Suspect CO₂ lost from the tube (underfilled, air exposure, delay).`,
      bunAlone: () =>
        "Urea/BUN rose while creatinine stayed flat. Think GI bleeding, steroids, protein load or TPN, or catabolism before assuming a falling GFR.",
      kdigoNoise: (p, h) =>
        `Creatinine rose by ${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"}. That meets KDIGO's absolute AKI criterion if it happened within 48 h, but at this level it is still within analytical plus biological noise. Repeat before labelling AKI.`,
      rcvNotKdigo: (p, h) =>
        `The creatinine rise (${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"}) exceeds the RCV, so it is likely real even though it is below KDIGO's 0.3 mg/dL (26.5 µmol/L).`,
      ferritinCrp: () =>
        "Ferritin is an acute-phase reactant. With inflammation, a normal or high ferritin doesn't exclude iron deficiency, so use transferrin saturation (and sTfR if available).",
      a1cHgb: () =>
        "Haemoglobin is low or changing. Bleeding, haemolysis, transfusion and iron or ESA treatment all make HbA1c unreliable, so consider fructosamine or CGM.",
      tropCk: () =>
        "Troponin with a rising CK: skeletal-muscle injury can raise cTnT (much less so cTnI). Read the troponin delta with that in mind.",
      astCk: () => "CK is rising with the transaminases. Muscle is a likely source (AST > ALT), not necessarily the liver.",
      hgbHct: (p, h) =>
        `Haemoglobin (${h.pct(p.hgb)}) and haematocrit (${h.pct(p.hct)}) disagree, but they should move together. Suspect interference: lipaemia, extreme leukocytosis, cold agglutinins or in-vitro haemolysis.`,
      pltIsolated: (p, h) =>
        `Platelets fell (${h.pct(p.pct)}) while the other counts held steady. Check the smear for clumping (EDTA pseudothrombocytopenia). If the patient has been on heparin for 5–10 days, calculate the 4Ts score.`,
      glycolysis: () =>
        "Glucose fell in a sample with a high white count, and leukocytes consume glucose in the tube. Use a fluoride tube or process promptly.",
      biotin: () =>
        "TSH fell while FT4 rose. If the patient doesn't look hyperthyroid, ask about biotin and consider assay interference.",
      citrateHct: (p, h) =>
        `Haematocrit ${h.num(p.hct, 0)} %: above 55 % a standard citrate tube has too much anticoagulant for the plasma, so clotting times read falsely long. Ask the lab for an adjusted-citrate tube.`,
      lipemia: () =>
        "Triglycerides are very high. Lipaemia interferes with sodium (indirect ISE), Hgb, bilirubin, lipase and more, so ask about ultracentrifugation or use a blood-gas sodium.",
    },
    example: EXAMPLE_EN,
  };

  const fr = {
    htmlLang: "fr",
    langName: "Français",
    title: "Vérificateur de RCV",
    tagline: "La variation est-elle réelle, ou seulement le bruit analytique et la variabilité biologique ?",
    inputLabel: "Collez les résultats, un paramètre par ligne",
    placeholder: "Na 138 (5 janv.) 141 (3 janv.) 140 (1 janv.)\nK H 5,9 (5 janv.) 4,4 (3 janv.)\nCréatinine 117, 104, 97",
    formatHint:
      "Accepte les listes « valeur (date) », les tableaux et colonnes tabulées, les indicateurs H/L, les unités, les intervalles de référence et la virgule décimale. Noms en anglais, français et coréen reconnus.",
    analyze: "Analyser",
    exampleBtn: "Charger un exemple",
    clear: "Effacer",
    conf: "Niveau de confiance",
    conf95: "95 % bilatéral",
    "conf95-1": "95 % unilatéral (sens prédit)",
    conf99: "99 % (balayage de nombreux paramètres)",
    order: "Ordre dans le collage",
    orderAuto: "Auto (d'après les dates)",
    orderNewest: "Plus récent d'abord",
    orderOldest: "Plus ancien d'abord",
    empty: "Rien de reconnu pour l'instant. Collez des résultats puis cliquez sur Analyser.",
    sumReal: (n) => (n > 1 ? "variations réelles" : "variation réelle"),
    sumNoise: () => "dans le bruit",
    sumOther: (n) => (n > 1 ? "non évaluables" : "non évaluable"),
    multi: (p, h) =>
      `Vous testez ${p.m} variations à la fois. Même sans aucun changement réel, il y aurait ${h.pct0(p.pAny)} de risque qu'au moins une paraisse « réelle » (environ ${h.num(p.expected, 1)} attendue(s) par hasard). Passez à 99 % pour balayer un bilan complet.`,
    realList: "Variations réelles :",
    alertsTitle: "Vérifications croisées",
    alertsSub: "Associations entre ces résultats qui évoquent un artefact ou imposent une correction avant de croire un chiffre.",
    latest: "Dernier",
    previous: "Précédent",
    vsPrev: "Dernier vs précédent",
    vsFirst: "Dernier vs premier",
    needed: "Seuil de variation réelle",
    trend: "Tendance",
    steps: (k, n) => `${k} étape(s) significative(s) sur ${n}`,
    orderDates: "ordre lu dans les dates",
    orderDefault: "ordre supposé : plus récent d'abord",
    orderSet: (o) => (o === "newest" ? "plus récent d'abord" : "plus ancien d'abord"),
    caveats: (n) => `${n} raison${n > 1 ? "s" : ""} de se méfier de ce chiffre`,
    srcEFLM: "CVI : base de variation biologique EFLM",
    srcRicos: "CVI : base de Ricos (pas d'estimation EFLM)",
    srcDerived: "CVI dérivé de la créatinine",
    cvLine: (cvi, cva, cvt) => `CVI ${cvi} % · CVA ${cva} % · total ${cvt} %`,
    verdict: {
      real: "Variation réelle",
      noise: "Dans le bruit",
      single: "Un seul résultat",
      unknown: "Non reconnu",
      nodata: "Pas de seuil en % : lire les notes",
      censored: "Valeur tronquée (< ou >)",
    },
    noRcv: {
      assay: "Utiliser le delta absolu propre au dosage, pas une différence critique en %.",
      wide: "La variabilité intra-individuelle est trop grande et trop variable selon les études pour un seuil fiable en %.",
      none: "Pas d'estimation fiable de la variation biologique.",
    },
    unknownHint: "Absent de la table, donc sans seuil. La variation n'est affichée qu'à titre indicatif.",
    trends: {
      insufficient: "Il faut ≥ 3 résultats",
      stable: "Stable",
      rising: "En hausse",
      falling: "En baisse",
      driftUp: "Dérive vers le haut (pas encore significative)",
      driftDown: "Dérive vers le bas (pas encore significative)",
      netUp: "Hausse nette, irrégulière",
      netDown: "Baisse nette, irrégulière",
      fluctuating: "Fluctuant (bruit)",
    },
    skipped: (n) => `${n} ligne${n > 1 ? "s" : ""} ignorée${n > 1 ? "s" : ""} (aucun nombre trouvé)`,
    methodTitle: "Principe, et quand ne pas s'y fier",
    methodIntro:
      "La différence critique (RCV, reference change value) est le plus petit écart entre deux résultats qu'il est peu probable (au niveau de confiance choisi) d'expliquer par l'erreur analytique et la variation biologique intra-individuelle seules.",
    methodFormula:
      "RCV = exp(± Z · √2 · σ) − 1, avec σ = √ln(1 + CVt²) et CVt² = CVI² + CVA². Cette forme log-normale (Fokkema 2006) exige une hausse plus grande qu'une baisse, ce qui compte pour les leucocytes, la CRP, la TSH, la bilirubine et les triglycérides.",
    methodSources:
      "Les CVI sont les médianes de la méta-analyse de la base EFLM (adultes sains). Les CVA par défaut correspondent à une imprécision typique d'automate. Saisissez les CV de CIQ de votre laboratoire ci-dessous pour un résultat plus précis.",
    generalTitle: "Avant de croire une variation",
    general: [
      "« Réelle » veut seulement dire plus grande que le bruit. Ce n'est pas forcément cliniquement important, et « dans le bruit » ne veut pas dire que rien ne se passe.",
      "Même laboratoire, même méthode, même type d'échantillon. Gaz du sang vs biochimie, délocalisé vs laboratoire, sérum vs plasma, deux hôpitaux : la différence critique ne s'applique pas.",
      "Les CV intra-individuels viennent de sujets sains à l'état stable. Les patients aigus varient davantage, donc traitez le seuil comme un minimum.",
      "Les pièges pré-analytiques font la plupart des fausses variations : prélèvement près d'une perfusion, hémolyse, durée du garrot, posture, jeûne, heure, délai avant traitement.",
      "Régression vers la moyenne : une première valeur extrême tend à se rapprocher de la normale au contrôle, même sans traitement.",
      "Regardez beaucoup de paramètres et certains franchiront le seuil par hasard. Utilisez 99 % pour balayer un bilan.",
    ],
    settingsTitle: "CV analytique de votre laboratoire",
    settingsIntro:
      "Le CVA par défaut est une valeur typique. Demandez à votre laboratoire son CV de CIQ inter-séries à un niveau proche du résultat du patient et saisissez-le ici. Il est enregistré uniquement dans ce navigateur.",
    thAnalyte: "Paramètre",
    thCvi: "CVI %",
    thCva: "CVA %",
    thUp: "Hausse ≥",
    thDown: "Baisse ≥",
    reset: "Valeurs par défaut",
    footer: "Aide à la décision pour cliniciens, pas un diagnostic. Tout est calculé dans votre navigateur et rien n'est envoyé.",
    rules: {
      hemolysis: (p, h) =>
        `Le potassium a augmenté en même temps que ${h.list(p.with)}. C'est la signature classique d'une hémolyse in vitro. Vérifiez l'indice d'hémolyse avant de traiter une hyperkaliémie.`,
      edta: (p, h) =>
        `Le potassium a augmenté alors que ${h.list(p.low)} ont baissé, ce qui est typique d'une contamination par l'EDTA (tube violet) ou d'un mauvais ordre des tubes. Reprélever avant d'agir.`,
      pseudoK: (p, h) =>
        `${p.plt > 500 ? `Plaquettes ${h.num(p.plt, 0)}` : `Leucocytes ${h.num(p.wbc, 0)}`} G/L : le potassium sérique peut être faussement élevé (libération pendant la coagulation). Contrôler sur plasma hépariné ou gaz du sang.`,
      dilution: (p, h) =>
        `${h.list(p.keys)} ont tous baissé ensemble (${h.pct(p.max)} à ${h.pct(p.min)}). Une cause commune (perfusion, prélèvement près d'une perfusion, passage debout → couché) est plus probable que plusieurs variations réelles indépendantes.`,
      concentration: (p, h) =>
        `${h.list(p.keys)} ont tous augmenté ensemble (${h.pct(p.min)} à ${h.pct(p.max)}). Penser hémoconcentration (station debout, garrot prolongé, déshydratation) plutôt qu'à plusieurs variations réelles indépendantes.`,
      glucoseNa: (p, h) =>
        `Glycémie élevée. Natrémie corrigée ≈ ${h.num(p.katz, 0)} (Katz, ×1,6) à ${h.num(p.hillier, 0)} (Hillier, ×2,4) mmol/L, contre ${h.num(p.na, 0)} mesurée.`,
      glucoseNaShift: () =>
        "Natrémie et glycémie ont varié en sens inverse. Une partie de la variation du sodium peut venir de l'eau qui suit le glucose (translocation) : juger la natrémie corrigée.",
      pseudoNa: () =>
        "Triglycérides ou protides très élevés : la natrémie par ISE indirecte peut être faussement basse. Comparer avec la natrémie des gaz du sang (ISE directe).",
      caAlbFall: () =>
        "La calcémie totale a baissé avec l'albumine. La fraction ionisée n'a peut-être pas changé : doser le calcium ionisé avant de traiter.",
      caAlbLow: () =>
        "Albumine basse : la calcémie totale sous-estime le calcium ionisé et les formules « corrigées » sont peu fiables. Doser le Ca ionisé si la décision en dépend.",
      ag: (p, h) =>
        `Trou anionique = ${h.num(p.ag, 0)} mmol/L${p.agc != null ? `, soit ≈ ${h.num(p.agc, 0)} corrigé pour l'albumine (${h.num(p.alb * 10, 0)} g/L)` : ""}.`,
      agLow: (p, h) =>
        `Trou anionique = ${h.num(p.ag, 0)} mmol/L, très bas ou négatif. Suspecter une erreur analytique, des bromures ou iodures, une paraprotéine IgG, une intoxication au lithium ou une hypoalbuminémie sévère.`,
      co2Isolated: (p, h) =>
        `Les bicarbonates ont baissé, mais ni le chlore ni le trou anionique n'ont augmenté en proportion (trou ${h.num(p.agPrev, 0)} → ${h.num(p.ag, 0)}). L'électroneutralité exige que l'un des deux monte. Suspecter une perte de CO₂ dans le tube (sous-remplissage, air, délai).`,
      bunAlone: () =>
        "L'urée a augmenté alors que la créatinine est stable. Penser hémorragie digestive, corticoïdes, apport protéique ou nutrition parentérale, catabolisme, avant de conclure à une baisse du DFG.",
      kdigoNoise: (p, h) =>
        `La créatinine a augmenté de ${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"}. Cela remplit le critère absolu KDIGO d'IRA si c'est survenu en 48 h, mais à ce niveau cela reste dans le bruit analytique et biologique. Recontrôler avant de conclure à une IRA.`,
      rcvNotKdigo: (p, h) =>
        `La hausse de créatinine (${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"}) dépasse la différence critique : probablement réelle, même si elle reste sous le seuil KDIGO de 26,5 µmol/L (0,3 mg/dL).`,
      ferritinCrp: () =>
        "La ferritine est une protéine de l'inflammation. En cas d'inflammation, une ferritine normale ou haute n'exclut pas une carence martiale : utiliser le coefficient de saturation (et le RsTf si disponible).",
      a1cHgb: () =>
        "Hémoglobine basse ou changeante. Saignement, hémolyse, transfusion, fer ou ASE rendent l'HbA1c peu fiable : envisager fructosamine ou mesure continue du glucose.",
      tropCk: () =>
        "Troponine avec CK en hausse : une atteinte musculaire squelettique peut augmenter la cTnT (beaucoup moins la cTnI). En tenir compte pour interpréter le delta de troponine.",
      astCk: () => "Les CK augmentent avec les transaminases. Origine musculaire probable (ASAT > ALAT), pas forcément hépatique.",
      hgbHct: (p, h) =>
        `Hémoglobine (${h.pct(p.hgb)}) et hématocrite (${h.pct(p.hct)}) divergent alors qu'ils devraient évoluer ensemble. Suspecter une interférence : lipémie, hyperleucocytose extrême, agglutinines froides, hémolyse in vitro.`,
      pltIsolated: (p, h) =>
        `Les plaquettes ont baissé (${h.pct(p.pct)}) alors que les autres lignées sont stables. Vérifier le frottis (agrégats, fausse thrombopénie à l'EDTA). Si le patient est sous héparine depuis 5 à 10 jours, calculer le score 4T.`,
      glycolysis: () =>
        "La glycémie a baissé dans un échantillon riche en leucocytes, qui consomment le glucose dans le tube. Utiliser un tube fluoré ou analyser rapidement.",
      biotin: () =>
        "La TSH a baissé et la FT4 a augmenté. Si la clinique n'évoque pas une hyperthyroïdie, rechercher une prise de biotine et envisager une interférence analytique.",
      citrateHct: (p, h) =>
        `Hématocrite ${h.num(p.hct, 0)} % : au-delà de 55 %, le tube citraté standard contient trop d'anticoagulant pour le plasma et les temps de coagulation sont faussement allongés. Demander un tube à citrate ajusté.`,
      lipemia: () =>
        "Triglycérides très élevés. La lipémie perturbe la natrémie (ISE indirecte), l'Hb, la bilirubine, la lipase, etc. Demander une ultracentrifugation ou utiliser la natrémie des gaz du sang.",
    },
    example: EXAMPLE_FR,
  };

  const ko = {
    htmlLang: "ko",
    langName: "한국어",
    title: "RCV 검사기",
    tagline: "이 변화는 진짜일까, 아니면 측정 오차와 정상적인 일간 생물학적 변동일까?",
    inputLabel: "검사 결과를 붙여넣으세요 (한 줄에 한 항목)",
    placeholder: "Na 138 (1월 5일) 141 (1월 3일) 140 (1월 1일)\nK H 5.9 (1월 5일) 4.4 (1월 3일)\n크레아티닌 1.32, 1.18, 1.10",
    formatHint:
      "“값 (날짜)” 목록, 표·탭 구분 열, H/L 표시, 단위, 참고범위, 소수점 쉼표를 처리합니다. 영어·프랑스어·한국어 항목명을 인식합니다.",
    analyze: "분석",
    exampleBtn: "예시 불러오기",
    clear: "지우기",
    conf: "신뢰수준",
    conf95: "95% 양측",
    "conf95-1": "95% 단측 (방향을 미리 예상한 경우)",
    conf99: "99% (여러 항목을 한꺼번에 볼 때)",
    order: "붙여넣은 순서",
    orderAuto: "자동 (날짜로 판단)",
    orderNewest: "최신 먼저",
    orderOldest: "오래된 것 먼저",
    empty: "아직 인식된 항목이 없습니다. 결과를 붙여넣고 분석을 누르세요.",
    sumReal: () => "실제 변화",
    sumNoise: () => "잡음 범위",
    sumOther: () => "평가 불가",
    multi: (p, h) =>
      `한 번에 ${p.m}개의 변화를 보고 있습니다. 실제로 아무것도 변하지 않았더라도 적어도 하나가 “실제 변화”로 보일 확률이 ${h.pct0(p.pAny)}입니다(우연히 약 ${h.num(p.expected, 1)}개 예상). 전체 패널을 훑어볼 때는 99%로 바꾸세요.`,
    realList: "실제 변화:",
    alertsTitle: "항목 간 교차 점검",
    alertsSub: "이 결과들 사이의 패턴 중 인공 오류를 시사하거나, 수치를 믿기 전에 보정이 필요한 것들입니다.",
    latest: "최근",
    previous: "이전",
    vsPrev: "최근 vs 이전",
    vsFirst: "최근 vs 처음",
    needed: "실제 변화 기준",
    trend: "추세",
    steps: (k, n) => `${n}단계 중 ${k}단계 유의`,
    orderDates: "날짜로 순서 판단",
    orderDefault: "순서 가정: 최신 먼저",
    orderSet: (o) => (o === "newest" ? "최신 먼저" : "오래된 것 먼저"),
    caveats: (n) => `이 수치를 믿지 말아야 할 이유 ${n}가지`,
    srcEFLM: "CVI: EFLM 생물학적 변동 데이터베이스",
    srcRicos: "CVI: Ricos 데이터베이스 (EFLM 추정치 없음)",
    srcDerived: "CVI: 크레아티닌에서 유도",
    cvLine: (cvi, cva, cvt) => `CVI ${cvi}% · CVA ${cva}% · 총 ${cvt}%`,
    verdict: {
      real: "실제 변화",
      noise: "잡음 범위",
      single: "결과 1개뿐",
      unknown: "인식 안 됨",
      nodata: "% 기준 없음: 주의사항 참고",
      censored: "절단값 (< 또는 >)",
    },
    noRcv: {
      assay: "% RCV가 아니라 측정법별 절대 변화량 기준을 쓰세요.",
      wide: "개인 내 변동이 너무 크고 연구마다 달라 신뢰할 만한 % 기준이 없습니다.",
      none: "신뢰할 만한 생물학적 변동 추정치가 없습니다.",
    },
    unknownHint: "표에 없는 항목이라 기준이 없습니다. 변화량은 참고용으로만 표시합니다.",
    trends: {
      insufficient: "결과가 3개 이상 필요",
      stable: "안정",
      rising: "상승",
      falling: "하강",
      driftUp: "상승 경향 (아직 유의하지 않음)",
      driftDown: "하강 경향 (아직 유의하지 않음)",
      netUp: "들쭉날쭉하지만 순상승",
      netDown: "들쭉날쭉하지만 순하강",
      fluctuating: "변동 (잡음)",
    },
    skipped: (n) => `${n}줄 무시됨 (숫자 없음)`,
    methodTitle: "원리, 그리고 믿지 말아야 할 때",
    methodIntro:
      "기준변화값(RCV, reference change value)은 선택한 신뢰수준에서 측정 오차와 정상적인 개인 내 생물학적 변동만으로는 설명하기 어려운, 두 결과 사이의 최소 차이입니다.",
    methodFormula:
      "RCV = exp(± Z · √2 · σ) − 1, σ = √ln(1 + CVt²), CVt² = CVI² + CVA². 이 로그정규 형태(Fokkema 2006)에서는 상승이 하강보다 커야 유의하며, 백혈구·CRP·TSH·빌리루빈·중성지방에서 특히 중요합니다.",
    methodSources:
      "CVI는 EFLM 생물학적 변동 데이터베이스 메타분석 중앙값(건강한 성인)입니다. 기본 CVA는 일반적인 장비 정밀도입니다. 더 정확한 결과를 원하면 아래에 검사실의 정도관리 CV를 입력하세요.",
    generalTitle: "변화를 믿기 전에",
    general: [
      "“실제”는 잡음보다 크다는 뜻일 뿐입니다. 임상적으로 중요하다는 뜻이 아니며, “잡음 범위”라고 아무 일도 없는 것도 아닙니다.",
      "같은 검사실, 같은 측정법, 같은 검체 종류여야 합니다. 혈액가스 vs 생화학 장비, 현장검사 vs 검사실, 혈청 vs 혈장, 다른 병원이라면 RCV가 적용되지 않습니다.",
      "개인 내 CV는 안정 상태의 건강인에서 얻은 값입니다. 급성기 환자는 더 크게 변하므로 기준을 최솟값으로 보세요.",
      "거짓 변화의 대부분은 검사 전 단계에서 생깁니다: 수액 라인 근처 채혈, 용혈, 토니켓 시간, 자세, 공복 여부, 채혈 시각, 처리 지연.",
      "평균으로의 회귀: 첫 값이 극단적이면 치료하지 않아도 재검에서 정상 쪽으로 돌아오는 경향이 있습니다.",
      "많은 항목을 보면 일부는 우연히 기준을 넘습니다. 패널 전체를 볼 때는 99% 설정을 쓰세요.",
    ],
    settingsTitle: "우리 검사실의 분석 CV",
    settingsIntro:
      "기본 CVA는 일반적인 값입니다. 환자 결과와 비슷한 농도에서의 일간 정도관리 CV를 검사실에 문의해 입력하세요. 이 브라우저에만 저장됩니다.",
    thAnalyte: "항목",
    thCvi: "CVI %",
    thCva: "CVA %",
    thUp: "상승 ≥",
    thDown: "하강 ≥",
    reset: "기본값으로",
    footer: "임상의를 위한 의사결정 보조 도구이며 진단이 아닙니다. 모든 계산은 브라우저 안에서 이루어지며 아무것도 전송되지 않습니다.",
    rules: {
      hemolysis: (p, h) =>
        `칼륨이 ${h.list(p.with)}와(과) 함께 올랐습니다. 시험관 내 용혈의 전형적인 양상입니다. 고칼륨혈증을 치료하기 전에 용혈 지수를 확인하세요.`,
      edta: (p, h) =>
        `칼륨은 오르고 ${h.list(p.low)}는(은) 떨어졌습니다. EDTA(보라색 튜브) 오염이나 채혈 순서 오류의 전형입니다. 조치 전에 재채혈하세요.`,
      pseudoK: (p, h) =>
        `${p.plt > 500 ? `혈소판 ${h.num(p.plt, 0)}` : `백혈구 ${h.num(p.wbc, 0)}`} ×10⁹/L: 응고 중 유리로 혈청 칼륨이 거짓으로 높을 수 있습니다. 헤파린 혈장이나 혈액가스로 확인하세요.`,
      dilution: (p, h) =>
        `${h.list(p.keys)}가(이) 함께 떨어졌습니다(${h.pct(p.max)} ~ ${h.pct(p.min)}). 여러 개의 독립적인 실제 변화보다는 하나의 공통 원인(수액, 수액 라인 근처 채혈, 선 자세→누운 자세)일 가능성이 큽니다.`,
      concentration: (p, h) =>
        `${h.list(p.keys)}가(이) 함께 올랐습니다(${h.pct(p.min)} ~ ${h.pct(p.max)}). 여러 개의 독립적인 실제 변화보다는 혈액농축(선 자세, 긴 토니켓, 탈수)을 생각하세요.`,
      glucoseNa: (p, h) =>
        `혈당이 높습니다. 보정 나트륨 ≈ ${h.num(p.katz, 0)} (Katz, ×1.6) ~ ${h.num(p.hillier, 0)} (Hillier, ×2.4) mmol/L (측정값 ${h.num(p.na, 0)}).`,
      glucoseNaShift: () =>
        "나트륨과 혈당이 반대 방향으로 움직였습니다. 나트륨 변화의 일부는 포도당을 따라 이동한 수분(전위)일 수 있으니 보정 나트륨으로 판단하세요.",
      pseudoNa: () =>
        "중성지방이나 단백이 매우 높습니다: 간접 ISE 나트륨이 거짓으로 낮을 수 있습니다. 혈액가스(직접 ISE) 나트륨과 비교하세요.",
      caAlbFall: () =>
        "총칼슘이 알부민과 함께 떨어졌습니다. 이온화 칼슘은 변하지 않았을 수 있으니 치료 전에 이온화 칼슘을 측정하세요.",
      caAlbLow: () =>
        "알부민이 낮습니다: 총칼슘은 이온화 칼슘을 과소평가하고 '보정' 공식은 부정확합니다. 중요하다면 이온화 칼슘을 측정하세요.",
      ag: (p, h) =>
        `음이온차 = ${h.num(p.ag, 0)} mmol/L${p.agc != null ? `, 알부민 보정 시 ≈ ${h.num(p.agc, 0)} (알부민 ${h.num(p.alb, 1)} g/dL)` : ""}.`,
      agLow: (p, h) =>
        `음이온차 = ${h.num(p.ag, 0)} mmol/L로 매우 낮거나 음수입니다. 검사 오류, 브로민화물·요오드화물, IgG 이상단백, 리튬 중독, 심한 저알부민혈증을 의심하세요.`,
      co2Isolated: (p, h) =>
        `중탄산염이 떨어졌지만 염소도 음이온차도 그만큼 오르지 않았습니다(음이온차 ${h.num(p.agPrev, 0)} → ${h.num(p.ag, 0)}). 전기적 중성을 지키려면 둘 중 하나는 올라야 합니다. 튜브에서 CO₂가 빠져나갔을 가능성(덜 채움, 공기 노출, 지연)을 의심하세요.`,
      bunAlone: () =>
        "크레아티닌은 그대로인데 BUN만 올랐습니다. 사구체여과율 감소로 단정하기 전에 위장관 출혈, 스테로이드, 단백 부하·TPN, 이화 상태를 생각하세요.",
      kdigoNoise: (p, h) =>
        `크레아티닌이 ${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"} 올랐습니다. 48시간 이내라면 KDIGO 절대 AKI 기준에는 해당하지만, 이 수준에서는 아직 측정·생물학적 잡음 범위입니다. AKI로 진단하기 전에 재검하세요.`,
      rcvNotKdigo: (p, h) =>
        `크레아티닌 상승(${h.num(p.delta, p.si ? 0 : 2)} ${p.si ? "µmol/L" : "mg/dL"})이 RCV를 넘었습니다. KDIGO 기준 0.3 mg/dL(26.5 µmol/L)에는 못 미쳐도 실제 변화일 가능성이 큽니다.`,
      ferritinCrp: () =>
        "페리틴은 급성기 반응물질입니다. 염증이 있으면 정상·고페리틴이 철결핍을 배제하지 못하므로 트랜스페린 포화도(가능하면 sTfR)를 보세요.",
      a1cHgb: () =>
        "헤모글로빈이 낮거나 변하고 있습니다. 출혈, 용혈, 수혈, 철분·조혈제 치료는 HbA1c를 부정확하게 만드니 프럭토사민이나 연속혈당측정을 고려하세요.",
      tropCk: () =>
        "CK 상승을 동반한 트로포닌: 골격근 손상은 cTnT를 올릴 수 있습니다(cTnI는 훨씬 덜). 이를 감안해 트로포닌 변화량을 해석하세요.",
      astCk: () => "트랜스아미나제와 함께 CK가 오르고 있습니다. 간이 아니라 근육 기원일 가능성이 큽니다(AST > ALT).",
      hgbHct: (p, h) =>
        `헤모글로빈(${h.pct(p.hgb)})과 헤마토크릿(${h.pct(p.hct)})이 함께 움직이지 않습니다. 지질혈증, 극심한 백혈구증가, 한랭응집소, 시험관 내 용혈 같은 간섭을 의심하세요.`,
      pltIsolated: (p, h) =>
        `다른 혈구는 안정적인데 혈소판만 떨어졌습니다(${h.pct(p.pct)}). 도말에서 응집(EDTA 가성혈소판감소증)을 확인하세요. 헤파린 5–10일째라면 4Ts 점수를 계산하세요.`,
      glycolysis: () =>
        "백혈구가 많은 검체에서 혈당이 떨어졌습니다. 백혈구가 튜브 안에서 포도당을 소모하므로 불화물 튜브를 쓰거나 신속히 처리하세요.",
      biotin: () =>
        "TSH는 떨어지고 FT4는 올랐습니다. 임상적으로 갑상선기능항진증이 아니라면 비오틴 복용을 묻고 검사 간섭을 고려하세요.",
      citrateHct: (p, h) =>
        `헤마토크릿 ${h.num(p.hct, 0)}%: 55%를 넘으면 표준 구연산 튜브의 항응고제가 혈장에 비해 과다해 응고시간이 거짓으로 연장됩니다. 구연산 보정 튜브를 요청하세요.`,
      lipemia: () =>
        "중성지방이 매우 높습니다. 지질혈증은 나트륨(간접 ISE), 헤모글로빈, 빌리루빈, 리파아제 등을 방해하므로 초원심분리를 요청하거나 혈액가스 나트륨을 쓰세요.",
    },
    example: EXAMPLE_KO,
  };

  return { en, fr, ko };
});
