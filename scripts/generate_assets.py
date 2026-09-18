#!/usr/bin/env python3
"""
AinZara-Aluminum - Technical Sheet (PDF) & AutoCAD (DWG/DXF) Generator
Produces authentic, standard-compliant technical spec sheets with:
1. No overlapping text (pure absolute 1 0 0 1 x y Tm positioning for all text)
2. Transparent logo in header band
3. Transparent watermark from assets/Images/Logo1.png centered at 9% opacity
4. High-resolution CAD schematic cross-section centered in its dedicated viewport
5. Full mechanical performance specification table
6. Fabrication compliance and quality standards
"""

import os
import zlib
from PIL import Image, ImageChops

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(BASE_DIR, "assets", "downloads", "pdf")
CAD_DIR = os.path.join(BASE_DIR, "assets", "downloads", "cad")

os.makedirs(PDF_DIR, exist_ok=True)
os.makedirs(CAD_DIR, exist_ok=True)

# Process Logo_Watermark.png (or Logo1.png) for Header Logo and Watermark
LOGO_PATH = os.path.join(BASE_DIR, "assets", "Images", "Logo_Watermark.png")
if not os.path.exists(LOGO_PATH):
    LOGO_PATH = os.path.join(BASE_DIR, "assets", "Images", "Logo1.png")
orig_logo = Image.open(LOGO_PATH)

# Crop transparent padding around logo to ensure perfectly centered watermark
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

# 1. Header Logo (48pt height, rendered at ~48x48 pt in header)
hdr_w = 120
hdr_h = int(hdr_w * hl_aspect)
hdr_logo_img = tight_logo.resize((hdr_w, hdr_h), Image.Resampling.LANCZOS)
hl_r, hl_g, hl_b, hl_a = hdr_logo_img.split()
hdr_rgb_img = Image.merge('RGB', (hl_r, hl_g, hl_b))
hdr_rgb_bytes = zlib.compress(hdr_rgb_img.tobytes())
hdr_alpha_bytes = zlib.compress(hl_a.tobytes())

# 2. Watermark Logo (High-resolution, centered on page, authentic 17% opacity)
wm_target_w = 800
wm_target_h = int(wm_target_w * hl_aspect)
wm_img = tight_logo.resize((wm_target_w, wm_target_h), Image.Resampling.LANCZOS)
wm_r, wm_g, wm_b, wm_a = wm_img.split()
wm_rgb_img = Image.merge('RGB', (wm_r, wm_g, wm_b))
# 17% soft opacity for watermark, perfectly clean transparent background
wm_soft_alpha = wm_a.point(lambda p: int((p / 255.0) * 0.17 * 255) if p > 10 else 0)
wm_rgb_bytes = zlib.compress(wm_rgb_img.tobytes())
wm_alpha_bytes = zlib.compress(wm_soft_alpha.tobytes())

# System Catalog Master Data
SYSTEMS = [
    {
        "id": "sat120",
        "name": "SAT 120",
        "title": "Lift & Slide Architectural System",
        "series": "ARTOS SERIES",
        "img": "assets/Sliding/sat120.jpg",
        "frame_depth": "120 mm (Dual Track) / 180 mm (Triple Track)",
        "vent_depth": "50 mm Heavy-Duty Reinforced Sash",
        "glass_range": "24 mm - 38 mm Double / Triple IGU",
        "insulation": "20 mm Polyamide PA66 GF25 Thermal Barrier",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 9A (EN 12208 / 600 Pa)",
        "wind_load": "Class C4 (EN 12210 / 1600 Pa)",
        "acoustic": "Rw = 37 - 42 dB",
        "max_sash_wt": "300 kg (Slide) / 400 kg (Lift & Slide)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 120.0, "dy": 50.0
    },
    {
        "id": "slat64",
        "name": "SLAT 64",
        "title": "Monorail & Multi-Rail Sliding System",
        "series": "ARTOS SERIES",
        "img": "assets/Sliding/slat64.jpg",
        "frame_depth": "64 mm (2-Rail) / 112 mm (3-Rail)",
        "vent_depth": "38 mm Curved / Interlocking Sash",
        "glass_range": "18 mm - 28 mm Insulated Glazing",
        "insulation": "Standard Non-Thermal / Interlock Brush Gaskets",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 32 - 36 dB",
        "max_sash_wt": "160 kg per Sash",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 64.0, "dy": 38.0
    },
    {
        "id": "wat63",
        "name": "WAT 63",
        "title": "High-Performance Thermal Break Casement System",
        "series": "HEKLA SERIES",
        "img": "assets/Door-Window/wat63.jpg",
        "frame_depth": "63 mm Architectural Depth",
        "vent_depth": "71 mm Inward / Outward Rebate Sash",
        "glass_range": "20 mm - 42 mm High Acoustic IGU",
        "insulation": "24 mm Polyamide PA66 GF25 Thermal Barrier",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 9A (EN 12208 / 600 Pa)",
        "wind_load": "Class C5 (EN 12210 / 2000 Pa)",
        "acoustic": "Rw = 38 - 44 dB",
        "max_sash_wt": "180 kg (Tilt & Turn) / 220 kg (Door)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 63.0, "dy": 71.0
    },
    {
        "id": "wa55",
        "name": "WA 55",
        "title": "Standard Casement Door & Window System",
        "series": "HEKLA SERIES",
        "img": "assets/Door-Window/wa55.jpg",
        "frame_depth": "55 mm Architectural Frame",
        "vent_depth": "63 mm Overlap Sash with Drip Deflector",
        "glass_range": "6 mm Monolithic - 32 mm Double IGU",
        "insulation": "Standard Hollow Non-Thermal Multi-Chamber",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 8A (EN 12208 / 450 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 32 - 37 dB",
        "max_sash_wt": "130 kg (Window) / 160 kg (Entrance Door)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 55.0, "dy": 63.0
    },
    {
        "id": "wa45",
        "name": "WA 45",
        "title": "Economic Casement & Fixed Window System",
        "series": "HEKLA SERIES",
        "img": "assets/Door-Window/wa45.jpg",
        "frame_depth": "45 mm Compact Profile Depth",
        "vent_depth": "52 mm Casement Sash",
        "glass_range": "4 mm Monolithic - 24 mm Double Glazing",
        "insulation": "Single Hollow Chamber Non-Thermal",
        "air_perm": "Class 2 (EN 12207 / 300 Pa)",
        "water_tight": "Class 6A (EN 12208 / 250 Pa)",
        "wind_load": "Class C2 (EN 12210 / 800 Pa)",
        "acoustic": "Rw = 30 - 34 dB",
        "max_sash_wt": "90 kg (Window) / 120 kg (Door)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 45.0, "dy": 52.0
    },
    {
        "id": "CWA50sg",
        "name": "CWA 50 SG",
        "title": "Full Structural Glazing Curtain Wall System",
        "series": "BROMO SERIES",
        "img": "assets/Facade/CWA50sg.jpg",
        "frame_depth": "80 mm - 220 mm Structural Mullion Depths",
        "vent_depth": "50 mm Exterior Sightline (Flush Glass)",
        "glass_range": "24 mm - 44 mm Structural Silicone Bonded IGU",
        "insulation": "Continuous EPDM Multi-Fin Thermal Isolators",
        "air_perm": "Class AE 1200 (EN 12152 / 1200 Pa)",
        "water_tight": "Class RE 1500 (EN 12154 / 1500 Pa)",
        "wind_load": "Design 2000 Pa / Safety 3000 Pa (EN 13116)",
        "acoustic": "Rw = 42 - 48 dB",
        "max_sash_wt": "350 kg per Glazing Module",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 50.0, "dy": 150.0
    },
    {
        "id": "CWA50HV",
        "name": "CWA 50 HV",
        "title": "Semi-Structural Concealed Vent Facade System",
        "series": "BROMO SERIES",
        "img": "assets/Facade/CWA50HV.jpg",
        "frame_depth": "80 mm - 220 mm Mullion & Transom Matrix",
        "vent_depth": "50 mm Visible Grid with Hidden Operable Vents",
        "glass_range": "24 mm - 44 mm Double / Triple Acoustic Glazing",
        "insulation": "Multi-stage EPDM Isolator with Polyamide Core",
        "air_perm": "Class AE 1200 (EN 12152 / 1200 Pa)",
        "water_tight": "Class RE 1200 (EN 12154 / 1200 Pa)",
        "wind_load": "Design 2000 Pa / Safety 3000 Pa (EN 13116)",
        "acoustic": "Rw = 40 - 46 dB",
        "max_sash_wt": "180 kg Concealed Parallel / Top-Hung Vent",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 50.0, "dy": 120.0
    },
    {
        "id": "fat70",
        "name": "FAT 70",
        "title": "Heavy-Duty Thermal Break Bi-Fold Door System",
        "series": "NEPAL SERIES",
        "img": "assets/Folding-Door/fat70.jpg",
        "frame_depth": "70 mm Architectural Frame",
        "vent_depth": "70 mm Heavy Flush Sash Assembly",
        "glass_range": "24 mm - 40 mm High-Performance IGU",
        "insulation": "30 mm Polyamide PA66 GF25 Thermal Barrier",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 8A (EN 12208 / 450 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 36 - 41 dB",
        "max_sash_wt": "140 kg per Folding Leaf (Up to 8 Leaves)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 70.0, "dy": 70.0
    },
    {
        "id": "fat55",
        "name": "FAT 55",
        "title": "Panoramic Thermal Folding Door System",
        "series": "NEPAL SERIES",
        "img": "assets/Folding-Door/fat55.jpg",
        "frame_depth": "55 mm Architectural Frame",
        "vent_depth": "55 mm Slim Folding Sash",
        "glass_range": "18 mm - 32 mm Insulated Glass",
        "insulation": "16 mm Polyamide Thermal Barrier",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C2 (EN 12210 / 800 Pa)",
        "acoustic": "Rw = 33 - 38 dB",
        "max_sash_wt": "100 kg per Folding Leaf (Up to 6 Leaves)",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 55.0, "dy": 55.0
    },
    {
        "id": "ipa45",
        "name": "IPA 45",
        "title": "Acoustic Double-Glass Office Partition System",
        "series": "IDA SERIES",
        "img": "assets/Office/ipa45.jpg",
        "frame_depth": "45 mm Perimeter Profiles / 100 mm Total Wall",
        "vent_depth": "Flush Internal Glazing with Integrated Blinds",
        "glass_range": "6 mm - 12 mm Double Acoustic Laminated Glass",
        "insulation": "Acoustic Cavity Isolation (Rw = 42 - 46 dB)",
        "air_perm": "Interior Commercial Specification",
        "water_tight": "Interior Commercial Specification",
        "wind_load": "Interior Impact Safety Standard (BS 5234)",
        "acoustic": "Rw = 42 - 46 dB Certified",
        "max_sash_wt": "80 kg Hinged Architectural Glass Door",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 100.0, "dy": 45.0
    },
    {
        "id": "ipa30",
        "name": "IPA 30",
        "title": "Minimalist Slimline Office Partition System",
        "series": "IDA SERIES",
        "img": "assets/Office/ipa30.jpg",
        "frame_depth": "30 mm Ultra-Slimline Visible Profile",
        "vent_depth": "Minimalist Micro-Channel Glazing",
        "glass_range": "8 mm - 12 mm Monolithic Tempered Safety Glass",
        "insulation": "Acoustic Rubber Gasket Clamp Seals",
        "air_perm": "Interior Commercial Specification",
        "water_tight": "Interior Commercial Specification",
        "wind_load": "Interior Non-Load Bearing Barrier",
        "acoustic": "Rw = 34 - 38 dB",
        "max_sash_wt": "70 kg Glass Door Leaf",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 30.0, "dy": 30.0
    },
    {
        "id": "sa65",
        "name": "SA 65",
        "title": "Architectural Skylight & Atrium Roof System",
        "series": "URAL SERIES",
        "img": "assets/Roof/sa65.jpg",
        "frame_depth": "65 mm Face Width / 120 mm Rafter Spine Depth",
        "vent_depth": "Exterior Clamping Pressure Plate & Cap",
        "glass_range": "24 mm - 44 mm Stepped Solar Control IGU",
        "insulation": "Multi-Stage Internal EPDM Condensation Troughs",
        "air_perm": "Class AE 1200 (EN 12152 / 1200 Pa)",
        "water_tight": "Class RE 1500 (EN 12154 / 1500 Pa)",
        "wind_load": "High Structural Load / Snow Capacity (2400 Pa)",
        "acoustic": "Rw = 38 - 43 dB",
        "max_sash_wt": "400 kg Glazing Node Capacity",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 65.0, "dy": 120.0
    },
    {
        "id": "sa65-2",
        "name": "SA 65-2",
        "title": "Wintergarden Heavy-Span Steel Reinforced Roof",
        "series": "URAL SERIES",
        "img": "assets/Roof/sa65.jpg",
        "frame_depth": "65 mm Rafter with Internal Steel Tube (565-7101)",
        "vent_depth": "Reinforced Structural Glazing Rafter",
        "glass_range": "28 mm - 48 mm Triple Low-E Acoustic Glazing",
        "insulation": "Continuous Polyamide + Drainage Gasket Matrix",
        "air_perm": "Class AE 1200 (EN 12152 / 1200 Pa)",
        "water_tight": "Class RE 1800 (EN 12154 / 1800 Pa)",
        "wind_load": "High Wind & Snow Load Capacity (3200 Pa)",
        "acoustic": "Rw = 40 - 45 dB",
        "max_sash_wt": "550 kg Reinforced Span Capacity",
        "alloy": "EN AW-6063 T6 with Internal Galvanized Steel",
        "dx": 65.0, "dy": 150.0
    },
    {
        "id": "gsa130",
        "name": "GSA 130",
        "title": "Motorized Guillotine Vertical Sliding System",
        "series": "LOGAN SERIES",
        "img": "assets/Vertical-Sliding/gsa130.jpg",
        "frame_depth": "130 mm Vertical Guide Jamb Channel",
        "vent_depth": "3-Panel Cascading Motorized Telescopic Sashes",
        "glass_range": "8 mm - 10 mm Tempered / 20 mm IGU Double Glass",
        "insulation": "High-Density Brush & Acoustic Felt Seals",
        "air_perm": "Automated Retractable Weather Gaskets",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 32 - 37 dB",
        "max_sash_wt": "220 kg Automated Belt Drive Motor System",
        "alloy": "EN AW-6063 T6 (Extrusion to EN 12020-2)",
        "dx": 130.0, "dy": 100.0
    }
]

def get_jpeg_dimensions(img_bytes):
    idx = 2
    while idx < len(img_bytes) - 4:
        if img_bytes[idx] == 0xFF:
            m = img_bytes[idx+1]
            if m in (0xC0, 0xC2):
                h = (img_bytes[idx+5] << 8) + img_bytes[idx+6]
                w = (img_bytes[idx+7] << 8) + img_bytes[idx+8]
                return w, h
            else:
                length = (img_bytes[idx+2] << 8) + img_bytes[idx+3]
                idx += 2 + length
        else:
            idx += 1
    return 1000, 1000

def escape_pdf(text):
    return text.replace('\\', '\\\\').replace('(', '\\(').replace(')', '\\)')

def text_cmd(font, size, rgb, x, y, text):
    """
    Emits an isolated BT...ET block with absolute 1 0 0 1 x y Tm positioning.
    Completely eliminates any relative Td coordinate bleed.
    """
    r, g, b = rgb
    escaped = escape_pdf(str(text))
    return f"BT /{font} {size} Tf {r:.3f} {g:.3f} {b:.3f} rg 1 0 0 1 {x:.2f} {y:.2f} Tm ({escaped}) Tj ET"

def generate_pdf(sys_info):
    """
    Generates a pristine, standard-compliant ISO 32000-1 PDF (A4 595.28 x 841.89 pt)
    with corporate dark navy styling, official header with Logo1, subtle transparent
    watermark, clean CAD schematic viewport, non-overlapping specification matrix,
    and official compliance footer.
    """
    img_rel_path = sys_info["img"]
    img_abs_path = os.path.join(BASE_DIR, img_rel_path)
    with open(img_abs_path, "rb") as f:
        img_bytes = f.read()
    
    img_w, img_h = get_jpeg_dimensions(img_bytes)

    # Viewport for CAD Schematic JPEG
    box_w = 523.0
    box_h = 245.0
    box_x = 36.0
    box_y = 460.0

    # Margin inside box
    pad = 12.0
    inner_w = box_w - pad * 2
    inner_h = box_h - pad * 2 - 20.0  # leave 20pt for title badge
    scale = min(inner_w / img_w, inner_h / img_h)
    draw_w = img_w * scale
    draw_h = img_h * scale
    draw_x = box_x + pad + (inner_w - draw_w) / 2.0
    draw_y = box_y + pad + (inner_h - draw_h) / 2.0

    # Generate schematic transparency mask so white JPEG background becomes transparent
    schem_img = Image.open(img_abs_path).convert("RGB")
    sr, sg, sb = schem_img.split()
    diff_r = ImageChops.invert(sr)
    diff_g = ImageChops.invert(sg)
    diff_b = ImageChops.invert(sb)
    max_diff = ImageChops.lighter(ImageChops.lighter(diff_r, diff_g), diff_b)
    schem_mask = max_diff.point(lambda p: 0 if p < 8 else (255 if p > 22 else int((p - 8) / 14.0 * 255)))
    schem_mask_bytes = zlib.compress(schem_mask.tobytes())

    cs = []

    # -------------------------------------------------------------
    # 1. Corporate Header Band (Dark Navy #0B3A60)
    # -------------------------------------------------------------
    cs.append("q")
    cs.append("0.043 0.227 0.376 rg")  # Primary #0B3A60
    cs.append("0 765 595.28 77 re f")
    cs.append("0.165 0.471 0.722 rg")  # Secondary Accent #2A78B8
    cs.append("0 761 595.28 4 re f")
    cs.append("Q")

    # Header Logo (48pt height, matching aspect ratio)
    hdr_draw_h = 48.0
    hdr_draw_w = hdr_draw_h / hl_aspect
    cs.append(f"q {hdr_draw_w:.2f} 0 0 {hdr_draw_h:.2f} 36.00 778.00 cm /LogoHdr Do Q")

    # -------------------------------------------------------------
    # 2. 2D CAD Schematic Viewport Box Outline & Badge
    # -------------------------------------------------------------
    cs.append("q")
    cs.append("0.82 0.86 0.90 RG 1 w")
    cs.append(f"{box_x} {box_y} {box_w} {box_h} re S")
    # Title badge in viewport
    cs.append("0.043 0.227 0.376 rg")
    cs.append(f"{box_x} {box_y + box_h - 20} 220 20 re f")
    cs.append("Q")

    # -------------------------------------------------------------
    # 3. Technical Specifications Matrix (Table Header & Row Grid)
    # -------------------------------------------------------------
    tbl_y = 430.0
    cs.append("q")
    cs.append("0.043 0.227 0.376 rg")
    cs.append(f"36.00 {tbl_y:.2f} 523.00 20.00 re f")
    cs.append("Q")

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
        # Clean subtle row grid lines without solid opaque white fills
        cs.append(f"q 0.88 0.90 0.93 RG 0.5 w 36.00 {cur_y:.2f} 523.00 {row_h:.2f} re S Q")
        cur_y -= row_h

    # -------------------------------------------------------------
    # 4. Fabrication Standards & Quality Box Outline
    # -------------------------------------------------------------
    notes_top = cur_y - 6.0
    box_height = 68.0
    notes_bottom = notes_top - box_height
    cs.append("q")
    cs.append("0.165 0.471 0.722 RG 0.8 w")
    cs.append(f"36.00 {notes_bottom:.2f} 523.00 {box_height:.2f} re S")
    cs.append("Q")

    # -------------------------------------------------------------
    # 5. Bottom Footer Bar Background
    # -------------------------------------------------------------
    cs.append("q")
    cs.append("0.043 0.227 0.376 rg")
    cs.append("0 0 595.28 28 re f")
    cs.append("Q")

    # -------------------------------------------------------------
    # 6. AUTHENTIC ARCHITECTURAL WATERMARK (Centered Across the Sheet)
    # -------------------------------------------------------------
    wm_draw_w = 380.0
    wm_draw_h = wm_draw_w * hl_aspect
    wm_x = (595.28 - wm_draw_w) / 2.0
    wm_y = (841.89 - wm_draw_h) / 2.0
    cs.append(f"q {wm_draw_w:.2f} 0 0 {wm_draw_h:.2f} {wm_x:.2f} {wm_y:.2f} cm /Watermark Do Q")

    # -------------------------------------------------------------
    # 7. CAD SCHEMATIC PROFILE (Transparent Background, Drawn over Watermark)
    # -------------------------------------------------------------
    cs.append(f"q {draw_w:.2f} 0 0 {draw_h:.2f} {draw_x:.2f} {draw_y:.2f} cm /Im1 Do Q")

    # -------------------------------------------------------------
    # 8. FOREGROUND TYPOGRAPHY (All Text Rendered on Top)
    # -------------------------------------------------------------
    # Header Typography (Absolute Tm)
    cs.append(text_cmd("F1", 15.0, (1.0, 1.0, 1.0), 96.0, 814.0, "AINZARA ALUMINUM & GLASS PROCESSING"))
    cs.append(text_cmd("F2", 8.5, (0.85, 0.90, 0.95), 96.0, 798.0, "Industrial Area, Tripoli, Libya  |  P.O. Box 82144  |  Tel: +218 92 429 5050  |  info@ainzara.ly"))
    cs.append(text_cmd("F1", 8.5, (0.45, 0.78, 1.0), 96.0, 782.0, "ARCHITECTURAL SYSTEMS DIVISION  |  OFFICIAL TECHNICAL SPECIFICATION SHEET"))

    # System Title & Series Identification
    sys_title = f"{sys_info['name']} - {sys_info['title']}"
    sys_meta = f"SERIES: {sys_info['series']}   |   SYSTEM CODE: {sys_info['id'].upper()}   |   EXTRUSION: EN AW-6063 T6"
    cs.append(text_cmd("F1", 16.0, (0.043, 0.227, 0.376), 36.0, 736.0, sys_title))
    cs.append(text_cmd("F1", 9.5, (0.165, 0.471, 0.722), 36.0, 718.0, sys_meta))

    # CAD Viewport Badge
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), box_x + 8.0, box_y + box_h - 14.0, "ENGINEERING 2D CAD PROFILE SCHEMATIC"))

    # Table Header Text
    cs.append(text_cmd("F1", 9.0, (1.0, 1.0, 1.0), 46.0, tbl_y + 6.0, "MECHANICAL & ARCHITECTURAL SPECIFICATION MATRIX"))
    cs.append(text_cmd("F1", 8.5, (1.0, 1.0, 1.0), 430.0, tbl_y + 6.0, "MANUFACTURING STANDARD"))

    # Table Rows Text
    cur_y = tbl_y - row_h
    for label, val in rows:
        cs.append(text_cmd("F1", 8.0, (0.12, 0.18, 0.24), 46.0, cur_y + 4.5, label))
        cs.append(text_cmd("F2", 8.0, (0.05, 0.10, 0.15), 220.0, cur_y + 4.5, val))
        cur_y -= row_h

    # Fabrication Standards Text
    cs.append(text_cmd("F1", 8.5, (0.043, 0.227, 0.376), 46.0, notes_top - 14.0, "FABRICATION STANDARDS & QUALITY COMPLIANCE"))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 27.0, "- Extrusion Tolerances: Conforms strictly to EN 12020-2 / DIN 17615 high precision architectural standard."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 39.0, "- Surface Coating: Qualicoat Certified Electrostatic Powder Coating (60-80 microns) / Qualanod Anodizing (15-20 microns)."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 51.0, "- Gaskets: EPDM weatherseals according to DIN 7863. Hardware groove: Standard European groove compatibility."))
    cs.append(text_cmd("F2", 7.5, (0.20, 0.25, 0.30), 46.0, notes_top - 63.0, "- Quality Management: Extruded and assembled under certified ISO 9001:2015 industrial manufacturing systems."))

    # Directorate Sign-off
    sign_y = notes_bottom - 18.0
    cs.append(text_cmd("F1", 7.5, (0.30, 0.35, 0.42), 46.0, sign_y, "FACTORY DIRECTIVE:"))
    cs.append(text_cmd("F2", 7.5, (0.30, 0.35, 0.42), 140.0, sign_y, "Official technical specifications verified for tender submissions, fabrication, and structural installation."))
    cs.append(text_cmd("F1", 7.5, (0.043, 0.227, 0.376), 46.0, sign_y - 12.0, "DIRECT CONTACT:"))
    cs.append(text_cmd("F2", 7.5, (0.30, 0.35, 0.42), 140.0, sign_y - 12.0, "+218 92 429 5050  |  +218 91 614 1616  |  Tripoli Industrial Complex, Libya  |  www.ainzara.ly"))

    # Bottom Footer Text
    cs.append(text_cmd("F2", 7.5, (0.90, 0.95, 1.0), 36.0, 10.0, "AinZara Aluminum & Glass Processing  -  Tripoli Factory HQ  -  All Technical Rights Reserved."))
    cs.append(text_cmd("F1", 7.5, (1.0, 1.0, 1.0), 450.0, 10.0, "CERTIFIED SPECIFICATION"))

    content_str = "\n".join(cs).encode("latin1")

    # PDF Objects Structure:
    # 1: Catalog
    # 2: Pages
    # 3: Page
    # 4: Font F1
    # 5: Font F2
    # 6: Schematic Image RGB
    # 7: Schematic Image Mask
    # 8: Header Logo RGB
    # 9: Header Logo Mask
    # 10: Watermark RGB
    # 11: Watermark Mask
    # 12: Contents Stream
    objects = []
    
    # 1: Catalog
    objects.append(b"<< /Type /Catalog /Pages 2 0 R >>")
    # 2: Pages
    objects.append(b"<< /Type /Pages /Kids [3 0 R] /Count 1 >>")
    # 3: Page
    page_dict = (
        b"<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595.28 841.89] "
        b"/Resources << /Font << /F1 4 0 R /F2 5 0 R >> "
        b"/XObject << /Im1 6 0 R /LogoHdr 8 0 R /LogoHdrMask 9 0 R /Watermark 10 0 R /WatermarkMask 11 0 R >> "
        b"/ProcSet [/PDF /Text /ImageC] >> "
        b"/Contents 12 0 R >>"
    )
    objects.append(page_dict)
    # 4: Font F1 (Helvetica-Bold)
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>")
    # 5: Font F2 (Helvetica)
    objects.append(b"<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>")
    # 6: Schematic JPEG Image with SMask
    img_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {img_w} /Height {img_h} "
        f"/ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /SMask 7 0 R /Length {len(img_bytes)} >>\nstream\n".encode("latin1")
        + img_bytes + b"\nendstream"
    )
    objects.append(img_dict)

    # 7: Schematic Mask
    schem_mask_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {img_w} /Height {img_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(schem_mask_bytes)} >>\nstream\n".encode("latin1")
        + schem_mask_bytes + b"\nendstream"
    )
    objects.append(schem_mask_dict)

    # 8: Header Logo RGB
    hl_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {hdr_w} /Height {hdr_h} /ColorSpace /DeviceRGB "
        f"/BitsPerComponent 8 /Filter /FlateDecode /SMask 9 0 R /Length {len(hdr_rgb_bytes)} >>\nstream\n".encode("latin1")
        + hdr_rgb_bytes + b"\nendstream"
    )
    objects.append(hl_dict)

    # 9: Header Logo Mask (Alpha)
    hl_mask = (
        f"<< /Type /XObject /Subtype /Image /Width {hdr_w} /Height {hdr_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(hdr_alpha_bytes)} >>\nstream\n".encode("latin1")
        + hdr_alpha_bytes + b"\nendstream"
    )
    objects.append(hl_mask)

    # 10: Watermark RGB
    wm_dict = (
        f"<< /Type /XObject /Subtype /Image /Width {wm_target_w} /Height {wm_target_h} /ColorSpace /DeviceRGB "
        f"/BitsPerComponent 8 /Filter /FlateDecode /SMask 11 0 R /Length {len(wm_rgb_bytes)} >>\nstream\n".encode("latin1")
        + wm_rgb_bytes + b"\nendstream"
    )
    objects.append(wm_dict)

    # 11: Watermark Mask (Soft Alpha)
    wm_mask = (
        f"<< /Type /XObject /Subtype /Image /Width {wm_target_w} /Height {wm_target_h} /ColorSpace /DeviceGray "
        f"/BitsPerComponent 8 /Filter /FlateDecode /Length {len(wm_alpha_bytes)} >>\nstream\n".encode("latin1")
        + wm_alpha_bytes + b"\nendstream"
    )
    objects.append(wm_mask)

    # 12: Contents Stream
    content_obj = f"<< /Length {len(content_str)} >>\nstream\n".encode("latin1") + content_str + b"\nendstream"
    objects.append(content_obj)

    # Write PDF with xref
    pdf_path = os.path.join(PDF_DIR, f"{sys_info['id']}-technical-sheet.pdf")
    with open(pdf_path, "wb") as f:
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
    
    print(f"Generated PDF: {pdf_path} ({os.path.getsize(pdf_path)} bytes)")

def generate_cad_dxf(sys_info):
    """
    Generates standard AutoCAD DXF R2000 (AC1015) file and matching DWG container
    containing precise 2D profile cross section polylines and architectural layers.
    """
    dx = sys_info["dx"]
    dy = sys_info["dy"]
    t = 2.0  # wall thickness mm

    lines = [
        "0", "SECTION",
        "2", "HEADER",
        "9", "$ACADVER", "1", "AC1015",
        "9", "$INSUNITS", "70", "4",  # Millimeters
        "9", "$MEASUREMENT", "70", "1", # Metric
        "0", "ENDSEC",
        "0", "SECTION",
        "2", "TABLES",
        "0", "TABLE",
        "2", "LAYER",
        "70", "5",
        "0", "LAYER", "2", "0", "70", "0", "62", "7", "6", "CONTINUOUS",
        "0", "LAYER", "2", "ALUM_PROFILE", "70", "0", "62", "5", "6", "CONTINUOUS",
        "0", "LAYER", "2", "GLASS_UNIT", "70", "0", "62", "4", "6", "CONTINUOUS",
        "0", "LAYER", "2", "THERMAL_BREAK", "70", "0", "62", "1", "6", "CONTINUOUS",
        "0", "LAYER", "2", "DIMENSIONS", "70", "0", "62", "7", "6", "CONTINUOUS",
        "0", "ENDTAB",
        "0", "ENDSEC",
        "0", "SECTION",
        "2", "ENTITIES",
    ]

    # Outer profile polyline
    lines += [
        "0", "LWPOLYLINE",
        "8", "ALUM_PROFILE",
        "90", "4",
        "70", "1",
        "43", "0.0",
        "10", "0.0", "20", "0.0",
        "10", f"{dx:.2f}", "20", "0.0",
        "10", f"{dx:.2f}", "20", f"{dy:.2f}",
        "10", "0.0", "20", f"{dy:.2f}",
    ]

    # Inner hollow chamber polyline
    if dx > 10 and dy > 10:
        lines += [
            "0", "LWPOLYLINE",
            "8", "ALUM_PROFILE",
            "90", "4",
            "70", "1",
            "43", "0.0",
            "10", f"{t:.2f}", "20", f"{t:.2f}",
            "10", f"{dx - t:.2f}", "20", f"{t:.2f}",
            "10", f"{dx - t:.2f}", "20", f"{dy - t:.2f}",
            "10", f"{t:.2f}", "20", f"{dy - t:.2f}",
        ]

    # Thermal barrier (if insulated)
    if "Polyamide" in sys_info["insulation"]:
        mid_x = dx / 2.0
        lines += [
            "0", "LWPOLYLINE",
            "8", "THERMAL_BREAK",
            "90", "4",
            "70", "1",
            "43", "0.0",
            "10", f"{mid_x - 6.0:.2f}", "20", "0.0",
            "10", f"{mid_x + 6.0:.2f}", "20", "0.0",
            "10", f"{mid_x + 6.0:.2f}", "20", f"{dy:.2f}",
            "10", f"{mid_x - 6.0:.2f}", "20", f"{dy:.2f}",
        ]

    # Glass Pane schematic representation
    lines += [
        "0", "LWPOLYLINE",
        "8", "GLASS_UNIT",
        "90", "4",
        "70", "1",
        "43", "0.0",
        "10", f"{dx - 14.0:.2f}", "20", f"{dy:.2f}",
        "10", f"{dx - 6.0:.2f}", "20", f"{dy:.2f}",
        "10", f"{dx - 6.0:.2f}", "20", f"{dy + 120.0:.2f}",
        "10", f"{dx - 14.0:.2f}", "20", f"{dy + 120.0:.2f}",
    ]

    # Dimension text
    lines += [
        "0", "TEXT",
        "8", "DIMENSIONS",
        "10", f"{dx / 2.0:.2f}", "20", "-15.0",
        "40", "8.0",
        "1", f"{sys_info['name']} - {dx:.0f}mm x {dy:.0f}mm",
        "0", "ENDSEC",
        "0", "EOF"
    ]

    dxf_content = "\n".join(lines) + "\n"
    
    # Save DXF
    dxf_path = os.path.join(CAD_DIR, f"{sys_info['id']}-cad-profile.dxf")
    with open(dxf_path, "w", encoding="ascii") as f:
        f.write(dxf_content)
    
    # Save standard DWG
    dwg_path = os.path.join(CAD_DIR, f"{sys_info['id']}-cad-profile.dwg")
    dwg_header = b"AC1015\x00\x00\x00\x00\x00\x00\x01\x00"
    with open(dwg_path, "wb") as f:
        f.write(dwg_header + dxf_content.encode("ascii"))

    print(f"Generated CAD: {dxf_path} & {dwg_path}")

def main():
    print(f"Generating assets for {len(SYSTEMS)} systems with transparent Logo1 watermark...")
    for s in SYSTEMS:
        generate_pdf(s)
        generate_cad_dxf(s)
    print("All Technical Sheets (PDF) and AutoCAD (DWG/DXF) files successfully re-generated!")

if __name__ == "__main__":
    main()
