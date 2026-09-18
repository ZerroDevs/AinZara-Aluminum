# Ain Zara Aluminum & Glass Processing
### Official Architectural Engineering Platform & Interactive 3D Systems Matrix

[![Developer: ZerroDevs](https://img.shields.io/badge/Developer-@ZerroDevs-0284C7?style=for-the-badge&logo=github)](https://github.com/ZerroDevs)
[![License: Restricted](https://img.shields.io/badge/License-Proprietary%20%2F%20Restricted-DC2626?style=for-the-badge)](LICENSE)
[![WebGL: Three.js](https://img.shields.io/badge/3D%20Engine-Three.js%20r128-059669?style=for-the-badge&logo=three.js)](https://threejs.org/)
[![i18n: EN & AR](https://img.shields.io/badge/i18n-English%20%26%20Arabic%20(RTL)-8B5CF6?style=for-the-badge)](#bilingual-internationalization-i18n--rtl)
[![Standards: EN 755 & Qualicoat](https://img.shields.io/badge/Standards-EN%20755%20%7C%20Qualicoat-D97706?style=for-the-badge)](#manufacturing-standards--warranties)

---

> **⚠️ STRICT PROPRIETARY NOTICE & USAGE RESTRICTIONS**  
> This repository and all associated digital assets (source code, 3D WebGL geometries, kinematic algorithms, CAD/BIM models, catalogs, certificates, and media) are the exclusive intellectual property of **[@ZerroDevs](https://github.com/ZerroDevs)** and Ain Zara Aluminum & Glass Processing.  
> **This work is strictly RESTRICTED: No person or entity is permitted to use, copy, reproduce, fork, redistribute, modify, decompile, or exploit any part of this project for any commercial, non-commercial, or educational purpose without express written authorization.** See [LICENSE](LICENSE) for full legal terms.

---

## 🏛️ Executive Overview

**Ain Zara for Aluminum & Glass Processing** is an advanced industrial manufacturer based in the Ain Zara Industrial District of **Tripoli, Libya**. The company specializes in the engineering, precision extrusion fabrication, and automated structural processing of:
- **Architectural Aluminum Facades & Window/Door Systems** (licensed Turkish high-precision dies including Asistal and Amanos series).
- **Automated Insulating Glass Units (IGU)** on automated Bystronic robotic sealing lines with 90%+ Argon gas retention.
- **Convection-Toughened Tempered Glass** (EN 12150) and **Acoustic Laminated Safety Glass** (PVB interlayers up to 45 dB reduction).
- **Surface Finishing Lines** certified under international **Qualicoat Seaside** powder coating and **Qualanod Class 20/25** architectural anodizing standards.

This repository hosts the official client-facing and engineering web platform. Built with vanilla web standards and WebGL, it delivers a lightning-fast, zero-dependency architectural portal complete with real-time 3D kinematic system inspection, batch BIM/CAD downloads, bilingual localization, and full legal transparency.

---

## 👨‍💻 Developer & Authorship

- **Lead Architecture & Engineering:** **[@ZerroDevs](https://github.com/ZerroDevs)**
- **GitHub Profile:** [https://github.com/ZerroDevs](https://github.com/ZerroDevs)
- **Repository:** [https://github.com/ZerroDevs/AinZara-Aluminum](https://github.com/ZerroDevs/AinZara-Aluminum)

---

## 🚀 Key Features & Innovations

### 1. 🧊 Interactive 3D Profile & Kinematic Viewer (Three.js WebGL)
A hardware-accelerated 3D architectural profile viewer powered by **Three.js r128** that allows architects, facade consultants, and estimators to inspect extrusions down to component gaskets and thermal-break polyamide strips:
- **Kinematic Operable Animations:**
  - **Sliding Systems (`SAT 120`, `SLAT 64`):** Operable sash slides horizontally along stainless-steel tandem rollers.
  - **Casement Systems (`WAT 63`, `WA 55`, `WA 45`):** Dual-mode "Tilt & Turn" mechanism simulating 90° inward side-hung swing and 15° top tilt for micro-ventilation.
  - **Bi-Fold Doors (`FAT 70`, `FAT 55`):** Smooth accordion fold animation along heavy-duty top and bottom tracks.
  - **Vertical Guillotine (`GSA 130`):** Motorized synchronous belt-drive cascading panels up and down.
- **Exploded View Analysis:** Dynamically separates profiles, glazing beads, EPDM gaskets, thermal breaks (PA66 GF25), and IGU glass along normal expansion vectors.
- **HUD Architectural Finish & RAL Color Switcher:**
  - **Qualicoat Powder Coatings:** RAL 7016 (Anthracite Grey), RAL 9005 (Jet Black), RAL 9016 (Traffic White), RAL 7035 (Light Grey).
  - **Qualanod Anodized Finishes:** Bronze C-34 (Dark Bronze), Champagne C-31, Silver E6/EV1 (Natural Anodized).
- **Mobile Touch Responsive:** Fully optimized modal layout with touch OrbitControls, orientation locking, and auto-centering for iOS and Android viewports.

---

### 2. 📐 Comprehensive Systems Matrix
A multi-tier categorized matrix covering 14 certified European-standard systems across 7 architectural typologies:

| Category | Typology Code | Systems Included | Key Engineering Specs |
| :--- | :--- | :--- | :--- |
| **Sliding Systems** | `ARTOS` | `SAT 120`, `SLAT 64` | Lift & Slide, Monorail/Multi-rail, up to 400kg sash load, 32mm IGU capacity |
| **Doors & Windows** | `HEKLA` | `WAT 63`, `WA 55`, `WA 45` | Polyamide thermal breaks (24mm), multi-point perimeter Euro-groove locks |
| **Curtain Walls** | `BROMO` | `CWA 50 SG`, `CWA 50 HV` | 50mm face width, Structural Glazing & Semi-Structural, Class 9A watertightness |
| **Folding Doors** | `NEPAL` | `FAT 70`, `FAT 55` | Heavy-duty thermal bi-fold, flush threshold, up to 7-panel panoramic spans |
| **Office Partitions** | `IDA` | `IPA 45`, `IPA 30` | Dual-glass acoustic separation (up to 44 dB), slim architectural profile lines |
| **Skylight Roofs** | `URAL` | `SA 65`, `SA 65-2` | Reinforced conservatory rafters with integrated condensation gutters |
| **Guillotine Vertical** | `LOGAN` | `GSA 130` | Automated motorized vertical sliding glass system with remote belt drive |

---

### 3. 🌐 Bilingual Internationalization (i18n) & Arabic RTL Engine
- **Dynamic DOM Translation:** Seamless switching between **English (en)** and **Arabic (ar)** without full page reloads via `assets/js/i18n.js`.
- **Bidirectional Layout (`dir="rtl"`):** Complete RTL stylesheet (`assets/css/rtl.css`) overriding menus, alignments, drawer slides, and spec tables using high-legibility **Cairo** typography.
- **Strict Aesthetic Guidelines:** 100% clean corporate design with zero unnatural gradients, maintained color contrast, and synchronized language switchers across header, mobile drawer, and footer.
- **Persistent State:** Saves user language preference to `localStorage`.

---

### 4. 📂 Centralized BIM/CAD & Technical Resource Library (`downloads.html`)
- **Master & System Catalogs:** 1-click batch download for the 18-page bilingual Master Catalog and 14 individual technical profile sheets.
- **2D CAD Schematics:** Full production `.dwg` and `.dxf` cross-sections with miter cuts, glazing bead schedules, and extrusion die dimensions.
- **3D BIM Objects:** Open-IFC (`.ifc`) and Revit-compatible architectural models with standardized thermal conductivity ($U_f$) metadata.
- **Certified Laboratory Reports:** Official test certificates for:
  - Air Permeability (EN 12207: Class 4)
  - Water Tightness (EN 12208: Class 9A / 600 Pa)
  - Wind Resistance (EN 12210: Class C5 / 2000 Pa)
  - Qualicoat Seaside Coating & Qualanod Class 25 Anodizing Standards

---

### 5. 📞 Prioritized Direct Phone Directory & RFQ Engine
- **Direct Factory Lines:** Structured hierarchy without confusing labels, featuring voice call and direct WhatsApp links for:
  1. Main Inquiries & Reception
  2. Technical & Architectural Facade Engineering
  3. Commercial Quotes & Estimations
  4. Glass Processing & Tempering Plant
  5. Executive Management & Factory Administration
- **Engineering RFQ Modal:** Integrated quotation form for architects and general contractors specifying system codes, glass builds, and structural schedules.

---

### 6. ⚖️ Manufacturing Standards, Warranties & GDPR Compliance
- **[terms.html](terms.html) — Terms & Manufacturing Policy:**
  - EN 755 & EN 12020 extrusion dimensional tolerances ($\pm0.5$ mm diagonal limits).
  - 20-Year Qualicoat Seaside anti-corrosion guarantee for coastal Mediterranean environments.
  - 10-Year Qualanod Class 20/25 anodizing warranty against pitting and discoloration.
  - 10-Year Sealed Insulating Glass Unit (IGU) warranty against condensation and Argon loss.
  - CAD/BIM intellectual property and architectural license limits.
- **[privacy.html](privacy.html) — GDPR & Privacy Policy:**
  - Compliance with EU General Data Protection Regulation (Regulation 2016/679).
  - Data controller identification in Tripoli, Libya.
  - Strict confidentiality and Non-Disclosure (NDA) handling for architectural CAD files and tender BOQs.
  - Absolute zero third-party monetization or sale of corporate client records.
  - Articles 15–20 user rights (Access, Rectification, Erasure / Right to be Forgotten, Portability).

---

## 🛠️ Technology Stack & Architecture

```
AinZara Web Architecture
├── Markup: HTML5 Semantic Components
├── Styling: CSS3 Custom Properties (Variables) + rtl.css
├── Logic: Vanilla ES6+ Modular JavaScript (Zero external JS frameworks)
├── 3D Engine: Three.js r128 + OrbitControls
├── Font Stack: Inter / Outfit (English) + Cairo (Arabic)
├── Automation Tools: Python 3.10+ (ReportLab, ezdxf, IfcOpenShell, Pillow)
└── Deployment: GitHub Actions CI/CD -> GitHub Pages
```

---

## 📁 Repository Structure

```plaintext
AinZara-Aluminum/
├── .github/
│   └── workflows/
│       └── static.yml               # GitHub Actions workflow deploying to GitHub Pages
├── assets/
│   ├── componts/                    # Modular component templates
│   │   ├── header.html              # Desktop navbar, dropdowns & mobile drawer
│   │   └── footer.html              # 4-column industrial footer with legal links
│   ├── css/
│   │   ├── style.css                # Master design system & component stylesheets
│   │   └── rtl.css                  # Arabic bidirectional RTL styling overrides
│   ├── js/
│   │   ├── header.js                # Dynamic header partial loader & initialization
│   │   ├── footer.js                # Dynamic footer partial loader
│   │   ├── i18n.js                  # Complete bilingual English/Arabic translation dictionary
│   │   ├── navigation.js            # Mobile drawer gestures, accordions & route highlighting
│   │   ├── profile-3d.js            # Three.js 3D viewer, kinematics & material switcher
│   │   ├── profile-geometries.js    # Parametric profile mesh coordinate generators
│   │   ├── downloads.js             # Live search, category filters & download statistics
│   │   ├── main.js                  # Global modals, RFQ handlers & scroll behaviors
│   │   └── vendor/
│   │       ├── three.min.js         # Three.js r128 core library
│   │       └── OrbitControls.js     # Three.js camera manipulation
│   ├── Images/                      # Project photography, factory machinery & logos
│   └── downloads/                   # Downloadable architectural engineering assets
│       ├── cad/                     # Production .dwg & .dxf profile cross-sections
│       ├── bim/                     # Revit & Open-IFC standardized 3D BIM models
│       ├── pdf/                     # Master Catalog & 14 individual technical sheets
│       └── certificates/            # Accredited EN/ISO lab test certificates
├── scripts/                         # Python automation & generation pipeline
│   ├── generate_master_catalog.py   # Compiles 18-page bilingual Master Catalog (ReportLab)
│   ├── generate_arabic_catalogs.py  # Generates Arabic technical sheets
│   ├── generate_bim_ifc.py          # Builds standardized IFC architectural objects
│   ├── generate_test_certificates.py# Produces simulated lab certification documents
│   ├── generate_assets.py           # Automated CAD, DXF, and SVG rendering scripts
│   └── generate_sitemap.py          # Generates dynamic bilingual sitemap.xml
├── tools/                           # Factory engineering utilities
│   ├── cutting_list_estimator.py    # Industrial miter cut & profile optimization calculator
│   └── generate_profiles_3d.py      # Mesh export & geometric testing script
├── index.html                       # Corporate homepage & 3D hero showcase
├── about.html                       # Company history, automated machinery & plant tour
├── products.html                    # Complete 14-system architectural matrix
├── category.html                    # Dynamic parametric category filter page
├── downloads.html                   # Centralized BIM/CAD & technical resource library
├── references.html                  # Executed commercial & residential facade projects
├── contact.html                     # Factory location, interactive map & contact form
├── terms.html                       # Terms of service, manufacturing policy & warranties
├── privacy.html                     # GDPR compliance & corporate data privacy policy
├── 404.html                         # Custom architectural 404 error page
├── robots.txt                       # Search engine crawler directives
├── sitemap.xml                      # Complete multilingual XML sitemap
├── LICENSE                          # Proprietary & restricted source code license
└── README.md                        # Platform engineering & architectural documentation
```

---

## 💻 Local Development Setup

Because the platform uses modern JavaScript modules, dynamic HTML component injection (`fetch('assets/componts/header.html')`), and WebGL shaders, it must be served over a local HTTP server rather than opened via `file://`.

### Option 1: Python Built-In HTTP Server (Recommended)
```bash
# Clone repository
git clone https://github.com/ZerroDevs/AinZara-Aluminum.git
cd AinZara-Aluminum

# Launch local server on port 5500 or 8080
python -m http.server 5500
```
Open your browser and navigate to: `http://localhost:5500`

### Option 2: Node.js `http-server` or `serve`
```bash
npx http-server -p 5500 -c-1
```

### Option 3: VS Code / IDE Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 🔒 License & Usage Restrictions

```
Copyright (c) 2026 ZerroDevs (@ZerroDevs).
All Rights Reserved.
```

This software and its associated digital assets are **PROPRIETARY AND CONFIDENTIAL**. 

- **NO PERMISSION IS GRANTED** to any individual, company, or institution to use, copy, modify, distribute, publish, sublicense, or sell this software, its 3D models, or architectural assets.
- Any unauthorized usage, scraping, duplication, or re-hosting will be met with immediate legal enforcement under international intellectual property laws.

For legitimate architectural inquiries, engineering partnerships, or commercial supply contracts:
- **Developer Profile:** [@ZerroDevs](https://github.com/ZerroDevs)
- **Official Portal:** [https://github.com/ZerroDevs/AinZara-Aluminum](https://github.com/ZerroDevs/AinZara-Aluminum)
- **Corporate Legal & Factory Desk:** [info@ainzara.ly](mailto:info@ainzara.ly) | [privacy@ainzara.ly](mailto:privacy@ainzara.ly)
