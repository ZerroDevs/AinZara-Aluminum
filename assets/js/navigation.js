/**
 * Mobile Drawer Navigation & Active Route Management
 * Binds on headerLoaded and page initialization
 */

(function () {
  'use strict';

  function initNavigation() {
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const closeBtn = document.getElementById('drawer-close-btn');
    const drawer = document.getElementById('mobile-drawer');
    const backdrop = document.getElementById('mobile-drawer-backdrop');
    const accordionBtn = document.getElementById('drawer-systems-btn');
    const accordionContent = document.getElementById('drawer-systems-content');

    function openDrawer() {
      if (drawer) drawer.classList.add('active');
      if (backdrop) backdrop.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      if (drawer) drawer.classList.remove('active');
      if (backdrop) backdrop.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (toggleBtn) {
      toggleBtn.removeEventListener('click', openDrawer);
      toggleBtn.addEventListener('click', openDrawer);
    }

    if (closeBtn) {
      closeBtn.removeEventListener('click', closeDrawer);
      closeBtn.addEventListener('click', closeDrawer);
    }

    if (backdrop) {
      backdrop.removeEventListener('click', closeDrawer);
      backdrop.addEventListener('click', closeDrawer);
    }

    // Accordion Toggle inside Drawer
    if (accordionBtn && accordionContent) {
      accordionBtn.addEventListener('click', function () {
        const isExpanded = accordionBtn.getAttribute('aria-expanded') === 'true';
        accordionBtn.setAttribute('aria-expanded', !isExpanded);
        accordionContent.classList.toggle('active');
      });
    }

    // Active Route Detection
    highlightActiveLinks();
  }

  function highlightActiveLinks() {
    const currentPath = window.location.pathname;
    let page = 'home';

    if (currentPath.includes('about.html')) page = 'about';
    else if (currentPath.includes('products.html') || currentPath.includes('category.html')) page = 'products';
    else if (currentPath.includes('references.html')) page = 'references';
    else if (currentPath.includes('contact.html')) page = 'contact';

    const links = document.querySelectorAll(`[data-nav="${page}"]`);
    links.forEach(l => l.classList.add('active'));
  }

  document.addEventListener('DOMContentLoaded', initNavigation);
  document.addEventListener('headerLoaded', initNavigation);

  window.AinZaraNav = {
    init: initNavigation
  };
})();
