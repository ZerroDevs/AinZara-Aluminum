#!/usr/bin/env python3
"""
AinZara-Aluminum - Industrial Cutting List & Bill of Materials (BOM) Estimator
=============================================================================
Calculates exact extrusion cut lengths (45° miter / 90° square), hardware allowances,
glass order sizes (DGU/IGU), and gasket linear meters across all 14 AinZara systems.

Usage:
  python tools/cutting_list_estimator.py --system wat63 --width 1200 --height 1400
  python tools/cutting_list_estimator.py --system sat120 --width 2400 --height 2200 --panels 2
  python tools/cutting_list_estimator.py --system CWA50sg --width 3000 --height 3600 --panels 3
  python tools/cutting_list_estimator.py --list-systems
"""

import sys
import os
import math
import json
import argparse
from typing import Dict, Any, List

# Ensure clean UTF-8 console output on Windows platforms
if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    except Exception:
        pass

SYSTEM_PROFILES = {
    "wat63": {
        "name": "WAT 63 Thermal Break Casement Window",
        "series": "HEKLA",
        "category": "door-window",
        "frame_depth": 63,
        "sash_depth": 71,
        "frame_face": 52,
        "sash_face": 68,
        "sash_overlap": 6,
        "glass_pocket_depth": 18,
        "glass_clearance": 5,
        "typology": "casement"
    },
    "wa55": {
        "name": "WA 55 Standard Non-Thermal Casement Window",
        "series": "HEKLA",
        "category": "door-window",
        "frame_depth": 55,
        "sash_depth": 63,
        "frame_face": 48,
        "sash_face": 64,
        "sash_overlap": 6,
        "glass_pocket_depth": 16,
        "glass_clearance": 5,
        "typology": "casement"
    },
    "wa45": {
        "name": "WA 45 Economic Casement Window",
        "series": "HEKLA",
        "category": "door-window",
        "frame_depth": 45,
        "sash_depth": 53,
        "frame_face": 44,
        "sash_face": 60,
        "sash_overlap": 5,
        "glass_pocket_depth": 14,
        "glass_clearance": 4,
        "typology": "casement"
    },
    "sat120": {
        "name": "SAT 120 Lift & Slide Thermal System",
        "series": "ARTOS",
        "category": "sliding",
        "frame_depth": 120,
        "sash_depth": 50,
        "frame_jamb_face": 45,
        "interlock_face": 55,
        "top_track_clearance": 32,
        "bottom_roller_clearance": 28,
        "glass_pocket_depth": 22,
        "glass_clearance": 6,
        "typology": "sliding"
    },
    "slat64": {
        "name": "SLAT 64 Monorail / Multi-rail Sliding System",
        "series": "ARTOS",
        "category": "sliding",
        "frame_depth": 64,
        "sash_depth": 36,
        "frame_jamb_face": 38,
        "interlock_face": 44,
        "top_track_clearance": 24,
        "bottom_roller_clearance": 20,
        "glass_pocket_depth": 18,
        "glass_clearance": 5,
        "typology": "sliding"
    },
    "CWA50sg": {
        "name": "CWA 50 SG Structural Glazing Curtain Wall",
        "series": "BROMO",
        "category": "facade",
        "mullion_width": 50,
        "mullion_depth": 120,
        "transom_width": 50,
        "transom_depth": 80,
        "silicone_joint": 16,
        "typology": "curtain_wall"
    },
    "CWA50HV": {
        "name": "CWA 50 HV Semi-Structural Curtain Wall",
        "series": "BROMO",
        "category": "facade",
        "mullion_width": 50,
        "mullion_depth": 120,
        "transom_width": 50,
        "transom_depth": 80,
        "cap_width": 50,
        "cap_height": 18,
        "typology": "curtain_wall"
    },
    "fat70": {
        "name": "FAT 70 Heavy-Duty Bi-Fold Thermal System",
        "series": "NEPAL",
        "category": "folding",
        "frame_depth": 70,
        "leaf_depth": 70,
        "leaf_face": 68,
        "top_track_deduction": 45,
        "bottom_track_deduction": 35,
        "jamb_deduction": 40,
        "interleaf_hinge_gap": 10,
        "typology": "folding"
    },
    "fat55": {
        "name": "FAT 55 Insulated Bi-Fold System",
        "series": "NEPAL",
        "category": "folding",
        "frame_depth": 55,
        "leaf_depth": 55,
        "leaf_face": 60,
        "top_track_deduction": 38,
        "bottom_track_deduction": 28,
        "jamb_deduction": 34,
        "interleaf_hinge_gap": 9,
        "typology": "folding"
    },
    "ipa45": {
        "name": "IPA 45 Acoustic Double Glass Office Partition",
        "series": "IDA",
        "category": "office",
        "channel_depth": 45,
        "channel_height": 30,
        "mullion_face": 45,
        "typology": "office"
    },
    "ipa30": {
        "name": "IPA 30 Slimline Single Glass Partition",
        "series": "IDA",
        "category": "office",
        "channel_depth": 30,
        "channel_height": 25,
        "mullion_face": 30,
        "typology": "office"
    },
    "sa65": {
        "name": "SA 65 Skylight & Veranda Roof System",
        "series": "URAL",
        "category": "roof",
        "rafter_width": 65,
        "rafter_depth": 110,
        "purlin_width": 65,
        "purlin_depth": 65,
        "typology": "skylight"
    },
    "sa65-2": {
        "name": "SA 65-2 Wintergarden Glazed Roof",
        "series": "URAL",
        "category": "roof",
        "rafter_width": 65,
        "rafter_depth": 130,
        "purlin_width": 65,
        "purlin_depth": 75,
        "typology": "skylight"
    },
    "gsa130": {
        "name": "GSA 130 Automated Motorized Guillotine System",
        "series": "LOGAN",
        "category": "vertical",
        "side_column_width": 130,
        "side_column_depth": 110,
        "motor_box_height": 140,
        "sash_profile_height": 45,
        "typology": "guillotine"
    }
}


def calculate_casement_bom(system_data: Dict[str, Any], W: float, H: float) -> Dict[str, Any]:
    """Calculate 45° miter cut list, DGU glass, and EPDM gaskets for Casement Windows."""
    frame_face = system_data["frame_face"]
    sash_face = system_data["sash_face"]
    overlap = system_data["sash_overlap"]
    clearance = system_data["glass_clearance"]
    
    # Net frame clearance
    sash_deduction = frame_face - overlap
    sash_w = W - (2 * sash_deduction)
    sash_h = H - (2 * sash_deduction)

    # Glass size
    glass_w = sash_w - (2 * (sash_face - clearance))
    glass_h = sash_h - (2 * (sash_face - clearance))
    glass_area_m2 = (glass_w * glass_h) / 1_000_000.0

    # Glazing bead lengths
    bead_w = glass_w + 12
    bead_h = glass_h + 12

    cuts = [
        {"part": "Outer Frame Top/Bottom", "qty": 2, "length_mm": round(W, 1), "cut_angle": "45° / 45°", "tag": "Frame Width"},
        {"part": "Outer Frame Left/Right", "qty": 2, "length_mm": round(H, 1), "cut_angle": "45° / 45°", "tag": "Frame Height"},
        {"part": "Vent/Sash Top/Bottom", "qty": 2, "length_mm": round(sash_w, 1), "cut_angle": "45° / 45°", "tag": "Sash Width"},
        {"part": "Vent/Sash Left/Right", "qty": 2, "length_mm": round(sash_h, 1), "cut_angle": "45° / 45°", "tag": "Sash Height"},
        {"part": "Glazing Bead Horizontal", "qty": 2, "length_mm": round(bead_w, 1), "cut_angle": "90° / 90°", "tag": "Bead Horiz"},
        {"part": "Glazing Bead Vertical", "qty": 2, "length_mm": round(bead_h, 1), "cut_angle": "90° / 90°", "tag": "Bead Vert"},
    ]

    total_extrusion_lm = (2 * W + 2 * H + 2 * sash_w + 2 * sash_h + 2 * bead_w + 2 * bead_h) / 1000.0
    epdm_central_lm = (2 * (W + H)) / 1000.0
    epdm_sash_lm = (2 * (sash_w + sash_h)) / 1000.0
    epdm_glazing_lm = ((2 * (glass_w + glass_h)) * 2) / 1000.0  # internal + external

    return {
        "cuts": cuts,
        "glass": [{
            "description": "Double Glazed Insulating Unit (IGU)",
            "qty": 1,
            "width_mm": round(glass_w, 1),
            "height_mm": round(glass_h, 1),
            "area_m2": round(glass_area_m2, 3)
        }],
        "materials_summary": {
            "total_aluminum_linear_m": round(total_extrusion_lm, 2),
            "total_glass_area_m2": round(glass_area_m2, 3),
            "central_epdm_gasket_lm": round(epdm_central_lm, 2),
            "sash_overlap_gasket_lm": round(epdm_sash_lm, 2),
            "glazing_wedge_gasket_lm": round(epdm_glazing_lm, 2)
        }
    }


def calculate_sliding_bom(system_data: Dict[str, Any], W: float, H: float, panels: int = 2) -> Dict[str, Any]:
    """Calculate sliding panel cuts, overlap calculation, and wool pile for Sliding Systems."""
    jamb_face = system_data["frame_jamb_face"]
    interlock = system_data["interlock_face"]
    top_ded = system_data["top_track_clearance"]
    bot_ded = system_data["bottom_roller_clearance"]

    # Total width minus jamb clearances plus total panel overlaps
    inner_w = W - (2 * jamb_face)
    total_interlocks = panels - 1
    panel_w = (inner_w + (total_interlocks * interlock)) / panels
    panel_h = H - top_ded - bot_ded

    # Glass sizes per panel
    glass_deduction = 70  # standard sash rail & stile rebate deduction
    glass_w = panel_w - (2 * glass_deduction)
    glass_h = panel_h - (2 * glass_deduction)
    single_glass_m2 = (glass_w * glass_h) / 1_000_000.0
    total_glass_m2 = single_glass_m2 * panels

    cuts = [
        {"part": "Head Track (Upper Frame)", "qty": 1, "length_mm": round(W, 1), "cut_angle": "90° / 90°", "tag": "Head Track"},
        {"part": "Sill Track (Lower Rail)", "qty": 1, "length_mm": round(W, 1), "cut_angle": "90° / 90°", "tag": "Sill Track"},
        {"part": "Frame Left/Right Jambs", "qty": 2, "length_mm": round(H, 1), "cut_angle": "90° / 90°", "tag": "Frame Jambs"},
        {"part": "Sash Top/Bottom Rails", "qty": panels * 2, "length_mm": round(panel_w, 1), "cut_angle": "90° / 90°", "tag": f"Sash Rails ({panels} panels)"},
        {"part": "Sash Vertical Stile (Outer)", "qty": panels * 2, "length_mm": round(panel_h, 1), "cut_angle": "90° / 90°", "tag": "Sash Stiles"},
        {"part": "Interlock Reinforcement", "qty": total_interlocks * 2, "length_mm": round(panel_h, 1), "cut_angle": "90° / 90°", "tag": "Interlock Stile"},
    ]

    total_extrusion_lm = (2 * W + 2 * H + (panels * 2 * panel_w) + (panels * 2 * panel_h) + (total_interlocks * 2 * panel_h)) / 1000.0
    wool_pile_lm = (panels * (2 * (panel_w + panel_h)) * 2) / 1000.0

    return {
        "cuts": cuts,
        "glass": [{
            "description": f"Sliding DGU Unit ({panels} Sashes)",
            "qty": panels,
            "width_mm": round(glass_w, 1),
            "height_mm": round(glass_h, 1),
            "area_m2": round(total_glass_m2, 3)
        }],
        "materials_summary": {
            "total_aluminum_linear_m": round(total_extrusion_lm, 2),
            "total_glass_area_m2": round(total_glass_m2, 3),
            "wool_pile_weatherstrip_lm": round(wool_pile_lm, 2),
            "stainless_steel_bottom_rail_lm": round(W / 1000.0, 2)
        }
    }


def calculate_curtain_wall_bom(system_data: Dict[str, Any], W: float, H: float, bays: int = 3, tiers: int = 2) -> Dict[str, Any]:
    """Calculate Curtain Wall Facade mullion continuous vertical cuts, transom cuts, and DGU glass."""
    mw = system_data["mullion_width"]
    total_mullions = bays + 1
    total_transoms = bays * tiers

    bay_w = (W - (total_mullions * mw)) / bays
    tier_h = (H - ((tiers + 1) * mw)) / tiers

    glass_w = bay_w - 12
    glass_h = tier_h - 12
    single_glass_m2 = (glass_w * glass_h) / 1_000_000.0
    total_glass_m2 = single_glass_m2 * bays * tiers

    cuts = [
        {"part": "Vertical Continuous Mullion", "qty": total_mullions, "length_mm": round(H, 1), "cut_angle": "90° / 90°", "tag": "Main Mullions"},
        {"part": "Horizontal Intermediate Transom", "qty": total_transoms, "length_mm": round(bay_w, 1), "cut_angle": "90° / 90°", "tag": "Transoms"},
    ]

    if "cap_width" in system_data:
        cuts.append({"part": "Mullion Pressure Plate & Cap", "qty": total_mullions, "length_mm": round(H, 1), "cut_angle": "90° / 90°", "tag": "Vertical Caps"})
        cuts.append({"part": "Transom Pressure Plate & Cap", "qty": total_transoms, "length_mm": round(bay_w, 1), "cut_angle": "90° / 90°", "tag": "Horizontal Caps"})

    total_extrusion_lm = (total_mullions * H + total_transoms * bay_w) / 1000.0
    epdm_facade_lm = total_extrusion_lm * 2

    return {
        "cuts": cuts,
        "glass": [{
            "description": f"Curtain Wall Structural DGU ({bays}x{tiers} Grid)",
            "qty": bays * tiers,
            "width_mm": round(glass_w, 1),
            "height_mm": round(glass_h, 1),
            "area_m2": round(total_glass_m2, 3)
        }],
        "materials_summary": {
            "total_aluminum_linear_m": round(total_extrusion_lm, 2),
            "total_glass_area_m2": round(total_glass_m2, 3),
            "structural_epdm_gasket_lm": round(epdm_facade_lm, 2)
        }
    }


def calculate_folding_bom(system_data: Dict[str, Any], W: float, H: float, leaves: int = 4) -> Dict[str, Any]:
    """Calculate Bi-Fold multi-leaf panels and track cuts."""
    top_ded = system_data["top_track_deduction"]
    bot_ded = system_data["bottom_track_deduction"]
    jamb_ded = system_data["jamb_deduction"]
    hinge_gap = system_data["interleaf_hinge_gap"]
    leaf_face = system_data["leaf_face"]

    total_hinge_gaps = (leaves - 1) * hinge_gap
    available_w = W - (2 * jamb_ded) - total_hinge_gaps
    leaf_w = available_w / leaves
    leaf_h = H - top_ded - bot_ded

    glass_w = leaf_w - (2 * (leaf_face - 5))
    glass_h = leaf_h - (2 * (leaf_face - 5))
    total_glass_m2 = ((glass_w * glass_h) / 1_000_000.0) * leaves

    cuts = [
        {"part": "Top Guide/Suspension Track", "qty": 1, "length_mm": round(W, 1), "cut_angle": "90° / 90°", "tag": "Top Track"},
        {"part": "Bottom Threshold Track", "qty": 1, "length_mm": round(W, 1), "cut_angle": "90° / 90°", "tag": "Bottom Track"},
        {"part": "Perimeter Side Jambs", "qty": 2, "length_mm": round(H, 1), "cut_angle": "90° / 90°", "tag": "Side Jambs"},
        {"part": "Leaf Top/Bottom Rails", "qty": leaves * 2, "length_mm": round(leaf_w, 1), "cut_angle": "45° / 45°", "tag": f"Leaf Rails ({leaves} leaves)"},
        {"part": "Leaf Vertical Stiles", "qty": leaves * 2, "length_mm": round(leaf_h, 1), "cut_angle": "45° / 45°", "tag": "Leaf Stiles"},
    ]

    total_extrusion_lm = (2 * W + 2 * H + (leaves * 2 * leaf_w) + (leaves * 2 * leaf_h)) / 1000.0

    return {
        "cuts": cuts,
        "glass": [{
            "description": f"Folding Door DGU Leaf ({leaves} Panels)",
            "qty": leaves,
            "width_mm": round(glass_w, 1),
            "height_mm": round(glass_h, 1),
            "area_m2": round(total_glass_m2, 3)
        }],
        "materials_summary": {
            "total_aluminum_linear_m": round(total_extrusion_lm, 2),
            "total_glass_area_m2": round(total_glass_m2, 3),
            "leaf_count": leaves,
            "intermediate_hinges_count": (leaves - 1) * 3
        }
    }


def estimate_bom(system_id: str, width_mm: float, height_mm: float, panels: int = 2) -> Dict[str, Any]:
    """Universal BOM dispatcher for all 14 profiles."""
    sys_clean = system_id.strip()
    if sys_clean not in SYSTEM_PROFILES:
        raise ValueError(f"System '{system_id}' not recognized. Use --list-systems to view all 14 profiles.")

    data = SYSTEM_PROFILES[sys_clean]
    typology = data["typology"]

    if typology == "casement":
        result = calculate_casement_bom(data, width_mm, height_mm)
    elif typology == "sliding":
        result = calculate_sliding_bom(data, width_mm, height_mm, panels=panels)
    elif typology == "curtain_wall":
        result = calculate_curtain_wall_bom(data, width_mm, height_mm, bays=panels, tiers=2)
    elif typology == "folding":
        result = calculate_folding_bom(data, width_mm, height_mm, leaves=panels if panels >= 3 else 4)
    elif typology in ["office", "skylight", "guillotine"]:
        cuts = [
            {"part": "Main Perimeter Frame Top/Bottom", "qty": 2, "length_mm": round(width_mm, 1), "cut_angle": "90° / 90°", "tag": "Perimeter Horiz"},
            {"part": "Main Perimeter Frame Left/Right", "qty": 2, "length_mm": round(height_mm, 1), "cut_angle": "90° / 90°", "tag": "Perimeter Vert"},
            {"part": "Intermediate Mullions / Tracks", "qty": panels, "length_mm": round(height_mm - 50, 1), "cut_angle": "90° / 90°", "tag": "Internal Profiles"},
        ]
        glass_w = (width_mm / panels) - 40
        glass_h = height_mm - 60
        tot_glass = ((glass_w * glass_h) / 1_000_000.0) * panels
        result = {
            "cuts": cuts,
            "glass": [{"description": f"{data['name']} Glass Panels", "qty": panels, "width_mm": round(glass_w, 1), "height_mm": round(glass_h, 1), "area_m2": round(tot_glass, 3)}],
            "materials_summary": {"total_aluminum_linear_m": round((2 * width_mm + (2 + panels) * height_mm) / 1000.0, 2), "total_glass_area_m2": round(tot_glass, 3)}
        }
    else:
        raise NotImplementedError(f"Typology '{typology}' is not implemented.")

    result["system_id"] = sys_clean
    result["system_name"] = data["name"]
    result["series"] = data["series"]
    result["overall_width_mm"] = width_mm
    result["overall_height_mm"] = height_mm
    return result


def print_terminal_table(bom: Dict[str, Any]):
    """Renders a high-precision, industrial ASCII workshop cut-sheet."""
    print("=" * 78)
    print(f"  AIN ZARA FABRICATION DESK - CUTTING LIST & BILL OF MATERIALS (BOM)")
    print("=" * 78)
    print(f"  System       : {bom['system_name']} [{bom['system_id'].upper()}]")
    print(f"  Series       : {bom['series']} Architectural Series")
    print(f"  Unit Size    : {bom['overall_width_mm']} mm (W)  x  {bom['overall_height_mm']} mm (H)")
    print("-" * 78)
    print(f"  {'#':<3} {'Part Description':<34} {'Qty':<4} {'Cut Length':<12} {'Angle':<12} {'Tag':<10}")
    print("-" * 78)
    for idx, cut in enumerate(bom["cuts"], 1):
        print(f"  {idx:<3} {cut['part']:<34} {cut['qty']:<4} {cut['length_mm']:<12} {cut['cut_angle']:<12} {cut['tag']:<10}")
    print("-" * 78)
    print("  GLASS SCHEDULE (IGU / DGU):")
    for g in bom["glass"]:
        print(f"    - {g['qty']}x {g['description']}: {g['width_mm']} x {g['height_mm']} mm  ({g['area_m2']} m²)")
    print("-" * 78)
    print("  MATERIAL SUMMARY:")
    for k, v in bom["materials_summary"].items():
        label = k.replace("_", " ").title()
        print(f"    - {label:<35}: {v}")
    print("=" * 78)


def main():
    parser = argparse.ArgumentParser(description="AinZara Aluminum Profile Cutting List & BOM Estimator")
    parser.add_argument("--system", "-s", type=str, help="Target system profile code (e.g. wat63, sat120, CWA50sg)")
    parser.add_argument("--width", "-w", type=float, help="Overall unit width in millimeters")
    parser.add_argument("--height", "-H", type=float, help="Overall unit height in millimeters")
    parser.add_argument("--panels", "-p", type=int, default=2, help="Number of panels, sashes, or bays (default: 2)")
    parser.add_argument("--export-json", type=str, help="Path to export BOM as JSON")
    parser.add_argument("--export-txt", type=str, help="Path to export formatted workshop text cut sheet")
    parser.add_argument("--list-systems", action="store_true", help="List all 14 supported AinZara profile systems")

    args = parser.parse_args()

    if args.list_systems:
        print("\nSupported AinZara Profile Systems (14 Profiles):")
        print("-" * 70)
        for code, data in SYSTEM_PROFILES.items():
            print(f"  {code:<10} | {data['series']:<8} | {data['name']}")
        print("-" * 70)
        return

    if not args.system or not args.width or not args.height:
        print("Error: Missing required arguments. Example:")
        print("  python tools/cutting_list_estimator.py --system wat63 --width 1200 --height 1400")
        print("  Run with --help or --list-systems for more information.")
        sys.exit(1)

    try:
        bom = estimate_bom(args.system, args.width, args.height, panels=args.panels)
        print_terminal_table(bom)

        if args.export_json:
            with open(args.export_json, "w", encoding="utf-8") as f:
                json.dump(bom, f, indent=2)
            print(f"\n[OK] Exported BOM JSON: {args.export_json}")

        if args.export_txt:
            with open(args.export_txt, "w", encoding="utf-8") as f:
                import io
                from contextlib import redirect_stdout
                buf = io.StringIO()
                with redirect_stdout(buf):
                    print_terminal_table(bom)
                f.write(buf.getvalue())
            print(f"[OK] Exported Workshop Cut Sheet: {args.export_txt}")

    except Exception as e:
        print(f"Error calculating BOM: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
