/**
 * Mobile Drawer Navigation & Active Route Management
 * Uses multi-layer binding (direct handler, global delegation, window API) for 100% reliability across all mobile devices
 */

(function () {
  'use strict';

  function openDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer) drawer.classList.add('active');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer) drawer.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  function toggleSystemsAccordion(btn) {
    if (!btn) btn = document.getElementById('drawer-systems-btn');
    const content = document.getElementById('drawer-systems-content');
    if (!content) return;

    const isExpanded = btn ? (btn.getAttribute('aria-expanded') === 'true') : content.classList.contains('active');
    const nextState = !isExpanded;

    if (btn) {
      btn.setAttribute('aria-expanded', String(nextState));
    }

    if (nextState) {
      content.classList.add('active');
      content.style.setProperty('display', 'block', 'important');
    } else {
      content.classList.remove('active');
      content.style.setProperty('display', 'none', 'important');
    }
  }

  // Direct element binding for maximum responsiveness on iOS and Android
  function bindDrawerEvents() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.onclick = function (e) {
        if (e) e.preventDefault();
        openDrawer();
      };
    }

    const closeBtn = document.getElementById('drawer-close-btn');
    if (closeBtn) {
      closeBtn.onclick = function (e) {
        if (e) e.preventDefault();
        closeDrawer();
      };
    }

    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (backdrop) {
      backdrop.onclick = function (e) {
        if (e) e.preventDefault();
        closeDrawer();
      };
    }

    const accordionBtn = document.getElementById('drawer-systems-btn');
    if (accordionBtn) {
      accordionBtn.onclick = function (e) {
        if (e) {
          e.preventDefault();
          e.stopPropagation();
        }
        toggleSystemsAccordion(accordionBtn);
      };
    }
  }

  // Global event delegation as fallback
  document.addEventListener('click', function (e) {
    // 1. Mobile menu toggle button
    const toggleBtn = e.target.closest('#mobile-menu-toggle');
    if (toggleBtn) {
      e.preventDefault();
      openDrawer();
      return;
    }

    // 2. Drawer close button
    const closeBtn = e.target.closest('#drawer-close-btn');
    if (closeBtn) {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // 3. Drawer backdrop
    if (e.target.id === 'mobile-drawer-backdrop') {
      e.preventDefault();
      closeDrawer();
      return;
    }

    // 4. Architectural Systems accordion button inside drawer
    const accordionBtn = e.target.closest('#drawer-systems-btn, .drawer-accordion-btn');
    if (accordionBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleSystemsAccordion(accordionBtn);
      return;
    }
  });

  // Highlight active links based on current path
  function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    let page = 'home';

    if (currentPath.includes('about.html')) page = 'about';
    else if (currentPath.includes('products.html') || currentPath.includes('category.html')) page = 'products';
    else if (currentPath.includes('references.html')) page = 'references';
    else if (currentPath.includes('contact.html')) page = 'contact';

    document.querySelectorAll(`[data-nav="${page}"]`).forEach(l => l.classList.add('active'));
  }

  // Lifecycle registrations
  document.addEventListener('DOMContentLoaded', () => {
    bindDrawerEvents();
    highlightActiveLinks();
  });

  document.addEventListener('headerLoaded', () => {
    bindDrawerEvents();
    highlightActiveLinks();
  });

  // Expose global API
  window.AinZaraNav = {
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    toggleAccordion: toggleSystemsAccordion
  };
})();
