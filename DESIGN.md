---
name: Armando Albornoz — Personal terminal
description: A physical phosphor terminal with dark project covers and warm-paper research chapters.
colors:
  paper: "#eee9dd"
  paper-ink: "#172c26"
  paper-secondary: "#526057"
  paper-rule: "#c5cabd"
  charcoal: "#0c1010"
  phosphor: "#c1e99c"
  terminal-ink: "#e4e8dc"
  terminal-dim: "#a6b0a4"
  figure-surface: "#ffffff"
  cover: "#0c1915"
  cover-ink: "#f4f0e4"
  cover-secondary: "#cad9ce"
  accent: "#d5e9a5"
  window-shell: "#343c34"
  window-rail: "#b5bca8"
  window-body: "#0d1812"
  window-ink: "#e9ecda"
  window-muted: "#b7c5b5"
  window-action: "#dfcb91"
  window-action-ink: "#182b1c"
typography:
  display:
    fontFamily: "Plex, Arial, sans-serif"
    fontSize: "clamp(56px, 5.3vw, 82px)"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-0.04em"
  lead:
    fontFamily: "Plex, Arial, sans-serif"
    fontSize: "19px"
    fontWeight: 400
    lineHeight: 1.65
    letterSpacing: "0em"
  headline:
    fontFamily: "Plex, Arial, sans-serif"
    fontSize: "29px"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.025em"
  summary:
    fontFamily: "Plex, Arial, sans-serif"
    fontSize: "27px"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "-0.015em"
  body:
    fontFamily: "Plex, Arial, sans-serif"
    fontSize: "18px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "'Plex Mono', Consolas, monospace"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  square: "0px"
  key-hint: "2px"
  window: "9px"
  window-control: "3px"
spacing:
  compact: "8px"
  control: "12px"
  text: "16px"
  group: "24px"
  inset: "32px"
  section: "48px"
  chapter: "72px"
components:
  dialog-window:
    backgroundColor: "{colors.window-shell}"
    textColor: "{colors.window-ink}"
    rounded: "{rounded.window}"
    padding: "7px"
    width: "min(620px, calc(100vw - 32px))"
  dialog-email:
    backgroundColor: "{colors.window-action}"
    textColor: "{colors.window-action-ink}"
    rounded: "{rounded.window-control}"
    padding: "21px 20px"
  back-control:
    textColor: "{colors.cover-ink}"
    typography: "{typography.label}"
    rounded: "{rounded.square}"
    padding: "0px"
  report-link:
    rounded: "{rounded.square}"
    padding: "17px 0px"
  figure-stage:
    backgroundColor: "{colors.figure-surface}"
    rounded: "{rounded.square}"
    padding: "32px"
  project-navigation:
    rounded: "{rounded.square}"
    padding: "0px"
---

# Design System: Armando Albornoz — Personal terminal

## Overview

**Creative North Star: "The Personal Research Terminal"**

A physical vintage computer establishes the identity. The charcoal studio, phosphor display, pixel wordmark, and tactile keyboard make navigation feel like using a small personal machine. Project pages extend that character with a dark split cover pairing the title and live artwork, then a full-width warm-paper reading chapter with carefully set type and spacious source figures.

About, Contact, and Credits appear as compact application windows with a graphite hardware frame, pale title rail, dark inset pane, and an amber email action. Plain paper sheets and generic green panels are rejected for these dialogs.

The hierarchy stays direct: the terminal leads the main page; the work leads each project page. Motion illustrates the subject and connects the CRT to the opened page. Copy remains concise and factual, with source captions and credits where they are needed.

**Key Characteristics:**
- Physical computer and pixel CRT identity.
- Dark live-art covers and warm paper with dark green ink for sustained reading.
- Locally hosted Plex typography with distinct reading and control roles.
- Continuing project animation and restrained interface chrome.
- Hardware-framed dialogs with a pale rail and amber primary action.

## Colors

The palette connects a dark phosphor studio to quiet paper surfaces. Frontmatter values are extracted from `portfolio.css`, the base `style.css`, and `dialogs.css`; scene-specific illustration colors remain in their scene code.

### Primary
- **Phosphor:** terminal selection, links, and focus emphasis on the dark surface.
- **Accent:** cover navigation labels, hover states, and focus emphasis.
- **Window Action / Window Action Ink:** amber email action and its dark readable text.

### Neutral
- **Cover:** the split project entrance, sticky top bar, and closing navigation.
- **Cover Ink / Cover Secondary:** prominent project titles and readable cover introductions.
- **Paper:** the full-width project reading chapter.
- **Paper Ink:** project titles and return controls.
- **Paper Secondary:** supporting reading information.
- **Paper Rule:** restrained dividers between metadata, figures, and navigation.
- **Charcoal:** the surrounding terminal stage.
- **Terminal Ink / Terminal Dim:** primary and secondary interface text on dark surfaces.
- **Figure Surface:** a nearly white backing that keeps authentic report figures legible.
- **Window Shell / Window Rail / Window Body:** graphite hardware frame, pale title rail, and dark inset content.
- **Window Ink / Window Muted:** primary dialog content and secondary credit notes.

**The Surface Rule.** Keep long project reading on paper; keep pixel navigation inside the terminal display.

## Typography

IBM Plex Sans is registered locally as `Plex` for titles and reading. IBM Plex Mono is registered as `Plex Mono` for metadata and controls. Regular and Medium Sans files and Regular Mono are included with their SIL Open Font License in `assets/fonts/OFL.txt`. Pixel glyphs are drawn in the CRT; the loading wordmark is a pixel asset.

The desktop project title uses the display role and a balanced measure of at most 11.5ch. A short lede sits below it at up to 32ch. The MRI title has a smaller clamp to accommodate its length. The summary is larger than body text and stays within 52ch; ordinary paragraphs stay within 68ch. Section headings use the headline role. Metadata labels use smaller mono text; fact values and source captions use Plex Sans. Report values appear next to their plots, with explicit baselines and source links.

**The Type Role Rule.** Use Plex Sans for reading, Plex Mono for controls and facts, and pixel lettering for the CRT identity.

## Layout

The terminal is framed by an orthographic camera with no wheel zoom or drag orbit. Small pointer movement produces damped tilt. Intentional camera moves focus project browsing and bridge into project pages. The name alone anchors the outer header; a compact control strip sits at the bottom.

Project pages use a dark sticky top bar and a centered container of up to 1370px, with 40px side insets on desktop. A split cover places the title/lede in the narrower column and an uninterrupted 32:15 live-art stage in the wider column. The full-width warm-paper chapter below contains a 240px metadata column beside a story column of up to 760px, with a fluid gap. Full-width interactive research figures follow the reading content. Original source images live in an expandable section, in one column or two equal columns when there are two images. Previous and next links end the page on the dark surface.

At 1100px the cover gap and content columns tighten. At 960px the artwork moves below a title/lede row. At 760px and below, headings and story stack, outer insets become 20px, metadata uses two columns, and paired figures become one column. Body text becomes 17px and section headings 26px. The control strip compacts further at 560px. Related text uses compact spacing; major reading regions use the section and chapter steps.

## Elevation & Depth

The 3D terminal uses lighting, model geometry, and soft studio shadows for physical depth. Reading pages stay flat: paper, fine rules, and white bordered figure stages create hierarchy without cards or floating shadows. Dialogs use a seven-pixel graphite shell, a pale bordered title rail and a dark inset pane. Fine borders describe those nested layers; a dim backdrop and broad shadow (`0 28px 70px #0009`) lift the application window above the terminal.

## Shapes

Project surfaces and controls are square and quiet. Keyboard hints have small rounded corners. Dialog hardware uses a gently rounded outer frame (9px, 7px on phone) and restrained inner controls (3px). Physical keycaps retain their rounded, scooped geometry; that model detail does not turn reading content into rounded cards. Pixel cursors and the CRT favicon carry the terminal identity outside the display without changing text readability.

## Components

- **Return bar:** a light arrow-and-text control beside the name on the dark sticky top bar, separated by one fine rule. Keyboard hints disappear on small screens.
- **Animated hero:** a live-art stage beside the desktop title, without overlaid playback controls or decorative captions. No decorative entrance slogans are added.
- **Project facts:** a definition list for field, status or work type, and tools. Overcooked explicitly says “In progress.” Delaunay presents measured scaling behavior from the report; no unsupported speedup badge is shown.
- **Research reading:** short sections, with an ordinary comparison table or centered equation where the content requires it. `project-pages.js` owns the current page structure and prose.
- **Documents and figures:** plain, prominent document rows with outward arrows; authentic figures sit on generous white bordered stages with provenance captions and full-size links.
- **Project navigation:** two text controls for previous and next work, with a small mono label and a larger project title.
- **Application dialogs:** a maximum 620px framed window with a pale owner/close rail, dark content body, 42px Plex heading, 16px reading text and mono controls. A labelled 44px close key includes a line icon. Contact emphasizes an amber email action above secondary LinkedIn/GitHub controls; About retains paragraphs and social links; Credits groups model and lighting sources. At 560px, the frame uses 12px outer margins, smaller insets and a 35px heading. Height stays within the viewport and content scrolls. Links/buttons have visible focus rings; reduced motion removes transitions. Native dialog naming, focus containment and Escape behavior remain intact.

The main menu in `home-screen.js` uses a 1.65-second entrance: the first name assembles from pixels, the surname wipes in, and the choices enter in a stagger. Faster stars and a visible wire grid continue on a separate background clock at 30 fps display updates; `main.js` integrates the menu renderer. Project scenes update at 24 fps, keeping the shared clock through the zoom into the opened hero. The original ML decision-field design remains. Hidden tabs stop clocks, offscreen project heroes stop, and reduced motion shows representative stills.

Project links and buttons use a light accent focus outline on dark surfaces and a darker green outline in the reading chapter. Preserve native links, descriptive labels, figure alternative text, caption provenance, and the live terminal status message.

## Do's and Don'ts

### Do:
- Do preserve the physical terminal and pixel CRT identity.
- Do keep reading hierarchy in Plex Sans and controls in Plex Mono.
- Do preserve source captions, credits, and truthful project status.
- Do continue the selected animation into the project hero and honor reduced motion.

### Don't:
- Don't add decorative slogans, repeated labels, or filler sections.
- Don't invent project results or present illustrative scenes as experiment recordings.
- Don't replace the preserved ML decision-field animation.
- Don't add metric cards or floating shadows to the paper reading pages.

## Report figures

`report-data.js` transcribes the optimizer table (OL p. 7), classifier rankings (SL p. 8), the unsupervised representation experiments (UL p. 6 Table III and p. 7 Table IV), reinforcement returns (RL p. 6 Table II), CartPole planning grids (RL p. 5 Table I), and three Delaunay runtime tables (pp. 43–45). Four ML chapter jump controls sit immediately after the introduction. Each graphical chapter keeps full method narrative in expandable “Methods and findings” notes, while duplicate overview headings stay hidden. Randomized-search figures retain the 2,000-evaluation budget per run over five seeds; optimizer comparisons explicitly identify medians over ten seeds. The unsupervised feature-count/PR-AUC matrix switches between reduction and cluster-feature experiments, keeping their raw baselines separate (0.7808 and 0.7810). The paired RL plot distinguishes final-window training from frozen greedy evaluation and preserves each environment’s evaluation budget and selected configurations. Six original ML figures and all four report PDFs remain available. Figures use zero-baseline bars or explicitly labeled logarithmic axes, exact-value tables, and direct PDF links. The lifting animation computes the two different barycenters. The Hausdorff explorer recreates Figure 3’s point sets and the quotient metric; its radius control remains usable by keyboard. MRI’s method diagram reflows to a vertical pipeline on mobile; the cooperative policy has a separate readable mobile arrangement. All new loops stop offscreen or in hidden tabs and use representative stills for reduced motion. No pause controls are shown.

Project headings name their subject directly. Body copy describes the work without slogans, forced fragments, repeated takeaways, or generic statements about why the work matters. Technical details and provenance stay intact.


## Accessible entry and dialogs

The power prompt uses an opaque dark-green surface with a light 23–25px action label and 12px supporting text. On screens at or below 1100px it sits below the model; the off-state framing reserves space for it. About, Contact and Credits use the hardware-framed application-window component described above. The title rail holds a labelled 44px close key. Content links remain underlined or clearly bounded as primary/secondary actions. The skip link appears on keyboard focus and opens a native project list. Terminal navigation targets are at least 44px. Project articles retain native scrolling and control keys.

Return visits skip initialization automatically after completion or an explicit skip. No replay control is shown. Project pages load without the terminal; only the selected project animation is prepared. The web model is a smaller texture-compressed copy with unchanged geometry and lossless material/normal maps.

Typography refinements: static Plex Sans Medium is registered at weight 500; Mono uses its supplied regular weight. Main prose is 18px on desktop and 17px on phones, with 1.75 leading and a 68ch maximum measure. Supporting explanations use 17px, captions and source notes use 14px. Narrow runtime and reinforcement plots use dedicated coordinates rather than shrinking desktop labels. SVG text has no inherited icon stroke. At 320px, representation columns remain contained and MRI preprocessing diagrams stack below their labels. The terminal pixel lettering and framed dialogs retain their established scale.

Control refinement: action labels use a 14px reading face, table disclosures use 15–16px, and mobile table headers stay at 12px. Phone chart variants cap at 440px on intermediate viewports. Small terminal controls retain 44px touch targets in a centered compact dock. Dialog rails and secondary actions use larger labels without changing their hardware frame or colors.

Three-column evidence tables fit the reading width at 320px; tables with more columns retain horizontal scrolling. The disclosures are labelled Data table and Methods and findings, with native keyboard behavior.

MRI content now follows the later adaptive MONAI pipeline, checked against the user’s configuration and report screenshots in the earlier chats. Keep dataset-aware planning, GPU-calibrated patch sizes, deterministic caching, lesion-aware sampling, training augmentation, and overlapping sliding-window inference distinct from the initial fixed-volume baseline. The diagram illustrates these four stages. No universal final patch size, enabled intensity clipping, or automatically generated custom architecture is claimed. Source review: work/mri-project-review.md.

All project pages now omit the Original report figures gallery. Keep existing report/PDF links and report-backed interactive figures and animations. Source image assets remain stored locally.

Release framing: at widths up to 760px, a powered terminal focuses the CRT at zoom 2.05 on the menu and 2.15 while browsing projects. The unpowered terminal keeps its full-device power prompt. Desktop framing is unchanged. Escape returns from focused project disclosure controls and animates the physical Escape key.

Sound: original dry mechanical key transients, rounded electronic confirmation tones, a short ascending boot signature, and a quiet sparse menu score. Avoid continuous typing after text stops, hover-triggered noise, and loud music. The speaker key has a 44px target and visible focus, with synchronized labels before and after startup. Sound is available only after interaction. Auto power-on is disabled for every visit; returning visitors skip only the intro after they press power.

The original background theme is an audible eight-bar arrangement with a lead melody, bass, stereo chords, and light kick/snare/hat percussion at 100 BPM. Music starts only after power-on reaches the menu, continues through project browsing, and lowers in articles and dialogs. Mute, power-off, and hidden tabs stop it. A direct project visit does not arm music before power-on.
