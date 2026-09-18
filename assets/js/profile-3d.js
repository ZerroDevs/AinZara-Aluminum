/**
 * AinZara-Aluminum - Universal WebGL 3D Architectural Profile Viewer
 * Features:
 * - Three.js WebGL rendering with soft industrial studio lighting
 * - OrbitControls: 360° desktop orbit & single/two-finger mobile touch controls (rotate, pinch-to-zoom, pan)
 * - Animated Exploded View mode along part normal vectors
 * - 3D-to-2D projected Dimension Hotspots with bilingual tooltips
 * - Camera Reset & Wireframe modes
 * - Inline card mounting & Fullscreen interactive 3D Modal
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
      this.options = Object.assign({
        autoRotate: false,
        showHud: true,
        allowExplode: true,
        allowDimensions: true,
        showSchematicToggle: true,
        defaultExploded: false,
        onModalOpen: null
      }, options);

      this.isExploded = this.options.defaultExploded;
      this.explodeFactor = this.isExploded ? 1.0 : 0.0;
      this.targetExplodeFactor = this.explodeFactor;
      this.showDimensions = false;
      this.isWireframe = false;
      this.animationFrameId = null;

      this.init();
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

      // 3. HUD Controls Bar
      if (this.options.showHud) {
        this.createHud();
      }

      // 4. Disclaimer Overlay
      const disclaimer = document.createElement('div');
      disclaimer.className = 'viewer-3d-disclaimer';
      const disclaimerText = (window.AinZaraI18n && window.AinZaraI18n.t('note_3d_disclaimer')) || 'Interactive 3D representation • For exact manufacturing dimensions refer to 2D CAD schematic';
      disclaimer.innerHTML = `
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
        <span data-i18n="note_3d_disclaimer">${disclaimerText}</span>
      `;
      this.container.appendChild(disclaimer);

      // Three.js Core Setup
      const width = this.canvasContainer.clientWidth || 380;
      const height = this.canvasContainer.clientHeight || 360;

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color(0xF8FAFC); // Clean Architectural Off-White Canvas

      // Camera
      this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      this.defaultCameraPos = new THREE.Vector3(18, 14, 26);
      this.defaultCameraTarget = new THREE.Vector3(0, 0, 0);
      this.camera.position.copy(this.defaultCameraPos);

      // Renderer with Antialiasing and High DPI
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      this.renderer.setSize(width, height);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 1.1;
      this.canvasContainer.appendChild(this.renderer.domElement);

      // OrbitControls with Touch Support
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.06;
      this.controls.screenSpacePanning = true;
      this.controls.minDistance = 6;
      this.controls.maxDistance = 65;
      this.controls.maxPolarAngle = Math.PI / 1.85; // Prevent viewing from straight below
      this.controls.autoRotate = this.options.autoRotate;
      this.controls.autoRotateSpeed = 1.2;
      this.controls.target.copy(this.defaultCameraTarget);

      // Studio Lighting
      this.setupLighting();

      // Load and Mount 3D Profile Model
      this.loadModel(this.modelId);

      // Bind Resize Observer
      this.resizeObserver = new ResizeObserver(() => this.onResize());
      this.resizeObserver.observe(this.canvasContainer);

      // Start Animation Loop
      this.animate = this.animate.bind(this);
      this.animate();
    }

    setupLighting() {
      // Soft Ambient Light for Shadow Fill
      const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.75);
      this.scene.add(ambientLight);

      // Key Directional Light (Industrial Sun/Key)
      const keyLight = new THREE.DirectionalLight(0xFFFFFF, 0.85);
      keyLight.position.set(20, 30, 20);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      this.scene.add(keyLight);

      // Fill Directional Light (Soft Cool Sky)
      const fillLight = new THREE.DirectionalLight(0xCBD5E1, 0.45);
      fillLight.position.set(-20, 10, -20);
      this.scene.add(fillLight);

      // Rim Light for Silhouette Definition
      const rimLight = new THREE.DirectionalLight(0x2A78B8, 0.25);
      rimLight.position.set(0, -20, 10);
      this.scene.add(rimLight);

      // Subtle Architectural Ground Shadow Grid Plane
      const shadowPlaneGeo = new THREE.PlaneGeometry(60, 60);
      const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.15 });
      const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -8.0;
      shadowPlane.receiveShadow = true;
      this.scene.add(shadowPlane);
    }

    loadModel(modelId) {
      if (this.currentModelGroup) {
        this.scene.remove(this.currentModelGroup);
      }

      this.modelId = modelId;
      const built = window.AinZaraProfileGeometries.build(modelId);
      this.currentModelGroup = built.group;
      this.hotspotsData = built.hotspots || {};

      this.scene.add(this.currentModelGroup);

      // Gather animatable parts
      this.animatableParts = [];
      this.currentModelGroup.traverse((child) => {
        if (child.isMesh && child.userData && child.userData.explodeOffset) {
          this.animatableParts.push(child);
        }
      });

      this.createHotspotPins();
    }

    createHud() {
      const hud = document.createElement('div');
      hud.className = 'viewer-3d-hud';

      // 1. Exploded View Toggle
      if (this.options.allowExplode) {
        const btnExplode = document.createElement('button');
        btnExplode.type = 'button';
        btnExplode.className = 'hud-btn btn-explode';
        btnExplode.title = 'Exploded Assembly View / منظور مفكك';
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

      // 2. Dimensions Hotspot Toggle
      if (this.options.allowDimensions) {
        const btnDim = document.createElement('button');
        btnDim.type = 'button';
        btnDim.className = 'hud-btn btn-dimensions';
        btnDim.title = 'Profile Dimensions / الأبعاد الهندسية';
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

      // 3. Camera Reset Button
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

      // 4. Fullscreen Modal Launcher
      const btnModal = document.createElement('button');
      btnModal.type = 'button';
      btnModal.className = 'hud-btn btn-fullscreen';
      btnModal.title = 'Fullscreen 3D Inspection / شاشة كاملة';
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
        // Project 3D coordinate to screen NDC (-1 to +1)
        tempVec.project(this.camera);

        // Check if point is in front of camera
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

    toggleExplodedView(btnElement) {
      this.isExploded = !this.isExploded;
      this.targetExplodeFactor = this.isExploded ? 1.0 : 0.0;
      if (btnElement) {
        btnElement.classList.toggle('active', this.isExploded);
      }
    }

    toggleDimensions(btnElement) {
      this.showDimensions = !this.showDimensions;
      if (btnElement) {
        btnElement.classList.toggle('active', this.showDimensions);
      }
      this.pins.forEach((p) => {
        p.element.style.display = this.showDimensions ? 'flex' : 'none';
      });
    }

    resetCamera() {
      // Smooth reset of camera target & position
      const startPos = this.camera.position.clone();
      const startTarget = this.controls.target.clone();
      const startTime = performance.now();
      const duration = 600;

      const animateCamera = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1.0);
        // Ease Out Cubic
        const ease = 1 - Math.pow(1 - progress, 3);

        this.camera.position.lerpVectors(startPos, this.defaultCameraPos, ease);
        this.controls.target.lerpVectors(startTarget, this.defaultCameraTarget, ease);
        this.controls.update();

        if (progress < 1.0) {
          requestAnimationFrame(animateCamera);
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
    }

    onResize() {
      if (!this.canvasContainer || !this.renderer || !this.camera) return;
      const width = this.canvasContainer.clientWidth;
      const height = this.canvasContainer.clientHeight;
      if (width === 0 || height === 0) return;

      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    }

    animate() {
      this.animationFrameId = requestAnimationFrame(this.animate);

      // Smooth Lerp for Exploded View Displacement
      if (Math.abs(this.explodeFactor - this.targetExplodeFactor) > 0.001) {
        this.explodeFactor += (this.targetExplodeFactor - this.explodeFactor) * 0.1;
        this.animatableParts.forEach((part) => {
          if (part.userData && part.userData.restPosition && part.userData.explodeOffset) {
            part.position.copy(part.userData.restPosition)
              .addScaledVector(part.userData.explodeOffset, this.explodeFactor);
          }
        });
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.updateHotspotsPositions();
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
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          <span data-i18n="note_3d_disclaimer">Interactive 3D representation • For exact manufacturing dimensions refer to official 2D CAD schematic</span>
        </div>
        <div class="modal-body modal-3d-body">
          <div id="modal-3d-viewport" style="width: 100%; height: 500px; position: relative;"></div>
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

    // Set titles
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

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';

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
    });
    if (modalViewer) {
      modalViewer.createHotspotPins();
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
