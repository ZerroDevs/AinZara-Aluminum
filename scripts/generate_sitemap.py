#!/usr/bin/env python3
"""
AinZara-Aluminum - Production SEO Sitemap & Robots Crawler Automation
Generates compliant, bilingual (English & Arabic) sitemap.xml and robots.txt.

Indexes:
  1. Primary Static Architectural Pages (index, about, products, references, contact)
  2. Category Query Routes (Door-Window, Sliding, Facade, Folding-Door, Vertical-Sliding, Roof, Office)
  3. Direct Architectural Downloads (Technical Sheets PDF, AutoCAD DWG/DXF, BIM IFC)

Features:
  - Standard W3C ISO 8601 YYYY-MM-DD lastmod based on file modification timestamps
  - Bilingual xhtml:link alternate tags for Arabic (ar-LY / ar) and English (en)
  - Configurable base URL, output directories, and CLI flags
"""

import os
import sys
import argparse
from datetime import datetime, timezone
import xml.dom.minidom
from xml.etree import ElementTree as ET

# Root directory of the repository
REPO_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Default Configuration
DEFAULT_BASE_URL = "https://ainzara.ly"

# Static HTML Pages Definition
STATIC_PAGES = [
    {
        "path": "index.html",
        "route": "",
        "changefreq": "weekly",
        "priority": "1.0",
        "title_en": "AinZara Aluminum & Glass Processing - Homepage",
        "title_ar": "شركة عين زارة لمعالجة الزجاج وتصنيع الألمنيوم - الصفحة الرئيسية",
    },
    {
        "path": "products.html",
        "route": "products.html",
        "changefreq": "weekly",
        "priority": "0.9",
        "title_en": "Architectural Aluminum Systems & 3D Interactive Catalog",
        "title_ar": "الأنظمة المعمارية للألمنيوم والكتالوج التفاعلي ثلاثي الأبعاد",
    },
    {
        "path": "about.html",
        "route": "about.html",
        "changefreq": "monthly",
        "priority": "0.8",
        "title_en": "About AinZara - Tripoli Industrial Headquarters",
        "title_ar": "عن الشركة - مجمع طرابلس الصناعي",
    },
    {
        "path": "references.html",
        "route": "references.html",
        "changefreq": "monthly",
        "priority": "0.7",
        "title_en": "Project References & Landmark Architectural Installations",
        "title_ar": "المشاريع والأعمال المرجعية البارزة في ليبيا",
    },
    {
        "path": "contact.html",
        "route": "contact.html",
        "changefreq": "monthly",
        "priority": "0.8",
        "title_en": "Contact AinZara Engineering Desks & Factory Inquiries",
        "title_ar": "اتصل بنا - المكاتب الهندسية وطلبات التصنيع",
    },
]

# Architectural Category Query Routes
CATEGORY_ROUTES = [
    {"cat": "Door-Window", "name": "Doors & Windows (HEKLA Series)", "name_ar": "أبواب ونوافذ (سلسلة هيكلا)"},
    {"cat": "Sliding", "name": "Sliding Systems (ARTOS Series)", "name_ar": "أنظمة سحب وجر (سلسلة آرتوس)"},
    {"cat": "Facade", "name": "Curtain Walls & Facades (BROMO Series)", "name_ar": "واجهات زجاجية واستركشر (سلسلة برومو)"},
    {"cat": "Folding-Door", "name": "Bi-Fold Accordion Doors (NEPAL Series)", "name_ar": "أبواب مطوية فولدنج (سلسلة نيبال)"},
    {"cat": "Vertical-Sliding", "name": "Guillotine & Vertical Sliding (LOGAN Series)", "name_ar": "أنظمة جلستين وسحب رأسي (سلسلة لوجان)"},
    {"cat": "Roof", "name": "Skylights & Wintergardens (URAL Series)", "name_ar": "سكاي لايت وأسقف زجاجية (سلسلة أورال)"},
    {"cat": "Office", "name": "Office Partitions (IDA Series)", "name_ar": "فواطع وقواطع مكتبية (سلسلة إيدا)"},
]

def format_iso_date(filepath=None):
    """Returns ISO 8601 YYYY-MM-DD date string from file mtime or UTC today."""
    if filepath and os.path.exists(filepath):
        mtime = os.path.getmtime(filepath)
        dt = datetime.fromtimestamp(mtime, tz=timezone.utc)
    else:
        dt = datetime.now(timezone.utc)
    return dt.strftime("%Y-%m-%d")

def build_sitemap_xml(base_url, repo_root):
    """
    Builds the complete sitemap XML document with bilingual hreflang support.
    """
    base_url = base_url.rstrip("/")
    
    # XML Namespaces
    ns_map = {
        "": "http://www.sitemaps.org/schemas/sitemap/0.9",
        "xhtml": "http://www.w3.org/1999/xhtml",
    }
    
    urlset = ET.Element("urlset", xmlns="http://www.sitemaps.org/schemas/sitemap/0.9")
    urlset.set("xmlns:xhtml", "http://www.w3.org/1999/xhtml")
    urlset.set("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance")
    urlset.set("xsi:schemaLocation", "http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.w3.org/1999/xhtml http://www.w3.org/2002/08/xhtml/xhtml1-transitional.xsd")

    # 1. Primary Static HTML Pages
    for page in STATIC_PAGES:
        file_path = os.path.join(repo_root, page["path"])
        lastmod = format_iso_date(file_path)
        loc_url = f"{base_url}/{page['route']}" if page['route'] else f"{base_url}/"

        url_elem = ET.SubElement(urlset, "url")
        loc_elem = ET.SubElement(url_elem, "loc")
        loc_elem.text = loc_url

        # Bilingual xhtml:link alternates (Arabic default, English secondary, x-default)
        xhtml_ar = ET.SubElement(url_elem, "xhtml:link")
        xhtml_ar.set("rel", "alternate")
        xhtml_ar.set("hreflang", "ar")
        xhtml_ar.set("href", loc_url)

        xhtml_en = ET.SubElement(url_elem, "xhtml:link")
        xhtml_en.set("rel", "alternate")
        xhtml_en.set("hreflang", "en")
        xhtml_en.set("href", loc_url)

        xhtml_def = ET.SubElement(url_elem, "xhtml:link")
        xhtml_def.set("rel", "alternate")
        xhtml_def.set("hreflang", "x-default")
        xhtml_def.set("href", loc_url)

        lastmod_elem = ET.SubElement(url_elem, "lastmod")
        lastmod_elem.text = lastmod

        changefreq_elem = ET.SubElement(url_elem, "changefreq")
        changefreq_elem.text = page["changefreq"]

        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = page["priority"]

    # 2. Category Query Routes
    category_html = os.path.join(repo_root, "category.html")
    cat_lastmod = format_iso_date(category_html)
    for cat in CATEGORY_ROUTES:
        cat_url = f"{base_url}/category.html?cat={cat['cat']}"
        url_elem = ET.SubElement(urlset, "url")
        
        loc_elem = ET.SubElement(url_elem, "loc")
        loc_elem.text = cat_url

        # Bilingual alternates
        for lang in ["ar", "en", "x-default"]:
            xhtml_link = ET.SubElement(url_elem, "xhtml:link")
            xhtml_link.set("rel", "alternate")
            xhtml_link.set("hreflang", lang)
            xhtml_link.set("href", cat_url)

        lastmod_elem = ET.SubElement(url_elem, "lastmod")
        lastmod_elem.text = cat_lastmod

        changefreq_elem = ET.SubElement(url_elem, "changefreq")
        changefreq_elem.text = "weekly"

        priority_elem = ET.SubElement(url_elem, "priority")
        priority_elem.text = "0.85"

    # 3. Technical Download Assets (PDF, CAD DWG/DXF, BIM IFC)
    download_dirs = [
        ("assets/downloads/pdf", "monthly", "0.6"),
        ("assets/downloads/cad", "monthly", "0.5"),
        ("assets/downloads/bim", "monthly", "0.6"),
    ]

    for rel_dir, freq, prio in download_dirs:
        abs_dir = os.path.join(repo_root, rel_dir)
        if not os.path.exists(abs_dir):
            continue
        for fname in sorted(os.listdir(abs_dir)):
            if fname.lower().endswith((".pdf", ".dwg", ".dxf", ".ifc")):
                fpath = os.path.join(abs_dir, fname)
                file_url = f"{base_url}/{rel_dir}/{fname}"
                
                url_elem = ET.SubElement(urlset, "url")
                loc_elem = ET.SubElement(url_elem, "loc")
                loc_elem.text = file_url

                lastmod_elem = ET.SubElement(url_elem, "lastmod")
                lastmod_elem.text = format_iso_date(fpath)

                changefreq_elem = ET.SubElement(url_elem, "changefreq")
                changefreq_elem.text = freq

                priority_elem = ET.SubElement(url_elem, "priority")
                priority_elem.text = prio

    # Format pretty XML string
    raw_xml = ET.tostring(urlset, encoding="utf-8")
    dom = xml.dom.minidom.parseString(raw_xml)
    pretty_xml = dom.toprettyxml(indent="  ", encoding="UTF-8").decode("utf-8")

    # Clean empty lines produced by minidom
    cleaned_lines = [line for line in pretty_xml.splitlines() if line.strip()]
    return "\n".join(cleaned_lines) + "\n"

def build_robots_txt(base_url):
    """
    Generates production-grade robots.txt directives for web crawlers.
    """
    base_url = base_url.rstrip("/")
    domain = base_url.replace("https://", "").replace("http://", "").split("/")[0]

    lines = [
        f"# robots.txt for AinZara Aluminum & Glass Processing",
        f"# Headquarters & Factory: Tripoli Industrial Complex, Libya",
        f"# Contact: info@ainzara.ly | +218 92 429 5050",
        f"# Generated: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}",
        "",
        "User-agent: *",
        "Allow: /",
        "",
        "# Architectural Downloads & Public Technical Assets",
        "Allow: /assets/downloads/pdf/",
        "Allow: /assets/downloads/cad/",
        "Allow: /assets/downloads/bim/",
        "Allow: /assets/Images/",
        "Allow: /assets/Door-Window/",
        "Allow: /assets/Sliding/",
        "Allow: /assets/Facade/",
        "Allow: /assets/Folding-Door/",
        "Allow: /assets/Vertical-Sliding/",
        "Allow: /assets/Roof/",
        "Allow: /assets/Office/",
        "",
        "# Private scripts or backend utilities",
        "Disallow: /tools/",
        "Disallow: /scripts/",
        "",
        "# Crawl Optimization",
        "Crawl-delay: 1",
        "",
        f"# Canonical Host & XML Sitemap Location",
        f"Host: {domain}",
        f"Sitemap: {base_url}/sitemap.xml",
    ]
    return "\n".join(lines) + "\n"

def main():
    parser = argparse.ArgumentParser(
        description="AinZara-Aluminum - Automated Production Sitemap & Robots Generator"
    )
    parser.add_argument(
        "--base-url",
        default=DEFAULT_BASE_URL,
        help=f"Canonical website base URL (default: {DEFAULT_BASE_URL})"
    )
    parser.add_argument(
        "--out-dir",
        default=REPO_ROOT,
        help="Target directory to write sitemap.xml and robots.txt (default: repo root)"
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="Run without writing files, displaying discovered URLs"
    )

    args = parser.parse_args()

    xml_content = build_sitemap_xml(args.base_url, REPO_ROOT)
    robots_content = build_robots_txt(args.base_url)

    # Count entries
    url_count = xml_content.count("<url>")

    if args.check:
        print(f"[CHECK MODE] Discovered {url_count} URLs across AinZara systems.")
        print(f"Sample Sitemap (first 25 lines):")
        for line in xml_content.splitlines()[:25]:
            print(f"  {line}")
        print("\nRobots.txt Content:")
        print(robots_content)
        return 0

    sitemap_path = os.path.join(args.out_dir, "sitemap.xml")
    robots_path = os.path.join(args.out_dir, "robots.txt")

    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.write(xml_content)

    with open(robots_path, "w", encoding="utf-8") as f:
        f.write(robots_content)

    print(f"Successfully generated AinZara SEO Assets:")
    print(f"  - Sitemap: {sitemap_path} ({url_count} URLs, {os.path.getsize(sitemap_path):,} bytes)")
    print(f"  - Robots:  {robots_path} ({os.path.getsize(robots_path):,} bytes)")
    return 0

if __name__ == "__main__":
    sys.exit(main())
