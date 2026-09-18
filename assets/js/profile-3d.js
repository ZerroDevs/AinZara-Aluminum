/**
 * AinZara-Aluminum - Universal WebGL 3D Architectural Profile Viewer
 * Advanced Architectural Features:
 * - Three.js WebGL rendering with PBR materials and studio environmental lighting
 * - Ambient occlusion contact shadow plane and crisp directional key/fill/rim lighting
 * - OrbitControls: 360° desktop orbit & single/two-finger mobile touch controls
 * - Interactive Operable Mechanics ("Operate / Open" Animation per profile type)
 * - Architectural Finishes & RAL Color Switcher (7 Qualicoat & Qualanod finishes)
 * - Dynamic 3D Cross-Section Slicer (Real-time clipping plane slider)
 * - Interactive Point-to-Point Caliper (Raycaster measurement tool with millimeter badge)
 * - High-Res Studio Snapshot (1080p Transparent PNG export)
 * - Animated Exploded View mode along part normal vectors
 * - 3D-to-2D projected Dimension Hotspots with bilingual tooltips
 * - Performance & Battery Saver (Idle render loop pause & WebGL context recovery)
 * - Fullscreen interactive 3D Modal & inline card mounting
 */

(function () {
  'use strict';

  // Active viewer instances map: containerId -> viewerInstance
  const activeViewers = new Map();

  class Profile3DViewer {
    constructor(container, modelId, options = {}) {
      this.container = typeof container === 'string' ? document.querySelector(container) : container;
      if (!this.container) {
        console.error('[Profile3DViewer] Target container not found:', container);
        return;
      }

      this.modelId = modelId;
      this.currentFinishId = 'ral-7016';
      this.options = Object.assign({
        autoRotate: false,
        showHud: true,
        allowExplode: true,
        allowDimensions: true,
        showSchematicToggle: true,
        defaultExploded: false,
        onModalOpen: null
      }, options);

      // State flags
      this.isExploded = this.options.defaultExploded;
      this.explodeFactor = this.isExploded ? 1.0 : 0.0;
      this.targetExplodeFactor = this.explodeFactor;

      this.isOperated = false;
      this.operateFactor = 0.0;
      this.targetOperateFactor = 0.0;
      this.operableMeta = null;

      this.showDimensions = false;
      this.isWireframe = false;
      this.isClippingActive = false;
      this.caliperMode = false;
      this.caliperPoints = [];
      this.caliperMarkers = [];
      this.caliperLine = null;
      this.caliperBadge = null;

      this.needsRender = true;
      this.animatingCamera = false;
      this.animationFrameId = null;

      this.init();
    }

    requestRender() {
      this.needsRender = true;
    }

    init() {
      // Clear container and create structure
      this.container.innerHTML = '';
      this.container.classList.add('viewer-3d-wrapper');

      // 1. Canvas Container
      this.canvasContainer = document.createElement('div');
      this.canvasContainer.className = 'viewer-3d-canvas-container';
      this.container.appendChild(this.canvasContainer);

      // 2. Hotspots Overlay Layer
      this.hotspotsOverlay = document.createElement('div');
      this.hotspotsOverlay.className = 'viewer-3d-hotspots-overlay';
      this.container.appendChild(this.hotspotsOverlay);

      // 3. Caliper Measurement Layer
      this.caliperOverlay = document.createElement('div');
      this.caliperOverlay.className = 'viewer-3d-caliper-overlay';
      this.container.appendChild(this.caliperOverlay);

      // 4. Popover Panels Container (Finishes, Section Slicer, Caliper banner)
      this.panelsContainer = document.createElement('div');
      this.panelsContainer.className = 'viewer-3d-panels-container';
      this.container.appendChild(this.panelsContainer);

      // 5. HUD Controls Bar
      if (this.options.showHud) {
        this.createHud();
      }

      // 6. Responsive, Dismissible & Compact 3D Disclaimer Notice
      const disclaimer = document.createElement('div');
      disclaimer.className = 'viewer-3d-disclaimer';
      const disclaimerNotice = (window.AinZaraI18n && window.AinZaraI18n.t('badge_disclaimer_notice')) || 'IMPORTANT NOTE';
      const disclaimerNoticeShort = (window.AinZaraI18n && window.AinZaraI18n.t('badge_disclaimer_short')) || 'NOTE';
      const disclaimerText = (window.AinZaraI18n && window.AinZaraI18n.t('note_3d_disclaimer')) ||
        'Interactive 3D representation • This is for demonstration purposes only and may not accurately reflect physical reality • For exact manufacturing specifications refer to official 2D CAD schematic';
      const disclaimerTextShort = (window.AinZaraI18n && window.AinZaraI18n.t('note_3d_disclaimer_short')) ||
        'Illustration only • Refer to 2D CAD for exact manufacturing specifications';

      disclaimer.innerHTML = `
        <div class="disclaimer-content">
          <div class="disclaimer-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span class="badge-text-full" data-i18n="badge_disclaimer_notice">${disclaimerNotice}</span>
            <span class="badge-text-short" data-i18n="badge_disclaimer_short">${disclaimerNoticeShort}</span>
          </div>
          <span class="disclaimer-text disclaimer-text-full" data-i18n="note_3d_disclaimer">${disclaimerText}</span>
          <span class="disclaimer-text disclaimer-text-short" data-i18n="note_3d_disclaimer_short">${disclaimerTextShort}</span>
        </div>
        <div class="disclaimer-controls">
          <button type="button" class="disclaimer-expand-btn" title="Toggle full note / عرض التفاصيل" aria-label="Toggle full note">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
          </button>
          <button type="button" class="disclaimer-close-btn" title="Dismiss / إخفاء الملاحظة" aria-label="Dismiss note">&times;</button>
        </div>
      `;
      this.container.appendChild(disclaimer);

      // Restore pill button (shown when user dismisses the disclaimer)
      const restoreBtn = document.createElement('button');
      restoreBtn.type = 'button';
      restoreBtn.className = 'viewer-3d-disclaimer-restore';
      restoreBtn.title = 'View 3D Disclaimer / ملاحظة المخطط';
      restoreBtn.setAttribute('aria-label', 'View 3D Disclaimer');
      restoreBtn.style.display = 'none';
      restoreBtn.innerHTML = `
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
        <span data-i18n="badge_disclaimer_short">${disclaimerNoticeShort}</span>
      `;
      this.container.appendChild(restoreBtn);

      const closeBtn = disclaimer.querySelector('.disclaimer-close-btn');
      const expandBtn = disclaimer.querySelector('.disclaimer-expand-btn');

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          disclaimer.style.display = 'none';
          restoreBtn.style.display = 'inline-flex';
        });
      }

      if (restoreBtn) {
        restoreBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          disclaimer.style.display = '';
          restoreBtn.style.display = 'none';
        });
      }

      if (expandBtn) {
        expandBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          disclaimer.classList.toggle('is-expanded');
          const isExp = disclaimer.classList.contains('is-expanded');
          const svg = expandBtn.querySelector('svg');
          if (svg) svg.style.transform = isExp ? 'rotate(180deg)' : '';
        });
      }

      // Three.js Core Setup
      const width = this.canvasContainer.clientWidth || 380;
      const height = this.canvasContainer.clientHeight || 360;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xF8FAFC); // Architectural Off-White Canvas

      // Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      this.defaultCameraPos = new THREE.Vector3(18, 14, 26);
      this.defaultCameraTarget = new THREE.Vector3(0, 0, 0);
      this.camera.position.copy(this.defaultCameraPos);

      // Renderer with Antialiasing, High DPI & Local Clipping
      this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true
      });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.15;
      this.renderer.localClippingEnabled = true;
      this.canvasContainer.appendChild(this.renderer.domElement);

      // WebGL Context Lost & Restored Handling
      this.renderer.domElement.addEventListener('webglcontextlost', (e) => {
        e.preventDefault();
        console.warn('[AinZara 3D] WebGL context lost. Pausing render loop.');
        if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);
      }, false);

      this.renderer.domElement.addEventListener('webglcontextrestored', () => {
        console.info('[AinZara 3D] WebGL context restored. Re-initializing viewer.');
        this.init();
      }, false);

      // Slicer Clipping Plane (default cuts through profile along Z axis)
      this.clipPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 20);

      // OrbitControls with Touch Support
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.screenSpacePanning = true;
      this.controls.minDistance = 6;
      this.controls.maxDistance = 65;
      this.controls.maxPolarAngle = Math.PI / 1.85;
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 1.2;
      this.controls.target.copy(this.defaultCameraTarget);

      // Trigger render on camera movement
      this.controls.addEventListener('change', () => this.requestRender());

      // Studio Lighting
      this.setupLighting();

      // Load 3D Profile Model
      this.loadModel(this.modelId, this.currentFinishId);

      // Bind Caliper Click Listener
      this.setupCaliperInteraction();

      // Bind Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.canvasContainer);

      // Start Battery-Saving Render Loop
      this.animate = this.animate.bind(this);
      this.animate();
    }

    setupLighting() {
      // 1. Hemisphere Light (Soft Sky / Architectural Ground Balance)
      const hemiLight = new THREE.HemisphereLight(0xF8FAFC, 0xCBD5E1, 0.60);
      this.scene.add(hemiLight);

      // 2. Key Directional Light (Crisp architectural sun)
      const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.90);
      keyLight.position.set(22, 32, 22);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0004;
      keyLight.shadow.camera.near = 10;
      keyLight.shadow.camera.far = 80;
      keyLight.shadow.camera.left = -15;
      keyLight.shadow.camera.right = 15;
      keyLight.shadow.camera.top = 15;
      keyLight.shadow.camera.bottom = -15;
      this.scene.add(keyLight);

      // 3. Fill Directional Light (Soft Cool Sky)
      const fillLight = new THREE.DirectionalLight(0xDFE7EF, 0.45);
      fillLight.position.set(-20, 12, -20);
      this.scene.add(fillLight);

      // 4. Specular Rim Light (Highlights aluminum edges and bevels)
      const rimLight = new THREE.DirectionalLight(0x3B82F6, 0.28);
      rimLight.position.set(0, -10, 25);
      this.scene.add(rimLight);

      // 5. Contact Ambient Occlusion Shadow (Radial gradient procedural canvas texture)
      const aoCanvas = document.createElement('canvas');
      aoCanvas.width = 256;
      aoCanvas.height = 256;
      const ctx = aoCanvas.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 10, 128, 128, 128);
      grad.addColorStop(0, 'rgba(15, 23, 42, 0.38)');
      grad.addColorStop(0.4, 'rgba(15, 23, 42, 0.16)');
      grad.addColorStop(0.8, 'rgba(15, 23, 42, 0.03)');
      grad.addColorStop(1, 'rgba(15, 23, 42, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const aoTexture = new THREE.CanvasTexture(aoCanvas);
      const aoPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(28, 28),
        new THREE.MeshBasicMaterial({ map: aoTexture, transparent: true, opacity: 0.8, depthWrite: false })
      );
      aoPlane.rotation.x = -Math.PI / 2;
      aoPlane.position.y = -6.8;
      this.scene.add(aoPlane);

      // 6. Dynamic Shadow Receiving Ground Plane
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(60, 60),
        new THREE.ShadowMaterial({ opacity: 0.18 })
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -6.81;
      shadowPlane.receiveShadow = true;
      this.scene.add(shadowPlane);
    }

    loadModel(modelId, finishId = this.currentFinishId) {
      if (this.currentModelGroup) {
        this.scene.remove(this.currentModelGroup);
      }

      this.modelId = modelId;
      this.currentFinishId = finishId;

      const built = window.AinZaraProfileGeometries.build(modelId, finishId);
      this.currentModelGroup = built.group;
      this.hotspotsData = built.hotspots || {};
      this.operableMeta = built.operable || null;

      this.scene.add(this.currentModelGroup);

      // Gather animatable and clipping-compatible parts
      this.animatableParts = [];
      this.currentModelGroup.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;

          if (this.isClippingActive && child.material) {
            child.material.clippingPlanes = [this.clipPlane];
            child.material.clipShadows = true;
            child.material.needsUpdate = true;
          }

          if (child.userData && (child.userData.explodeOffset || child.userData.kinematic)) {
            this.animatableParts.push(child);
          }
        }
      });

      // Update Operable HUD button if present
      this.updateOperableButtonState();

      // Reset caliper measurements on model change
      this.clearCaliper();

      // Re-apply current kinematics or exploded view if active
      if (this.isOperated) {
        this.updateKinematics(this.operateFactor);
      } else if (this.isExploded) {
        this.updateExplodeDisplacement(this.explodeFactor);
      }

      this.createHotspotPins();
      this.requestRender();
    }

    updateOperableButtonState() {
      if (!this.btnOperate) return;

      if (!this.operableMeta) {
        this.btnOperate.style.display = 'none';
        this.isOperated = false;
        this.targetOperateFactor = 0.0;
        this.operateFactor = 0.0;
      } else {
        this.btnOperate.style.display = 'inline-flex';
        const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';
        const labelText = lang === 'ar' ? this.operableMeta.labelAr : this.operableMeta.labelEn;
        const textSpan = this.btnOperate.querySelector('.btn-label');
        if (textSpan) textSpan.textContent = labelText;
        this.btnOperate.classList.toggle('active', this.isOperated);
      }
    }

    createHud() {
      const hud = document.createElement('div');
      hud.className = 'viewer-3d-hud';

      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

      // 1. Operable Mechanics ("Operate / Open" Animation)
      this.btnOperate = document.createElement('button');
      this.btnOperate.type = 'button';
      this.btnOperate.className = 'hud-btn btn-operate';
      this.btnOperate.title = 'Interactive Operable Mechanics / تشغيل وحركة المنظومة';
      this.btnOperate.setAttribute('aria-label', 'Toggle System Movement');
      this.btnOperate.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        <span class="btn-label" data-i18n="btn_operate">Operate</span>
      `;
      this.btnOperate.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleOperate();
      });
      hud.appendChild(this.btnOperate);

      // 2. Exploded View Toggle
      if (this.options.allowExplode) {
        const btnExplode = document.createElement('button');
        btnExplode.type = 'button';
        btnExplode.className = 'hud-btn btn-explode';
        btnExplode.title = 'Exploded Assembly View / منظور مفكك للقطع';
        btnExplode.setAttribute('aria-label', 'Toggle Exploded View');
        btnExplode.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>
          <span data-i18n="btn_exploded_view">Exploded</span>
        `;
        btnExplode.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleExplodedView(btnExplode);
        });
        hud.appendChild(btnExplode);
      }

      // 3. Dynamic Section Slicer
      const btnSlicer = document.createElement('button');
      btnSlicer.type = 'button';
      btnSlicer.className = 'hud-btn btn-section-cut';
      btnSlicer.title = 'Cross-Section Slicer / مقطع هندسي داخلي';
      btnSlicer.setAttribute('aria-label', 'Toggle Section Cut');
      btnSlicer.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="6" cy="6" r="3"></circle><circle cx="6" cy="18" r="3"></circle><line x1="20" y1="4" x2="8.12" y2="15.88"></line><line x1="14.47" y1="14.48" x2="20" y2="20"></line><line x1="8.12" y1="8.12" x2="12" y2="12"></line></svg>
        <span data-i18n="btn_section_cut">Section</span>
      `;
      btnSlicer.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleSectionCutPanel(btnSlicer);
      });
      hud.appendChild(btnSlicer);

      // 4. Architectural Finishes & RAL Palette
      const btnFinishes = document.createElement('button');
      btnFinishes.type = 'button';
      btnFinishes.className = 'hud-btn btn-finishes';
      btnFinishes.title = 'Architectural Finishes & RAL Colors / ألوان وتشطيبات معمارية';
      btnFinishes.setAttribute('aria-label', 'Architectural Finishes');
      btnFinishes.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"></circle><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"></circle><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"></circle><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"></circle><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.563-2.512 5.563-5.563C22 6.5 17.5 2 12 2z"></path></svg>
        <span data-i18n="btn_finishes">Finishes</span>
      `;
      btnFinishes.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleFinishesPanel(btnFinishes);
      });
      hud.appendChild(btnFinishes);

      // 5. Point-to-Point Caliper
      const btnCaliper = document.createElement('button');
      btnCaliper.type = 'button';
      btnCaliper.className = 'hud-btn btn-measure';
      btnCaliper.title = 'Point-to-Point Caliper / أداة قياس الأبعاد بالمليمتر';
      btnCaliper.setAttribute('aria-label', 'Measure Distance');
      btnCaliper.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.3 15.3a2.4 2.4 0 0 1 0 3.4l-2.6 2.6a2.4 2.4 0 0 1-3.4 0L2.7 8.7a2.41 2.41 0 0 1 0-3.4l2.6-2.6a2.41 2.41 0 0 1 3.4 0l12.6 12.6z"></path><line x1="14.5" y1="4.5" x2="16.5" y2="6.5"></line><line x1="11.5" y1="7.5" x2="13.5" y2="9.5"></line><line x1="8.5" y1="10.5" x2="10.5" y2="12.5"></line></svg>
        <span data-i18n="btn_measure">Measure</span>
      `;
      btnCaliper.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleCaliper(btnCaliper);
      });
      hud.appendChild(btnCaliper);

      // 6. Dimensions Hotspots Toggle
      if (this.options.allowDimensions) {
        const btnDim = document.createElement('button');
        btnDim.type = 'button';
        btnDim.className = 'hud-btn btn-dimensions';
        btnDim.title = 'Profile Dimensions / الأبعاد الهندسية المرجعية';
        btnDim.setAttribute('aria-label', 'Toggle Dimensions');
        btnDim.innerHTML = `
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <span data-i18n="btn_dimensions">Dimensions</span>
        `;
        btnDim.addEventListener('click', (e) => {
          e.stopPropagation();
          this.toggleDimensions(btnDim);
        });
        hud.appendChild(btnDim);
      }

      // 7. Studio Snapshot
      const btnSnapshot = document.createElement('button');
      btnSnapshot.type = 'button';
      btnSnapshot.className = 'hud-btn btn-snapshot';
      btnSnapshot.title = 'Export 1080p Transparent Studio PNG / التقاط صورة بدقة عالية';
      btnSnapshot.setAttribute('aria-label', 'Capture Studio Snapshot');
      btnSnapshot.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>
      `;
      btnSnapshot.addEventListener('click', (e) => {
        e.stopPropagation();
        this.captureSnapshot(btnSnapshot);
      });
      hud.appendChild(btnSnapshot);

      // 8. Camera Reset Button
      const btnReset = document.createElement('button');
      btnReset.type = 'button';
      btnReset.className = 'hud-btn btn-reset';
      btnReset.title = 'Reset Camera View / إعادة ضبط الكاميرا';
      btnReset.setAttribute('aria-label', 'Reset Camera View');
      btnReset.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path><polyline points="3 3 3 8 8 8"></polyline></svg>
      `;
      btnReset.addEventListener('click', (e) => {
        e.stopPropagation();
        this.resetCamera();
      });
      hud.appendChild(btnReset);

      // 9. Fullscreen Modal Launcher
      const btnModal = document.createElement('button');
      btnModal.type = 'button';
      btnModal.className = 'hud-btn btn-fullscreen';
      btnModal.title = 'Fullscreen 3D Inspection / تكبير شاشة كاملة';
      btnModal.setAttribute('aria-label', 'Fullscreen 3D View');
      btnModal.innerHTML = `
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></svg>
      `;
      btnModal.addEventListener('click', (e) => {
        e.stopPropagation();
        if (window.AinZara3D && window.AinZara3D.openModal) {
          window.AinZara3D.openModal(this.modelId);
        }
      });
      hud.appendChild(btnModal);

      this.container.appendChild(hud);

      // Create floating panels
      this.createPanels();
    }

    createPanels() {
      // 1. Finishes Swatch Popover
      this.finishesPanel = document.createElement('div');
      this.finishesPanel.className = 'viewer-3d-popover viewer-3d-finishes-popover';
      this.finishesPanel.style.display = 'none';

      const finishes = window.AinZaraProfileGeometries.FINISHES || {};
      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

      let swatchesHtml = '';
      Object.keys(finishes).forEach((key) => {
        const f = finishes[key];
        const label = lang === 'ar' ? f.nameAr : f.nameEn;
        const isSelected = key === this.currentFinishId ? 'selected' : '';
        swatchesHtml += `
          <button type="button" class="finish-swatch-item ${isSelected}" data-finish="${f.id}" title="${label}">
            <span class="swatch-color" style="background-color: ${f.css}; border: 1px solid rgba(0,0,0,0.15);"></span>
            <span class="swatch-label">${label}</span>
          </button>
        `;
      });

      this.finishesPanel.innerHTML = `
        <div class="popover-header">
          <span class="popover-title">${lang === 'ar' ? 'الألوان والتشطيبات المعمارية' : 'Architectural Finishes'}</span>
          <button type="button" class="popover-close" aria-label="Close">&times;</button>
        </div>
        <div class="finishes-swatches-grid">
          ${swatchesHtml}
        </div>
      `;

      this.finishesPanel.querySelector('.popover-close').addEventListener('click', () => {
        this.finishesPanel.style.display = 'none';
        const btn = this.container.querySelector('.btn-finishes');
        if (btn) btn.classList.remove('active');
      });

      this.finishesPanel.querySelectorAll('.finish-swatch-item').forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          const fid = item.getAttribute('data-finish');
          this.applyFinish(fid);
        });
      });

      this.panelsContainer.appendChild(this.finishesPanel);

      // 2. Dynamic Section Slicer Popover
      this.slicerPanel = document.createElement('div');
      this.slicerPanel.className = 'viewer-3d-popover viewer-3d-slicer-popover';
      this.slicerPanel.style.display = 'none';
      this.slicerPanel.innerHTML = `
        <div class="popover-header">
          <span class="popover-title">${lang === 'ar' ? 'مقطع هندسي داخلي' : 'Dynamic Section Slicer'}</span>
          <button type="button" class="popover-close" aria-label="Close">&times;</button>
        </div>
        <div class="slicer-controls">
          <div class="slicer-slider-row">
            <span class="slicer-axis-tag">Depth (Z)</span>
            <input type="range" class="slicer-slider" min="-12" max="12" step="0.2" value="12">
          </div>
          <div class="slicer-actions">
            <button type="button" class="btn-slicer-axis btn-axis-z active">Z-Cut</button>
            <button type="button" class="btn-slicer-axis btn-axis-y">Y-Cut</button>
            <button type="button" class="btn-slicer-reset">${lang === 'ar' ? 'إعادة' : 'Reset'}</button>
          </div>
        </div>
      `;

      this.slicerPanel.querySelector('.popover-close').addEventListener('click', () => {
        this.toggleSectionCutPanel();
      });

      const slider = this.slicerPanel.querySelector('.slicer-slider');
      slider.addEventListener('input', () => {
        this.clipPlane.constant = parseFloat(slider.value);
        this.requestRender();
      });

      const btnAxisZ = this.slicerPanel.querySelector('.btn-axis-z');
      const btnAxisY = this.slicerPanel.querySelector('.btn-axis-y');
      const axisTag = this.slicerPanel.querySelector('.slicer-axis-tag');

      btnAxisZ.addEventListener('click', () => {
        btnAxisZ.classList.add('active');
        btnAxisY.classList.remove('active');
        axisTag.textContent = 'Depth (Z)';
        this.clipPlane.normal.set(0, 0, 1);
        this.clipPlane.constant = parseFloat(slider.value);
        this.requestRender();
      });

      btnAxisY.addEventListener('click', () => {
        btnAxisY.classList.add('active');
        btnAxisZ.classList.remove('active');
        axisTag.textContent = 'Height (Y)';
        this.clipPlane.normal.set(0, -1, 0);
        this.clipPlane.constant = parseFloat(slider.value);
        this.requestRender();
      });

      this.slicerPanel.querySelector('.btn-slicer-reset').addEventListener('click', () => {
        slider.value = 12;
        this.clipPlane.constant = 12;
        this.requestRender();
      });

      this.panelsContainer.appendChild(this.slicerPanel);

      // 3. Caliper Floating Instruction Banner
      this.caliperBanner = document.createElement('div');
      this.caliperBanner.className = 'viewer-3d-caliper-banner';
      this.caliperBanner.style.display = 'none';
      this.caliperBanner.innerHTML = `
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
        <span class="caliper-text" data-i18n="caliper_hint">${lang === 'ar' ? 'انقر على نقطتين على المجسم 3D لحساب المسافة بدقة' : 'Click two points on the 3D model to measure distance'}</span>
        <button type="button" class="caliper-exit-btn">&times;</button>
      `;
      this.caliperBanner.querySelector('.caliper-exit-btn').addEventListener('click', () => {
        const btn = this.container.querySelector('.btn-measure');
        this.toggleCaliper(btn);
      });
      this.panelsContainer.appendChild(this.caliperBanner);
    }

    toggleOperate() {
      if (!this.operableMeta) return;

      this.isOperated = !this.isOperated;
      this.targetOperateFactor = this.isOperated ? 1.0 : 0.0;
      if (this.btnOperate) {
        this.btnOperate.classList.toggle('active', this.isOperated);
      }
      this.requestRender();
    }

    updateKinematics(factor) {
      // Smooth cubic bezier easing
      const f = factor < 0.5 ? 4 * factor * factor * factor : 1 - Math.pow(-2 * factor + 2, 3) / 2;

      this.animatableParts.forEach((part) => {
        if (!part.userData) return;
        const kin = part.userData.kinematic;
        const restPos = part.userData.restPosition;
        const restRot = part.userData.restRotation;

        if (kin) {
          if (kin.type === 'slide') {
            part.position.copy(restPos).addScaledVector(kin.delta, f);
          } else if (kin.type === 'casement' || kin.type === 'rotate') {
            const angle = kin.maxAngle * f;
            const offset = restPos.clone().sub(kin.pivot);
            offset.applyAxisAngle(kin.axis, angle);
            part.position.copy(kin.pivot).add(offset);
            part.rotation.copy(restRot);
            if (kin.axis.y) part.rotation.y = restRot.y + angle;
            else if (kin.axis.x) part.rotation.x = restRot.x + angle;
            else if (kin.axis.z) part.rotation.z = restRot.z + angle;
          } else if (kin.type === 'compound') {
            const angle = kin.maxAngle * f;
            const offset = restPos.clone().sub(kin.pivot);
            offset.applyAxisAngle(kin.axis, angle);
            part.position.copy(kin.pivot).add(offset).addScaledVector(kin.delta, f);
            part.rotation.copy(restRot);
            if (kin.axis.y) part.rotation.y = restRot.y + angle;
          }
        }

        // Apply exploded view on top if active
        if (this.explodeFactor > 0.001 && part.userData.explodeOffset) {
          part.position.addScaledVector(part.userData.explodeOffset, this.explodeFactor);
        }
      });
    }

    updateExplodeDisplacement(factor) {
      this.animatableParts.forEach((part) => {
        if (part.userData && part.userData.restPosition && part.userData.explodeOffset) {
          // If part has kinematics, its base pos is already modified, otherwise restPosition
          if (!part.userData.kinematic) {
            part.position.copy(part.userData.restPosition)
              .addScaledVector(part.userData.explodeOffset, factor);
          }
        }
      });
    }

    toggleExplodedView(btnElement) {
      this.isExploded = !this.isExploded;
      this.targetExplodeFactor = this.isExploded ? 1.0 : 0.0;
      if (btnElement) {
        btnElement.classList.toggle('active', this.isExploded);
      }
      this.requestRender();
    }

    toggleDimensions(btnElement) {
      this.showDimensions = !this.showDimensions;
      if (btnElement) {
        btnElement.classList.toggle('active', this.showDimensions);
      }
      this.pins.forEach((p) => {
        p.element.style.display = this.showDimensions ? 'flex' : 'none';
      });
      this.requestRender();
    }

    toggleFinishesPanel(btnElement) {
      const isVisible = this.finishesPanel.style.display === 'block';
      this.closeAllPanels();
      if (!isVisible) {
        this.finishesPanel.style.display = 'block';
        if (btnElement) btnElement.classList.add('active');
      }
    }

    applyFinish(finishId) {
      this.currentFinishId = finishId;

      // Update active class on swatches
      this.finishesPanel.querySelectorAll('.finish-swatch-item').forEach((item) => {
        item.classList.toggle('selected', item.getAttribute('data-finish') === finishId);
      });

      // Reload model geometry with new architectural materials
      this.loadModel(this.modelId, finishId);
    }

    toggleSectionCutPanel(btnElement) {
      const isVisible = this.slicerPanel.style.display === 'block';
      this.closeAllPanels();
      if (!isVisible) {
        this.isClippingActive = true;
        this.slicerPanel.style.display = 'block';
        if (btnElement) btnElement.classList.add('active');
      } else {
        this.isClippingActive = false;
        if (btnElement) btnElement.classList.remove('active');
      }

      // Apply or remove clipping planes on meshes
      if (this.currentModelGroup) {
        this.currentModelGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.clippingPlanes = this.isClippingActive ? [this.clipPlane] : [];
            child.material.clipShadows = true;
            child.material.needsUpdate = true;
          }
        });
      }
      this.requestRender();
    }

    closeAllPanels() {
      if (this.finishesPanel) this.finishesPanel.style.display = 'none';
      if (this.slicerPanel) this.slicerPanel.style.display = 'none';
      const btnF = this.container.querySelector('.btn-finishes');
      if (btnF) btnF.classList.remove('active');
    }

    // ========================================================================
    // Point-to-Point Caliper Tool
    // ========================================================================
    setupCaliperInteraction() {
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

      this.renderer.domElement.addEventListener('pointerdown', (e) => {
        if (!this.caliperMode) return;

        // Prevent orbit navigation while measuring
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.currentModelGroup.children, true);

        if (intersects.length > 0) {
          const hit = intersects[0];
          this.handleCaliperPoint(hit.point);
        }
      });
    }

    toggleCaliper(btnElement) {
      this.caliperMode = !this.caliperMode;
      this.closeAllPanels();

      if (btnElement) {
        btnElement.classList.toggle('active', this.caliperMode);
      }

      this.caliperBanner.style.display = this.caliperMode ? 'flex' : 'none';
      this.renderer.domElement.style.cursor = this.caliperMode ? 'crosshair' : 'grab';

      if (!this.caliperMode) {
        this.clearCaliper();
      }
      this.requestRender();
    }

    handleCaliperPoint(point) {
      if (this.caliperPoints.length >= 2) {
        this.clearCaliper();
      }

      this.caliperPoints.push(point.clone());

      // Create glowing point marker sphere
      const sphereGeo = new THREE.SphereGeometry(0.32, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({ color: 0xF59E0B, depthTest: false });
      const marker = new THREE.Mesh(sphereGeo, sphereMat);
      marker.position.copy(point);
      marker.renderOrder = 999;
      this.scene.add(marker);
      this.caliperMarkers.push(marker);

      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

      if (this.caliperPoints.length === 1) {
        const textElem = this.caliperBanner.querySelector('.caliper-text');
        if (textElem) {
          textElem.textContent = lang === 'ar' ? 'انقر على النقطة الثانية لحساب المسافة بدقة...' : 'Click second point to measure distance...';
        }
      } else if (this.caliperPoints.length === 2) {
        // Draw 3D measurement line between point 1 and 2
        const p1 = this.caliperPoints[0];
        const p2 = this.caliperPoints[1];

        const lineGeo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
        const lineMat = new THREE.LineDashedMaterial({
          color: 0xF59E0B,
          linewidth: 2,
          scale: 1,
          dashSize: 0.5,
          gapSize: 0.25,
          depthTest: false
        });
        this.caliperLine = new THREE.Line(lineGeo, lineMat);
        this.caliperLine.computeLineDistances();
        this.caliperLine.renderOrder = 998;
        this.scene.add(this.caliperLine);

        // Calculate millimeter dimension (1 unit = 10 mm in architectural model scale)
        const distMm = (p1.distanceTo(p2) * 10.0).toFixed(1);

        // Create floating caliper badge
        this.createCaliperBadge(distMm, p1.clone().add(p2).multiplyScalar(0.5));

        const textElem = this.caliperBanner.querySelector('.caliper-text');
        if (textElem) {
          textElem.textContent = `${lang === 'ar' ? 'المسافة المقاسة:' : 'Measured Distance:'} ${distMm} mm`;
        }
      }
      this.requestRender();
    }

    createCaliperBadge(distMm, midPoint) {
      if (this.caliperBadge) {
        this.caliperBadge.remove();
      }

      this.caliperMidPoint = midPoint;
      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

      const badge = document.createElement('div');
      badge.className = 'viewer-3d-caliper-badge';
      badge.innerHTML = `
        <span class="caliper-badge-icon">📐</span>
        <span class="caliper-badge-val">${distMm} mm</span>
        <button type="button" class="caliper-badge-clear" title="${lang === 'ar' ? 'مسح' : 'Clear'}">&times;</button>
      `;

      badge.querySelector('.caliper-badge-clear').addEventListener('click', (e) => {
        e.stopPropagation();
        this.clearCaliper();
      });

      this.caliperOverlay.appendChild(badge);
      this.caliperBadge = badge;
      this.updateCaliperBadgePosition();
    }

    updateCaliperBadgePosition() {
      if (!this.caliperBadge || !this.caliperMidPoint) return;

      const width = this.canvasContainer.clientWidth;
      const height = this.canvasContainer.clientHeight;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      const tempVec = this.caliperMidPoint.clone();
      tempVec.project(this.camera);

      if (tempVec.z > 1.0) {
        this.caliperBadge.style.display = 'none';
        return;
      }

      this.caliperBadge.style.display = 'flex';
      const x = (tempVec.x * halfWidth) + halfWidth;
      const y = -(tempVec.y * halfHeight) + halfHeight;
      this.caliperBadge.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
    }

    clearCaliper() {
      this.caliperPoints = [];
      this.caliperMarkers.forEach((m) => this.scene.remove(m));
      this.caliperMarkers = [];
      if (this.caliperLine) {
        this.scene.remove(this.caliperLine);
        this.caliperLine = null;
      }
      if (this.caliperBadge) {
        this.caliperBadge.remove();
        this.caliperBadge = null;
      }
      this.caliperMidPoint = null;

      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';
      if (this.caliperBanner) {
        const textElem = this.caliperBanner.querySelector('.caliper-text');
        if (textElem) {
          textElem.textContent = lang === 'ar' ? 'انقر على نقطتين على المجسم 3D لحساب المسافة بدقة' : 'Click two points on the 3D model to measure distance';
        }
      }
      this.requestRender();
    }

    // ========================================================================
    // High-Res Studio Snapshot (1080p Transparent PNG)
    // ========================================================================
    captureSnapshot(btnElement) {
      const origSize = new THREE.Vector2();
      this.renderer.getSize(origSize);
      const origAspect = this.camera.aspect;
      const origBg = this.scene.background;

      // Temporary 1080p render with transparent background
      const targetW = 1920;
      const targetH = 1080;

      this.scene.background = null; // Transparent!
      this.camera.aspect = targetW / targetH;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(targetW, targetH, false);

      this.renderer.render(this.scene, this.camera);
      const dataUrl = this.renderer.domElement.toDataURL('image/png');

      // Restore original canvas setup
      this.scene.background = origBg;
      this.camera.aspect = origAspect;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(origSize.x, origSize.y);
      this.requestRender();

      // Trigger automatic file download
      const link = document.createElement('a');
      link.download = `AinZara-${this.modelId.toUpperCase()}-${this.currentFinishId}-Studio.png`;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Visual feedback toast
      if (btnElement) {
        btnElement.classList.add('btn-pulse-success');
        setTimeout(() => btnElement.classList.remove('btn-pulse-success'), 1200);
      }
    }

    createHotspotPins() {
      this.hotspotsOverlay.innerHTML = '';
      this.pins = [];

      if (!this.hotspotsData) return;

      const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

      Object.keys(this.hotspotsData).forEach((key) => {
        const data = this.hotspotsData[key];
        const pin = document.createElement('div');
        pin.className = 'viewer-3d-pin';
        pin.style.display = this.showDimensions ? 'flex' : 'none';

        const label = lang === 'ar' ? data.labelAr : data.labelEn;

        pin.innerHTML = `
          <div class="pin-marker"></div>
          <div class="pin-card">${label}</div>
        `;

        this.hotspotsOverlay.appendChild(pin);
        this.pins.push({
          element: pin,
          worldPos: data.pos
        });
      });
    }

    updateHotspotsPositions() {
      if (!this.showDimensions || !this.pins.length) return;

      const width = this.canvasContainer.clientWidth;
      const height = this.canvasContainer.clientHeight;
      const halfWidth = width / 2;
      const halfHeight = height / 2;

      const tempVec = new THREE.Vector3();

      this.pins.forEach((item) => {
        tempVec.copy(item.worldPos);
        tempVec.project(this.camera);

        if (tempVec.z > 1.0) {
          item.element.style.display = 'none';
          return;
        }

        item.element.style.display = 'flex';
        const x = (tempVec.x * halfWidth) + halfWidth;
        const y = -(tempVec.y * halfHeight) + halfHeight;
        item.element.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
      });
    }

    resetCamera() {
      const startPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      const startTime = performance.now();
      const duration = 650;
      this.animatingCamera = true;

      const animateCamera = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        const ease = 1 - Math.pow(1 - progress, 3); // Ease Out Cubic

        this.camera.position.lerpVectors(startPos, this.defaultCameraPos, ease);
        this.controls.target.lerpVectors(startTarget, this.defaultCameraTarget, ease);
        this.controls.update();
        this.requestRender();

        if (progress < 1.0) {
          requestAnimationFrame(animateCamera);
        } else {
          this.animatingCamera = false;
        }
      };
      requestAnimationFrame(animateCamera);
    }

    toggleWireframe() {
      this.isWireframe = !this.isWireframe;
      if (this.currentModelGroup) {
        this.currentModelGroup.traverse((child) => {
          if (child.isMesh && child.material) {
            child.material.wireframe = this.isWireframe;
          }
        });
      }
      this.requestRender();
    }

    onResize() {
      if (!this.canvasContainer || !this.renderer || !this.camera) return;
      const width = this.canvasContainer.clientWidth;
      const height = this.canvasContainer.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.requestRender();
    }

    // Battery-saving on-demand animation loop
    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);

      let shouldRender = this.needsRender || this.animatingCamera;

      // 1. Lerp Exploded View Factor
      if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
        this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.10;
        this.updateExplodeDisplacement(this.explodeFactor);
        shouldRender = true;
      }

      // 2. Lerp Operable Kinematics Factor
      if (Math.abs(this.operateFactor - this.targetOperateFactor) > 0.001) {
        this.operateFactor += (this.targetOperateFactor - this.operateFactor) * 0.08;
        this.updateKinematics(this.operateFactor);
        shouldRender = true;
      }

      // 3. OrbitControls update
      const controlsChanged = this.controls.update();
      if (controlsChanged || this.controls.autoRotate) {
        shouldRender = true;
      }

      // Render only if state changed
      if (shouldRender) {
        this.renderer.render(this.scene, this.camera);
        this.updateHotspotsPositions();
        this.updateCaliperBadgePosition();
        this.needsRender = false;
      }
    }

    destroy() {
      if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
      }
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      if (this.controls) {
        this.controls.dispose();
      }
      if (this.renderer) {
        this.renderer.dispose();
      }
      this.container.innerHTML = '';
    }
  }

  // ==========================================================================
  // Fullscreen 3D Modal Manager
  // ==========================================================================
  let modalInstance = null;
  let modalViewer = null;

  function ensureModal() {
    if (modalInstance) return modalInstance;

    const modal = document.createElement('div');
    modal.className = 'modal-backdrop modal-3d-backdrop';
    modal.id = 'modal-3d-inspection';
    modal.innerHTML = `
      <div class="modal-window modal-3d-window">
        <div class="modal-header modal-3d-header">
          <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div class="modal-3d-badge">3D CAD INSPECTION</div>
            <div>
              <h3 class="modal-title" id="modal-3d-title">WAT 63 Thermal Break</h3>
              <div class="modal-3d-sub" id="modal-3d-series">HEKLA Series &bull; 63mm Frame Depth</div>
            </div>
          </div>
          <button type="button" class="modal-close-btn" id="modal-3d-close" aria-label="Close 3D View">&times;</button>
        </div>
        <div class="modal-3d-disclaimer">
          <div class="disclaimer-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
            <span data-i18n="badge_disclaimer_notice">IMPORTANT NOTE</span>
          </div>
          <span class="disclaimer-text" data-i18n="note_3d_disclaimer">Interactive 3D representation • This is for demonstration purposes only and may not accurately reflect physical reality • For exact manufacturing specifications refer to official 2D CAD schematic</span>
          <button type="button" class="modal-disclaimer-close-btn" title="Dismiss note / إخفاء الملاحظة" aria-label="Dismiss note">&times;</button>
        </div>
        <div class="modal-body modal-3d-body">
          <div id="modal-3d-viewport"></div>
        </div>
        <div class="modal-3d-footer">
          <div class="modal-3d-specs" id="modal-3d-specs">
            <span><strong>Air/Water:</strong> Class 4 / 9A</span>
            <span><strong>Insulation:</strong> 24mm Polyamide PA66</span>
            <span><strong>Glass:</strong> 20–42mm IGU</span>
          </div>
          <button type="button" class="btn btn-primary" id="modal-3d-rfq-btn" data-i18n="btn_rfq">Request Quote</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const closeBtn = modal.querySelector('#modal-3d-close');
    closeBtn.addEventListener('click', closeModal);

    const modalDisclaimer = modal.querySelector('.modal-3d-disclaimer');
    const modalDisclaimerClose = modal.querySelector('.modal-disclaimer-close-btn');
    if (modalDisclaimerClose && modalDisclaimer) {
      modalDisclaimerClose.addEventListener('click', () => {
        modalDisclaimer.style.display = 'none';
        if (modalViewer && modalViewer.onResize) {
          setTimeout(() => modalViewer.onResize(), 40);
        }
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const rfqBtn = modal.querySelector('#modal-3d-rfq-btn');
    rfqBtn.addEventListener('click', () => {
      const curId = rfqBtn.getAttribute('data-system');
      closeModal();
      if (window.AinZaraApp && window.AinZaraApp.openRfqModal) {
        window.AinZaraApp.openRfqModal(curId);
      }
    });

    modalInstance = modal;
    return modalInstance;
  }

  function openModal(modelId) {
    const modal = ensureModal();
    const manifest = (window.AinZaraApp && window.AinZaraApp.catalog) || {};
    const info = manifest[modelId] || { name: modelId.toUpperCase(), series: "Architectural System" };
    const lang = (window.AinZaraI18n && window.AinZaraI18n.getLang()) || 'en';

    // Set titles and specs
    const titleElem = modal.querySelector('#modal-3d-title');
    const seriesElem = modal.querySelector('#modal-3d-series');
    const specsElem = modal.querySelector('#modal-3d-specs');
    const rfqBtn = modal.querySelector('#modal-3d-rfq-btn');

    if (titleElem) titleElem.textContent = lang === 'ar' ? (info.titleAr || info.name) : (info.titleEn || info.name);
    if (seriesElem) seriesElem.textContent = `${info.series} • ${info.frameDepth || ''}`;
    if (specsElem) {
      specsElem.innerHTML = `
        <span><strong>${lang === 'ar' ? 'العزل:' : 'Insulation:'}</strong> ${info.insulation || 'Standard'}</span>
        <span><strong>${lang === 'ar' ? 'الزجاج:' : 'Glass:'}</strong> ${info.glassRange || 'IGU'}</span>
      `;
    }
    if (rfqBtn) rfqBtn.setAttribute('data-system', modelId);

    const modalDisclaimer = modal.querySelector('.modal-3d-disclaimer');
    if (modalDisclaimer) modalDisclaimer.style.display = '';

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

    if (window.AinZaraI18n && window.AinZaraI18n.updateDOM) {
      window.AinZaraI18n.updateDOM(modal);
    }

    // Mount or switch model inside modal viewport
    const viewport = modal.querySelector('#modal-3d-viewport');
    if (!modalViewer) {
      modalViewer = new Profile3DViewer(viewport, modelId, {
        showHud: true,
        allowExplode: true,
        allowDimensions: true,
        autoRotate: false
      });
    } else {
      modalViewer.loadModel(modelId);
      modalViewer.onResize();
      modalViewer.resetCamera();
    }

    // Trigger onResize to adapt to current tablet/desktop viewport dimensions
    setTimeout(() => {
      if (modalViewer && modalViewer.onResize) {
        modalViewer.onResize();
      }
    }, 80);
  }

  function closeModal() {
    if (modalInstance) {
      modalInstance.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  // Global API
  window.AinZara3D = {
    mount: function (container, modelId, options) {
      const elem = typeof container === 'string' ? document.querySelector(container) : container;
      if (!elem) return null;

      // Dispose existing instance on same element if present
      if (activeViewers.has(elem)) {
        activeViewers.get(elem).destroy();
      }

      const viewer = new Profile3DViewer(elem, modelId, options);
      activeViewers.set(elem, viewer);
      return viewer;
    },
    openModal: openModal,
    closeModal: closeModal
  };

  // Listen for language changes to update hotspot labels in real time
  document.addEventListener('languageChanged', () => {
    activeViewers.forEach((viewer) => {
      viewer.createHotspotPins();
      viewer.updateOperableButtonState();
    });
    if (modalViewer) {
      modalViewer.createHotspotPins();
      modalViewer.updateOperableButtonState();
    }
  });

  // Global click delegation for [data-open-3d] triggers
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-open-3d]');
    if (trigger) {
      e.preventDefault();
      const modelId = trigger.getAttribute('data-open-3d');
      if (modelId) {
        openModal(modelId);
      }
    }
  });

})();
