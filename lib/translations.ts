export type Language = 'EN' | 'HI';

export const translations: Record<string, Record<Language, string>> = {
  home: { EN: "Home", HI: "घर" },
  health: { EN: "Health", HI: "स्वास्थ्य" },
  diet: { EN: "Poshan Lab", HI: "पोषण लैब" },
  move: { EN: "Move", HI: "व्यायाम" },
  me: { EN: "Me", HI: "प्रोफ़ाइल" },
  dashboard_title: { EN: "Your Health", HI: "आपका स्वास्थ्य" },
  dashboard_subtitle: { EN: "Personalized insights based on your recent labs", HI: "आपकी हालिया लैब रिपोर्ट के आधार पर व्यक्तिगत जानकारी" },
  talk_to_doctor: { EN: "Talk to Dr. Umeed", HI: "डॉ. उम्मीद से बात करें" },
  patient_level: { EN: "Patient Level", HI: "मरीज का स्तर" },
  report_source: { EN: "Report Source", HI: "रिपोर्ट का स्रोत" },
  doctor_explanation: { EN: "Doctor's Explanation", HI: "डॉक्टर की व्याख्या" },
  affected_areas: { EN: "Affected Areas", HI: "प्रभावित अंग" },
  lab_parameters: { EN: "Lab Parameters", HI: "लैब पैरामीटर्स" },
  ai_confidence: { EN: "AI Confidence", HI: "AI का भरोसा" },
  action_plan: { EN: "Your Action Plan", HI: "आपकी कार्ययोजना" },
  translate_to_hindi: { EN: "Translate to Hindi", HI: "हिंदी में बदलें" },
  switch_to_english: { EN: "Switch to English", HI: "अंग्रेजी में बदलें" },
  ask_doctor: { EN: "Ask Dr. Umeed...", HI: "डॉ. उम्मीद से पूछें..." },
  safety_first: { EN: "Safety First", HI: "सुरक्षा सर्वोपरि" },
  best_timing: { EN: "Best Timing", HI: "सही समय" },
  top_healing_foods: { EN: "Top Healing Foods", HI: "प्रमुख स्वस्थ आहार" },
  nutrient_targets: { EN: "Nutrient Targets", HI: "पोषक तत्व लक्ष्य" },
  recent_milestones: { EN: "Recent Milestones", HI: "हाल की उपलब्धियां" },
  vitality: { EN: "Vitality", HI: "जीवन शक्ति" },
  resilience: { EN: "Resilience", HI: "लचीलापन" },
  sync_healthconnect: { EN: "Sync to HealthConnect", HI: "हेल्थकनेक्ट से सिंक करें" },

  // Health Score Hero Strip
  health_score:          { EN: "Health Score",          HI: "स्वास्थ्य स्कोर" },
  normal:                { EN: "Normal",                HI: "सामान्य" },
  attention:             { EN: "Attention",             HI: "ध्यान दें" },
  biomarkers_in_range:   { EN: "biomarkers in range",   HI: "बायोमार्कर सामान्य हैं" },
  need_attention:        { EN: "need your attention",   HI: "ध्यान देने की जरूरत" },
  analysis_confidence:   { EN: "analysis confidence",   HI: "विश्लेषण विश्वास" },
  clinical_sync:         { EN: "Clinical Sync",         HI: "क्लिनिकल सिंक" },

  // Lab filter buttons
  filter_all:            { EN: "All",                   HI: "सभी" },
  filter_abnormal:       { EN: "Abnormal",              HI: "असामान्य" },
  filter_normal:         { EN: "Normal",                HI: "सामान्य" },
};
