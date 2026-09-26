/* RCV Checker — analyte table.
 *
 * cvi : within-subject biological variation (%), healthy adults, steady state.
 *       "EFLM" = median of the EFLM Biological Variation Database meta-analysis
 *       (biologicalvariation.eu, /api/meta_calculations, retrieved 2026-09).
 *       "Ricos" = Ricos et al. desirable-specifications database (older; used only where EFLM has no estimate).
 * cva : default analytical CV (%) typical of a routine hospital analyser. Every lab differs:
 *       users can override it in the settings panel (ask your lab for their QC CV).
 * cvi = null means no usable biological-variation estimate: results are shown with caveats but no RCV verdict.
 * aliases are matched case- and accent-insensitively at the start of a pasted line; longest first.
 * notes are the "don't trust the number" caveats, in en / fr / ko.
 */
(function (root, factory) {
  const mod = factory();
  if (typeof module === "object" && module.exports) module.exports = mod;
  else root.RCV_ANALYTES = mod;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const A = [];
  const add = (o) => A.push(o);

  // ===================================================================== electrolytes / renal
  add({
    key: "NA", group: "chem", cvi: 0.55, cva: 0.8, src: "EFLM",
    names: { en: "Sodium", fr: "Sodium (natrémie)", ko: "나트륨" },
    aliases: ["na", "sodium", "serum sodium", "natremie", "natrémie", "나트륨", "소디움", "소듐"],
    notes: [
      {
        en: "Blood-gas analysers (direct ISE) and the main chemistry analyser (indirect ISE) can differ by 2–4 mmol/L. Never compute a change across the two.",
        fr: "Gaz du sang (ISE directe) et automate de biochimie (ISE indirecte) peuvent différer de 2 à 4 mmol/L. Ne jamais calculer une variation entre les deux.",
        ko: "혈액가스 분석기(직접 ISE)와 생화학 분석기(간접 ISE)는 2–4 mmol/L까지 차이날 수 있습니다. 두 장비 사이의 변화는 계산하지 마세요.",
      },
      {
        en: "Pseudohyponatraemia: indirect ISE reads falsely low with very high triglycerides or protein (myeloma, IVIG). A blood-gas sodium is unaffected.",
        fr: "Pseudo-hyponatrémie : l'ISE indirecte sous-estime la natrémie en cas d'hypertriglycéridémie ou d'hyperprotidémie majeure (myélome, IgIV). La natrémie des gaz du sang n'est pas affectée.",
        ko: "가성저나트륨혈증: 중성지방이나 단백질이 매우 높으면(골수종, IVIG) 간접 ISE가 낮게 측정됩니다. 혈액가스 나트륨은 영향을 받지 않습니다.",
      },
      {
        en: "Hyperglycaemia pulls water out of cells: sodium falls about 1.6–2.4 mmol/L for every 100 mg/dL (5.6 mmol/L) of glucose above normal. Correct for glucose before judging the change.",
        fr: "L'hyperglycémie attire l'eau hors des cellules : la natrémie baisse d'environ 1,6 à 2,4 mmol/L par 5,6 mmol/L (100 mg/dL) de glucose au-dessus de la normale. Corriger avant d'interpréter.",
        ko: "고혈당은 세포 내 수분을 끌어내어, 포도당이 정상보다 100 mg/dL(5.6 mmol/L) 높을 때마다 나트륨이 약 1.6–2.4 mmol/L 낮아집니다. 변화를 판단하기 전에 보정하세요.",
      },
      {
        en: "Sample drawn near an IV line: saline pushes Na and Cl up, dextrose water pulls them down. Suspect this when several analytes jump at once.",
        fr: "Prélèvement proche d'une perfusion : le sérum salé augmente Na et Cl, le glucosé les dilue. Y penser quand plusieurs paramètres bougent en même temps.",
        ko: "수액 라인 근처 채혈: 생리식염수는 Na·Cl을 올리고, 포도당 수액은 희석시킵니다. 여러 항목이 동시에 튀면 의심하세요.",
      },
    ],
  });

  add({
    key: "K", group: "chem", cvi: 3.9, cva: 1.5, src: "EFLM",
    names: { en: "Potassium", fr: "Potassium (kaliémie)", ko: "칼륨" },
    aliases: ["k", "potassium", "serum potassium", "kaliemie", "kaliémie", "칼륨", "포타슘"],
    notes: [
      {
        en: "Haemolysis (difficult draw, small needle, pneumatic tube) falsely raises K. Check the lab's haemolysis index before treating.",
        fr: "L'hémolyse (prélèvement difficile, petite aiguille, pneumatique) augmente faussement K. Vérifier l'indice d'hémolyse avant de traiter.",
        ko: "용혈(어려운 채혈, 가는 바늘, 기송관)은 칼륨을 거짓으로 높입니다. 치료 전에 검사실 용혈 지수를 확인하세요.",
      },
      {
        en: "Fist clenching or a long tourniquet can add 1–2 mmol/L.",
        fr: "Serrer le poing ou un garrot prolongé peut ajouter 1 à 2 mmol/L.",
        ko: "주먹 쥐기나 오래 묶은 토니켓만으로도 1–2 mmol/L 올라갈 수 있습니다.",
      },
      {
        en: "Pseudohyperkalaemia: platelets > 500 or WBC > 50 ×10⁹/L release K during clotting. Repeat on heparin plasma or a blood gas. In CLL even plasma K can be falsely high (fragile cells, pneumatic tube), so hand-carry the sample.",
        fr: "Pseudo-hyperkaliémie : plaquettes > 500 ou leucocytes > 50 G/L libèrent du K pendant la coagulation. Refaire sur plasma hépariné ou gaz du sang. Dans la LLC, même le plasma peut être faussement élevé (cellules fragiles, pneumatique) : acheminer à la main.",
        ko: "가성고칼륨혈증: 혈소판 > 500 또는 백혈구 > 50 ×10⁹/L이면 응고 과정에서 칼륨이 유리됩니다. 헤파린 혈장이나 혈액가스로 재검하세요. CLL에서는 혈장 칼륨도 거짓 상승할 수 있으니(세포 취약, 기송관) 직접 운반하세요.",
      },
      {
        en: "EDTA (lavender-top) contamination or wrong order of draw gives very high K with low Ca, Mg and ALP.",
        fr: "Contamination par l'EDTA (tube violet) ou mauvais ordre des tubes : K très élevé avec Ca, Mg et PAL bas.",
        ko: "EDTA(보라색 튜브) 오염이나 채혈 순서 오류: 칼륨은 매우 높고 칼슘·마그네슘·ALP는 낮게 나옵니다.",
      },
      {
        en: "Delayed or refrigerated whole blood leaks K out of cells and raises it. Warm storage can lower it slightly.",
        fr: "Sang total conservé trop longtemps ou au réfrigérateur : fuite de K hors des cellules, donc hausse. La conservation au chaud peut l'abaisser légèrement.",
        ko: "전혈을 오래 두거나 냉장하면 세포에서 칼륨이 새어 나와 상승합니다. 따뜻하게 보관하면 약간 낮아질 수 있습니다.",
      },
    ],
  });

  add({
    key: "CL", group: "chem", cvi: 0.97, cva: 1.0, src: "EFLM",
    names: { en: "Chloride", fr: "Chlore (chlorémie)", ko: "염소" },
    aliases: ["cl", "chloride", "chlore", "chlorure", "chloremie", "chlorémie", "염소", "클로라이드", "염화물"],
    notes: [
      {
        en: "Bromide and iodide (and some salicylate levels) read as chloride on many ISEs, giving falsely high Cl and a low or negative anion gap.",
        fr: "Bromures et iodures (et parfois salicylés) sont lus comme du chlore par de nombreuses ISE : Cl faussement élevé, trou anionique bas ou négatif.",
        ko: "브로민화물·요오드화물(일부 살리실산)은 많은 ISE에서 염소로 측정되어, 염소가 거짓으로 높고 음이온차가 낮거나 음수가 됩니다.",
      },
      {
        en: "Tracks the IV fluid given. A Cl rise after large volumes of saline is real (hyperchloraemic acidosis), not noise.",
        fr: "Suit les solutés perfusés : une hausse du Cl après beaucoup de sérum salé est réelle (acidose hyperchlorémique), pas du bruit.",
        ko: "투여한 수액을 따라갑니다. 대량 생리식염수 후 염소 상승은 잡음이 아니라 실제(고염소성 산증)입니다.",
      },
    ],
  });

  add({
    key: "CO2", group: "chem", cvi: 4.0, cva: 3.0, src: "EFLM",
    names: { en: "Bicarbonate (total CO₂)", fr: "Bicarbonates (CO₂ total)", ko: "중탄산염 (총 CO₂)" },
    aliases: ["co2", "tco2", "total co2", "co2 total", "hco3", "hco3-", "bicarb", "bicarbonate", "bicarbonates", "reserve alcaline", "réserve alcaline", "총이산화탄소", "총 co2", "중탄산염", "중탄산"],
    notes: [
      {
        en: "Underfilled tubes, air exposure and delayed processing let CO₂ escape, so bicarbonate reads falsely low (by 3–6 mmol/L).",
        fr: "Tubes insuffisamment remplis, exposition à l'air et délai d'analyse laissent s'échapper le CO₂ : bicarbonates faussement bas (3 à 6 mmol/L).",
        ko: "튜브를 덜 채우거나 공기 노출, 분석 지연이 있으면 CO₂가 빠져나가 중탄산염이 거짓으로 낮아집니다(3–6 mmol/L).",
      },
      {
        en: "Blood-gas HCO₃⁻ is calculated from pH and pCO₂, while chemistry total CO₂ is measured. They differ by 1–2 mmol/L, so don't mix them.",
        fr: "Le HCO₃⁻ des gaz du sang est calculé (pH, pCO₂), le CO₂ total de biochimie est mesuré : écart de 1 à 2 mmol/L, ne pas les mélanger.",
        ko: "혈액가스 HCO₃⁻는 pH·pCO₂로 계산한 값이고, 생화학 총 CO₂는 측정값입니다. 1–2 mmol/L 차이가 나므로 섞지 마세요.",
      },
      {
        en: "A real metabolic acidosis must show up somewhere else: either the anion gap rises or chloride rises (electroneutrality). If neither moves, suspect the sample.",
        fr: "Une vraie acidose métabolique doit se voir ailleurs : hausse du trou anionique ou du chlore (électroneutralité). Si rien ne bouge, suspecter l'échantillon.",
        ko: "실제 대사성 산증이라면 음이온차나 염소 중 하나는 올라가야 합니다(전기적 중성). 둘 다 그대로면 검체를 의심하세요.",
      },
    ],
  });

  add({
    key: "BUN", group: "chem", cvi: 13.14, cva: 3.0, src: "EFLM",
    names: { en: "Urea / BUN", fr: "Urée", ko: "요소질소 (BUN)" },
    aliases: ["bun", "urea", "uree", "urée", "urea nitrogen", "blood urea nitrogen", "uremie", "urémie", "요소질소", "혈중요소질소", "요소"],
    notes: [
      {
        en: "Rises without any change in GFR with upper-GI bleeding, corticosteroids, high protein intake or TPN, catabolism and tetracyclines.",
        fr: "Augmente sans baisse du DFG en cas d'hémorragie digestive haute, de corticoïdes, d'apport protéique élevé ou de nutrition parentérale, de catabolisme ou de tétracyclines.",
        ko: "상부위장관 출혈, 스테로이드, 고단백 섭취·TPN, 이화 상태, 테트라사이클린에서는 사구체여과율 변화 없이 상승합니다.",
      },
      {
        en: "Falls with low protein intake, liver failure, overhydration and pregnancy.",
        fr: "Diminue en cas d'apport protéique faible, d'insuffisance hépatique, d'hyperhydratation et pendant la grossesse.",
        ko: "단백질 섭취 부족, 간부전, 수분 과다, 임신에서는 낮아집니다.",
      },
      {
        en: "It is the most flow-dependent kidney marker and reacts to volume status sooner and more strongly than creatinine.",
        fr: "C'est le marqueur rénal le plus dépendant du débit : réagit à la volémie plus vite et plus fort que la créatinine.",
        ko: "혈류에 가장 민감한 신장 지표로, 체액량 변화에 크레아티닌보다 빠르고 크게 반응합니다.",
      },
    ],
  });

  add({
    key: "CR", group: "chem", cvi: 4.39, cva: 3.0, src: "EFLM",
    names: { en: "Creatinine", fr: "Créatinine", ko: "크레아티닌" },
    aliases: ["cr", "creat", "creatinine", "créatinine", "creatininemie", "créatininémie", "scr", "크레아티닌"],
    notes: [
      {
        en: "Creatinine lags GFR. After an acute fall in GFR it takes 24–72 h to rise, and fluid resuscitation dilutes it further. A stable value early in AKI does not mean stable kidneys.",
        fr: "La créatinine est en retard sur le DFG : après une chute aiguë, il lui faut 24 à 72 h pour monter, et le remplissage la dilue. Une valeur stable au début d'une IRA ne rassure pas.",
        ko: "크레아티닌은 사구체여과율보다 늦게 반응합니다. 급격한 감소 후 오르기까지 24–72시간이 걸리고, 수액 소생은 더 희석시킵니다. AKI 초기의 안정된 값은 안심할 근거가 아닙니다.",
      },
      {
        en: "Drugs that block tubular secretion raise creatinine by about 0.1–0.4 mg/dL (10–35 µmol/L) without changing GFR: trimethoprim, cimetidine, cobicistat, dolutegravir, bictegravir, ritonavir, pyrimethamine.",
        fr: "Les médicaments bloquant la sécrétion tubulaire augmentent la créatinine d'environ 10 à 35 µmol/L sans modifier le DFG : triméthoprime, cimétidine, cobicistat, dolutégravir, bictégravir, ritonavir, pyriméthamine.",
        ko: "세뇨관 분비를 억제하는 약물은 사구체여과율 변화 없이 크레아티닌을 약 0.1–0.4 mg/dL 올립니다: 트리메토프림, 시메티딘, 코비시스타트, 돌루테그라비르, 빅테그라비르, 리토나비르, 피리메타민.",
      },
      {
        en: "Jaffe (picrate) method: falsely high with ketoacids (DKA) and some cephalosporins (cefoxitin), falsely low with high bilirubin. Enzymatic methods: falsely low with dopamine or dobutamine and high-dose N-acetylcysteine.",
        fr: "Méthode de Jaffé : faussement élevée avec les corps cétoniques (acidocétose) et certaines céphalosporines (céfoxitine), faussement basse si bilirubine élevée. Méthode enzymatique : faussement basse sous dopamine/dobutamine et N-acétylcystéine à forte dose.",
        ko: "Jaffe법: 케톤산(DKA)과 일부 세팔로스포린(세폭시틴)에서 거짓 상승, 고빌리루빈에서 거짓 저하. 효소법: 도파민·도부타민, 고용량 N-아세틸시스테인에서 거짓 저하.",
      },
      {
        en: "It also moves with muscle mass, a cooked-meat meal and creatine supplements. KDIGO's absolute rule (≥ 0.3 mg/dL, 26.5 µmol/L, within 48 h) can be pure noise when baseline creatinine is high (above ~1.9 mg/dL, 170 µmol/L).",
        fr: "Varie aussi avec la masse musculaire, un repas de viande cuite et la créatine en complément. Le critère absolu KDIGO (≥ 26,5 µmol/L en 48 h) peut n'être que du bruit quand la créatinine de base est élevée (> ~170 µmol/L).",
        ko: "근육량, 조리된 육류 섭취, 크레아틴 보충제로도 변합니다. 기저치가 높으면(약 1.9 mg/dL, 170 µmol/L 이상) KDIGO 절대 기준(48시간 내 ≥ 0.3 mg/dL)이 단순 잡음일 수 있습니다.",
      },
    ],
  });

  add({
    key: "EGFR", group: "chem", cvi: 5.3, cva: 3.6, src: "derived",
    names: { en: "eGFR", fr: "DFG estimé (DFGe)", ko: "추정사구체여과율 (eGFR)" },
    aliases: ["egfr", "gfr", "dfg", "dfge", "dfg estime", "ckd-epi", "mdrd", "추정사구체여과율", "사구체여과율"],
    notes: [
      {
        en: "Only valid in steady state. During AKI eGFR means nothing, so follow the creatinine trend and urine output.",
        fr: "Valable uniquement à l'état stable : pendant une IRA le DFGe n'a pas de sens, suivre la créatinine et la diurèse.",
        ko: "정상 상태에서만 유효합니다. AKI 중 eGFR은 의미가 없으니 크레아티닌 추세와 소변량을 보세요.",
      },
      {
        en: "Different equations (MDRD, CKD-EPI 2009 vs 2021, with or without race coefficient) give different numbers, so a lab switching equations looks like a change.",
        fr: "Les équations (MDRD, CKD-EPI 2009 vs 2021) donnent des valeurs différentes : un changement d'équation au laboratoire ressemble à une variation.",
        ko: "계산식(MDRD, CKD-EPI 2009 vs 2021)마다 값이 달라서, 검사실이 식을 바꾸면 변화처럼 보입니다.",
      },
      {
        en: "Values reported as '>60' or '>90' are capped, so changes above the cap are invisible. The CV used here is derived from creatinine (exponent ≈ −1.2).",
        fr: "Les résultats « >60 » ou « >90 » sont tronqués : les variations au-dessus sont invisibles. Le CV utilisé ici est dérivé de celui de la créatinine (exposant ≈ −1,2).",
        ko: "'>60', '>90'처럼 상한으로 보고된 값은 그 위의 변화를 볼 수 없습니다. 여기서 쓰는 CV는 크레아티닌에서 유도했습니다(지수 ≈ −1.2).",
      },
    ],
  });

  add({
    key: "CYSC", group: "chem", cvi: 3.3, cva: 3.0, src: "EFLM",
    names: { en: "Cystatin C", fr: "Cystatine C", ko: "시스타틴 C" },
    aliases: ["cystatin c", "cystatin", "cys c", "cystatine c", "cystatine", "시스타틴 c", "시스타틴"],
    notes: [
      {
        en: "Independent of muscle mass, but raised by glucocorticoids, hyperthyroidism, inflammation and obesity, and lowered by hypothyroidism.",
        fr: "Indépendante de la masse musculaire, mais augmentée par les corticoïdes, l'hyperthyroïdie, l'inflammation et l'obésité, et diminuée par l'hypothyroïdie.",
        ko: "근육량과는 무관하지만 스테로이드, 갑상선기능항진증, 염증, 비만에서 오르고 갑상선기능저하증에서 낮아집니다.",
      },
    ],
  });

  add({
    key: "GLU", group: "chem", cvi: 4.67, cva: 2.0, src: "EFLM",
    names: { en: "Glucose", fr: "Glucose (glycémie)", ko: "포도당 (혈당)" },
    aliases: ["glu", "glucose", "glc", "blood glucose", "glycemie", "glycémie", "glucose plasmatique", "혈당", "포도당", "글루코스"],
    notes: [
      {
        en: "Cells in the tube burn glucose at about 5–7 %/h at room temperature, faster with high WBC or RBC counts, unless it is a fluoride/citrate tube or promptly separated.",
        fr: "Les cellules du tube consomment le glucose (~5 à 7 %/h à température ambiante, plus si hyperleucocytose), sauf tube fluoré/citraté ou centrifugation rapide.",
        ko: "튜브 안 세포가 실온에서 시간당 약 5–7%씩 포도당을 소모합니다(백혈구·적혈구가 많으면 더 빠름). 불화물/구연산 튜브나 신속한 원심분리가 아니면 낮아집니다.",
      },
      {
        en: "Point-of-care meters are thrown off by haematocrit extremes, shock or poor perfusion (capillary samples) and high-dose vitamin C. GDH-PQQ strips read maltose and icodextrin (peritoneal dialysis) as glucose, giving a dangerously false high.",
        fr: "Glucomètres : faussés par un hématocrite extrême, le choc ou une mauvaise perfusion (capillaire) et la vitamine C à forte dose. Les bandelettes GDH-PQQ lisent maltose et icodextrine (dialyse péritonéale) comme du glucose, d'où une fausse hyperglycémie dangereuse.",
        ko: "현장검사 혈당계: 극단적 헤마토크릿, 쇼크·말초순환 저하(모세혈관 채혈), 고용량 비타민 C에 영향을 받습니다. GDH-PQQ 스트립은 말토스·아이코덱스트린(복막투석)을 포도당으로 읽어 위험하게 높게 나옵니다.",
      },
      {
        en: "Fasting, post-meal, on dextrose, TPN or steroids are different states. The RCV here assumes the same (fasting) state, and inpatient day-to-day variation is far larger.",
        fr: "À jeun, post-prandial, sous glucosé, nutrition parentérale ou corticoïdes : états différents. La différence critique suppose le même état (à jeun) ; chez l'hospitalisé la variation est bien plus grande.",
        ko: "공복, 식후, 포도당 수액·TPN·스테로이드 투여는 서로 다른 상태입니다. 여기의 RCV는 같은 상태(공복)를 가정하며, 입원 환자의 일간 변동은 훨씬 큽니다.",
      },
    ],
  });

  add({
    key: "CA", group: "chem", cvi: 1.81, cva: 1.5, src: "EFLM",
    names: { en: "Calcium (total)", fr: "Calcium total (calcémie)", ko: "칼슘 (총)" },
    aliases: ["ca", "calcium", "total calcium", "calcium total", "calcemie", "calcémie", "칼슘", "총칼슘"],
    notes: [
      {
        en: "Albumin-'corrected' calcium often misclassifies, especially in ICU and CKD patients. Measure ionised calcium if the decision matters.",
        fr: "La calcémie « corrigée » par l'albumine classe souvent mal (réanimation, IRC). Doser le calcium ionisé si la décision en dépend.",
        ko: "알부민 '보정' 칼슘은 특히 중환자·만성신장병에서 자주 오분류합니다. 결정이 중요하면 이온화 칼슘을 측정하세요.",
      },
      {
        en: "EDTA contamination gives falsely low Ca (usually with high K). Some gadolinium contrast agents falsely lower colorimetric Ca for about a day.",
        fr: "Contamination EDTA : Ca faussement bas (souvent avec K élevé). Certains produits de contraste gadolinés abaissent faussement le Ca colorimétrique pendant ~24 h.",
        ko: "EDTA 오염은 칼슘을 거짓으로 낮춥니다(보통 칼륨 상승 동반). 일부 가돌리늄 조영제는 약 하루 동안 비색법 칼슘을 거짓으로 낮춥니다.",
      },
      {
        en: "Upright posture and a long tourniquet raise total Ca (bound to protein) by a few percent.",
        fr: "La position debout et un garrot prolongé augmentent le Ca total (lié aux protéines) de quelques %.",
        ko: "선 자세와 오래 묶은 토니켓은 단백 결합 칼슘을 늘려 총칼슘을 몇 % 올립니다.",
      },
    ],
  });

  add({
    key: "ICA", group: "chem", cvi: 1.7, cva: 1.5, src: "Ricos",
    names: { en: "Ionised calcium", fr: "Calcium ionisé", ko: "이온화 칼슘" },
    aliases: ["ica", "ica++", "ca++", "ca2+", "ionized calcium", "ionised calcium", "ca ionized", "ca ion", "calcium ionise", "calcium ionisé", "이온화 칼슘", "이온화칼슘"],
    notes: [
      {
        en: "pH-dependent: acidosis raises it and alkalosis lowers it (hyperventilation during the draw, air bubbles, delay). Excess liquid heparin in the syringe binds it and lowers it.",
        fr: "Dépend du pH : l'acidose l'augmente, l'alcalose le diminue (hyperventilation au prélèvement, bulles d'air, délai). Un excès d'héparine liquide dans la seringue le fixe et l'abaisse.",
        ko: "pH에 의존합니다: 산증은 올리고 알칼리증(채혈 중 과호흡, 기포, 지연)은 낮춥니다. 주사기 속 액상 헤파린이 과하면 결합해서 낮아집니다.",
      },
    ],
  });

  add({
    key: "MG", group: "chem", cvi: 2.65, cva: 2.5, src: "EFLM",
    names: { en: "Magnesium", fr: "Magnésium", ko: "마그네슘" },
    aliases: ["mg", "magnesium", "magnésium", "magnesemie", "magnésémie", "마그네슘"],
    notes: [
      {
        en: "Haemolysis raises it (red cells hold about 3× more), and EDTA contamination lowers it.",
        fr: "L'hémolyse l'augmente (les hématies en contiennent ~3×) ; la contamination EDTA l'abaisse.",
        ko: "용혈은 올리고(적혈구 내 농도가 약 3배), EDTA 오염은 낮춥니다.",
      },
      {
        en: "Serum holds under 1 % of body magnesium, so a normal value doesn't exclude depletion. After IV replacement it rises, then falls as tissues re-equilibrate.",
        fr: "Le sérum contient < 1 % du magnésium de l'organisme : une valeur normale n'exclut pas une déplétion. Après supplémentation IV, il monte puis redescend en se rééquilibrant.",
        ko: "혈청에는 체내 마그네슘의 1% 미만만 있어 정상값이 결핍을 배제하지 못합니다. 정맥 보충 후에는 올랐다가 조직과 재분포되며 다시 떨어집니다.",
      },
    ],
  });

  add({
    key: "PHOS", group: "chem", cvi: 7.65, cva: 2.5, src: "EFLM",
    names: { en: "Phosphate", fr: "Phosphore (phosphatémie)", ko: "인 (P)" },
    aliases: ["phos", "phosphate", "phosphorus", "po4", "p", "phosphore", "phosphatemie", "phosphatémie", "인", "무기인"],
    notes: [
      {
        en: "Haemolysis and delayed separation raise it.",
        fr: "L'hémolyse et le retard de centrifugation l'augmentent.",
        ko: "용혈과 원심분리 지연은 인을 올립니다.",
      },
      {
        en: "Strong meal-related and diurnal variation. Insulin, glucose, refeeding and respiratory alkalosis shift phosphate into cells.",
        fr: "Fortes variations post-prandiales et nycthémérales ; insuline, glucose, renutrition et alcalose respiratoire le font entrer dans les cellules.",
        ko: "식사와 일중 변동이 큽니다. 인슐린, 포도당, 재급식, 호흡성 알칼리증은 인을 세포 안으로 이동시킵니다.",
      },
      {
        en: "Pseudohyperphosphataemia: paraproteins (myeloma), liposomal amphotericin B, alteplase and heavy lipaemia or bilirubin interfere with some methods.",
        fr: "Pseudo-hyperphosphatémie : paraprotéines (myélome), amphotéricine B liposomale, altéplase, lipémie ou bilirubine très élevées selon la méthode.",
        ko: "가성고인산혈증: 이상단백(골수종), 리포솜 암포테리신 B, 알테플라제, 심한 지질혈증·고빌리루빈이 일부 측정법을 방해합니다.",
      },
    ],
  });

  add({
    key: "URATE", group: "chem", cvi: 8.25, cva: 2.0, src: "EFLM",
    names: { en: "Uric acid", fr: "Acide urique (uricémie)", ko: "요산" },
    aliases: ["uric acid", "urate", "acide urique", "uricemie", "uricémie", "요산"],
    notes: [
      {
        en: "Rasburicase keeps destroying uric acid inside the tube, so levels read falsely low unless the sample is kept on ice and analysed promptly.",
        fr: "La rasburicase continue de dégrader l'acide urique dans le tube : faussement bas sauf prélèvement sur glace et analyse rapide.",
        ko: "라스부리카제는 튜브 안에서도 요산을 계속 분해하므로, 얼음에 보관하고 즉시 분석하지 않으면 거짓으로 낮습니다.",
      },
      {
        en: "Diet, alcohol, diuretics, fasting or ketosis and exercise raise it. It can be normal or fall during an acute gout flare.",
        fr: "Alimentation, alcool, diurétiques, jeûne/cétose, effort l'augmentent ; peut être normal ou baisser pendant une crise de goutte.",
        ko: "식이, 음주, 이뇨제, 금식·케톤증, 운동은 요산을 올리며, 급성 통풍 발작 중에는 정상이거나 오히려 낮을 수 있습니다.",
      },
    ],
  });

  add({
    key: "LACT", group: "chem", cvi: 27.2, cva: 3.0, src: "Ricos",
    names: { en: "Lactate", fr: "Lactate (lactatémie)", ko: "젖산" },
    aliases: ["lactate", "lactic acid", "lac", "lactatemie", "lactatémie", "acide lactique", "젖산", "락테이트", "유산"],
    notes: [
      {
        en: "Rises within 15–30 min in an unprocessed sample at room temperature (glycolysis). Tourniquet, fist clenching, struggling and seizures raise it too.",
        fr: "Augmente en 15 à 30 min dans un tube non traité à température ambiante (glycolyse) ; garrot, poing serré, agitation, convulsions l'augmentent aussi.",
        ko: "실온에서 처리하지 않은 검체는 15–30분 안에 상승합니다(해당작용). 토니켓, 주먹 쥐기, 몸부림, 경련도 올립니다.",
      },
      {
        en: "Not always hypoperfusion: epinephrine and β-agonists (salbutamol), metformin, linezolid, propofol and liver failure all raise lactate.",
        fr: "Pas toujours une hypoperfusion : adrénaline et β-agonistes (salbutamol), metformine, linézolide, propofol, insuffisance hépatique.",
        ko: "항상 저관류는 아닙니다: 에피네프린·β작용제(살부타몰), 메트포르민, 리네졸리드, 프로포폴, 간부전도 젖산을 올립니다.",
      },
      {
        en: "Ethylene glycol: glycolate reads as lactate on some blood-gas analysers, producing a 'lactate gap' against the central-lab method.",
        fr: "Éthylène glycol : le glycolate est lu comme du lactate par certains analyseurs de gaz du sang (« trou lactique » avec la méthode du laboratoire central).",
        ko: "에틸렌글리콜: 일부 혈액가스 분석기에서 글리콜산이 젖산으로 측정되어 중앙검사실 값과 '젖산 갭'이 생깁니다.",
      },
    ],
  });

  add({
    key: "NH3", group: "chem", cvi: null, cva: null, src: null,
    names: { en: "Ammonia", fr: "Ammoniémie", ko: "암모니아" },
    aliases: ["ammonia", "nh3", "nh4", "ammoniemie", "ammoniémie", "ammoniaque", "암모니아"],
    notes: [
      {
        en: "Must go on ice and be analysed within about 30 min. Tourniquet, fist clenching, haemolysis, delay and smoking before the draw all raise it.",
        fr: "Sur glace et analysée dans les ~30 min ; garrot, poing serré, hémolyse, délai et tabac avant le prélèvement l'augmentent.",
        ko: "얼음에 담아 약 30분 안에 분석해야 합니다. 토니켓, 주먹 쥐기, 용혈, 지연, 채혈 전 흡연은 모두 상승시킵니다.",
      },
      {
        en: "Correlates poorly with the severity of hepatic encephalopathy. Serial levels don't guide lactulose titration.",
        fr: "Corrélation faible avec la sévérité de l'encéphalopathie hépatique : des dosages répétés ne guident pas le lactulose.",
        ko: "간성뇌증 중증도와 상관관계가 약하므로, 반복 측정으로 락툴로오스 용량을 조절하지 마세요.",
      },
    ],
  });

  // ===================================================================== proteins / liver / pancreas / muscle
  add({
    key: "ALB", group: "liver", cvi: 2.5, cva: 2.0, src: "EFLM",
    names: { en: "Albumin", fr: "Albumine", ko: "알부민" },
    aliases: ["alb", "albumin", "albumine", "albuminemie", "albuminémie", "알부민"],
    notes: [
      {
        en: "Posture: standing concentrates albumin, total protein, Ca, Hgb and cholesterol by roughly 5–10 %. Comparing a supine inpatient with an upright outpatient can mislead.",
        fr: "Posture : la station debout concentre albumine, protides, Ca, Hb et cholestérol d'environ 5 à 10 %. Comparer un patient couché (hospitalisé) à un patient debout (consultation) peut tromper.",
        ko: "자세: 서 있으면 알부민, 총단백, 칼슘, 헤모글로빈, 콜레스테롤이 약 5–10% 농축됩니다. 누운 입원 환자와 선 외래 환자 값을 비교하면 오해할 수 있습니다.",
      },
      {
        en: "Method: bromocresol green (BCG) overestimates low albumin, while bromocresol purple (BCP) underestimates it in CKD and dialysis. Don't compare results across labs.",
        fr: "Méthode : le vert de bromocrésol (BCG) surestime les albumines basses ; le pourpre de bromocrésol (BCP) sous-estime en IRC/dialyse. Ne pas comparer entre laboratoires.",
        ko: "측정법: BCG는 낮은 알부민을 과대평가하고, BCP는 만성신장병·투석에서 과소평가합니다. 검사실 간 비교는 피하세요.",
      },
      {
        en: "Half-life is about 3 weeks. A drop over a few days is dilution, capillary leak or inflammation, not nutrition.",
        fr: "Demi-vie ~3 semaines : une chute en quelques jours reflète dilution, fuite capillaire ou inflammation, pas la nutrition.",
        ko: "반감기가 약 3주이므로, 며칠 사이의 감소는 영양이 아니라 희석·모세혈관 누출·염증 때문입니다.",
      },
    ],
  });

  add({
    key: "TP", group: "liver", cvi: 2.6, cva: 1.5, src: "EFLM",
    names: { en: "Total protein", fr: "Protéines totales (protidémie)", ko: "총단백" },
    aliases: [
      { t: "tp", langs: ["en", "ko"] }, "total protein", "protein total", "protein, total", "prot",
      "proteines totales", "protéines totales", "protides", "protidemie", "protidémie", "총단백", "총단백질",
    ],
    notes: [
      {
        en: "Moves with posture and IV fluids just like albumin. A paraprotein can raise it on its own.",
        fr: "Varie avec la posture et les perfusions comme l'albumine ; une paraprotéine peut l'augmenter seule.",
        ko: "알부민처럼 자세와 수액에 따라 변하며, 이상단백만으로도 올라갈 수 있습니다.",
      },
    ],
  });

  add({
    key: "ALT", group: "liver", cvi: 12.64, cva: 3.5, src: "EFLM",
    names: { en: "ALT", fr: "ALAT (TGP)", ko: "ALT" },
    aliases: ["alt", "sgpt", "gpt", "alat", "tgp", "alanine aminotransferase", "alanine transaminase"],
    notes: [
      {
        en: "Muscle injury and strenuous exercise raise ALT too (less than AST). Check CK.",
        fr: "Lésion musculaire et effort intense l'augmentent aussi (moins que l'ASAT) : regarder les CK.",
        ko: "근육 손상과 격한 운동도 ALT를 올립니다(AST보다는 덜). CK를 확인하세요.",
      },
      {
        en: "Vitamin B6 (pyridoxal phosphate) deficiency, common in alcohol use disorder and dialysis, makes ALT and AST read falsely low if the assay has no added P5P.",
        fr: "Carence en vitamine B6 (alcool, dialyse) : ALAT/ASAT faussement basses si le réactif ne contient pas de P5P.",
        ko: "비타민 B6(PLP) 결핍(알코올 사용장애, 투석)이 있으면 P5P가 없는 시약에서 ALT·AST가 거짓으로 낮습니다.",
      },
      {
        en: "Half-life is about 47 h, against about 17 h for AST. As an injury resolves AST falls first, so a slow ALT fall is expected and doesn't mean ongoing injury.",
        fr: "Demi-vie ~47 h contre ~17 h pour l'ASAT : l'ASAT baisse d'abord ; une décroissance lente des ALAT est attendue, pas une agression persistante.",
        ko: "반감기는 ALT 약 47시간, AST 약 17시간입니다. 손상이 끝나면 AST가 먼저 떨어지므로 ALT가 천천히 내려가는 것은 예상된 일이며 손상 지속을 뜻하지 않습니다.",
      },
    ],
  });

  add({
    key: "AST", group: "liver", cvi: 8.58, cva: 3.5, src: "EFLM",
    names: { en: "AST", fr: "ASAT (TGO)", ko: "AST" },
    aliases: ["ast", "sgot", "got", "asat", "tgo", "aspartate aminotransferase", "aspartate transaminase"],
    notes: [
      {
        en: "Red cells hold far more AST than plasma, so haemolysis raises AST (along with LDH and K).",
        fr: "Les hématies contiennent beaucoup plus d'ASAT que le plasma : l'hémolyse l'augmente (avec LDH et K).",
        ko: "적혈구 내 AST가 혈장보다 훨씬 많아서 용혈 시 AST가 오릅니다(LDH, 칼륨과 함께).",
      },
      {
        en: "Muscle is a major source (rhabdomyolysis, exercise, IM injections, seizures). AST > ALT with a high CK points to muscle.",
        fr: "Source musculaire fréquente (rhabdomyolyse, effort, injections IM, convulsions) : ASAT > ALAT avec CK élevées oriente vers le muscle.",
        ko: "근육이 주요 공급원입니다(횡문근융해, 운동, 근주, 경련). CK가 높고 AST > ALT이면 근육 기원을 생각하세요.",
      },
      {
        en: "Macro-AST (AST bound to immunoglobulin) causes an isolated, persistent AST rise in a well patient. B6 deficiency lowers the measured value.",
        fr: "Macro-ASAT (liée à une immunoglobuline) : élévation isolée et persistante chez un patient en bonne santé. La carence en B6 l'abaisse.",
        ko: "마크로-AST(면역글로불린 결합)는 건강한 사람에서 단독·지속 상승을 일으킵니다. B6 결핍은 측정값을 낮춥니다.",
      },
    ],
  });

  add({
    key: "ALP", group: "liver", cvi: 5.25, cva: 3.0, src: "EFLM",
    names: { en: "Alkaline phosphatase", fr: "Phosphatases alcalines (PAL)", ko: "알칼리성 인산분해효소 (ALP)" },
    aliases: ["alp", "alk phos", "alkaline phosphatase", "alkp", "alk phosphatase", "pal", "phosphatases alcalines", "phosphatase alcaline", "알칼리성 인산분해효소", "알칼리성인산분해효소", "알칼리인산분해효소"],
    notes: [
      {
        en: "EDTA, citrate or oxalate contamination makes it falsely low (they chelate zinc and magnesium).",
        fr: "Contamination EDTA, citrate ou oxalate : PAL faussement basses (chélation du zinc et du magnésium).",
        ko: "EDTA·구연산·옥살산 오염은 아연·마그네슘을 킬레이트해 ALP를 거짓으로 낮춥니다.",
      },
      {
        en: "A fatty meal raises intestinal ALP, especially in blood groups O and B. For small changes, use a fasting sample.",
        fr: "Un repas gras augmente la PAL intestinale (surtout groupes O et B) : prélever à jeun pour de petites variations.",
        ko: "기름진 식사는 장 ALP를 올립니다(특히 O형·B형). 작은 변화라면 공복 검체를 쓰세요.",
      },
      {
        en: "Bone growth, a healing fracture and pregnancy (placental ALP can double it) are physiological sources. Half-life is about 7 days, so it falls slowly after an obstruction is relieved.",
        fr: "Croissance osseuse, fracture en consolidation, grossesse (PAL placentaire, jusqu'à ×2) ; demi-vie ~7 j : décroissance lente après levée d'obstacle.",
        ko: "뼈 성장, 골절 치유, 임신(태반 ALP로 2배까지)은 생리적 원인입니다. 반감기가 약 7일이라 폐쇄가 풀린 뒤에도 천천히 내려갑니다.",
      },
    ],
  });

  add({
    key: "GGT", group: "liver", cvi: 8.29, cva: 3.0, src: "EFLM",
    names: { en: "GGT", fr: "GGT (gamma-GT)", ko: "감마지티피 (GGT)" },
    aliases: ["ggt", "gamma gt", "gamma-gt", "ggtp", "γgt", "γ-gt", "gamma-glutamyl transferase", "gamma glutamyl transferase", "감마지티피", "감마 gt"],
    notes: [
      {
        en: "Induced by alcohol, phenytoin, carbamazepine, barbiturates and obesity. After stopping alcohol it falls over weeks, not days.",
        fr: "Induite par l'alcool, la phénytoïne, la carbamazépine, les barbituriques et l'obésité ; baisse sur plusieurs semaines après arrêt de l'alcool.",
        ko: "알코올, 페니토인, 카르바마제핀, 바르비투르산염, 비만에 의해 유도되며, 금주 후 며칠이 아니라 몇 주에 걸쳐 내려갑니다.",
      },
      {
        en: "It doesn't rise in bone disease, so use it with ALP to tell a liver source from a bone source.",
        fr: "N'augmente pas dans les maladies osseuses : sert à localiser l'origine d'une PAL élevée.",
        ko: "뼈 질환에서는 오르지 않으므로 ALP 상승이 간 기원인지 구분하는 데 씁니다.",
      },
    ],
  });

  add({
    key: "TBIL", group: "liver", cvi: 20.18, cva: 4.0, src: "EFLM",
    names: { en: "Bilirubin (total)", fr: "Bilirubine totale", ko: "총빌리루빈" },
    aliases: ["tbil", "t bili", "t. bili", "t.bili", "bili", "bilirubin", "total bilirubin", "bilirubin total", "bilirubin, total", "bilirubine", "bilirubine totale", "총빌리루빈", "빌리루빈"],
    notes: [
      {
        en: "Light degrades bilirubin, so it reads falsely low if the tube sits in light (critical for neonatal samples).",
        fr: "La lumière dégrade la bilirubine : faussement basse si le tube reste exposé (crucial en néonatologie).",
        ko: "빛에 분해되므로 튜브가 빛에 노출되면 거짓으로 낮습니다(신생아 검체에서 중요).",
      },
      {
        en: "Fasting raises it (Gilbert's up to 2–3×), and so does haemolysis (unconjugated).",
        fr: "Le jeûne l'augmente (Gilbert jusqu'à ×2–3), l'hémolyse aussi (non conjuguée).",
        ko: "금식은 빌리루빈을 올리며(길버트 증후군에서 2–3배), 용혈도 비결합형을 올립니다.",
      },
      {
        en: "Delta bilirubin (albumin-bound) has a half-life of about 3 weeks, so bilirubin stays high long after an obstruction is relieved.",
        fr: "La delta-bilirubine (liée à l'albumine) a une demi-vie ~3 semaines : la bilirubine reste élevée longtemps après levée d'obstacle.",
        ko: "델타 빌리루빈(알부민 결합)은 반감기가 약 3주라 폐쇄 해소 후에도 오래 높게 유지됩니다.",
      },
    ],
  });

  add({
    key: "DBIL", group: "liver", cvi: 19.55, cva: 5.0, src: "EFLM",
    names: { en: "Bilirubin (direct)", fr: "Bilirubine conjuguée", ko: "직접빌리루빈" },
    aliases: ["dbil", "d bili", "d. bili", "d.bili", "direct bilirubin", "bilirubin direct", "bilirubin, direct", "conjugated bilirubin", "bilirubine conjuguee", "bilirubine conjuguée", "bilirubine directe", "직접빌리루빈", "직접 빌리루빈"],
    notes: [
      {
        en: "'Direct' methods also pick up delta bilirubin (albumin-bound, half-life about 3 weeks), so it falls slowly after cholestasis resolves.",
        fr: "Les méthodes « directes » incluent la delta-bilirubine (demi-vie ~3 semaines) : décroissance lente après résolution de la cholestase.",
        ko: "'직접' 측정법에는 델타 빌리루빈(반감기 약 3주)이 포함되어 담즙정체 해소 후에도 천천히 내려갑니다.",
      },
    ],
  });

  add({
    key: "LDH", group: "liver", cvi: 4.36, cva: 3.0, src: "EFLM",
    names: { en: "LDH", fr: "LDH", ko: "젖산탈수소효소 (LDH)" },
    aliases: ["ldh", "ld", "lactate dehydrogenase", "lacticodeshydrogenase", "lactate deshydrogenase", "젖산탈수소효소"],
    notes: [
      {
        en: "Extremely sensitive to in-vitro haemolysis and delayed separation (red cells hold about 150× more). The first thing to suspect when LDH rises with K and AST.",
        fr: "Très sensible à l'hémolyse in vitro et au retard de centrifugation (hématies ~150× plus riches) : première hypothèse si LDH monte avec K et ASAT.",
        ko: "시험관 내 용혈과 원심분리 지연에 매우 민감합니다(적혈구 내 약 150배). 칼륨·AST와 함께 오르면 가장 먼저 의심하세요.",
      },
      {
        en: "Non-specific: any tissue damage raises it (haemolysis in vivo, tumour, lung, muscle, liver).",
        fr: "Non spécifique : toute lésion tissulaire (hémolyse in vivo, tumeur, poumon, muscle, foie).",
        ko: "비특이적입니다: 어떤 조직 손상이든 올립니다(체내 용혈, 종양, 폐, 근육, 간).",
      },
    ],
  });

  add({
    key: "CK", group: "liver", cvi: 14.12, cva: 3.0, src: "EFLM",
    names: { en: "Creatine kinase (CK)", fr: "CK (CPK)", ko: "크레아틴키나아제 (CK)" },
    aliases: ["ck", "cpk", "ck total", "total ck", "creatine kinase", "creatine phosphokinase", "creatine kinase total", "creatine kinase, total", "크레아틴키나아제", "크레아틴 키나아제", "크레아틴인산활성효소"],
    notes: [
      {
        en: "Exercise, IM injections, falls, seizures, surgery and statins raise it. It peaks 24–72 h after injury (half-life about 1.5 days).",
        fr: "Effort, injections IM, chute, convulsions, chirurgie, statines ; pic 24 à 72 h après l'agression (demi-vie ~1,5 j).",
        ko: "운동, 근주, 낙상, 경련, 수술, 스타틴이 CK를 올립니다. 손상 후 24–72시간에 정점(반감기 약 1.5일).",
      },
      {
        en: "Hypothyroidism raises CK. Macro-CK causes a persistent, harmless rise.",
        fr: "L'hypothyroïdie l'augmente ; les macro-CK donnent une élévation persistante sans gravité.",
        ko: "갑상선기능저하증은 CK를 올리고, 마크로-CK는 지속적이지만 무해한 상승을 일으킵니다.",
      },
    ],
  });

  add({
    key: "LIP", group: "liver", cvi: 7.64, cva: 4.0, src: "EFLM",
    names: { en: "Lipase", fr: "Lipase", ko: "리파아제" },
    aliases: ["lipase", "lip", "lipasemie", "lipasémie", "리파아제", "리파제"],
    notes: [
      {
        en: "How high it goes doesn't track pancreatitis severity, so trending it daily adds nothing.",
        fr: "Le niveau ne reflète pas la gravité de la pancréatite : le suivi quotidien n'apporte rien.",
        ko: "수치 크기는 췌장염 중증도와 비례하지 않으므로 매일 추적할 이유가 없습니다.",
      },
      {
        en: "Raised by kidney failure, bowel ischaemia or perforation and DKA. Severe lipaemia can falsely lower it in some assays.",
        fr: "Augmentée par l'insuffisance rénale, l'ischémie ou perforation digestive, l'acidocétose ; la lipémie sévère peut l'abaisser faussement selon la méthode.",
        ko: "신부전, 장 허혈·천공, DKA에서도 오르며, 심한 지질혈증은 일부 측정법에서 거짓으로 낮춥니다.",
      },
    ],
  });

  // ===================================================================== inflammation / iron
  add({
    key: "CRP", group: "inflam", cvi: 34.68, cva: 4.0, src: "EFLM",
    names: { en: "CRP", fr: "CRP", ko: "C-반응단백 (CRP)" },
    aliases: ["crp", "hs-crp", "hscrp", "hs crp", "c-reactive protein", "c reactive protein", "proteine c reactive", "protéine c réactive", "씨알피", "c-반응단백", "c반응단백"],
    notes: [
      {
        en: "Rises 6–8 h after the trigger and peaks around 48 h, with a half-life of about 19 h. An early value can be falsely reassuring, and even once the source is controlled it only falls about 50 % a day.",
        fr: "Monte 6 à 8 h après le stimulus, pic vers 48 h, demi-vie ~19 h : une valeur précoce peut faussement rassurer ; même contrôlée, elle ne baisse que d'environ 50 % par jour.",
        ko: "자극 후 6–8시간에 오르기 시작해 약 48시간에 정점이며 반감기는 약 19시간입니다. 초기 값은 거짓 안심을 줄 수 있고, 원인이 조절되어도 하루 약 50%씩만 내려갑니다.",
      },
      {
        en: "IL-6 blockade (tocilizumab, sarilumab) and, to a lesser degree, JAK inhibitors abolish the CRP response. A normal CRP doesn't exclude infection on these drugs.",
        fr: "Les anti-IL-6 (tocilizumab, sarilumab) et, dans une moindre mesure, les anti-JAK abolissent la réponse CRP : une CRP normale n'exclut pas une infection.",
        ko: "IL-6 차단제(토실리주맙, 사릴루맙)와 정도는 덜하지만 JAK 억제제는 CRP 반응을 없앱니다. 이 약물 중 정상 CRP는 감염을 배제하지 못합니다.",
      },
      {
        en: "Severe liver failure blunts CRP synthesis.",
        fr: "L'insuffisance hépatique sévère diminue sa synthèse.",
        ko: "중증 간부전은 CRP 합성을 둔화시킵니다.",
      },
    ],
  });

  add({
    key: "PCT", group: "inflam", cvi: null, cva: null, src: null,
    names: { en: "Procalcitonin", fr: "Procalcitonine", ko: "프로칼시토닌" },
    aliases: ["procalcitonin", "procalcitonine", "pct", "프로칼시토닌"],
    notes: [
      {
        en: "Rises without infection after major surgery, trauma, burns, cardiogenic shock, cytokine release (CAR-T), in medullary thyroid carcinoma, and at a higher baseline in CKD and dialysis.",
        fr: "Augmente sans infection : chirurgie lourde, traumatisme, brûlures, choc cardiogénique, relargage cytokinique (CAR-T), cancer médullaire de la thyroïde ; niveau de base plus élevé en IRC/dialyse.",
        ko: "감염 없이도 대수술, 외상, 화상, 심인성 쇼크, 사이토카인 방출(CAR-T), 갑상선 수질암에서 오르며, 만성신장병·투석에서는 기저치가 높습니다.",
      },
      {
        en: "Antibiotic-stop protocols use a relative fall (≥ 80 % from peak) or an absolute cut-off (< 0.5 µg/L). Assays differ between platforms.",
        fr: "Les protocoles d'arrêt des antibiotiques utilisent une baisse relative (≥ 80 % du pic) ou un seuil (< 0,5 µg/L) ; les dosages diffèrent selon la plateforme.",
        ko: "항생제 중단 프로토콜은 정점 대비 ≥ 80% 감소나 절대값(< 0.5 µg/L)을 씁니다. 장비마다 측정값이 다릅니다.",
      },
    ],
  });

  add({
    key: "FER", group: "inflam", cvi: 12.87, cva: 5.0, src: "EFLM",
    names: { en: "Ferritin", fr: "Ferritine", ko: "페리틴" },
    aliases: ["ferritin", "ferritine", "ferr", "페리틴"],
    notes: [
      {
        en: "Acute-phase reactant: inflammation, liver injury and malignancy raise it, so a normal or high ferritin doesn't rule out iron deficiency when CRP is up.",
        fr: "Protéine de l'inflammation : inflammation, atteinte hépatique et cancer l'augmentent ; une ferritine normale n'exclut pas une carence martiale si la CRP est élevée.",
        ko: "급성기 반응물질입니다. 염증, 간손상, 악성종양이 올리므로 CRP가 높을 때 정상·고페리틴이 철결핍을 배제하지 못합니다.",
      },
      {
        en: "IV iron raises ferritin for weeks, so wait at least 4 weeks before reassessing iron stores.",
        fr: "Le fer IV augmente la ferritine pendant des semaines : attendre ≥ 4 semaines avant de réévaluer les réserves.",
        ko: "정맥 철분 투여 후 몇 주간 페리틴이 오르므로 저장철 재평가는 최소 4주 뒤에 하세요.",
      },
      {
        en: "Very high values (> 10 000 µg/L) point to HLH, Still's disease or liver necrosis rather than iron.",
        fr: "Valeurs très élevées (> 10 000 µg/L) : penser SAM/HLH, maladie de Still, nécrose hépatique plutôt qu'au fer.",
        ko: "매우 높은 값(> 10,000 µg/L)은 철보다는 HLH, 스틸병, 간괴사를 시사합니다.",
      },
    ],
  });

  add({
    key: "IRON", group: "inflam", cvi: 25.24, cva: 3.0, src: "EFLM",
    names: { en: "Iron (serum)", fr: "Fer sérique", ko: "혈청철" },
    aliases: ["iron", "serum iron", "fe", "fer", "fer serique", "fer sérique", "sideremie", "sidérémie", "혈청철", "철"],
    notes: [
      {
        en: "Large day-to-day and diurnal swings (morning peak), a recent iron tablet or meal raises it, and inflammation lowers it. Trend ferritin and transferrin saturation instead.",
        fr: "Fortes variations d'un jour à l'autre et dans la journée (pic matinal), augmenté par une prise récente de fer ou un repas, abaissé par l'inflammation : suivre plutôt ferritine et coefficient de saturation.",
        ko: "일간·일중 변동이 크고(아침 최고), 최근 철분제나 식사로 오르며 염증에서 낮아집니다. 페리틴과 트랜스페린 포화도로 추적하세요.",
      },
    ],
  });

  // ===================================================================== lipids / diabetes
  add({
    key: "TG", group: "lipid", cvi: 19.76, cva: 2.5, src: "EFLM",
    names: { en: "Triglycerides", fr: "Triglycérides", ko: "중성지방" },
    aliases: ["tg", "trig", "trigs", "triglycerides", "triglyceride", "triglycérides", "중성지방", "트리글리세리드"],
    notes: [
      {
        en: "Non-fasting samples and recent alcohol raise TG a lot, and the RCV assumes the same fasting state. Propofol and parenteral lipid emulsions raise it too.",
        fr: "Non à jeun et alcool récent l'augmentent fortement (la différence critique suppose le même état de jeûne) ; propofol et émulsions lipidiques aussi.",
        ko: "비공복과 최근 음주는 중성지방을 크게 올립니다(RCV는 같은 공복 상태를 가정). 프로포폴과 정맥 지질유제도 올립니다.",
      },
      {
        en: "Very high TG (lipaemia) interferes with many assays (Na by indirect ISE, Hgb, bilirubin, lipase). Friedewald LDL is invalid above 400 mg/dL (4.5 mmol/L).",
        fr: "Des TG très élevés (lipémie) perturbent de nombreux dosages (Na par ISE indirecte, Hb, bilirubine, lipase) et invalident le LDL de Friedewald au-delà de 4,5 mmol/L.",
        ko: "매우 높은 중성지방(지질혈증)은 여러 검사(간접 ISE 나트륨, 헤모글로빈, 빌리루빈, 리파아제)를 방해하고, 400 mg/dL(4.5 mmol/L) 초과 시 Friedewald LDL을 무효로 만듭니다.",
      },
    ],
  });

  add({
    key: "CHOL", group: "lipid", cvi: 5.26, cva: 2.0, src: "EFLM",
    names: { en: "Total cholesterol", fr: "Cholestérol total", ko: "총콜레스테롤" },
    aliases: ["chol", "cholesterol", "total cholesterol", "cholesterol total", "cholesterol, total", "cholestérol", "cholestérol total", "cholesterol total", "총콜레스테롤", "콜레스테롤"],
    notes: [
      {
        en: "Acute illness (MI, sepsis, surgery) lowers cholesterol for weeks. Judge lipid therapy on a sample taken within 24 h of admission or after recovery. Posture shifts it by about 5–10 %.",
        fr: "Une maladie aiguë (IDM, sepsis, chirurgie) abaisse le cholestérol pendant des semaines : juger le traitement sur un bilan des 24 premières heures ou après récupération. La posture le fait varier de ~5 à 10 %.",
        ko: "급성 질환(심근경색, 패혈증, 수술)은 몇 주간 콜레스테롤을 낮춥니다. 입원 24시간 이내나 회복 후 검체로 치료를 판단하세요. 자세에 따라 약 5–10% 변합니다.",
      },
    ],
  });

  add({
    key: "LDL", group: "lipid", cvi: 7.43, cva: 3.0, src: "EFLM",
    names: { en: "LDL cholesterol", fr: "LDL-cholestérol", ko: "LDL 콜레스테롤" },
    aliases: ["ldl", "ldl-c", "ldl c", "ldl cholesterol", "ldl-cholesterol", "ldl chol", "ldl-cholestérol", "ldl 콜레스테롤", "엘디엘", "저밀도지단백"],
    notes: [
      {
        en: "Calculated (Friedewald) LDL is unreliable with TG > 400 mg/dL (4.5 mmol/L) or LDL < 70 mg/dL (1.8 mmol/L). Martin–Hopkins, Sampson or direct LDL do better, but don't compare calculated with direct values.",
        fr: "Le LDL calculé (Friedewald) est peu fiable si TG > 4,5 mmol/L ou LDL < 1,8 mmol/L ; préférer Martin–Hopkins, Sampson ou LDL direct, sans comparer calculé et direct.",
        ko: "계산 LDL(Friedewald)은 중성지방 > 400 mg/dL(4.5 mmol/L)이거나 LDL < 70 mg/dL(1.8 mmol/L)이면 부정확합니다. Martin–Hopkins, Sampson, 직접 LDL이 낫지만 계산값과 직접측정값을 비교하지 마세요.",
      },
      {
        en: "It includes Lp(a) cholesterol, and acute illness lowers it.",
        fr: "Inclut le cholestérol de la Lp(a) ; abaissé par une maladie aiguë.",
        ko: "Lp(a) 콜레스테롤을 포함하며 급성 질환 시 낮아집니다.",
      },
    ],
  });

  add({
    key: "HDL", group: "lipid", cvi: 5.74, cva: 3.0, src: "EFLM",
    names: { en: "HDL cholesterol", fr: "HDL-cholestérol", ko: "HDL 콜레스테롤" },
    aliases: ["hdl", "hdl-c", "hdl c", "hdl cholesterol", "hdl-cholesterol", "hdl chol", "hdl-cholestérol", "hdl 콜레스테롤", "고밀도지단백"],
    notes: [
      {
        en: "Acute illness lowers it, and alcohol and exercise raise it.",
        fr: "Abaissé par une maladie aiguë ; augmenté par l'alcool et l'exercice.",
        ko: "급성 질환에서 낮아지고 음주·운동으로 오릅니다.",
      },
    ],
  });

  add({
    key: "A1C", group: "lipid", cvi: 1.17, cva: 2.0, src: "EFLM",
    names: { en: "HbA1c", fr: "HbA1c (hémoglobine glyquée)", ko: "당화혈색소 (HbA1c)" },
    aliases: ["a1c", "hba1c", "hb a1c", "hemoglobin a1c", "haemoglobin a1c", "glycated hemoglobin", "glycosylated hemoglobin", "hemoglobine glyquee", "hémoglobine glyquée", "당화혈색소", "당화헤모글로빈"],
    notes: [
      {
        en: "Anything that changes red-cell lifespan shifts it. Haemolysis, bleeding, transfusion, pregnancy and ESA or iron treatment lower it falsely. Iron deficiency and asplenia raise it. CKD is unpredictable.",
        fr: "Tout ce qui modifie la durée de vie des hématies : hémolyse, saignement, transfusion, grossesse, ASE ou fer (faussement bas) ; carence martiale, asplénie (faussement haut) ; IRC imprévisible.",
        ko: "적혈구 수명을 바꾸는 모든 것: 용혈, 출혈, 수혈, 임신, 조혈제·철분 치료(거짓 저하), 철결핍, 무비증(거짓 상승). 만성신장병은 예측 불가.",
      },
      {
        en: "Haemoglobin variants (HbS, HbC, HbE, high HbF) interfere with some methods. Check which method your lab uses.",
        fr: "Les variants de l'hémoglobine (HbS, HbC, HbE, HbF élevée) interfèrent avec certaines méthodes : vérifier celle du laboratoire.",
        ko: "혈색소 변이체(HbS, HbC, HbE, 높은 HbF)는 일부 측정법을 방해합니다. 검사실 방법을 확인하세요.",
      },
      {
        en: "Reflects about 3 months, with roughly half the weight on the last month. Rechecking sooner than about 3 months underestimates the change.",
        fr: "Reflète ~3 mois, pondéré pour moitié par le dernier mois : un contrôle avant ~3 mois sous-estime la variation.",
        ko: "약 3개월을 반영하며 최근 1개월이 절반가량을 차지합니다. 3개월보다 일찍 재검하면 변화를 과소평가합니다.",
      },
    ],
  });

  // ===================================================================== thyroid / endocrine
  add({
    key: "TSH", group: "endo", cvi: 17.82, cva: 4.0, src: "EFLM",
    names: { en: "TSH", fr: "TSH", ko: "갑상선자극호르몬 (TSH)" },
    aliases: ["tsh", "thyrotropin", "thyroid stimulating hormone", "thyreostimuline", "thyréostimuline", "갑상선자극호르몬"],
    notes: [
      {
        en: "Lags thyroid hormone by 6–8 weeks after a dose change, so rechecking earlier mostly measures the lag.",
        fr: "Retarde de 6 à 8 semaines sur les hormones thyroïdiennes après changement de dose : un contrôle plus précoce mesure surtout le retard.",
        ko: "용량 변경 후 갑상선호르몬보다 6–8주 늦게 따라오므로, 더 일찍 재검하면 그 지연만 보게 됩니다.",
      },
      {
        en: "Biotin (≥ 5 mg/day) falsely lowers TSH and raises FT4 and FT3 in streptavidin–biotin immunoassays, which mimics hyperthyroidism. Stop biotin for at least 2–3 days before testing.",
        fr: "La biotine (≥ 5 mg/j) abaisse faussement la TSH et augmente FT4/FT3 dans les immunodosages streptavidine–biotine, mimant une hyperthyroïdie. Arrêter ≥ 2 à 3 j avant.",
        ko: "비오틴(≥ 5 mg/일)은 스트렙타비딘–비오틴 면역측정에서 TSH를 거짓으로 낮추고 FT4·FT3를 높여 갑상선기능항진증처럼 보이게 합니다. 검사 전 최소 2–3일 중단하세요.",
      },
      {
        en: "Non-thyroidal illness lowers TSH during acute illness, and recovery can push it transiently high (up to ~20 mU/L). Glucocorticoids, dopamine and octreotide suppress it. It peaks at night, so keep the collection time consistent.",
        fr: "Maladie non thyroïdienne : TSH basse en phase aiguë, transitoirement haute (jusqu'à ~20 mUI/L) en récupération ; corticoïdes, dopamine, octréotide la freinent ; pic nocturne, garder la même heure de prélèvement.",
        ko: "비갑상선 질환: 급성기에는 낮고 회복기에는 일시적으로 높을 수 있습니다(~20 mU/L까지). 스테로이드·도파민·옥트레오타이드는 억제합니다. 밤에 가장 높으니 채혈 시간을 일정하게 하세요.",
      },
    ],
  });

  add({
    key: "FT4", group: "endo", cvi: 4.8, cva: 5.0, src: "EFLM",
    names: { en: "Free T4", fr: "T4 libre", ko: "유리 T4" },
    aliases: ["ft4", "free t4", "t4 free", "free thyroxine", "t4 libre", "t4l", "ft4 libre", "유리 t4", "유리t4", "유리티록신"],
    notes: [
      {
        en: "Heparin, even LMWH or a line flush, activates lipase in the tube. The released free fatty acids displace T4, so FT4 reads falsely high.",
        fr: "L'héparine (même HBPM ou rinçage de cathéter) active la lipase in vitro ; les acides gras libérés déplacent la T4 : FT4 faussement élevée.",
        ko: "헤파린(저분자량 헤파린, 라인 세척 포함)은 튜브 안에서 지질분해효소를 활성화하고, 유리지방산이 T4를 치환해 FT4가 거짓으로 높아집니다.",
      },
      {
        en: "Levothyroxine taken shortly before the draw raises FT4 for several hours, so sample before the dose. Biotin and heterophile antibodies can also interfere.",
        fr: "Une prise de lévothyroxine peu avant le prélèvement augmente la FT4 pendant quelques heures : prélever avant la dose. Biotine et anticorps hétérophiles peuvent interférer.",
        ko: "채혈 직전 레보티록신 복용은 몇 시간 동안 FT4를 올리므로 복용 전에 채혈하세요. 비오틴과 이종친화성 항체도 간섭할 수 있습니다.",
      },
    ],
  });

  add({
    key: "PTH", group: "endo", cvi: 14.72, cva: 5.0, src: "EFLM",
    names: { en: "PTH", fr: "PTH (parathormone)", ko: "부갑상선호르몬 (PTH)" },
    aliases: ["pth", "intact pth", "parathormone", "parathyroid hormone", "부갑상선호르몬"],
    notes: [
      {
        en: "2nd- and 3rd-generation assays and different manufacturers disagree, and fragments accumulate in CKD. Only compare results from the same assay. EDTA plasma is more stable than serum.",
        fr: "Les dosages de 2e/3e génération et les fabricants divergent, les fragments s'accumulent en IRC : ne comparer qu'avec le même dosage. Le plasma EDTA est plus stable que le sérum.",
        ko: "2·3세대 측정법과 제조사마다 값이 다르고 만성신장병에서는 단편이 축적됩니다. 같은 측정법끼리만 비교하세요. EDTA 혈장이 혈청보다 안정적입니다.",
      },
    ],
  });

  add({
    key: "B12", group: "endo", cvi: 7.25, cva: 6.0, src: "EFLM",
    names: { en: "Vitamin B12", fr: "Vitamine B12", ko: "비타민 B12" },
    aliases: ["b12", "vit b12", "vitamin b12", "cobalamin", "vitamine b12", "cobalamine", "비타민 b12", "비타민b12"],
    notes: [
      {
        en: "Uninterpretable for weeks after B12 injections. Anti-intrinsic-factor antibodies can make some assays read falsely normal in pernicious anaemia. Check MMA if in doubt.",
        fr: "Ininterprétable des semaines après des injections de B12 ; les anticorps anti-facteur intrinsèque peuvent donner un résultat faussement normal dans la maladie de Biermer : doser l'acide méthylmalonique.",
        ko: "B12 주사 후 몇 주간은 해석할 수 없습니다. 내인자 항체가 악성빈혈에서 일부 측정법을 거짓 정상으로 만들 수 있으니 의심되면 메틸말론산(MMA)을 확인하세요.",
      },
    ],
  });

  // ===================================================================== haematology
  add({
    key: "WBC", group: "heme", cvi: 11.1, cva: 2.5, src: "EFLM",
    names: { en: "White blood cells", fr: "Leucocytes", ko: "백혈구" },
    aliases: ["wbc", "wbc count", "white blood cells", "white blood cell count", "white count", "leukocytes", "leucocytes", "gb", "globules blancs", "백혈구"],
    notes: [
      {
        en: "Glucocorticoids raise neutrophils within hours (demargination). Epinephrine, stress, pain and exercise do it within minutes.",
        fr: "Les corticoïdes augmentent les neutrophiles en quelques heures (démargination) ; adrénaline, stress, douleur et effort en quelques minutes.",
        ko: "스테로이드는 몇 시간 안에 호중구를 올립니다(탈변연화). 에피네프린, 스트레스, 통증, 운동은 몇 분 안에 올립니다.",
      },
      {
        en: "Nucleated red cells, platelet clumps and cryoglobulins can be counted as WBC on some analysers. Check the smear if the count doesn't fit.",
        fr: "Érythroblastes, amas plaquettaires et cryoglobulines peuvent être comptés comme leucocytes : vérifier le frottis si le chiffre ne colle pas.",
        ko: "유핵적혈구, 혈소판 응집, 한랭글로불린이 일부 장비에서 백혈구로 계수됩니다. 맞지 않으면 말초혈액도말을 확인하세요.",
      },
    ],
  });

  add({
    key: "NEUT", group: "heme", cvi: 12.55, cva: 4.0, src: "EFLM",
    names: { en: "Neutrophils (absolute)", fr: "Polynucléaires neutrophiles", ko: "호중구 (절대수)" },
    aliases: ["anc", "neut", "neuts", "neutrophils", "abs neut", "abs neutrophils", "neutrophils absolute", "neutrophils, absolute", "neutrophiles", "pnn", "polynucleaires neutrophiles", "polynucléaires neutrophiles", "호중구", "절대호중구수"],
    notes: [
      {
        en: "Use absolute counts, not percentages. Steroids and epinephrine raise them quickly. People with the Duffy-null phenotype have a lower normal baseline, which isn't disease.",
        fr: "Utiliser les valeurs absolues, pas les %. Corticoïdes et adrénaline les augmentent rapidement ; le phénotype Duffy-nul a une valeur de base plus basse, non pathologique.",
        ko: "백분율이 아니라 절대수를 쓰세요. 스테로이드와 에피네프린은 빠르게 올리며, Duffy-null 표현형은 기저치가 낮지만 질병이 아닙니다.",
      },
    ],
  });

  add({
    key: "LYMPH", group: "heme", cvi: 10.53, cva: 5.0, src: "EFLM",
    names: { en: "Lymphocytes (absolute)", fr: "Lymphocytes", ko: "림프구 (절대수)" },
    aliases: ["alc", "lymph", "lymphs", "lymphocytes", "abs lymph", "lymphocytes absolute", "lymphocytes, absolute", "림프구"],
    notes: [
      {
        en: "Glucocorticoids and acute stress drop lymphocytes within hours. The count is higher at night than in the morning.",
        fr: "Corticoïdes et stress aigu les font chuter en quelques heures ; plus élevés la nuit que le matin.",
        ko: "스테로이드와 급성 스트레스는 몇 시간 안에 림프구를 떨어뜨리며, 아침보다 밤에 높습니다.",
      },
    ],
  });

  add({
    key: "HGB", group: "heme", cvi: 2.67, cva: 1.0, src: "EFLM",
    names: { en: "Haemoglobin", fr: "Hémoglobine", ko: "헤모글로빈" },
    aliases: ["hgb", "hb", "hemoglobin", "haemoglobin", "hemoglobine", "hémoglobine", "헤모글로빈", "혈색소", "혈색소량"],
    notes: [
      {
        en: "In acute haemorrhage Hgb stays normal for hours until volume re-equilibrates, so an early value can falsely reassure. IV fluids dilute it without any bleeding.",
        fr: "Hémorragie aiguë : l'Hb reste normale pendant des heures avant rééquilibration volémique, d'où une fausse réassurance ; les perfusions la diluent sans saignement.",
        ko: "급성 출혈 시 체액이 재분포될 때까지 몇 시간 동안 헤모글로빈이 정상으로 보여 거짓 안심을 줍니다. 수액은 출혈 없이도 희석시킵니다.",
      },
      {
        en: "Going from upright (clinic) to supine (ward) can drop Hgb by about 0.5–1 g/dL with no blood loss, just from plasma volume shifts.",
        fr: "Passer de la position debout (consultation) au décubitus (hospitalisation) peut faire baisser l'Hb de ~5 à 10 g/L sans perte sanguine (redistribution plasmatique).",
        ko: "선 자세(외래)에서 누운 자세(병동)로 바뀌기만 해도 혈장량 이동으로 헤모글로빈이 약 0.5–1 g/dL 떨어질 수 있습니다.",
      },
      {
        en: "Lipaemia, extreme leukocytosis and paraproteins falsely raise Hgb (and MCHC). Blood-gas co-oximetry and point-of-care Hgb are different methods from the CBC.",
        fr: "Lipémie, hyperleucocytose extrême, paraprotéines augmentent faussement l'Hb (et la CCMH). L'Hb des gaz du sang et des appareils de chevet n'est pas la même méthode que la NFS.",
        ko: "지질혈증, 극심한 백혈구증가, 이상단백은 헤모글로빈(과 MCHC)을 거짓으로 올립니다. 혈액가스 co-oximetry와 현장검사 헤모글로빈은 CBC와 다른 방법입니다.",
      },
    ],
  });

  add({
    key: "HCT", group: "heme", cvi: 2.81, cva: 1.5, src: "EFLM",
    names: { en: "Haematocrit", fr: "Hématocrite", ko: "헤마토크릿" },
    aliases: ["hct", "hematocrit", "haematocrit", "hématocrite", "hematocrite", "ht", "pcv", "헤마토크릿", "적혈구용적률", "적혈구용적"],
    notes: [
      {
        en: "Blood-gas Hct is estimated from conductivity and reads falsely low when protein is low (after crystalloids or cardiopulmonary bypass). Don't mix it with CBC Hct.",
        fr: "L'Ht des gaz du sang est estimé par conductimétrie : faussement bas si protides bas (remplissage, CEC). Ne pas le mélanger avec l'Ht de la NFS.",
        ko: "혈액가스 헤마토크릿은 전도도로 추정하므로 단백이 낮으면(정질액 투여, 심폐우회술 후) 거짓으로 낮습니다. CBC 값과 섞지 마세요.",
      },
      {
        en: "On most analysers it is calculated (MCV × RBC), so cold agglutinins and hyperglycaemia distort it through MCV.",
        fr: "Souvent calculé (VGM × GR) : agglutinines froides et hyperglycémie le faussent via le VGM.",
        ko: "대부분 장비에서 계산값(MCV × RBC)이라 한랭응집소와 고혈당이 MCV를 통해 왜곡합니다.",
      },
    ],
  });

  add({
    key: "RBC", group: "heme", cvi: 2.61, cva: 1.5, src: "EFLM",
    names: { en: "Red blood cells", fr: "Globules rouges (hématies)", ko: "적혈구" },
    aliases: ["rbc", "rbc count", "red blood cells", "red blood cell count", "red cell count", "erythrocytes", "érythrocytes", "gr", "globules rouges", "hematies", "hématies", "적혈구", "적혈구수"],
    notes: [
      {
        en: "Cold agglutinins clump red cells, falsely lowering RBC and raising MCV and MCHC. Warming the sample to 37 °C fixes it.",
        fr: "Les agglutinines froides agglutinent les hématies : GR faussement bas, VGM et CCMH faussement hauts ; réchauffer l'échantillon à 37 °C corrige.",
        ko: "한랭응집소는 적혈구를 응집시켜 RBC를 거짓으로 낮추고 MCV·MCHC를 높입니다. 검체를 37 °C로 데우면 교정됩니다.",
      },
    ],
  });

  add({
    key: "MCV", group: "heme", cvi: 0.77, cva: 1.0, src: "EFLM",
    names: { en: "MCV", fr: "VGM", ko: "평균적혈구용적 (MCV)" },
    aliases: ["mcv", "vgm", "mean corpuscular volume", "mean cell volume", "volume globulaire moyen", "평균적혈구용적"],
    notes: [
      {
        en: "Falsely high with cold agglutinins, hyperglycaemia or hypernatraemia (cells swell in the diluent) and samples over 24 h old.",
        fr: "Faussement élevé : agglutinines froides, hyperglycémie ou hypernatrémie (gonflement dans le diluant), échantillon > 24 h.",
        ko: "한랭응집소, 고혈당·고나트륨혈증(희석액에서 세포 팽창), 24시간 넘은 검체에서 거짓으로 높습니다.",
      },
      {
        en: "Reticulocytes are large, so MCV rises after bleeding or haemolysis without any B12 or folate deficiency. Combined iron and B12 deficiency can average out to a normal MCV, so look at the RDW.",
        fr: "Les réticulocytes sont gros : le VGM monte après saignement ou hémolyse sans carence B12/folates. Carence mixte fer + B12 peut donner un VGM normal : regarder l'IDR.",
        ko: "망상적혈구는 크기 때문에 출혈·용혈 후 B12·엽산 결핍 없이도 MCV가 오릅니다. 철과 B12 결핍이 겹치면 MCV가 정상으로 보일 수 있으니 RDW를 보세요.",
      },
    ],
  });

  add({
    key: "PLT", group: "heme", cvi: 7.26, cva: 3.5, src: "EFLM",
    names: { en: "Platelets", fr: "Plaquettes", ko: "혈소판" },
    aliases: ["plt", "plts", "platelets", "platelet count", "platelet", "plaquettes", "thrombocytes", "혈소판", "혈소판수"],
    notes: [
      {
        en: "EDTA-dependent clumping (pseudothrombocytopenia) causes an isolated low count in a well patient. Look at the smear or recollect in citrate.",
        fr: "Agrégation dépendante de l'EDTA (fausse thrombopénie) : chiffre bas isolé chez un patient qui va bien ; vérifier le frottis ou reprélever sur citrate.",
        ko: "EDTA 의존성 응집(가성혈소판감소증)은 건강한 환자에서 단독 저하를 일으킵니다. 도말을 확인하거나 구연산 튜브로 재채혈하세요.",
      },
      {
        en: "Giant platelets get undercounted. Red-cell fragments (schistocytes) or microspherocytes can be counted as platelets and give a falsely normal count.",
        fr: "Les plaquettes géantes sont sous-comptées ; schizocytes et microsphérocytes peuvent être comptés comme plaquettes (chiffre faussement normal).",
        ko: "거대 혈소판은 적게 계수되고, 분열적혈구·미세구상적혈구는 혈소판으로 계수되어 거짓 정상이 될 수 있습니다.",
      },
      {
        en: "On heparin for 5–10 days, a fall of 50 % or more should prompt a 4Ts score for HIT, even if the count is still 'normal'.",
        fr: "Sous héparine depuis 5 à 10 j, une baisse ≥ 50 % doit faire calculer le score 4T (TIH), même si le chiffre reste « normal ».",
        ko: "헤파린 5–10일째에 50% 이상 감소하면 수치가 '정상'이어도 HIT 4Ts 점수를 계산하세요.",
      },
    ],
  });

  // ===================================================================== coagulation
  add({
    key: "INR", group: "coag", cvi: 2.5, cva: 3.0, src: "EFLM",
    names: { en: "INR", fr: "INR", ko: "INR" },
    aliases: ["inr", "pt inr", "pt/inr", "pt-inr", "inr pt"],
    notes: [
      {
        en: "An underfilled citrate tube, or haematocrit above 55 % (too much citrate for the plasma), falsely prolongs PT/INR.",
        fr: "Tube citraté insuffisamment rempli ou hématocrite > 55 % (trop de citrate pour le plasma) : TP/INR faussement allongé.",
        ko: "구연산 튜브를 덜 채우거나 헤마토크릿 > 55%(혈장 대비 구연산 과다)이면 PT/INR이 거짓으로 연장됩니다.",
      },
      {
        en: "DOACs affect INR unpredictably (rivaroxaban more than apixaban), so INR is not a DOAC level. INR is calibrated for warfarin, not for liver disease.",
        fr: "Les AOD modifient l'INR de façon variable (rivaroxaban > apixaban) : l'INR n'est pas un dosage d'AOD. Il est calibré pour les AVK, pas pour l'insuffisance hépatique.",
        ko: "DOAC는 INR에 예측 불가하게 영향을 줍니다(리바록사반 > 아픽사반). INR은 DOAC 농도가 아니며 와파린용으로 보정되어 간질환에는 맞지 않습니다.",
      },
      {
        en: "Point-of-care INR diverges from the lab above about 3–4 and with antiphospholipid antibodies. Heparin contamination from a line can also prolong it.",
        fr: "L'INR capillaire diverge du laboratoire au-delà de ~3–4 et en présence d'antiphospholipides ; une contamination par l'héparine d'un cathéter peut l'allonger.",
        ko: "현장검사 INR은 약 3–4 이상이거나 항인지질항체가 있으면 검사실 값과 달라집니다. 라인의 헤파린 오염도 연장시킬 수 있습니다.",
      },
    ],
  });

  add({
    key: "PT", group: "coag", cvi: 2.6, cva: 2.5, src: "EFLM",
    names: { en: "Prothrombin time (s)", fr: "Temps de Quick (s)", ko: "프로트롬빈시간 (PT)" },
    aliases: [{ t: "pt", langs: ["en", "ko"] }, "prothrombin time", "pro time", "protime", "temps de quick", "tq", "프로트롬빈시간", "프로트롬빈 시간"],
    notes: [
      {
        en: "Seconds depend on the reagent, so compare within the same lab. The INR caveats apply. French 'TP' (taux de prothrombine, %) is a different, non-linear scale and is not handled here.",
        fr: "Les secondes dépendent du réactif : comparer dans le même laboratoire ; mêmes pièges que l'INR. Le « TP » (taux de prothrombine, %) est une échelle différente, non linéaire, non gérée ici.",
        ko: "초 단위 값은 시약에 따라 다르므로 같은 검사실 안에서만 비교하세요. INR의 주의점이 그대로 적용됩니다.",
      },
    ],
  });

  add({
    key: "APTT", group: "coag", cvi: 2.77, cva: 3.0, src: "EFLM",
    names: { en: "aPTT", fr: "TCA", ko: "aPTT" },
    aliases: ["aptt", "ptt", "a ptt", "tca", "temps de cephaline activee", "temps de céphaline activée", "tck", "활성화부분트롬보플라스틴시간"],
    notes: [
      {
        en: "Heparin contamination from a line is the classic false prolongation. Draw from the other arm or discard enough volume first.",
        fr: "La contamination par l'héparine d'un cathéter est l'allongement faux classique : prélever au bras opposé ou purger suffisamment.",
        ko: "라인의 헤파린 오염이 대표적인 거짓 연장입니다. 반대쪽 팔에서 채혈하거나 충분히 버린 뒤 채혈하세요.",
      },
      {
        en: "Lupus anticoagulant and factor XII deficiency prolong it without bleeding risk. High factor VIII in the acute phase shortens it and masks heparin, so consider anti-Xa for unfractionated heparin.",
        fr: "Anticoagulant lupique et déficit en facteur XII l'allongent sans risque hémorragique ; le facteur VIII élevé en phase aiguë le raccourcit et masque l'héparine : envisager l'anti-Xa.",
        ko: "루푸스 항응고인자와 XII인자 결핍은 출혈 위험 없이 연장시킵니다. 급성기 높은 VIII인자는 단축시켜 헤파린 효과를 가리므로 anti-Xa를 고려하세요.",
      },
    ],
  });

  add({
    key: "FIB", group: "coag", cvi: 10.18, cva: 5.0, src: "EFLM",
    names: { en: "Fibrinogen", fr: "Fibrinogène", ko: "섬유소원" },
    aliases: ["fibrinogen", "fib", "fibrinogene", "fibrinogène", "섬유소원", "피브리노겐"],
    notes: [
      {
        en: "Acute-phase reactant (inflammation, pregnancy), so a 'normal' level can hide consumption in DIC. Direct thrombin inhibitors can falsely lower Clauss results with some reagents.",
        fr: "Protéine de l'inflammation (et grossesse) : un taux « normal » peut masquer une consommation (CIVD). Les inhibiteurs directs de la thrombine peuvent abaisser faussement la méthode de Clauss selon le réactif.",
        ko: "급성기 반응물질(염증, 임신)이라 '정상' 값이 DIC의 소모를 가릴 수 있습니다. 직접 트롬빈 억제제는 일부 시약에서 Clauss법 값을 거짓으로 낮춥니다.",
      },
    ],
  });

  add({
    key: "DDIMER", group: "coag", cvi: 25.24, cva: 6.0, src: "EFLM",
    names: { en: "D-dimer", fr: "D-dimères", ko: "D-이합체" },
    aliases: ["d-dimer", "d dimer", "ddimer", "d-dimers", "d-dimeres", "d-dimères", "d dimeres", "d-이합체", "디다이머"],
    notes: [
      {
        en: "Rises with age, pregnancy, surgery, cancer and inflammation. Assays report FEU or DDU (about a 2× difference), so never compare across labs.",
        fr: "Augmentent avec l'âge, la grossesse, la chirurgie, le cancer, l'inflammation. Unités FEU ou DDU (facteur ~2) : ne jamais comparer entre laboratoires.",
        ko: "나이, 임신, 수술, 암, 염증에서 오릅니다. FEU와 DDU 단위(약 2배 차이)가 있으므로 검사실 간 비교는 하지 마세요.",
      },
    ],
  });

  // ===================================================================== cardiac (no % RCV)
  add({
    key: "TROP", group: "cardiac", cvi: null, cva: null, src: null, noRcv: "assay",
    names: { en: "Troponin", fr: "Troponine", ko: "트로포닌" },
    aliases: ["troponin", "trop", "tnt", "tni", "ctnt", "ctni", "hs-tnt", "hs-tni", "hstnt", "hstni", "hs-ctnt", "hs-ctni", "hs troponin", "troponin t", "troponin i", "hs troponin t", "hs troponin i", "troponine", "troponine t", "troponine i", "트로포닌", "트로포닌 t", "트로포닌 i"],
    notes: [
      {
        en: "Use your assay's validated absolute delta (ng/L) at 0/1–3 h (ESC 0/1 h or 0/2 h pathways). A % RCV from healthy people doesn't apply to acute chest pain.",
        fr: "Utiliser le delta absolu (ng/L) validé pour votre dosage à 0/1–3 h (algorithmes ESC 0/1 h, 0/2 h) : une différence critique en % issue de sujets sains ne s'applique pas à la douleur thoracique aiguë.",
        ko: "사용 중인 측정법에서 검증된 0/1–3시간 절대 변화량(ng/L)을 쓰세요(ESC 0/1h, 0/2h 알고리즘). 건강인에서 구한 % RCV는 급성 흉통에 맞지 않습니다.",
      },
      {
        en: "hs-cTnT and hs-cTnI are not interchangeable, and neither are assays from different manufacturers.",
        fr: "hs-cTnT et hs-cTnI ne sont pas interchangeables, ni les dosages de fabricants différents.",
        ko: "hs-cTnT와 hs-cTnI는 서로 바꿔 쓸 수 없으며, 제조사가 다른 측정법끼리도 마찬가지입니다.",
      },
      {
        en: "Chronically raised in CKD, heart failure and older age. cTnT (not cTnI) rises in chronic skeletal-muscle disease (myositis, rhabdomyolysis). Heterophile antibodies and macrotroponin cause persistent false cTnI elevation.",
        fr: "Chroniquement élevée en IRC, insuffisance cardiaque, grand âge ; la cTnT (pas la cTnI) monte dans les myopathies (myosite, rhabdomyolyse). Anticorps hétérophiles et macrotroponine : fausse élévation persistante de cTnI.",
        ko: "만성신장병, 심부전, 고령에서 만성적으로 높습니다. 만성 골격근 질환(근염, 횡문근융해)에서는 cTnI가 아니라 cTnT가 오릅니다. 이종친화성 항체와 마크로트로포닌은 지속적인 거짓 cTnI 상승을 일으킵니다.",
      },
    ],
  });

  add({
    key: "NTBNP", group: "cardiac", cvi: null, cva: null, src: null, noRcv: "wide",
    names: { en: "NT-proBNP", fr: "NT-proBNP", ko: "NT-proBNP" },
    aliases: ["nt-probnp", "ntprobnp", "nt probnp", "nt-pro bnp", "nt pro bnp", "probnp", "pro-bnp", "pro bnp"],
    notes: [
      {
        en: "Published within-person variation is large and study-dependent (RCVs of roughly 30–100 %). Smaller changes are unlikely to mean much.",
        fr: "La variabilité intra-individuelle publiée est grande et variable selon les études (différence critique ~30 à 100 %) : de petites variations ont peu de sens.",
        ko: "보고된 개인 내 변동이 크고 연구마다 다릅니다(RCV 약 30–100%). 그보다 작은 변화는 의미가 적습니다.",
      },
      {
        en: "Obesity lowers it, while kidney dysfunction, age and atrial fibrillation raise it. On sacubitril/valsartan, trend NT-proBNP rather than BNP: neprilysin inhibition raises BNP but not NT-proBNP.",
        fr: "L'obésité l'abaisse ; insuffisance rénale, âge, FA l'augmentent. Sous sacubitril/valsartan, suivre le NT-proBNP et non le BNP (l'inhibition de la néprilysine augmente le BNP, pas le NT-proBNP).",
        ko: "비만은 낮추고, 신기능 저하·고령·심방세동은 올립니다. 사쿠비트릴/발사르탄 투여 중에는 BNP 대신 NT-proBNP를 추적하세요(네프릴리신 억제는 BNP만 올림).",
      },
    ],
  });

  add({
    key: "BNP", group: "cardiac", cvi: null, cva: null, src: null, noRcv: "wide",
    names: { en: "BNP", fr: "BNP", ko: "BNP" },
    aliases: ["bnp", "b-type natriuretic peptide", "brain natriuretic peptide"],
    notes: [
      {
        en: "Sacubitril/valsartan raises BNP by blocking its breakdown, so trend NT-proBNP instead. Within-person variation is large (RCVs of roughly 40–100 %).",
        fr: "Le sacubitril/valsartan augmente le BNP (dégradation bloquée) : suivre plutôt le NT-proBNP. Variabilité intra-individuelle grande (différence critique ~40 à 100 %).",
        ko: "사쿠비트릴/발사르탄은 BNP 분해를 막아 수치를 올리므로 NT-proBNP로 추적하세요. 개인 내 변동이 큽니다(RCV 약 40–100%).",
      },
    ],
  });

  return A;
});
