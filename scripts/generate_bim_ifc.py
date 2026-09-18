#!/usr/bin/env python3
"""
AinZara-Aluminum - BIM / Open-IFC & 3D Solid CAD Exporter
Converts 2D architectural profile cross-sections into standardized:
  1. ISO 10303-21 IFC4 Physical Files (.ifc)
  2. 3D Solid Surface Extrusions (.dxf 3D Polyface Mesh)

Compatible with Autodesk Revit, ArchiCAD, Bentley OpenBuildings, and Vectorworks.
Pure Python architecture: 0 external compiled pip dependencies.
"""

import os
import sys
import uuid
import math
import argparse
from datetime import datetime, timezone

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_OUT_DIR = os.path.join(REPO_ROOT, "assets", "downloads", "bim")

# 14 System Cross-Section Specifications
BIM_PROFILES = [
    {
        "id": "wat63",
        "name": "WAT 63",
        "series": "HEKLA",
        "category": "Door-Window",
        "type": "Thermal Casement Profile",
        "width": 63.0,
        "height": 71.0,
        "thick": 2.0,
        "thermal_break": True,
        "thermal_mm": 24.0,
        "chambers": 3,
        "glass_range": "20 mm – 42 mm IGU",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 9A (EN 12208 / 600 Pa)",
        "wind_load": "Class C5 (EN 12210 / 2000 Pa)",
        "acoustic": "Rw = 38 – 44 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "wa55",
        "name": "WA 55",
        "series": "HEKLA",
        "category": "Door-Window",
        "type": "Standard Casement Profile",
        "width": 55.0,
        "height": 63.0,
        "thick": 1.8,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 1,
        "glass_range": "4 mm – 32 mm",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 8A (EN 12208 / 450 Pa)",
        "wind_load": "Class C4 (EN 12210 / 1600 Pa)",
        "acoustic": "Rw = 34 – 38 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "wa45",
        "name": "WA 45",
        "series": "HEKLA",
        "category": "Door-Window",
        "type": "Economic Casement Profile",
        "width": 45.0,
        "height": 53.0,
        "thick": 1.6,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 1,
        "glass_range": "4 mm – 24 mm",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 30 – 34 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "sat120",
        "name": "SAT 120",
        "series": "ARTOS",
        "category": "Sliding",
        "type": "Lift & Slide Thermal Rail Profile",
        "width": 120.0,
        "height": 50.0,
        "thick": 2.2,
        "thermal_break": True,
        "thermal_mm": 20.0,
        "chambers": 2,
        "glass_range": "24 mm – 38 mm IGU",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 9A (EN 12208 / 600 Pa)",
        "wind_load": "Class C4 (EN 12210 / 1600 Pa)",
        "acoustic": "Rw = 37 – 42 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "slat64",
        "name": "SLAT 64",
        "series": "ARTOS",
        "category": "Sliding",
        "type": "Multi-Rail Sliding Track Profile",
        "width": 64.0,
        "height": 38.0,
        "thick": 1.8,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 2,
        "glass_range": "18 mm – 28 mm",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 32 – 36 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "CWA50HV",
        "name": "CWA 50 HV",
        "series": "BROMO",
        "category": "Facade",
        "type": "Semi-Structural Curtain Wall Vertical Mullion",
        "width": 50.0,
        "height": 140.0,
        "thick": 2.5,
        "thermal_break": True,
        "thermal_mm": 20.0,
        "chambers": 2,
        "glass_range": "24 mm – 40 mm IGU",
        "air_perm": "Class AE1200 (EN 12152 / 1200 Pa)",
        "water_tight": "Class RE1200 (EN 12154 / 1200 Pa)",
        "wind_load": "2400 Pa Design / 3600 Pa Safety (EN 13116)",
        "acoustic": "Rw = 40 – 45 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "CWA50sg",
        "name": "CWA 50 SG",
        "series": "BROMO",
        "category": "Facade",
        "type": "Structural Glazing Curtain Wall Mullion",
        "width": 50.0,
        "height": 150.0,
        "thick": 2.8,
        "thermal_break": True,
        "thermal_mm": 24.0,
        "chambers": 2,
        "glass_range": "28 mm – 44 mm IGU",
        "air_perm": "Class AE1500 (EN 12152 / 1500 Pa)",
        "water_tight": "Class RE1500 (EN 12154 / 1500 Pa)",
        "wind_load": "3000 Pa Design / 4500 Pa Safety (EN 13116)",
        "acoustic": "Rw = 42 – 47 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "fat70",
        "name": "FAT 70",
        "series": "NEPAL",
        "category": "Folding-Door",
        "type": "Heavy-Duty Bi-Fold Thermal Sash Profile",
        "width": 70.0,
        "height": 60.0,
        "thick": 2.2,
        "thermal_break": True,
        "thermal_mm": 24.0,
        "chambers": 3,
        "glass_range": "24 mm – 42 mm IGU",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class 9A (EN 12208 / 600 Pa)",
        "wind_load": "Class C4 (EN 12210 / 1600 Pa)",
        "acoustic": "Rw = 36 – 40 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "fat55",
        "name": "FAT 55",
        "series": "NEPAL",
        "category": "Folding-Door",
        "type": "Insulated Accordion Bi-Fold Profile",
        "width": 55.0,
        "height": 50.0,
        "thick": 2.0,
        "thermal_break": True,
        "thermal_mm": 16.0,
        "chambers": 2,
        "glass_range": "20 mm – 32 mm IGU",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 8A (EN 12208 / 450 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 33 – 37 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "ipa45",
        "name": "IPA 45",
        "series": "IDA",
        "category": "Office",
        "type": "Acoustic Double Glass Partition Profile",
        "width": 45.0,
        "height": 80.0,
        "thick": 2.0,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 2,
        "glass_range": "10 mm – 12 mm Dual Acoustic Laminated",
        "air_perm": "Internal Acoustic System",
        "water_tight": "N/A (Interior Specification)",
        "wind_load": "Internal Structural Partition (1.2 kN/m)",
        "acoustic": "Rw = 42 – 48 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "ipa30",
        "name": "IPA 30",
        "series": "IDA",
        "category": "Office",
        "type": "Slimline Single Glass Partition Channel",
        "width": 30.0,
        "height": 45.0,
        "thick": 1.8,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 1,
        "glass_range": "8 mm – 12 mm Monolithic Toughened",
        "air_perm": "Internal Demountable System",
        "water_tight": "N/A (Interior Specification)",
        "wind_load": "Internal Demountable (0.8 kN/m)",
        "acoustic": "Rw = 32 – 36 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "sa65",
        "name": "SA 65",
        "series": "URAL",
        "category": "Roof",
        "type": "Skylight & Veranda Rafter Beam",
        "width": 65.0,
        "height": 120.0,
        "thick": 2.5,
        "thermal_break": True,
        "thermal_mm": 20.0,
        "chambers": 2,
        "glass_range": "24 mm – 44 mm Laminated IGU",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class E1200 (EN 12208 / 1200 Pa)",
        "wind_load": "Class C4 (2000 Pa)",
        "acoustic": "Rw = 38 – 42 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "sa65-2",
        "name": "SA 65-2",
        "series": "URAL",
        "category": "Roof",
        "type": "Heavy Wintergarden Glazed Roof Profile",
        "width": 65.0,
        "height": 140.0,
        "thick": 3.0,
        "thermal_break": True,
        "thermal_mm": 24.0,
        "chambers": 3,
        "glass_range": "28 mm – 48 mm Structural IGU",
        "air_perm": "Class 4 (EN 12207 / 600 Pa)",
        "water_tight": "Class E1500 (EN 12208 / 1500 Pa)",
        "wind_load": "Class C5 (2400 Pa)",
        "acoustic": "Rw = 40 – 45 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
    {
        "id": "gsa130",
        "name": "GSA 130",
        "series": "LOGAN",
        "category": "Vertical-Sliding",
        "type": "Motorized Guillotine Vertical Side Track",
        "width": 130.0,
        "height": 55.0,
        "thick": 2.5,
        "thermal_break": False,
        "thermal_mm": 0.0,
        "chambers": 3,
        "glass_range": "8 mm Monolithic / 20 mm IGU",
        "air_perm": "Class 3 (EN 12207 / 450 Pa)",
        "water_tight": "Class 7A (EN 12208 / 300 Pa)",
        "wind_load": "Class C3 (EN 12210 / 1200 Pa)",
        "acoustic": "Rw = 32 – 36 dB",
        "alloy": "EN AW-6063 T6 (DIN 17615)",
    },
]

def to_ifc_guid(u=None):
    """
    Encodes standard UUID into standard 22-character IFC Base64 GUID representation.
    """
    if u is None:
        u = uuid.uuid4()
    chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz_$"
    num = u.int
    res = []
    for _ in range(22):
        res.append(chars[num % 64])
        num //= 64
    return "".join(reversed(res))

class IFCModelBuilder:
    """
    Clean STEP ISO-10303-21 entity generator for IFC4 models.
    """
    def __init__(self, filename, system_info):
        self.filename = filename
        self.info = system_info
        self.entities = []
        self._current_id = 1

    def add(self, entity_str):
        eid = self._current_id
        self._current_id += 1
        self.entities.append(f"#{eid}={entity_str};")
        return f"#{eid}"

    def build_ifc_content(self, extrusion_length_mm=1000.0):
        info = self.info
        w = float(info["width"])
        h = float(info["height"])
        t = float(info["thick"])
        chambers = int(info["chambers"])
        now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S")

        # 1. Header Entities
        e_person = self.add("IFCPERSON($,'AinZara','Engineering Desk',$,$,$,$,$)")
        e_org = self.add("IFCORGANIZATION($,'AinZara Aluminum & Glass Processing','Tripoli Industrial Complex, Libya',$,$)")
        e_p_and_o = self.add(f"IFCPERSONANDORGANIZATION({e_person},{e_org},$)")
        e_app = self.add(f"IFCAPPLICATION({e_org},'2.0','AinZara BIM IFC Engine','AinZara BIM')")
        e_owner = self.add(f"IFCOWNERHISTORY({e_p_and_o},{e_app},$,.ADDED.,$,$,$,{int(datetime.now().timestamp())})")

        # 2. Units (Millimeters, Square Metres, Radians)
        u_len = self.add("IFCSIUNIT(*,.LENGTHUNIT.,.MILLI.,.METRE.)")
        u_area = self.add("IFCSIUNIT(*,.AREAUNIT.,$,.SQUARE_METRE.)")
        u_vol = self.add("IFCSIUNIT(*,.VOLUMEUNIT.,$,.CUBIC_METRE.)")
        u_rad = self.add("IFCSIUNIT(*,.PLANEANGLEUNIT.,$,.RADIAN.)")
        u_deg_val = self.add(f"IFCMEASUREWITHOUNIT(IFCPLANEANGLEMEASURE({math.pi/180.0}),{u_rad})")
        u_deg = self.add(f"IFCCONVERSIONBASEDUNIT(#0,.PLANEANGLEUNIT.,'DEGREE',{u_deg_val})".replace("#0", self.add("IFCDIMENSIONALEXPONENTS(0,0,0,0,0,0,0)")))
        e_units = self.add(f"IFCUNITASSIGNMENT(({u_len},{u_area},{u_vol},{u_rad},{u_deg}))")

        # 3. Geometric Context & World Axis
        pt_origin = self.add("IFCCARTESIANPOINT((0.,0.,0.))")
        dir_z = self.add("IFCDIRECTION((0.,0.,1.))")
        dir_x = self.add("IFCDIRECTION((1.,0.,0.))")
        e_axis3d = self.add(f"IFCAXIS2PLACEMENT3D({pt_origin},{dir_z},{dir_x})")
        e_geom_ctx = self.add(f"IFCGEOMETRICREPRESENTATIONCONTEXT($,'Model',3,1.E-05,{e_axis3d},$)")

        # 4. Spatial Structure (Project -> Site -> Building -> Storey)
        e_project = self.add(f"IFCPROJECT('{to_ifc_guid()}',{e_owner},'AinZara Architectural Profile Library',$,$,$,$,({e_geom_ctx}),{e_units})")
        e_site = self.add(f"IFCSITE('{to_ifc_guid()}',{e_owner},'AinZara Tripoli Industrial Plant',$,$,{e_axis3d},$,$,.ELEMENT.,(32,53,0),(13,11,0),0.,$,$)")
        e_bldg = self.add(f"IFCBUILDING('{to_ifc_guid()}',{e_owner},'Extrusion & Fabrication Facility',$,$,{e_axis3d},$,$,.ELEMENT.,$,$,$)")
        e_storey = self.add(f"IFCBUILDINGSTOREY('{to_ifc_guid()}',{e_owner},'Ground Level',$,$,{e_axis3d},$,$,.ELEMENT.,0.)")

        self.add(f"IFCRELAGGREGATES('{to_ifc_guid()}',{e_owner},$,$,{e_project},({e_site}))")
        self.add(f"IFCRELAGGREGATES('{to_ifc_guid()}',{e_owner},$,$,{e_site},({e_bldg}))")
        self.add(f"IFCRELAGGREGATES('{to_ifc_guid()}',{e_owner},$,$,{e_bldg},({e_storey}))")

        # 5. 2D Cross Section Outer Polyline
        outer_pts = [
            (0.0, 0.0),
            (w, 0.0),
            (w, h),
            (0.0, h),
            (0.0, 0.0)
        ]
        outer_pt_refs = [self.add(f"IFCCARTESIANPOINT(({p[0]:.3f},{p[1]:.3f}))") for p in outer_pts]
        e_outer_poly = self.add(f"IFCPOLYLINE(({','.join(outer_pt_refs)}))")

        # Inner Hollow Chamber Voids
        void_poly_refs = []
        if chambers == 1:
            void_pts = [
                (t, t),
                (w - t, t),
                (w - t, h - t),
                (t, h - t),
                (t, t)
            ]
            v_refs = [self.add(f"IFCCARTESIANPOINT(({p[0]:.3f},{p[1]:.3f}))") for p in void_pts]
            void_poly_refs.append(self.add(f"IFCPOLYLINE(({','.join(v_refs)}))"))
        elif chambers >= 2:
            # Multi-chamber partition
            seg_w = (w - (chambers + 1) * t) / chambers
            for c in range(chambers):
                x1 = t + c * (seg_w + t)
                x2 = x1 + seg_w
                void_pts = [
                    (x1, t),
                    (x2, t),
                    (x2, h - t),
                    (x1, h - t),
                    (x1, t)
                ]
                v_refs = [self.add(f"IFCCARTESIANPOINT(({p[0]:.3f},{p[1]:.3f}))") for p in void_pts]
                void_poly_refs.append(self.add(f"IFCPOLYLINE(({','.join(v_refs)}))"))

        # Profile definition
        profile_name = f"AinZara_{info['id'].upper()}_{w:.0f}x{h:.0f}"
        if void_poly_refs:
            e_profile = self.add(f"IFCARBITRARYPROFILEDEFWITHVOIDS(.AREA.,'{profile_name}',{e_outer_poly},({','.join(void_poly_refs)}))")
        else:
            e_profile = self.add(f"IFCARBITRARYCLOSEDPROFILEDEF(.AREA.,'{profile_name}',{e_outer_poly})")

        # 6. 3D Swept Solid Extrusion
        pt_local = self.add("IFCCARTESIANPOINT((0.,0.,0.))")
        axis_local = self.add(f"IFCAXIS2PLACEMENT3D({pt_local},{dir_z},{dir_x})")
        e_solid = self.add(f"IFCEXTRUDEDAREASOLID({e_profile},{axis_local},{dir_z},{extrusion_length_mm:.1f})")

        # Shape Representation
        e_shape_rep = self.add(f"IFCSHAPEREPRESENTATION({e_geom_ctx},'Body','SweptSolid',({e_solid}))")
        e_prod_def_shape = self.add(f"IFCPRODUCTDEFINITIONSHAPE($,$,({e_shape_rep}))")

        # 7. BIM Member Entity
        member_guid = to_ifc_guid()
        e_member = self.add(
            f"IFCMEMBER('{member_guid}',{e_owner},'{info['name']} Profile Extrusion',"
            f"'{info['type']} - Standard 1000mm Profile Billet',$,{axis_local},{e_prod_def_shape},'{info['id'].upper()}-1000')"
        )
        self.add(f"IFCRELCONTAINEDINSPATIALSTRUCTURE('{to_ifc_guid()}',{e_owner},$,$,({e_member}),{e_storey})")

        # 8. Mechanical Property Set (Pset_ProfileMechanical)
        mech_props = [
            self.add(f"IFCPROPERTYSINGLEVALUE('FrameDepth',$,IFCLENGTHMEASURE({w:.1f}),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('ProfileHeight',$,IFCLENGTHMEASURE({h:.1f}),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('WallThickness',$,IFCLENGTHMEASURE({t:.1f}),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('GlazingRange',$,IFCTEXT('{info['glass_range']}'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('ThermalBreak',$,IFCLABEL('{info['thermal_mm']:.0f}mm Polyamide PA66' if info['thermal_break'] else 'Non-Thermal'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('AirPermeability',$,IFCLABEL('{info['air_perm']}'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('WaterTightness',$,IFCLABEL('{info['water_tight']}'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('WindLoadResistance',$,IFCLABEL('{info['wind_load']}'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('AcousticReduction',$,IFCLABEL('{info['acoustic']}'),$)"),
        ]
        e_pset_mech = self.add(f"IFCPROPERTYSET('{to_ifc_guid()}',{e_owner},'Pset_ProfileMechanical',$,({','.join(mech_props)}))")
        self.add(f"IFCRELDEFINESBYPROPERTIES('{to_ifc_guid()}',{e_owner},$,$,({e_member}),{e_pset_mech})")

        # 9. Manufacturer Property Set (Pset_ManufacturerInfo)
        mfg_props = [
            self.add("IFCPROPERTYSINGLEVALUE('Manufacturer',$,IFCLABEL('AinZara Aluminum & Glass Processing'),$)"),
            self.add("IFCPROPERTYSINGLEVALUE('ProductionHeadquarters',$,IFCLABEL('Tripoli Industrial Complex, Libya'),$)"),
            self.add("IFCPROPERTYSINGLEVALUE('OfficialWebsite',$,IFCLABEL('https://ainzara.ly'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('AluminumAlloy',$,IFCLABEL('{info['alloy']}'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('ArchitecturalSeries',$,IFCLABEL('{info['series']} SERIES'),$)"),
            self.add(f"IFCPROPERTYSINGLEVALUE('ProfileCode',$,IFCLABEL('{info['id'].upper()}'),$)"),
        ]
        e_pset_mfg = self.add(f"IFCPROPERTYSET('{to_ifc_guid()}',{e_owner},'Pset_ManufacturerInfo',$,({','.join(mfg_props)}))")
        self.add(f"IFCRELDEFINESBYPROPERTIES('{to_ifc_guid()}',{e_owner},$,$,({e_member}),{e_pset_mfg})")

        # 10. Material Definition
        e_mat = self.add(f"IFCMATERIAL('Aluminium {info['alloy']}',$,'Architectural Extrusion')")
        self.add(f"IFCRELASSOCIATESMATERIAL('{to_ifc_guid()}',{e_owner},$,$,({e_member}),{e_mat})")

        # Assemble Full STEP physical text
        header = [
            "ISO-10303-21;",
            "HEADER;",
            "FILE_DESCRIPTION(('ViewDefinition [CoordinationView_V2.0]'),'2;1');",
            f"FILE_NAME('{self.filename}','{now_str}',('AinZara Engineering Directorate'),('AinZara Aluminum & Glass Processing'),'Antigravity IFC Engine 2.0','Autodesk Revit / ArchiCAD Compliant','');",
            "FILE_SCHEMA(('IFC4'));",
            "ENDSEC;",
            "DATA;",
        ]

        footer = [
            "ENDSEC;",
            "END-ISO-10303-21;",
        ]

        return "\n".join(header) + "\n" + "\n".join(self.entities) + "\n" + "\n".join(footer) + "\n"

def generate_3d_dxf_solid(sys_info, out_path, length=1000.0):
    """
    Generates standard 3D AutoCAD DXF file containing 3D POLYFACE MESH / 3DFACE
    extrusion representation of the architectural profile.
    """
    w = float(sys_info["width"])
    h = float(sys_info["height"])
    t = float(sys_info["thick"])

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
        "70", "3",
        "0", "LAYER", "2", "0", "70", "0", "62", "7", "6", "CONTINUOUS",
        "0", "LAYER", "2", "BIM_ALUM_EXTRUSION_3D", "70", "0", "62", "5", "6", "CONTINUOUS",
        "0", "LAYER", "2", "BIM_VOID_CHAMBER_3D", "70", "0", "62", "1", "6", "CONTINUOUS",
        "0", "ENDTAB",
        "0", "ENDSEC",
        "0", "SECTION",
        "2", "ENTITIES",
    ]

    def add_3d_face(p1, p2, p3, p4, layer="BIM_ALUM_EXTRUSION_3D"):
        return [
            "0", "3DFACE",
            "8", layer,
            "10", f"{p1[0]:.2f}", "20", f"{p1[1]:.2f}", "30", f"{p1[2]:.2f}",
            "11", f"{p2[0]:.2f}", "20", f"{p2[1]:.2f}", "30", f"{p2[2]:.2f}",
            "12", f"{p3[0]:.2f}", "20", f"{p3[1]:.2f}", "30", f"{p3[2]:.2f}",
            "13", f"{p4[0]:.2f}", "20", f"{p4[1]:.2f}", "30", f"{p4[2]:.2f}",
        ]

    # Outer 4 lateral extrusion faces
    # Corners at Z=0
    c0 = (0.0, 0.0, 0.0)
    c1 = (w, 0.0, 0.0)
    c2 = (w, h, 0.0)
    c3 = (0.0, h, 0.0)
    # Corners at Z=length
    c0_z = (0.0, 0.0, length)
    c1_z = (w, 0.0, length)
    c2_z = (w, h, length)
    c3_z = (0.0, h, length)

    # 4 Outer Flange Faces
    lines += add_3d_face(c0, c1, c1_z, c0_z)
    lines += add_3d_face(c1, c2, c2_z, c1_z)
    lines += add_3d_face(c2, c3, c3_z, c2_z)
    lines += add_3d_face(c3, c0, c0_z, c3_z)

    # Inner hollow chamber faces
    v0 = (t, t, 0.0)
    v1 = (w - t, t, 0.0)
    v2 = (w - t, h - t, 0.0)
    v3 = (t, h - t, 0.0)
    v0_z = (t, t, length)
    v1_z = (w - t, t, length)
    v2_z = (w - t, h - t, length)
    v3_z = (t, h - t, length)

    lines += add_3d_face(v0, v1, v1_z, v0_z, "BIM_VOID_CHAMBER_3D")
    lines += add_3d_face(v1, v2, v2_z, v1_z, "BIM_VOID_CHAMBER_3D")
    lines += add_3d_face(v2, v3, v3_z, v2_z, "BIM_VOID_CHAMBER_3D")
    lines += add_3d_face(v3, v0, v0_z, v3_z, "BIM_VOID_CHAMBER_3D")

    # Bottom End Caps (Z=0)
    lines += add_3d_face(c0, c1, v1, v0)
    lines += add_3d_face(c1, c2, v2, v1)
    lines += add_3d_face(c2, c3, v3, v2)
    lines += add_3d_face(c3, c0, v0, v3)

    # Top End Caps (Z=length)
    lines += add_3d_face(c0_z, c1_z, v1_z, v0_z)
    lines += add_3d_face(c1_z, c2_z, v2_z, v1_z)
    lines += add_3d_face(c2_z, c3_z, v3_z, v2_z)
    lines += add_3d_face(c3_z, c0_z, v0_z, v3_z)

    lines += ["0", "ENDSEC", "0", "EOF"]
    dxf_content = "\n".join(lines) + "\n"

    with open(out_path, "w", encoding="ascii") as f:
        f.write(dxf_content)

def main():
    parser = argparse.ArgumentParser(
        description="AinZara-Aluminum - BIM Open-IFC & 3D Solid CAD Exporter"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Generate BIM (.ifc) and 3D (.dxf) models for all 14 profiles"
    )
    parser.add_argument(
        "--system",
        type=str,
        help="Generate BIM model for a specific system ID (e.g. wat63, sat120, CWA50HV)"
    )
    parser.add_argument(
        "--length",
        type=float,
        default=1000.0,
        help="Profile extrusion length in millimeters (default: 1000 mm)"
    )
    parser.add_argument(
        "--out-dir",
        default=DEFAULT_OUT_DIR,
        help=f"Output directory for generated BIM files (default: {DEFAULT_OUT_DIR})"
    )
    parser.add_argument(
        "--list-systems",
        action="store_true",
        help="Print list of all 14 available architectural systems"
    )

    args = parser.parse_args()

    if args.list_systems:
        print(f"\nAinZara BIM Architectural Profiles ({len(BIM_PROFILES)} Systems):")
        print("-" * 72)
        print(f"{'ID':<10} | {'Series':<8} | {'Section (mm)':<12} | {'Description'}")
        print("-" * 72)
        for p in BIM_PROFILES:
            dim_str = f"{p['width']:.0f} x {p['height']:.0f}"
            print(f"{p['id']:<10} | {p['series']:<8} | {dim_str:<12} | {p['type']}")
        print("-" * 72)
        return 0

    os.makedirs(args.out_dir, exist_ok=True)

    targets = []
    if args.system:
        match = next((p for p in BIM_PROFILES if p["id"].lower() == args.system.lower()), None)
        if not match:
            print(f"Error: Unknown system '{args.system}'. Use --list-systems to view options.", file=sys.stderr)
            return 1
        targets = [match]
    elif args.all:
        targets = BIM_PROFILES
    else:
        # Default to all if not specified
        targets = BIM_PROFILES

    print(f"Exporting AinZara BIM & 3D CAD Profiles to: {args.out_dir}")
    print(f"Extrusion Standard Length: {args.length:.1f} mm\n")

    for p in targets:
        # 1. IFC ISO 10303-21 File
        ifc_fname = f"{p['id']}-bim-profile.ifc"
        ifc_path = os.path.join(args.out_dir, ifc_fname)
        builder = IFCModelBuilder(ifc_fname, p)
        ifc_content = builder.build_ifc_content(extrusion_length_mm=args.length)

        with open(ifc_path, "w", encoding="utf-8") as f:
            f.write(ifc_content)

        # 2. 3D Solid DXF Mesh
        dxf_fname = f"{p['id']}-solid-3d.dxf"
        dxf_path = os.path.join(args.out_dir, dxf_fname)
        generate_3d_dxf_solid(p, dxf_path, length=args.length)

        print(f"  [{p['id'].upper()}] -> IFC: {ifc_fname} ({os.path.getsize(ifc_path):,} bytes) | 3D DXF: {dxf_fname} ({os.path.getsize(dxf_path):,} bytes)")

    print(f"\nSuccessfully generated {len(targets) * 2} BIM and 3D CAD assets for Revit & ArchiCAD.")
    return 0

if __name__ == "__main__":
    sys.exit(main())
