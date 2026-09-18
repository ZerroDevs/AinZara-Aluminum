/**
 * Mobile Drawer Navigation & Active Route Management
 * Uses unified document delegation for 100% reliability across dynamic header injection and all mobile touchscreens
 */

(function () {
  'use strict';

  function openDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer) {
      drawer.classList.add('active');
    }
    if (backdrop) {
      backdrop.classList.add('active');
    }
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    if (drawer) {
      drawer.classList.remove('active');
    }
    if (backdrop) {
      backdrop.classList.remove('active');
    }
    document.body.style.overflow = '';
  }

  function toggleSystemsAccordion(btn) {
    if (!btn) btn = document.getElementById('drawer-systems-btn');
    const content = document.getElementById('drawer-systems-content');
    if (!content) return;

    const isCurrentlyExpanded = btn.getAttribute('aria-expanded') === 'true' || content.classList.contains('active');
    const nextState = !isCurrentlyExpanded;

    btn.setAttribute('aria-expanded', String(nextState));
    if (nextState) {
      btn.classList.add('open');
      content.classList.add('active');
    } else {
      btn.classList.remove('open');
      content.classList.remove('active');
    }
  }

  function toggleDeptContacts(btn) {
    if (!btn) btn = document.getElementById('drawer-dept-toggle');
    const content = document.getElementById('drawer-dept-content');
    if (!content) return;

    const isCurrentlyExpanded = btn.getAttribute('aria-expanded') === 'true' || content.classList.contains('active');
    const nextState = !isCurrentlyExpanded;

    btn.setAttribute('aria-expanded', String(nextState));
    if (nextState) {
      btn.classList.add('open');
      content.classList.add('active');
    } else {
      btn.classList.remove('open');
      content.classList.remove('active');
    }
  }

  // Unified global event delegation - resilient against dynamic DOM injection
  document.addEventListener('click', function (e) {
    // 1. Mobile menu toggle button (hamburger)
    const toggleBtn = e.target.closest('#mobile-menu-toggle');
    if (toggleBtn) {
      e.preventDefault();
      e.stopPropagation();
      openDrawer();
      return;
    }

    // 2. Drawer close button
    const closeBtn = e.target.closest('#drawer-close-btn');
    if (closeBtn) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      return;
    }

    // 3. Drawer backdrop tap
    if (e.target.id === 'mobile-drawer-backdrop') {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      return;
    }

    // 4. Architectural Systems accordion button inside drawer
    const systemsBtn = e.target.closest('#drawer-systems-btn, .drawer-accordion-btn');
    if (systemsBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleSystemsAccordion(systemsBtn);
      return;
    }

    // 5. Department contacts toggle inside drawer
    const deptBtn = e.target.closest('#drawer-dept-toggle, .drawer-dept-toggle');
    if (deptBtn) {
      e.preventDefault();
      e.stopPropagation();
      toggleDeptContacts(deptBtn);
      return;
    }

    // 6. Request a Quote button inside drawer
    const rfqAction = e.target.closest('.drawer-quick-actions [data-action="open-rfq"]');
    if (rfqAction) {
      e.preventDefault();
      e.stopPropagation();
      closeDrawer();
      const modal = document.getElementById('rfq-modal');
      if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
      return;
    }

    // 7. Auto-close drawer on navigating through links
    const navLink = e.target.closest('.drawer-nav-link, .drawer-sublink, .drawer-brand');
    if (navLink) {
      // Allow default link navigation to proceed, but close the drawer smoothly
      closeDrawer();
    }
  });

  // Touch event optimization for responsive feel on iOS and Android
  document.addEventListener('touchstart', function (e) {
    const toggleBtn = e.target.closest('#mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.style.opacity = '0.7';
    }
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    const toggleBtn = e.target.closest('#mobile-menu-toggle');
    if (toggleBtn) {
      toggleBtn.style.opacity = '';
    }
  }, { passive: true });

  // Highlight active links based on current path
  function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    let page = 'home';

    if (currentPath.includes('about.html')) page = 'about';
    else if (currentPath.includes('products.html') || currentPath.includes('category.html')) page = 'products';
    else if (currentPath.includes('downloads.html')) page = 'downloads';
    else if (currentPath.includes('references.html')) page = 'references';
    else if (currentPath.includes('contact.html')) page = 'contact';
    else if (currentPath.includes('terms.html')) page = 'terms';
    else if (currentPath.includes('privacy.html')) page = 'privacy';

    document.querySelectorAll(`[data-nav="${page}"]`).forEach(l => l.classList.add('active'));
  }

  // Lifecycle registrations
  document.addEventListener('DOMContentLoaded', highlightActiveLinks);
  document.addEventListener('headerLoaded', highlightActiveLinks);

  // Expose global API
  window.AinZaraNav = {
    openDrawer: openDrawer,
    closeDrawer: closeDrawer,
    toggleAccordion: toggleSystemsAccordion,
    toggleDept: toggleDeptContacts
  };
})();

