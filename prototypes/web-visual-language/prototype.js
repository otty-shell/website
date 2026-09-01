/* PROTOTYPE — visual-language directions for one OTTY site. */

const variants = [
  { key: "A", name: "Signal Ledger" },
  { key: "B", name: "Open Canvas" },
  { key: "C", name: "Operator Rail" },
  { key: "D", name: "Signal Sequence" },
  { key: "E", name: "Signal Matrix" },
];

const views = ["landing", "docs", "install"];
const screenshotPath = "../../public/assets/product-evidence/hero.png";
const logoPath = "../../public/assets/logo.svg";

function brand(extraClass = "") {
  return `
    <span class="site-brand ${extraClass}">
      <img src="${logoPath}" alt="" />
      <span>OTTY</span>
    </span>
  `;
}

function evidence(label, extraClass = "") {
  return `
    <figure class="evidence ${extraClass}">
      <div class="evidence__frame">
        <img
          src="${screenshotPath}"
          alt="Prototype placeholder showing an older OTTY workspace; not final Product Evidence."
        />
        <span class="evidence__note">Prototype image · replace before launch</span>
      </div>
      <figcaption>${label}</figcaption>
    </figure>
  `;
}

function primaryNavigation(variant, className = "site-nav") {
  return `
    <nav class="${className}" aria-label="Primary navigation">
      <a href="?variant=${variant}&view=docs" data-site-view="docs">Documentation</a>
      <a href="https://github.com/otty-shell/otty">GitHub</a>
      <a class="nav-download" href="?variant=${variant}&view=install" data-site-view="install">Download</a>
    </nav>
  `;
}

function capabilityCopy(index, title, copy) {
  return `
    <div class="capability__copy">
      <span class="capability__index">0${index}</span>
      <h3>${title}</h3>
      <p>${copy}</p>
    </div>
  `;
}

const documentationArticle = `
  <article class="doc-article">
    <div class="doc-kicker">Getting started</div>
    <h1>Make OTTY yours</h1>
    <p class="doc-lead">
      OTTY keeps terminal sessions, project files, and repeatable launches inside one workspace.
      This guide introduces the interface without changing the way your shell works.
    </p>

    <h2 id="workspace">Create a workspace</h2>
    <p>
      Start OTTY and open a terminal tab. Split the active pane when you need a second session beside
      the first, or create another tab to keep a separate task out of the current layout.
    </p>
    <div class="doc-code" role="region" aria-label="Example command">
      <span>$</span><code>cd ~/work/example-project</code><button type="button">Copy</button>
    </div>

    <h2 id="explorer">Follow your current directory</h2>
    <p>
      Open Explorer from the sidebar. With Bash or Zsh shell integration enabled, Explorer follows
      the current directory of the focused terminal session.
    </p>

    <aside class="doc-note">
      <strong>Shell integration</strong>
      <span>Semantic command blocks and current-directory context are enhanced for Bash and Zsh.</span>
    </aside>

    <h2 id="next">Next steps</h2>
    <ul>
      <li>Arrange tabs and split panes.</li>
      <li>Save a command in Quick Launch.</li>
      <li>Add an SSH connection for an interactive remote shell.</li>
    </ul>
  </article>
`;

const documentationNavigation = `
  <nav class="doc-nav" aria-label="Documentation navigation">
    <p>Start</p>
    <a class="is-active" href="#">Introduction</a>
    <a href="#">Installation</a>
    <p>Workspace</p>
    <a href="#">Tabs and splits</a>
    <a href="#">Command blocks</a>
    <a href="#">Explorer</a>
    <a href="#">Quick Launch</a>
    <p>Reference</p>
    <a href="#">Shell integration</a>
    <a href="#">Configuration</a>
  </nav>
`;

const tableOfContents = `
  <nav class="doc-toc" aria-label="On this page">
    <p>On this page</p>
    <a href="#workspace">Create a workspace</a>
    <a href="#explorer">Current directory</a>
    <a href="#next">Next steps</a>
  </nav>
`;

function downloadRows() {
  return `
    <div class="download-row">
      <span class="download-os">Linux</span>
      <span><strong>Debian package</strong><small>x86-64 · .deb · 18.4 MB</small></span>
      <code>otty_0.1.0_amd64.deb</code>
      <a href="#">Download</a>
    </div>
    <div class="download-row">
      <span class="download-os">Linux</span>
      <span><strong>RPM package</strong><small>x86-64 · .rpm · 18.1 MB</small></span>
      <code>otty-0.1.0-1.x86_64.rpm</code>
      <a href="#">Download</a>
    </div>
    <div class="download-row">
      <span class="download-os">macOS</span>
      <span><strong>Apple Silicon</strong><small>aarch64 · .dmg · 20.2 MB</small></span>
      <code>otty_0.1.0-aarch64-apple-darwin.dmg</code>
      <a href="#">Download</a>
    </div>
    <div class="download-row">
      <span class="download-os">macOS</span>
      <span><strong>Intel Mac</strong><small>x86-64 · .dmg · 21.0 MB</small></span>
      <code>otty_0.1.0-x86_64-apple-darwin.dmg</code>
      <a href="#">Download</a>
    </div>
  `;
}

function landingA() {
  return `
    <div class="variant variant-a">
      <header class="a-header">
        <a class="home-link" href="?variant=A&view=landing" data-site-view="landing">${brand()}</a>
        ${primaryNavigation("A")}
      </header>

      <main>
        <section class="a-hero" aria-labelledby="a-title">
          <div class="a-hero__copy">
            <span class="a-signal"><i></i> Early Release · Linux + macOS</span>
            <h1 id="a-title">Terminal work,<br /><em>held together.</em></h1>
            <p>
              OTTY is a terminal-first workspace for development and operations across local and
              remote machines.
            </p>
            <div class="a-actions">
              <a class="button button--solid" href="?variant=A&view=install" data-site-view="install">Download OTTY</a>
              <a class="button button--text" href="?variant=A&view=docs" data-site-view="docs">Read docs <span>↗</span></a>
            </div>
          </div>
          <div class="a-hero__media">
            <div class="a-hero__coordinate">CURRENT RELEASE / PRODUCT EVIDENCE 01</div>
            ${evidence("A real OTTY workspace, presented without decorative reconstruction.", "evidence--hero")}
          </div>
        </section>

        <section class="a-capabilities" aria-labelledby="a-capabilities-title">
          <header class="a-section-heading">
            <span>Four current capabilities</span>
            <h2 id="a-capabilities-title">A workspace built around the shell.</h2>
          </header>

          <article class="a-capability">
            ${capabilityCopy(1, "Shape your terminal workspace", "Arrange tabs and splits so parallel sessions stay visible without becoming one long stream.")}
            ${evidence("Tabs and split panes", "evidence--capability")}
          </article>
          <article class="a-capability a-capability--reverse">
            ${capabilityCopy(2, "Work with command blocks", "Treat commands and output as semantic units you can select and reuse.")}
            ${evidence("Command blocks and their actions", "evidence--capability")}
          </article>
          <article class="a-capability">
            ${capabilityCopy(3, "Keep project files in reach", "Keep Explorer beside the shell and aligned with the focused session's current directory.")}
            ${evidence("Explorer beside the focused terminal", "evidence--capability")}
          </article>
          <article class="a-capability a-capability--reverse">
            ${capabilityCopy(4, "Launch commands and connections", "Start saved commands and SSH connections without rebuilding the same context each time.")}
            ${evidence("Quick Launch for commands and SSH", "evidence--capability")}
          </article>
        </section>
      </main>

      <footer class="a-footer">
        ${brand("site-brand--small")}
        <nav aria-label="Footer navigation"><a data-site-view="docs" href="?variant=A&view=docs">Documentation</a><a href="https://github.com/otty-shell/otty">GitHub</a><a href="#">License</a></nav>
        <span>© OTTY contributors</span>
      </footer>
    </div>
  `;
}

function docsA(content = documentationArticle, active = "docs", variant = "A", extraClass = "") {
  return `
    <div class="variant variant-a a-docs ${extraClass}">
      <header class="a-header a-header--docs">
        <a class="home-link" href="?variant=${variant}&view=landing" data-site-view="landing">${brand()}</a>
        <div class="doc-search">⌕ <span>Search documentation</span><kbd>⌘ K</kbd></div>
        ${primaryNavigation(variant)}
      </header>
      <main class="a-doc-layout">
        <aside>${documentationNavigation}</aside>
        ${content}
        ${active === "docs" ? tableOfContents : "<aside></aside>"}
      </main>
    </div>
  `;
}

function installA(variant = "A", extraClass = "") {
  const content = `
    <article class="doc-article install-article">
      <div class="doc-kicker">Installation and Downloads</div>
      <h1>Install the latest stable release</h1>
      <p class="doc-lead">Choose the native package that matches your platform and architecture.</p>
      <section class="downloads-a" aria-label="Latest OTTY downloads">
        <header><div><span>Latest stable</span><strong>v0.1.0</strong></div><div><span>Published</span><strong>11 Mar 2026</strong></div><a href="#">Release notes ↗</a></header>
        ${downloadRows()}
        <footer><span>Need another version?</span><a href="https://github.com/otty-shell/otty/releases">All releases ↗</a></footer>
      </section>
      <h2>Opening OTTY on macOS</h2>
      <p>OTTY is not currently notarized by Apple. On first launch, use System Settings → Privacy &amp; Security → Open Anyway.</p>
    </article>
  `;
  return docsA(content, "install", variant, extraClass);
}

function signalHeader(variant) {
  return `
    <header class="a-header s-header">
      <a class="home-link" href="?variant=${variant}&view=landing" data-site-view="landing">${brand()}</a>
      ${primaryNavigation(variant)}
    </header>
  `;
}

function signalHero(variant) {
  return `
    <section class="s-hero" aria-labelledby="${variant.toLowerCase()}-title">
      <div class="s-hero__copy">
        <div class="s-prompt"><span>otty@workspace</span><i>:</i><b>~</b><i>$</i></div>
        <h1 id="${variant.toLowerCase()}-title">keep terminal<br />work <em>together<span>_</span></em></h1>
        <p>OTTY is a terminal-first workspace for development and operations across local and remote machines.</p>
        <div class="s-actions">
          <a href="?variant=${variant}&view=install" data-site-view="install"><span>&gt;</span> download_otty</a>
          <a href="?variant=${variant}&view=docs" data-site-view="docs"><span>&gt;</span> read_docs</a>
        </div>
        <div class="s-platforms"><span>[ early release ]</span><span>[ linux ]</span><span>[ macos ]</span></div>
      </div>
      <div class="s-hero__media">
        <div class="s-window-label"><span>product_evidence/hero.png</span><span>2560 × 1600</span></div>
        ${evidence("Actual OTTY workspace from the latest Published Release.", "evidence--hero")}
      </div>
    </section>
  `;
}

function signalFooter(variant) {
  return `
    <footer class="a-footer s-footer">
      ${brand("site-brand--small")}
      <nav aria-label="Footer navigation"><a data-site-view="docs" href="?variant=${variant}&view=docs">docs</a><a href="https://github.com/otty-shell/otty">github</a><a href="#">license</a></nav>
      <span>© OTTY contributors</span>
    </footer>
  `;
}

function landingD() {
  return `
    <div class="variant variant-a variant-d">
      ${signalHeader("D")}
      <main>
        ${signalHero("D")}
        <section class="s-slider-section" aria-labelledby="d-capabilities-title">
          <header class="s-section-heading">
            <div><span>otty capabilities.list</span><small>4 entries / latest release</small></div>
            <h2 id="d-capabilities-title">current_capabilities</h2>
          </header>
          <div class="s-slider" data-capability-slider>
            <div class="s-slider__status"><span data-slider-count>01 / 04</span><i><b data-slider-progress></b></i><button type="button" data-slider-toggle>pause autoplay</button></div>
            <div class="s-slider__panels">
              <article class="s-slide" data-slide-panel="0">${capabilityCopy(1, "Shape your terminal workspace", "Arrange tabs and splits so parallel sessions stay visible without becoming one long stream.")}${evidence("Tabs and split panes", "evidence--capability")}</article>
              <article class="s-slide" data-slide-panel="1" hidden>${capabilityCopy(2, "Work with command blocks", "Treat commands and output as semantic units you can identify, select, and reuse.")}${evidence("Command blocks and their actions", "evidence--capability")}</article>
              <article class="s-slide" data-slide-panel="2" hidden>${capabilityCopy(3, "Keep project files in reach", "Keep Explorer beside the shell and aligned with the focused session's current directory.")}${evidence("Explorer beside the focused terminal", "evidence--capability")}</article>
              <article class="s-slide" data-slide-panel="3" hidden>${capabilityCopy(4, "Launch commands and connections", "Start saved commands and SSH connections without rebuilding the same context each time.")}${evidence("Quick Launch for commands and SSH", "evidence--capability")}</article>
            </div>
            <div class="s-slider__controls">
              <div role="tablist" aria-label="Capabilities">
                <button type="button" role="tab" aria-selected="true" data-slide-dot="0"><span>01</span> workspace</button>
                <button type="button" role="tab" aria-selected="false" data-slide-dot="1"><span>02</span> blocks</button>
                <button type="button" role="tab" aria-selected="false" data-slide-dot="2"><span>03</span> explorer</button>
                <button type="button" role="tab" aria-selected="false" data-slide-dot="3"><span>04</span> quick_launch</button>
              </div>
            </div>
          </div>
        </section>
      </main>
      ${signalFooter("D")}
    </div>
  `;
}

function landingE() {
  return `
    <div class="variant variant-a variant-e">
      ${signalHeader("E")}
      <main>
        ${signalHero("E")}
        <section class="s-matrix-section" aria-labelledby="e-capabilities-title">
          <header class="s-section-heading">
            <div><span>otty capabilities.list --all</span><small>4 entries / latest release</small></div>
            <h2 id="e-capabilities-title">current_capabilities</h2>
          </header>
          <div class="s-matrix">
            <article>${evidence("Tabs and split panes", "evidence--capability")}${capabilityCopy(1, "Shape your terminal workspace", "Arrange parallel sessions into tabs and splits that keep the work legible.")}</article>
            <article>${evidence("Command blocks and their actions", "evidence--capability")}${capabilityCopy(2, "Work with command blocks", "Select commands and output as meaningful units instead of searching a stream.")}</article>
            <article>${evidence("Explorer beside the focused terminal", "evidence--capability")}${capabilityCopy(3, "Keep project files in reach", "Let the file tree follow the directory where terminal work is happening.")}</article>
            <article>${evidence("Quick Launch for commands and SSH", "evidence--capability")}${capabilityCopy(4, "Launch commands and connections", "Return to saved commands and SSH connections without reconstructing them.")}</article>
          </div>
        </section>
      </main>
      ${signalFooter("E")}
    </div>
  `;
}

function landingB() {
  return `
    <div class="variant variant-b">
      <header class="b-header">
        <a class="home-link" href="?variant=B&view=landing" data-site-view="landing">${brand()}</a>
        ${primaryNavigation("B")}
      </header>
      <main>
        <section class="b-hero" aria-labelledby="b-title">
          <div class="b-badge">Early Release <span></span> Linux + macOS</div>
          <h1 id="b-title">The terminal,<br /><i>with room to work.</i></h1>
          <p>OTTY is a terminal-first workspace for development and operations across local and remote machines.</p>
          <div class="b-actions">
            <a class="button button--ink" href="?variant=B&view=install" data-site-view="install">Download OTTY <span>↓</span></a>
            <a class="button button--outline" href="?variant=B&view=docs" data-site-view="docs">Read docs</a>
          </div>
          <div class="b-hero__media">
            ${evidence("The latest Published Release in a real working state.", "evidence--hero")}
          </div>
        </section>

        <section class="b-capabilities" aria-labelledby="b-capabilities-title">
          <header class="b-section-heading">
            <span>Current capabilities / 04</span>
            <h2 id="b-capabilities-title">Less switching.<br />More continuity.</h2>
          </header>
          <div class="b-capability-grid">
            <article class="b-capability b-capability--wide">
              ${evidence("Tabs and split panes", "evidence--capability")}
              ${capabilityCopy(1, "Shape your terminal workspace", "Arrange parallel sessions into tabs and splits that keep the work legible.")}
            </article>
            <article class="b-capability">
              ${evidence("Command blocks and their actions", "evidence--capability")}
              ${capabilityCopy(2, "Work with command blocks", "Select commands and output as meaningful units instead of searching a stream.")}
            </article>
            <article class="b-capability">
              ${evidence("Explorer beside the focused terminal", "evidence--capability")}
              ${capabilityCopy(3, "Keep project files in reach", "Let the file tree follow the directory where terminal work is happening.")}
            </article>
            <article class="b-capability b-capability--wide b-capability--horizontal">
              ${evidence("Quick Launch for commands and SSH", "evidence--capability")}
              ${capabilityCopy(4, "Launch commands and connections", "Return to saved commands and SSH connections without reconstructing them.")}
            </article>
          </div>
        </section>
      </main>
      <footer class="b-footer">
        <div>${brand("site-brand--small")}<p>A terminal-first workspace for local and remote work.</p></div>
        <nav aria-label="Footer navigation"><a data-site-view="docs" href="?variant=B&view=docs">Documentation</a><a href="https://github.com/otty-shell/otty">GitHub</a><a href="#">License</a></nav>
        <span>© OTTY contributors</span>
      </footer>
    </div>
  `;
}

function docsB(content = documentationArticle, active = "docs") {
  return `
    <div class="variant variant-b b-docs">
      <header class="b-header b-header--docs">
        <a class="home-link" href="?variant=B&view=landing" data-site-view="landing">${brand()}</a>
        <nav class="b-doc-categories" aria-label="Documentation sections"><a class="is-active" href="#">Guides</a><a href="#">Workspace</a><a href="#">Reference</a></nav>
        ${primaryNavigation("B")}
      </header>
      <div class="b-doc-search"><span>Search all documentation</span><kbd>⌘ K</kbd></div>
      <main class="b-doc-layout">
        <aside>${documentationNavigation}</aside>
        ${content}
        ${active === "docs" ? tableOfContents : "<aside></aside>"}
      </main>
    </div>
  `;
}

function installB() {
  const content = `
    <article class="doc-article install-article">
      <div class="doc-kicker">Installation and Downloads</div>
      <h1>Choose your OTTY package</h1>
      <p class="doc-lead">Latest stable <strong>v0.1.0</strong>, published 11 March 2026. Direct downloads are hosted by GitHub Releases.</p>
      <section class="downloads-b" aria-label="Latest OTTY downloads">
        <article class="platform-panel">
          <header><span class="platform-icon">◇</span><div><h2>Linux</h2><p>Intel or AMD 64-bit</p></div></header>
          <a href="#"><span><strong>Debian package</strong><small>Ubuntu, Debian · .deb · 18.4 MB</small></span><b>↓</b></a>
          <a href="#"><span><strong>RPM package</strong><small>RPM-based Linux · .rpm · 18.1 MB</small></span><b>↓</b></a>
          <p class="unavailable">Linux ARM64 is not currently available.</p>
        </article>
        <article class="platform-panel">
          <header><span class="platform-icon">○</span><div><h2>macOS</h2><p>Choose your Mac processor</p></div></header>
          <a href="#"><span><strong>Apple Silicon</strong><small>M1 or newer · .dmg · 20.2 MB</small></span><b>↓</b></a>
          <a href="#"><span><strong>Intel Mac</strong><small>x86-64 · .dmg · 21.0 MB</small></span><b>↓</b></a>
          <p class="unavailable">OTTY is not currently notarized by Apple.</p>
        </article>
        <footer><a href="#">Release notes ↗</a><a href="https://github.com/otty-shell/otty/releases">All releases ↗</a></footer>
      </section>
      <h2>Opening OTTY on macOS</h2>
      <p>On first launch, use System Settings → Privacy &amp; Security → Open Anyway.</p>
    </article>
  `;
  return docsB(content, "install");
}

function railNavigation(variant, active = "landing") {
  return `
    <header class="c-rail">
      <a class="home-link" href="?variant=${variant}&view=landing" data-site-view="landing">${brand()}</a>
      <nav aria-label="Primary navigation">
        <a class="${active === "landing" ? "is-active" : ""}" href="?variant=${variant}&view=landing" data-site-view="landing"><span>01</span>Product</a>
        <a class="${active === "docs" ? "is-active" : ""}" href="?variant=${variant}&view=docs" data-site-view="docs"><span>02</span>Documentation</a>
        <a class="${active === "install" ? "is-active" : ""}" href="?variant=${variant}&view=install" data-site-view="install"><span>03</span>Download</a>
        <a href="https://github.com/otty-shell/otty"><span>04</span>GitHub ↗</a>
      </nav>
      <div class="c-rail__status"><i></i><span>Early Release</span><small>Linux + macOS</small></div>
    </header>
  `;
}

function landingC() {
  return `
    <div class="variant variant-c c-shell">
      ${railNavigation("C", "landing")}
      <div class="c-page">
        <main>
          <section class="c-hero" aria-labelledby="c-title">
            <div class="c-hero__copy">
              <span class="c-coordinate">OTTY / CURRENT RELEASE / 01</span>
              <h1 id="c-title">Your shell is already the center.<br /><em>Give it a workspace.</em></h1>
              <p>OTTY is a terminal-first workspace for development and operations across local and remote machines.</p>
              <div class="c-actions"><a href="?variant=C&view=install" data-site-view="install">Download OTTY <span>↓</span></a><a href="?variant=C&view=docs" data-site-view="docs">Read docs ↗</a></div>
            </div>
            <div class="c-hero__media">${evidence("One real workspace. No decorative terminal scene.", "evidence--hero")}</div>
          </section>

          <section class="c-capabilities" aria-labelledby="c-capabilities-title">
            <header><span>CURRENT CAPABILITY INDEX</span><h2 id="c-capabilities-title">Four ways to keep terminal work connected.</h2></header>
            <article class="c-capability">${capabilityCopy(1, "Shape your terminal workspace", "Tabs and split panes keep parallel sessions arranged around the work.")}${evidence("Tabs and split panes", "evidence--capability")}</article>
            <article class="c-capability">${capabilityCopy(2, "Work with command blocks", "Commands and output become blocks you can identify, select, and reuse.")}${evidence("Command blocks and their actions", "evidence--capability")}</article>
            <article class="c-capability">${capabilityCopy(3, "Keep project files in reach", "Explorer stays beside the terminal and follows the focused working directory.")}${evidence("Explorer beside the focused terminal", "evidence--capability")}</article>
            <article class="c-capability">${capabilityCopy(4, "Launch commands and connections", "Quick Launch opens saved commands and interactive SSH connections.")}${evidence("Quick Launch for commands and SSH", "evidence--capability")}</article>
          </section>
        </main>
        <footer class="c-footer"><span>© OTTY contributors</span><nav><a data-site-view="docs" href="?variant=C&view=docs">Documentation</a><a href="https://github.com/otty-shell/otty">GitHub</a><a href="#">License</a></nav></footer>
      </div>
    </div>
  `;
}

function docsC(content = documentationArticle, active = "docs") {
  return `
    <div class="variant variant-c c-shell c-docs">
      ${railNavigation("C", active)}
      <div class="c-page">
        <header class="c-doc-header"><div><span>Documentation / Rolling</span><strong>OTTY Manual</strong></div><button type="button">⌕ Search <kbd>⌘ K</kbd></button></header>
        <main class="c-doc-layout">
          <aside>${documentationNavigation}</aside>
          ${content}
          ${active === "docs" ? tableOfContents : "<aside></aside>"}
        </main>
      </div>
    </div>
  `;
}

function installC() {
  const content = `
    <article class="doc-article install-article">
      <div class="doc-kicker">Installation and Downloads / latest stable</div>
      <h1>Get OTTY v0.1.0</h1>
      <p class="doc-lead">Four native packages. Choose the row that matches your system and architecture.</p>
      <section class="downloads-c" aria-label="Latest OTTY downloads">
        <header><span>Published Release</span><strong>v0.1.0</strong><time>11 MAR 2026</time><a href="#">Release notes ↗</a></header>
        ${downloadRows()}
        <footer><span>Historical versions and prereleases remain on GitHub.</span><a href="https://github.com/otty-shell/otty/releases">All releases ↗</a></footer>
      </section>
      <h2>macOS first launch</h2>
      <aside class="doc-note"><strong>Not notarized</strong><span>Use System Settings → Privacy &amp; Security → Open Anyway. Do not disable Gatekeeper.</span></aside>
    </article>
  `;
  return docsC(content, "install");
}

const templates = {
  A: { landing: landingA, docs: docsA, install: installA },
  B: { landing: landingB, docs: docsB, install: installB },
  C: { landing: landingC, docs: docsC, install: installC },
  D: {
    landing: landingD,
    docs: () => docsA(documentationArticle, "docs", "D", "variant-d"),
    install: () => installA("D", "variant-d"),
  },
  E: {
    landing: landingE,
    docs: () => docsA(documentationArticle, "docs", "E", "variant-e"),
    install: () => installA("E", "variant-e"),
  },
};

const params = new URLSearchParams(window.location.search);
let currentVariant = variants.some(({ key }) => key === params.get("variant")) ? params.get("variant") : "A";
let currentView = views.includes(params.get("view")) ? params.get("view") : "landing";
let capabilityIndex = 0;
let capabilityTimer;
let capabilityPaused = false;

function clearCapabilityTimer() {
  window.clearInterval(capabilityTimer);
  capabilityTimer = undefined;
}

function showCapability(index, { restart = true } = {}) {
  const slider = document.querySelector("[data-capability-slider]");
  if (!slider) return;

  const panels = [...slider.querySelectorAll("[data-slide-panel]")];
  capabilityIndex = (index + panels.length) % panels.length;
  panels.forEach((panel, panelIndex) => {
    panel.hidden = panelIndex !== capabilityIndex;
  });

  slider.querySelectorAll("[data-slide-dot]").forEach((button, buttonIndex) => {
    button.setAttribute("aria-selected", String(buttonIndex === capabilityIndex));
  });

  slider.querySelector("[data-slider-count]").textContent = `0${capabilityIndex + 1} / 04`;
  slider.querySelector("[data-slider-progress]").style.width = `${(capabilityIndex + 1) * 25}%`;
  if (restart) startCapabilityTimer();
}

function startCapabilityTimer() {
  clearCapabilityTimer();
  if (capabilityPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  capabilityTimer = window.setInterval(() => showCapability(capabilityIndex + 1, { restart: false }), 6000);
}

function initCapabilitySlider() {
  const slider = document.querySelector("[data-capability-slider]");
  if (!slider) return;
  capabilityIndex = 0;
  capabilityPaused = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const toggle = slider.querySelector("[data-slider-toggle]");
  toggle.textContent = capabilityPaused ? "play autoplay" : "pause autoplay";
  showCapability(0, { restart: false });
  startCapabilityTimer();

  slider.addEventListener("mouseenter", clearCapabilityTimer);
  slider.addEventListener("mouseleave", startCapabilityTimer);
  slider.addEventListener("focusin", clearCapabilityTimer);
  slider.addEventListener("focusout", startCapabilityTimer);
}

function replaceUrl() {
  const next = new URL(window.location.href);
  next.searchParams.set("variant", currentVariant);
  next.searchParams.set("view", currentView);
  window.history.replaceState({}, "", next);
}

function render({ resetScroll = false } = {}) {
  clearCapabilityTimer();
  document.body.dataset.variant = currentVariant;
  document.body.dataset.view = currentView;
  document.querySelector("#app").innerHTML = templates[currentVariant][currentView]();

  const variant = variants.find(({ key }) => key === currentVariant);
  document.querySelector("[data-prototype-label]").textContent = `${variant.key} — ${variant.name}`;
  document.querySelectorAll("[data-prototype-view]").forEach((button) => {
    button.classList.toggle("is-active", button.dataset.prototypeView === currentView);
  });

  initCapabilitySlider();
  replaceUrl();
  if (resetScroll) {
    window.scrollTo({ top: 0, behavior: "auto" });
  } else if (window.location.hash) {
    window.setTimeout(() => {
      const target = document.querySelector(window.location.hash);
      if (target) window.scrollTo(0, target.offsetTop);
    }, 50);
  }
}

function cycleVariant(offset) {
  const index = variants.findIndex(({ key }) => key === currentVariant);
  currentVariant = variants[(index + offset + variants.length) % variants.length].key;
  render({ resetScroll: true });
}

document.addEventListener("click", (event) => {
  const target = event.target.closest("button, a");
  if (!target) return;

  if (target.matches("[data-prototype-prev]")) {
    cycleVariant(-1);
    return;
  }

  if (target.matches("[data-prototype-next]")) {
    cycleVariant(1);
    return;
  }

  if (target.matches("[data-prototype-view]")) {
    currentView = target.dataset.prototypeView;
    render({ resetScroll: true });
    return;
  }

  if (target.matches("[data-site-view]")) {
    event.preventDefault();
    currentView = target.dataset.siteView;
    render({ resetScroll: true });
    return;
  }

  if (target.matches("[data-slide-dot]")) {
    showCapability(Number(target.dataset.slideDot));
    return;
  }

  if (target.matches("[data-slider-toggle]")) {
    capabilityPaused = !capabilityPaused;
    target.textContent = capabilityPaused ? "play autoplay" : "pause autoplay";
    startCapabilityTimer();
    return;
  }

  if (target.getAttribute("href") === "#") event.preventDefault();
});

document.addEventListener("keydown", (event) => {
  const tag = event.target.tagName;
  if (tag === "INPUT" || tag === "TEXTAREA" || event.target.isContentEditable) return;
  if (event.key === "ArrowLeft") cycleVariant(-1);
  if (event.key === "ArrowRight") cycleVariant(1);
});

window.addEventListener("popstate", () => {
  const next = new URLSearchParams(window.location.search);
  currentVariant = variants.some(({ key }) => key === next.get("variant")) ? next.get("variant") : "A";
  currentView = views.includes(next.get("view")) ? next.get("view") : "landing";
  render();
});

const localPrototype = ["", "localhost", "127.0.0.1"].includes(window.location.hostname);
if (!localPrototype) document.querySelector(".prototype-switcher").hidden = true;

render();
