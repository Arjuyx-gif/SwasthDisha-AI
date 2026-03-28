import { GUCState } from './store';

// ─── Demo Report 1: Iron Deficiency Anemia ───────────────────────────────────
export const mockAnemia: Partial<GUCState> = {
  reportText:
    'Priya Sharma, 22 F, presents with persistent fatigue, breathlessness on exertion, and pale conjunctiva for 3 months. Lab: Hemoglobin 8.9 g/dL (Normal: 12-16), Serum Ferritin 6.4 ng/mL (Normal: 12-150), MCV 71 fL (Normal: 80-100), TIBC 480 µg/dL (Normal: 250-370), Serum Iron 38 µg/dL (Normal: 60-170), Reticulocyte Count 1.2% (Normal: 0.5-2.5).',
  language: 'EN',
  summary:
    "Priya's results point to Iron Deficiency Anemia — her hemoglobin and ferritin are significantly below normal, meaning her blood isn't carrying enough oxygen. The raised TIBC confirms her body is desperately trying to absorb more iron.",
  hindiSummary:
    'प्रिया के परिणाम आयरन की कमी से एनीमिया की ओर इशारा करते हैं — उनका हीमोग्लोबिन और फेरिटिन काफी कम है, जिसका मतलब है कि उनका खून पर्याप्त ऑक्सीजन नहीं ले जा रहा। बढ़ा हुआ TIBC यह बताता है कि शरीर अधिक आयरन अवशोषित करने की कोशिश कर रहा है।',
  labValues: [
    { name: 'Hemoglobin',       value: 8.9,  unit: 'g/dL',    status: 'LOW',    referenceRange: '12-16'   },
    { name: 'Serum Ferritin',   value: 6.4,  unit: 'ng/mL',   status: 'LOW',    referenceRange: '12-150'  },
    { name: 'MCV',              value: 71,   unit: 'fL',       status: 'LOW',    referenceRange: '80-100'  },
    { name: 'TIBC',             value: 480,  unit: 'µg/dL',   status: 'HIGH',   referenceRange: '250-370' },
    { name: 'Serum Iron',       value: 38,   unit: 'µg/dL',   status: 'LOW',    referenceRange: '60-170'  },
    { name: 'Reticulocyte Count', value: 1.2, unit: '%',       status: 'NORMAL', referenceRange: '0.5-2.5' },
  ],
  organFlags: ['blood'],
  exerciseFlags: ['ANEMIA_LIGHT'],
  dietaryFlags: ['IRON_RICH', 'VITAMIN_C', 'ANEMIA_DIET'],
  jargonMap: {
    Hemoglobin:         'The protein in red blood cells that carries oxygen throughout your body',
    'Serum Ferritin':   'Your body\'s iron storage level — low ferritin means your reserves are depleted',
    MCV:                'Average size of your red blood cells — small cells often mean iron deficiency',
    TIBC:               'Total Iron Binding Capacity — high value means your body is hungry for more iron',
    'Serum Iron':       'The amount of iron currently circulating in your bloodstream',
    'Reticulocyte Count': 'Young red blood cells — reflects how fast your bone marrow is making new cells',
  },
  age: 22,
  ai_confidence_score: 96,
  checklist: [
    { id: 'a1', task: 'Take iron tablets on an empty stomach with a glass of lemon water', completed: false },
    { id: 'a2', task: 'Pair iron-rich foods (palak, rajma) with Vitamin C sources (amla, lemon)', completed: false },
    { id: 'a3', task: 'Avoid tea or coffee within 1 hour of meals — they block iron absorption', completed: false },
    { id: 'a4', task: 'Follow up with CBC blood test in 6 weeks', completed: false },
  ],
  xp: 60,
  level: 1,
  avatarState: 'HAPPY',
};

// ─── Demo Report 2: Elevated Liver Enzymes ───────────────────────────────────
export const mockLiver: Partial<GUCState> = {
  reportText:
    'Rahul Mehra, 38 M, presents with right upper quadrant heaviness and mild jaundice for 10 days. No alcohol history. Lab: ALT 178 U/L (Normal: 7-56), AST 142 U/L (Normal: 10-40), GGT 210 U/L (Normal: 9-48), Bilirubin Total 3.1 mg/dL (Normal: 0.2-1.2), Albumin 3.3 g/dL (Normal: 3.5-5.0), ALP 185 U/L (Normal: 44-147).',
  language: 'EN',
  summary:
    "Rahul's liver enzymes — ALT, AST, and GGT — are all significantly elevated, indicating active liver stress or inflammation. Elevated bilirubin explains the mild jaundice. Slightly low albumin suggests the liver is beginning to struggle with protein synthesis.",
  hindiSummary:
    'राहुल के लीवर एंजाइम — ALT, AST और GGT — सभी काफी बढ़े हुए हैं, जो लीवर में सक्रिय तनाव या सूजन का संकेत देते हैं। बढ़ा हुआ बिलीरुबिन हल्की पीलिया को समझाता है। थोड़ा कम एल्बुमिन बताता है कि लीवर प्रोटीन संश्लेषण में संघर्ष करने लगा है।',
  labValues: [
    { name: 'ALT',             value: 178,  unit: 'U/L',   status: 'HIGH',   referenceRange: '7-56'    },
    { name: 'AST',             value: 142,  unit: 'U/L',   status: 'HIGH',   referenceRange: '10-40'   },
    { name: 'GGT',             value: 210,  unit: 'U/L',   status: 'HIGH',   referenceRange: '9-48'    },
    { name: 'Bilirubin Total', value: 3.1,  unit: 'mg/dL', status: 'HIGH',   referenceRange: '0.2-1.2' },
    { name: 'Albumin',         value: 3.3,  unit: 'g/dL',  status: 'LOW',    referenceRange: '3.5-5.0' },
    { name: 'ALP',             value: 185,  unit: 'U/L',   status: 'HIGH',   referenceRange: '44-147'  },
  ],
  organFlags: ['liver'],
  exerciseFlags: ['LIVER_RESTRICTED'],
  dietaryFlags: ['LOW_FAT', 'NO_ALCOHOL', 'LIVER_DETOX_DIET'],
  jargonMap: {
    ALT:              'Liver enzyme released into blood when liver cells are damaged — the key marker of liver health',
    AST:              'Another enzyme indicating liver or muscle cell damage',
    GGT:              'Enzyme linked to bile ducts and liver — elevated in fatty liver and bile issues',
    'Bilirubin Total': 'Yellow pigment produced when red blood cells break down — high levels cause jaundice',
    Albumin:          'Key protein made by the liver — low levels reflect reduced liver function',
    ALP:              'Enzyme linked to bile ducts — raised in liver, bone, or gallbladder conditions',
  },
  age: 38,
  ai_confidence_score: 93,
  checklist: [
    { id: 'l1', task: 'Eat small, low-fat meals — dal, steamed vegetables, curd rice', completed: false },
    { id: 'l2', task: 'Avoid all fried, spicy, and processed food for at least 4 weeks', completed: false },
    { id: 'l3', task: 'Get an abdominal ultrasound to rule out fatty liver or biliary block', completed: false },
    { id: 'l4', task: 'Monitor ALT and bilirubin every 2 weeks until normalised', completed: false },
  ],
  xp: 90,
  level: 1,
  avatarState: 'IDLE',
};

// ─── Demo Report 3: Vitamin D & Metabolic Panel ──────────────────────────────
export const mockVitaminD: Partial<GUCState> = {
  reportText:
    'Sunita Kapoor, 45 F, presents with joint stiffness, muscle cramps, and generalised weakness for 2 months. Lab: 25-OH Vitamin D 11.2 ng/mL (Normal: 30-100), Calcium 8.4 mg/dL (Normal: 8.6-10.3), Phosphorus 2.4 mg/dL (Normal: 2.7-4.5), iPTH 92 pg/mL (Normal: 10-65), Magnesium 1.6 mg/dL (Normal: 1.7-2.2), HbA1c 5.9% (Normal: <5.7).',
  language: 'EN',
  summary:
    "Sunita has a severe Vitamin D deficiency, which is driving her secondary hyperparathyroidism (raised PTH) and causing her muscles and joints to ache. Her HbA1c is in the pre-diabetic range — this is an early warning to watch sugar intake. Calcium and magnesium are both borderline low.",
  hindiSummary:
    'सुनीता में गंभीर विटामिन डी की कमी है, जो उनके PTH को बढ़ा रही है और मांसपेशियों व जोड़ों में दर्द का कारण बन रही है। उनका HbA1c प्री-डायबेटिक स्तर पर है — यह चीनी के सेवन पर ध्यान देने की चेतावनी है। कैल्शियम और मैग्नीशियम दोनों सीमा पर कम हैं।',
  labValues: [
    { name: '25-OH Vitamin D', value: 11.2, unit: 'ng/mL',  status: 'LOW',    referenceRange: '30-100'  },
    { name: 'Calcium',         value: 8.4,  unit: 'mg/dL',  status: 'LOW',    referenceRange: '8.6-10.3'},
    { name: 'Phosphorus',      value: 2.4,  unit: 'mg/dL',  status: 'LOW',    referenceRange: '2.7-4.5' },
    { name: 'iPTH',            value: 92,   unit: 'pg/mL',  status: 'HIGH',   referenceRange: '10-65'   },
    { name: 'Magnesium',       value: 1.6,  unit: 'mg/dL',  status: 'LOW',    referenceRange: '1.7-2.2' },
    { name: 'HbA1c',           value: 5.9,  unit: '%',      status: 'HIGH',   referenceRange: '<5.7'    },
  ],
  organFlags: ['bones', 'metabolic'],
  exerciseFlags: ['NORMAL_ACTIVE'],
  dietaryFlags: ['VITAMIN_D_RICH', 'CALCIUM_RICH', 'LOW_GLYCEMIC_DIET'],
  jargonMap: {
    '25-OH Vitamin D': 'The active form of Vitamin D in your blood — critical for bone strength and immunity',
    Calcium:           'Mineral that keeps bones strong — low levels can cause cramps and brittle bones',
    Phosphorus:        'Works with calcium to build strong bones — low when Vitamin D is deficient',
    iPTH:              'Parathyroid Hormone — rises when calcium drops, trying to restore balance',
    Magnesium:         'Essential for 300+ body functions including muscle and nerve health',
    HbA1c:             'Average blood sugar over 3 months — above 5.7% signals pre-diabetes risk',
  },
  age: 45,
  ai_confidence_score: 97,
  checklist: [
    { id: 'v1', task: 'Take Vitamin D3 (60,000 IU weekly) as prescribed with a fatty meal', completed: false },
    { id: 'v2', task: '15 min of morning sunlight (before 9 AM) on arms and legs daily', completed: false },
    { id: 'v3', task: 'Increase calcium through curd, til (sesame), and ragi — not just supplements', completed: false },
    { id: 'v4', task: 'Cut refined sugar and white rice to keep HbA1c from climbing further', completed: false },
    { id: 'v5', task: 'Retest Vitamin D and HbA1c after 3 months of supplementation', completed: false },
  ],
  xp: 75,
  level: 1,
  avatarState: 'HAPPY',
};

export const mockData = [mockAnemia, mockLiver, mockVitaminD];
