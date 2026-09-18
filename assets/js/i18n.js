/**
 * AinZara-Aluminum Internationalization (i18n) Engine
 * Supported Languages: English ('en' - LTR), Arabic ('ar' - RTL)
 * Handles direction, stylesheet toggling, multi-button delegation, and complete translations
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'ainzara_lang';
  const RTL_CSS_ID = 'rtl-stylesheet';
  const RTL_CSS_PATH = 'assets/css/rtl.css';

  const TRANSLATIONS = {
    en: {
      brand_name: "AIN ZARA",
      brand_tagline: "Glass Processing & Aluminum Manufacturing",
      header_location: "Ain Zara, Industrial District, Tripoli, Libya",
      lang_label: "العربية",
      lang_short: "AR",
      
      nav_home: "Home",
      nav_about: "About Us",
      nav_systems: "Architectural Systems",
      nav_downloads: "Downloads",
      nav_references: "References",
      nav_contact: "Contact",
      btn_rfq: "Quote",
      mobile_nav_title: "Navigation Menu",
      quick_contact: "Direct Inquiries",
      call_only: "Voice",
      line_1_role: "HQ & Factory",
      line_2_role: "Sales & Estimating",
      line_3_role: "Engineering Desk",
      line_4_role: "Voice Calls Only",
      line_5_role: "Customer Service",
      btn_call: "Call",
      btn_call_voice: "Voice Call",
      btn_download_cad: "Download CAD (DWG)",
      btn_download_catalog: "Technical Sheet (PDF)",
      btn_download_master_catalog: "Download Master Catalog (PDF)",
      master_catalog_title: "Ain Zara Master Architectural Catalog (PDF)",
      master_catalog_badge: "Comprehensive Edition 2026 • 18 Pages",
      master_catalog_desc: "Complete technical dossier featuring all 14 extrusion systems, structural cross-sections, thermal performance data, and IGU glass specifications.",

      // Downloads & BIM/CAD Library
      dl_hero_tag: "Technical Resource & BIM/CAD Library",
      dl_hero_title: "Centralized Technical Resource & BIM/CAD Library",
      dl_hero_desc: "Direct engineering portal for architects, structural facade consultants, and estimators. Download Master & Individual System Catalogs, production 2D CAD cross-sections (DWG/DXF), parametric 3D BIM models (IFC), and official laboratory test certificates.",
      dl_stat_pdfs: "30+ Technical PDFs",
      dl_stat_cad: "28 2D CAD Schematics",
      dl_stat_bim: "28 BIM 3D Objects",
      dl_stat_certs: "6 Test Certificates",

      // Master Catalogs
      dl_master_en_title: "Ain Zara Master Architectural Catalog (English)",
      dl_master_ar_title: "Ain Zara Master Architectural Catalog (Arabic)",
      dl_master_specs: "18 Pages • Full Matrix • Glass IGU Specs • Vector Schematics",
      dl_btn_download_en: "Download English Catalog (2.6 MB)",
      dl_btn_download_ar: "Download Arabic Catalog (3.3 MB)",

      // Filters & Search
      dl_search_placeholder: "Search by system code, series, or keyword (e.g., SAT 120, BROMO, Thermal)...",
      dl_filter_all_cats: "All Systems (14 Profiles)",
      dl_filter_sliding: "Sliding (ARTOS)",
      dl_filter_doors_windows: "Doors & Windows (HEKLA)",
      dl_filter_facades: "Curtain Walls (BROMO)",
      dl_filter_folding: "Folding Doors (NEPAL)",
      dl_filter_office: "Office Partitions (IDA)",
      dl_filter_roof: "Skylight & Roof (URAL)",
      dl_filter_vertical: "Guillotine Vertical (LOGAN)",
      dl_filter_certificates: "Quality Certificates (6)",

      dl_fmt_label: "File Format:",
      dl_fmt_all: "All Formats",
      dl_fmt_pdf: "PDF Sheets",
      dl_fmt_cad: "2D CAD (DWG / DXF)",
      dl_fmt_bim: "3D BIM (IFC / Solid DXF)",
      dl_fmt_cert: "Certificates",

      // System Cards Actions
      dl_tech_files_title: "Technical Files & Engineering Assets",
      dl_btn_pdf: "Technical Sheet",
      dl_btn_dwg: "AutoCAD (DWG)",
      dl_btn_dxf: "CAD Vector (DXF)",
      dl_btn_bim: "Revit / ArchiCAD (IFC)",
      dl_btn_3d_dxf: "3D Solid (DXF)",
      dl_btn_inspect_3d: "Inspect in 3D",
      dl_showing_count: "Showing",
      dl_systems_count: "systems",
      dl_assets_count: "technical assets",
      dl_no_results: "No matching architectural systems found. Please adjust your search criteria or clear filters.",

      // Certificates Section
      dl_cert_sec_tag: "Standards & Compliance",
      dl_cert_sec_title: "Official Laboratory Test Reports & Quality Standards",
      dl_cert_sec_desc: "Independent third-party laboratory performance certificates according to European (EN) and International (ISO) directives, verifying air permeability, watertightness, wind resistance, and architectural surface treatments.",
      dl_btn_download_cert: "Download Certificate (PDF)",
      dl_cert_air_title: "Air Permeability Classification (Class 4)",
      dl_cert_air_sub: "EN 1026 / EN 12207 • Zero leakage at 600 Pa test pressure",
      dl_cert_water_title: "Water Tightness Under Static Pressure (Class 9A / E1200)",
      dl_cert_water_sub: "EN 1027 / EN 12208 • Multi-tier drainage channels dry up to 1200 Pa",
      dl_cert_wind_title: "Wind Load Resistance & Deflection (Class C5)",
      dl_cert_wind_sub: "EN 12211 / EN 12210 • 3000 Pa safety load hurricane resilience",
      dl_cert_qualicoat_title: "Qualicoat Seaside Architectural Coating License",
      dl_cert_qualicoat_sub: "ISO 2810 / ISO 2360 • Enhanced etching for Mediterranean coastal marine air",
      dl_cert_qualanod_title: "Qualanod Architectural Anodizing Quality Label",
      dl_cert_qualanod_sub: "ISO 7599 / ISO 2143 • Class 20 & Class 25 marine-grade anodic layers",
      dl_cert_iso_title: "ISO 9001:2015 & ISO 14001:2015 Integrated System",
      dl_cert_iso_sub: "Full manufacturing traceability, CNC metrology, and closed-loop recycling",

      // Engineering Assistance
      dl_support_tag: "Direct Factory Engineering Support",
      dl_support_title: "Require Custom CAD Details or Structural Facade Calculations?",
      dl_support_desc: "Our technical engineering desk in Tripoli provides project-specific wind load calculations, custom extrusion die integration, U-value thermal analysis, and BIM family tailoring for architectural firms and major contractors.",
      dl_btn_consult_desk: "Consult Engineering Desk",
      dl_btn_rfq_custom: "Request Engineering Quote",

      // Terms & Policy
      nav_terms: "Terms & Manufacturing Policy",
      nav_gdpr: "GDPR & Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_gdpr: "GDPR Policy",

      terms_hero_tag: "Commercial & Manufacturing Standards",
      terms_hero_title: "Terms of Service & Manufacturing Policy",
      terms_hero_desc: "Standard commercial agreements, fabrication tolerances, Qualicoat/Qualanod coating warranties, delivery protocols, and architectural engineering responsibilities for AinZara Aluminum.",
      terms_last_updated: "Last Updated: September 2026 • Tripoli Industrial Directorate",

      terms_sec1_title: "1. Scope & Manufacturing Agreement",
      terms_sec1_text: "These Terms and Manufacturing Policies govern all architectural aluminum profile supply agreements, custom CNC machining, curtain wall structural assemblies, and automated insulating glass unit (IGU) fabrication executed by Ain Zara Aluminum & Glass Industries Ltd. (Tripoli, Libya). By issuing a purchase order or approving an engineering shop drawing schedule, the client agrees to these standard specifications.",

      terms_sec2_title: "2. Engineering Tolerances & Fabrication Standards",
      terms_sec2_text: "All aluminum extrusions are manufactured in conformance with European Standards EN 755-9 and EN 12020-2 for precision dimensional tolerances. CNC miter cuts maintain an angular accuracy of ±0.1°. Insulated glass units are assembled under EN 1279 standards with dual-barrier structural sealants and computerized 90%+ Argon gas injection.",

      terms_sec3_title: "3. Factory Warranty & Quality Guarantees",
      terms_sec3_text: "Ain Zara warrants that delivered systems are free from metallurgical defects. Surface finishes carry certified manufacturer guarantees: 20 Years for Qualicoat Seaside electrostatic powder coating against peeling, cracking, and maritime salt spray blistering; 10 Years for Qualanod Class 20/25 architectural anodizing; and 10 Years for IGU hermetic seal integrity against internal condensation.",

      terms_sec4_title: "4. Shop Drawings, Measurements & Structural Verification",
      terms_sec4_text: "Fabrication commences only upon client signature on final technical shop drawings. While the Ain Zara engineering desk provides wind load deflection modeling and glass thickness optimization, on-site opening dimensions and structural substrate anchoring remain the responsibility of the project architect or general contractor.",

      terms_sec5_title: "5. Intellectual Property & CAD/BIM Usage",
      terms_sec5_text: "All 2D CAD details (DWG/DXF), 3D BIM models (IFC), and technical system catalogs provided through our portal remain the intellectual property of Ain Zara. Clients and consultants are granted a non-exclusive, revocable license to incorporate these profiles into architectural project specifications.",

      terms_sec6_title: "6. Commercial Law & Dispute Resolution",
      terms_sec6_text: "All contracts, quotation confirmations, and deliveries are governed by the commercial laws of Libya. Any disputes arising shall be resolved through amicable mediation or submitted to competent commercial courts in Tripoli.",

      // GDPR & Privacy Page
      gdpr_hero_tag: "Data Protection & International Compliance",
      gdpr_hero_title: "GDPR & Privacy Policy",
      gdpr_hero_desc: "How AinZara Aluminum & Glass Industries collects, safeguards, and processes personal data in alignment with the General Data Protection Regulation (EU 2016/679) and international privacy standards.",
      gdpr_last_updated: "Compliance Review: September 2026 • Data Controller Tripoli",

      gdpr_sec1_title: "1. Commitment to GDPR & Privacy Principles",
      gdpr_sec1_text: "Ain Zara Aluminum & Glass Industries Ltd. is dedicated to protecting the privacy of our commercial partners, architects, contractors, and website visitors. We adhere to the core principles of the EU General Data Protection Regulation (GDPR) and international best practices: lawfulness, fairness, transparency, data minimization, and strict security.",

      gdpr_sec2_title: "2. Data Controller & Contact Information",
      gdpr_sec2_text: "The data controller responsible for personal information collected through this portal is Ain Zara Aluminum & Glass Industries Ltd., Industrial District, Ain Zara, Tripoli, Libya. For any privacy requests or data inquiries, contact our Data Protection Officer at privacy@ainzara.ly.",

      gdpr_sec3_title: "3. Categories of Data We Collect",
      gdpr_sec3_text: "We collect information solely for commercial, engineering, and service fulfillment: (a) RFQ & Quote Information: Full name, company, architectural practice, contact phone number, and project specifications. (b) Technical Inquiries: Messages and shop drawing requests submitted to our engineering desks. (c) Technical Browsing: Anonymous telemetry, browser language preference ('ainzara_lang'), and download counters.",

      gdpr_sec4_title: "4. Legal Basis for Processing",
      gdpr_sec4_text: "We process your personal information under the following legal bases: (a) Performance of a Contract or Pre-Contractual Steps: To calculate project estimates, issue formal quotes, and fulfill production orders. (b) Legitimate Commercial Interests: To deliver requested CAD/BIM technical files and communicate with registered partners. (c) Legal Compliance: Fulfilling industrial taxation and commercial reporting duties.",

      gdpr_sec5_title: "5. Zero Third-Party Commercial Sharing",
      gdpr_sec5_text: "Ain Zara does NOT sell, rent, monetize, or trade client contact details or project data to third-party marketing companies, ad networks, or data brokers under any circumstances.",

      gdpr_sec6_title: "6. Your Rights Under GDPR",
      gdpr_sec6_text: "Under the GDPR, you possess comprehensive rights regarding your personal data: Right of Access (Art. 15), Right to Rectification (Art. 16), Right to Erasure / 'Be Forgotten' (Art. 17), Right to Restriction of Processing (Art. 18), and Right to Data Portability (Art. 20). To exercise any right, email privacy@ainzara.ly.",

      gdpr_sec7_title: "7. Cookie Policy & Local Storage",
      gdpr_sec7_text: "We do NOT deploy intrusive advertising or tracking cookies. We utilize standard client-side local storage ('ainzara_lang') exclusively to remember your preferred language selection (Arabic or English) and session display preferences across visits.",

      // Drawer Specific Keys
      drawer_explore_series: "7 Series • 14 Profiles",
      drawer_matrix_desc: "Complete Technical Specifications",
      drawer_quick_actions: "Quick Actions",
      drawer_download_catalog: "Catalog PDF",
      drawer_factory_badge: "Tripoli Industrial Complex",
      drawer_factory_hours: "Sat – Thu: 08:00 – 17:00",
      drawer_more_contacts: "All 5 Direct Lines",
      drawer_direct_channels: "Direct Factory Lines",
      drawer_desc_sliding: "Lift & Slide • Heavy Monorail",
      drawer_desc_door_window: "Thermal-Break & Standard Casements",
      drawer_desc_facade: "Structural & Semi-Structural Glazing",
      drawer_desc_folding: "Heavy-Duty Bi-Fold Thermal Systems",
      drawer_desc_office: "Double Glass Acoustic Partitions",
      drawer_desc_roof: "Veranda & Wintergarden Roofs",
      drawer_desc_vertical: "Automated Motorized Guillotine",

      // Categories
      cat_all: "All Systems Matrix",
      cat_sliding: "Sliding Systems",
      cat_door_window: "Door & Window",
      cat_facade: "Curtain Wall & Facades",
      cat_folding: "Folding Doors",
      cat_office: "Office Partitions",
      cat_roof: "Skylight & Roof",
      cat_vertical: "Vertical Guillotine",

      // Hero
      hero_sub_1: "High-Precision Architectural Aluminum & Glass",
      hero_title_1: "Industrial Engineering for Modern Architecture",
      hero_desc_1: "Engineered architectural aluminum facades, thermal-break sliding systems, and automated insulating glass processing manufactured to European ISO and EN standards in Tripoli, Libya.",
      hero_sub_2: "Structural Glazing & Curtain Wall Engineering",
      hero_title_2: "Engineered Facades for Commercial Landmarks",
      hero_desc_2: "Semi-structural and structural silicone-glazed curtain wall systems delivering maximum wind-load resistance, acoustic dampening, and advanced solar thermal control.",

      // Stats
      stat_val_1: "15,000 m²",
      stat_lbl_1: "Annual Glass & Aluminum Fabrication",
      stat_val_2: "0.1 mm",
      stat_lbl_2: "CNC Double-Head Saw Precision",
      stat_val_3: "100%",
      stat_lbl_3: "Argon-Injected Insulating Glass (IGU)",
      stat_val_4: "50+ Projects",
      stat_lbl_4: "Commercial & Residential Facades Built",

      // Tech Specs Headers
      spec_frame_depth: "Frame Depth",
      spec_vent_depth: "Vent/Sash Depth",
      spec_glass_thickness: "Glass Thickness Range",
      spec_thermal_rating: "Thermal Insulation",
      spec_air_water: "Air / Water Tightness",
      btn_view_cross_section: "Cross-Section Schematics",
      btn_download_catalog: "Download Technical Catalog",
      btn_download_cad: "CAD / DWG Details",
      btn_3d_view: "3D View",
      btn_exploded_view: "Exploded View",
      btn_dimensions: "Dimensions",
      btn_reset_camera: "Reset View",
      tab_3d_model: "3D Interactive Model",
      tab_2d_schematic: "2D CAD Schematic",
      modal_3d_title: "3D CAD Model Inspection",
      badge_disclaimer_notice: "IMPORTANT NOTE",
      note_3d_disclaimer: "Interactive 3D representation • This is for demonstration purposes only and may not accurately reflect physical reality • For exact manufacturing specifications refer to official 2D CAD schematic",
      btn_operate: "Operate",
      btn_operate_open: "Open Sash",
      btn_operate_close: "Close Sash",
      btn_operate_tilt: "Tilt & Turn",
      btn_operate_fold: "Accordion Fold",
      btn_operate_motor: "Motor Drive",
      btn_finishes: "Finishes",
      btn_section_cut: "Section Cut",
      btn_measure: "Measure",
      btn_snapshot: "Snapshot",
      finish_ral_7016: "RAL 7016 Anthracite",
      finish_ral_9005: "RAL 9005 Jet Black",
      finish_ral_9016: "RAL 9016 Traffic White",
      finish_ral_8014: "RAL 8014 Sepia Brown",
      finish_qualanod_silver: "Qualanod Satin Silver",
      finish_qualanod_champagne: "Qualanod Champagne Bronze",
      finish_qualanod_titanium: "Qualanod Titanium Charcoal",
      caliper_hint: "Click two points on the 3D model to measure distance",
      caliper_clear: "Clear",
      caliper_result: "Measured Distance",

      // Glass Capabilities
      glass_title: "Automated Glass Processing Plant",
      glass_subtitle: "State-of-the-art horizontal tempering furnaces, automated double-glazed IGU lines, and acoustic laminated safety glass.",
      glass_cap_1_title: "Insulated Glass Units (IGU)",
      glass_cap_1_desc: "Dual and triple glazed sealed units with warm-edge composite spacers, primary polyisobutylene and secondary two-part structural silicone sealants with automated 90%+ Argon gas injection.",
      glass_cap_2_title: "Tempered & Laminated Safety",
      glass_cap_2_desc: "Fully tempered glass tested to EN 12150 standard with 5x surface compression, and multi-layer PVB acoustic laminated safety glass for impact and sound protection up to 45 dB.",
      glass_cap_3_title: "Solar Control & Low-E Coatings",
      glass_cap_3_desc: "High-performance magnetron sputtered Low-E and solar reflective coatings designed to drastically lower thermal solar heat gain (SHGC < 0.28) in Mediterranean and North African climates.",

      // Footer
      footer_about: "Ain Zara is a premier industrial manufacturer in Tripoli, Libya, specializing in advanced architectural aluminum systems, curtain walls, thermal-break windows, and automated insulating glass processing.",
      footer_nav_title: "Corporate",
      footer_systems_title: "Systems",
      footer_contact_title: "Direct Inquiries",
      copyright_rights: "All Rights Reserved. Architectural Aluminum & Glass Processing.",
      location_tripoli: "Tripoli, Libya",

      // Legal & Policy Navigation & Footer Links
      nav_terms: "Terms & Manufacturing Policy",
      nav_gdpr: "GDPR & Privacy Policy",
      footer_terms: "Terms & Conditions",
      footer_gdpr: "GDPR Policy",

      // Terms of Service & Manufacturing Policy
      terms_hero_badge: "Official Manufacturing Standards & Commercial Policies",
      terms_hero_title: "Terms of Service & Manufacturing Policy",
      terms_hero_subtitle: "Industrial fabrication standards, commercial supply agreements, certified warranty scopes, and IP rights for Ain Zara Aluminum & Glass Processing.",
      terms_meta_updated: "Last Updated: September 2026",
      terms_meta_jurisdiction: "Jurisdiction: Tripoli, State of Libya",
      terms_meta_scope: "Standards: EN 755, EN 12020 & Qualicoat Seaside",
      terms_sec1_badge: "Section 1",
      terms_sec1_title: "1. Scope of Agreement & Industrial Quotations",
      terms_sec1_p1: "These Terms of Service and Manufacturing Policy govern all commercial supply contracts, engineering quotations (RFQ), fabrication orders, and delivery schedules executed by Ain Zara for Aluminum and Glass Manufacturing, located in Ain Zara Industrial District, Tripoli, Libya.",
      terms_sec1_p2: "Official technical quotations remain valid for thirty (30) calendar days from issuance, subject to raw material ingot spot price adjustments (LME Primary Aluminum index) and foreign currency parity at the time of confirmed down payment.",
      terms_sec2_badge: "Section 2",
      terms_sec2_title: "2. Extrusion Standards & Dimensional Tolerances (EN 755 / EN 12020)",
      terms_sec2_p1: "All architectural profile extrusions supplied by Ain Zara are produced from prime primary aluminum billet (Alloy 6063 / 6060, T5/T6 temper) complying strictly with European standards EN 755-1 through EN 755-9 and high-precision tolerances according to EN 12020-2.",
      terms_sec2_p2: "Miter cuts, CNC end milling, hardware prep pocketing, and thermal-break polyamide crimping (PA66 GF25) are inspected under strict ISO 9001 internal QA protocols with an allowable fabrication tolerance of ±0.5mm across frame diagonals.",
      terms_sec3_badge: "Section 3",
      terms_sec3_title: "3. Automated Glass Processing & Insulating Glass Unit (IGU) Warranties",
      terms_sec3_p1: "Insulating Glass Units (IGU) manufactured on our automated Bystronic lines are sealed with dual-barrier technology: primary polyisobutylene (PIB) butyl matrix and secondary two-part structural silicone sealant, guaranteed under EN 1279 standards.",
      terms_sec3_p2: "Ain Zara warrants factory-sealed double and triple glazed units against internal condensation, moisture ingress, chemical fogging, and Argon gas loss (holding >90% retention) for a period of ten (10) years from dispatch date.",
      terms_sec4_badge: "Section 4",
      terms_sec4_title: "4. Surface Treatment Guarantees: Qualicoat Seaside & Qualanod",
      terms_sec4_p1: "Electrostatic architectural powder coatings applied by our automated vertical and horizontal lines are certified under the Qualicoat Seaside class license. Coating thickness maintains a minimum of 60 to 80 microns, providing twenty (20) years warranty against blistering, flaking, or chalking under harsh Mediterranean coastal environments.",
      terms_sec4_p2: "Anodized finishes strictly adhere to Qualanod specifications (minimum Class 20/25 with 20-25 micron sealed oxide layer), guaranteed for ten (10) years against pitting and corrosion.",
      terms_sec5_badge: "Section 5",
      terms_sec5_title: "5. Shop Drawings, Site Survey & Structural Engineering Responsibility",
      terms_sec5_p1: "Prior to mass profile extrusion, fabrication, or glass tempering, the client's appointed structural facade engineer or lead architect must sign off on Ain Zara's submitted shop drawings, wind load calculations (Eurocode 1 / EN 1991), and approved glass buildup schedules.",
      terms_sec5_p2: "Ain Zara provides full manufacturing warranties on supplied products, but is not liable for structural deflection or water penetration resulting from incorrect on-site anchoring, substandard subframe masonry, or unauthorized site modifications.",
      terms_sec6_badge: "Section 6",
      terms_sec6_title: "6. CAD / BIM Intellectual Property & Technical Asset Usage",
      terms_sec6_p1: "All proprietary profile CAD cross-sections (.dwg, .dxf), 3D BIM models (.rvt, .ifc), and technical catalog publications hosted on this website remain the sole intellectual property of Ain Zara.",
      terms_sec6_p2: "Architectural consultants and engineering contractors are granted a non-exclusive, revocable license to incorporate these digital drawings solely into active building design specifications and tender dossiers specifying Ain Zara systems.",
      terms_warranty_title: "Ain Zara Certified Warranty Scope",
      terms_w1_title: "20-Year Qualicoat Seaside",
      terms_w1_desc: "Guaranteed protection against chalking, blistering, and saline corrosion along coastal installations.",
      terms_w2_title: "10-Year Qualanod Anodizing",
      terms_w2_desc: "Guaranteed electrolytic oxide layer integrity (Class 20/25) without flaking or UV discoloration.",
      terms_w3_title: "10-Year Sealed IGU Warranty",
      terms_w3_desc: "Guaranteed against internal fogging, condensation, dual-seal failure, and Argon loss (EN 1279).",
      terms_contact_prompt: "Have questions regarding fabrication contracts or need project-specific warranty bonds?",
      terms_contact_btn: "Contact Legal & Engineering Desk",

      // GDPR & Privacy Policy
      gdpr_hero_badge: "EU GDPR Compliance & Transparent Privacy Practices",
      gdpr_hero_title: "GDPR Compliance & Privacy Policy",
      gdpr_hero_subtitle: "Ain Zara's strict commitment to client confidentiality, industrial data integrity, zero third-party monetization, and EU Regulation 2016/679 compliance.",
      gdpr_meta_controller: "Data Controller: Ain Zara Glass & Aluminum, Tripoli, Libya",
      gdpr_meta_compliance: "Framework: EU GDPR (Regulation 2016/679)",
      gdpr_meta_retention: "Principle: Zero Commercial Data Reselling & Minimalist Processing",
      gdpr_sec1_badge: "GDPR Article 4",
      gdpr_sec1_title: "1. Data Controller Identification",
      gdpr_sec1_p1: "Ain Zara for Architectural Aluminum and Glass Processing, incorporated in Tripoli, Libya, operates as the Data Controller responsible for personal and commercial data gathered through ainzara.ly, engineering quotation portals, and direct business communications.",
      gdpr_sec2_badge: "GDPR Article 6",
      gdpr_sec2_title: "2. Information We Collect & Lawful Basis of Processing",
      gdpr_sec2_p1: "We collect information provided directly by you when submitting a Request for Quotation (RFQ), requesting BIM/CAD files, or contacting our technical department. This data includes corporate names, authorized engineer contact names, corporate email addresses, phone numbers, and structural project specifications.",
      gdpr_sec2_p2: "Processing is conducted strictly under Article 6(1)(b) of the GDPR (necessary for the performance of a contract or pre-contractual commercial quote) and Article 6(1)(f) (our legitimate commercial interest in delivering precise architectural advice).",
      gdpr_sec3_badge: "Strict NDA Standards",
      gdpr_sec3_title: "3. Architectural Plans, Tender Drawings & Confidentiality",
      gdpr_sec3_p1: "All architectural schematics, CAD floorplans, tender bills of quantities (BOQ), and proprietary facade elevations transmitted to Ain Zara for engineering review are treated as strictly confidential proprietary trade information under non-disclosure standards.",
      gdpr_sec3_p2: "Your technical drawings are accessed solely by licensed Ain Zara facade engineers and estimating personnel for the purpose of static calculation, glass wind load verification, and cost estimation.",
      gdpr_sec4_badge: "Zero-Sale Pledge",
      gdpr_sec4_title: "4. Absolute Prohibition on Data Reselling & Commercial Sharing",
      gdpr_sec4_p1: "Ain Zara operates as an industrial manufacturing firm, not a data broker. We under no circumstances sell, lease, rent, monetize, or trade your corporate information or client contact records to marketing brokers, ad agencies, or third-party lead generators.",
      gdpr_sec5_badge: "Articles 15 - 20",
      gdpr_sec5_title: "5. Your Rights Under GDPR",
      gdpr_sec5_p1: "Regardless of your geographical location, Ain Zara accords all architectural clients full rights recognized under the European General Data Protection Regulation: (a) Right to Access stored records (Art. 15); (b) Right to Rectification of inaccurate project records (Art. 16); (c) Right to Erasure / 'Right to be Forgotten' (Art. 17); and (d) Right to Data Portability (Art. 20).",
      gdpr_sec6_badge: "Client-Side Only",
      gdpr_sec6_title: "6. Cookies & Client-Side LocalStorage Transparency",
      gdpr_sec6_p1: "Ain Zara utilizes zero invasive cross-site tracking cookies, fingerprinting scripts, or behavioral advertising cookies. Our web application solely utilizes client-side LocalStorage to persist your language preference ('en' or 'ar') and temporary system comparison selections.",
      gdpr_sec7_badge: "Data Privacy Desk",
      gdpr_sec7_title: "7. Data Protection Officer (DPO) & Inquiries",
      gdpr_sec7_p1: "To exercise your data privacy rights, request deletion of your quotation records, or inquire about information security, contact our dedicated Data Protection Desk directly via email at privacy@ainzara.ly or by calling our Tripoli corporate desk at +218 21 000 0000.",
      gdpr_rights_card_title: "Core Privacy Commitments",
      gdpr_r1_title: "Zero Commercial Reselling",
      gdpr_r1_desc: "We never monetize or trade your contact info with advertisers or data brokers.",
      gdpr_r2_title: "Encrypted Document Storage",
      gdpr_r2_desc: "Architectural drawings and tender specifications are kept behind enterprise access controls.",
      gdpr_r3_title: "Right to Erasure (Art. 17)",
      gdpr_r3_desc: "Immediate deletion of RFQ records upon verified request at privacy@ainzara.ly.",
      gdpr_dpo_email: "Data Privacy Desk: privacy@ainzara.ly",

      // RFQ Modal
      rfq_modal_title: "Request an Engineering Quote",
      rfq_field_name: "Full Name",
      rfq_field_company: "Company / Architecture Firm",
      rfq_field_phone: "Contact Phone Number",
      rfq_field_system: "Target Architectural System",
      rfq_field_glass: "Glass Processing Specification",
      rfq_field_notes: "Project Scope, Dimensions & Schedule",
      rfq_submit: "Submit RFQ Request",
      rfq_success: "Thank you! Your technical RFQ has been logged. Our engineering team in Tripoli will review your specifications.",

      // 404 Page
      page_404_tag: "Error 404",
      page_404_heading: "Architectural Profile Specification Not Found",
      page_404_desc: "The requested architectural series or technical catalog page could not be located. It may have been reclassified or moved.",
      btn_back_home: "Return to Homepage",
      btn_view_catalog: "Explore Systems Matrix"
    },
    ar: {
      brand_name: "عين زارة",
      brand_tagline: "لمعالجة الزجاج وتصنيع الألمنيوم",
      header_location: "عين زارة، المنطقة الصناعية، طرابلس، ليبيا",
      lang_label: "English",
      lang_short: "EN",
      
      nav_home: "الرئيسية",
      nav_about: "من نحن",
      nav_systems: "الأنظمة المعمارية",
      nav_downloads: "مركز التحميل",
      nav_references: "مشاريعنا",
      nav_contact: "اتصل بنا",
      btn_rfq: "طلب تسعيرة",
      mobile_nav_title: "قائمة التصفح",
      quick_contact: "الاتصال المباشر",
      call_only: "مكالمات فقط",
      line_1_role: "الإدارة والمصنع",
      line_2_role: "المبيعات والمقايسات",
      line_3_role: "المكتب الفني",
      line_4_role: "مكالمات صوتية فقط",
      line_5_role: "خدمة العملاء",
      btn_call: "اتصال",
      btn_call_voice: "اتصال هاتفي",
      btn_download_cad: "تحميل كاد (DWG)",
      btn_download_catalog: "تحميل الكتالوج (PDF)",
      btn_download_master_catalog: "تحميل الكتالوج الشامل (PDF)",
      master_catalog_title: "كتالوج عين زارة المعماري الشامل (PDF)",
      master_catalog_badge: "الإصدار الشامل 2026 • 18 صفحة",
      master_catalog_desc: "ملف تقني شامل يتضمن كافة القطاعات الـ 14، المقاطع الهندسية، بيانات العزل الحراري، ومواصفات الزجاج المزدوج.",

      // Downloads & BIM/CAD Library
      dl_hero_tag: "مركز الموارد الهندسية ونماذج BIM",
      dl_hero_title: "مكتبة الموارد الفنية والمخططات الهندسية (BIM & CAD)",
      dl_hero_desc: "بوابة هندسية مركزية مخصصة للمهندسين المعماريين، استشاريي الواجهات، ومكاتب حساب الكميات. تتيح تنزيل الكتالوج الشامل والكتالوجات الفردية، ومخططات الأوتوكاد التنفيذية (DWG/DXF)، ونماذج نمذجة معلومات البناء ثلاثية الأبعاد (IFC)، وشهادات الاختبارات المعملية المعتمدة.",
      dl_stat_pdfs: "+30 ملف PDF فني",
      dl_stat_cad: "28 مخطط أوتوكاد 2D",
      dl_stat_bim: "28 نموذج BIM ثلاثي الأبعاد",
      dl_stat_certs: "6 شهادات جودة معتمدة",

      // Master Catalogs
      dl_master_en_title: "كتالوج عين زارة المعماري الشامل (النسخة الإنجليزية)",
      dl_master_ar_title: "كتالوج عين زارة المعماري الشامل (النسخة العربية)",
      dl_master_specs: "18 صفحة • مصفوفة الأنظمة الكاملة • مواصفات الزجاج • مخططات فيكتور",
      dl_btn_download_en: "تحميل النسخة الإنجليزية (2.6 ميجابايت)",
      dl_btn_download_ar: "تحميل النسخة العربية (3.3 ميجابايت)",

      // Filters & Search
      dl_search_placeholder: "ابحث برمز النظام، السلسلة أو الكلمات المفتاحية (مثل: SAT 120، BROMO، عازل)...",
      dl_filter_all_cats: "كافة الأنظمة (14 قطاعاً)",
      dl_filter_sliding: "أنظمة السحب (ARTOS)",
      dl_filter_doors_windows: "الأبواب والنوافذ (HEKLA)",
      dl_filter_facades: "الواجهات الزجاجية (BROMO)",
      dl_filter_folding: "الأبواب القابلة للطي (NEPAL)",
      dl_filter_office: "القواطع المكتبية (IDA)",
      dl_filter_roof: "الأسقف والقباب (URAL)",
      dl_filter_vertical: "السحب الرأسي (LOGAN)",
      dl_filter_certificates: "شهادات الجودة (6)",

      dl_fmt_label: "صيغة الملف:",
      dl_fmt_all: "كافة الصيغ",
      dl_fmt_pdf: "كتالوجات PDF",
      dl_fmt_cad: "مخططات CAD (DWG / DXF)",
      dl_fmt_bim: "نماذج BIM (IFC / مجسم 3D)",
      dl_fmt_cert: "شهادات الاختبار",

      // System Cards Actions
      dl_tech_files_title: "المخططات الفنية والملفات الهندسية",
      dl_btn_pdf: "الكتالوج الفني",
      dl_btn_dwg: "أوتوكاد (DWG)",
      dl_btn_dxf: "مخطط تفصيلي (DXF)",
      dl_btn_bim: "نموذج ريفيت (IFC)",
      dl_btn_3d_dxf: "مجسم 3D صلب (DXF)",
      dl_btn_inspect_3d: "فحص تفاعلي 3D",
      dl_showing_count: "عرض",
      dl_systems_count: "أنظمة",
      dl_assets_count: "ملفاً هندسياً",
      dl_no_results: "لم يتم العثور على أنظمة مطابقة لخيارات البحث أو التصنيف. يرجى تعديل البحث.",

      // Certificates Section
      dl_cert_sec_tag: "المعايير والاعتمادات القياسية",
      dl_cert_sec_title: "تقارير الاختبارات المعملية وشهادات الجودة الرسمية",
      dl_cert_sec_desc: "شهادات اختبار معملية معتمدة من جهات أوروبية ودولية مستقلة تؤكد مقاومة نفاذية الهواء، إحكام منع تسرب المياه، مقاومة ضغط الرياح، وجودة الطلاء والأكسدة المعمارية.",
      dl_btn_download_cert: "تحميل الشهادة الرسمية (PDF)",
      dl_cert_air_title: "شهادة نفاذية الهواء (الفئة 4)",
      dl_cert_air_sub: "EN 1026 / EN 12207 • منع تام للتسرب تحت ضغط اختبار 600 باسكال",
      dl_cert_water_title: "شهادة مقاومة نفاذ الماء تحت الضغط (الفئة 9A / E1200)",
      dl_cert_water_sub: "EN 1027 / EN 12208 • تصريف متطور ومحكم لمنع تسرب المياه حتى 1200 باسكال",
      dl_cert_wind_title: "شهادة مقاومة أحمال الرياح والتشوه (الفئة C5)",
      dl_cert_wind_sub: "EN 12211 / EN 12210 • مقاومة أحمال أعاصير فائقة بضغط أمان 3000 باسكال",
      dl_cert_qualicoat_title: "رخصة كواليكوت سي سايد لطلاء الألمنيوم",
      dl_cert_qualicoat_sub: "ISO 2810 / ISO 2360 • معالجة سطحية مضاعفة لمقاومة ملوحة ورطوبة السواحل",
      dl_cert_qualanod_title: "شهادة كوالانود للجودة المعمارية للأكسدة (الأنودة)",
      dl_cert_qualanod_sub: "ISO 7599 / ISO 2143 • طبقات أكسدة بحرية فائقة الصلابة (فئة 20 و 25)",
      dl_cert_iso_title: "شهادة أنظمة الإدارة المتكاملة (ISO 9001 و ISO 14001)",
      dl_cert_iso_sub: "تتبع كامل لمصادر السبائك، دقة تصنيع رقمية، وتدوير مغلق للألمنيوم",

      // Engineering Assistance
      dl_support_tag: "الدعم الهندسي المباشر للمصنع",
      dl_support_title: "هل تحتاج إلى تفاصيل CAD خاصة أو حسابات إنشائية للواجهات؟",
      dl_support_desc: "يقدم المكتب الهندسي في طرابلس دراسات إنشائية مخصصة لحسابات ضغط الرياح، ومحاكاة العزل الحراري، وتصميم قوالب سحب الألمنيوم الخاصة، وتخصيص عائلات BIM للمكاتب الاستشارية والمقاولين.",
      dl_btn_consult_desk: "تواصل مع المكتب الهندسي",
      dl_btn_rfq_custom: "طلب تسعير هندسي",

      // Terms & Policy
      nav_terms: "الشروط وسياسة التصنيع",
      nav_gdpr: "سياسة الخصوصية و GDPR",
      footer_terms: "الشروط والأحكام",
      footer_gdpr: "سياسة الخصوصية (GDPR)",

      terms_hero_tag: "المعايير التجارية وسياسات التصنيع",
      terms_hero_title: "الشروط والأحكام وسياسة التصنيع الصناعي",
      terms_hero_desc: "الاتفاقيات التجارية المعتمدة، نسب التفاوت المسموحة، ضمانات طلاء كواليكوت وكوالانود، بروتوكولات التسليم، والمسؤوليات الهندسية لمصنع عين زارة للألمنيوم والزجاج.",
      terms_last_updated: "آخر تحديث: سبتمبر 2026 • الإدارة الفنية والصناعية - طرابلس",

      terms_sec1_title: "1. نطاق الاتفاقية وسياسة التصنيع",
      terms_sec1_text: "تحدد هذه الشروط وسياسات التصنيع كافة الالتزامات المنظمة لتوريد قطاعات الألمنيوم المعمارية، وأعمال التشغيل الرقمي CNC، وتجميع الواجهات الهيكلية، وتصنيع وحدات الزجاج المزدوج العازل (IGU) المنفذة بمصنع شركة عين زارة للألمنيوم والزجاج (طرابلس، ليبيا). ويُعد اعتماد المقايسة أو التوقيع على المخططات التنفيذية موافقة رسمية على هذه البنود.",

      terms_sec2_title: "2. التفاوتات الهندسية ومعايير التصنيع الدقيق",
      terms_sec2_text: "يتم تصنيع كافة مقاطع الألمنيوم وفق المعايير القياسية الأوروبية EN 755-9 و EN 12020-2 لضمان دقة الأبعاد وسماكة الجدران. وتلتزم مناشير CNC المزدوجة بدقة قص زوايا التجميع الميكانيكي ±0.1°. وتخضع وحدات الزجاج المزدوج لاختبارات المواصفة EN 1279 مع حقن آلي لغاز الأرجون العازل بنسبة تتجاوز 90%.",

      terms_sec3_title: "3. الضمان المصنعي وجودة الطلاء والمعالجة",
      terms_sec3_text: "يضمن مصنع عين زارة خلو كافة الأنظمة الموردة من العيوب المعدنية والميكانيكية. وتمنح التشطيبات السطحية ضمانات مصنعية معتمدة: 20 عاماً لطلاء البودرة الكهروستاتيكي المعتمد بترخيص Qualicoat Seaside ضد التقشير والتآكل الناتج عن رطوبة وملوحة البحر الأبيض المتوسط؛ 10 أعوام للأكسدة المعمارية Qualanod (فئة 20 و 25)؛ و 10 أعوام لسلامة إحكام عزل الزجاج المزدوج ضد التكثف الداخلي.",

      terms_sec4_title: "4. المخططات التنفيذية، المقاسات والمسؤولية الإنشائية",
      terms_sec4_text: "يبدأ التصنيع الفعلي فقط بعد التوقيع والاعتماد النهائي للمخططات الهندسية (Shop Drawings) من قبل العميل أو الاستشاري. ورغم توفير المكتب الفني بمصنع عين زارة لدراسات محاكاة ضغط الرياح وسماكات الزجاج، فإن مطابقة المقاسات في الموقع وتثبيت الركائز الإنشائية في الخرسانة تظل تحت مسؤولية الاستشاري المشرف أو المقاول العام.",

      terms_sec5_title: "5. الملكية الفكرية واستخدام ملفات CAD و BIM",
      terms_sec5_text: "تظل كافة المخططات الهندسية (DWG/DXF)، ونماذج نمذجة معلومات البناء (IFC)، والكتالوجات الفنية المتوفرة عبر بوابتنا ملكاً حصرياً لمصنع عين زارة. ويُمنح المهندسون والاستشاريون ترخيصاً غير حصري لاستخدامها في إعداد المواصفات والمخططات التنفيذية للمشاريع.",

      terms_sec6_title: "6. القانون الحاكم وفض النزاعات التجارية",
      terms_sec6_text: "تخضع كافة عقود التوريد وأوامر الشراء للتشريعات والقوانين التجارية النافذة في دولة ليبيا، وتختص المحاكم التجارية بمدينة طرابلس بالنظر في أي نزاع ينشأ عن تفسير أو تنفيذ هذه الاتفاقيات بعد استنفاد مساعي التسوية الودية.",

      // GDPR & Privacy Page
      gdpr_hero_tag: "حماية البيانات والامتثال الدولي",
      gdpr_hero_title: "سياسة الخصوصية وحماية البيانات (GDPR)",
      gdpr_hero_desc: "كيف يقوم مصنع عين زارة للألمنيوم والزجاج بجمع وحماية ومعالجة البيانات الشخصية للمتعاملين والشركاء بما يتوافق مع اللائحة العامة لحماية البيانات (EU 2016/679) وأعلى معايير الأمان الدولي.",
      gdpr_last_updated: "مراجعة الامتثال: سبتمبر 2026 • مسؤول حماية البيانات - طرابلس",

      gdpr_sec1_title: "1. الالتزام بمبادئ حماية البيانات و GDPR",
      gdpr_sec1_text: "تلتزم شركة عين زارة للألمنيوم والزجاج بحماية خصوصية شركائنا التجاريين، والمهندسين المعماريين، والمقاولين، وزوار الموقع. نلتزم بالمبادئ الجوهرية للائحة الأوروبية العامة لحماية البيانات (GDPR) والمعايير الدولية: المشروعية، النزاهة، الشفافية، تقليل جمع البيانات للحد الأدنى، وتطبيق أعلى معايير التشفير والأمان.",

      gdpr_sec2_title: "2. الجهة المسؤولة عن معالجة البيانات (Data Controller)",
      gdpr_sec2_text: "الجهة المسؤولة عن معالجة البيانات الشخصية عبر هذا الموقع هي شركة ومصنع عين زارة لصناعة الألمنيوم والزجاج، المنطقة الصناعية، عين زارة، طرابلس، ليبيا. لأي استفسارات أو طلبات تتعلق بالخصوصية، يمكن التواصل مع مسؤول حماية البيانات عبر البريد: privacy@ainzara.ly.",

      gdpr_sec3_title: "3. فئات البيانات التي نقوم بجمعها",
      gdpr_sec3_text: "نقوم بجمع البيانات فقط لغايات تقديم الخدمات الهندسية وعروض الأسعار: (أ) بيانات طلبات التسعير والمقايسات: الاسم الكامل، اسم الشركة أو المكتب الهندسي، رقم الهاتف، والبريد الإلكتروني ومواصفات المشروع. (ب) الاستفسارات الفنية: الرسائل والمخططات المرفوعة للمكتب الهندسي. (ج) البيانات التقنية العامة: نوع المتصفح، واللغة المختارة المخزنة محلياً ('ainzara_lang')، وإحصاءات تحميل الملفات غير المرتبطة بهوية شخصية.",

      gdpr_sec4_title: "4. الأساس القانوني لمعالجة البيانات",
      gdpr_sec4_text: "تتم معالجة البيانات استناداً إلى: (أ) تنفيذ العقود والترتيبات السابقة للتعاقد: لحساب التكاليف وتقديم عروض الأسعار الرسمية وتصنيع الطلبيات. (ب) المصالح التجارية المشروعة: لإرسال ملفات CAD و BIM المطلوبة والتواصل المباشر مع المهندسين. (ج) الامتثال للالتزامات القانونية والضريبية المعمول بها محلياً.",

      gdpr_sec5_title: "5. عدم مشاركة البيانات مع أي طرف ثالث تجاري",
      gdpr_sec5_text: "لا تقوم شركة عين زارة مطلقاً ببيع، أو تأجير، أو مقايضة، أو إتاحة بيانات العملاء أو المهندسين لأي شركات تسويق أو شبكات إعلانية تابعة لأطراف ثالثة تحت أي ظرف من الظروف.",

      gdpr_sec6_title: "6. حقوق المستخدم بموجب لائحة GDPR",
      gdpr_sec6_text: "يتمتع كافة المتعاملين بحقوق كاملة بموجب لائحة GDPR: حق الوصول للبيانات المسجلة (المادة 15)، حق تصحيح البيانات (المادة 16)، حق مسح البيانات / 'الحق في النسيان' (المادة 17)، حق تقييد المعالجة (المادة 18)، وحق نقل البيانات (المادة 20). لممارسة أي من هذه الحقوق، يكفي مراسلتنا على privacy@ainzara.ly.",

      gdpr_sec7_title: "7. ملفات تعريف الارتباط والتخزين المحلي",
      gdpr_sec7_text: "لا نستخدم أي ملفات تتبع إعلانية متطفلة أو ملفات كوكيز تابعة لشبكات خارجية. نعتمد فقط على التخزين المحلي للمتصفح ('ainzara_lang') لحفظ لغة التصفح المفضلة للزائر (العربية أو الإنجليزية) لضمان تجربة مستخدم سلسة وسريعة.",

      // Drawer Specific Keys
      drawer_explore_series: "7 سلاسل • 14 قطاعاً",
      drawer_matrix_desc: "المواصفات الفنية والقطاعات الكاملة",
      drawer_quick_actions: "إجراءات سريعة",
      drawer_download_catalog: "كتالوج PDF",
      drawer_factory_badge: "مجمع طرابلس الصناعي",
      drawer_factory_hours: "السبت – الخميس: 08:00 – 17:00",
      drawer_more_contacts: "كافة خطوط الاتصال الـ 5",
      drawer_direct_channels: "قنوات الاتصال المباشرة للمصنع",
      drawer_desc_sliding: "سحب ورفع هيدروليكي • مونوريل",
      drawer_desc_door_window: "مفصلي عازل حرارياً • اقتصادي",
      drawer_desc_facade: "واجهات زجاجية هيكلية ونصف هيكلية",
      drawer_desc_folding: "أبواب طي حرارية للمساحات الواسعة",
      drawer_desc_office: "قواطع زجاجية مزدوجة عازلة للصوت",
      drawer_desc_roof: "أسقف قباب وحدائق شتوية معزولة",
      drawer_desc_vertical: "سحب رأسي أوتوماتيكي بمحرك ذكي",

      // Categories
      cat_all: "مصفوفة الأنظمة الكاملة",
      cat_sliding: "أنظمة السحب والجر",
      cat_door_window: "الأبواب والنوافذ",
      cat_facade: "الواجهات الزجاجية",
      cat_folding: "الأبواب القابلة للطي",
      cat_office: "القواطع المكتبية",
      cat_roof: "الأسقف والقباب",
      cat_vertical: "السحب الرأسي (الجلوتين)",

      // Hero
      hero_sub_1: "دقة هندسية عالية في صناعة الألمنيوم والزجاج المعماري",
      hero_title_1: "هندسة صناعية متكاملة للمباني المعمارية الحديثة",
      hero_desc_1: "تصنيع واجهات الألمنيوم المعمارية، وأنظمة السحب ذات العزل الحراري العالي، وخطوط معالجة الزجاج المزدوج العازل بأحدث المعايير القياسية الأوروبية في طرابلس، ليبيا.",
      hero_sub_2: "هندسة الواجهات الهيكلية والزجاج الإنشائي",
      hero_title_2: "واجهات زجاجية هندسية للمشاريع الكبرى والأبراج",
      hero_desc_2: "واجهات كورتن وول نصف هيكلية وهيكلية كاملة معزولة حرارياً ومقاومة لضغط الرياح الشديدة مع تحقيق أعلى درجات العزل الصوتي والتحكم الحراري.",

      // Stats
      stat_val_1: "15,000 م²",
      stat_lbl_1: "الطاقة الإنتاجية السنوية للألمنيوم والزجاج",
      stat_val_2: "0.1 ملم",
      stat_lbl_2: "دقة قص المناشير المزدوجة الرقمية CNC",
      stat_val_3: "100%",
      stat_lbl_3: "حقن غاز الأرجون العازل في الزجاج المزدوج",
      stat_val_4: "+50 مشروع",
      stat_lbl_4: "واجهات تجارية وسكنية منفذة بنجاح",

      // Tech Specs Headers
      spec_frame_depth: "عمق الحلق (الإطار)",
      spec_vent_depth: "عمق الدلفة (الضلفة)",
      spec_glass_thickness: "سماكة الزجاج المدعومة",
      spec_thermal_rating: "العزل الحراري",
      spec_air_water: "مقاومة نفاذية الهواء والماء",
      btn_view_cross_section: "مخطط القطاع الهندسي",
      btn_download_catalog: "تحميل الكتالوج الفني",
      btn_download_cad: "تفاصيل أوتوكاد CAD/DWG",
      btn_3d_view: "ثلاثي الأبعاد 3D",
      btn_exploded_view: "منظور مفكك",
      btn_dimensions: "الأبعاد الهندسية",
      btn_reset_camera: "إعادة الضبط",
      tab_3d_model: "نموذج ثلاثي الأبعاد 3D",
      tab_2d_schematic: "المخطط الهندسي 2D",
      modal_3d_title: "فحص النموذج ثلاثي الأبعاد CAD",
      badge_disclaimer_notice: "تنبيه هام",
      note_3d_disclaimer: "نموذج ثلاثي أبعاد تفاعلي • هذا لا يطابق الواقع بشكل صحيح وهذا فقط للتوضيح والتصور • تعتمد القياسات والمواصفات التنفيذية الدقيقة على المخطط الهندسي 2D الرسمي",
      btn_operate: "تشغيل وحركة",
      btn_operate_open: "فتح الدلفة",
      btn_operate_close: "إغلاق الدلفة",
      btn_operate_tilt: "قلاب ومفصلي",
      btn_operate_fold: "طي بانورامي",
      btn_operate_motor: "تشغيل المحرك",
      btn_finishes: "ألوان وتشطيبات",
      btn_section_cut: "مقطع هندسي",
      btn_measure: "أداة القياس",
      btn_snapshot: "التقاط صورة",
      finish_ral_7016: "رمادي أنثراسيت (RAL 7016)",
      finish_ral_9005: "أسود حالك مطفي (RAL 9005)",
      finish_ral_9016: "أبيض ناصع (RAL 9016)",
      finish_ral_8014: "بني داكن سيبيا (RAL 8014)",
      finish_qualanod_silver: "أنودة فضية ساتان (Qualanod)",
      finish_qualanod_champagne: "أنودة شامبانيا برونز (Qualanod)",
      finish_qualanod_titanium: "أنودة تيتانيوم فحمي (Qualanod)",
      caliper_hint: "انقر على نقطتين على المجسم 3D لحساب المسافة بدقة",
      caliper_clear: "مسح",
      caliper_result: "المسافة المقاسة",

      // Glass Capabilities
      glass_title: "مصنع معالجة وتطوير الزجاج الآلي",
      glass_subtitle: "أحدث أفران السيكوريت (التقسية) الأفقية، وخطوط إنتاج الزجاج المزدوج الأوتوماتيكية، والزجاج المصفح العازل للصوت.",
      glass_cap_1_title: "وحدات الزجاج المزدوج العازل (IGU)",
      glass_cap_1_desc: "وحدات عازلة مزدوجة وثلاثية مزودة بفواصل حرارية حديثة ومواد مانعة للتسرب الهيكلي مع خط حقن آلي لغاز الأرجون بنسبة تتجاوز 90%.",
      glass_cap_2_title: "الزجاج المقسى (سيكوريت) والمصفح",
      glass_cap_2_desc: "زجاج مقسى وفق معايير EN 12150 بضغط سطحي يعادل 5 أضعاف الزجاج العادي، وزجاج مصفح بطبقات PVB لعزل الصوت وحماية فائقة ضد الصدمات حتى 45 ديسيبل.",
      glass_cap_3_title: "طبقات الحماية الشمسية و Low-E",
      glass_cap_3_desc: "طلاءات عاكسة وموفرة للطاقة مخصصة لتخفيض معامل اكتساب الحرارة الشمسية بما يتناسب مع مناخ شمال أفريقيا والبحر المتوسط.",

      // Footer
      footer_about: "شركة عين زارة صرح صناعي رائد في طرابلس، ليبيا، متخصصة في الأنظمة المعمارية للألمنيوم، والواجهات الزجاجية، والأبواب والنوافذ المعزولة حرارياً، ومعالجة الزجاج العازل والمقسى.",
      footer_nav_title: "الشركة",
      footer_systems_title: "الأنظمة المعمارية",
      footer_contact_title: "الاتصال المباشر",
      copyright_rights: "جميع الحقوق محفوظة. تصنيع الألمنيوم ومعالجة الزجاج المعماري.",
      location_tripoli: "طرابلس، ليبيا",

      // Legal & Policy Navigation & Footer Links
      nav_terms: "الشروط وسياسة التصنيع",
      nav_gdpr: "سياسة الخصوصية وحماية البيانات GDPR",
      footer_terms: "الشروط والأحكام",
      footer_gdpr: "سياسة الخصوصية GDPR",

      // Terms of Service & Manufacturing Policy
      terms_hero_badge: "معايير التصنيع الرسمية والسياسات التجارية",
      terms_hero_title: "الشروط وسياسة التصنيع والضمان",
      terms_hero_subtitle: "معايير التصنيع الصناعي، عقود التوريد التجاري، نطاق الضمانات المعتمدة، وحقوق الملكية الفكرية لشركة عين زارة للألمنيوم ومعالجة الزجاج.",
      terms_meta_updated: "آخر تحديث: سبتمبر 2026",
      terms_meta_jurisdiction: "الاختصاص القضائي: طرابلس، دولة ليبيا",
      terms_meta_scope: "المعايير: EN 755، EN 12020 ومواصفات كواليكوت سيسايد",
      terms_sec1_badge: "البند 1",
      terms_sec1_title: "1. نطاق الاتفاقية والعروض الهندسية الرسمية",
      terms_sec1_p1: "تنظم شروط الخدمة وسياسة التصنيع هذه كافة عقود التوريد التجاري، العروض الهندسية (RFQ)، أوامر التصنيع، وجداول التسليم الصادرة عن شركة عين زارة لصناعة الألمنيوم ومعالجة الزجاج، الكائن مقرها بالمنطقة الصناعية عين زارة، طرابلس، ليبيا.",
      terms_sec1_p2: "تسري العروض الهندسية الرسمية لمدة ثلاثين (30) يوماً تقويمياً من تاريخ إصدارها، وتخضع لتعديلات أسعار سبائك الألمنيوم الخام في بورصة لندن للمعادن (LME) وأسعار الصرف الرسمية عند اعتماد الدفعة المقدمة.",
      terms_sec2_badge: "البند 2",
      terms_sec2_title: "2. معايير سحب قطاعات الألمنيوم والتفاوتات البعدية (EN 755 / EN 12020)",
      terms_sec2_p1: "يتم سحب وتشكيل كافة القطاعات المعمارية الموردة من شركة عين زارة باستخدام سبائك الألمنيوم الأولية النقية (Alloy 6063 / 6060 بحالة معالجة T5/T6) المطابقة تماماً للمعايير الأوروبية EN 755 وللتفاوتات الفائقة الدقة وفقاً للمعيار EN 12020-2.",
      terms_sec2_p2: "تخضع عمليات القص والتشغيل الرقمي CNC وتركيب عوازل البولي أميد الحرارية (PA66 GF25) لرقابة جودة صارمة وفق معايير ISO 9001، مع التزام بأقصى تفاوت مسموح به لا يتجاوز ±0.5 مم على أقطار الإطارات المجمعة.",
      terms_sec3_badge: "البند 3",
      terms_sec3_title: "3. معالجة الزجاج الآلية وضمانات الزجاج العازل المزدوج (IGU)",
      terms_sec3_p1: "يتم تصنيع وحدات الزجاج العازل المزدوج والثلاثي على خطوط Bystronic الآلية بتقنية الختم المزدوج: الختم الأولي بالبولي إيزوبوتيلين (PIB) والختم الهيكلي الثانوي بالسيليكون الإنشائي وفق المعيار الأوروبي EN 1279.",
      terms_sec3_p2: "تمنح شركة عين زارة ضماناً صناعياً معتمداً لمدة عشر (10) سنوات من تاريخ التوريد ضد التكثف أو التبخر الداخلي أو تلف الختم المزدوج أو تسرب غاز الأرجون العازل بنسبة بقاء تفوق 90%.",
      terms_sec4_badge: "البند 4",
      terms_sec4_title: "4. ضمانات معالجة الأسطح: كواليكوت سيسايد والأنودة (Qualanod)",
      terms_sec4_p1: "طلاء البودرة الكهروستاتيكي المعتمد في مصانعنا حاصل على رخصة Qualicoat Seaside، وبسماكة دهان تتراوح بين 60 إلى 80 ميكرون، مع ضمان لمدة عشرين (20) عاماً ضد التقشر والتبخر والتآكل الملحي في البيئات الساحلية المتوسطية.",
      terms_sec4_p2: "تلتزم معالجة الأنودة الكيميائية والكهربائية الصارمة بمواصفات Qualanod (الفئة 20/25 بسماكة أكسيد عازلة 20-25 ميكرون) بضمان مصنعي لمدة عشر (10) سنوات ضد التآكل والبهتان.",
      terms_sec5_badge: "البند 5",
      terms_sec5_title: "5. المخططات التنفيذية، الرفع المساحي والمسؤولية الإنشائية",
      terms_sec5_p1: "يتعين على الاستشاري المشرف أو المهندس المعماري المعتمد للمشروع مراجعة وتوقيع المخططات التنفيذية (Shop Drawings) وحسابات مقاومة الرياح (Eurocode 1) وتراكيب الزجاج قبل بدء التصنيع والتقسية.",
      terms_sec5_p2: "تضمن شركة عين زارة جودة ومطابقة المنتجات المصنعة، ولكنها تخلي مسؤوليتها عن أي انحرافات أو تسريبات ناتجة عن التثبيت الخاطئ في الموقع أو عدم كفاءة الجدران الحاملة أو التعديلات غير المعتمدة.",
      terms_sec6_badge: "البند 6",
      terms_sec6_title: "6. حقوق الملكية الفكرية لملفات CAD و BIM والكتالوجات",
      terms_sec6_p1: "كافة القطاعات والمقاطع الهندسية الرقمية (.dwg, .dxf) ونماذج BIM ثلاثية الأبعاد والكتالوجات الفنية المعروضة على هذا الموقع هي ملكية فكرية حصرية لشركة عين زارة.",
      terms_sec6_p2: "يُمنح المكاتب الهندسية والمقاولين ترخيصاً حصرياً لاستخدام هذه النماذج في توصيف المشاريع المعمارية وجداول التوصيف التي تعتمد أنظمة عين زارة حصراً.",
      terms_warranty_title: "نطاق ضمانات عين زارة المعتمدة",
      terms_w1_title: "20 عاماً - كواليكوت سيسايد",
      terms_w1_desc: "حماية مضمونة ضد التقشر والتآكل الملحي والبهتان في البيئات الساحلية.",
      terms_w2_title: "10 أعوام - أنودة كوالانود",
      terms_w2_desc: "سلامة طبقة الأكسيد الإلكتروليتية (الفئة 20/25) ضد التقشر وتأثير الأشعة فوق البنفسجية.",
      terms_w3_title: "10 أعوام - الزجاج العازل المزدوج (IGU)",
      terms_w3_desc: "ضمان ضد التكثف الداخلي، فشل الختم، وتسرب غاز الأرجون (مطابق لـ EN 1279).",
      terms_contact_prompt: "هل لديك استفسارات فنية تعاقدية أو تطلب شهادات ضمان خاصة بمشروعك؟",
      terms_contact_btn: "التواصل مع الإدارة القانونية والهندسية",

      // GDPR & Privacy Policy
      gdpr_hero_badge: "الامتثال للائحة الأوروبية العامة لحماية البيانات (GDPR) والشفافية",
      gdpr_hero_title: "سياسة الخصوصية والامتثال لـ GDPR",
      gdpr_hero_subtitle: "التزام شركة عين زارة الراسخ بحماية البيانات، سرية العملاء، سلامة المخططات الهندسية والامتثال للائحة الأوروبية 2016/679.",
      gdpr_meta_controller: "المسؤول عن البيانات: شركة عين زارة للألمنيوم والزجاج، طرابلس، ليبيا",
      gdpr_meta_compliance: "الإطار التنظيمي: اللائحة الأوروبية لحماية البيانات (EU 2016/679)",
      gdpr_meta_retention: "المبدأ: الرفض القاطع لبيع البيانات والحد الأدنى للمعالجة الهندسية",
      gdpr_sec1_badge: "المادة 4 من GDPR",
      gdpr_sec1_title: "1. هوية المسؤول عن معالجة البيانات والاتصال",
      gdpr_sec1_p1: "تعمل شركة عين زارة لصناعة الألمنيوم ومعالجة الزجاج، المسجلة في طرابلس، ليبيا، بصفتها الجهة المسؤولة عن معالجة البيانات الشخصية والتجارية التي يتم جمعها عبر موقع ainzara.ly ونماذج طلبات التسعير والمراسلات الرسمية.",
      gdpr_sec2_badge: "المادة 6 من GDPR",
      gdpr_sec2_title: "2. البيانات التي نجمعها والأساس القانوني للمعالجة",
      gdpr_sec2_p1: "نقوم بجمع البيانات التي تقدمها طواعية عند إرسال طلب تسعيرة هندسية (RFQ)، أو طلب ملفات CAD/BIM، أو مراسلة الفريق الفني. تشمل هذه البيانات اسم الشركة، اسم المهندس المسؤول، البريد الإلكتروني، رقم الهاتف، ومواصفات المشروع الإنشائية.",
      gdpr_sec2_p2: "تتم المعالجة بموجب المادة 6(1)(b) من اللائحة الأوروبية (ضرورية لتنفيذ العقود أو إعداد عروض الأسعار بناءً على طلب العميل) والمادة 6(1)(f) (المصلحة المشروعة في تقديم الاستشارات الهندسية الدقيقة).",
      gdpr_sec3_badge: "معايير السرية التامة",
      gdpr_sec3_title: "3. سرية المخططات المعمارية ومستندات العطاءات (NDA)",
      gdpr_sec3_p1: "تُعامل كافة المخططات الهندسية، ورسومات الأوتوكاد، وجداول الكميات (BOQ) المرسلة إلى عين زارة باعتبارها أسراراً مهنية وتجارية خاضعة لسرية تامة.",
      gdpr_sec3_p2: "يقتصر الاطلاع على ملفاتك ومخططاتك على مهندسي الواجهات وحساب الأحمال المعتمدين في مصنعنا بهدف الحسابات الإنشائية وتحديد التكاليف فقط.",
      gdpr_sec4_badge: "التعهد بعدم البيع",
      gdpr_sec4_title: "4. الحظر المطلق لبيع أو مشاركة البيانات مع أطراف خارجية",
      gdpr_sec4_p1: "شركة عين زارة صرح صناعي وليست وسيط بيانات. نحن نتعهد تعهداً قاطعاً بعدم بيع أو تأجير أو مشاركة أو تداول أي بيانات خاصة بعملائنا أو أرقام هواتفهم مع وكالات التسويق أو الأطراف الثالثة لأي غرض تجاري.",
      gdpr_sec5_badge: "المواد 15 إلى 20",
      gdpr_sec5_title: "5. حقوقك بموجب اللائحة الأوروبية (GDPR)",
      gdpr_sec5_p1: "بغض النظر عن موقعك الجغرافي، تمنح شركة عين زارة كافة عملائها الحقوق الكاملة المنصوص عليها في اللائحة العامة لحماية البيانات: (أ) حق الوصول إلى السجلات المحفوظة (المادة 15)؛ (ب) حق تصحيح البيانات (المادة 16)؛ (ج) حق الحذف ومحو البيانات / 'الحق في النسيان' (المادة 17)؛ (د) حق نقل البيانات (المادة 20).",
      gdpr_sec6_badge: "خصوصية التخزين المحلي",
      gdpr_sec6_title: "6. ملفات تعريف الارتباط والتخزين المحلي (LocalStorage)",
      gdpr_sec6_p1: "لا يستخدم موقع عين زارة أي ملفات تتبع إعلانية متطفلة أو برمجيات بصمة رقمية خارجية. يقتصر استخدام التخزين المحلي (LocalStorage) في المتصفح فقط على حفظ لغة العرض المفضلة (العربية أو الإنجليزية) وخيارات المقارنة المؤقتة للأنظمة.",
      gdpr_sec7_badge: "مكتب حماية البيانات",
      gdpr_sec7_title: "7. مسؤول حماية البيانات (DPO) وتقديم الطلبات",
      gdpr_sec7_p1: "لممارسة حقوق الخصوصية الخاصة بك، أو طلب حذف سجلات التسعير والمراسلات، يمكنك التواصل مباشرة مع مكتب حماية البيانات عبر البريد الإلكتروني المخصص: privacy@ainzara.ly أو الاتصال بالمقر الرئيسي في طرابلس.",
      gdpr_rights_card_title: "التزامات الخصوصية الجوهرية",
      gdpr_r1_title: "عدم بيع البيانات إطلاقاً",
      gdpr_r1_desc: "نرفض تماماً مشاركة أو بيع بياناتك أو أرقام هواتفك لأي شركات تسويق أو جهات خارجية.",
      gdpr_r2_title: "تخزين هندسي محمي ومُشفر",
      gdpr_r2_desc: "حماية تامة للمخططات المعمارية وجداول الكميات والتصاميم التنفيذية وفق أعلى معايير الأمان.",
      gdpr_r3_title: "حق المحو الفوري (المادة 17)",
      gdpr_r3_desc: "حذف فوري لكافة سجلات الاستفسارات والطلبات بمجرد إرسال طلب عبر privacy@ainzara.ly.",
      gdpr_dpo_email: "مكتب الخصوصية: privacy@ainzara.ly",

      // RFQ Modal
      rfq_modal_title: "طلب تسعيرة هندسية",
      rfq_field_name: "الاسم الكامل",
      rfq_field_company: "اسم الشركة / المكتب الهندسي",
      rfq_field_phone: "رقم هاتف التواصل",
      rfq_field_system: "النظام المعماري المطلوب",
      rfq_field_glass: "مواصفات الزجاج المطلوبة",
      rfq_field_notes: "تفاصيل المشروع، الأبعاد والمخططات",
      rfq_submit: "إرسال طلب التسعيرة",
      rfq_success: "شكراً لتواصلكم! تم استلام طلب التسعيرة وسيقوم الفريق الهندسي في طرابلس بدراسة المواصفات والتواصل معكم.",

      // 404 Page
      page_404_tag: "خطأ 404",
      page_404_heading: "مواصفات النظام المعماري غير متوفرة",
      page_404_desc: "الصفحة أو مواصفات النظام المعماري المطلوبة غير موجودة أو تم نقلها.",
      btn_back_home: "العودة إلى الصفحة الرئيسية",
      btn_view_catalog: "تصفح مصفوفة الأنظمة"
    }
  };

  let currentLang = localStorage.getItem(STORAGE_KEY) || 'en';

  function applyLanguage(lang) {
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);

    const isRtl = lang === 'ar';
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // Manage rtl.css stylesheet link in head
    let rtlLink = document.getElementById(RTL_CSS_ID);
    if (isRtl) {
      if (!rtlLink) {
        rtlLink = document.createElement('link');
        rtlLink.id = RTL_CSS_ID;
        rtlLink.rel = 'stylesheet';
        rtlLink.href = RTL_CSS_PATH;
        document.head.appendChild(rtlLink);
      }
    } else {
      if (rtlLink) {
        rtlLink.remove();
      }
    }

    // Update Language Toggle Button Labels everywhere
    document.querySelectorAll('.lang-label, .drawer-lang-label').forEach(el => {
      el.textContent = TRANSLATIONS[lang].lang_label;
    });
    document.querySelectorAll('.lang-short-label').forEach(el => {
      el.textContent = TRANSLATIONS[lang].lang_short;
    });

    // Translate elements with data-i18n
    updateDOM(document);

    // Update Master Catalog and Technical Sheet PDF download links according to active language
    const masterLinks = document.querySelectorAll('a[href*="AinZara-Master-Architectural-Catalog"]');
    masterLinks.forEach(link => {
      if (lang === 'ar') {
        link.setAttribute('href', 'assets/downloads/pdf/AinZara-Master-Architectural-Catalog-ar.pdf');
        link.setAttribute('download', 'AinZara-Master-Architectural-Catalog-ar.pdf');
      } else {
        link.setAttribute('href', 'assets/downloads/pdf/AinZara-Master-Architectural-Catalog.pdf');
        link.setAttribute('download', 'AinZara-Master-Architectural-Catalog.pdf');
      }
    });

    const techSheetLinks = document.querySelectorAll('a[href*="-technical-sheet"]');
    techSheetLinks.forEach(link => {
      let href = link.getAttribute('href') || '';
      let download = link.getAttribute('download') || '';
      if (lang === 'ar') {
        if (!href.includes('-ar.pdf')) href = href.replace('.pdf', '-ar.pdf');
        if (download && !download.includes('-ar.pdf')) download = download.replace('.pdf', '-ar.pdf');
      } else {
        href = href.replace('-ar.pdf', '.pdf');
        if (download) download = download.replace('-ar.pdf', '.pdf');
      }
      link.setAttribute('href', href);
      if (download) link.setAttribute('download', download);
    });

    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
  }

  function toggleLanguage() {
    const nextLang = currentLang === 'en' ? 'ar' : 'en';
    applyLanguage(nextLang);
  }

  // Global event delegation for language buttons (works across desktop, mobile bar, and drawer)
  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.lang-toggle-btn, #lang-toggle-btn');
    if (btn) {
      e.preventDefault();
      toggleLanguage();
    }
  });

  // Re-apply on DOM ready and dynamic components
  document.addEventListener('DOMContentLoaded', () => {
    applyLanguage(currentLang);
  });

  document.addEventListener('headerLoaded', () => {
    applyLanguage(currentLang);
  });

  document.addEventListener('footerLoaded', () => {
    applyLanguage(currentLang);
  });

  function updateDOM(root = document) {
    const lang = currentLang;
    const elements = root.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.textContent = TRANSLATIONS[lang][key];
      }
    });

    const placeholderElems = root.querySelectorAll('[data-i18n-placeholder]');
    placeholderElems.forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        el.setAttribute('placeholder', TRANSLATIONS[lang][key]);
      }
    });
  }

  // Expose API
  window.AinZaraI18n = {
    getLang: () => currentLang,
    setLang: applyLanguage,
    toggle: toggleLanguage,
    updateDOM: updateDOM,
    t: (key) => (TRANSLATIONS[currentLang] && TRANSLATIONS[currentLang][key]) || key
  };
})();
