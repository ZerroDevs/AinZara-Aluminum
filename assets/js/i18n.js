/**
 * AinZara-Aluminum Internationalization (i18n) Engine
 * Supported Languages: English ('en' - LTR), Arabic ('ar' - RTL)
 * Handles direction, stylesheet toggling, multi-button delegation, and complete translations
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ainzara_lang';
  const RTL_CSS_ID = 'rtl-stylesheet';
  const RTL_CSS_PATH = 'assets/css/rtl.css';

  const TRANSLATIONS = {
    en: {
      brand_name: "AIN ZARA",
      brand_tagline: "Glass Processing & Aluminum Manufacturing",
      header_location: "Ain Zara, Industrial District, Tripoli, Libya",
      lang_label: "العربية",
      lang_short: "AR",
      
      nav_home: "Home",
      nav_about: "About Us",
      nav_systems: "Architectural Systems",
      nav_references: "References",
      nav_contact: "Contact",
      btn_rfq: "Quote",
      mobile_nav_title: "Navigation Menu",
      quick_contact: "Direct Inquiries",
      call_only: "Voice",
      line_1_role: "HQ & Factory",
      line_2_role: "Sales & Estimating",
      line_3_role: "Engineering Desk",
      line_4_role: "Voice Calls Only",
      line_5_role: "Customer Service",
      btn_call: "Call",
      btn_call_voice: "Voice Call",
      btn_download_cad: "Download CAD (DWG)",
      btn_download_catalog: "Technical Sheet (PDF)",

      // Drawer Specific Keys
      drawer_explore_series: "7 Series • 14 Profiles",
      drawer_matrix_desc: "Complete Technical Specifications",
      drawer_quick_actions: "Quick Actions",
      drawer_download_catalog: "Catalog PDF",
      drawer_factory_badge: "Tripoli Industrial Complex",
      drawer_factory_hours: "Sat – Thu: 08:00 – 17:00",
      drawer_more_contacts: "All 5 Department Lines",
      drawer_direct_channels: "Direct Factory Lines",
      drawer_desc_sliding: "Lift & Slide • Heavy Monorail",
      drawer_desc_door_window: "Thermal-Break & Standard Casements",
      drawer_desc_facade: "Structural & Semi-Structural Glazing",
      drawer_desc_folding: "Heavy-Duty Bi-Fold Thermal Systems",
      drawer_desc_office: "Double Glass Acoustic Partitions",
      drawer_desc_roof: "Veranda & Wintergarden Roofs",
      drawer_desc_vertical: "Automated Motorized Guillotine",

      // Categories
      cat_all: "All Systems Matrix",
      cat_sliding: "Sliding Systems",
      cat_door_window: "Door & Window",
      cat_facade: "Curtain Wall & Facades",
      cat_folding: "Folding Doors",
      cat_office: "Office Partitions",
      cat_roof: "Skylight & Roof",
      cat_vertical: "Vertical Guillotine",

      // Hero
      hero_sub_1: "High-Precision Architectural Aluminum & Glass",
      hero_title_1: "Industrial Engineering for Modern Architecture",
      hero_desc_1: "Engineered architectural aluminum facades, thermal-break sliding systems, and automated insulating glass processing manufactured to European ISO and EN standards in Tripoli, Libya.",
      hero_sub_2: "Structural Glazing & Curtain Wall Engineering",
      hero_title_2: "Engineered Facades for Commercial Landmarks",
      hero_desc_2: "Semi-structural and structural silicone-glazed curtain wall systems delivering maximum wind-load resistance, acoustic dampening, and advanced solar thermal control.",

      // Stats
      stat_val_1: "15,000 m²",
      stat_lbl_1: "Annual Glass & Aluminum Fabrication",
      stat_val_2: "0.1 mm",
      stat_lbl_2: "CNC Double-Head Saw Precision",
      stat_val_3: "100%",
      stat_lbl_3: "Argon-Injected Insulating Glass (IGU)",
      stat_val_4: "50+ Projects",
      stat_lbl_4: "Commercial & Residential Facades Built",

      // Tech Specs Headers
      spec_frame_depth: "Frame Depth",
      spec_vent_depth: "Vent/Sash Depth",
      spec_glass_thickness: "Glass Thickness Range",
      spec_thermal_rating: "Thermal Insulation",
      spec_air_water: "Air / Water Tightness",
      btn_view_cross_section: "Cross-Section Schematics",
      btn_download_catalog: "Download Technical Catalog",
      btn_download_cad: "CAD / DWG Details",
      btn_3d_view: "3D View",
      btn_exploded_view: "Exploded View",
      btn_dimensions: "Dimensions",
      btn_reset_camera: "Reset View",
      tab_3d_model: "3D Interactive Model",
      tab_2d_schematic: "2D CAD Schematic",
      modal_3d_title: "3D CAD Model Inspection",
      note_3d_disclaimer: "Interactive 3D representation • For exact manufacturing specifications refer to official 2D CAD schematic",

      // Glass Capabilities
      glass_title: "Automated Glass Processing Plant",
      glass_subtitle: "State-of-the-art horizontal tempering furnaces, automated double-glazed IGU lines, and acoustic laminated safety glass.",
      glass_cap_1_title: "Insulated Glass Units (IGU)",
      glass_cap_1_desc: "Dual and triple glazed sealed units with warm-edge composite spacers, primary polyisobutylene and secondary two-part structural silicone sealants with automated 90%+ Argon gas injection.",
      glass_cap_2_title: "Tempered & Laminated Safety",
      glass_cap_2_desc: "Fully tempered glass tested to EN 12150 standard with 5x surface compression, and multi-layer PVB acoustic laminated safety glass for impact and sound protection up to 45 dB.",
      glass_cap_3_title: "Solar Control & Low-E Coatings",
      glass_cap_3_desc: "High-performance magnetron sputtered Low-E and solar reflective coatings designed to drastically lower thermal solar heat gain (SHGC < 0.28) in Mediterranean and North African climates.",

      // Footer
      footer_about: "Ain Zara is a premier industrial manufacturer in Tripoli, Libya, specializing in advanced architectural aluminum systems, curtain walls, thermal-break windows, and automated insulating glass processing.",
      footer_nav_title: "Corporate",
      footer_systems_title: "Systems",
      footer_contact_title: "Direct Inquiries",
      copyright_rights: "All Rights Reserved. Architectural Aluminum & Glass Processing.",
      location_tripoli: "Tripoli, Libya",

      // RFQ Modal
      rfq_modal_title: "Request an Engineering Quote",
      rfq_field_name: "Full Name",
      rfq_field_company: "Company / Architecture Firm",
      rfq_field_phone: "Contact Phone Number",
      rfq_field_system: "Target Architectural System",
      rfq_field_glass: "Glass Processing Specification",
      rfq_field_notes: "Project Scope, Dimensions & Schedule",
      rfq_submit: "Submit RFQ Request",
      rfq_success: "Thank you! Your technical RFQ has been logged. Our engineering team in Tripoli will review your specifications.",

      // 404 Page
      page_404_tag: "Error 404",
      page_404_heading: "Architectural Profile Specification Not Found",
      page_404_desc: "The requested architectural series or technical catalog page could not be located. It may have been reclassified or moved.",
      btn_back_home: "Return to Homepage",
      btn_view_catalog: "Explore Systems Matrix"
    },
    ar: {
      brand_name: "عين زارة",
      brand_tagline: "لمعالجة الزجاج وتصنيع الألمنيوم",
      header_location: "عين زارة، المنطقة الصناعية، طرابلس، ليبيا",
      lang_label: "English",
      lang_short: "EN",
      
      nav_home: "الرئيسية",
      nav_about: "من نحن",
      nav_systems: "الأنظمة المعمارية",
      nav_references: "مشاريعنا",
      nav_contact: "اتصل بنا",
      btn_rfq: "طلب تسعيرة",
      mobile_nav_title: "قائمة التصفح",
      quick_contact: "الاتصال المباشر",
      call_only: "مكالمات فقط",
      line_1_role: "الإدارة والمصنع",
      line_2_role: "المبيعات والمقايسات",
      line_3_role: "المكتب الفني",
      line_4_role: "مكالمات صوتية فقط",
      line_5_role: "خدمة العملاء",
      btn_call: "اتصال",
      btn_call_voice: "اتصال هاتفي",
      btn_download_cad: "تحميل كاد (DWG)",
      btn_download_catalog: "تحميل الكتالوج (PDF)",

      // Drawer Specific Keys
      drawer_explore_series: "7 سلاسل • 14 قطاعاً",
      drawer_matrix_desc: "المواصفات الفنية والقطاعات الكاملة",
      drawer_quick_actions: "إجراءات سريعة",
      drawer_download_catalog: "كتالوج PDF",
      drawer_factory_badge: "مجمع طرابلس الصناعي",
      drawer_factory_hours: "السبت – الخميس: 08:00 – 17:00",
      drawer_more_contacts: "كافة خطوط الإدارات والمصنع",
      drawer_direct_channels: "قنوات الاتصال المباشرة للمصنع",
      drawer_desc_sliding: "سحب ورفع هيدروليكي • مونوريل",
      drawer_desc_door_window: "مفصلي عازل حرارياً • اقتصادي",
      drawer_desc_facade: "واجهات زجاجية هيكلية ونصف هيكلية",
      drawer_desc_folding: "أبواب طي حرارية للمساحات الواسعة",
      drawer_desc_office: "قواطع زجاجية مزدوجة عازلة للصوت",
      drawer_desc_roof: "أسقف قباب وحدائق شتوية معزولة",
      drawer_desc_vertical: "سحب رأسي أوتوماتيكي بمحرك ذكي",

      // Categories
      cat_all: "مصفوفة الأنظمة الكاملة",
      cat_sliding: "أنظمة السحب والجر",
      cat_door_window: "الأبواب والنوافذ",
      cat_facade: "الواجهات الزجاجية",
      cat_folding: "الأبواب القابلة للطي",
      cat_office: "القواطع المكتبية",
      cat_roof: "الأسقف والقباب",
      cat_vertical: "السحب الرأسي (الجلوتين)",

      // Hero
      hero_sub_1: "دقة هندسية عالية في صناعة الألمنيوم والزجاج المعماري",
      hero_title_1: "هندسة صناعية متكاملة للمباني المعمارية الحديثة",
      hero_desc_1: "تصنيع واجهات الألمنيوم المعمارية، وأنظمة السحب ذات العزل الحراري العالي، وخطوط معالجة الزجاج المزدوج العازل بأحدث المعايير القياسية الأوروبية في طرابلس، ليبيا.",
      hero_sub_2: "هندسة الواجهات الهيكلية والزجاج الإنشائي",
      hero_title_2: "واجهات زجاجية هندسية للمشاريع الكبرى والأبراج",
      hero_desc_2: "واجهات كورتن وول نصف هيكلية وهيكلية كاملة معزولة حرارياً ومقاومة لضغط الرياح الشديدة مع تحقيق أعلى درجات العزل الصوتي والتحكم الحراري.",

      // Stats
      stat_val_1: "15,000 م²",
      stat_lbl_1: "الطاقة الإنتاجية السنوية للألمنيوم والزجاج",
      stat_val_2: "0.1 ملم",
      stat_lbl_2: "دقة قص المناشير المزدوجة الرقمية CNC",
      stat_val_3: "100%",
      stat_lbl_3: "حقن غاز الأرجون العازل في الزجاج المزدوج",
      stat_val_4: "+50 مشروع",
      stat_lbl_4: "واجهات تجارية وسكنية منفذة بنجاح",

      // Tech Specs Headers
      spec_frame_depth: "عمق الحلق (الإطار)",
      spec_vent_depth: "عمق الدلفة (الضلفة)",
      spec_glass_thickness: "سماكة الزجاج المدعومة",
      spec_thermal_rating: "العزل الحراري",
      spec_air_water: "مقاومة نفاذية الهواء والماء",
      btn_view_cross_section: "مخطط القطاع الهندسي",
      btn_download_catalog: "تحميل الكتالوج الفني",
      btn_download_cad: "تفاصيل أوتوكاد CAD/DWG",
      btn_3d_view: "ثلاثي الأبعاد 3D",
      btn_exploded_view: "منظور مفكك",
      btn_dimensions: "الأبعاد الهندسية",
      btn_reset_camera: "إعادة الضبط",
      tab_3d_model: "نموذج ثلاثي الأبعاد 3D",
      tab_2d_schematic: "المخطط الهندسي 2D",
      modal_3d_title: "فحص النموذج ثلاثي الأبعاد CAD",
      note_3d_disclaimer: "نموذج ثلاثي أبعاد توضيحي للتصور المعماري • تعتمد القياسات التنفيذية الدقيقة على المخطط الهندسي 2D",

      // Glass Capabilities
      glass_title: "مصنع معالجة وتطوير الزجاج الآلي",
      glass_subtitle: "أحدث أفران السيكوريت (التقسية) الأفقية، وخطوط إنتاج الزجاج المزدوج الأوتوماتيكية، والزجاج المصفح العازل للصوت.",
      glass_cap_1_title: "وحدات الزجاج المزدوج العازل (IGU)",
      glass_cap_1_desc: "وحدات عازلة مزدوجة وثلاثية مزودة بفواصل حرارية حديثة ومواد مانعة للتسرب الهيكلي مع خط حقن آلي لغاز الأرجون بنسبة تتجاوز 90%.",
      glass_cap_2_title: "الزجاج المقسى (سيكوريت) والمصفح",
      glass_cap_2_desc: "زجاج مقسى وفق معايير EN 12150 بضغط سطحي يعادل 5 أضعاف الزجاج العادي، وزجاج مصفح بطبقات PVB لعزل الصوت وحماية فائقة ضد الصدمات حتى 45 ديسيبل.",
      glass_cap_3_title: "طبقات الحماية الشمسية و Low-E",
      glass_cap_3_desc: "طلاءات عاكسة وموفرة للطاقة مخصصة لتخفيض معامل اكتساب الحرارة الشمسية بما يتناسب مع مناخ شمال أفريقيا والبحر المتوسط.",

      // Footer
      footer_about: "شركة عين زارة صرح صناعي رائد في طرابلس، ليبيا، متخصصة في الأنظمة المعمارية للألمنيوم، والواجهات الزجاجية، والأبواب والنوافذ المعزولة حرارياً، ومعالجة الزجاج العازل والمقسى.",
      footer_nav_title: "الشركة",
      footer_systems_title: "الأنظمة المعمارية",
      footer_contact_title: "الاتصال المباشر",
      copyright_rights: "جميع الحقوق محفوظة. تصنيع الألمنيوم ومعالجة الزجاج المعماري.",
      location_tripoli: "طرابلس، ليبيا",

      // RFQ Modal
      rfq_modal_title: "طلب تسعيرة هندسية",
      rfq_field_name: "الاسم الكامل",
      rfq_field_company: "اسم الشركة / المكتب الهندسي",
      rfq_field_phone: "رقم هاتف التواصل",
      rfq_field_system: "النظام المعماري المطلوب",
      rfq_field_glass: "مواصفات الزجاج المطلوبة",
      rfq_field_notes: "تفاصيل المشروع، الأبعاد والمخططات",
      rfq_submit: "إرسال طلب التسعيرة",
      rfq_success: "شكراً لتواصلكم! تم استلام طلب التسعيرة وسيقوم الفريق الهندسي في طرابلس بدراسة المواصفات والتواصل معكم.",

      // 404 Page
      page_404_tag: "خطأ 404",
      page_404_heading: "مواصفات النظام المعماري غير متوفرة",
      page_404_desc: "الصفحة أو مواصفات النظام المعماري المطلوبة غير موجودة أو تم نقلها.",
      btn_back_home: "العودة إلى الصفحة الرئيسية",
      btn_view_catalog: "تصفح مصفوفة الأنظمة"
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // Manage rtl.css stylesheet link in head
    let rtlLink = document.getElementById(RTL_CSS_ID);
    if (isRtl) {
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.id = RTL_CSS_ID;
        rtlLink.rel = 'stylesheet';
        rtlLink.href = RTL_CSS_PATH;
        document.head.appendChild(rtlLink);
      }
    } else {
      if (rtlLink) {
        rtlLink.remove();
      }
    }

    // Update Language Toggle Button Labels everywhere
    document.querySelectorAll('.lang-label, .drawer-lang-label').forEach(el => {
      el.textContent = TRANSLATIONS[lang].lang_label;
    });
    document.querySelectorAll('.lang-short-label').forEach(el => {
      el.textContent = TRANSLATIONS[lang].lang_short;
    });

    // Translate all elements with data-i18n
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });

    // Translate placeholders
    const placeholderElems = document.querySelectorAll('[data-i18n-placeholder]');
    placeholderElems.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
      }
    });

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(nextLang);
  }

  // Global event delegation for language buttons (works across desktop, mobile bar, and drawer)
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.lang-toggle-btn, #lang-toggle-btn');
    if (btn) {
      e.preventDefault();
      toggleLanguage();
    }
  });

  // Re-apply on DOM ready and dynamic components
  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
  });

  document.addEventListener('headerLoaded', () => {
    applyLanguage(currentLang);
  });

  document.addEventListener('footerLoaded', () => {
    applyLanguage(currentLang);
  });

  // Expose API
  window.AinZaraI18n = {
    getLang: () => currentLang,
    setLang: applyLanguage,
    toggle: toggleLanguage,
    t: (key) => (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key
  };
})();
