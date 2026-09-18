/**
 * AinZara-Aluminum Main Application Script
 * Lifecycle, RFQ Modal, Cross-Section Lightbox Visualizer, Hero Slider, Download Center
 */

(function () {
  'use strict';

  // System Catalog Matrix Data matching exact files
  const SYSTEM_CATALOG = {
    "wa45": {
      id: "wa45",
      name: "WA 45",
      series: "HEKLA Series",
      category: "door-window",
      titleEn: "WA 45 Non-Thermal Economic Casement",
      titleAr: "نظام WA 45 الاقتصادي للنوافذ والأبواب",
      img: "assets/Door-Window/wa45.jpg",
      frameDepth: "45 mm",
      ventDepth: "53 mm",
      glassRange: "4 mm – 24 mm",
      insulation: "Non-Insulated (Standard Perimeter EPDM)",
      airWater: "Class 3 (Air) / Class 4A (Water)",
      descEn: "Cost-effective, versatile aluminum casement system engineered for interior partitions, exterior windows, and residential doors with durable mechanical corner joints.",
      descAr: "نظام ألمنيوم اقتصادي عالي المتانة للأبواب والنوافذ المفصلية والقواطع الداخلية مع زوايا تجميع ميكانيكية قوية وحشيات EPDM مانعة لتسرب الغبار."
    },
    "wa55": {
      id: "wa55",
      name: "WA 55",
      series: "HEKLA Series",
      category: "door-window",
      titleEn: "WA 55 Architectural Standard Casement",
      titleAr: "نظام WA 55 المعماري القياسي",
      img: "assets/Door-Window/wa55.jpg",
      frameDepth: "55 mm",
      ventDepth: "63 mm",
      glassRange: "4 mm – 32 mm",
      insulation: "Acoustic EPDM Perimeter Gaskets",
      airWater: "Class 4 (Air) / Class 7A (Water)",
      descEn: "Standard heavy-gauge casement system optimized for commercial residential applications, tilt-and-turn windows, and heavy duty outward opening entrance doors.",
      descAr: "نظام مفصلي متطور بسماكة عالية للأبواب والنوافذ القلابة والمفصلية، يوفر حماية فائقة ضد الرياح ويدعم الزجاج المزدوج العازل حتى 32 ملم."
    },
    "wat63": {
      id: "wat63",
      name: "WAT 63",
      series: "HEKLA Series",
      category: "door-window",
      titleEn: "WAT 63 Thermal Break Heavy-Duty",
      titleAr: "نظام WAT 63 العازل للحرارة (ثيرمال بريك)",
      img: "assets/Door-Window/wat63.jpg",
      frameDepth: "63 mm",
      ventDepth: "71 mm",
      glassRange: "20 mm – 42 mm IGU",
      insulation: "24 mm Polyamide Thermal Barrier (Uf = 2.2 W/m²K)",
      airWater: "Class 4 (Air) / Class 9A (Water 600 Pa)",
      descEn: "High-performance thermal break architectural system engineered with 24mm polyamide insulation bars, multi-chamber design, and multi-point perimeter locking for extreme acoustic and thermal efficiency.",
      descAr: "نظام معماري معزول حرارياً بأحدث قضبان البولي أميد سعة 24 ملم، متعدد الحجرات الهندسية لمنع التكثف وتوفير أقصى عزل صوتي وحراري للمباني الفاخرة."
    },
    "CWA50HV": {
      id: "CWA50HV",
      name: "CWA 50 HV",
      series: "BROMO Series",
      category: "facade",
      titleEn: "CWA 50 HV Semi-Structural Curtain Wall",
      titleAr: "نظام CWA 50 HV للواجهات الزجاجية شبه الهيكلية",
      img: "assets/Facade/CWA50HV.jpg",
      frameDepth: "50 mm Face Width / 80 – 180 mm Mullion",
      ventDepth: "Concealed Vent Profile (HV)",
      glassRange: "24 mm – 40 mm IGU",
      insulation: "Continuous EPDM Isolator & Thermal Core",
      airWater: "Class AE (Air) / Class RE 1200 (Water 1200 Pa)",
      descEn: "Curtain wall facade with horizontal and vertical capped profiles or concealed operable sashes (HV), designed for maximum structural wind load resistance in high-rise buildings.",
      descAr: "واجهة زجاجية ستائرية بعوارض رأسية وأفقية مع إمكانية دمج فتحات تهوية مخفية تماماً من الخارج، معزولة حرارياً ومقاومة لضغط الرياح العالي في المباني المرتفعة."
    },
    "CWA50sg": {
      id: "CWA50sg",
      name: "CWA 50 SG",
      series: "BROMO Series",
      category: "facade",
      titleEn: "CWA 50 SG Structural Glazing Facade",
      titleAr: "نظام CWA 50 SG للواجهات الهيكلية بالسيليكون الإنشائي",
      img: "assets/Facade/CWA50sg.jpg",
      frameDepth: "50 mm Face Width / 100 – 220 mm Mullion",
      ventDepth: "Structural Silicone Glazed Vent",
      glassRange: "28 mm – 48 mm Double/Triple IGU",
      insulation: "Thermal Polyamide Block & Structural Spacer",
      airWater: "Class AE (Air) / Class RE 1500 (Water 1500 Pa)",
      descEn: "All-glass flush exterior appearance with structural silicone bonding. Seamless modern aesthetic without visible exterior aluminum caps, engineered for premier corporate headquarters.",
      descAr: "واجهة زجاجية هيكلية بالكامل بدون أي بروز خارجي للألمنيوم مع تثبيت الزجاج عبر السيليكون الإنشائي عالي المقاومة، تمنح المبنى مظهراً زجاجياً متصلاً وعصرياً."
    },
    "fat55": {
      id: "fat55",
      name: "FAT 55",
      series: "NEPAL Series",
      category: "folding",
      titleEn: "FAT 55 Bi-Fold Insulated Door System",
      titleAr: "نظام FAT 55 للأبواب القابلة للطي (أكورديون)",
      img: "assets/Folding-Door/fat55.jpg",
      frameDepth: "55 mm",
      ventDepth: "55 mm",
      glassRange: "6 mm – 28 mm",
      insulation: "Polyamide Thermal Barrier & Double Weatherstrip",
      airWater: "Class 3 (Air) / Class 5A (Water)",
      descEn: "Heavy-duty bi-fold sliding doors enabling panoramic open spans up to 7 panels. Stainless steel top and bottom carriage rollers ensure effortless, whisper-quiet operation.",
      descAr: "أبواب سحب قابلة للطي حتى 7 أضلاف لفتح المساحات بالكامل على الحدائق والتراسات، مدعمة بعجلات وعوارض سفلية وعلوية من الستانلس ستيل لسهولة الحركة."
    },
    "fat70": {
      id: "fat70",
      name: "FAT 70",
      series: "NEPAL Series",
      category: "folding",
      titleEn: "FAT 70 Heavy-Duty Thermal Break Bi-Fold",
      titleAr: "نظام FAT 70 العازل حرارياً للأبواب القابلة للطي",
      img: "assets/Folding-Door/fat70.jpg",
      frameDepth: "70 mm",
      ventDepth: "70 mm",
      glassRange: "24 mm – 44 mm IGU",
      insulation: "30 mm Polyamide Barrier (Uf = 1.9 W/m²K)",
      airWater: "Class 4 (Air) / Class 8A (Water)",
      descEn: "Reinforced thermal break folding system designed for heavy commercial entrances, showrooms, and villas requiring exceptional energy insulation and wind resistance.",
      descAr: "نظام طي ثقيل معزول حرارياً بقضبان بولي أميد 30 ملم، مخصص للمباني الفاخرة والمعارض الكبرى مع أقفال متعددة النقاط لتحقيق أقصى درجات الأمان والعزل."
    },
    "ipa30": {
      id: "ipa30",
      name: "IPA 30",
      series: "IDA Series",
      category: "office",
      titleEn: "IPA 30 Slim Line Office Partition",
      titleAr: "نظام IPA 30 للقواطع المكتبية النحيفة",
      img: "assets/Office/ipa30.jpg",
      frameDepth: "30 mm",
      ventDepth: "Slimline 30 mm Flush Door",
      glassRange: "8 mm – 12 mm Monolithic Tempered",
      insulation: "Acoustic Gasketing (Up to 34 dB sound reduction)",
      airWater: "Interior Architectural Standard",
      descEn: "Ultra-minimalist architectural interior partition system with 30mm profile face width, maximizing daylight penetration across modern corporate office environments.",
      descAr: "نظام قواطع داخلية نحيف جداً بعرض 30 ملم فقط للمكاتب والشركات، يتيح نفاذ الضوء بالكامل مع توفير خصوصية وعزل صوتي حتى 34 ديسيبل."
    },
    "ipa45": {
      id: "ipa45",
      name: "IPA 45",
      series: "IDA Series",
      category: "office",
      titleEn: "IPA 45 Acoustic Double-Glass Partition",
      titleAr: "نظام IPA 45 للقواطع المكتبية المزدوجة العازلة للصوت",
      img: "assets/Office/ipa45.jpg",
      frameDepth: "45 mm / 100 mm System Cavity",
      ventDepth: "Double Glazed Acoustic Vent",
      glassRange: "Dual 6 mm – 10 mm with air cavity / blinds",
      insulation: "High Acoustic Rating (Up to 45 dB reduction)",
      airWater: "Interior High-Acoustic Standard",
      descEn: "Engineered double-glazed office partition system accommodating motorized integrated micro-blinds, concealed electrical channels, and superior acoustic privacy for conference rooms.",
      descAr: "قواطع مكتبية مزدوجة متطورة تدعم تركيب ستائر مدمجة داخلية مع مسارات تمديدات كهربائية مخفية وعزل صوتي فائق يصل إلى 45 ديسيبل لقاعات الاجتماعات."
    },
    "sa65": {
      id: "sa65",
      name: "SA 65",
      series: "URAL Series",
      category: "roof",
      titleEn: "SA 65 Skylight & Veranda Roof System",
      titleAr: "نظام SA 65 للقباب والأسقف الزجاجية",
      img: "assets/Roof/sa65.jpg",
      frameDepth: "65 mm Face Width / 100 – 160 mm Rafter",
      ventDepth: "Integrated Roof Skylight Vent",
      glassRange: "24 mm – 38 mm Laminated Safety IGU",
      insulation: "Continuous Internal EPDM Drainage & Thermal Barrier",
      airWater: "Class 4 (Air) / Class E1200 (Water 1200 Pa)",
      descEn: "Structural architectural roof system featuring integrated multi-tier condensation drainage channels and heavy structural rafters capable of spanning large glass atrium roofs.",
      descAr: "نظام هندسي للأسقف والقباب الزجاجية مزود بمسارات داخلية متقدمة لتصريف مياه التكثف وعوارض ألمنيوم قوية لتغطية المساحات الكبيرة والبهو التجاري."
    },
    "sa65-2": {
      id: "sa65-2",
      name: "SA 65-2",
      series: "URAL Series",
      category: "roof",
      titleEn: "SA 65-2 Reinforced Wintergarden Glass Roof",
      titleAr: "نظام SA 65-2 المدعم للحدائق الشتوية والأسقف المعمارية",
      img: "assets/Roof/sa65-2.jpg",
      frameDepth: "65 mm Profile / Steel Reinforced Rafters",
      ventDepth: "Motorized Roof Ventilation Compatible",
      glassRange: "28 mm – 44 mm Solar Control Stepped IGU",
      insulation: "Heavy-Duty Thermal Core & Gasket Barrier",
      airWater: "Class 4 (Air) / Class E1500 (Water 1500 Pa)",
      descEn: "Heavy-duty reinforced wintergarden roof system designed for large commercial enclosures, verandas, and luxury residential sunrooms with integrated gutter profiles.",
      descAr: "نظام أسقف معمارية مدعم بحديد مقلفن داخلي ومزاريب تصريف أمطار مدمجة، مخصص للحدائق الشتوية وتغطيات حمامات السباحة والأسطح التجارية."
    },
    "sat120": {
      id: "sat120",
      name: "SAT 120",
      series: "ARTOS Series",
      category: "sliding",
      titleEn: "SAT 120 Lift & Slide Heavy Duty System",
      titleAr: "نظام SAT 120 للرفع والسحب الثقيل (لفت آند سلايد)",
      img: "assets/Sliding/sat120.jpg",
      frameDepth: "120 mm (2-Rail) / 185 mm (3-Rail)",
      ventDepth: "50 mm",
      glassRange: "24 mm – 38 mm IGU",
      insulation: "20 mm Polyamide Thermal Break",
      airWater: "Class 4 (Air) / Class 9A (Water)",
      descEn: "Premier lift-and-slide architectural system engineered for oversized sliding glass panels up to 300 kg per sash. Effortless lift mechanism creates an airtight gasket seal when lowered.",
      descAr: "النظام المعماري الأول لرفع وسحب الأبواب الزجاجية العملاقة حتى وزن 300 كجم للدلفة الواحدة مع إحكام إغلاق تام ومانع لنفاذ الماء والهواء عند نزول الدلفة."
    },
    "slat64": {
      id: "slat64",
      name: "SLAT 64",
      series: "ARTOS Series",
      category: "sliding",
      titleEn: "SLAT 64 Thermal Monorail / Multi-Rail Sliding",
      titleAr: "نظام SLAT 64 المعزول حرارياً للسحب متعدد المسارات",
      img: "assets/Sliding/slat64.jpg",
      frameDepth: "64 mm Frame Width",
      ventDepth: "38 mm",
      glassRange: "18 mm – 28 mm IGU",
      insulation: "Polyamide Thermal Break with Stainless Steel Rail",
      airWater: "Class 3 (Air) / Class 6A (Water)",
      descEn: "High-efficiency insulated sliding system equipped with replaceable stainless steel track rails, multi-point locking, and flyscreen rail integration for residential living spaces.",
      descAr: "نظام سحب معزول حرارياً مزود بمسار ستانلس ستيل فائق السلاسة، يدعم مسارات متعددة لشبك الحشرات وأقفال أمان متعددة النقاط للشقق والفلل السكنية."
    },
    "gsa130": {
      id: "gsa130",
      name: "GSA 130",
      series: "LOGAN Series",
      category: "vertical",
      titleEn: "GSA 130 Guillotine Motorized Vertical Sliding",
      titleAr: "نظام GSA 130 للسحب الرأسي الآلي (الجلوتين)",
      img: "assets/Vertical-Sliding/gsa130.jpg",
      frameDepth: "130 mm",
      ventDepth: "40 mm Sash Frame",
      glassRange: "8 mm Tempered to 20 mm Insulated",
      insulation: "Dual Brush Seals & Perimeter Gasket",
      airWater: "Wind Load Resistance Class 4",
      descEn: "Motorized vertical sliding guillotine system with smart remote control and heavy-duty steel wire belts. Bottom fixed glass pane doubles as a protective architectural balustrade.",
      descAr: "نظام زجاجي متحرك رأسياً بمحركات سومفي الذكية وأحزمة فولاذية، تعمل الدلفة السفلية الثابتة كدرابزين زجاجي آمن عند فتح الأجزاء العلوية للمطاعم والتراسات."
    }
  };

  // 1. Hero Slider
  function initHeroSlider() {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');
    const prevBtn = document.getElementById('hero-prev');
    const nextBtn = document.getElementById('hero-next');

    if (!slides.length) return;

    let current = 0;
    let timer = null;

    function showSlide(index) {
      slides.forEach((s, i) => {
        s.classList.toggle('active', i === index);
      });
      dots.forEach((d, i) => {
        d.classList.toggle('active', i === index);
      });
      current = index;
    }

    function nextSlide() {
      showSlide((current + 1) % slides.length);
    }

    function prevSlide() {
      showSlide((current - 1 + slides.length) % slides.length);
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        showSlide(i);
        resetTimer();
      });
    });

    function startTimer() {
      timer = setInterval(nextSlide, 6500);
    }

    function resetTimer() {
      clearInterval(timer);
      startTimer();
    }

    startTimer();
  }

  // 2. Lightbox Cross-Section Visualizer
  let currentZoom = 1;

  function openLightbox(systemKey) {
    const data = SYSTEM_CATALOG[systemKey];
    if (!data) return;

    const modal = document.getElementById('lightbox-modal');
    const img = document.getElementById('lightbox-img');
    const title = document.getElementById('lightbox-title');
    const series = document.getElementById('lightbox-series');
    const specsContainer = document.getElementById('lightbox-specs');

    if (!modal || !img) return;

    const lang = window.AinZaraI18n ? window.AinZaraI18n.getLang() : 'en';

    img.src = data.img;
    img.alt = data.name + ' Cross Section';
    currentZoom = 1;
    img.style.transform = `scale(${currentZoom})`;

    if (title) title.textContent = (lang === 'ar' ? data.titleAr : data.titleEn);
    if (series) series.textContent = data.series;

    if (specsContainer) {
      const t = (key) => window.AinZaraI18n ? window.AinZaraI18n.t(key) : key;
      specsContainer.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; font-size: 0.8125rem;">
          <div><strong>${t('spec_frame_depth')}:</strong> ${data.frameDepth}</div>
          <div><strong>${t('spec_vent_depth')}:</strong> ${data.ventDepth}</div>
          <div><strong>${t('spec_glass_thickness')}:</strong> ${data.glassRange}</div>
          <div><strong>${t('spec_thermal_rating')}:</strong> ${data.insulation}</div>
          <div><strong>${t('spec_air_water')}:</strong> ${data.airWater}</div>
        </div>
      `;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    const modal = document.getElementById('lightbox-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initLightboxControls() {
    const modal = document.getElementById('lightbox-modal');
    const closeBtn = document.getElementById('lightbox-close');
    const zoomInBtn = document.getElementById('lightbox-zoom-in');
    const zoomOutBtn = document.getElementById('lightbox-zoom-out');
    const zoomResetBtn = document.getElementById('lightbox-zoom-reset');
    const img = document.getElementById('lightbox-img');

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeLightbox();
      });
    }

    if (zoomInBtn && img) {
      zoomInBtn.addEventListener('click', () => {
        currentZoom = Math.min(currentZoom + 0.25, 3.0);
        img.style.transform = `scale(${currentZoom})`;
      });
    }

    if (zoomOutBtn && img) {
      zoomOutBtn.addEventListener('click', () => {
        currentZoom = Math.max(currentZoom - 0.25, 0.75);
        img.style.transform = `scale(${currentZoom})`;
      });
    }

    if (zoomResetBtn && img) {
      zoomResetBtn.addEventListener('click', () => {
        currentZoom = 1;
        img.style.transform = `scale(1)`;
      });
    }

    // Attach click triggers to any card element with data-system-id
    document.querySelectorAll('[data-lightbox-system]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const sysId = el.getAttribute('data-lightbox-system');
        openLightbox(sysId);
      });
    });
  }

  // 3. RFQ Modal Management
  function openRfqModal(preselectedSystem) {
    const modal = document.getElementById('rfq-modal');
    if (!modal) return;

    if (preselectedSystem) {
      const select = document.getElementById('rfq-system-select');
      if (select) select.value = preselectedSystem;
    }

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeRfqModal() {
    const modal = document.getElementById('rfq-modal');
    if (modal) modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function initRfqModal() {
    const modal = document.getElementById('rfq-modal');
    const closeBtn = document.getElementById('rfq-modal-close');
    const form = document.getElementById('rfq-form');

    if (closeBtn) closeBtn.addEventListener('click', closeRfqModal);
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) closeRfqModal();
      });
    }

    // Global delegation for any RFQ open buttons (including dynamic header buttons)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-rfq, [data-action="open-rfq"]');
      if (btn) {
        e.preventDefault();
        const sysId = btn.getAttribute('data-system');
        openRfqModal(sysId || null);
      }
    });

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = window.AinZaraI18n ? window.AinZaraI18n.t('rfq_success') : 'Thank you! Your quote request has been received.';
        alert(msg);
        form.reset();
        closeRfqModal();
      });
    }
  }

  // 4. Download Center Triggers
  function initDownloadTriggers() {
    document.querySelectorAll('[data-download-catalog]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sysName = btn.getAttribute('data-download-catalog') || 'AinZara_Technical_Catalog';
        const lang = window.AinZaraI18n ? window.AinZaraI18n.getLang() : 'en';
        const msg = lang === 'ar' 
          ? `جاري تجهيز الكتالوج الفني الهندسي لنظام [${sysName}]... تم بدء التحميل.`
          : `Preparing technical engineering spec catalog for [${sysName}]... Download started.`;
        alert(msg);
      });
    });

    document.querySelectorAll('[data-download-cad]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sysName = btn.getAttribute('data-download-cad') || 'AinZara_CAD_Profile';
        const lang = window.AinZaraI18n ? window.AinZaraI18n.getLang() : 'en';
        const msg = lang === 'ar' 
          ? `جاري تحميل حزمة ملفات الأوتوكاد (DWG / DXF) لنظام [${sysName}].`
          : `Downloading AutoCAD (DWG / DXF) CAD cross-section package for [${sysName}].`;
        alert(msg);
      });
    });
  }

  // 5. Products Page Filter Tabs
  function initProductFilter() {
    const tabs = document.querySelectorAll('.catalog-tab-btn');
    const cards = document.querySelectorAll('[data-product-category]');

    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const cat = tab.getAttribute('data-filter');
        cards.forEach(card => {
          const itemCat = card.getAttribute('data-product-category');
          if (cat === 'all' || itemCat === cat) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  // Boot Application
  function boot() {
    initHeroSlider();
    initLightboxControls();
    initRfqModal();
    initDownloadTriggers();
    initProductFilter();
  }

  document.addEventListener('DOMContentLoaded', boot);

  // Expose global API
  window.AinZaraApp = {
    catalog: SYSTEM_CATALOG,
    openLightbox: openLightbox,
    closeLightbox: closeLightbox,
    openRfqModal: openRfqModal,
    closeRfqModal: closeRfqModal
  };
})();
