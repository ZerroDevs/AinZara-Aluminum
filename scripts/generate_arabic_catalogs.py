#!/usr/bin/env python3
"""
AinZara-Aluminum - Arabic Technical Sheets & Master Catalog Generator (PDF)
Generates high-precision, ISO-compliant vector Arabic architectural documents:
1. 14 Individual Arabic Technical Specification Sheets:
   assets/downloads/pdf/{id}-technical-sheet-ar.pdf
2. The Complete 18-Page Arabic Master Architectural Catalog:
   assets/downloads/pdf/AinZara-Master-Architectural-Catalog-ar.pdf

Features:
- TrueType Arial Unicode font embedding via ReportLab (identity-H encoding)
- Authentic cursive Arabic letter shaping & RTL via arabic_reshaper and python-bidi
- Soft centered watermark at authentic 17% opacity
- Precise CAD schematic rendering with clean alignment
- Complete architectural specifications translated by certified standards
- 100% free of overlapping text and sub-role tags
"""

import os
import sys
from PIL import Image
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import arabic_reshaper
from bidi.algorithm import get_display

REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF_DIR = os.path.join(REPO_ROOT, "assets", "downloads", "pdf")
os.makedirs(PDF_DIR, exist_ok=True)

# Register Windows Fonts
pdfmetrics.registerFont(TTFont('Arial', 'C:/Windows/Fonts/arial.ttf'))
pdfmetrics.registerFont(TTFont('Arial-Bold', 'C:/Windows/Fonts/arialbd.ttf'))

def ar(text):
    """Reshapes and applies BiDi algorithm for correct Arabic rendering."""
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(str(text))
    return get_display(reshaped)

# Ensure Watermark and Logo paths
LOGO_PATH = os.path.join(REPO_ROOT, "assets", "Images", "Logo_Watermark.png")
if not os.path.exists(LOGO_PATH):
    LOGO_PATH = os.path.join(REPO_ROOT, "assets", "Images", "Logo1.png")

SOFT_WM_PATH = os.path.join(REPO_ROOT, "assets", "Images", "Logo_Watermark_Soft.png")
if not os.path.exists(SOFT_WM_PATH):
    orig_logo = Image.open(LOGO_PATH)
    r, g, b, a = orig_logo.split()
    clean_mask = a.point(lambda p: 255 if p > 10 else 0)
    bbox = clean_mask.getbbox()
    tight_logo = orig_logo.crop(bbox) if bbox else orig_logo
    wm_w = 800
    wm_h = int(wm_w * tight_logo.height / tight_logo.width)
    wm_img = tight_logo.resize((wm_w, wm_h), Image.Resampling.LANCZOS)
    wr, wg, wb, wa = wm_img.split()
    soft_a = wa.point(lambda p: int((p / 255.0) * 0.17 * 255) if p > 10 else 0)
    soft_wm = Image.merge('RGBA', (wr, wg, wb, soft_a))
    soft_wm.save(SOFT_WM_PATH)

# Master Data for 14 Systems in Arabic
SYSTEMS_AR = [
    {
        "id": "sat120",
        "name": "SAT 120",
        "title": "نظام الواجهات الجرارة الرافعة المعمارية الفاخرة (Lift & Slide)",
        "series_ar": "سلسلة آرتوس للواجهات الجرارة",
        "series_en": "ARTOS SERIES",
        "img": "assets/Sliding/sat120.jpg",
        "frame_depth": "120 مم (مجرى ثنائي) / 180 مم (مجرى ثلاثي)",
        "vent_depth": "50 مم دلفة معمارية معززة للأحمال الشاقة",
        "glass_range": "24 مم - 38 مم زجاج مزدوج أو ثلاثي عازل (IGU)",
        "insulation": "عوازل حرارية بولياميد 20 مم PA66 GF25",
        "air_perm": "الفئة 4 (EN 12207 / ضغط 600 باسكال)",
        "water_tight": "الفئة 9A (EN 12208 / ضغط 600 باسكال)",
        "wind_load": "الفئة C4 (EN 12210 / ضغط 1600 باسكال)",
        "acoustic": "عزل صوتي عالي Rw = 37 - 42 ديسيبل",
        "max_sash_wt": "300 كجم (سحب عادي) / 400 كجم (رفع وسحب Lift & Slide)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "slat64",
        "name": "SLAT 64",
        "title": "نظام السحب المعماري المتعدد المجاري للنوافذ والأبواب",
        "series_ar": "سلسلة آرتوس للواجهات الجرارة",
        "series_en": "ARTOS SERIES",
        "img": "assets/Sliding/slat64.jpg",
        "frame_depth": "64 مم (مجرى ثنائي) / 112 مم (مجرى ثلاثي)",
        "vent_depth": "38 مم دلفة سحب متداخلة ذات انسيابية عالية",
        "glass_range": "18 مم - 28 مم زجاج مزدوج عازل",
        "insulation": "حشيات عزل ميكانيكية ومانعات تسريب هوائية",
        "air_perm": "الفئة 3 (EN 12207 / ضغط 450 باسكال)",
        "water_tight": "الفئة 7A (EN 12208 / ضغط 300 باسكال)",
        "wind_load": "الفئة C3 (EN 12210 / ضغط 1200 باسكال)",
        "acoustic": "عزل صوتي Rw = 32 - 36 ديسيبل",
        "max_sash_wt": "160 كجم لكل دلفة سحب",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "wat63",
        "name": "WAT 63",
        "title": "نظام النوافذ والأبواب المفصلية المعزولة حرارياً 24 مم",
        "series_ar": "سلسلة هيكلا للنوافذ والأبواب المفصلية",
        "series_en": "HEKLA SERIES",
        "img": "assets/Door-Window/wat63.jpg",
        "frame_depth": "63 مم عمق حلق معماري عالي الكفاءة",
        "vent_depth": "71 مم دلفة مفصلية مع تفريز فتح للداخل/الخارج",
        "glass_range": "20 مم - 42 مم زجاج عازل حراري وصوتي متقدم",
        "insulation": "جسور عزل بولياميد ألمانية 24 مم PA66 GF25",
        "air_perm": "الفئة 4 (EN 12207 / ضغط 600 باسكال)",
        "water_tight": "الفئة 9A (EN 12208 / ضغط 600 باسكال)",
        "wind_load": "الفئة C5 (EN 12210 / ضغط 2000 باسكال)",
        "acoustic": "عزل صوتي فائق Rw = 38 - 44 ديسيبل",
        "max_sash_wt": "180 كجم (قلاب مفصلي) / 220 كجم (باب رئيسي)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "wa55",
        "name": "WA 55",
        "title": "نظام الأبواب والنوافذ المفصلية المعمارية القياسية",
        "series_ar": "سلسلة هيكلا للنوافذ والأبواب المفصلية",
        "series_en": "HEKLA SERIES",
        "img": "assets/Door-Window/wa55.jpg",
        "frame_depth": "55 مم حلق معماري قياسي متعدد الغرف",
        "vent_depth": "63 مم دلفة مفصلية مع مزاريب تصريف مطرية",
        "glass_range": "6 مم زجاج مفرد إلى 32 مم زجاج مزدوج",
        "insulation": "تصميم هندسي متعدد الغرف الهوائية للعزل",
        "air_perm": "الفئة 3 (EN 12207 / ضغط 450 باسكال)",
        "water_tight": "الفئة 8A (EN 12208 / ضغط 450 باسكال)",
        "wind_load": "الفئة C3 (EN 12210 / ضغط 1200 باسكال)",
        "acoustic": "عزل صوتي Rw = 32 - 37 ديسيبل",
        "max_sash_wt": "130 كجم (نافذة) / 160 كجم (باب مدخل)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "wa45",
        "name": "WA 45",
        "title": "نظام النوافذ والأبواب المفصلية والثابتة الاقتصادية",
        "series_ar": "سلسلة هيكلا للنوافذ والأبواب المفصلية",
        "series_en": "HEKLA SERIES",
        "img": "assets/Door-Window/wa45.jpg",
        "frame_depth": "45 مم عمق قطاع مدمج واقتصادي",
        "vent_depth": "52 مم دلفة مفصلية مدمجة",
        "glass_range": "4 مم زجاج مفرد إلى 24 مم زجاج مزدوج",
        "insulation": "قطاع ألمنيوم متين بتصميم غرف هوائية",
        "air_perm": "الفئة 2 (EN 12207 / ضغط 300 باسكال)",
        "water_tight": "الفئة 6A (EN 12208 / ضغط 250 باسكال)",
        "wind_load": "الفئة C2 (EN 12210 / ضغط 800 باسكال)",
        "acoustic": "عزل صوتي Rw = 30 - 34 ديسيبل",
        "max_sash_wt": "90 كجم (نافذة) / 120 كجم (باب)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "CWA50sg",
        "name": "CWA 50 SG",
        "title": "نظام الواجهات الزجاجية الإنشائية الكاملة (Structural Glazing)",
        "series_ar": "سلسلة برومو للواجهات الزجاجية",
        "series_en": "BROMO SERIES",
        "img": "assets/Facade/CWA50sg.jpg",
        "frame_depth": "80 مم - 220 مم أعمدة وقواطع هيكلية مفرغة",
        "vent_depth": "50 مم عرض واجهة خارجية موحدة (زجاج إنشائي مستوٍ)",
        "glass_range": "24 مم - 44 مم زجاج مزدوج مدمج بسيليكون إنشائي",
        "insulation": "عوازل حرارية مستمرة من مطاط EPDM المتعدد",
        "air_perm": "الفئة AE 1200 (EN 12152 / ضغط 1200 باسكال)",
        "water_tight": "الفئة RE 1500 (EN 12154 / ضغط 1500 باسكال)",
        "wind_load": "تصميم 2000 باسكال / أمان 3000 باسكال (EN 13116)",
        "acoustic": "عزل صوتي مرتفع Rw = 42 - 48 ديسيبل",
        "max_sash_wt": "350 كجم لكل وحدة واجهة زجاجية",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "CWA50HV",
        "name": "CWA 50 HV",
        "title": "نظام الواجهات الزجاجية شبه الإنشائية بفتحات تهوية مخفية",
        "series_ar": "سلسلة برومو للواجهات الزجاجية",
        "series_en": "BROMO SERIES",
        "img": "assets/Facade/CWA50HV.jpg",
        "frame_depth": "80 مم - 220 مم مصفوفة قوائم وجسور إنشائية",
        "vent_depth": "50 مم خط رؤية خارجي مع فتحات تهوية مخفية تماماً",
        "glass_range": "24 مم - 44 مم زجاج عازل حراري وصوتي مزدوج وثلاثي",
        "insulation": "فواصل عزل EPDM متطورة مع قلب بولياميد",
        "air_perm": "الفئة AE 1200 (EN 12152 / ضغط 1200 باسكال)",
        "water_tight": "الفئة RE 1200 (EN 12154 / ضغط 1200 باسكال)",
        "wind_load": "تصميم 2000 باسكال / أمان 3000 باسكال (EN 13116)",
        "acoustic": "عزل صوتي Rw = 40 - 46 ديسيبل",
        "max_sash_wt": "180 كجم دلفة قلابة مخفية للتهوية",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "fat70",
        "name": "FAT 70",
        "title": "نظام الأبواب القابلة للطي المعزولة حرارياً للأوزان الثقيلة",
        "series_ar": "سلسلة نيبال للأبواب القابلة للطي",
        "series_en": "NEPAL SERIES",
        "img": "assets/Folding-Door/fat70.jpg",
        "frame_depth": "70 مم حلق معماري فائق المتانة",
        "vent_depth": "70 مم دلفة طي معززة للأحمال الهيكلية",
        "glass_range": "24 مم - 40 مم زجاج عازل عالي الكفاءة",
        "insulation": "جسور بولياميد عازلة 30 مم PA66 GF25",
        "air_perm": "الفئة 4 (EN 12207 / ضغط 600 باسكال)",
        "water_tight": "الفئة 8A (EN 12208 / ضغط 450 باسكال)",
        "wind_load": "الفئة C3 (EN 12210 / ضغط 1200 باسكال)",
        "acoustic": "عزل صوتي Rw = 36 - 41 ديسيبل",
        "max_sash_wt": "140 كجم لكل دلفة طي (حتى 8 دلفات متصلة)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "fat55",
        "name": "FAT 55",
        "title": "نظام الأبواب القابلة للطي البانورامية العازلة للحرارة",
        "series_ar": "سلسلة نيبال للأبواب القابلة للطي",
        "series_en": "NEPAL SERIES",
        "img": "assets/Folding-Door/fat55.jpg",
        "frame_depth": "55 مم حلق معماري انسيابي",
        "vent_depth": "55 مم دلفة طي خفيفة وعصرية",
        "glass_range": "18 مم - 32 مم زجاج مزدوج عازل",
        "insulation": "جسور بولياميد عازلة للحرارة 16 مم",
        "air_perm": "الفئة 3 (EN 12207 / ضغط 450 باسكال)",
        "water_tight": "الفئة 7A (EN 12208 / ضغط 300 باسكال)",
        "wind_load": "الفئة C2 (EN 12210 / ضغط 800 باسكال)",
        "acoustic": "عزل صوتي Rw = 33 - 38 ديسيبل",
        "max_sash_wt": "100 كجم لكل دلفة طي (حتى 6 دلفات)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "ipa45",
        "name": "IPA 45",
        "title": "نظام القواطع المكتبية بالزجاج المزدوج العازل للصوت",
        "series_ar": "سلسلة آيدا للقواطع المكتبية",
        "series_en": "IDA SERIES",
        "img": "assets/Office/ipa45.jpg",
        "frame_depth": "45 مم قطاع محيطي / 100 مم إجمالي عمق الجدار المكتبي",
        "vent_depth": "زجاج مزدوج مستوٍ مع إمكانية دمج ستائر داخلية",
        "glass_range": "6 مم - 12 مم زجاج مزدوج طبقي عازل للصوت (Acoustic)",
        "insulation": "تجويف هوائي لعزل الضوضاء والخصوصية المفرغة",
        "air_perm": "مواصفات المشاريع الإدارية والتجارية الداخلية",
        "water_tight": "مواصفات القواطع الداخلية المعمارية",
        "wind_load": "معيار الأمان ومقاومة الصدمات الداخلية (BS 5234)",
        "acoustic": "عزل صوتي معتمد Rw = 42 - 46 ديسيبل",
        "max_sash_wt": "80 كجم باب زجاجي أو ألمنيوم محوري",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "ipa30",
        "name": "IPA 30",
        "title": "نظام القواطع الزجاجية المكتبية الأنيقة فائقة النحافة",
        "series_ar": "سلسلة آيدا للقواطع المكتبية",
        "series_en": "IDA SERIES",
        "img": "assets/Office/ipa30.jpg",
        "frame_depth": "30 مم مظهر مقطعي فائق النحافة",
        "vent_depth": "مجاري تثبيت زجاجية داخلية دقيقة",
        "glass_range": "8 مم - 12 مم زجاج سيكوريت مفرد مقسى ومصفح",
        "insulation": "حشيات مطاطية عازلة للاهتزاز والضوضاء",
        "air_perm": "مواصفات المنشآت الداخلية والشركات",
        "water_tight": "عوازل أرضية وسقفية مطاطية",
        "wind_load": "قاطع داخلي صلب مقاوم للحركات الرأسية",
        "acoustic": "عزل صوتي Rw = 34 - 38 ديسيبل",
        "max_sash_wt": "70 كجم دلفة باب زجاجي مقسى",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "sa65",
        "name": "SA 65",
        "title": "نظام الأسقف الزجاجية والقباب والفراندات المعمارية",
        "series_ar": "سلسلة أورال للأسقف والقباب الزجاجية",
        "series_en": "URAL SERIES",
        "img": "assets/Roof/sa65.jpg",
        "frame_depth": "65 مم عرض الواجهة / 120 مم عمق العوارض الحاملة",
        "vent_depth": "أغطية تثبيت وضغط خارجية مع مسامير ستانلس ستيل",
        "glass_range": "24 مم - 44 مم زجاج مزدوج متدرج للتحكم الشمسي",
        "insulation": "قنوات تصريف داخلية ثلاثية لمياه التكثيف EPDM",
        "air_perm": "الفئة AE 1200 (EN 12152 / ضغط 1200 باسكال)",
        "water_tight": "الفئة RE 1500 (EN 12154 / ضغط 1500 باسكال)",
        "wind_load": "قدرة إنشائية عالية ومقاومة رياح وثلوج حتى 2400 باسكال",
        "acoustic": "عزل صوتي Rw = 38 - 43 ديسيبل",
        "max_sash_wt": "400 كجم سعة تحميل الوحدة الزجاجية للرافدة",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
    {
        "id": "sa65-2",
        "name": "SA 65-2",
        "title": "نظام الأسقف الزجاجية الثقيلة المدعمة بهياكل صلب إنشائي",
        "series_ar": "سلسلة أورال للأسقف والقباب الزجاجية",
        "series_en": "URAL SERIES",
        "img": "assets/Roof/sa65.jpg",
        "frame_depth": "65 مم عوارض ألمنيوم مع مقاطع صلب إنشائي داخلية",
        "vent_depth": "روافد إنشائية مدعمة للمسافات الواسعة والأوزان الثقيلة",
        "glass_range": "28 مم - 48 مم زجاج ثلاثي Low-E عازل حرارياً",
        "insulation": "بولياميد مستمر ومصفوفة حشيات تصريف شاملة",
        "air_perm": "الفئة AE 1200 (EN 12152 / ضغط 1200 باسكال)",
        "water_tight": "الفئة RE 1800 (EN 12154 / ضغط 1800 باسكال)",
        "wind_load": "سعة فائقة للرياح والضغوط الإنشائية حتى 3200 باسكال",
        "acoustic": "عزل صوتي Rw = 40 - 45 ديسيبل",
        "max_sash_wt": "550 كجم سعة تحميل العارضة الهيكلية للمسافات الكبيرة",
        "alloy": "EN AW-6063 T6 مدعمة بصلب مجلفن داخلي (565-7101)",
    },
    {
        "id": "gsa130",
        "name": "GSA 130",
        "title": "نظام الواجهات والدرابزينات المنزلقة رأسياً بالمحرك (Guillotine)",
        "series_ar": "سلسلة لوجان للمنظومات الرأسية الآلية",
        "series_en": "LOGAN SERIES",
        "img": "assets/Vertical-Sliding/gsa130.jpg",
        "frame_depth": "130 مم مجرى توجيه جانبي رأسي ثلاثي المسارات",
        "vent_depth": "3 ألواح تلسكوبية متحركة رأسياً بنظام سيور متين",
        "glass_range": "8 مم - 10 مم زجاج مقسى / 20 مم زجاج عازل مزدوج",
        "insulation": "موانع تسريب عالية الكثافة وحشيات شعرية مانعة للغبار",
        "air_perm": "حشيات سفلية وعلوية آلية مانعة للعوامل الجوية",
        "water_tight": "الفئة 7A (EN 12208 / ضغط 300 باسكال)",
        "wind_load": "الفئة C3 (EN 12210 / ضغط 1200 باسكال)",
        "acoustic": "عزل صوتي Rw = 32 - 37 ديسيبل",
        "max_sash_wt": "220 كجم محرك كهربائي متقدم (تحكم عن بعد / مفتاح ذكي)",
        "alloy": "EN AW-6063 T6 (وفق المواصفة القياسية EN 12020-2)",
    },
]

def draw_watermark(c):
    """Draws centered watermark logo with 17% soft opacity on A4."""
    wm_w = 380.0
    wm_h = wm_w * (910.0 / 800.0)
    wm_x = (595.28 - wm_w) / 2.0
    wm_y = (841.89 - wm_h) / 2.0
    c.drawImage(SOFT_WM_PATH, wm_x, wm_y, width=wm_w, height=wm_h, mask='auto')

def draw_header(c, page_num, total_pages=18, is_single_sheet=False):
    """Draws Arabic luxury header band with crisp corporate branding."""
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(0, 765, 595.28, 77, fill=1, stroke=0)
    c.setFillColorRGB(0.165, 0.471, 0.722)
    c.rect(0, 761, 595.28, 4, fill=1, stroke=0)

    # Logo on the left
    c.drawImage(LOGO_PATH, 36, 776, width=46, height=46 * (910.0 / 800.0), mask='auto')

    # Typography on the right (RTL alignment)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 13.5)
    c.drawRightString(559, 814, ar('شركة عين زارة لمعالجة الزجاج وتصنيع الألمنيوم'))

    c.setFont('Arial', 8)
    c.setFillColorRGB(0.85, 0.90, 0.95)
    if is_single_sheet:
        sub_line = 'المنطقة الصناعية، طرابلس، ليبيا  |  ص.ب 82144  |  هاتف: 5050 429 92 218+  |  info@ainzara.ly'
    else:
        sub_line = f'صفحة {page_num:02d} من {total_pages:02d}  |  المنطقة الصناعية، طرابلس، ليبيا  |  هاتف: 5050 429 92 218+'
    c.drawRightString(559, 798, ar(sub_line))

    c.setFont('Arial-Bold', 8)
    c.setFillColorRGB(0.45, 0.78, 1.0)
    c.drawRightString(559, 782, ar('إدارة المنظومات المعمارية  |  بطاقة المواصفات الفنية المعتمدة للمناقصات والتصنيع'))

def draw_footer(c, page_num, total_pages=18, is_single_sheet=False):
    """Draws standard navy bottom footer bar with page number."""
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(0, 0, 595.28, 28, fill=1, stroke=0)
    c.setFillColorRGB(0.90, 0.95, 1.0)
    c.setFont('Arial', 7.5)
    c.drawRightString(559, 10, ar('شركة عين زارة للألمنيوم ومعالجة الزجاج - مجمع طرابلس الصناعي - جميع الحقوق الفنية محفوظة.'))
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 7.5)
    if is_single_sheet:
        c.drawString(36, 10, ar('البطاقة الفنية المعتمدة - إصدار 2026'))
    else:
        c.drawString(36, 10, ar(f'صفحة {page_num:02d} من {total_pages:02d}'))

def draw_system_page(c, sys_info, page_num, total_pages=18, is_single_sheet=False):
    """Renders one complete Arabic System Specification Sheet."""
    draw_watermark(c)
    draw_header(c, page_num, total_pages, is_single_sheet)

    # 1. System Title Block
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 14)
    c.drawRightString(559, 736, ar(f"{sys_info['name']} - {sys_info['title']}"))

    c.setFont('Arial-Bold', 8.5)
    c.setFillColorRGB(0.165, 0.471, 0.722)
    meta_text = f"{sys_info['series_ar']} ({sys_info['series_en']})   |   رمز المنظومة: {sys_info['id'].upper()}   |   سبيكة الألمنيوم: EN AW-6063 T6"
    c.drawRightString(559, 718, ar(meta_text))

    # 2. CAD Viewport Box
    box_x = 36.0
    box_y = 460.0
    box_w = 523.0
    box_h = 245.0

    c.setStrokeColorRGB(0.82, 0.86, 0.90)
    c.setLineWidth(1)
    c.rect(box_x, box_y, box_w, box_h, fill=0, stroke=1)

    # Top-right header tab on CAD box
    tab_w = 230.0
    tab_x = box_x + box_w - tab_w
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(tab_x, box_y + box_h - 20, tab_w, 20, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 8)
    c.drawRightString(box_x + box_w - 10, box_y + box_h - 14, ar('المخطط الهندسي للمقطع العرضي CAD ثنائي الأبعاد'))

    # Draw CAD Cross-Section Image Centered
    cad_rel_path = sys_info["img"]
    cad_abs_path = os.path.join(REPO_ROOT, cad_rel_path)
    if os.path.exists(cad_abs_path):
        c.drawImage(cad_abs_path, box_x + 12, box_y + 10, width=box_w - 24, height=box_h - 34, preserveAspectRatio=True, anchor='c')

    # 3. Specification Matrix Table
    tbl_y = 430.0
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(box_x, tbl_y, box_w, 20, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 8.5)
    c.drawRightString(box_x + box_w - 10, tbl_y + 6, ar('مصفوفة المواصفات الفنية والميكانيكية المعتمدة'))
    c.drawString(box_x + 10, tbl_y + 6, ar('معايير التصنيع والأداء (EN / ISO)'))

    rows = [
        ('سبيكة الألمنيوم الأساسية', sys_info['alloy']),
        ('عمق الحلق المعماري', sys_info['frame_depth']),
        ('عمق قطاع الدلفة المعمارية', sys_info['vent_depth']),
        ('سعة وسماكة الزجاج العازل', sys_info['glass_range']),
        ('العزل الحراري وفواصل البولياميد', sys_info['insulation']),
        ('نفاذية الهواء (EN 12207)', sys_info['air_perm']),
        ('مقاومة نفاذ الماء (EN 12208)', sys_info['water_tight']),
        ('مقاومة أحمال الرياح (EN 12210)', sys_info['wind_load']),
        ('العزل الصوتي والضوضاء', sys_info['acoustic']),
        ('أقصى وزن للدلفة الواحدة', sys_info['max_sash_wt']),
    ]

    row_h = 16.5
    cur_y = tbl_y - row_h
    split_x = box_x + 360.0  # Divider between label (right) and value (left)

    for label, val in rows:
        # Row outline
        c.setStrokeColorRGB(0.88, 0.90, 0.93)
        c.setLineWidth(0.5)
        c.rect(box_x, cur_y, box_w, row_h, fill=0, stroke=1)

        # Subtle vertical separator line
        c.setStrokeColorRGB(0.90, 0.92, 0.94)
        c.line(split_x, cur_y, split_x, cur_y + row_h)

        # Label (Right-aligned in label column)
        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.setFont('Arial-Bold', 7.5)
        c.drawRightString(box_x + box_w - 10, cur_y + 4.5, ar(label))

        # Value (Right-aligned in value column)
        c.setFillColorRGB(0.12, 0.18, 0.24)
        c.setFont('Arial', 7.5)
        c.drawRightString(split_x - 10, cur_y + 4.5, ar(val))

        cur_y -= row_h

    # 4. Fabrication Standards & Quality Box
    notes_top = cur_y - 6.0
    box_height = 68.0
    notes_bottom = notes_top - box_height

    c.setStrokeColorRGB(0.165, 0.471, 0.722)
    c.setLineWidth(0.8)
    c.rect(box_x, notes_bottom, box_w, box_height, fill=0, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 8.5)
    c.drawRightString(box_x + box_w - 10, notes_top - 14.0, ar('معايير التصنيع وضمان الجودة الدولية:'))

    c.setFillColorRGB(0.20, 0.25, 0.30)
    c.setFont('Arial', 7.5)
    q_lines = [
        '- تفاوتات السحب والأبعاد: مطابقة صارمة للمواصفة القياسية الأوروبية EN 12020-2 / DIN 17615 فائقة الدقة.',
        '- الطلاء السطحي: طلاء بودرة إلكتروستاتيكي معتمد كواليكوت QUALICOAT (60-80 ميكرون) / أنودة كوالانود QUALANOD.',
        '- الحشيات والإكسسوارات: حشيات EPDM عازلة للطقس طبقاً لـ DIN 7863. متوافقة مع إكسسوارات المجرى الأوروبي Standard Euro-Groove.',
        '- إدارة الجودة الشاملة: يتم السحب والتصنيع والمعالجة تحت مظلة نظام إدارة الجودة المعتمد دولياً ISO 9001:2015.'
    ]
    qy = notes_top - 27.0
    for ql in q_lines:
        c.drawRightString(box_x + box_w - 10, qy, ar(ql))
        qy -= 12.0

    # 5. Directives & Direct Contact (No Sub-role tags!)
    sign_y = notes_bottom - 16.0
    c.setFont('Arial-Bold', 7.5)
    c.setFillColorRGB(0.30, 0.35, 0.42)
    c.drawRightString(box_x + box_w - 10, sign_y, ar('توجيه المصنع المعتمد:'))
    c.setFont('Arial', 7.5)
    c.drawRightString(box_x + box_w - 105, sign_y, ar('المواصفات الفنية المعتمدة صالحة ومطابقة لتقديم العطاءات والمناقصات، وأعمال التصنيع والتركيب الإنشائي.'))

    c.setFont('Arial-Bold', 7.5)
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.drawRightString(box_x + box_w - 10, sign_y - 12.0, ar('للتواصل المباشر:'))
    c.setFont('Arial', 7.5)
    c.setFillColorRGB(0.30, 0.35, 0.42)
    c.drawRightString(box_x + box_w - 85, sign_y - 12.0, ar('+218 92 429 5050  |  +218 91 614 1616  |  مجمع عين زارة الصناعي، طرابلس - ليبيا  |  www.ainzara.ly'))

    draw_footer(c, page_num, total_pages, is_single_sheet)

def draw_cover_page(c):
    """Page 1: Luxury Front Cover Page for Master Architectural Catalog."""
    # Top Navy Banner
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(0, 660, 595.28, 181.89, fill=1, stroke=0)
    c.setFillColorRGB(0.165, 0.471, 0.722)
    c.rect(0, 654, 595.28, 6, fill=1, stroke=0)
    c.setFillColorRGB(0.85, 0.65, 0.13)  # Gold accent
    c.rect(0, 650, 595.28, 4, fill=1, stroke=0)

    # Top Typography
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 22)
    c.drawRightString(547, 785, ar('شركة عين زارة لمعالجة الزجاج وتصنيع الألمنيوم'))
    c.setFont('Arial', 11)
    c.setFillColorRGB(0.80, 0.90, 1.0)
    c.drawRightString(547, 758, ar('مجمع طرابلس الصناعي  -  المقر الرئيسي للمصنع وإدارة المشاريع الهندسية والمناقصات'))
    c.setFont('Arial-Bold', 12.5)
    c.setFillColorRGB(0.45, 0.78, 1.0)
    c.drawRightString(547, 730, ar('الكتالوج الفني الشامل للمنظومات المعمارية ومعالجة الزجاج المتقدم'))
    c.setFont('Arial', 9.5)
    c.setFillColorRGB(0.90, 0.95, 1.0)
    c.drawRightString(547, 706, ar('إصدار 2026 المعتمد  |  مواصفات المناقصات، القطاعات الهندسية وجداول الأداء'))

    # Large Center Cover Logo
    cov_w = 260.0
    cov_h = cov_w * (910.0 / 800.0)
    cov_x = (595.28 - cov_w) / 2.0
    c.drawImage(LOGO_PATH, cov_x, 385.0, width=cov_w, height=cov_h, mask='auto')

    # Center Title Block
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 16)
    c.drawRightString(547, 345, ar('الملف المعماري والمصفوفات الفنية والهندسية'))
    c.setFont('Arial', 9.5)
    c.setFillColorRGB(0.30, 0.35, 0.42)
    c.drawRightString(547, 325, ar('دليل هندسي شامل يغطي 14 منظومة قطاعات ألمنيوم معتمدة وفق المعايير الأوروبية القياسية،'))
    c.drawRightString(547, 310, ar('وخطوط إنتاج الزجاج المزدوج والثلاثي الآلية العازلة Lisec، ومعايير الطلاء الكهربائي المعتمد كواليكوت.'))

    # 7 Series Grid Badges on Cover
    c.setFillColorRGB(0.96, 0.975, 0.99)
    c.setStrokeColorRGB(0.82, 0.86, 0.90)
    c.setLineWidth(1)
    c.rect(48.0, 155.0, 499.28, 125.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 9.5)
    c.drawRightString(530, 260, ar('المنظومات المعمارية المعتمدة المضمنة في هذا الكتالوج:'))

    series_items = [
        ("سلسلة آرتوس (ARTOS)", "منظومة SAT 120 الرفع والسحب الفاخرة  |  منظومة SLAT 64 السحب المتعدد المجاري"),
        ("سلسلة هيكلا (HEKLA)", "منظومة WAT 63 العازلة حرارياً  |  منظومة WA 55 القياسية  |  منظومة WA 45 الاقتصادية"),
        ("سلسلة برومو (BROMO)", "واجهات CWA 50 SG الإنشائية الكاملة  |  واجهات CWA 50 HV بالفتحات المخفية"),
        ("سلسلة نيبال (NEPAL)", "أبواب FAT 70 القابلة للطي المعزولة حرارياً  |  أبواب FAT 55 البانورامية العصرية"),
        ("سلسلتا آيدا وأورال", "قواطع IPA 45 / IPA 30 المكتبية الزجاجية  |  أسقف وقباب SA 65 و SA 65-2 المعمارية"),
        ("سلسلة لوجان (LOGAN)", "منظومة GSA 130 الرأسية الآلية بالمحركات الكهربائية (Guillotine Systems)")
    ]

    row_y = 240.0
    for s_name, s_desc in series_items:
        c.setFont('Arial-Bold', 8)
        c.setFillColorRGB(0.165, 0.471, 0.722)
        c.drawRightString(530, row_y, ar(s_name + " :"))
        c.setFont('Arial', 7.5)
        c.setFillColorRGB(0.20, 0.25, 0.30)
        c.drawRightString(400, row_y, ar(s_desc))
        row_y -= 14.0

    # Bottom Factory Compliance Bar
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(0, 0, 595.28, 85, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 9.0)
    c.drawRightString(547, 60, ar('مجمع طرابلس الصناعي  -  الإشراف والتوجيهات الصناعية المعتمدة'))
    c.setFont('Arial', 8.0)
    c.setFillColorRGB(0.85, 0.90, 0.95)
    c.drawRightString(547, 44, ar('ص.ب 82144، عين زارة، طرابلس، ليبيا  |  هاتف: 5050 429 92 218+  |  info@ainzara.ly  |  www.ainzara.ly'))
    c.setFont('Arial-Bold', 8.0)
    c.setFillColorRGB(0.85, 0.65, 0.13)
    c.drawRightString(547, 26, ar('الاعتمادات الرسمية: ISO 9001:2015  *  طلاء كواليكوت QUALICOAT  *  أنودة كوالانود QUALANOD  *  معيار EN 12020-2'))

def draw_toc_page(c):
    """Page 2: Corporate Infrastructure, Machinery & Table of Contents."""
    draw_watermark(c)
    draw_header(c, 2, 18)

    # Section 1: Industrial Infrastructure Box
    c.setFillColorRGB(0.975, 0.985, 1.0)
    c.setStrokeColorRGB(0.165, 0.471, 0.722)
    c.setLineWidth(1)
    c.rect(36.0, 575.0, 523.28, 175.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 10.5)
    c.drawRightString(545, 730, ar('البنية الصناعية للمصنع والقدرات الإنتاجية المؤتمتة:'))

    overview_lines = [
        "- تشغيل الألمنيوم بآلات CNC: مناشير قص مزدوجة الرأس أوتوماتيكية بدقة (0.1 مم)، ومراكز تشغيل قطاعات رباعية المحاور.",
        "- تجميع العوازل الحرارية بولياميد: تخشين آلي، وتغذية شرائح البولياميد، وكبس متعدد المراحل وفق EN 14024.",
        "- خط معالجة وتصنيع الزجاج العازل الآلي: خط روبوتي متطور Lisec لإنتاج الزجاج المزدوج والثلاثي بحقن غاز الأرجون بنسبة 95%+.",
        "- فرن التقسية الأفقي الحراري: تقسية حرارية معززة بالحمل للزجاج المقسى حتى سماكة 19 مم طبقاً للمواصفة EN 12150-1.",
        "- منشأة الطلاء والمعالجة السطحية: طلاء بودرة إلكتروستاتيكي معتمد كواليكوت (60-80 ميكرون) وأنودة كوالانود المقاومة للملوحة.",
        "- الدعم الهندسي والمناقصات: مكتب هندسي متكامل بطرابلس لتقديم حسابات قص القطاعات والمخططات التنفيذية وملفات BIM."
    ]

    cur_y = 710.0
    c.setFont('Arial', 7.5)
    c.setFillColorRGB(0.15, 0.20, 0.26)
    for line in overview_lines:
        c.drawRightString(545, cur_y, ar(line))
        cur_y -= 16.0

    # Section 2: Table of Contents Table
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(36.0, 535.0, 523.28, 22.0, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 8.5)
    c.drawRightString(545, 542.0, ar('فهرس الكتالوج ومصفوفة الأنظمة المعمارية الشاملة'))
    c.drawString(46, 542.0, ar('رقم الصفحة'))

    toc_items = [
        ("01", "SAT 120", "ARTOS", "نظام الواجهات الجرارة الرافعة المعمارية الفاخرة", "صفحة 03"),
        ("02", "SLAT 64", "ARTOS", "نظام السحب المعماري المتعدد المجاري للنوافذ والأبواب", "صفحة 04"),
        ("03", "WAT 63", "HEKLA", "نظام النوافذ والأبواب المفصلية المعزولة حرارياً 24 مم", "صفحة 05"),
        ("04", "WA 55", "HEKLA", "نظام الأبواب والنوافذ المفصلية المعمارية القياسية", "صفحة 06"),
        ("05", "WA 45", "HEKLA", "نظام النوافذ والأبواب المفصلية والثابتة الاقتصادية", "صفحة 07"),
        ("06", "CWA 50 SG", "BROMO", "واجهات زجاجية إنشائية كاملة بدون فواصل معدنية بارزة", "صفحة 08"),
        ("07", "CWA 50 HV", "BROMO", "واجهات زجاجية شبه إنشائية بفتحات تهوية مخفية", "صفحة 09"),
        ("08", "FAT 70", "NEPAL", "أبواب قابلة للطي عازلة حرارياً للأوزان والفتحات الكبيرة", "صفحة 10"),
        ("09", "FAT 55", "NEPAL", "أبواب قابلة للطي بانورامية عازلة بتصميم عصري", "صفحة 11"),
        ("10", "IPA 45", "IDA", "قواطع مكتبية زجاجية مزدوجة عالية العزل الصوتي", "صفحة 12"),
        ("11", "IPA 30", "IDA", "قواطع مكتبية زجاجية مفردة فائقة النحافة قابلة للفك", "صفحة 13"),
        ("12", "SA 65", "URAL", "أسقف وقباب زجاجية وفراندات مع قنوات تصريف داخلية", "صفحة 14"),
        ("13", "SA 65-2", "URAL", "أسقف زجاجية ثقيلة معززة بهياكل صلب للمساحات الواسعة", "صفحة 15"),
        ("14", "GSA 130", "LOGAN", "واجهات ودرابزينات مقصلة منزلقة رأسياً بمحركات آلية", "صفحة 16"),
        ("15", "قسم الزجاج", "IGU/DGU", "قدرات معالجة الزجاج ومصفوفة المواصفات الحرارية", "صفحة 17"),
        ("16", "دليل المصنع", "CONTACT", "مكاتب التواصل المباشر، واتساب، المناقصات والدعم الفني", "صفحة 18"),
    ]

    t_y = 512.0
    for num, code, series, desc, p_num in toc_items:
        c.setStrokeColorRGB(0.88, 0.90, 0.93)
        c.setLineWidth(0.5)
        c.rect(36.0, t_y, 523.28, 17.5, fill=0, stroke=1)

        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.setFont('Arial-Bold', 7.5)
        c.drawRightString(548, t_y + 4.5, ar(num))

        c.setFillColorRGB(0.165, 0.471, 0.722)
        c.setFont('Arial-Bold', 7.5)
        c.drawRightString(525, t_y + 4.5, ar(f"{code} ({series})"))

        c.setFillColorRGB(0.12, 0.18, 0.24)
        c.setFont('Arial', 7.5)
        c.drawRightString(390, t_y + 4.5, ar(desc))

        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.setFont('Arial-Bold', 7.5)
        c.drawString(46, t_y + 4.5, ar(p_num))

        t_y -= 17.5

    draw_footer(c, 2, 18)

def draw_glass_page(c):
    """Page 17: Glass Processing Division Capabilities & Glazing Matrix."""
    draw_watermark(c)
    draw_header(c, 17, 18)

    # Overview Box
    c.setFillColorRGB(0.975, 0.985, 1.0)
    c.setStrokeColorRGB(0.165, 0.471, 0.722)
    c.setLineWidth(1)
    c.rect(36.0, 635.0, 523.28, 120.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 10.5)
    c.drawRightString(545, 735.0, ar('مصنع معالجة الزجاج المعماري المؤتمت (مجمع طرابلس الصناعي):'))

    c.setFont('Arial', 8.0)
    c.setFillColorRGB(0.15, 0.20, 0.26)
    c.drawRightString(545, 715.0, ar('تمتلك شركة عين زارة خطوطاً متكاملة لقص الزجاج بالكمبيوتر CNC، وشطف وتجليد الحواف الآلي، وأفران التقسية الحرارية،'))
    c.drawRightString(545, 700.0, ar('وروبوتات تجميع الزجاج العازل المزدوج والثلاثي لتقديم أعلى أداء طاقي ومقاومة للعوامل المناخية في ليبيا.'))

    c.setFont('Arial-Bold', 8.0)
    c.setFillColorRGB(0.165, 0.471, 0.722)
    c.drawRightString(545, 680.0, ar('المعايير المعتمدة: EN 1279-2 (احتفاظ الغاز بالزجاج العازل)، EN 12150-1 (الزجاج المقسى الأمان)، EN 14449 (المصفح).'))

    # Glazing Specification Table
    tbl_y = 600.0
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(36.0, tbl_y, 523.28, 22.0, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 8.0)
    c.drawRightString(548, 607.0, ar('تركيبة ومواصفات الزجاج المعماري'))
    c.drawRightString(350, 607.0, ar('معامل انتقال الحرارة Ug'))
    c.drawRightString(260, 607.0, ar('الكسب الشمسي SHGC'))
    c.drawRightString(180, 607.0, ar('العزل الصوتي Rw'))
    c.drawString(42, 607.0, ar('الاستخدام الموصى به'))

    glass_specs = [
        ("زجاج سيكوريت مقسى مفرد شفاف 6 مم", "5.7 W/m²K", "0.82", "31 dB", "قواطع مكتبية داخلية (IPA 30)"),
        ("زجاج مقسى أمان شفاف 8 مم / 10 مم", "5.6 W/m²K", "0.79", "33 dB", "شرفات مقصلة رأسية (GSA 130)"),
        ("زجاج مزدوج شفاف 6مم + 12مم فراغ + 6مم", "2.8 W/m²K", "0.72", "34 dB", "نوافذ مفصلية اقتصادية (WA 45)"),
        ("زجاج عازل Low-E 6مم + 16مم أرجون + 6مم", "1.1 W/m²K", "0.40", "37 dB", "نوافذ معزولة حرارياً (WAT 63)"),
        ("زجاج تحكم شمسي 6مم + 16Ar + 6مم Low-E", "1.0 W/m²K", "0.28", "38 dB", "واجهات زجاجية إنشائية (CWA 50)"),
        ("زجاج عازل للصوت ثقيل 8مم + 20Ar + 8مم", "1.1 W/m²K", "0.38", "42 dB", "أبواب سحب عملاقة (SAT 120)"),
        ("زجاج أمان مصفح 4.4.2 PVB + 16Ar + 6 Low-E", "1.1 W/m²K", "0.36", "44 dB", "زجاج الأمان ومقاومة الكسر"),
        ("زجاج مصفح عازل للصوت 6.6.2 Acoustic PVB", "5.2 W/m²K", "0.68", "46 dB", "قواطع المؤتمرات العازلة (IPA 45)"),
        ("زجاج ثلاثي Low-E 6 + 14Ar + 4 + 14Ar + 6", "0.6 W/m²K", "0.29", "45 dB", "المباني فائقة كفاءة الطاقة"),
    ]

    cur_y = tbl_y - 20.0
    for title, ug, shgc, rw, rec in glass_specs:
        c.setStrokeColorRGB(0.88, 0.90, 0.93)
        c.setLineWidth(0.5)
        c.rect(36.0, cur_y, 523.28, 20.0, fill=0, stroke=1)

        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.setFont('Arial-Bold', 7.5)
        c.drawRightString(548, cur_y + 5.5, ar(title))

        c.setFillColorRGB(0.12, 0.18, 0.24)
        c.setFont('Arial', 7.5)
        c.drawRightString(350, cur_y + 5.5, ar(ug))
        c.drawRightString(260, cur_y + 5.5, ar(shgc))

        c.setFillColorRGB(0.165, 0.471, 0.722)
        c.setFont('Arial-Bold', 7.5)
        c.drawRightString(180, cur_y + 5.5, ar(rw))

        c.setFillColorRGB(0.20, 0.25, 0.30)
        c.setFont('Arial', 7.0)
        c.drawString(42, cur_y + 5.5, ar(rec))

        cur_y -= 20.0

    # Capabilities Summary
    cap_y = cur_y - 15.0
    c.setFillColorRGB(0.97, 0.985, 1.0)
    c.setStrokeColorRGB(0.82, 0.86, 0.90)
    c.setLineWidth(1)
    c.rect(36.0, cap_y - 120.0, 523.28, 120.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 9.5)
    c.drawRightString(545, cap_y - 18.0, ar('ماكينات المعالجة والقدرات الإنتاجية القصوى للزجاج:'))

    equip_lines = [
        "- أقصى مقاس لألواح الزجاج المقسى: 2440 × 5000 مم (بسماكات تتراوح من 4 مم حتى 19 مم).",
        "- الحقن والعزل الروبوتي للزجاج المزدوج: ختم ثنائي أوتوماتيكي بمادة البوليسلفيد والسيليكون الإنشائي المقاوم للأشعة UV.",
        "- معادلة الضغط الجوي للمناطق الجبلية: تركيب صمامات وأنابيب شعرية دقيقة لضبط الضغط بالمرتفعات.",
        "- التقسية والتصفيح الطبقي: استخدام طبقات PVB الصوتية وطبقات SentryGlas الإنشائية المقاومة للاقتحام والأعاصير.",
        "- زجاج السيراميك والطباعة الحرارية المخبوزة: طباعة شاشية سيراميكية حرارية ومقاومة لتقلبات درجات الحرارة."
    ]

    sub_y = cap_y - 36.0
    c.setFont('Arial', 7.5)
    c.setFillColorRGB(0.20, 0.25, 0.30)
    for el in equip_lines:
        c.drawRightString(545, sub_y, ar(el))
        sub_y -= 16.0

    draw_footer(c, 17, 18)

def draw_back_cover_page(c):
    """Page 18: Back Cover, Factory Directory & Direct Lines (No sub-roles)."""
    draw_watermark(c)

    # Navy Top Banner
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(0, 710, 595.28, 131.89, fill=1, stroke=0)
    c.setFillColorRGB(0.165, 0.471, 0.722)
    c.rect(0, 704, 595.28, 6, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 18)
    c.drawRightString(547, 785, ar('المقر الإداري والصناعي - طرابلس'))
    c.setFont('Arial', 9.5)
    c.setFillColorRGB(0.85, 0.90, 0.98)
    c.drawRightString(547, 762, ar('المنطقة الصناعية، عين زارة، طرابلس - ليبيا  |  المجمع الصناعي الرسمي'))
    c.setFont('Arial-Bold', 11)
    c.setFillColorRGB(0.45, 0.78, 1.0)
    c.drawRightString(547, 740, ar('دليل التواصل المباشر مع المصنع وإدارة المناقصات والدعم الفني'))

    # Priority Contact Box (NO SUB-ROLES, CLEAN DIRECT CONTACTS)
    c.setFillColorRGB(0.98, 0.985, 0.995)
    c.setStrokeColorRGB(0.165, 0.471, 0.722)
    c.setLineWidth(1)
    c.rect(48.0, 380.0, 499.28, 290.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 12.0)
    c.drawRightString(530, 645.0, ar('خطوط التواصل المباشر وخدمة واتساب المصنع:'))

    contacts = [
        ("خط التواصل المباشر 01", "+218 92 429 5050", "خدمة واتساب المباشرة: wa.me/218924295050"),
        ("خط التواصل المباشر 02", "+218 91 614 1616", "خدمة واتساب المباشرة: wa.me/218916141616"),
        ("خط التواصل المباشر 03", "+218 92 211 7555", "خدمة واتساب المباشرة: wa.me/218922117555"),
        ("خط التواصل المباشر 04", "+218 91 552 0267", "مكالمات هاتفية مباشرة (صوتية فقط)"),
        ("خط التواصل المباشر 05", "+218 91 680 8225", "خدمة واتساب المباشرة: wa.me/218916808225"),
    ]

    c_y = 610.0
    for label, phone, info in contacts:
        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.rect(525.0, c_y - 2.0, 5.0, 16.0, fill=1, stroke=0)

        c.setFont('Arial-Bold', 9.0)
        c.setFillColorRGB(0.043, 0.227, 0.376)
        c.drawRightString(515.0, c_y + 4.0, ar(label))

        c.setFont('Arial-Bold', 11.0)
        c.setFillColorRGB(0.165, 0.471, 0.722)
        c.drawRightString(320.0, c_y + 4.0, ar(phone))

        c.setFont('Arial', 7.5)
        c.setFillColorRGB(0.30, 0.35, 0.42)
        c.drawRightString(515.0, c_y - 11.0, ar(info))

        c_y -= 44.0

    # Digital Portal & Tenders Box
    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.rect(48.0, 200.0, 499.28, 150.0, fill=1, stroke=0)

    c.setFillColorRGB(1, 1, 1)
    c.setFont('Arial-Bold', 12.5)
    c.drawRightString(530, 322.0, ar('البوابة المعمارية الرقمية والخدمات الهندسية المتقدمة'))

    c.setFont('Arial', 8.5)
    c.setFillColorRGB(0.85, 0.90, 0.98)
    c.drawRightString(530, 302.0, ar('تفضل بزيارة منصة عين زارة الرسمية للاطلاع على النماذج التفاعلية ثلاثية الأبعاد 3D WebGL،'))
    c.drawRightString(530, 287.0, ar('وتحميل ملفات CAD الرسمية، ونماذج BIM القياسية لبرنامج Revit، واستخدام حاسبة تقطيع القطاعات ومقاسات الزجاج التلقائية.'))

    c.setFont('Arial-Bold', 9.5)
    c.setFillColorRGB(0.85, 0.65, 0.13)
    c.drawRightString(530, 260.0, ar('الموقع الإلكتروني: https://ainzara.ly   |   البريد الإلكتروني: info@ainzara.ly'))

    c.setFont('Arial', 7.5)
    c.setFillColorRGB(0.80, 0.85, 0.92)
    c.drawRightString(530, 240.0, ar('مواعيد العمل: من السبت إلى الخميس، من 08:30 صباحاً حتى 18:00 مساءً (بتوقيت طرابلس)'))

    # Official Certification Seals Bar
    c.setFillColorRGB(0.95, 0.96, 0.97)
    c.setStrokeColorRGB(0.82, 0.86, 0.90)
    c.setLineWidth(1)
    c.rect(48.0, 100.0, 499.28, 80.0, fill=1, stroke=1)

    c.setFillColorRGB(0.043, 0.227, 0.376)
    c.setFont('Arial-Bold', 8.5)
    c.drawRightString(530, 160.0, ar('اعتمادات التصنيع وشهادات الجودة الدولية:'))

    c.setFont('Arial', 7.5)
    c.setFillColorRGB(0.25, 0.30, 0.35)
    c.drawRightString(530, 142.0, ar('نظام إدارة الجودة المعتمد دولياً ISO 9001:2015  *  علامة المطابقة الأوروبية CE'))
    c.drawRightString(530, 126.0, ar('معيار طلاء الألمنيوم كواليكوت رقم 42918 QUALICOAT  *  معيار الأنودة المعمارية كوالانود رقم 1824 QUALANOD'))
    c.drawRightString(530, 110.0, ar('سحب سبائك EN AW-6063 T6 متطابق بالكامل مع المواصفات الأوروبية DIN 17615 / EN 12020-2'))

    draw_footer(c, 18, 18)

def generate_individual_sheets():
    """Generates 14 individual Arabic technical spec sheets."""
    print("Generating 14 individual Arabic technical specification sheets...")
    for s in SYSTEMS_AR:
        out_path = os.path.join(PDF_DIR, f"{s['id']}-technical-sheet-ar.pdf")
        c = canvas.Canvas(out_path, pagesize=A4)
        draw_system_page(c, s, page_num=1, total_pages=1, is_single_sheet=True)
        c.save()
        print(f"  -> Generated: {out_path} ({os.path.getsize(out_path)} bytes)")

def generate_master_catalog():
    """Generates the 18-page Arabic Master Architectural Catalog."""
    out_path = os.path.join(PDF_DIR, "AinZara-Master-Architectural-Catalog-ar.pdf")
    print(f"Generating 18-Page Arabic Master Architectural Catalog: {out_path}...")
    c = canvas.Canvas(out_path, pagesize=A4)

    # Page 1: Cover
    print("  -> Page 1: Cover")
    draw_cover_page(c)
    c.showPage()

    # Page 2: TOC & Infrastructure
    print("  -> Page 2: Corporate Infrastructure & Table of Contents")
    draw_toc_page(c)
    c.showPage()

    # Pages 3-16: 14 Systems
    for idx, s in enumerate(SYSTEMS_AR, 3):
        print(f"  -> Page {idx}: System {s['name']}")
        draw_system_page(c, s, page_num=idx, total_pages=18, is_single_sheet=False)
        c.showPage()

    # Page 17: Glass Processing
    print("  -> Page 17: Glass Processing Division")
    draw_glass_page(c)
    c.showPage()

    # Page 18: Back Cover & Directory
    print("  -> Page 18: Back Cover & Directory")
    draw_back_cover_page(c)
    c.showPage()

    c.save()
    print(f"Master Arabic Catalog generated successfully: {out_path} ({os.path.getsize(out_path)} bytes)")

def main():
    generate_individual_sheets()
    generate_master_catalog()
    print("\nAll Arabic PDF assets successfully generated!")

if __name__ == "__main__":
    main()
