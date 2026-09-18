/**
 * AinZara-Aluminum - 3D Architectural Computational Geometry Engine
 * High-precision, mathematically authentic procedural models representing
 * the exact architectural assemblies shown in the catalog images:
 * - Corner window assemblies with mitered frames & brick reveal (WAT 63, WA 55, WA 45)
 * - Multi-rail sliding assemblies with threshold & interlock sashes (SAT 120, SLAT 64)
 * - Multi-leaf accordion bi-fold door assemblies with hinges (FAT 55, FAT 70)
 * - 4-quadrant curtain wall & structural glazing nodes (CWA 50 HV, CWA 50 SG)
 * - Skylight & roof rafter intersection nodes with steel tube (SA 65, SA 65-2)
 * - Office partition walls with barrel door hinges & acoustic cavities (IPA 30, IPA 45)
 * - Motorized vertical guillotine with roller drum & cascading sashes (GSA 130)
 */

(function () {
  'use strict';

  // Architectural Finishes Registry
  const FINISHES = {
    'ral-7016': { id: 'ral-7016', nameEn: 'RAL 7016 Anthracite Grey', nameAr: 'رمادي أنثراسيت (RAL 7016)', hex: 0x333940, css: '#333940', metalness: 0.72, roughness: 0.40 },
    'ral-9005': { id: 'ral-9005', nameEn: 'RAL 9005 Jet Black Matte', nameAr: 'أسود حالك مطفي (RAL 9005)', hex: 0x181A1D, css: '#181A1D', metalness: 0.65, roughness: 0.58 },
    'ral-9016': { id: 'ral-9016', nameEn: 'RAL 9016 Traffic White', nameAr: 'أبيض ناصع (RAL 9016)', hex: 0xE8ECF0, css: '#F3F4F6', metalness: 0.50, roughness: 0.32 },
    'ral-8014': { id: 'ral-8014', nameEn: 'RAL 8014 Sepia Brown', nameAr: 'بني داكن سيبيا (RAL 8014)', hex: 0x3E2D23, css: '#3E2D23', metalness: 0.68, roughness: 0.42 },
    'qualanod-silver': { id: 'qualanod-silver', nameEn: 'Qualanod Satin Silver (E6)', nameAr: 'أنودة فضية ساتان (Qualanod)', hex: 0xB8C2CC, css: '#B8C2CC', metalness: 0.90, roughness: 0.25 },
    'qualanod-champagne': { id: 'qualanod-champagne', nameEn: 'Qualanod Champagne Bronze', nameAr: 'أنودة شامبانيا برونز (Qualanod)', hex: 0x96826E, css: '#96826E', metalness: 0.86, roughness: 0.28 },
    'qualanod-titanium': { id: 'qualanod-titanium', nameEn: 'Qualanod Titanium Charcoal', nameAr: 'أنودة تيتانيوم فحمي (Qualanod)', hex: 0x484B52, css: '#484B52', metalness: 0.88, roughness: 0.30 }
  };

  // Shared PBR Architectural Materials
  function createMaterials(finishId) {
    const f = FINISHES[finishId] || FINISHES['ral-7016'];
    return {
      alumDark: new THREE.MeshStandardMaterial({
        color: f.hex,
        metalness: f.metalness,
        roughness: f.roughness
      }),
      alumSilver: new THREE.MeshStandardMaterial({
        color: finishId && finishId.startsWith('qualanod') ? f.hex : 0xC4CBD4,
        metalness: 0.85,
        roughness: 0.30
      }),
      alumCap: new THREE.MeshStandardMaterial({
        color: f.hex,
        metalness: f.metalness,
        roughness: f.roughness
      }),
      polyamide: new THREE.MeshStandardMaterial({
        color: 0x181C22, // Dark Charcoal PA66 Thermal Break
        metalness: 0.08,
        roughness: 0.88
      }),
      polyamideWarm: new THREE.MeshStandardMaterial({
        color: 0xA66530, // Amber/Brown Polyamide Core
        metalness: 0.08,
        roughness: 0.80
      }),
      epdm: new THREE.MeshStandardMaterial({
        color: 0x0D1117, // Deep Black EPDM Rubber Gasket
        metalness: 0.02,
        roughness: 0.95
      }),
      inox: new THREE.MeshStandardMaterial({
        color: 0xE8ECF0, // Bright Stainless Steel Inox Track
        metalness: 0.92,
        roughness: 0.20
      }),
      steelCore: new THREE.MeshStandardMaterial({
        color: 0x1A1E24, // Internal Galvanized Steel Tube
        metalness: 0.85,
        roughness: 0.45
      }),
      brick: new THREE.MeshStandardMaterial({
        color: 0x963D2E, // Terracotta Brick Wall Reveal
        metalness: 0.05,
        roughness: 0.85
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: 0xD0E6F5, // Insulated Glass with subtle cyan architectural reflection
        transmission: 0.92,
        opacity: 0.88,
        transparent: true,
        roughness: 0.08,
        ior: 1.52,
        metalness: 0.12
      })
    };
  }

  // Helper: register part with restPosition, restRotation, explodeOffset, and optional kinematic
  function addPart(group, mesh, explodeOffset, kinematic) {
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData = {
      restPosition: mesh.position.clone(),
      restRotation: mesh.rotation.clone(),
      explodeOffset: explodeOffset || new THREE.Vector3(0, 0, 0),
      kinematic: kinematic || null
    };
    group.add(mesh);
    return mesh;
  }

  // Helper: Extruded Hollow Box
  function createHollowBox(outerW, outerH, length, wallThick, mat) {
    const shape = new THREE.Shape();
    shape.moveTo(-outerW / 2, -outerH / 2);
    shape.lineTo(outerW / 2, -outerH / 2);
    shape.lineTo(outerW / 2, outerH / 2);
    shape.lineTo(-outerW / 2, outerH / 2);
    shape.closePath();

    const hole = new THREE.Path();
    const inW = outerW - 2 * wallThick;
    const inH = outerH - 2 * wallThick;
    if (inW > 0.1 && inH > 0.1) {
      hole.moveTo(-inW / 2, -inH / 2);
      hole.lineTo(inW / 2, -inH / 2);
      hole.lineTo(inW / 2, inH / 2);
      hole.lineTo(-inW / 2, inH / 2);
      hole.closePath();
      shape.holes.push(hole);
    }

    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: false
    });
    geo.center();
    return new THREE.Mesh(geo, mat);
  }

  // ==========================================================================
  // 1. WAT 63: Thermal Break Corner Window Assembly (assets/Door-Window/wat63.jpg)
  // L-shaped mitered corner with outer frame, 24mm polyamide break, casement sash, IGU glass, brick reveal
  // ==========================================================================
  function build_wat63(m) {
    const group = new THREE.Group();

    // Brick Base Reveal (L-shape beneath frame)
    const brickH = 1.6;
    const brickGeo1 = new THREE.BoxGeometry(16, brickH, 7.5);
    const brickMesh1 = new THREE.Mesh(brickGeo1, m.brick);
    brickMesh1.position.set(0, -5.5, 0);
    addPart(group, brickMesh1, new THREE.Vector3(0, -1, 0));

    const brickGeo2 = new THREE.BoxGeometry(7.5, 14, brickH);
    const brickMesh2 = new THREE.Mesh(brickGeo2, m.brick);
    brickMesh2.position.set(-4.25, 1.5, -3.75);
    addPart(group, brickMesh2, new THREE.Vector3(-1, 0, 0));

    // Outer Fixed Frame (Bottom sill & vertical jamb forming L-corner)
    const frameBottomOuter = createHollowBox(14, 2.5, 3.2, 0.35, m.alumDark);
    frameBottomOuter.position.set(1.0, -3.5, 1.8);
    addPart(group, frameBottomOuter, new THREE.Vector3(0, 0, 1.5));

    const frameBottomInner = createHollowBox(14, 2.5, 3.2, 0.35, m.alumDark);
    frameBottomInner.position.set(1.0, -3.5, -1.8);
    addPart(group, frameBottomInner, new THREE.Vector3(0, 0, -1.5));

    // 24mm Polyamide Thermal Break Bars between outer and inner frame
    const polyBar1 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 0.9), m.polyamide);
    polyBar1.position.set(1.0, -2.6, 0);
    addPart(group, polyBar1, new THREE.Vector3(0, 0, 0));

    const polyBar2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.4, 0.9), m.polyamide);
    polyBar2.position.set(1.0, -4.4, 0);
    addPart(group, polyBar2, new THREE.Vector3(0, 0, 0));

    // Vertical Frame Jamb
    const jambOuter = createHollowBox(3.2, 12, 3.2, 0.35, m.alumDark);
    jambOuter.position.set(-4.5, 1.5, 1.8);
    addPart(group, jambOuter, new THREE.Vector3(-1.5, 0, 1.5));

    const jambInner = createHollowBox(3.2, 12, 3.2, 0.35, m.alumDark);
    jambInner.position.set(-4.5, 1.5, -1.8);
    addPart(group, jambInner, new THREE.Vector3(-1.5, 0, -1.5));

    // Operable Casement Sash (L-shape corner mitered at 45°)
    const casementKin = { type: 'casement', pivot: new THREE.Vector3(-4.5, 0, 0.5), axis: new THREE.Vector3(0, 1, 0), maxAngle: -Math.PI / 2.2 };

    const sashBottom = createHollowBox(11, 2.8, 5.2, 0.35, m.alumDark);
    sashBottom.position.set(2.5, -1.0, 0.5);
    addPart(group, sashBottom, new THREE.Vector3(0, 2.5, 3.5), casementKin);

    const sashVertical = createHollowBox(2.8, 10, 5.2, 0.35, m.alumDark);
    sashVertical.position.set(-2.0, 2.8, 0.5);
    addPart(group, sashVertical, new THREE.Vector3(-2.5, 2.5, 3.5), casementKin);

    // Glazing Bead & Gasket
    const bead = new THREE.Mesh(new THREE.BoxGeometry(9.5, 0.5, 0.8), m.alumCap);
    bead.position.set(3.2, 0.5, -1.2);
    addPart(group, bead, new THREE.Vector3(0, 3.0, 4.0), casementKin);

    // Double Glazed Unit (IGU)
    const glassPane1 = new THREE.Mesh(new THREE.BoxGeometry(9.0, 9.0, 0.3), m.glass);
    glassPane1.position.set(3.5, 4.2, 0.1);
    addPart(group, glassPane1, new THREE.Vector3(0, 5.0, 4.0), casementKin);

    const glassPane2 = new THREE.Mesh(new THREE.BoxGeometry(9.0, 9.0, 0.3), m.glass);
    glassPane2.position.set(3.5, 4.2, 1.1);
    addPart(group, glassPane2, new THREE.Vector3(0, 5.0, 5.0), casementKin);

    const spacer = new THREE.Mesh(new THREE.BoxGeometry(9.0, 0.4, 0.7), m.polyamide);
    spacer.position.set(3.5, 0.8, 0.6);
    addPart(group, spacer, new THREE.Vector3(0, 4.5, 4.5), casementKin);

    group.position.set(0, -1.5, 0);

    return {
      group,
      operable: { type: 'casement', labelEn: 'Tilt & Turn', labelAr: 'قلاب ومفصلي' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(1, -3.5, 3.5), labelEn: 'Frame Depth: 63 mm', labelAr: 'عمق الإطار: 63 ملم' },
        thermalBreak: { pos: new THREE.Vector3(1, -3.5, 0), labelEn: '24 mm Polyamide PA66 Break', labelAr: 'عازل حراري بولي أميد 24 ملم' },
        glassPocket: { pos: new THREE.Vector3(3.5, 2.0, 1.5), labelEn: 'Glass Pocket: 20–42 mm IGU', labelAr: 'سماكة الزجاج: 20–42 ملم' }
      }
    };
  }

  // ==========================================================================
  // 2. WA 55: Standard Architectural Casement (assets/Door-Window/wa55.jpg)
  // L-corner window with 55mm depth, forward water drip deflector lip on sash, multi-chamber aluminum
  // ==========================================================================
  function build_wa55(m) {
    const group = new THREE.Group();

    // Brick reveal
    const brick = new THREE.Mesh(new THREE.BoxGeometry(15, 1.6, 6.5), m.brick);
    brick.position.set(0, -5.2, 0);
    addPart(group, brick, new THREE.Vector3(0, -1, 0));

    // Outer Frame (55mm depth)
    const frameBottom = createHollowBox(13, 2.6, 5.5, 0.35, m.alumDark);
    frameBottom.position.set(1.0, -3.2, 0);
    addPart(group, frameBottom, new THREE.Vector3(0, 0, 0));

    const frameJamb = createHollowBox(2.8, 12, 5.5, 0.35, m.alumDark);
    frameJamb.position.set(-4.2, 2.0, 0);
    addPart(group, frameJamb, new THREE.Vector3(-1.5, 0, 0));

    // Casement Sash with forward Water Drip Deflector Lip
    const wa55Kin = { type: 'casement', pivot: new THREE.Vector3(-4.2, 0, 0.5), axis: new THREE.Vector3(0, 1, 0), maxAngle: -Math.PI / 2.2 };

    const sashBottom = createHollowBox(10.5, 2.6, 5.0, 0.35, m.alumDark);
    sashBottom.position.set(2.2, -0.8, 0.5);
    addPart(group, sashBottom, new THREE.Vector3(0, 2.5, 3.5), wa55Kin);

    // Water Drip Lip (Angled forward nose on sash)
    const dripGeo = new THREE.BufferGeometry();
    const dripVerts = new Float32Array([
      -5.2, -0.8, 3.0,   5.2, -0.8, 3.0,   5.2, -1.8, 4.2,
      -5.2, -0.8, 3.0,   5.2, -1.8, 4.2,  -5.2, -1.8, 4.2
    ]);
    dripGeo.setAttribute('position', new THREE.BufferAttribute(dripVerts, 3));
    dripGeo.computeVertexNormals();
    const dripMesh = new THREE.Mesh(dripGeo, m.alumDark);
    dripMesh.position.set(2.2, 0, 0);
    addPart(group, dripMesh, new THREE.Vector3(0, 2.5, 3.5), wa55Kin);

    const sashJamb = createHollowBox(2.6, 10, 5.0, 0.35, m.alumDark);
    sashJamb.position.set(-1.8, 3.0, 0.5);
    addPart(group, sashJamb, new THREE.Vector3(-2.0, 2.5, 3.5), wa55Kin);

    // Double Glazing (IGU)
    const glassPane1 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8.5, 0.3), m.glass);
    glassPane1.position.set(3.2, 4.5, 0.0);
    addPart(group, glassPane1, new THREE.Vector3(0, 5.0, 3.5), wa55Kin);

    const glassPane2 = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8.5, 0.3), m.glass);
    glassPane2.position.set(3.2, 4.5, 0.9);
    addPart(group, glassPane2, new THREE.Vector3(0, 5.0, 4.5), wa55Kin);

    group.position.set(0, -1.5, 0);

    return {
      group,
      operable: { type: 'casement', labelEn: 'Open Sash', labelAr: 'فتح الدلفة' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(1, -3.2, 3.0), labelEn: 'Frame Depth: 55 mm', labelAr: 'عمق الحلق: 55 ملم' },
        dripLip: { pos: new THREE.Vector3(2.2, -1.2, 4.2), labelEn: 'Integrated Water Drip Lip', labelAr: 'أنف تصريف ومصد مياه مدمج' },
        glassPocket: { pos: new THREE.Vector3(3.2, 2.0, 1.2), labelEn: 'Glass Pocket: 4–32 mm', labelAr: 'سماكة الزجاج: 4–32 ملم' }
      }
    };
  }

  // ==========================================================================
  // 3. WA 45: Economic Non-Thermal Casement (assets/Door-Window/wa45.jpg)
  // Slim 45mm L-corner window with single-chamber non-thermal aluminum
  // ==========================================================================
  function build_wa45(m) {
    const group = new THREE.Group();

    // Brick reveal
    const brick = new THREE.Mesh(new THREE.BoxGeometry(14, 1.5, 5.5), m.brick);
    brick.position.set(0, -5.0, 0);
    addPart(group, brick, new THREE.Vector3(0, -1, 0));

    // Outer Frame (Slim 45mm depth)
    const frameBottom = createHollowBox(12, 2.4, 4.5, 0.3, m.alumDark);
    frameBottom.position.set(1.0, -3.1, 0);
    addPart(group, frameBottom, new THREE.Vector3(0, 0, 0));

    const frameJamb = createHollowBox(2.5, 11, 4.5, 0.3, m.alumDark);
    frameJamb.position.set(-3.8, 1.8, 0);
    addPart(group, frameJamb, new THREE.Vector3(-1.5, 0, 0));

    // Slim Casement Sash (45mm depth)
    const wa45Kin = { type: 'casement', pivot: new THREE.Vector3(-3.8, 0, 0.4), axis: new THREE.Vector3(0, 1, 0), maxAngle: -Math.PI / 2.2 };

    const sashBottom = createHollowBox(9.5, 2.4, 4.2, 0.3, m.alumDark);
    sashBottom.position.set(2.0, -0.9, 0.4);
    addPart(group, sashBottom, new THREE.Vector3(0, 2.5, 3.5), wa45Kin);

    const sashJamb = createHollowBox(2.4, 9.5, 4.2, 0.3, m.alumDark);
    sashJamb.position.set(-1.6, 2.7, 0.4);
    addPart(group, sashJamb, new THREE.Vector3(-2.0, 2.5, 3.5), wa45Kin);

    // Glass pane
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(8.0, 8.0, 0.35), m.glass);
    glassPane.position.set(3.0, 4.2, 0.4);
    addPart(group, glassPane, new THREE.Vector3(0, 5.0, 3.5), wa45Kin);

    group.position.set(0, -1.5, 0);

    return {
      group,
      operable: { type: 'casement', labelEn: 'Open Sash', labelAr: 'فتح الدلفة' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(1, -3.1, 2.5), labelEn: 'Frame Depth: 45 mm', labelAr: 'عمق الحلق: 45 ملم' },
        solidExtrusion: { pos: new THREE.Vector3(2.0, -0.9, 2.5), labelEn: 'Non-Thermal Hollow Chamber', labelAr: 'قطاع اقتصادي أحادي التجويف' },
        glassPocket: { pos: new THREE.Vector3(3.0, 1.8, 0.8), labelEn: 'Glass Range: 4–24 mm', labelAr: 'سماكة الزجاج: 4–24 ملم' }
      }
    };
  }

  // ==========================================================================
  // 4. SAT 120: Lift & Slide Heavy Duty (assets/Sliding/sat120.jpg)
  // Wide 2-track threshold frame (120mm), central polyamide break, sliding sash seated on track, IGU glass
  // ==========================================================================
  function build_sat120(m) {
    const group = new THREE.Group();

    // 1. Dual-Track Threshold Frame (120mm depth)
    const baseOuter = createHollowBox(16, 2.2, 5.6, 0.35, m.alumDark);
    baseOuter.position.set(0, -4.0, 3.2);
    addPart(group, baseOuter, new THREE.Vector3(0, 0, 2.0));

    const baseInner = createHollowBox(16, 2.2, 5.6, 0.35, m.alumDark);
    baseInner.position.set(0, -4.0, -3.2);
    addPart(group, baseInner, new THREE.Vector3(0, 0, -2.0));

    // Central Polyamide Thermal Break dividing 2 tracks
    const baseThermal = new THREE.Mesh(new THREE.BoxGeometry(16, 0.6, 1.2), m.polyamide);
    baseThermal.position.set(0, -3.6, 0);
    addPart(group, baseThermal, new THREE.Vector3(0, 0, 0));

    // Stainless Steel Inox Running Rails (Raised tracks)
    const inoxRail1 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 0.4), m.inox);
    inoxRail1.position.set(0, -2.7, 3.2);
    addPart(group, inoxRail1, new THREE.Vector3(0, 1.0, 2.0));

    const inoxRail2 = new THREE.Mesh(new THREE.BoxGeometry(16, 0.5, 0.4), m.inox);
    inoxRail2.position.set(0, -2.7, -3.2);
    addPart(group, inoxRail2, new THREE.Vector3(0, 1.0, -2.0));

    // 2. Operable Sliding Sash (Riding on front track)
    const satKin = { type: 'slide', delta: new THREE.Vector3(6.0, 0, 0) };

    const sashBottom = createHollowBox(12, 3.2, 5.0, 0.35, m.alumDark);
    sashBottom.position.set(1.5, -0.8, 3.2);
    addPart(group, sashBottom, new THREE.Vector3(0, 2.5, 3.0), satKin);

    const sashStile = createHollowBox(3.0, 10, 5.0, 0.35, m.alumDark);
    sashStile.position.set(-3.0, 3.8, 3.2);
    addPart(group, sashStile, new THREE.Vector3(-2.0, 2.5, 3.0), satKin);

    // Sash Polyamide Break
    const sashThermal = new THREE.Mesh(new THREE.BoxGeometry(12, 0.5, 1.0), m.polyamide);
    sashThermal.position.set(1.5, 0.2, 3.2);
    addPart(group, sashThermal, new THREE.Vector3(0, 2.8, 3.0), satKin);

    // Thick Double Glazed Unit (IGU 24-38mm)
    const glassPane1 = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 0.35), m.glass);
    glassPane1.position.set(2.5, 5.2, 2.7);
    addPart(group, glassPane1, new THREE.Vector3(0, 5.0, 2.5), satKin);

    const glassPane2 = new THREE.Mesh(new THREE.BoxGeometry(10, 8.5, 0.35), m.glass);
    glassPane2.position.set(2.5, 5.2, 3.7);
    addPart(group, glassPane2, new THREE.Vector3(0, 5.0, 4.0), satKin);

    // 3. Stepped Rear Panel on back track
    const rearSash = createHollowBox(8, 9.0, 4.5, 0.35, m.alumDark);
    rearSash.position.set(-3.5, 2.5, -3.2);
    addPart(group, rearSash, new THREE.Vector3(-2.0, 1.0, -3.0));

    group.position.set(0, -1.0, 0);

    return {
      group,
      operable: { type: 'slide', labelEn: 'Slide Sash', labelAr: 'سحب الدلفة' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(0, -4.0, 6.0), labelEn: 'Frame Depth: 120 mm (2-Rail)', labelAr: 'عمق المسار: 120 ملم' },
        inoxRail: { pos: new THREE.Vector3(0, -2.5, 3.2), labelEn: 'Heavy Inox Stainless Track', labelAr: 'مسار ستانلس ستيل فائق السلاسة' },
        sashCarriage: { pos: new THREE.Vector3(1.5, -0.5, 3.2), labelEn: 'Lift & Slide 300kg Mechanism', labelAr: 'عجلات رفع وسحب هيدروليكية حتى 300 كجم' }
      }
    };
  }

  // ==========================================================================
  // 5. SLAT 64: Thermal Monorail / Multi-Rail Sliding (assets/Sliding/slat64.jpg)
  // 2-panel sliding window cut unit with bottom sill, outer jamb, front & rear sliding sashes
  // ==========================================================================
  function build_slat64(m) {
    const group = new THREE.Group();

    // Bottom Sill Frame (64mm depth)
    const sill = createHollowBox(14, 1.8, 6.4, 0.35, m.alumDark);
    sill.position.set(0, -4.5, 0);
    addPart(group, sill, new THREE.Vector3(0, -1.0, 0));

    // Left Vertical Frame Jamb
    const jamb = createHollowBox(2.2, 12, 6.4, 0.35, m.alumDark);
    jamb.position.set(-5.9, 1.4, 0);
    addPart(group, jamb, new THREE.Vector3(-2.0, 0, 0));

    // Front Sliding Panel (with rounded pull stile)
    const slatKin = { type: 'slide', delta: new THREE.Vector3(-5.0, 0, 0) };

    const frontSashBottom = createHollowBox(10, 1.8, 3.4, 0.3, m.alumDark);
    frontSashBottom.position.set(0.2, -2.8, 1.6);
    addPart(group, frontSashBottom, new THREE.Vector3(0, 0, 2.5), slatKin);

    const frontStile = createHollowBox(2.2, 10, 3.4, 0.3, m.alumDark);
    frontStile.position.set(4.1, 2.2, 1.6);
    addPart(group, frontStile, new THREE.Vector3(1.5, 0, 2.5), slatKin);

    const frontGlass = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8.5, 0.35), m.glass);
    frontGlass.position.set(0.0, 3.2, 1.6);
    addPart(group, frontGlass, new THREE.Vector3(0, 2.0, 3.5), slatKin);

    // Rear Sliding Panel (stepped behind)
    const rearSashBottom = createHollowBox(10, 1.8, 3.4, 0.3, m.alumDark);
    rearSashBottom.position.set(-1.0, -2.8, -1.6);
    addPart(group, rearSashBottom, new THREE.Vector3(0, 0, -2.5));

    const rearStile = createHollowBox(2.2, 10, 3.4, 0.3, m.alumDark);
    rearStile.position.set(3.0, 2.2, -1.6);
    addPart(group, rearStile, new THREE.Vector3(1.0, 0, -2.5));

    const rearGlass = new THREE.Mesh(new THREE.BoxGeometry(8.5, 8.5, 0.35), m.glass);
    rearGlass.position.set(-1.0, 3.2, -1.6);
    addPart(group, rearGlass, new THREE.Vector3(0, 2.0, -3.5));

    group.position.set(0, -1.0, 0);

    return {
      group,
      operable: { type: 'slide', labelEn: 'Slide Sash', labelAr: 'سحب الدلفة' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(0, -4.5, 3.4), labelEn: 'Frame Depth: 64 mm', labelAr: 'عمق الإطار: 64 ملم' },
        frontSash: { pos: new THREE.Vector3(4.1, 2.2, 2.0), labelEn: 'Front Sliding Sash (38mm)', labelAr: 'الدلفة الأمامية المنزلقة 38 ملم' },
        rearSash: { pos: new THREE.Vector3(3.0, 2.2, -1.8), labelEn: 'Interlock Secondary Sash', labelAr: 'الدلفة الخلفية المتداخلة' }
      }
    };
  }

  // ==========================================================================
  // 6. FAT 55: Accordion Bi-Fold Door (assets/Folding-Door/fat55.jpg)
  // 3-leaf folding door in zig-zag accordion layout with bottom track & multi-barrel black hinges
  // ==========================================================================
  function build_fat55(m) {
    const group = new THREE.Group();

    // Diagonal Bottom Guide Track
    const track = createHollowBox(18, 1.0, 2.2, 0.25, m.alumDark);
    track.rotation.y = Math.PI / 6;
    track.position.set(0, -4.5, 0);
    addPart(group, track, new THREE.Vector3(0, -1, 0));

    // Left Wall Jamb
    const jamb = createHollowBox(1.8, 11, 3.5, 0.3, m.alumDark);
    jamb.position.set(-5.5, 1.0, -2.0);
    addPart(group, jamb, new THREE.Vector3(-2.0, 0, 0));

    // Accordion fold kinematics
    const kinF1 = { type: 'rotate', pivot: new THREE.Vector3(-5.3, 1.0, -1.8), axis: new THREE.Vector3(0, 1, 0), maxAngle: -0.6 };
    const kinF2 = { type: 'compound', delta: new THREE.Vector3(-2.8, 0, -1.2), pivot: new THREE.Vector3(0.6, 1.0, 0.6), axis: new THREE.Vector3(0, 1, 0), maxAngle: 0.8 };
    const kinF3 = { type: 'compound', delta: new THREE.Vector3(-5.2, 0, -2.0), pivot: new THREE.Vector3(4.6, 1.0, 2.2), axis: new THREE.Vector3(0, 1, 0), maxAngle: -0.7 };
    const kinH2 = { type: 'slide', delta: new THREE.Vector3(-2.0, 0, -0.8) };
    const kinH3 = { type: 'slide', delta: new THREE.Vector3(-4.5, 0, -1.6) };

    // Leaf 1 (Leftmost, angled)
    const leaf1 = new THREE.Group();
    const f1 = createHollowBox(5.5, 9.5, 1.2, 0.25, m.alumDark);
    const g1 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 7.8, 0.3), m.glass);
    leaf1.add(f1); leaf1.add(g1);
    leaf1.rotation.y = -Math.PI / 5;
    leaf1.position.set(-3.2, 1.0, -0.8);
    addPart(group, leaf1, new THREE.Vector3(-1.5, 1.0, -1.5), kinF1);

    // Leaf 2 (Middle, angled opposite)
    const leaf2 = new THREE.Group();
    const f2 = createHollowBox(5.5, 9.5, 1.2, 0.25, m.alumDark);
    const g2 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 7.8, 0.3), m.glass);
    leaf2.add(f2); leaf2.add(g2);
    leaf2.rotation.y = Math.PI / 4;
    leaf2.position.set(0.6, 1.0, 0.6);
    addPart(group, leaf2, new THREE.Vector3(0, 1.0, 2.0), kinF2);

    // Leaf 3 (Right, angled forward)
    const leaf3 = new THREE.Group();
    const f3 = createHollowBox(5.5, 9.5, 1.2, 0.25, m.alumDark);
    const g3 = new THREE.Mesh(new THREE.BoxGeometry(4.2, 7.8, 0.3), m.glass);
    leaf3.add(f3); leaf3.add(g3);
    leaf3.rotation.y = -Math.PI / 6;
    leaf3.position.set(4.6, 1.0, 2.2);
    addPart(group, leaf3, new THREE.Vector3(2.5, 1.0, 3.5), kinF3);

    // Barrel Hinges connecting leaves
    const hGeo = new THREE.CylinderGeometry(0.3, 0.3, 2.0, 16);
    const h1 = new THREE.Mesh(hGeo, m.epdm);
    h1.position.set(-5.3, 0.5, -1.8);
    addPart(group, h1, new THREE.Vector3(-1.8, 0, 0));

    const h2 = new THREE.Mesh(hGeo, m.epdm);
    h2.position.set(-1.3, 0.5, 0.0);
    addPart(group, h2, new THREE.Vector3(0, 1.0, 1.0), kinH2);

    const h3 = new THREE.Mesh(hGeo, m.epdm);
    h3.position.set(2.6, 0.5, 1.4);
    addPart(group, h3, new THREE.Vector3(1.5, 1.0, 2.5), kinH3);

    group.position.set(0, -1.0, 0);

    return {
      group,
      operable: { type: 'bifold', labelEn: 'Accordion Fold', labelAr: 'طي أوكورديون' },
      hotspots: {
        leafDepth: { pos: new THREE.Vector3(0.6, 2.0, 1.0), labelEn: 'Leaf Depth: 55 mm', labelAr: 'سماكة الدلفة: 55 ملم' },
        hinge: { pos: new THREE.Vector3(2.6, 0.5, 1.6), labelEn: 'Heavy Bi-Fold Multi-Hinge', labelAr: 'مفصلات طي أسطوانية معززة' },
        track: { pos: new THREE.Vector3(0, -4.5, 1.5), labelEn: 'Bottom Guide Carriage Channel', labelAr: 'مجرى توجيه سفلي مانع للاهتزاز' }
      }
    };
  }

  // ==========================================================================
  // 7. FAT 70: Heavy-Duty Thermal Break Bi-Fold (assets/Folding-Door/fat70.jpg)
  // 2 folding leaves in sharp V-angle with thick 70mm profiles, visible polyamide thermal breaks
  // ==========================================================================
  function build_fat70(m) {
    const group = new THREE.Group();

    // Bottom Track (70mm depth)
    const track = createHollowBox(16, 1.4, 4.0, 0.35, m.alumDark);
    track.position.set(0, -4.5, 0);
    addPart(group, track, new THREE.Vector3(0, -1.0, 0));

    // Left Wall Jamb with thermal break
    const jamb = createHollowBox(2.2, 11, 4.5, 0.35, m.alumDark);
    jamb.position.set(-5.0, 1.0, -1.5);
    addPart(group, jamb, new THREE.Vector3(-2.0, 0, 0));

    const kinF1 = { type: 'rotate', pivot: new THREE.Vector3(-5.0, 1.0, -1.5), axis: new THREE.Vector3(0, 1, 0), maxAngle: -0.65 };
    const kinF2 = { type: 'compound', delta: new THREE.Vector3(-3.5, 0, -1.0), pivot: new THREE.Vector3(2.5, 1.0, 0.0), axis: new THREE.Vector3(0, 1, 0), maxAngle: 0.85 };

    // Leaf 1 (Left, V-angled)
    const leaf1 = new THREE.Group();
    const f1Outer = createHollowBox(7.0, 10, 1.8, 0.3, m.alumDark);
    f1Outer.position.set(0, 0, 1.2);
    const f1Inner = createHollowBox(7.0, 10, 1.8, 0.3, m.alumDark);
    f1Inner.position.set(0, 0, -1.2);
    const poly1 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 9.8, 0.8), m.polyamideWarm);
    const g1 = new THREE.Mesh(new THREE.BoxGeometry(5.4, 8.2, 0.4), m.glass);
    leaf1.add(f1Outer); leaf1.add(f1Inner); leaf1.add(poly1); leaf1.add(g1);
    leaf1.rotation.y = -Math.PI / 4;
    leaf1.position.set(-2.5, 1.0, 0.0);
    addPart(group, leaf1, new THREE.Vector3(-1.5, 1.0, -1.0), kinF1);

    // Leaf 2 (Right, V-angled meeting leaf 1)
    const leaf2 = new THREE.Group();
    const f2Outer = createHollowBox(7.0, 10, 1.8, 0.3, m.alumDark);
    f2Outer.position.set(0, 0, 1.2);
    const f2Inner = createHollowBox(7.0, 10, 1.8, 0.3, m.alumDark);
    f2Inner.position.set(0, 0, -1.2);
    const poly2 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 9.8, 0.8), m.polyamideWarm);
    const g2 = new THREE.Mesh(new THREE.BoxGeometry(5.4, 8.2, 0.4), m.glass);
    leaf2.add(f2Outer); leaf2.add(f2Inner); leaf2.add(poly2); leaf2.add(g2);
    leaf2.rotation.y = Math.PI / 4;
    leaf2.position.set(2.5, 1.0, 0.0);
    addPart(group, leaf2, new THREE.Vector3(2.0, 1.0, 2.0), kinF2);

    // Heavy meeting stile on leaf 2
    const meetingStile = createHollowBox(1.5, 10.2, 4.2, 0.3, m.alumDark);
    meetingStile.position.set(4.8, 1.0, 1.8);
    addPart(group, meetingStile, new THREE.Vector3(3.0, 1.0, 2.5), kinF2);

    group.position.set(0, -1.0, 0);

    return {
      group,
      operable: { type: 'bifold', labelEn: 'Accordion Fold', labelAr: 'طي أوكورديون' },
      hotspots: {
        frameDepth: { pos: new THREE.Vector3(0, -4.5, 2.5), labelEn: 'Frame Depth: 70 mm', labelAr: 'عمق الإطار: 70 ملم' },
        polyamide: { pos: new THREE.Vector3(-2.5, 1.0, 0), labelEn: '30 mm Polyamide Thermal Barrier', labelAr: 'عازل حراري بولي أميد 30 ملم' },
        glassRange: { pos: new THREE.Vector3(2.5, 3.0, 0), labelEn: 'Glass Range: 24–44 mm IGU', labelAr: 'سماكة الزجاج: 24–44 ملم' }
      }
    };
  }

  // ==========================================================================
  // 8. CWA 50 HV: Semi-Structural Curtain Wall (assets/Facade/CWA50HV.jpg)
  // 4-quadrant curtain wall intersection with structural mullion, transom, caps, and concealed operable vent (HV)
  // ==========================================================================
  function build_CWA50HV(m) {
    const group = new THREE.Group();

    // Vertical Structural Mullion (50mm face width, 120mm deep hollow back)
    const mullion = createHollowBox(2.2, 16, 8.0, 0.35, m.alumSilver);
    mullion.position.set(0, 0, -4.5);
    addPart(group, mullion, new THREE.Vector3(0, 0, -2.0));

    // Horizontal Transom (extending to right)
    const transom = createHollowBox(7.5, 2.2, 7.5, 0.35, m.alumSilver);
    transom.position.set(4.0, 0, -4.5);
    addPart(group, transom, new THREE.Vector3(2.0, 0, -2.0));

    // 4 Glass Quadrants
    const gTopLeft = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.5, 0.4), m.glass);
    gTopLeft.position.set(-3.5, 3.5, 0);
    addPart(group, gTopLeft, new THREE.Vector3(-1.5, 1.5, 2.0));

    const gBottomLeft = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.5, 0.4), m.glass);
    gBottomLeft.position.set(-3.5, -3.5, 0);
    addPart(group, gBottomLeft, new THREE.Vector3(-1.5, -1.5, 2.0));

    const gBottomRight = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.5, 0.4), m.glass);
    gBottomRight.position.set(3.5, -3.5, 0);
    addPart(group, gBottomRight, new THREE.Vector3(1.5, -1.5, 2.0));

    // Top-Right Quadrant: Concealed Operable Vent Sash (HV) - Top-hung outward projector
    const cwaKin = { type: 'rotate', pivot: new THREE.Vector3(3.5, 6.75, 0), axis: new THREE.Vector3(1, 0, 0), maxAngle: 0.38 };

    const hvSash = createHollowBox(6.5, 6.5, 2.4, 0.25, m.alumSilver);
    hvSash.position.set(3.5, 3.5, -1.2);
    addPart(group, hvSash, new THREE.Vector3(2.5, 2.5, 1.5), cwaKin);

    const gTopRight = new THREE.Mesh(new THREE.BoxGeometry(6.5, 6.5, 0.4), m.glass);
    gTopRight.position.set(3.5, 3.5, 0);
    addPart(group, gTopRight, new THREE.Vector3(2.5, 2.5, 3.0), cwaKin);

    // Exterior Vertical & Horizontal Pressure Caps (50mm width)
    const capVert = new THREE.Mesh(new THREE.BoxGeometry(0.8, 16, 0.6), m.alumCap);
    capVert.position.set(0, 0, 0.5);
    addPart(group, capVert, new THREE.Vector3(0, 0, 4.0));

    const capHoriz = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 0.6), m.alumCap);
    capHoriz.position.set(0, 0, 0.5);
    addPart(group, capHoriz, new THREE.Vector3(0, 0, 4.0));

    return {
      group,
      operable: { type: 'projected', labelEn: 'Project Outward', labelAr: 'فتح قلاب للخارج' },
      hotspots: {
        faceWidth: { pos: new THREE.Vector3(0, 0, 0.8), labelEn: 'Face Width: 50 mm', labelAr: 'عرض الواجهة: 50 ملم' },
        mullionDepth: { pos: new THREE.Vector3(0, 3, -8.0), labelEn: 'Mullion Depth: 80–180 mm', labelAr: 'عمق العارضة الهيكلية: 80–180 ملم' },
        hvVent: { pos: new THREE.Vector3(3.5, 3.5, 0.5), labelEn: 'Concealed Operable Vent (HV)', labelAr: 'فتحة تهوية مخفية تماماً من الخارج' }
      }
    };
  }

  // ==========================================================================
  // 9. CWA 50 SG: Full Structural Glazing Facade (assets/Facade/CWA50sg.jpg)
  // 4-quadrant flush structural silicone glazing node (ZERO exterior aluminum caps!)
  // ==========================================================================
  function build_CWA50sg(m) {
    const group = new THREE.Group();

    // Heavy Structural Mullion (50mm width, 160mm deep hollow body)
    const mullion = createHollowBox(2.4, 16, 10.0, 0.4, m.alumSilver);
    mullion.position.set(0, 0, -5.5);
    addPart(group, mullion, new THREE.Vector3(0, 0, -2.0));

    // Horizontal Transom
    const transom = createHollowBox(7.5, 2.4, 9.5, 0.4, m.alumSilver);
    transom.position.set(4.0, 0, -5.5);
    addPart(group, transom, new THREE.Vector3(2.0, 0, -2.0));

    // Internal Structural Glazing Toggle Blocks
    const toggleH = new THREE.Mesh(new THREE.BoxGeometry(0.6, 15, 1.2), m.polyamide);
    toggleH.position.set(0, 0, -0.7);
    addPart(group, toggleH, new THREE.Vector3(0, 0, 1.0));

    // 4 Flush Structural Glass Quadrants (No visible aluminum caps on exterior!)
    const g1 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.8, 0.45), m.glass);
    g1.position.set(-3.6, 3.6, 0.1);
    addPart(group, g1, new THREE.Vector3(-1.5, 1.5, 3.0));

    const g2 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.8, 0.45), m.glass);
    g2.position.set(-3.6, -3.6, 0.1);
    addPart(group, g2, new THREE.Vector3(-1.5, -1.5, 3.0));

    const g3 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.8, 0.45), m.glass);
    g3.position.set(3.6, -3.6, 0.1);
    addPart(group, g3, new THREE.Vector3(1.5, -1.5, 3.0));

    const g4 = new THREE.Mesh(new THREE.BoxGeometry(6.8, 6.8, 0.45), m.glass);
    g4.position.set(3.6, 3.6, 0.1);
    addPart(group, g4, new THREE.Vector3(1.5, 1.5, 3.0));

    // Continuous Structural Silicone Joint Seam in between panes
    const siliconeVert = new THREE.Mesh(new THREE.BoxGeometry(0.3, 15.5, 0.4), m.epdm);
    siliconeVert.position.set(0, 0, 0.1);
    addPart(group, siliconeVert, new THREE.Vector3(0, 0, 3.5));

    const siliconeHoriz = new THREE.Mesh(new THREE.BoxGeometry(15.5, 0.3, 0.4), m.epdm);
    siliconeHoriz.position.set(0, 0, 0.1);
    addPart(group, siliconeHoriz, new THREE.Vector3(0, 0, 3.5));

    return {
      group,
      hotspots: {
        flushGlass: { pos: new THREE.Vector3(0, 0, 0.5), labelEn: 'Frameless Structural Glazing (SG)', labelAr: 'واجهة زجاجية هيكلية بالكامل بدون بروز' },
        mullionDepth: { pos: new THREE.Vector3(0, 3, -10.0), labelEn: 'Mullion Depth: 100–220 mm', labelAr: 'عمق العارضة الهيكلية: 100–220 ملم' },
        siliconeJoint: { pos: new THREE.Vector3(0, 2.5, 0.2), labelEn: 'Weatherproof Silicone Joint', labelAr: 'حشوة سيليكون إنشائي مانع لتسرب الهواء' }
      }
    };
  }

  // ==========================================================================
  // 10. SA 65: Skylight & Roof Glazing Node (assets/Roof/sa65.jpg)
  // Cross-shaped skylight node with T-spine rafter, dual condensation gutters, 4 glass panes, cross cap
  // ==========================================================================
  function build_sa65(m) {
    const group = new THREE.Group();

    // Bottom Structural T-Spine Rafter
    const rafterGeo = new THREE.BufferGeometry();
    const rafterVerts = new Float32Array([
      -0.6, 0, -7,   0.6, 0, -7,   0.6, -4, -7,
      -0.6, 0, -7,   0.6, -4, -7, -0.6, -4, -7,
      -0.6, 0,  7,   0.6, 0,  7,   0.6, -4,  7,
      -0.6, 0,  7,   0.6, -4,  7, -0.6, -4,  7
    ]);
    rafterGeo.setAttribute('position', new THREE.BufferAttribute(rafterVerts, 3));
    rafterGeo.computeVertexNormals();
    const rafter = new THREE.Mesh(new THREE.BoxGeometry(1.2, 5.0, 14), m.alumSilver);
    rafter.position.set(0, -2.5, 0);
    addPart(group, rafter, new THREE.Vector3(0, -2.0, 0));

    // Dual Condensation Drainage Gutters (running along both sides)
    const gutterLeft = createHollowBox(2.2, 1.2, 14, 0.25, m.alumSilver);
    gutterLeft.position.set(-1.6, -0.5, 0);
    addPart(group, gutterLeft, new THREE.Vector3(-1.0, 0, 0));

    const gutterRight = createHollowBox(2.2, 1.2, 14, 0.25, m.alumSilver);
    gutterRight.position.set(1.6, -0.5, 0);
    addPart(group, gutterRight, new THREE.Vector3(1.0, 0, 0));

    // 4 Sloped Glass Panes meeting at cross
    const g1 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 5.5), m.glass);
    g1.position.set(-3.5, 0.8, -3.5);
    addPart(group, g1, new THREE.Vector3(-1.5, 1.5, -1.5));

    const g2 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 5.5), m.glass);
    g2.position.set(-3.5, 0.8, 3.5);
    addPart(group, g2, new THREE.Vector3(-1.5, 1.5, 1.5));

    const g3 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 5.5), m.glass);
    g3.position.set(3.5, 0.8, -3.5);
    addPart(group, g3, new THREE.Vector3(1.5, 1.5, -1.5));

    const g4 = new THREE.Mesh(new THREE.BoxGeometry(5.5, 0.35, 5.5), m.glass);
    g4.position.set(3.5, 0.8, 3.5);
    addPart(group, g4, new THREE.Vector3(1.5, 1.5, 1.5));

    // Cross-Shaped Exterior Aluminum Pressure Cap
    const cap1 = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 14), m.alumCap);
    cap1.position.set(0, 1.4, 0);
    addPart(group, cap1, new THREE.Vector3(0, 3.0, 0));

    const cap2 = new THREE.Mesh(new THREE.BoxGeometry(14, 0.8, 1.6), m.alumCap);
    cap2.position.set(0, 1.4, 0);
    addPart(group, cap2, new THREE.Vector3(0, 3.0, 0));

    return {
      group,
      hotspots: {
        rafterSpine: { pos: new THREE.Vector3(0, -3.5, 0), labelEn: 'Structural T-Spine Rafter', labelAr: 'عارضة سقف إنشائية على شكل T' },
        gutters: { pos: new THREE.Vector3(1.8, -0.5, 2.0), labelEn: 'Condensation Drainage Gutters', labelAr: 'قنوات تصريف داخلية لمياه التكثف' },
        pressureCap: { pos: new THREE.Vector3(0, 1.8, 0), labelEn: 'Weather-Tight Cross Cap', labelAr: 'غطاء ضغط خارجي متقاطع مانع للأمطار' }
      }
    };
  }

  // ==========================================================================
  // 11. SA 65-2: Reinforced Wintergarden Roof (assets/Roof/sa65-2.jpg)
  // 65mm aluminum rafter (565-2101) with internal steel reinforcement tube (565-7101) & 61mm cap (565-6203)
  // ==========================================================================
  function build_sa65_2(m) {
    const group = new THREE.Group();

    // Aluminum Rafter Profile (565-2101, 65mm face)
    const rafterBody = createHollowBox(4.5, 6.5, 12, 0.35, m.alumSilver);
    rafterBody.position.set(0, 0.5, 0);
    addPart(group, rafterBody, new THREE.Vector3(0, 0, 0));

    // Internal Galvanized Steel Reinforcement Tube (565-7101) fitted inside cavity
    const steelTube = new THREE.Mesh(new THREE.BoxGeometry(3.6, 4.8, 11.5), m.steelCore);
    steelTube.position.set(0, 0.5, 0);
    addPart(group, steelTube, new THREE.Vector3(0, 0, -4.0));

    // Dual Condensation Troughs on sides
    const troughL = createHollowBox(1.5, 1.2, 12, 0.25, m.alumSilver);
    troughL.position.set(-2.8, -1.8, 0);
    addPart(group, troughL, new THREE.Vector3(-1.5, 0, 0));

    const troughR = createHollowBox(1.5, 1.2, 12, 0.25, m.alumSilver);
    troughR.position.set(2.8, -1.8, 0);
    addPart(group, troughR, new THREE.Vector3(1.5, 0, 0));

    // Central Thermal Isolator Block & Screw Port
    const thermalCore = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.6, 12), m.polyamideWarm);
    thermalCore.position.set(0, -2.4, 0);
    addPart(group, thermalCore, new THREE.Vector3(0, -1.0, 0));

    // Left and Right Double Glazed Units
    const glassL = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.45, 11), m.glass);
    glassL.position.set(-4.0, -2.2, 0);
    addPart(group, glassL, new THREE.Vector3(-3.0, 0, 0));

    const glassR = new THREE.Mesh(new THREE.BoxGeometry(4.0, 0.45, 11), m.glass);
    glassR.position.set(4.0, -2.2, 0);
    addPart(group, glassR, new THREE.Vector3(3.0, 0, 0));

    // Outer Clamping Cap: 61 mm (565-6203) with dual gaskets
    const outerCap = createHollowBox(6.1, 1.4, 12, 0.3, m.alumCap);
    outerCap.position.set(0, -3.4, 0);
    addPart(group, outerCap, new THREE.Vector3(0, -3.0, 0));

    return {
      group,
      hotspots: {
        frameWidth: { pos: new THREE.Vector3(0, 3.5, 0), labelEn: 'Frame: 65 mm (Code 565-2101)', labelAr: 'عرض العارضة: 65 ملم (كود 565-2101)' },
        steelTube: { pos: new THREE.Vector3(0, 0.5, 2.0), labelEn: 'Steel Tube (Code 565-7101)', labelAr: 'أنبوب تقوية صلب (كود 565-7101)' },
        outerCap: { pos: new THREE.Vector3(0, -3.8, 0), labelEn: 'Outer Cap: 61 mm (565-6203)', labelAr: 'غطاء تثبيت خارجي 61 ملم (565-6203)' }
      }
    };
  }

  // ==========================================================================
  // 12. IPA 30: Slim Interior Partition & Door Junction (assets/Office/ipa30.jpg)
  // Minimalist 30mm partition post, fixed glass panel, barrel hinge, and hinged glass door leaf
  // ==========================================================================
  function build_ipa30(m) {
    const group = new THREE.Group();

    // Central Vertical Door Jamb Post (30mm face width)
    const jamb = createHollowBox(1.6, 14, 4.0, 0.25, m.alumSilver);
    jamb.position.set(0, 0, 0);
    addPart(group, jamb, new THREE.Vector3(0, 0, 0));

    // Two-Part Cylindrical Architectural Barrel Hinge
    const hingeGeo = new THREE.CylinderGeometry(0.35, 0.35, 3.5, 20);
    const hinge = new THREE.Mesh(hingeGeo, m.alumSilver);
    hinge.position.set(0.6, 1.0, 1.8);
    addPart(group, hinge, new THREE.Vector3(0.5, 1.0, 1.5));

    // Left: Fixed Monolithic Glass Partition Panel with slim 30mm surround
    const fixFrame = createHollowBox(6.5, 13, 1.2, 0.2, m.alumSilver);
    fixFrame.position.set(-4.0, 0, 0);
    addPart(group, fixFrame, new THREE.Vector3(-2.0, 0, 0));

    const fixGlass = new THREE.Mesh(new THREE.BoxGeometry(5.5, 12, 0.35), m.glass);
    fixGlass.position.set(-4.0, 0, 0);
    addPart(group, fixGlass, new THREE.Vector3(-2.0, 0, 1.5));

    // Right: Hinged Door Leaf (rotated slightly open)
    const ipaKin = { type: 'rotate', pivot: new THREE.Vector3(0.6, 0, 1.8), axis: new THREE.Vector3(0, 1, 0), maxAngle: 1.1 };
    const doorLeaf = new THREE.Group();
    const doorFrame = createHollowBox(6.5, 13, 1.2, 0.2, m.alumSilver);
    const doorGlass = new THREE.Mesh(new THREE.BoxGeometry(5.5, 12, 0.35), m.glass);
    doorLeaf.add(doorFrame); doorLeaf.add(doorGlass);
    doorLeaf.rotation.y = Math.PI / 8; // Slightly open door
    doorLeaf.position.set(3.8, 0, 0.6);
    addPart(group, doorLeaf, new THREE.Vector3(3.0, 0, 2.5), ipaKin);

    return {
      group,
      operable: { type: 'swing', labelEn: 'Swing Door', labelAr: 'فتح الباب' },
      hotspots: {
        faceWidth: { pos: new THREE.Vector3(-4.0, 6.0, 0), labelEn: 'Slimline 30 mm Face Width', labelAr: 'قواطع نحيفة بعرض 30 ملم' },
        barrelHinge: { pos: new THREE.Vector3(0.6, 1.0, 2.0), labelEn: 'Integrated Architectural Hinge', labelAr: 'مفصلات أبواب مكتبية أسطوانية' },
        flushDoor: { pos: new THREE.Vector3(3.8, 2.0, 1.2), labelEn: 'Hinged Flush Glass Door', labelAr: 'باب زجاجي مكتبي مفصلي متناسق' }
      }
    };
  }

  // ==========================================================================
  // 13. IPA 45: Acoustic Double-Glass Partition (assets/Office/ipa45.jpg)
  // 2-bay modular partition wall: left bay single acoustic glass, right bay double glass with 100mm cavity
  // ==========================================================================
  function build_ipa45(m) {
    const group = new THREE.Group();

    // Deep Structural Partition Posts (100mm cavity depth)
    const postLeft = createHollowBox(1.8, 14, 6.0, 0.3, m.alumSilver);
    postLeft.position.set(-7.5, 0, 0);
    addPart(group, postLeft, new THREE.Vector3(-2.0, 0, 0));

    const postMid = createHollowBox(2.4, 14, 6.0, 0.3, m.alumSilver);
    postMid.position.set(0, 0, 0);
    addPart(group, postMid, new THREE.Vector3(0, 0, 0));

    const postRight = createHollowBox(1.8, 14, 6.0, 0.3, m.alumSilver);
    postRight.position.set(7.5, 0, 0);
    addPart(group, postRight, new THREE.Vector3(2.0, 0, 0));

    // Left Bay: Single Acoustic Safety Glass Pane
    const glassSingle = new THREE.Mesh(new THREE.BoxGeometry(6.0, 12.5, 0.4), m.glass);
    glassSingle.position.set(-3.75, 0, 0);
    addPart(group, glassSingle, new THREE.Vector3(-1.0, 0, 2.5));

    // Right Bay: Double Acoustic Glass with 100mm Internal Air Cavity
    const glassDouble1 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 12.5, 0.35), m.glass);
    glassDouble1.position.set(3.75, 0, 1.8);
    addPart(group, glassDouble1, new THREE.Vector3(1.0, 0, 3.5));

    const glassDouble2 = new THREE.Mesh(new THREE.BoxGeometry(6.0, 12.5, 0.35), m.glass);
    glassDouble2.position.set(3.75, 0, -1.8);
    addPart(group, glassDouble2, new THREE.Vector3(1.0, 0, -3.5));

    // Bottom Base Track Channel
    const baseTrack = createHollowBox(16.5, 1.4, 6.2, 0.3, m.alumSilver);
    baseTrack.position.set(0, -6.8, 0);
    addPart(group, baseTrack, new THREE.Vector3(0, -1.5, 0));

    return {
      group,
      hotspots: {
        cavityDepth: { pos: new THREE.Vector3(0, 0, 3.2), labelEn: '100 mm Acoustic Cavity Post', labelAr: 'قاطع تجويف صوتي 100 ملم' },
        doubleGlass: { pos: new THREE.Vector3(3.75, 2.0, 2.2), labelEn: 'Dual Acoustic Glass (Up to 45 dB)', labelAr: 'زجاج مزدوج لعزل الصوت حتى 45dB' },
        singleGlass: { pos: new THREE.Vector3(-3.75, 2.0, 0.5), labelEn: 'Single Monolithic Light Bay', labelAr: 'قاطع زجاجي أحادي لنفاذ الضوء' }
      }
    };
  }

  // ==========================================================================
  // 14. GSA 130: Motorized Guillotine Vertical (assets/Vertical-Sliding/gsa130.jpg)
  // Top motor head box with octagonal drum, left/right side jambs, and 3 vertical cascading glass panels
  // ==========================================================================
  function build_gsa130(m) {
    const group = new THREE.Group();

    // Top Motor Box Housing (Extruded aluminum head box)
    const motorBox = createHollowBox(14, 3.2, 4.5, 0.35, m.alumDark);
    motorBox.position.set(0, 6.5, 0);
    addPart(group, motorBox, new THREE.Vector3(0, 3.5, 0));

    // Internal Octagonal Motor Roller Drum
    const drumGeo = new THREE.CylinderGeometry(1.2, 1.2, 13.5, 8);
    const drum = new THREE.Mesh(drumGeo, m.epdm);
    drum.rotation.z = Math.PI / 2;
    drum.position.set(0, 6.5, 0);
    addPart(group, drum, new THREE.Vector3(0, 3.5, 0));

    // Left Vertical Guide Column (130mm depth)
    const jambL = createHollowBox(1.8, 14, 4.5, 0.35, m.alumDark);
    jambL.position.set(-6.5, -0.5, 0);
    addPart(group, jambL, new THREE.Vector3(-2.0, 0, 0));

    // Right Vertical Guide Column
    const jambR = createHollowBox(1.8, 14, 4.5, 0.35, m.alumDark);
    jambR.position.set(6.5, -0.5, 0);
    addPart(group, jambR, new THREE.Vector3(2.0, 0, 0));

    // 3 Vertically Cascading Glass Sashes
    // Top Sash (Retractable - slides down)
    const topKin = { type: 'slide', delta: new THREE.Vector3(0, -6.4, 0) };
    const topSash = new THREE.Group();
    const topRail = createHollowBox(11, 1.0, 1.2, 0.25, m.alumDark);
    const topGlass = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.8, 0.35), m.glass);
    topSash.add(topRail); topSash.add(topGlass);
    topSash.position.set(0, 3.5, -1.0);
    addPart(group, topSash, new THREE.Vector3(0, 2.0, -1.0), topKin);

    // Middle Sash (Retractable - slides down)
    const midKin = { type: 'slide', delta: new THREE.Vector3(0, -3.2, 0) };
    const midSash = new THREE.Group();
    const midRail = createHollowBox(11, 1.0, 1.2, 0.25, m.alumDark);
    const midGlass = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.8, 0.35), m.glass);
    midSash.add(midRail); midSash.add(midGlass);
    midSash.position.set(0, 0.2, 0.2);
    addPart(group, midSash, new THREE.Vector3(0, 0, 2.0), midKin);

    // Bottom Sash (Fixed Structural Balustrade Pane)
    const botSash = new THREE.Group();
    const botRail = createHollowBox(11, 1.0, 1.2, 0.25, m.alumDark);
    const botGlass = new THREE.Mesh(new THREE.BoxGeometry(10.5, 3.8, 0.35), m.glass);
    botSash.add(botRail); botSash.add(botGlass);
    botSash.position.set(0, -3.2, 1.4);
    addPart(group, botSash, new THREE.Vector3(0, -1.5, 3.5));

    // Bottom Aluminum Guide Sill
    const sill = createHollowBox(14, 1.4, 4.5, 0.35, m.alumDark);
    sill.position.set(0, -6.5, 0);
    addPart(group, sill, new THREE.Vector3(0, -2.5, 0));

    group.position.set(0, -1.0, 0);

    return {
      group,
      operable: { type: 'guillotine', labelEn: 'Lower Panels', labelAr: 'خفض الألواح' },
      hotspots: {
        motorBox: { pos: new THREE.Vector3(0, 7.5, 2.5), labelEn: 'Motorized Roller Tube Box', labelAr: 'صندوق المحرك والأسطوانة العلوية' },
        cascadingSashes: { pos: new THREE.Vector3(0, 1.0, 1.0), labelEn: '3-Tier Cascading Glass Panels', labelAr: '3 أضلاف زجاجية متحركة رأسياً' },
        balustrade: { pos: new THREE.Vector3(0, -3.2, 2.2), labelEn: 'Structural Balustrade Base (130mm)', labelAr: 'درابزين زجاجي إنشائي ثابت 130 ملم' }
      }
    };
  }

  // Model Registry Mapping
  const BUILDERS = {
    wat63: build_wat63,
    wa55: build_wa55,
    wa45: build_wa45,
    sat120: build_sat120,
    slat64: build_slat64,
    fat55: build_fat55,
    fat70: build_fat70,
    CWA50HV: build_CWA50HV,
    CWA50sg: build_CWA50sg,
    sa65: build_sa65,
    "sa65-2": build_sa65_2,
    ipa30: build_ipa30,
    ipa45: build_ipa45,
    gsa130: build_gsa130
  };

  // Public Geometry API
  window.AinZaraProfileGeometries = {
    FINISHES: FINISHES,
    createMaterials: createMaterials,
    build: function (modelId, finishId) {
      const materials = createMaterials(finishId);
      const builder = BUILDERS[modelId] || BUILDERS.wat63;
      return builder(materials);
    }
  };

})();
