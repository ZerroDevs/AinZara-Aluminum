/**
 * Header Component Loader & Lifecycle
 * Injects assets/componts/header.html into #header-placeholder
 * Provides embedded fallback for offline/local file:// protocol execution
 */

(function () {
  'use strict';

  const HEADER_TEMPLATE = `<!-- Embedded Semantic Header Fallback -->
<header class="site-header">
  <div class="header-topbar">
    <div class="container">
      <div class="topbar-contact-list">
        <div class="topbar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          <a href="tel:0924295050" class="phone-digits">+218 92 429 5050</a>
        </div>
        <div class="topbar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
          <a href="mailto:info@ainzara.ly">info@ainzara.ly</a>
        </div>
        <div class="topbar-item">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span data-i18n="header_location">Ain Zara, Industrial District, Tripoli, Libya</span>
        </div>
      </div>
      <div class="topbar-actions">
        <button type="button" class="lang-btn lang-toggle-btn" aria-label="Toggle Language">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
          <span class="lang-label">العربية</span>
        </button>
      </div>
    </div>
  </div>
  <div class="header-main">
    <div class="container">
      <a href="index.html" class="brand-logo-link">
        <img src="assets/Images/Logo.jpeg" alt="AinZara Logo" class="brand-logo-img">
        <div class="brand-title-wrap">
          <span class="brand-name" data-i18n="brand_name">AIN ZARA</span>
          <span class="brand-tagline" data-i18n="brand_tagline">Glass Processing & Aluminum Manufacturing</span>
        </div>
      </a>
      <nav class="desktop-nav" aria-label="Main Navigation">
        <a href="index.html" class="nav-link" data-nav="home" data-i18n="nav_home">Home</a>
        <a href="about.html" class="nav-link" data-nav="about" data-i18n="nav_about">About Us</a>
        <div class="nav-item-dropdown">
          <a href="products.html" class="nav-link" data-nav="products">
            <span data-i18n="nav_systems">Architectural Systems</span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </a>
          <div class="dropdown-menu">
            <a href="category.html?cat=sliding" class="dropdown-item"><span data-i18n="cat_sliding">Sliding Systems</span><span class="dropdown-item-code">ARTOS</span></a>
            <a href="category.html?cat=door-window" class="dropdown-item"><span data-i18n="cat_door_window">Door & Window Systems</span><span class="dropdown-item-code">HEKLA</span></a>
            <a href="category.html?cat=facade" class="dropdown-item"><span data-i18n="cat_facade">Curtain Wall & Facades</span><span class="dropdown-item-code">BROMO</span></a>
            <a href="category.html?cat=folding" class="dropdown-item"><span data-i18n="cat_folding">Folding Door Systems</span><span class="dropdown-item-code">NEPAL</span></a>
            <a href="category.html?cat=office" class="dropdown-item"><span data-i18n="cat_office">Office Partitions</span><span class="dropdown-item-code">IDA</span></a>
            <a href="category.html?cat=roof" class="dropdown-item"><span data-i18n="cat_roof">Skylight & Roof Systems</span><span class="dropdown-item-code">URAL</span></a>
            <a href="category.html?cat=vertical" class="dropdown-item"><span data-i18n="cat_vertical">Vertical Guillotine Systems</span><span class="dropdown-item-code">LOGAN</span></a>
            <div style="height: 1px; background: rgba(255,255,255,0.12); margin: 0.35rem 0;"></div>
            <a href="assets/downloads/pdf/AinZara-Master-Architectural-Catalog.pdf" class="dropdown-item" download="AinZara-Master-Architectural-Catalog.pdf" target="_blank" style="color: #60A5FA; font-weight: 700;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-right: 6px;"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              <span data-i18n="drawer_download_catalog">Master Catalog (PDF)</span>
            </a>
          </div>
        </div>
        <a href="references.html" class="nav-link" data-nav="references" data-i18n="nav_references">References</a>
        <a href="contact.html" class="nav-link" data-nav="contact" data-i18n="nav_contact">Contact</a>
      </nav>
      <div class="header-actions">
        <button type="button" class="mobile-lang-btn lang-toggle-btn" aria-label="Toggle Language">
          <span class="lang-short-label">العربية</span>
        </button>
        <button type="button" class="btn-rfq" data-action="open-rfq" aria-label="Request a Quote">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
          <span data-i18n="btn_rfq">Quote</span>
        </button>
        <button type="button" class="menu-toggle-btn" id="mobile-menu-toggle" aria-label="Open Navigation Menu">
          <span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span><span class="menu-toggle-bar"></span>
        </button>
      </div>
    </div>
  </div>
</header>
<div class="mobile-drawer-backdrop" id="mobile-drawer-backdrop"></div>
<aside class="mobile-drawer" id="mobile-drawer" aria-label="Mobile Navigation">
  <div class="drawer-header">
    <a href="index.html" class="drawer-brand">
      <img src="assets/Images/Logo.jpeg" alt="AinZara Logo" class="drawer-brand-logo">
      <div class="drawer-brand-text">
        <span class="drawer-brand-title" data-i18n="brand_name">AIN ZARA</span>
        <span class="drawer-brand-subtitle" data-i18n="brand_tagline">Glass Processing & Aluminum Manufacturing</span>
      </div>
    </a>
    <div style="display: flex; align-items: center; gap: 0.5rem;">
      <button type="button" class="drawer-lang-btn lang-toggle-btn" title="Switch Language / تغيير اللغة">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>
        <span class="lang-short-label">العربية</span>
      </button>
      <button type="button" class="drawer-close-btn" id="drawer-close" aria-label="Close Navigation Drawer">&times;</button>
    </div>
  </div>

  <div class="drawer-quick-actions">
    <button type="button" class="drawer-action-btn primary" data-action="open-rfq">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
      <span data-i18n="btn_rfq">Request a Quote</span>
    </button>
    <a href="assets/downloads/pdf/AinZara-Master-Architectural-Catalog.pdf" class="drawer-action-btn secondary" download="AinZara-Master-Architectural-Catalog.pdf" target="_blank">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
      <span data-i18n="drawer_download_catalog">Catalog PDF</span>
    </a>
  </div>

  <div class="drawer-body">
    <div class="drawer-nav-list">
      <div class="drawer-nav-item">
        <a href="index.html" class="drawer-nav-link" data-nav="home">
          <div class="drawer-nav-label-wrap">
            <svg class="drawer-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
            <span data-i18n="nav_home">Home</span>
          </div>
          <span class="drawer-link-arrow">&rsaquo;</span>
        </a>
      </div>

      <div class="drawer-nav-item">
        <a href="about.html" class="drawer-nav-link" data-nav="about">
          <div class="drawer-nav-label-wrap">
            <svg class="drawer-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
            <span data-i18n="nav_about">About Us</span>
          </div>
          <span class="drawer-link-arrow">&rsaquo;</span>
        </a>
      </div>

      <div class="drawer-nav-item accordion-item">
        <button type="button" class="drawer-accordion-btn" id="drawer-systems-btn" aria-expanded="false">
          <div class="drawer-nav-label-wrap">
            <svg class="drawer-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>
            <div class="drawer-accordion-title-wrap">
              <span class="drawer-accordion-main-title" data-i18n="nav_systems">Architectural Systems</span>
              <span class="drawer-accordion-subtitle" data-i18n="drawer_explore_series">7 Series • 14 Profiles</span>
            </div>
          </div>
          <svg class="drawer-accordion-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </button>

        <div class="drawer-accordion-content" id="drawer-systems-content">
          <a href="products.html" class="drawer-sublink matrix-highlight">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_all">All Systems Matrix</span>
                <span class="sublink-badge-matrix">14 Profiles</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_matrix_desc">Complete Technical Specifications</span>
            </div>
            <span class="sublink-arrow">&rarr;</span>
          </a>

          <a href="category.html?cat=sliding" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_sliding">Sliding Systems</span>
                <span class="dropdown-item-code">ARTOS</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_sliding">Lift & Slide • Heavy Monorail</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=door-window" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_door_window">Door & Window</span>
                <span class="dropdown-item-code">HEKLA</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_door_window">Thermal-Break & Standard Casements</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=facade" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_facade">Curtain Wall & Facades</span>
                <span class="dropdown-item-code">BROMO</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_facade">Structural & Semi-Structural Glazing</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=folding" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_folding">Folding Doors</span>
                <span class="dropdown-item-code">NEPAL</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_folding">Heavy-Duty Bi-Fold Thermal Systems</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=office" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_office">Office Partitions</span>
                <span class="dropdown-item-code">IDA</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_office">Double Glass Acoustic Partitions</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=roof" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_roof">Skylight & Roof</span>
                <span class="dropdown-item-code">URAL</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_roof">Veranda & Wintergarden Roofs</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>

          <a href="category.html?cat=vertical" class="drawer-sublink">
            <div class="sublink-info">
              <div class="sublink-title-row">
                <span class="sublink-name" data-i18n="cat_vertical">Guillotine Vertical</span>
                <span class="dropdown-item-code">LOGAN</span>
              </div>
              <span class="sublink-desc" data-i18n="drawer_desc_vertical">Automated Motorized Guillotine</span>
            </div>
            <span class="sublink-arrow">&rsaquo;</span>
          </a>
        </div>
      </div>

      <div class="drawer-nav-item">
        <a href="references.html" class="drawer-nav-link" data-nav="references">
          <div class="drawer-nav-label-wrap">
            <svg class="drawer-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
            <span data-i18n="nav_references">References</span>
          </div>
          <span class="drawer-link-arrow">&rsaquo;</span>
        </a>
      </div>

      <div class="drawer-nav-item">
        <a href="contact.html" class="drawer-nav-link" data-nav="contact">
          <div class="drawer-nav-label-wrap">
            <svg class="drawer-nav-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
            <span data-i18n="nav_contact">Contact</span>
          </div>
          <span class="drawer-link-arrow">&rsaquo;</span>
        </a>
      </div>
    </div>
  </div>

  <div class="drawer-footer">
    <div class="drawer-footer-header">
      <div class="drawer-footer-title" data-i18n="drawer_direct_channels">Direct Factory Lines</div>
      <span class="drawer-factory-badge" data-i18n="drawer_factory_badge">Tripoli Complex</span>
    </div>

    <div class="drawer-phone-list">
      <div class="drawer-phone-item">
        <div class="drawer-phone-info">
          <a href="tel:0924295050" class="drawer-phone-number phone-digits">+218 92 429 5050</a>
        </div>
        <div class="drawer-phone-actions">
          <a href="tel:0924295050" class="icon-link" aria-label="Call +218 92 429 5050">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <a href="https://wa.me/218924295050" target="_blank" rel="noopener noreferrer" class="icon-link whatsapp" aria-label="WhatsApp +218 92 429 5050">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        </div>
      </div>

      <div class="drawer-phone-item">
        <div class="drawer-phone-info">
          <a href="tel:0916141616" class="drawer-phone-number phone-digits">+218 91 614 1616</a>
        </div>
        <div class="drawer-phone-actions">
          <a href="tel:0916141616" class="icon-link" aria-label="Call +218 91 614 1616">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <a href="https://wa.me/218916141616" target="_blank" rel="noopener noreferrer" class="icon-link whatsapp" aria-label="WhatsApp +218 91 614 1616">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        </div>
      </div>
    </div>

    <button type="button" class="drawer-dept-toggle" id="drawer-dept-toggle" aria-expanded="false">
      <span data-i18n="drawer_more_contacts">All 5 Direct Lines</span>
      <svg class="dept-toggle-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
    </button>

    <div class="drawer-dept-content" id="drawer-dept-content">
      <div class="drawer-phone-item compact">
        <div class="drawer-phone-info">
          <a href="tel:0922117555" class="drawer-phone-number phone-digits">+218 92 211 7555</a>
        </div>
        <div class="drawer-phone-actions">
          <a href="tel:0922117555" class="icon-link" aria-label="Call +218 92 211 7555">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <a href="https://wa.me/218922117555" target="_blank" rel="noopener noreferrer" class="icon-link whatsapp" aria-label="WhatsApp +218 92 211 7555">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        </div>
      </div>

      <div class="drawer-phone-item compact">
        <div class="drawer-phone-info">
          <a href="tel:0915520267" class="drawer-phone-number phone-digits">+218 91 552 0267</a>
        </div>
        <div class="drawer-phone-actions">
          <a href="tel:0915520267" class="icon-link" aria-label="Call +218 91 552 0267">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <span class="call-only-pill" data-i18n="call_only">Voice</span>
        </div>
      </div>

      <div class="drawer-phone-item compact">
        <div class="drawer-phone-info">
          <a href="tel:0916808225" class="drawer-phone-number phone-digits">+218 91 680 8225</a>
        </div>
        <div class="drawer-phone-actions">
          <a href="tel:0916808225" class="icon-link" aria-label="Call +218 91 680 8225">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
          </a>
          <a href="https://wa.me/218916808225" target="_blank" rel="noopener noreferrer" class="icon-link whatsapp" aria-label="WhatsApp +218 91 680 8225">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>
          </a>
        </div>
      </div>
    </div>

    <div class="drawer-meta-row">
      <div class="drawer-meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>Ain Zara, Tripoli</span>
      </div>
      <div class="drawer-meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
        <span data-i18n="drawer_factory_hours">Sat–Thu: 08:00–17:00</span>
      </div>
    </div>
  </div>
</aside>`;

  function loadHeader() {
    const placeholder = document.getElementById('header-placeholder');
    if (!placeholder) return;

    // Use embedded template directly for 0ms latency, offline support, and immunity to Live-Server proxy injection
    placeholder.innerHTML = HEADER_TEMPLATE;
    document.dispatchEvent(new CustomEvent('headerLoaded'));
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadHeader);
  } else {
    loadHeader();
  }
})();
