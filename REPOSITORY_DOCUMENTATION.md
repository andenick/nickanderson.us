# Repository Documentation: nickanderson.us

**Last Updated:** 2025-11-16
**Repository:** https://github.com/andenick/nickanderson.us
**Live Site:** https://www.nickanderson.us

## Table of Contents

1. [Overview](#overview)
2. [Project Type and Purpose](#project-type-and-purpose)
3. [Repository Structure](#repository-structure)
4. [Configuration Files](#configuration-files)
5. [Content Files](#content-files)
6. [Technologies and Frameworks](#technologies-and-frameworks)
7. [Build System](#build-system)
8. [Data and Assets](#data-and-assets)
9. [Deployment](#deployment)
10. [Development Workflow](#development-workflow)
11. [Dependencies](#dependencies)
12. [Known Issues and Limitations](#known-issues-and-limitations)

---

## Overview

This repository hosts the personal academic website for Nick Anderson, a Ph.D. student at the New School for Social Research. The site is built using R Markdown and showcases economic research papers focusing on public finance, taxation, and balance of payments analysis.

**Key Facts:**
- **Type:** R Markdown-based static academic website
- **Hosting:** GitHub Pages with custom domain
- **Primary Language:** R
- **Build Tool:** RStudio's R Markdown site generator
- **Framework:** Bootstrap 3.3.5

---

## Project Type and Purpose

This is an **academic portfolio and research showcase website** that serves to:

- Present economic research papers with data visualizations
- Share research datasets via Google Drive links
- Provide professional contact information
- Demonstrate proficiency in R programming and statistical analysis
- Host a Shiny application for HMDA (Home Mortgage Disclosure Act) data exploration

**Research Focus Areas:**
1. Duration and Public Finance (U.S. Treasury Market Analysis 2001-2023)
2. Tax Revenue Cyclicality (Historical Analysis 1800-2020)
3. Balance of Payments History (U.S. vs. Germany comparison)

---

## Repository Structure

```
/home/user/nickanderson.us/
├── Source Files (Root Directory)
│   ├── index.Rmd                    # Homepage
│   ├── economichistory.Rmd          # Main research papers (1,430 lines)
│   ├── data.Rmd                     # Data links page
│   ├── about.Rmd                    # Personal introduction
│   ├── contact.Rmd                  # Contact information
│   ├── _site.yml                    # Site configuration
│   ├── CNAME                        # Custom domain configuration
│   ├── nickanderson.Rproj           # RStudio project file
│   ├── .gitignore                   # Git ignore rules
│   ├── DaPF-F2.jpg                  # Figure 2: Treasury Monthly Issuance
│   ├── DaPF-F4.jpg                  # Figure 4: Duration Calculation Example
│   └── DaPF-F6.jpg                  # Figure 6: Duration Approximation
│
├── docs/ (Build Output - GitHub Pages Deployment Directory)
│   ├── *.html                       # Compiled HTML pages
│   ├── site_libs/                   # JavaScript/CSS libraries
│   │   ├── bootstrap-3.3.5/         # Bootstrap framework
│   │   ├── jquery-3.6.0/            # jQuery library
│   │   ├── jqueryui-1.13.2/         # jQuery UI
│   │   ├── navigation-1.1/          # Navigation component
│   │   ├── highlightjs-9.12.0/      # Code syntax highlighting
│   │   ├── tocify-1.9.1/            # Table of contents
│   │   └── header-attrs-*/          # R Markdown header attributes
│   ├── economichistory_files/       # Generated figures
│   ├── *.jpg                        # Copied static images
│   └── CNAME                        # Custom domain (copied)
│
├── economichistory_cache/ (R Knitr Cache - 421MB)
│   └── html/                        # Cached R chunk results
│       └── *.RData, *.rdb, *.rdx    # 100+ cached chunk files
│
└── economichistory_files/ (Generated Figures)
    └── figure-html/                 # 21 PNG visualization files
        ├── 10. Treasury-1.png
        ├── 11. Treasury-1.png
        └── ... (19 more PNG files)
```

### Directory Purposes

- **Root Directory:** Source R Markdown files and static assets
- **docs/:** Build output directory served by GitHub Pages
- **economichistory_cache/:** Knitr cache for faster rebuilds (421MB)
- **economichistory_files/:** Generated figures from R code execution

---

## Configuration Files

### _site.yml

**Location:** `/home/user/nickanderson.us/_site.yml`
**Purpose:** Main website configuration

**Key Settings:**
```yaml
name: "Nick Anderson"
output_dir: "docs"  # GitHub Pages deployment directory
navbar:
  title: "Nick Anderson"
  left:
    - text: "Home"
      href: index.html
    - text: "Economic History"
      href: economichistory.html
    - text: "Data"
      href: data.html
    - text: "About"
      href: about.html
    - text: "Contact"
      href: contact.html
output:
  html_document:
    theme: cosmo
    highlight: textmate
```

**Navigation Structure:**
1. Home (`index.html`)
2. Economic History (`economichistory.html`)
3. Data (`data.html`)
4. About (`about.html`)
5. Contact (`contact.html`)

### CNAME

**Location:** `/home/user/nickanderson.us/CNAME`
**Purpose:** GitHub Pages custom domain configuration

**Content:** `www.nickanderson.us`

### nickanderson.Rproj

**Location:** `/home/user/nickanderson.us/nickanderson.Rproj`
**Purpose:** RStudio project configuration

**Key Settings:**
- Build Type: Website
- Website Build Tool: knitr
- Auto-save workspace: Default
- Line ending conversion: POSIX

### .gitignore

**Location:** `/home/user/nickanderson.us/.gitignore`
**Purpose:** Git version control exclusions

**Ignored Files:**
- `.Rproj.user` - RStudio user settings
- `.Rhistory` - R command history
- `.RData` - R workspace
- `.Ruserdata` - R user data

**Note:** The cache directory (`economichistory_cache/`) is NOT ignored and takes up 421MB.

---

## Content Files

### 1. index.Rmd (Homepage)

**Location:** `/home/user/nickanderson.us/index.Rmd`
**Lines:** 99
**Purpose:** Website landing page

**Content:**
- Welcome message introducing research projects
- Link to "Economics at the New School" manuscript (Google Drive)
- Link to HMDA Explore Shiny Application
- Custom CSS styling

**CSS Customization:**
```css
.navbar-default {
    background-color: #640000 !important;  /* Maroon */
}
.navbar-default .navbar-nav > .active > a {
    background-color: #006400 !important;  /* Green */
}
```

### 2. economichistory.Rmd (Main Research Content)

**Location:** `/home/user/nickanderson.us/economichistory.Rmd`
**Lines:** 1,430
**Purpose:** Research papers and analysis

**Contains THREE Major Research Papers:**

#### a. Duration and Public Finance (2023.05.19)
- **Topic:** U.S. Treasury Market Analysis 2001-2023
- **Focus:** Bond duration calculations and interest rate risk
- **Data Period:** June 2001 - March 2023
- **Visualizations:** Multiple time series charts
- **Key Metrics:**
  - Monthly Treasury issuance patterns
  - Duration calculations (Macaulay and Modified)
  - Interest rate sensitivity analysis
  - Historical trends in debt composition

#### b. Tax Revenue Cyclicality (2022.01.07)
- **Topic:** Historical tax revenue correlation with economic cycles
- **Data Period:** 1800-2020
- **Analysis:** Correlation studies between tax revenue and GDP/economic indicators
- **Visualizations:** ggplot2 correlation graphs
- **Focus:** Understanding tax revenue volatility over time

#### c. Balance of Payments History (2024.12.05)
- **Topic:** Comparing U.S. and German balance of payments
- **Status:** ⚠️ NOT FULLY WRITTEN
- **Data:** Historical BoP data for comparative analysis
- **Purpose:** Cross-country comparison of external accounts

**R Code Characteristics:**
- Heavy use of `tidyverse` for data manipulation
- Extensive `ggplot2` visualizations
- Custom color schemes (maroon and green)
- Professional chart formatting
- Data wrangling with `readxl`, `tidyr`, `stringr`

### 3. data.Rmd (Data Repository)

**Location:** `/home/user/nickanderson.us/data.Rmd`
**Lines:** 54
**Purpose:** Links to research datasets

**Content:**
- Google Drive links to research data folders
- Duration and Public Finance datasets
- Tax Revenue Cyclicality datasets
- Organized by research paper

### 4. about.Rmd (Personal Information)

**Location:** `/home/user/nickanderson.us/about.Rmd`
**Lines:** 61
**Purpose:** Personal and academic introduction

**Content:**
- Ph.D. student at New School for Social Research
- Academic background
- Research interests

### 5. contact.Rmd (Contact Information)

**Location:** `/home/user/nickanderson.us/contact.Rmd`
**Lines:** 50
**Purpose:** Contact details

**Content:**
- Email: nickawebbox@gmail.com
- Contact form or additional information

---

## Technologies and Frameworks

### Core Technologies

#### R Ecosystem
- **R** - Statistical computing and graphics engine
- **R Markdown** - Literate programming and document generation
- **knitr** - Dynamic report generation from R code
- **RStudio** - Integrated development environment

#### R Packages Used

**Data Manipulation:**
- `tidyverse` - Comprehensive data science toolkit
- `tidyr` - Data tidying and reshaping
- `stringr` - String manipulation

**Data Visualization:**
- `ggplot2` - Grammar of graphics plotting (extensively used)
- `scales` - Scale functions for visualizations

**Data Import:**
- `readxl` - Excel file reading

**Presentation:**
- `formattable` - Table formatting for HTML output

### Frontend Technologies

**CSS Framework:**
- **Bootstrap 3.3.5** - Responsive design framework
  - Grid system
  - Navigation components
  - Glyphicons icon set

**JavaScript Libraries:**
- **jQuery 3.6.0** - DOM manipulation and AJAX
- **jQuery UI 1.13.2** - User interface interactions
- **Highlight.js 9.12.0** - Syntax highlighting for code blocks
- **Tocify 1.9.1** - Automatic table of contents generation
- **Navigation 1.1** - R Markdown site navigation

**R Markdown Components:**
- **header-attrs** (versions 2.28 and 2.29) - Header attribute handling

### Hosting
- **GitHub Pages** - Static site hosting
- **Custom Domain** - www.nickanderson.us

---

## Build System

### R Markdown Site Generator

**Build Process:**
1. RStudio detects `.Rproj` file with Website build type
2. User clicks "Build Website" or runs `rmarkdown::render_site()`
3. All `.Rmd` files are rendered to HTML
4. R code chunks are executed
5. Figures are generated and saved
6. Output is placed in `docs/` directory

**Build Command:**
```r
rmarkdown::render_site(encoding = 'UTF-8')
```

**Build Configuration:**
- Input: All `.Rmd` files in root directory
- Output: `docs/` directory (configured in `_site.yml`)
- Theme: Cosmo (Bootstrap-based)
- Syntax Highlighting: Textmate

### Knitr Caching System

**Purpose:** Speed up rebuilds by caching R chunk results

**Cache Location:** `/home/user/nickanderson.us/economichistory_cache/html/`

**Cache Size:** 421MB (substantial)

**Cache Files:**
- `.RData` - R objects from chunk execution
- `.rdb` - Database of cached results
- `.rdx` - Index for cached database
- 100+ cached chunk files

**Behavior:**
- Only re-runs R chunks when code changes
- Dramatically speeds up incremental builds
- Can be cleared to force full rebuild

### Generated Outputs

**HTML Files:** `docs/*.html`
- index.html
- economichistory.html
- data.html
- about.html
- contact.html

**Figure Files:** `docs/economichistory_files/figure-html/*.png`
- 21 PNG visualization files
- Sizes range from ~24KB to ~39KB
- Named by R chunk labels

**Supporting Files:**
- `site_libs/` - JavaScript and CSS libraries
- Static images (JPG files copied from root)
- CNAME file (copied for GitHub Pages)

---

## Data and Assets

### Image Assets

#### Static Images (Root Directory)

**DaPF-F2.jpg**
- **Size:** 37KB
- **Dimensions:** 582x388px
- **Content:** Figure 2 - U.S. Treasury Monthly Issuance
- **Used In:** Duration and Public Finance paper

**DaPF-F4.jpg**
- **Size:** 47KB
- **Dimensions:** 796x272px
- **Content:** Figure 4 - Example Duration Calculation
- **Used In:** Duration and Public Finance paper

**DaPF-F6.jpg**
- **Size:** 60KB
- **Dimensions:** 613x332px
- **Content:** Figure 6 - Duration Approximation Comparison
- **Used In:** Duration and Public Finance paper

#### Generated Figures (21 PNG Files)

**Location:** `economichistory_files/figure-html/`

**Treasury Analysis Charts:**
- `10. Treasury-1.png` through `18. Treasury-1.png`
- Time series visualizations
- Duration calculations
- Issuance patterns

**Tax Revenue Correlation Graphs:**
- `unnamed-chunk-1-1.png` through `unnamed-chunk-10-1.png`
- Correlation plots
- Historical trends
- Cyclicality analysis

**Characteristics:**
- All PNG format
- Sizes: ~24KB to ~39KB each
- Generated by ggplot2
- High-quality visualizations

### Data Sources (Referenced)

**⚠️ IMPORTANT:** Data files are NOT included in the repository. They are referenced via local file paths.

**Referenced Data Files:**

**Excel Files (E: drive paths):**
- `looptest-graph1.xlsx` - Treasury market data
- `det_data_mkt_fix_graph1.xlsx` - Detailed market fixed income data
- `IncomeTaxData_NA.xlsx` - Historical tax revenue data

**CSV Files (E: drive paths):**
- `GERdata_annual_pct.csv` - German balance of payments data
- `USdata_annual_pct.csv` - U.S. balance of payments data

**Data Locations in Code:**
```r
# Example from economichistory.Rmd
read_excel("E:\\Storage\\Cloud Drive\\OneDrive\\NSSR-PhD\\looptest-graph1.xlsx")
```

**Implication:** The website cannot be fully rebuilt from the repository alone without access to these external data files.

---

## Deployment

### GitHub Pages Configuration

**Hosting Service:** GitHub Pages
**Source Branch:** Main branch (or current branch)
**Source Directory:** `/docs`
**Custom Domain:** www.nickanderson.us

**GitHub Pages Settings:**
- Serves static HTML from `docs/` directory
- CNAME file configures custom domain
- Automatic HTTPS via GitHub

### Deployment Workflow

1. **Local Development:**
   - Author edits `.Rmd` files in RStudio
   - Preview changes locally

2. **Build:**
   - Click "Build Website" in RStudio
   - R Markdown renders all `.Rmd` files to HTML
   - Output goes to `docs/` directory

3. **Version Control:**
   - Git add changed files
   - Git commit with descriptive message
   - Git push to GitHub

4. **Automatic Deployment:**
   - GitHub detects changes to `docs/`
   - GitHub Pages automatically updates live site
   - Changes appear at www.nickanderson.us within minutes

### DNS Configuration

**Custom Domain Setup:**
- Domain: www.nickanderson.us
- DNS provider must point to GitHub Pages servers
- CNAME file in repository root and `docs/` directory
- GitHub handles HTTPS certificate

---

## Development Workflow

### Standard Development Process

1. **Open Project:**
   ```r
   # Open nickanderson.Rproj in RStudio
   ```

2. **Edit Content:**
   - Modify `.Rmd` files
   - Add/update R code chunks
   - Update narrative text

3. **Local Preview:**
   - Build website to see changes
   - Check HTML output in `docs/`
   - Review visualizations

4. **Test Locally:**
   - Open `docs/index.html` in browser
   - Navigate between pages
   - Verify links and images

5. **Commit and Push:**
   ```bash
   git add .
   git commit -m "Descriptive message"
   git push origin branch-name
   ```

6. **Verify Deployment:**
   - Visit www.nickanderson.us
   - Confirm changes are live

### R Markdown Authoring

**Chunk Options Used:**
```r
{r chunk-name, echo=FALSE, message=FALSE, warning=FALSE}
# R code here
```

**Common Patterns:**
- `echo=FALSE` - Hide code, show output
- `message=FALSE` - Suppress package messages
- `warning=FALSE` - Suppress warnings
- `fig.width`, `fig.height` - Control figure dimensions

**Styling:**
- Custom CSS in YAML header
- Consistent color scheme (maroon #640000, green #006400)
- Hidden page titles using CSS

### Git Workflow

**Current Branch:** `claude/document-repo-contents-01Frgpw7yuep8tS22jw9LfNa`

**Recent Commits:**
- `fc2e121` - moved bop
- `046ead7` - rearranged index
- `cc295e0` - Considerable Edits
- `778c6e9` - Update Data move
- `597b053` - Updated Figures

**Git Status:** Clean (no uncommitted changes)

---

## Dependencies

### R Package Dependencies

**Required Packages:**
```r
library(tidyverse)    # Data manipulation and visualization
library(ggplot2)      # Advanced plotting
library(readxl)       # Excel file import
library(formattable)  # Table formatting
library(scales)       # Scaling functions
library(tidyr)        # Data tidying
library(stringr)      # String operations
```

**Installation:**
```r
install.packages(c("tidyverse", "ggplot2", "readxl",
                   "formattable", "scales", "tidyr", "stringr"))
```

### System Dependencies

**Required Software:**
- R (version 4.0+ recommended)
- RStudio (latest version)
- Git (for version control)
- Pandoc (usually included with RStudio)

**Optional:**
- LaTeX (if generating PDFs)

### External Data Dependencies

**⚠️ CRITICAL:** The following external data files are required for full rebuild:

**Not in Repository:**
- `looptest-graph1.xlsx`
- `det_data_mkt_fix_graph1.xlsx`
- `IncomeTaxData_NA.xlsx`
- `GERdata_annual_pct.csv`
- `USdata_annual_pct.csv`

**Impact:** Without these files, the R code in `economichistory.Rmd` will fail to execute during build.

---

## Known Issues and Limitations

### 1. External Data Dependencies

**Issue:** Data files are referenced via local file paths (E: drive) and are not in the repository.

**Impact:**
- Cannot rebuild site from scratch without access to data files
- Collaborators cannot reproduce the analysis
- Breaks reproducibility principle

**Recommendation:**
- Add data files to repository (if not too large)
- Store data in Google Drive and read directly from URLs
- Document data sources and provide download instructions

### 2. Large Cache Directory

**Issue:** `economichistory_cache/` is 421MB and tracked in Git.

**Impact:**
- Increases repository size
- Slows down clone and pull operations
- Cache files are user-specific and don't need versioning

**Recommendation:**
- Add `economichistory_cache/` to `.gitignore`
- Add `economichistory_files/` to `.gitignore` (generated content)
- Document that users need to build locally to generate cache

### 3. Incomplete Research Paper

**Issue:** Balance of Payments paper (2024.12.05) is marked as "NOT FULLY WRITTEN"

**Status:** Work in progress

**Location:** `economichistory.Rmd` (third major paper section)

### 4. Hardcoded File Paths

**Issue:** Windows-specific file paths (E:\Storage\...) in R code.

**Impact:**
- Code won't run on macOS or Linux without modification
- Not portable across different environments

**Recommendation:**
- Use relative paths
- Use `here::here()` package for cross-platform paths
- Store data in repository or use URLs

### 5. Missing Documentation

**Issue:** No README.md file explaining repository purpose and setup.

**Impact:**
- New users/collaborators don't know how to get started
- Purpose of repository not immediately clear

**Recommendation:**
- Add comprehensive README.md
- Include setup instructions
- Document build process

### 6. Bootstrap Version

**Issue:** Using Bootstrap 3.3.5 (released 2015, no longer maintained).

**Impact:**
- Missing modern CSS features
- Potential security issues (though minimal for static site)
- Not responsive to modern devices

**Recommendation:**
- Consider upgrading to Bootstrap 4 or 5
- Or use modern R Markdown themes that use updated frameworks

---

## Repository Statistics

**Total Size:** ~427MB
- Source files: ~250KB
- Built output (docs/): ~6MB
- Cache (economichistory_cache/): ~421MB

**File Counts:**
- R Markdown files: 5
- Configuration files: 3
- Static images: 3
- Generated figures: 21
- HTML output files: 5
- Cached R chunks: 100+

**Code Statistics (economichistory.Rmd):**
- Total lines: 1,430
- R code chunks: ~50+
- Visualizations: 21 figures
- Research papers: 3

---

## Quick Start Guide

### For New Collaborators

1. **Clone Repository:**
   ```bash
   git clone https://github.com/andenick/nickanderson.us.git
   cd nickanderson.us
   ```

2. **Open in RStudio:**
   - Double-click `nickanderson.Rproj`
   - RStudio will open with proper configuration

3. **Install Dependencies:**
   ```r
   install.packages(c("tidyverse", "ggplot2", "readxl",
                      "formattable", "scales", "tidyr", "stringr"))
   ```

4. **Build Website:**
   - Click "Build" tab in RStudio
   - Click "Build Website"
   - View output in `docs/` directory

5. **View Locally:**
   - Open `docs/index.html` in web browser

### For Content Updates

1. Edit relevant `.Rmd` file
2. Build website
3. Review changes locally
4. Commit and push to GitHub
5. Changes deploy automatically to www.nickanderson.us

---

## Contact and Support

**Repository Owner:** Nick Anderson
**Email:** nickawebbox@gmail.com
**Website:** https://www.nickanderson.us

**For Technical Issues:**
- Check this documentation
- Review R Markdown documentation: https://rmarkdown.rstudio.com
- Check RStudio Community: https://community.rstudio.com

---

## Change Log

### 2025-11-16
- Created comprehensive repository documentation
- Documented all files, configurations, and workflows
- Identified known issues and limitations

### Recent Updates (from Git history)
- **fc2e121** - Moved balance of payments content
- **046ead7** - Rearranged index page
- **cc295e0** - Considerable edits to content
- **778c6e9** - Updated data organization
- **597b053** - Updated figures

---

## License

*License information not specified in repository. Consider adding a LICENSE file.*

---

**End of Documentation**
