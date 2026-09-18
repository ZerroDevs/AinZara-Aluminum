/**
 * AinZara-Aluminum - Centralized Technical Resource & BIM/CAD Library
 * Interactive Search, Category Filters, Format Toggles, Language-Aware PDF Downloads, and 3D Inspection
 */

(function () {
  'use strict';

  // System Matrix Metadata
  const SYSTEMS_ORDER = [
    'sat120', 'slat64', 'wat63', 'wa55', 'wa45',
    'CWA50HV', 'CWA50sg', 'fat70', 'fat55',
    'ipa45', 'ipa30', 'sa65', 'sa65-2', 'gsa130'
  ];

  let currentCategory = 'all';
  let currentFormat = 'all';
  let currentSearch = '';

  // Get localized language
  function getLang() {
    return (window.AinZaraI18n && typeof window.AinZaraI18n.getLang === 'function')
      ? window.AinZaraI18n.getLang()
      : (localStorage.getItem('ainzara_lang') || 'en');
  }

  // Translate helper
  function t(key) {
    return (window.AinZaraI18n && typeof window.AinZaraI18n.t === 'function')
      ? window.AinZaraI18n.t(key)
      : key;
  }

  // Resolve catalog data
  function getCatalog() {
    if (window.AinZaraApp && window.AinZaraApp.catalog) {
      return window.AinZaraApp.catalog;
    }
    return {};
  }

  // Render all systems into the library container
  function renderSystemsGrid() {
    const container = document.getElementById('downloads-systems-grid');
    if (!container) return;

    const catalog = getCatalog();
    const lang = getLang();
    const isAr = lang === 'ar';

    const query = currentSearch.toLowerCase().trim();
    let visibleSystems = 0;
    let totalAssetsCount = 0;

    let html = '';

    SYSTEMS_ORDER.forEach(sysId => {
      const sys = catalog[sysId];
      if (!sys) return;

      // Category matching
      const matchesCat = currentCategory === 'all' || sys.category === currentCategory;

      // Format matching (if format is 'cert', we hide system cards and show certs section)
      let matchesFmt = true;
      if (currentFormat === 'cert') {
        matchesFmt = false;
      }

      // Search matching
      let matchesSearch = true;
      if (query) {
        const haystacks = [
          sys.id,
          sys.name,
          sys.series,
          sys.category,
          sys.titleEn,
          sys.titleAr,
          sys.descEn,
          sys.descAr,
          sys.frameDepth,
          sys.ventDepth,
          sys.glassRange,
          sys.insulation,
          sys.airWater
        ].map(s => (s || '').toLowerCase());

        matchesSearch = haystacks.some(h => h.includes(query));
      }

      const isVisible = matchesCat && matchesFmt && matchesSearch;

      if (isVisible) {
        visibleSystems++;
        // 5 technical assets per system: PDF, DWG, DXF, IFC, Solid 3D DXF
        totalAssetsCount += 5;
      }

      // File URLs & Download Filenames
      const pdfHref = isAr
        ? `assets/downloads/pdf/${sys.id}-technical-sheet-ar.pdf`
        : `assets/downloads/pdf/${sys.id}-technical-sheet.pdf`;
      const pdfFilename = isAr
        ? `AinZara_${sys.name.replace(/\s+/g, '_')}_Technical_Sheet_AR.pdf`
        : `AinZara_${sys.name.replace(/\s+/g, '_')}_Technical_Sheet.pdf`;

      const dwgHref = `assets/downloads/cad/${sys.id}-cad-profile.dwg`;
      const dwgFilename = `AinZara_${sys.name.replace(/\s+/g, '_')}_2D_AutoCAD.dwg`;

      const dxfHref = `assets/downloads/cad/${sys.id}-cad-profile.dxf`;
      const dxfFilename = `AinZara_${sys.name.replace(/\s+/g, '_')}_2D_Vector.dxf`;

      const ifcHref = `assets/downloads/bim/${sys.id}-bim-profile.ifc`;
      const ifcFilename = `AinZara_${sys.name.replace(/\s+/g, '_')}_BIM_Object.ifc`;

      const solidDxfHref = `assets/downloads/bim/${sys.id}-solid-3d.dxf`;
      const solidDxfFilename = `AinZara_${sys.name.replace(/\s+/g, '_')}_3D_Solid.dxf`;

      const title = isAr ? sys.titleAr : sys.titleEn;
      const desc = isAr ? sys.descAr : sys.descEn;

      // Card display styling
      const displayStyle = isVisible ? 'display: flex;' : 'display: none;';

      html += `
        <div class="dl-system-card ${currentFormat !== 'all' ? 'fmt-filtered fmt-' + currentFormat : ''}" data-system-id="${sys.id}" data-category="${sys.category}" style="${displayStyle}">
          <!-- Card Header Banner -->
          <div class="dl-card-header">
            <div class="dl-card-identity">
              <span class="dl-series-tag">${sys.series}</span>
              <h3 class="dl-system-code">${sys.name}</h3>
              <div class="dl-system-title">${title}</div>
            </div>
            <div class="dl-badge-category">${getCategoryLabel(sys.category, isAr)}</div>
          </div>

          <!-- Card Body: Media & Specs -->
          <div class="dl-card-body">
            <div class="dl-card-media" data-open-3d="${sys.id}" title="Click to view in 3D">
              <img src="${sys.img}" alt="${sys.name} Cross-Section CAD" class="dl-media-img" loading="lazy">
              <div class="dl-media-overlay">
                <button type="button" class="btn-3d-pulse" data-open-3d="${sys.id}">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 2l9 4.9V17L12 22l-9-5V6.9L12 2z"/><path d="M12 22V12"/><path d="M21 7l-9 5-9-5"/></svg>
                  <span>${t('dl_btn_inspect_3d')}</span>
                </button>
              </div>
            </div>

            <div class="dl-card-specs">
              <div class="dl-spec-item">
                <span class="dl-spec-lbl">${t('spec_frame_depth')}</span>
                <span class="dl-spec-val">${sys.frameDepth}</span>
              </div>
              <div class="dl-spec-item">
                <span class="dl-spec-lbl">${t('spec_vent_depth')}</span>
                <span class="dl-spec-val">${sys.ventDepth}</span>
              </div>
              <div class="dl-spec-item">
                <span class="dl-spec-lbl">${t('spec_glass_thickness')}</span>
                <span class="dl-spec-val">${sys.glassRange}</span>
              </div>
              <div class="dl-spec-item">
                <span class="dl-spec-lbl">${t('spec_thermal_rating')}</span>
                <span class="dl-spec-val">${sys.insulation}</span>
              </div>
              <div class="dl-spec-item">
                <span class="dl-spec-lbl">${t('spec_air_water')}</span>
                <span class="dl-spec-val">${sys.airWater}</span>
              </div>
            </div>
          </div>

          <!-- Downloads Asset Bar -->
          <div class="dl-card-downloads">
            <div class="dl-download-group-title">${t('dl_tech_files_title')}</div>
            <div class="dl-download-buttons-grid">
              <!-- 1. PDF Tech Sheet -->
              <a href="${pdfHref}" download="${pdfFilename}" target="_blank" class="dl-file-btn btn-pdf ${currentFormat === 'pdf' ? 'highlight-active' : ''}" title="Download bilingual technical data sheet">
                <div class="dl-btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_pdf')}</span>
                  <span class="dl-btn-meta">PDF • ${isAr ? 'العربية' : 'English'}</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>

              <!-- 2. AutoCAD DWG -->
              <a href="${dwgHref}" download="${dwgFilename}" target="_blank" class="dl-file-btn btn-cad ${currentFormat === 'cad' ? 'highlight-active' : ''}" title="AutoCAD 2D manufacturing profile">
                <div class="dl-btn-icon cad-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_dwg')}</span>
                  <span class="dl-btn-meta">2D CAD • DWG</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>

              <!-- 3. CAD DXF -->
              <a href="${dxfHref}" download="${dxfFilename}" target="_blank" class="dl-file-btn btn-dxf ${currentFormat === 'cad' ? 'highlight-active' : ''}" title="Open-format vector CAD drawing">
                <div class="dl-btn-icon dxf-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_dxf')}</span>
                  <span class="dl-btn-meta">Vector CAD • DXF</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>

              <!-- 4. BIM IFC -->
              <a href="${ifcHref}" download="${ifcFilename}" target="_blank" class="dl-file-btn btn-bim ${currentFormat === 'bim' ? 'highlight-active' : ''}" title="Revit / ArchiCAD Open-BIM profile file">
                <div class="dl-btn-icon bim-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_bim')}</span>
                  <span class="dl-btn-meta">Revit / IFC • 3D BIM</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>

              <!-- 5. 3D Solid DXF -->
              <a href="${solidDxfHref}" download="${solidDxfFilename}" target="_blank" class="dl-file-btn btn-solid ${currentFormat === 'bim' ? 'highlight-active' : ''}" title="3D Solid extruded profile geometry">
                <div class="dl-btn-icon solid-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_3d_dxf')}</span>
                  <span class="dl-btn-meta">Solid Mesh • 3D DXF</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              </a>

              <!-- 6. 3D Viewer Launch -->
              <button type="button" class="dl-file-btn btn-viewer-launch" data-open-3d="${sys.id}" title="Launch Interactive 3D CAD WebGL Model">
                <div class="dl-btn-icon viewer-accent">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polygon points="10 8 16 12 10 16 10 8"></polygon></svg>
                </div>
                <div class="dl-btn-content">
                  <span class="dl-btn-name">${t('dl_btn_inspect_3d')}</span>
                  <span class="dl-btn-meta">WebGL CAD Studio</span>
                </div>
                <svg class="dl-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
              </button>
            </div>

            <!-- Footer Action Row: RFQ Direct Request -->
            <div class="dl-card-footer-row">
              <button type="button" class="btn btn-primary btn-sm dl-quote-btn" onclick="window.AinZaraApp.openRfqModal('${sys.id}')">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>
                <span>${t('btn_rfq')}</span>
              </button>
            </div>
          </div>
        </div>
      `;
    });

    // Empty state if no results
    if (visibleSystems === 0 && currentFormat !== 'cert') {
      html = `
        <div class="dl-empty-state">
          <div class="dl-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          </div>
          <h3>${t('dl_no_results')}</h3>
          <button type="button" class="btn btn-outline btn-sm" id="btn-reset-filters">Clear Search & Filters</button>
        </div>
      `;
    }

    container.innerHTML = html;

    // Update Counter Banner
    updateCountsBanner(visibleSystems, totalAssetsCount);

    // Reset button listener
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentCategory = 'all';
        currentFormat = 'all';
        currentSearch = '';
        const searchInput = document.getElementById('dl-search-input');
        if (searchInput) searchInput.value = '';

        document.querySelectorAll('.dl-cat-pill').forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-cat') === 'all');
        });
        document.querySelectorAll('.dl-fmt-pill').forEach(p => {
          p.classList.toggle('active', p.getAttribute('data-fmt') === 'all');
        });
        renderSystemsGrid();
      });
    }

    // Toggle certificates section visibility if format is 'cert'
    const certsSection = document.getElementById('dl-certificates-section');
    if (certsSection) {
      if (currentFormat === 'cert' || currentCategory === 'certificates') {
        certsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  // Update counts badge
  function updateCountsBanner(sysCount, assetCount) {
    const counterEl = document.getElementById('dl-live-count');
    if (!counterEl) return;

    const lang = getLang();
    const isAr = lang === 'ar';

    if (isAr) {
      counterEl.innerHTML = `عرض <strong>${sysCount}</strong> أنظمة معمارية (<strong>${assetCount}</strong> ملفاً هندسياً متاحاً للتحميل المباشر)`;
    } else {
      counterEl.innerHTML = `Showing <strong>${sysCount}</strong> architectural systems (<strong>${assetCount}</strong> production engineering assets ready for download)`;
    }
  }

  function getCategoryLabel(cat, isAr) {
    const labels = {
      'sliding': isAr ? 'سحب وجر (ARTOS)' : 'Sliding (ARTOS)',
      'door-window': isAr ? 'أبواب ونوافذ (HEKLA)' : 'Doors & Windows (HEKLA)',
      'facade': isAr ? 'واجهات ستائرية (BROMO)' : 'Curtain Wall (BROMO)',
      'folding': isAr ? 'أبواب طي (NEPAL)' : 'Folding Doors (NEPAL)',
      'office': isAr ? 'قواطع مكتبية (IDA)' : 'Office Partitions (IDA)',
      'roof': isAr ? 'أسقف وقباب (URAL)' : 'Skylight & Roof (URAL)',
      'vertical': isAr ? 'سحب رأسي (LOGAN)' : 'Guillotine Vertical (LOGAN)'
    };
    return labels[cat] || cat;
  }

  // Bind UI Controls
  function initControls() {
    // 1. Search input
    const searchInput = document.getElementById('dl-search-input');
    if (searchInput) {
      let debounceTimer = null;
      searchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
          currentSearch = e.target.value;
          renderSystemsGrid();
        }, 150);
      });
    }

    // 2. Category Filter Pills
    const catPills = document.querySelectorAll('.dl-cat-pill');
    catPills.forEach(pill => {
      pill.addEventListener('click', () => {
        catPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const cat = pill.getAttribute('data-cat');
        currentCategory = cat;

        if (cat === 'certificates') {
          const certsSec = document.getElementById('dl-certificates-section');
          if (certsSec) {
            certsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } else {
          renderSystemsGrid();
        }
      });
    });

    // 3. Format Filter Pills
    const fmtPills = document.querySelectorAll('.dl-fmt-pill');
    fmtPills.forEach(pill => {
      pill.addEventListener('click', () => {
        fmtPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const fmt = pill.getAttribute('data-fmt');
        currentFormat = fmt;

        if (fmt === 'cert') {
          const certsSec = document.getElementById('dl-certificates-section');
          if (certsSec) {
            certsSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
        renderSystemsGrid();
      });
    });

    // 4. Global click delegation for 3D inspection launch
    document.addEventListener('click', (e) => {
      const btn3D = e.target.closest('[data-open-3d]');
      if (btn3D) {
        e.preventDefault();
        e.stopPropagation();
        const sysId = btn3D.getAttribute('data-open-3d');
        if (window.AinZara3D && typeof window.AinZara3D.openModal === 'function') {
          window.AinZara3D.openModal(sysId);
        }
      }
    });

    // 5. Language changed event
    document.addEventListener('languageChanged', () => {
      renderSystemsGrid();
    });
  }

  // Boot on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    initControls();
    renderSystemsGrid();
  });

  window.AinZaraDownloads = {
    render: renderSystemsGrid,
    setCategory: (cat) => { currentCategory = cat; renderSystemsGrid(); },
    setFormat: (fmt) => { currentFormat = fmt; renderSystemsGrid(); }
  };
})();
