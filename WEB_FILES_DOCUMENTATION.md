# Web Files Documentation - nickanderson.us

**Generated:** 2025-11-15
**Purpose:** Complete inventory and documentation of all web files for agent usage

---

## 1. OVERVIEW

This is a personal website for Nick Anderson built using **R Markdown** and compiled to static HTML. The site uses Bootstrap 3.3.5 for styling and jQuery for interactivity.

**Live Domain:** nickanderson.us (via CNAME file)
**Build System:** R Markdown → HTML compilation
**Output Directory:** `/docs` (GitHub Pages compatible)

---

## 2. SITE STRUCTURE

### 2.1 Navigation Structure
The site has 5 main pages defined in `_site.yml`:

1. **Home & General** (`index.html`) - Landing page with project overview
2. **Economic History** (`economichistory.html`) - Academic papers and economic history content
3. **Data** (`data.html`) - Data-related content
4. **About** (`about.html`) - Personal information
5. **Contact** (`contact.html`) - Contact information

### 2.2 Color Scheme
- **Primary navbar background:** `#640000` (dark red/maroon)
- **Active link background:** `#006400` (dark green)
- **Text on navbar:** White

---

## 3. SOURCE FILES (Root Directory)

### 3.1 R Markdown Source Files (.Rmd)
These files are compiled into HTML:

| File | Purpose | Output |
|------|---------|--------|
| `index.Rmd` | Homepage with project listings | `docs/index.html` |
| `economichistory.Rmd` | Economic history page (77KB - largest source file) | `docs/economichistory.html` |
| `data.Rmd` | Data projects page | `docs/data.html` |
| `about.Rmd` | About page | `docs/about.html` |
| `contact.Rmd` | Contact information | `docs/contact.html` |

### 3.2 Configuration Files

**`_site.yml`** (352 bytes)
```yaml
name: "Nick Anderson"
navbar:
  title: "Nick Anderson"
  left:
    - text: "Home & General"
      href: index.html
    - text: "Economic History"
      href: economichistory.html
    - text: "Data"
      href: data.html
    - text: "About"
      href: about.html
    - text: "Contact"
      href: contact.html

output_dir: "docs"
```

**`CNAME`** - Domain configuration for GitHub Pages
```
nickanderson.us
```

**`.gitignore`** - Git exclusions

**`nickanderson.Rproj`** - RStudio project file

---

## 4. GENERATED OUTPUT FILES (/docs)

### 4.1 Main HTML Pages

| File | Description | Generated From |
|------|-------------|----------------|
| `docs/index.html` | Homepage | `index.Rmd` |
| `docs/economichistory.html` | Economic history content | `economichistory.Rmd` |
| `docs/data.html` | Data page | `data.Rmd` |
| `docs/about.html` | About page | `about.Rmd` |
| `docs/contact.html` | Contact page | `contact.Rmd` |

### 4.2 HTML Structure
All pages include:
- Bootstrap 3.3.5 responsive layout
- Fixed top navigation bar
- jQuery 3.6.0
- Syntax highlighting (highlight.js 9.12.0)
- MathJax for mathematical notation
- Custom CSS for branding

---

## 5. JAVASCRIPT LIBRARIES (/docs/site_libs)

### 5.1 Core JavaScript Files

**jQuery (3.6.0)**
- `site_libs/jquery-3.6.0/jquery-3.6.0.js` (unminified)
- `site_libs/jquery-3.6.0/jquery-3.6.0.min.js` (minified)

**jQuery UI (1.13.2)**
- `site_libs/jqueryui-1.13.2/jquery-ui.js`
- `site_libs/jqueryui-1.13.2/jquery-ui.min.js`

**Bootstrap (3.3.5)**
- `site_libs/bootstrap-3.3.5/js/bootstrap.js`
- `site_libs/bootstrap-3.3.5/js/bootstrap.min.js`
- `site_libs/bootstrap-3.3.5/js/npm.js`
- `site_libs/bootstrap-3.3.5/shim/html5shiv.min.js` (IE8 support)
- `site_libs/bootstrap-3.3.5/shim/respond.min.js` (IE8 support)

**Highlight.js (9.12.0)** - Syntax highlighting
- `site_libs/highlightjs-9.12.0/highlight.js`

**Navigation & UI**
- `site_libs/navigation-1.1/codefolding.js` - Code folding functionality
- `site_libs/navigation-1.1/tabsets.js` - Tab navigation
- `site_libs/navigation-1.1/sourceembed.js` - Source embedding
- `site_libs/tocify-1.9.1/jquery.tocify.js` - Table of contents

**Header Attributes**
- `site_libs/header-attrs-2.28/header-attrs.js`
- `site_libs/header-attrs-2.29/header-attrs.js`

### 5.2 jQuery UI Index
- `site_libs/jqueryui-1.13.2/index.html`

---

## 6. CSS STYLESHEETS (/docs/site_libs)

### 6.1 Bootstrap CSS (3.3.5)

**Core Bootstrap:**
- `bootstrap-3.3.5/css/bootstrap.css` (full)
- `bootstrap-3.3.5/css/bootstrap.min.css` (minified)
- `bootstrap-3.3.5/css/bootstrap-theme.css` (theme)
- `bootstrap-3.3.5/css/bootstrap-theme.min.css` (theme minified)

**Bootstrap Themes (Bootswatch):**
All minified, located in `bootstrap-3.3.5/css/`:
- `cerulean.min.css`
- `cosmo.min.css`
- `darkly.min.css`
- `flatly.min.css`
- `journal.min.css`
- `lumen.min.css`
- `paper.min.css`
- `readable.min.css`
- `sandstone.min.css`
- `simplex.min.css`
- `spacelab.min.css`
- `united.min.css`
- `yeti.min.css`

### 6.2 jQuery UI CSS (1.13.2)
Located in `jqueryui-1.13.2/`:
- `jquery-ui.css` (full)
- `jquery-ui.min.css` (minified)
- `jquery-ui.structure.css` (structure only)
- `jquery-ui.structure.min.css`
- `jquery-ui.theme.css` (theme only)
- `jquery-ui.theme.min.css`

### 6.3 Other CSS
- `highlightjs-9.12.0/default.css` - Default syntax highlighting theme
- `highlightjs-9.12.0/textmate.css` - TextMate syntax highlighting theme
- `navigation-1.1/codefolding-lua.css` - Code folding styles
- `tocify-1.9.1/jquery.tocify.css` - Table of contents styles

### 6.4 Custom CSS (Inline in HTML)
Each page includes custom CSS for:
- Hiding default title display
- Navbar color customization (#640000 maroon background)
- White text on navigation
- Active link styling (#006400 green)
- Font weights for navigation items

---

## 7. IMAGES & GRAPHICS

### 7.1 Content Images

**Root Directory Images (duplicated in /docs):**
- `DaPF-F2.jpg` (37KB) - Figure 2
- `DaPF-F4.jpg` (47KB) - Figure 4
- `DaPF-F6.jpg` (60KB) - Figure 6

**Generated Economic History Figures:**
Located in both:
- `/economichistory_files/figure-html/` (source)
- `/docs/economichistory_files/figure-html/` (deployed)

**Treasury Figures (18 total):**
- `7. Treasury-1.png` through `18. Treasury-1.png`

**Unnamed Chunks (10 figures):**
- `unnamed-chunk-1-1.png` through `unnamed-chunk-10-1.png`

### 7.2 UI Icons & Graphics

**jQuery UI Icons:**
Located in `docs/site_libs/jqueryui-1.13.2/images/`:
- `ui-icons_444444_256x240.png`
- `ui-icons_555555_256x240.png`
- `ui-icons_777620_256x240.png`
- `ui-icons_777777_256x240.png`
- `ui-icons_cc0000_256x240.png`
- `ui-icons_ffffff_256x240.png`

**Bootstrap Glyphicons:**
- `bootstrap-3.3.5/fonts/glyphicons-halflings-regular.svg`

---

## 8. WEB FONTS

All located in `docs/site_libs/bootstrap-3.3.5/css/fonts/`:

### 8.1 Font Families Available

**Open Sans:**
- `OpenSans.ttf`
- `OpenSansBold.ttf`
- `OpenSansLight.ttf`
- `OpenSansItalic.ttf`
- `OpenSansBoldItalic.ttf`
- `OpenSansLightItalic.ttf`

**Lato:**
- `Lato.ttf`
- `LatoBold.ttf`
- `LatoItalic.ttf`

**Roboto:**
- `Roboto.ttf`
- `RobotoBold.ttf`
- `RobotoLight.ttf`
- `RobotoMedium.ttf`

**Source Sans Pro:**
- `SourceSansPro.ttf`
- `SourceSansProBold.ttf`
- `SourceSansProLight.ttf`
- `SourceSansProItalic.ttf`

**Other Fonts:**
- `Ubuntu.ttf`
- `NewsCycleBold.ttf`
- `RalewayBold.ttf`

---

## 9. CACHED DATA & BUILD ARTIFACTS

### 9.1 R Markdown Cache
- `/economichistory_cache/` - Cached R computations for performance

### 9.2 Figure Output Directories
- `/economichistory_files/` - Source figures
- `/docs/economichistory_files/` - Deployed figures

---

## 10. DEPLOYMENT STRUCTURE

```
nickanderson.us/
├── CNAME                    # Domain configuration
├── _site.yml                # Site configuration
├── *.Rmd                    # Source R Markdown files
├── DaPF-*.jpg              # Content images
├── economichistory_cache/   # Build cache
├── economichistory_files/   # Generated figures
└── docs/                    # DEPLOYED WEBSITE (GitHub Pages)
    ├── *.html              # Generated HTML pages
    ├── DaPF-*.jpg          # Content images (copied)
    ├── economichistory_files/  # Figures (copied)
    └── site_libs/          # All web dependencies
        ├── bootstrap-3.3.5/
        │   ├── css/
        │   │   ├── *.css
        │   │   └── fonts/*.ttf
        │   ├── js/
        │   └── shim/
        ├── jquery-3.6.0/
        ├── jqueryui-1.13.2/
        ├── highlightjs-9.12.0/
        ├── navigation-1.1/
        ├── header-attrs-*/
        └── tocify-1.9.1/
```

---

## 11. EXTERNAL DEPENDENCIES

### 11.1 External Resources
- **MathJax CDN:** `https://mathjax.rstudio.com/latest/MathJax.js?config=TeX-AMS-MML_HTMLorMML`

### 11.2 External Links in Content
- Google Drive folders (manuscripts and code)
- Shiny application: `https://andenick.shinyapps.io/HMDAExplore/`

---

## 12. FILE COUNT SUMMARY

| Category | Count |
|----------|-------|
| HTML Pages | 6 (5 main + 1 jQuery UI index) |
| R Markdown Sources | 5 |
| CSS Files | 26 |
| JavaScript Files | 17 |
| Image Files (PNG/JPG) | 64+ |
| Web Fonts (TTF) | 20 |
| Configuration Files | 4 |

**Total Web Assets:** ~140+ files

---

## 13. TECHNOLOGY STACK

| Technology | Version | Purpose |
|------------|---------|---------|
| R Markdown | - | Source format |
| Bootstrap | 3.3.5 | CSS framework |
| jQuery | 3.6.0 | JavaScript library |
| jQuery UI | 1.13.2 | UI components |
| Highlight.js | 9.12.0 | Syntax highlighting |
| Tocify | 1.9.1 | Table of contents |
| MathJax | Latest | Mathematical notation |

---

## 14. BUILD PROCESS

1. **Source:** Edit `.Rmd` files in root directory
2. **Configuration:** `_site.yml` defines structure
3. **Compile:** R Markdown renders to HTML
4. **Output:** Generated files placed in `/docs`
5. **Deploy:** `/docs` directory served by GitHub Pages
6. **Domain:** CNAME file points to nickanderson.us

---

## 15. AGENT USAGE NOTES

### 15.1 Modifying Content
- Edit `.Rmd` files in root directory, NOT HTML files in /docs
- After editing .Rmd, must recompile to regenerate /docs HTML
- Custom styling in inline `<style>` blocks within .Rmd files

### 15.2 Adding Pages
1. Create new `.Rmd` file in root
2. Add entry to `_site.yml` navbar configuration
3. Recompile site to generate HTML

### 15.3 Styling Changes
- Bootstrap theme can be changed via different CSS imports
- Custom colors defined in inline CSS in each .Rmd
- Navbar colors: `#640000` (main), `#006400` (active)

### 15.4 Key Files for Modification
- **Site structure:** `_site.yml`
- **Homepage:** `index.Rmd`
- **Main content:** `economichistory.Rmd` (largest page)
- **Styling:** Inline CSS in each .Rmd file

### 15.5 DO NOT Modify
- Files in `/docs/site_libs/` (dependencies)
- Cached files in `economichistory_cache/`
- Generated HTML directly (edit .Rmd instead)

---

## 16. RESPONSIVE DESIGN

- Bootstrap 3.3.5 provides mobile-first responsive layout
- Viewport meta tag ensures proper mobile rendering
- Fixed navbar with collapse menu for mobile
- Max container width: 940px

---

## 17. BROWSER COMPATIBILITY

- Modern browsers fully supported
- IE8+ support via html5shiv and respond.js shims
- Progressive enhancement approach

---

**End of Documentation**
