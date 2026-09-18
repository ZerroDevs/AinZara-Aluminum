#!/usr/bin/env python3
"""
AinZara-Aluminum - Master Architectural Systems & Glass Processing Catalog (PDF)
Generates the comprehensive 18-page Master Catalog containing:
  - Page 1: Premium Front Cover Page (Branding, Certifications, 2026 Edition)
  - Page 2: Corporate Infrastructure, Factory Machinery & Table of Contents
  - Pages 3–16: 14 Complete System Technical Specification Sheets with CAD Cross-Sections
  - Page 17: Glass Processing Division Capabilities & Thermal Glazing Matrix
  - Page 18: Back Cover, Factory Directorate Directory & Technical Tenders Desk

Standard PDF 1.4 compliant with shared XObject resources, transparent watermark,
and zero external compiled dependencies.
"""

import os
import sys
import zlib
from PIL import Image, ImageChops

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(REPO_ROOT, "assets", "downloads", "pdf")
OUTPUT_CATALOG_PATH = os.path.join(PDF_DIR, "AinZara-Master-Architectural-Catalog.pdf")

os.makedirs(PDF_DIR, exist_ok=True)

# 1. Load and process Logo for Header and Watermark
LOGO_PATH = os.path.join(REPO_ROOT, "assets", "Images", "Logo_Watermark.png")
if not os.path.exists(LOGO_PATH):
    LOGO_PATH = os.path.join(REPO_ROOT, "assets", "Images", "Logo1.png")

orig_logo = Image.open(LOGO_PATH)
r, g, b, a = orig_logo.split()
clean_mask = a.point(lambda p: 255 if p > 10 else 0)
bbox = clean_mask.getbbox()
if bbox:
    pad = 8
    crop_box = (
        max(0, bbox[0] - pad),
        max(0, bbox[1] - pad),
        min(orig_logo.width, bbox[2] + pad),
        min(orig_logo.height, bbox[3] + pad)
    )
    tight_logo = orig_logo.crop(crop_box)
else:
    tight_logo = orig_logo

hl_aspect = tight_logo.height / tight_logo.width

# Header Logo
hdr_w = 120
hdr_h = int(hdr_w * hl_aspect)
hdr_logo_img = tight_logo.resize((hdr_w, hdr_h), Image.Resampling.LANCZOS)
hl_r, hl_g, hl_b, hl_a = hdr_logo_img.split()
hdr_rgb_img = Image.merge('RGB', (hl_r, hl_g, hl_b))
hdr_rgb_bytes = zlib.compress(hdr_rgb_img.tobytes())
hdr_alpha_bytes = zlib.compress(hl_a.tobytes())

# Cover Logo (Large 400px width)
cov_w = 400
cov_h = int(cov_w * hl_aspect)
cov_logo_img = tight_logo.resize((cov_w, cov_h), Image.Resampling.LANCZOS)
cov_r, cov_g, cov_b, cov_a = cov_logo_img.split()
cov_rgb_img = Image.merge('RGB', (cov_r, cov_g, cov_b))
cov_rgb_bytes = zlib.compress(cov_rgb_img.tobytes())
cov_alpha_bytes = zlib.compress(cov_a.tobytes())

# Watermark Logo (17% soft opacity)
wm_target_w = 800
wm_target_h = int(wm_target_w * hl_aspect)
wm_img = tight_logo.resize((wm_target_w, wm_target_h), Image.Resampling.LANCZOS)
wm_r, wm_g, wm_b, wm_a = wm_img.split()
wm_rgb_img = Image.merge('RGB', (wm_r, wm_g, wm_b))
wm_soft_alpha = wm_a.point(lambda p: int((p / 255.0) * 0.17 * 255) if p > 10 else 0)
wm_rgb_bytes = zlib.compress(wm_rgb_img.tobytes())
wm_alpha_bytes = zlib.compress(wm_soft_alpha.tobytes())

# Import systems from generate_assets
from generate_assets import SYSTEMS, get_jpeg_dimensions, text_cmd

def build_cover_page():
    """Generates content stream for Page 1: Premium Front Cover."""
    cs = []
    # Luxury Top Header Banner
    cs.append("q")
    cs.append("0.043 0.227 0.376 rg")  # Deep Navy #0B3A60
    cs.append("0 660 595.28 181.89 re f")
    cs.append("0.165 0.471 0.722 rg")  # Azure Line
    cs.append("0 654 595.28 6 re f")
    cs.append("0.85 0.65 0.13 rg")   # Gold Accent Line
    cs.append("0 650 595.28 4 re f")
    cs.append("Q")

    # Cover Typography Top
    cs.append(text_cmd("F1", 26.0, (1.0, 1.0, 1.0), 48.0, 775.0, "AIN ZARA ALUMINUM & GLASS"))
    cs.append(text_cmd("F2", 11.0, (0.80, 0.90, 1.0), 48.0, 750.0, "Tripoli Industrial Complex  -  Official Factory HQ & Engineering Directorate"))
    cs.append(text_cmd("F1", 13.0, (0.45, 0.78, 1.0), 48.0, 725.0, "COMPLETE ARCHITECTURAL SYSTEMS MASTER CATALOG"))
    cs.append(text_cmd("F2", 9.5, (0.90, 0.95, 1.0), 48.0, 705.0, "2026 EDITION  |  TENDER SPECIFICATIONS & FABRICATION MATRIX"))

    # Large Center Cover Logo
    draw_w = 260.0
    draw_h = draw_w * hl_aspect
    draw_x = (595.28 - draw_w) / 2.0
    draw_y = 390.0
    cs.append(f"q {draw_w:.2f} 0 0 {draw_h:.2f} {draw_x:.2f} {draw_y:.2f} cm /LogoCov Do Q")

    # Center Title Block
    cs.append(text_cmd("F1", 18.0, (0.043, 0.227, 0.376), 48.0, 340.0, "ARCHITECTURAL PORTFOLIO & TECHNICAL MATRICES"))
    cs.append(text_cmd("F2", 10.0, (0.30, 0.35, 0.42), 48.0, 320.0, "Comprehensive engineering handbook covering 14 certified European extrusion systems,"))
    cs.append(text_cmd("F2", 10.0, (0.30, 0.35, 0.42), 48.0, 305.0, "automated Lisec double/triple IGU glass processing, and Qualicoat powder coating standards."))

    # 7 Series Grid Badges on Cover
    badge_y = 230.0
    cs.append("q 0.96 0.975 0.99 rg 48.0 160.0 499.28 115.0 re f 0.82 0.86 0.90 RG 1 w 48.0 160.0 499.28 115.0 re S Q")
    cs.append(text_cmd("F1", 10.0, (0.043, 0.227, 0.376), 64.0, 255.0, "CERTIFIED PRODUCT SERIES INCLUDED IN THIS MANUAL:"))

    series_items = [
        ("ARTOS SERIES", "SAT 120 Lift & Slide  |  SLAT 64 Multi-Rail Sliding"),
        ("HEKLA SERIES", "WAT 63 Thermal Break  |  WA 55 Standard  |  WA 45 Economic"),
        ("BROMO SERIES", "CWA 50 SG Structural Glazing  |  CWA 50 HV Concealed Vent"),
        ("NEPAL SERIES", "FAT 70 Heavy-Duty Bi-Fold  |  FAT 55 Panoramic Accordion"),
        ("IDA & URAL", "IPA 45 / IPA 30 Office Partitions  |  SA 65 Skylight & Roofs"),
        ("LOGAN SERIES", "GSA 130 Automated Motorized Guillotine Vertical Systems")
    ]

    row_y = 235.0
    for idx, (s_name, s_desc) in enumerate(series_items):
        cs.append(text_cmd("F1", 8.0, (0.165, 0.471, 0.722), 64.0, row_y, s_name + " :"))
        cs.append(text_cmd("F2", 8.0, (0.20, 0.25, 0.30), 160.0, row_y, s_desc))
        row_y -= 14.0

    # Bottom Factory Compliance Bar
    cs.append("q")
    cs.append("0.043 0.227 0.376 rg")
    cs.append("0 0 595.28 85 re f")
    cs.append("Q")

    cs.append(text_cmd("F1", 9.0, (1.0, 1.0, 1.0), 48.0, 60.0, "TRIPOLI INDUSTRIAL COMPLEX  -  MANUFACTURING DIRECTIVES"))
    cs.append(text_cmd("F2", 8.0, (0.85, 0.90, 0.95), 48.0, 44.0, "P.O. Box 82144, Ain Zara, Tripoli, Libya  |  Tel: +218 92 429 5050  |  info@ainzara.ly  |  www.ainzara.ly"))
    cs.append(text_cmd("F1", 8.0, (0.85, 0.65, 0.13), 48.0, 26.0, "CERTIFIED: ISO 9001:2015  *  QUALICOAT CERTIFIED  *  QUALANOD ANODIZING  *  EN 12020-2"))

    return "\n".join(cs).encode("latin1")

def build_toc_page():
    """Generates content stream for Page 2: Table of Contents & Corporate Infrastructure."""
    cs = []

    # Header Band
    cs.append("q 0.043 0.227 0.376 rg 0 775 595.28 67 re f 0.165 0.471 0.722 rg 0 771 595.28 4 re f Q")
    cs.append(f"q 36.00 0 0 {36.0 * hl_aspect:.2f} 36.00 788.00 cm /LogoHdr Do Q")
    cs.append(text_cmd("F1", 13.0, (1.0, 1.0, 1.0), 84.0, 814.0, "AINZARA ALUMINUM & GLASS PROCESSING"))
    cs.append(text_cmd("F2", 8.0, (0.85, 0.90, 0.95), 84.0, 798.0, "PAGE 02 OF 18  |  EXECUTIVE PROFILE, MACHINERY & TABLE OF CONTENTS"))

    # Watermark
    wm_draw_w = 380.0
    wm_draw_h = wm_draw_w * hl_aspect
    wm_x = (595.28 - wm_draw_w) / 2.0
    wm_y = (841.89 - wm_draw_h) / 2.0
    cs.append(f"q {wm_draw_w:.2f} 0 0 {wm_draw_h:.2f} {wm_x:.2f} {wm_y:.2f} cm /Watermark Do Q")

    # Section 1: Industrial Infrastructure Box
    cs.append("q 0.975 0.985 1.0 rg 36.0 575.0 523.28 175.0 re f 0.165 0.471 0.722 RG 1 w 36.0 575.0 523.28 175.0 re S Q")
    cs.append(text_cmd("F1", 11.0, (0.043, 0.227, 0.376), 50.0, 730.0, "FACTORY INFRASTRUCTURE & AUTOMATED FABRICATION CAPABILITIES"))

    overview_lines = [
        "- CNC Extrusion Processing: Dual-head automated precision miter saws (0.1mm tolerance), 4-axis profile machining centers.",
        "- Polyamide Thermal Barrier Crimping: Automated knurling, thermal strip insertion, and multi-roller crimping to EN 14024.",
        "- Automated Glass Processing: Lisec robotic double/triple insulating glass line with automated dual seal and 95%+ Argon gas fill.",
        "- Horizontal Tempering Furnace: Convection-assisted tempering for up to 19mm safety glass conforming strictly to EN 12150-1.",
        "- Surface Finishing Plant: Qualicoat-certified architectural electrostatic powder coating (60-80 microns) & Qualanod anodizing.",
        "- Engineering & Tender Support: Dedicated Tripoli engineering desk offering cutting list optimization, shop drawings, and BIM files."
    ]
    cur_y = 710.0
    for line in overview_lines:
        cs.append(text_cmd("F2", 8.0, (0.15, 0.20, 0.26), 50.0, cur_y, line))
        cur_y -= 16.0

    # Section 2: Table of Contents Table
    cs.append("q 0.043 0.227 0.376 rg 36.0 535.0 523.28 22.0 re f Q")
    cs.append(text_cmd("F1", 9.0, (1.0, 1.0, 1.0), 50.0, 542.0, "CATALOG INDEX & ARCHITECTURAL SYSTEMS MATRIX"))
    cs.append(text_cmd("F1", 9.0, (1.0, 1.0, 1.0), 490.0, 542.0, "PAGE NO."))

    toc_items = [
        ("01", "SAT 120", "ARTOS", "Lift & Slide Architectural Heavy-Duty Thermal System", "Page 03"),
        ("02", "SLAT 64", "ARTOS", "Monorail & Multi-Rail Sliding Window & Door System", "Page 04"),
        ("03", "WAT 63", "HEKLA", "High-Performance 24mm Thermal Break Casement System", "Page 05"),
        ("04", "WA 55", "HEKLA", "Standard Architectural Casement Door & Window System", "Page 06"),
        ("05", "WA 45", "HEKLA", "Economic Multi-Chamber Casement & Fixed Window System", "Page 07"),
        ("06", "CWA 50 SG", "BROMO", "Full Structural Glazing Curtain Wall (Flush Silicone)", "Page 08"),
        ("07", "CWA 50 HV", "BROMO", "Semi-Structural Curtain Wall with Concealed Vents", "Page 09"),
        ("08", "FAT 70", "NEPAL", "Heavy-Duty Thermal Break Bi-Fold Accordion Door", "Page 10"),
        ("09", "FAT 55", "NEPAL", "Panoramic Insulated Folding Door System", "Page 11"),
        ("10", "IPA 45", "IDA", "Acoustic Double-Glass Internal Office Partition Wall", "Page 12"),
        ("11", "IPA 30", "IDA", "Slimline Single-Glass Demountable Office Partition", "Page 13"),
        ("12", "SA 65", "URAL", "Skylight & Veranda Rafter Roof System with Drainage", "Page 14"),
        ("13", "SA 65-2", "URAL", "Heavy Wintergarden Glazed Roof with Steel Stiffener", "Page 15"),
        ("14", "GSA 130", "LOGAN", "Motorized Guillotine Vertical Sliding System (Somfy)", "Page 16"),
        ("15", "GLASS PLANT", "IGU/DGU", "Glass Processing Capabilities & High-Performance Glazing", "Page 17"),
        ("16", "DIRECTORY", "CONTACT", "Tripoli Factory Directory, WhatsApp Desks & Tenders", "Page 18"),
    ]

    t_y = 512.0
    for idx, (num, code, series, desc, p_num) in enumerate(toc_items):
        cs.append(f"q 0.88 0.90 0.93 RG 0.5 w 36.0 {t_y:.2f} 523.28 17.5 re S Q")
        cs.append(text_cmd("F1", 8.0, (0.043, 0.227, 0.376), 46.0, t_y + 4.5, num))
        cs.append(text_cmd("F1", 8.0, (0.165, 0.471, 0.722), 70.0, t_y + 4.5, f"{code:<11} ({series})"))
        cs.append(text_cmd("F2", 8.0, (0.12, 0.18, 0.24), 210.0, t_y + 4.5, desc))
        cs.append(text_cmd("F1", 8.0, (0.043, 0.227, 0.376), 500.0, t_y + 4.5, p_num))
        t_y -= 17.5

    # Footer
    cs.append("q 0.043 0.227 0.376 rg 0 0 595.28 28 re f Q")
    cs.append(text_cmd("F2", 7.5, (0.90, 0.95, 1.0), 36.0, 10.0, "AinZara Master Architectural Catalog  -  Tripoli Factory HQ  -  All Technical Rights Reserved."))
    cs.append(text_cmd("F1", 7.5, (1.0, 1.0, 1.0), 450.0, 10.0, "OFFICIAL SPECIFICATION"))

    return "\n".join(cs).encode("latin1")

def build_system_page(sys_info, page_num):
    """Generates content stream for one of the 14 System Technical Sheets."""
    img_rel_path = sys_info["img"]
    img_abs_path = os.path.join(REPO_ROOT, img_rel_path)
    with open(img_abs_path, "rb") as f:
        img_bytes = f.read()
    img_w, img_h = get_jpeg_dimensions(img_bytes)

    box_w = 523.0
    box_h = 245.0
    box_x = 36.0
    box_y = 460.0

    pad = 12.0
    inner_w = box_w - pad * 2
    inner_h = box_h - pad * 2 - 20.0
    scale = min(inner_w / img_w, inner_h / img_h)
    draw_w = img_w * scale
    draw_h = img_h * scale
    draw_x = box_x + pad + (inner_w - draw_w) / 2.0
    draw_y = box_y + pad + (inner_h - draw_h) / 2.0

    cs = []

    # 1. Header Band
    cs.append("q 0.043 0.227 0.376 rg 0 765 595.28 77 re f 0.165 0.471 0.722 rg 0 761 595.28 4 re f Q")
    hdr_draw_h = 48.0
    hdr_draw_w = hdr_draw_h / hl_aspect
    cs.append(f"q {hdr_draw_w:.2f} 0 0 {hdr_draw_h:.2f} 36.00 778.00 cm /LogoHdr Do Q")

    # Header text
    cs.append(text_cmd("F1", 14.0, (1.0, 1.0, 1.0), 96.0, 814.0, "AINZARA ALUMINUM & GLASS PROCESSING"))
    cs.append(text_cmd("F2", 8.0, (0.85, 0.90, 0.95), 96.0, 798.0, f"PAGE {page_num:02d} OF 18  |  Industrial Area, Tripoli, Libya  |  P.O. Box 82144  |  Tel: +218 92 429 5050"))
    cs.append(text_cmd("F1", 8.0, (0.45, 0.78, 1.0), 96.0, 782.0, "ARCHITECTURAL SYSTEMS DIVISION  |  OFFICIAL TECHNICAL SPECIFICATION SHEET"))

    # System Title & Series
    sys_title = f"{sys_info['name']} - {sys_info['title']}"
    sys_meta = f"SERIES: {sys_info['series']}   |   SYSTEM CODE: {sys_info['id'].upper()}   |   EXTRUSION: EN AW-6063 T6"
    cs.append(text_cmd("F1", 15.0, (0.043, 0.227, 0.376), 36.0, 736.0, sys_title))
    cs.append(text_cmd("F1", 9.0, (0.165, 0.471, 0.722), 36.0, 718.0, sys_meta))

    # CAD Viewport Outline
    cs.append("q 0.82 0.86 0.90 RG 1 w")
    cs.append(f"{box_x} {box_y} {box_w} {box_h} re S")
    cs.append("0.043 0.227 0.376 rg")
    cs.append(f"{box_x} {box_y + box_h - 20} 220 20 re f")
    cs.append("Q")

    # Table Header & Grid
    tbl_y = 430.0
    cs.append("q 0.043 0.227 0.376 rg")
    cs.append(f"36.00 {tbl_y:.2f} 523.00 20.00 re f Q")

    rows = [
        ("Base Aluminum Alloy", sys_info["alloy"]),
        ("Frame Architectural Depth", sys_info["frame_depth"]),
        ("Sash / Vent Profile Depth", sys_info["vent_depth"]),
        ("Glazing Thickness Capacity", sys_info["glass_range"]),
        ("Thermal Barrier Insulation", sys_info["insulation"]),
        ("Air Permeability (EN 12207)", sys_info["air_perm"]),
        ("Water Tightness (EN 12208)", sys_info["water_tight"]),
        ("Wind Load Resistance (EN 12210)", sys_info["wind_load"]),
        ("Acoustic Sound Reduction", sys_info["acoustic"]),
        ("Maximum Sash Weight Capacity", sys_info["max_sash_wt"]),
    ]

    row_h = 16.5
    cur_y = tbl_y - row_h
    for idx, (label, val) in enumerate(rows):
        cs.append(f"q 0.88 0.90 0.93 RG 0.5 w 36.00 {cur_y:.2f} 523.00 {row_h:.2f} re S Q")
        cur_y -= row_h

    # Quality Box Outline
    notes_top = cur_y - 6.0
    box_height = 68.0
    notes_bottom = notes_top - box_height
    cs.append("q 0.165 0.471 0.722 RG 0.8 w")
    cs.append(f"36.00 {notes_bottom:.2f} 523.00 {box_height:.2f} re S Q")

    # Footer Bar
    cs.append("q 0.043 0.227 0.376 rg 0 0 595.28 28 re f Q")

    # Watermark
    wm_draw_w = 380.0
    wm_draw_h = wm_draw_w * hl_aspect
    wm_x = (595.28 - wm_draw_w) / 2.0
    wm_y = (841.89 - wm_draw_h) / 2.0
    cs.append(f"q {wm_draw_w:.2f} 0 0 {wm_draw_h:.2f} {wm_x:.2f} {wm_y:.2f} cm /Watermark Do Q")

    # CAD Schematic Image XObject
    img_xobject_name = f"/ImSys_{sys_info['id'].replace('-', '_')}"
    cs.append(f"q {draw_w:.2f} 0 0 {draw_h:.2f} {draw_x:.2f} {draw_y:.2f} cm {img_xobject_name} Do Q")

    # Foreground Typography
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), box_x + 8.0, box_y + box_h - 14.0, "ENGINEERING 2D CAD PROFILE SCHEMATIC"))
    cs.append(text_cmd("F1", 9.0, (1.0, 1.0, 1.0), 46.0, tbl_y + 6.0, "MECHANICAL & ARCHITECTURAL SPECIFICATION MATRIX"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 430.0, tbl_y + 6.0, "MANUFACTURING STANDARD"))

    cur_y = tbl_y - row_h
    for label, val in rows:
        cs.append(text_cmd("F1", 8.0, (0.12, 0.18, 0.24), 46.0, cur_y + 4.5, label))
        cs.append(text_cmd("F2", 8.0, (0.05, 0.10, 0.15), 220.0, cur_y + 4.5, val))
        cur_y -= row_h

    cs.append(text_cmd("F1", 8.5, (0.043, 0.227, 0.376), 46.0, notes_top - 14.0, "FABRICATION STANDARDS & QUALITY COMPLIANCE"))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 27.0, "- Extrusion Tolerances: Conforms strictly to EN 12020-2 / DIN 17615 high precision architectural standard."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 39.0, "- Surface Coating: Qualicoat Certified Electrostatic Powder Coating (60-80 microns) / Qualanod Anodizing (15-20 microns)."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 51.0, "- Gaskets: EPDM weatherseals according to DIN 7863. Hardware groove: Standard European groove compatibility."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 63.0, "- Quality Management: Extruded and assembled under certified ISO 9001:2015 industrial manufacturing systems."))

    sign_y = notes_bottom - 18.0
    cs.append(text_cmd("F1", 7.5, (0.30, 0.35, 0.42), 46.0, sign_y, "FACTORY DIRECTIVE:"))
    cs.append(text_cmd("F2", 7.5, (0.30, 0.35, 0.42), 140.0, sign_y, "Official technical specifications verified for tender submissions, fabrication, and structural installation."))
    cs.append(text_cmd("F1", 7.5, (0.043, 0.227, 0.376), 46.0, sign_y - 12.0, "DIRECT CONTACT:"))
    cs.append(text_cmd("F2", 7.5, (0.30, 0.35, 0.42), 140.0, sign_y - 12.0, "+218 92 429 5050  |  +218 91 614 1616  |  Tripoli Industrial Complex, Libya  |  www.ainzara.ly"))

    cs.append(text_cmd("F2", 7.5, (0.90, 0.95, 1.0), 36.0, 10.0, "AinZara Master Architectural Catalog  -  Tripoli Factory HQ  -  All Technical Rights Reserved."))
    cs.append(text_cmd("F1", 7.5, (1.0, 1.0, 1.0), 450.0, 10.0, f"PAGE {page_num:02d} OF 18"))

    return "\n".join(cs).encode("latin1")

def build_glass_page():
    """Generates content stream for Page 17: Glass Processing Capabilities."""
    cs = []

    # Header Band
    cs.append("q 0.043 0.227 0.376 rg 0 775 595.28 67 re f 0.165 0.471 0.722 rg 0 771 595.28 4 re f Q")
    cs.append(f"q 36.00 0 0 {36.0 * hl_aspect:.2f} 36.00 788.00 cm /LogoHdr Do Q")
    cs.append(text_cmd("F1", 13.0, (1.0, 1.0, 1.0), 84.0, 814.0, "AINZARA ALUMINUM & GLASS PROCESSING"))
    cs.append(text_cmd("F2", 8.0, (0.85, 0.90, 0.95), 84.0, 798.0, "PAGE 17 OF 18  |  AUTOMATED GLASS PROCESSING DIVISION & GLAZING MATRIX"))

    # Watermark
    wm_draw_w = 380.0
    wm_draw_h = wm_draw_w * hl_aspect
    wm_x = (595.28 - wm_draw_w) / 2.0
    wm_y = (841.89 - wm_draw_h) / 2.0
    cs.append(f"q {wm_draw_w:.2f} 0 0 {wm_draw_h:.2f} {wm_x:.2f} {wm_y:.2f} cm /Watermark Do Q")

    # Overview Box
    cs.append("q 0.975 0.985 1.0 rg 36.0 635.0 523.28 120.0 re f 0.165 0.471 0.722 RG 1 w 36.0 635.0 523.28 120.0 re S Q")
    cs.append(text_cmd("F1", 11.0, (0.043, 0.227, 0.376), 50.0, 735.0, "AUTOMATED GLASS PROCESSING PLANT (TRIPOLI FACILITY)"))
    cs.append(text_cmd("F2", 8.5, (0.15, 0.20, 0.26), 50.0, 715.0, "AinZara operates modern CNC glass cutting, automated double-edge grinding, convection tempering,"))
    cs.append(text_cmd("F2", 8.5, (0.15, 0.20, 0.26), 50.0, 700.0, "and robotic insulating glass assembly lines for high-performance architectural facades across Libya."))
    cs.append(text_cmd("F1", 8.5, (0.165, 0.471, 0.722), 50.0, 680.0, "CERTIFIED QUALITY STANDARDS: EN 1279-2 (IGU Gas Retention), EN 12150-1 (Tempered Safety), EN 14449 (Laminated)."))

    # Glazing Specification Table
    tbl_y = 600.0
    cs.append("q 0.043 0.227 0.376 rg 36.0 600.0 523.28 22.0 re f Q")
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 46.0, 607.0, "GLAZING MAKEUP SPECIFICATION"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 220.0, 607.0, "Ug VALUE (W/m2K)"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 330.0, 607.0, "SHGC"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 410.0, 607.0, "ACOUSTIC Rw"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 490.0, 607.0, "RECOMMENDED"))

    glass_specs = [
        ("6mm Clear Monolithic Toughened", "5.7 W/m2K", "0.82", "31 dB", "Interior Partition (IPA 30)"),
        ("8mm / 10mm Clear Tempered Safety", "5.6 W/m2K", "0.79", "33 dB", "Guillotine Balcony (GSA 130)"),
        ("6mm + 12mm Air + 6mm Clear DGU", "2.8 W/m2K", "0.72", "34 dB", "Economic Casement (WA 45)"),
        ("6mm + 16mm Argon + 6mm Low-E IGU", "1.1 W/m2K", "0.40", "37 dB", "Standard Thermal (WAT 63)"),
        ("6mm Solar + 16Ar + 6mm Low-E IGU", "1.0 W/m2K", "0.28", "38 dB", "Curtain Wall Facade (CWA 50)"),
        ("8mm + 20Ar + 8mm Heavy Acoustic IGU", "1.1 W/m2K", "0.38", "42 dB", "Lift & Slide Door (SAT 120)"),
        ("4.4.2 PVB Laminated + 16Ar + 6 Low-E", "1.1 W/m2K", "0.36", "44 dB", "Security & Acoustic Glazing"),
        ("6.6.2 Acoustic PVB Laminated", "5.2 W/m2K", "0.68", "46 dB", "Office Partition (IPA 45)"),
        ("6 Low-E + 14Ar + 4 Float + 14Ar + 6 Low-E", "0.6 W/m2K", "0.29", "45 dB", "Passive House Triple IGU"),
    ]

    cur_y = tbl_y - 20.0
    for title, ug, shgc, rw, rec in glass_specs:
        cs.append(f"q 0.88 0.90 0.93 RG 0.5 w 36.0 {cur_y:.2f} 523.28 20.0 re S Q")
        cs.append(text_cmd("F1", 8.0, (0.043, 0.227, 0.376), 46.0, cur_y + 5.5, title))
        cs.append(text_cmd("F2", 8.0, (0.12, 0.18, 0.24), 220.0, cur_y + 5.5, ug))
        cs.append(text_cmd("F2", 8.0, (0.12, 0.18, 0.24), 330.0, cur_y + 5.5, shgc))
        cs.append(text_cmd("F1", 8.0, (0.165, 0.471, 0.722), 410.0, cur_y + 5.5, rw))
        cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 490.0, cur_y + 5.5, rec))
        cur_y -= 20.0

    # Capabilities Summary
    cap_y = cur_y - 15.0
    cs.append(f"q 0.97 0.985 1.0 rg 36.0 {cap_y - 120.0:.2f} 523.28 120.0 re f 0.82 0.86 0.90 RG 1 w 36.0 {cap_y - 120.0:.2f} 523.28 120.0 re S Q")
    cs.append(text_cmd("F1", 9.5, (0.043, 0.227, 0.376), 50.0, cap_y - 18.0, "PROCESSING EQUIPMENT & MAXIMUM CAPACITIES"))

    equip_lines = [
        "- Max Tempered Sheet Size: 2440 x 5000 mm (Glass thicknesses from 4mm up to 19mm).",
        "- Double Glazing Automatic Sealing: Automated two-component polysulfide or structural silicone edge sealing.",
        "- High-Altitude / Pressure Equalization: Capillary breather tubes installed for projects in mountainous areas.",
        "- Acoustic Lamination Autoclave: Multi-layer acoustic PVB & SentryGlas (SG) ionoplast interlayers for cyclone/bullet resistance.",
        "- Spandrel & Ceramic Fritted Glass: High-durability screen-printed ceramic enamel baked into glass during tempering."
    ]
    sub_y = cap_y - 36.0
    for el in equip_lines:
        cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 50.0, sub_y, el))
        sub_y -= 16.0

    # Footer
    cs.append("q 0.043 0.227 0.376 rg 0 0 595.28 28 re f Q")
    cs.append(text_cmd("F2", 7.5, (0.90, 0.95, 1.0), 36.0, 10.0, "AinZara Master Architectural Catalog  -  Tripoli Factory HQ  -  All Technical Rights Reserved."))
    cs.append(text_cmd("F1", 7.5, (1.0, 1.0, 1.0), 450.0, 10.0, "PAGE 17 OF 18"))

    return "\n".join(cs).encode("latin1")

def build_back_cover_page():
    """Generates content stream for Page 18: Back Cover & Directory."""
    cs = []

    # Navy Top Banner
    cs.append("q 0.043 0.227 0.376 rg 0 710 595.28 131.89 re f 0.165 0.471 0.722 rg 0 704 595.28 6 re f Q")
    cs.append(text_cmd("F1", 20.0, (1.0, 1.0, 1.0), 48.0, 785.0, "TRIPOLI INDUSTRIAL HEADQUARTERS"))
    cs.append(text_cmd("F2", 10.0, (0.85, 0.90, 0.98), 48.0, 762.0, "Ain Zara Industrial District, Tripoli, Libya  -  Official Factory Complex"))
    cs.append(text_cmd("F1", 11.0, (0.45, 0.78, 1.0), 48.0, 740.0, "DIRECT FACTORY INQUIRY DIRECTORY & TENDER DESKS"))

    # Watermark
    wm_draw_w = 380.0
    wm_draw_h = wm_draw_w * hl_aspect
    wm_x = (595.28 - wm_draw_w) / 2.0
    wm_y = (841.89 - wm_draw_h) / 2.0
    cs.append(f"q {wm_draw_w:.2f} 0 0 {wm_draw_h:.2f} {wm_x:.2f} {wm_y:.2f} cm /Watermark Do Q")

    # Priority Contact Box
    cs.append("q 0.98 0.985 0.995 rg 48.0 380.0 499.28 290.0 re f 0.165 0.471 0.722 RG 1 w 48.0 380.0 499.28 290.0 re S Q")
    cs.append(text_cmd("F1", 12.0, (0.043, 0.227, 0.376), 68.0, 640.0, "DIRECT FACTORY TELECOMMUNICATIONS & WHATSAPP"))

    contacts = [
        ("PRIORITY LINE 01", "+218 92 429 5050", "WhatsApp Direct: wa.me/218924295050"),
        ("PRIORITY LINE 02", "+218 91 614 1616", "WhatsApp Direct: wa.me/218916141616"),
        ("PRIORITY LINE 03", "+218 92 211 7555", "WhatsApp Direct: wa.me/218922117555"),
        ("PRIORITY LINE 04", "+218 91 552 0267", "Voice Direct (Telephone Calls)"),
        ("PRIORITY LINE 05", "+218 91 680 8225", "WhatsApp Direct: wa.me/218916808225"),
    ]

    c_y = 605.0
    for dept, phone, info in contacts:
        cs.append("q 0.043 0.227 0.376 rg 68.0 " + f"{c_y - 2:.2f} 6.0 16.0 re f Q")
        cs.append(text_cmd("F1", 9.0, (0.043, 0.227, 0.376), 84.0, c_y + 4.0, dept))
        cs.append(text_cmd("F1", 11.0, (0.165, 0.471, 0.722), 270.0, c_y + 3.0, phone))
        cs.append(text_cmd("F2", 7.5, (0.30, 0.35, 0.42), 84.0, c_y - 11.0, info))
        c_y -= 44.0

    # Digital Portal & Tenders Box
    cs.append("q 0.043 0.227 0.376 rg 48.0 200.0 499.28 150.0 re f Q")
    cs.append(text_cmd("F1", 13.0, (1.0, 1.0, 1.0), 68.0, 320.0, "DIGITAL ARCHITECTURAL PORTAL & ONLINE TOOLS"))
    cs.append(text_cmd("F2", 9.0, (0.85, 0.90, 0.98), 68.0, 300.0, "Visit the official AinZara web platform for interactive 3D WebGL models, CAD DWG files,"))
    cs.append(text_cmd("F2", 9.0, (0.85, 0.90, 0.98), 68.0, 285.0, "open-IFC BIM components for Autodesk Revit, and the automated cutting list calculator."))
    cs.append(text_cmd("F1", 10.0, (0.85, 0.65, 0.13), 68.0, 260.0, "WEBSITE: https://ainzara.ly   |   EMAIL: info@ainzara.ly"))
    cs.append(text_cmd("F2", 8.0, (0.80, 0.85, 0.92), 68.0, 240.0, "Operating Hours: Saturday to Thursday, 08:30 to 18:00 (Tripoli Time)"))

    # Official Certification Seals Bar
    cs.append("q 0.95 0.96 0.97 rg 48.0 100.0 499.28 80.0 re f 0.82 0.86 0.90 RG 1 w 48.0 100.0 499.28 80.0 re S Q")
    cs.append(text_cmd("F1", 8.5, (0.043, 0.227, 0.376), 68.0, 160.0, "MANUFACTURING ACCREDITATIONS & QUALITY SEALS:"))
    cs.append(text_cmd("F2", 8.0, (0.25, 0.30, 0.35), 68.0, 142.0, "ISO 9001:2015 Quality Management Certified  *  CE Mark Declaration of Performance"))
    cs.append(text_cmd("F2", 8.0, (0.25, 0.30, 0.35), 68.0, 126.0, "Qualicoat Standard No. 42918  *  Qualanod Architectural Anodizing Standard No. 1824"))
    cs.append(text_cmd("F2", 8.0, (0.25, 0.30, 0.35), 68.0, 110.0, "EN AW-6063 T6 Alloy Extrusion strictly conforming to DIN 17615 / EN 12020-2"))

    # Bottom Footer
    cs.append("q 0.043 0.227 0.376 rg 0 0 595.28 35 re f Q")
    cs.append(text_cmd("F2", 7.5, (0.90, 0.95, 1.0), 48.0, 14.0, "AinZara Aluminum & Glass Processing  -  Official Master Architectural Catalog  -  All Technical Rights Reserved."))
    cs.append(text_cmd("F1", 7.5, (1.0, 1.0, 1.0), 480.0, 14.0, "PAGE 18 OF 18"))

    return "\n".join(cs).encode("latin1")

def main():
    print(f"Generating AinZara Complete Architectural Master Catalog (18 Pages)...")

    # We will build a single ISO 32000-1 PDF containing 18 pages.
    # Shared objects:
    # 1: Catalog
    # 2: Pages tree
    # 3..20: The 18 Page dictionaries
    # 21: Font F1 (Helvetica-Bold)
    # 22: Font F2 (Helvetica)
    # 23: Header Logo RGB
    # 24: Header Logo Mask
    # 25: Cover Logo RGB
    # 26: Cover Logo Mask
    # 27: Watermark RGB
    # 28: Watermark Mask
    # Then for each of the 14 systems:
    #   Sys Image RGB + Sys Image Mask (2 objects per system = 28 objects)
    # Then 18 Contents streams (1 per page = 18 objects)

    objects = []
    
    # Pre-process 14 system images
    print("Processing 14 system cross-section images with transparency masks...")
    system_img_data = {}
    for s in SYSTEMS:
        img_abs = os.path.join(REPO_ROOT, s["img"])
        with open(img_abs, "rb") as f:
            ibytes = f.read()
        iw, ih = get_jpeg_dimensions(ibytes)
        
        sim = Image.open(img_abs).convert("RGB")
        sr, sg, sb = sim.split()
        dr = ImageChops.invert(sr)
        dg = ImageChops.invert(sg)
        db = ImageChops.invert(sb)
        md = ImageChops.lighter(ImageChops.lighter(dr, dg), db)
        smask = md.point(lambda p: 0 if p < 8 else (255 if p > 22 else int((p - 8) / 14.0 * 255)))
        smask_bytes = zlib.compress(smask.tobytes())

        system_img_data[s["id"]] = {
            "w": iw, "h": ih,
            "img_bytes": ibytes,
            "mask_bytes": smask_bytes
        }

    # Generate content streams for all 18 pages
    print("Generating page layouts and typography...")
    page_streams = []
    # Page 1: Cover
    page_streams.append(build_cover_page())
    # Page 2: TOC
    page_streams.append(build_toc_page())
    # Pages 3-16: 14 Systems
    for idx, s in enumerate(SYSTEMS, 3):
        page_streams.append(build_system_page(s, idx))
    # Page 17: Glass
    page_streams.append(build_glass_page())
    # Page 18: Back Cover
    page_streams.append(build_back_cover_page())

    # Build Object IDs table
    # 1: Catalog
    # 2: Pages
    # 3..20: Pages 1..18
    # 21: Font F1
    # 22: Font F2
    # 23: Header Logo RGB
    # 24: Header Logo Mask
    # 25: Cover Logo RGB
    # 26: Cover Logo Mask
    # 27: Watermark RGB
    # 28: Watermark Mask
    # 29..56: 14 systems (RGB + Mask)
    # 57..74: 18 Content streams

    f1_id = 21
    f2_id = 22
    hdr_rgb_id = 23
    hdr_mask_id = 24
    cov_rgb_id = 25
    cov_mask_id = 26
    wm_rgb_id = 27
    wm_mask_id = 28

    sys_obj_map = {}
    cur_obj_id = 29
    for s in SYSTEMS:
        sys_obj_map[s["id"]] = {
            "rgb_id": cur_obj_id,
            "mask_id": cur_obj_id + 1
        }
        cur_obj_id += 2

    content_start_id = cur_obj_id

    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")

    # 2: Pages Tree
    kids_str = " ".join([f"{3 + i} 0 R" for i in range(18)])
    objects.append(f"<< /Type /Pages /Kids [{kids_str}] /Count 18 >>".encode("latin1"))

    # 3..20: The 18 Page Objects
    for i in range(18):
        page_idx = i + 1
        content_id = content_start_id + i

        # Build XObject resource dictionary for this page
        xobj_entries = [
            f"/LogoHdr {hdr_rgb_id} 0 R",
            f"/LogoHdrMask {hdr_mask_id} 0 R",
            f"/Watermark {wm_rgb_id} 0 R",
            f"/WatermarkMask {wm_mask_id} 0 R",
        ]
        if page_idx == 1:
            xobj_entries.extend([
                f"/LogoCov {cov_rgb_id} 0 R",
                f"/LogoCovMask {cov_mask_id} 0 R"
            ])
        elif 3 <= page_idx <= 16:
            sys_info = SYSTEMS[page_idx - 3]
            s_map = sys_obj_map[sys_info["id"]]
            xobj_key = f"/ImSys_{sys_info['id'].replace('-', '_')}"
            xobj_entries.append(f"{xobj_key} {s_map['rgb_id']} 0 R")

        p_dict = (
            f"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] "
            f"/Resources << /Font << /F1 {f1_id} 0 R /F2 {f2_id} 0 R >> "
            f"/XObject << {' '.join(xobj_entries)} >> "
            f"/ProcSet [/PDF /Text /ImageC] >> "
            f"/Contents {content_id} 0 R >>"
        ).encode("latin1")
        objects.append(p_dict)

    # 21 & 22: Fonts
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")

    # 23 & 24: Header Logo
    hl_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {hdr_w} /Height {hdr_h} /ColorSpace /DeviceRGB "
        f"/BitsPerComponent 8 /Filter /FlateDecode /SMask {hdr_mask_id} 0 R /Length {len(hdr_rgb_bytes)} >>\nstream\n".encode("latin1")
        + hdr_rgb_bytes + b"\nendstream"
    )
    objects.append(hl_dict)
    hl_mask = (
        f"<< /Type /XObject /Subtype /Image /Width {hdr_w} /Height {hdr_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(hdr_alpha_bytes)} >>\nstream\n".encode("latin1")
        + hdr_alpha_bytes + b"\nendstream"
    )
    objects.append(hl_mask)

    # 25 & 26: Cover Logo
    cov_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {cov_w} /Height {cov_h} /ColorSpace /DeviceRGB "
        f"/BitsPerComponent 8 /Filter /FlateDecode /SMask {cov_mask_id} 0 R /Length {len(cov_rgb_bytes)} >>\nstream\n".encode("latin1")
        + cov_rgb_bytes + b"\nendstream"
    )
    objects.append(cov_dict)
    cov_mask = (
        f"<< /Type /XObject /Subtype /Image /Width {cov_w} /Height {cov_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(cov_alpha_bytes)} >>\nstream\n".encode("latin1")
        + cov_alpha_bytes + b"\nendstream"
    )
    objects.append(cov_mask)

    # 27 & 28: Watermark
    wm_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {wm_target_w} /Height {wm_target_h} /ColorSpace /DeviceRGB "
        f"/BitsPerComponent 8 /Filter /FlateDecode /SMask {wm_mask_id} 0 R /Length {len(wm_rgb_bytes)} >>\nstream\n".encode("latin1")
        + wm_rgb_bytes + b"\nendstream"
    )
    objects.append(wm_dict)
    wm_mask = (
        f"<< /Type /XObject /Subtype /Image /Width {wm_target_w} /Height {wm_target_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(wm_alpha_bytes)} >>\nstream\n".encode("latin1")
        + wm_alpha_bytes + b"\nendstream"
    )
    objects.append(wm_mask)

    # 29..56: 14 System Images (RGB with DCTDecode + SMask Grayscale)
    for s in SYSTEMS:
        sdata = system_img_data[s["id"]]
        sm = sys_obj_map[s["id"]]
        simg_dict = (
            f"<< /Type /XObject /Subtype /Image /Width {sdata['w']} /Height {sdata['h']} "
            f"/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /SMask {sm['mask_id']} 0 R /Length {len(sdata['img_bytes'])} >>\nstream\n".encode("latin1")
            + sdata["img_bytes"] + b"\nendstream"
        )
        objects.append(simg_dict)

        smask_dict = (
            f"<< /Type /XObject /Subtype /Image /Width {sdata['w']} /Height {sdata['h']} /ColorSpace /DeviceGray "
            f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(sdata['mask_bytes'])} >>\nstream\n".encode("latin1")
            + sdata["mask_bytes"] + b"\nendstream"
        )
        objects.append(smask_dict)

    # 57..74: 18 Content Streams
    for s_bytes in page_streams:
        c_obj = f"<< /Length {len(s_bytes)} >>\nstream\n".encode("latin1") + s_bytes + b"\nendstream"
        objects.append(c_obj)

    # Write Master Catalog PDF file
    with open(OUTPUT_CATALOG_PATH, "wb") as f:
        f.write(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        offsets = [0]
        pos = len(b"%PDF-1.4\n%\xe2\xe3\xcf\xd3\n")
        for i, obj in enumerate(objects, 1):
            offsets.append(pos)
            hdr = f"{i} 0 obj\n".encode("latin1")
            f.write(hdr)
            f.write(obj)
            f.write(b"\nendobj\n")
            pos += len(hdr) + len(obj) + len(b"\nendobj\n")
        
        xref_offset = pos
        f.write(f"xref\n0 {len(objects) + 1}\n0000000000 65535 f \n".encode("latin1"))
        for off in offsets[1:]:
            f.write(f"{off:010d} 00000 n \n".encode("latin1"))
        f.write(f"trailer\n<< /Size {len(objects) + 1} /Root 1 0 R >>\nstartxref\n{xref_offset}\n%%EOF\n".encode("latin1"))

    file_size = os.path.getsize(OUTPUT_CATALOG_PATH)
    print(f"Successfully generated Master Architectural Catalog!")
    print(f"  File: {OUTPUT_CATALOG_PATH}")
    print(f"  Pages: 18 Pages")
    print(f"  Size: {file_size:,} bytes ({file_size / (1024*1024):.2f} MB)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
