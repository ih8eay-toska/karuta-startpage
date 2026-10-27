const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const engineSelect = document.querySelector("#engine-select");
const engineMark = document.querySelector("#engine-mark");
const enginePicker = document.querySelector("#engine-picker");
const engineLabel = document.querySelector("#engine-label");
const engineMenu = document.querySelector("#engine-menu");
const engineOptions = [...engineMenu.querySelectorAll("[data-engine]")];
const themeNameLabel = document.querySelector("#theme-name");
const mainSection = document.querySelector("#main-section");
const savedPageToggles = [...document.querySelectorAll(".saved-tab")];
const savedPagesPanel = document.querySelector("#saved-pages");
const savedPageList = document.querySelector("#saved-page-list");
const themeCardSlot = document.querySelector("#theme-card-slot");
const cardPreviewNote = document.querySelector(".card-preview-note");
const cardPreviewLabel = cardPreviewNote.querySelector("span");
const cardPreviewDetails = cardPreviewNote.querySelector("p");
let activeFlight = null;
let selectedThemeCardFilename = null;

const cards = [
  ["jinhsi-5-1648.png", "Jinhsi", "glacier-bloom", "#72dfff", "Glacier Bloom", { cardName: "Hsi", cardCode: "VGQG47", cardNumber: 1648, edition: 5, series: "Wuthering Waves" }],
  ["kiss-shot-1-2070.png", "Kiss-shot", "silver-requiem", "#bdc5d0", "Silver Requiem", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "QLGH4N", cardNumber: 2070, edition: 1, series: "Monogatari Series: Second Season" }],
  ["kiss-shot-3-3524.png", "Kiss-shot", "crimson-nebula", "#ff3d69", "Crimson Nebula", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "PF4299", cardNumber: 3524, edition: 3, series: "Monogatari Series: Second Season" }],
  ["kiss-shot-4-711.png", "Kiss-shot", "pearl-halo", "#e9d8c4", "Pearl Halo", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "FZ5SSQ", cardNumber: 711, edition: 4, series: "Monogatari Series: Second Season" }],
  ["kiss-shot-5-7724.png", "Kiss-shot", "solar-ember", "#ffb94f", "Solar Ember", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "V3TX7MR", cardNumber: 7724, edition: 5, series: "Monogatari Series: Second Season" }],
  ["kiss-shot-6-4204.png", "Kiss-shot", "velvet-inferno", "#c42e50", "Velvet Inferno", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "VRLJSMB", cardNumber: 4204, edition: 6, series: "Monogatari Series: Second Season" }],
  ["kiss-shot-7-2334.png", "Kiss-shot", "blood-garnet", "#f5283d", "Blood Garnet", { cardName: "Kiss-Shot Acerola-Orion Heart-Under-Blade", cardCode: "V3RHPX9", cardNumber: 2334, edition: 7, series: "Monogatari Series: Second Season" }],
  ["shinobu-oshino-1-9925.png", "Shinobu Oshino", "clover-grove", "#8bdb36", "Clover Grove", { cardName: "Shinobu Oshino", cardCode: "BRLC5M", cardNumber: 9925, edition: 1, series: "Bakemonogatari" }],
  ["shinobu-oshino-2-11306.png", "Shinobu Oshino", "neon-orchid", "#df76ff", "Neon Orchid", { cardName: "Shinobu Oshino", cardCode: "RVFJP7", cardNumber: 11306, edition: 2, series: "Bakemonogatari" }],
  ["shinobu-oshino-3-3126.png", "Shinobu Oshino", "sage-porcelain", "#bbc7ae", "Sage Porcelain", { cardName: "Shinobu Oshino", cardCode: "RKTGQ4", cardNumber: 3126, edition: 3, series: "Bakemonogatari" }],
  ["shinobu-oshino-4-604.png", "Shinobu Oshino", "rose-garden", "#ff72b5", "Rose Garden", { cardName: "Shinobu Oshino", cardCode: "L4M0LP", cardNumber: 604, edition: 4, series: "Bakemonogatari" }],
  ["shinobu-oshino-5-7424.png", "Shinobu Oshino", "pewter-moon", "#bcc6d7", "Pewter Moon", { cardName: "Shinobu Oshino", cardCode: "V3W3M3", cardNumber: 7424, edition: 5, series: "Bakemonogatari" }],
  ["shinobu-oshino-6-4888.png", "Shinobu Oshino", "cinder-halo", "#ff563c", "Cinder Halo", { cardName: "Shinobu Oshino", cardCode: "VJW12TT", cardNumber: 4888, edition: 6, series: "Bakemonogatari" }],
  ["shinobu-oshino-7-2131.png", "Shinobu Oshino", "gilded-meadow", "#dfc36f", "Gilded Meadow", { cardName: "Shinobu Oshino", cardCode: "V3GK5FF", cardNumber: 2131, edition: 7, series: "Bakemonogatari" }],
];

const darkThemes = new Set(["silver-requiem", "crimson-nebula", "pearl-halo", "solar-ember", "velvet-inferno", "blood-garnet", "cinder-halo"]);
function cardAssetPath(filename) {
  const card = cards.find(([cardFilename]) => cardFilename === filename);
  const folder = card && darkThemes.has(card[2]) ? "dark" : "light";
  return `assets/cards/${folder}/${filename}`;
}

const orbitTracks = {
  dark: document.querySelector("#dark-orbit .orbit-track"),
  light: document.querySelector("#light-orbit .orbit-track"),
};
const originalOrbitCounts = {
  dark: cards.filter(([, , theme]) => darkThemes.has(theme)).length,
  light: cards.filter(([, , theme]) => !darkThemes.has(theme)).length,
};
const cardButtons = new Map();

function updateOrbitPositions() {
  for (const side of ["dark", "light"]) {
    const track = orbitTracks[side];
    const orbit = track.parentElement;
    const buttons = [...track.children];
    const count = buttons.length;
    if (!count) continue;
    const radius = (orbit.clientWidth / 2 - buttons[0].offsetWidth / 2 - 5) * (count / originalOrbitCounts[side]);
    buttons.forEach((button, index) => {
      const angle = (Math.PI * 2 * index / count) - Math.PI / 2;
      button.style.left = "50%";
      button.style.top = "50%";
      const pointsInward = angle * 180 / Math.PI - 90;
      const transform = `translate(-50%, -50%) translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px) rotate(${pointsInward}deg)`;
      if (button.style.transform && button.style.transform !== transform) button.classList.add("is-reflowing");
      button.style.transform = transform;
      button.style.zIndex = String(Math.round((Math.sin(angle) + 1) * 4) + 1);
    });
  }
}

function showTitleCard(filename, character, glow) {
  themeCardSlot.replaceChildren();
  themeCardSlot.classList.remove("is-empty");
  themeCardSlot.style.setProperty("--frame-glow", glow);
  const image = document.createElement("img");
  image.src = cardAssetPath(filename);
  image.alt = `${character} card selected as the page theme`;
  image.title = `${character} theme`;
  image.style.setProperty("--frame-glow", glow);
  themeCardSlot.append(image);
  return image;
}

function showCardDetails(character, details) {
  cardPreviewNote.setAttribute("aria-hidden", "false");
  cardPreviewLabel.textContent = "CARD DETAILS";
  const name = details.cardName.toLowerCase().startsWith(character.toLowerCase())
    ? details.cardName
    : `${character} (${details.cardName})`;
  const fields = [
    ["Name", name],
    ["Code", details.cardCode],
    ["Card #", details.cardNumber],
    ["Edition", details.edition],
    ["Series", details.series],
  ];
  cardPreviewDetails.replaceChildren();
  fields.forEach(([label, value]) => {
    const item = document.createElement("span");
    item.className = "card-detail-item";
    const itemLabel = document.createElement("span");
    itemLabel.className = "card-detail-label";
    itemLabel.textContent = `${label}: `;
    const itemValue = document.createElement("span");
    itemValue.className = "card-detail-value";
    itemValue.textContent = value;
    item.append(itemLabel, itemValue);
    cardPreviewDetails.append(item);
  });
}

function emptySlot() {
  const slot = themeCardSlot;
  slot.replaceChildren();
  slot.classList.add("is-empty");
  slot.style.removeProperty("--frame-glow");
  const placeholder = document.createElement("span");
  placeholder.className = "slot-placeholder";
  placeholder.textContent = "SELECT CARD";
  slot.append(placeholder);
  slot.classList.remove("is-in-flight", "is-drop-target");
}

function clearFlight() {
  if (!activeFlight) return;
  activeFlight.animation.cancel();
  activeFlight.ghost.remove();
  activeFlight.slot.classList.remove("is-in-flight");
  activeFlight = null;
}

function showThemeName(name) {
  themeNameLabel.textContent = name;
}

function flyCardIntoSlot(sourceButton, filename, character, glow) {
  const slot = themeCardSlot;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    sourceButton.remove();
    updateOrbitPositions();
    showTitleCard(filename, character, glow);
    return;
  }
  const sourceImage = sourceButton.querySelector("img");
  const source = sourceImage.getBoundingClientRect();
  const sourceWidth = sourceImage.offsetWidth;
  const sourceHeight = sourceImage.offsetHeight;
  const sourceCenterX = source.left + source.width / 2;
  const sourceCenterY = source.top + source.height / 2;
  const sourceMatrix = new DOMMatrixReadOnly(getComputedStyle(sourceButton).transform);
  const trackMatrix = new DOMMatrixReadOnly(getComputedStyle(sourceButton.parentElement).transform);
  const sourceRotation = (Math.atan2(sourceMatrix.b, sourceMatrix.a) + Math.atan2(trackMatrix.b, trackMatrix.a)) * 180 / Math.PI;
  const target = slot.getBoundingClientRect();
  const ghost = sourceImage.cloneNode();
  ghost.className = "card-flight";
  ghost.alt = "";
  Object.assign(ghost.style, {
    left: `${sourceCenterX - sourceWidth / 2}px`, top: `${sourceCenterY - sourceHeight / 2}px`, width: `${sourceWidth}px`, height: `${sourceHeight}px`,
  });
  ghost.style.setProperty("--frame-glow", glow);
  document.body.append(ghost);
  emptySlot();
  slot.style.setProperty("--frame-glow", glow);
  slot.classList.add("is-in-flight");
  const previewImage = showTitleCard(filename, character, glow);
  previewImage.style.opacity = "0";

  const dx = target.left + target.width / 2 - sourceCenterX;
  const dy = target.top + target.height / 2 - sourceCenterY;
  const animation = ghost.animate([
    { transform: `translate(0, 0) rotate(${sourceRotation}deg)`, offset: 0 },
    { transform: `translate(${dx * .16}px, ${dy * .16 - 32}px) rotate(${sourceRotation * .72}deg)`, offset: .2 },
    { transform: `translate(${dx * .78}px, ${dy * .78 - 12}px) rotate(${sourceRotation * .15}deg)`, offset: .76 },
    { transform: `translate(${dx * .9}px, ${dy * .9 - 5}px) rotate(${sourceRotation * .05}deg)`, offset: .88 },
    { transform: `translate(${dx}px, ${dy}px) rotate(0deg)`, offset: 1 },
  ], { duration: 760, easing: "cubic-bezier(.2,.78,.22,1)", fill: "forwards" });
  sourceButton.remove();
  updateOrbitPositions();
  const flight = { animation, ghost, slot, previewImage };
  activeFlight = flight;
  animation.onfinish = () => {
    if (activeFlight !== flight) return;
    previewImage.style.opacity = "1";
    slot.classList.remove("is-in-flight");
    ghost.remove();
    activeFlight = null;
  };
  animation.oncancel = () => ghost.remove();
}

function setTheme(filename, theme, sourceButton, glow) {
  clearFlight();
  const side = darkThemes.has(theme) ? "dark" : "light";
  if (selectedThemeCardFilename && selectedThemeCardFilename !== filename) {
    const previousInfo = cards.find(([cardFilename]) => cardFilename === selectedThemeCardFilename);
    if (previousInfo) orbitTracks[darkThemes.has(previousInfo[2]) ? "dark" : "light"].append(cardButtons.get(selectedThemeCardFilename));
  }
  selectedThemeCardFilename = filename;
  document.body.dataset.theme = theme;
  document.body.dataset.tone = side;
  const cardButton = cardButtons.get(filename);
  document.querySelectorAll(".orbit-card").forEach((button) => button.setAttribute("aria-pressed", String(button === cardButton)));
  const [cardFilename, character, , frameGlow, name, details] = cards.find(([cardFilename]) => cardFilename === filename);
  showCardDetails(character, details);
  showThemeName(name);
  flyCardIntoSlot(sourceButton || cardButton, cardFilename, character, glow || frameGlow);
  try {
    localStorage.setItem("toska-page-theme", `card:${filename}`);
    localStorage.setItem("toska-selected-card", filename);
    localStorage.removeItem("toska-selected-dark-card");
    localStorage.removeItem("toska-selected-light-card");
  } catch { /* Storage can be disabled for local files. */ }
}

function setPresetTheme(theme) {
  clearFlight();
  cardPreviewNote.setAttribute("aria-hidden", "true");
  if (selectedThemeCardFilename) {
    const selectedButton = cardButtons.get(selectedThemeCardFilename);
    const selectedInfo = cards.find(([filename]) => filename === selectedThemeCardFilename);
    if (selectedInfo) orbitTracks[darkThemes.has(selectedInfo[2]) ? "dark" : "light"].append(selectedButton);
    selectedThemeCardFilename = null;
    updateOrbitPositions();
  }
  document.body.dataset.theme = theme;
  document.body.dataset.tone = theme === "dark-preset" ? "dark" : "light";
  showThemeName(theme === "dark-preset" ? "After Hours" : "Linen Glow");
  document.querySelectorAll(".mode-theme").forEach((button) => {
    button.setAttribute("aria-pressed", String(button.dataset.mode === theme));
  });
  document.querySelectorAll(".orbit-card").forEach((button) => button.setAttribute("aria-pressed", "false"));
  emptySlot();
  try { localStorage.removeItem("toska-selected-card"); } catch { /* Storage can be disabled for local files. */ }
  try { localStorage.setItem("toska-page-theme", `mode:${theme}`); } catch { /* Storage can be disabled for local files. */ }
}

for (const [filename, character, theme, frameGlow, name, details] of cards) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "orbit-card";
  button.dataset.card = filename;
  button.setAttribute("aria-label", `Use ${name} theme from ${character} card, code ${details.cardCode}, number ${details.cardNumber}, edition ${details.edition}`);
  button.setAttribute("aria-pressed", "false");
  button.draggable = true;
  button.title = `${name} · ${darkThemes.has(theme) ? "dark" : "light"} theme`;
  button.style.setProperty("--frame-glow", frameGlow);

  const image = document.createElement("img");
  image.src = cardAssetPath(filename);
  image.alt = "";
  image.loading = "lazy";
  image.decoding = "async";
  button.append(image);
  button.addEventListener("click", () => setTheme(filename, theme, button, frameGlow));
  button.addEventListener("transitionend", (event) => {
    if (event.propertyName === "transform") button.classList.remove("is-reflowing");
  });
  button.addEventListener("dragstart", (event) => event.dataTransfer.setData("text/plain", filename));
  orbitTracks[darkThemes.has(theme) ? "dark" : "light"].append(button);
  cardButtons.set(filename, button);
}

updateOrbitPositions();
window.addEventListener("resize", updateOrbitPositions);

let orbitRotations = { dark: 0, light: 0 };
try {
  const storedRotations = JSON.parse(localStorage.getItem("toska-orbit-rotations") || "{}");
  for (const side of ["dark", "light"]) {
    if (Number.isFinite(storedRotations[side])) orbitRotations[side] = storedRotations[side];
  }
} catch { /* Start at the default position if storage is unavailable. */ }

document.querySelectorAll(".orbit-side").forEach((side) => {
  const orbit = side.querySelector(".orbit");
  const sideName = side.classList.contains("dark-side") ? "dark" : "light";
  orbit.style.setProperty("--orbit-rotation", `${orbitRotations[sideName]}deg`);
  side.addEventListener("wheel", (event) => {
    event.preventDefault();
    orbitRotations[sideName] += event.deltaY > 0 ? 24 : -24;
    orbit.style.setProperty("--orbit-rotation", `${orbitRotations[sideName]}deg`);
    try { localStorage.setItem("toska-orbit-rotations", JSON.stringify(orbitRotations)); }
    catch { /* Keep the wheel usable for this page session. */ }
  }, { passive: false });
});

const savedPageTitles = { en: "Saved pages", fr: "Pages enregistrées", zh: "已保存的网站", ja: "保存したページ" };
let savedPagesByLanguage = { en: [null, null, null], fr: [null, null, null], zh: [null, null, null], ja: [null, null, null] };
let activeSavedLanguage = "en";
let editingSavedSlot = null;
try {
  const storedByLanguage = JSON.parse(localStorage.getItem("toska-saved-pages-by-language") || "null");
  if (storedByLanguage && typeof storedByLanguage === "object" && !Array.isArray(storedByLanguage)) {
    for (const language of Object.keys(savedPagesByLanguage)) {
      if (Array.isArray(storedByLanguage[language])) savedPagesByLanguage[language] = normalizeStoredPages(storedByLanguage[language]);
    }
  } else {
    const legacyPages = JSON.parse(localStorage.getItem("toska-saved-pages") || "[]");
    if (Array.isArray(legacyPages)) savedPagesByLanguage.en = normalizeStoredPages(legacyPages);
  }
} catch { /* Start with empty lists if storage is unavailable. */ }

function normalizeSavedPageUrl(value) {
  const input = value.trim();
  const url = new URL(/^https?:\/\//i.test(input) ? input : `https://${input}`);
  if (!url.hostname || !["http:", "https:"].includes(url.protocol)) throw new Error("Enter a valid website link.");
  return url.href;
}

function normalizeStoredPages(pages) {
  return Array.from({ length: 3 }, (_, index) => {
    const page = pages[index];
    if (!page || typeof page.url !== "string") return null;
    try {
      const url = normalizeSavedPageUrl(page.url);
      return { name: typeof page.name === "string" ? page.name.slice(0, 60) : "", url };
    } catch { return null; }
  });
}

function renderSavedPages() {
  const pages = savedPagesByLanguage[activeSavedLanguage];
  document.querySelector("#saved-pages-title").textContent = savedPageTitles[activeSavedLanguage];
  savedPageList.replaceChildren();
  pages.forEach((page, index) => {
    if (!page && editingSavedSlot === index) {
      const editor = document.createElement("form");
      editor.className = "saved-page-slot-form";
      const nameInput = document.createElement("input");
      nameInput.type = "text";
      nameInput.maxLength = 60;
      nameInput.autocomplete = "off";
      nameInput.placeholder = "Site name (optional)";
      nameInput.setAttribute("aria-label", "Site name (optional)");
      const urlInput = document.createElement("input");
      urlInput.type = "text";
      urlInput.inputMode = "url";
      urlInput.autocomplete = "url";
      urlInput.placeholder = "example.com";
      urlInput.required = true;
      urlInput.setAttribute("aria-label", "Website link");
      const actions = document.createElement("div");
      actions.className = "saved-page-slot-actions";
      const save = document.createElement("button");
      save.type = "submit";
      save.textContent = "Save";
      const cancel = document.createElement("button");
      cancel.type = "button";
      cancel.className = "saved-page-slot-cancel";
      cancel.textContent = "Cancel";
      cancel.addEventListener("click", () => { editingSavedSlot = null; renderSavedPages(); });
      editor.addEventListener("submit", (event) => {
        event.preventDefault();
        try {
          pages[index] = { name: nameInput.value.trim(), url: normalizeSavedPageUrl(urlInput.value) };
          editingSavedSlot = null;
          persistSavedPages();
          renderSavedPages();
        } catch {
          urlInput.setCustomValidity("Enter a valid website link.");
          urlInput.reportValidity();
        }
      });
      urlInput.addEventListener("input", () => urlInput.setCustomValidity(""));
      actions.append(save, cancel);
      editor.append(nameInput, urlInput, actions);
      savedPageList.append(editor);
      nameInput.focus();
      return;
    }

    if (!page) {
      const empty = document.createElement("button");
      empty.type = "button";
      empty.className = "saved-page-item saved-page-empty-slot";
      empty.setAttribute("aria-label", `Fill saved site slot ${index + 1}`);
      const plus = document.createElement("span");
      plus.className = "saved-page-mark";
      plus.setAttribute("aria-hidden", "true");
      plus.textContent = "+";
      const label = document.createElement("span");
      label.className = "saved-page-slot-label";
      label.textContent = "Empty slot";
      empty.append(plus, label);
      empty.addEventListener("click", () => { editingSavedSlot = index; renderSavedPages(); });
      savedPageList.append(empty);
      return;
    }

    const item = document.createElement("div");
    item.className = "saved-page-item";
    const title = page.name || new URL(page.url).hostname.replace(/^www\./, "");
    const mark = document.createElement("span");
    mark.className = "saved-page-mark";
    mark.setAttribute("aria-hidden", "true");
    mark.textContent = title.charAt(0).toUpperCase();
    const link = document.createElement("a");
    link.href = page.url;
    link.textContent = title;
    link.title = page.url;
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "saved-page-remove";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove ${link.textContent}`);
    remove.addEventListener("click", () => {
      pages[index] = null;
      persistSavedPages();
      renderSavedPages();
    });
    item.append(mark, remove, link);
    savedPageList.append(item);
  });
}

function persistSavedPages() {
  try {
    localStorage.setItem("toska-saved-pages-by-language", JSON.stringify(savedPagesByLanguage));
    localStorage.setItem("toska-saved-pages", JSON.stringify(savedPagesByLanguage.en));
  }
  catch { /* Keep the current list usable for this page session. */ }
}

savedPageToggles.forEach((toggle) => toggle.addEventListener("click", () => {
  const language = toggle.dataset.language;
  const wasOpen = savedPagesPanel.dataset.open === "true";
  const isSameTab = activeSavedLanguage === language;
  const shouldOpen = !(wasOpen && isSameTab);
  const previousTop = mainSection.getBoundingClientRect().top;
  if (shouldOpen) {
    if (activeSavedLanguage !== language) editingSavedSlot = null;
    activeSavedLanguage = language;
    renderSavedPages();
  }
  savedPageToggles.forEach((button) => {
    button.setAttribute("aria-expanded", String(shouldOpen && button.dataset.language === language));
  });
  savedPagesPanel.dataset.open = String(shouldOpen);
  savedPagesPanel.setAttribute("aria-hidden", String(!shouldOpen));
  document.querySelector("#saved-pages-content").inert = !shouldOpen;
  requestAnimationFrame(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const shift = previousTop - mainSection.getBoundingClientRect().top;
    if (Math.abs(shift) < 1) return;
    mainSection.animate([
      { transform: `translateY(${shift}px)` },
      { transform: "translateY(0)" },
    ], { duration: 420, easing: "cubic-bezier(.2,.75,.25,1)" });
  });
}));

renderSavedPages();

const quickLinkSlots = [...document.querySelectorAll(".quick-link-slot")];
const quickLinksKey = "toska-quick-links";
const quickLinkDialog = document.querySelector("#quick-link-dialog");
const quickLinkForm = document.querySelector("#quick-link-form");
const quickLinkNameInput = document.querySelector("#quick-link-name");
const quickLinkUrlInput = document.querySelector("#quick-link-url");
const quickLinkError = document.querySelector("#quick-link-error");
let editingQuickLinkSlot = null;

function readQuickLinks() {
  try {
    const stored = JSON.parse(localStorage.getItem(quickLinksKey) || "null");
    if (Array.isArray(stored)) return Array.from({ length: quickLinkSlots.length }, (_, index) => {
      const item = stored[index];
      if (!item || typeof item.url !== "string") return null;
      try {
        const url = normalizeSavedPageUrl(item.url);
        return { name: typeof item.name === "string" && item.name.trim() ? item.name.slice(0, 60) : new URL(url).hostname.replace(/^www\./, ""), url };
      } catch { return null; }
    });
    const legacy = JSON.parse(localStorage.getItem("toska-custom-quick-link") || "null");
    if (legacy && typeof legacy.url === "string") {
      const url = normalizeSavedPageUrl(legacy.url);
      return Array.from({ length: quickLinkSlots.length }, (_, index) => index === 0 ? { name: legacy.name || new URL(url).hostname.replace(/^www\./, ""), url } : null);
    }
  } catch { /* Start with empty slots if storage is unavailable or invalid. */ }
  return Array(quickLinkSlots.length).fill(null);
}

let quickLinks = readQuickLinks();

function saveQuickLinks() {
  try { localStorage.setItem(quickLinksKey, JSON.stringify(quickLinks)); }
  catch { /* Keep the shortcuts available for this page session. */ }
}

function renderQuickLinks() {
  quickLinkSlots.forEach((slot, index) => {
    const saved = quickLinks[index];
    const content = document.createElement(saved ? "a" : "button");
    content.className = `quick-link${saved ? " quick-link-custom" : " quick-link-add"}`;
    if (saved) {
      content.href = saved.url;
      content.target = "_blank";
      content.rel = "noopener noreferrer";
      content.title = `${saved.name} · Right-click to remove`;
      content.setAttribute("aria-label", saved.name);
      const icon = document.createElement("img");
      icon.className = "quick-link-icon";
      icon.alt = "";
      icon.referrerPolicy = "no-referrer";
      const site = new URL(saved.url);
      icon.src = `${site.origin}/favicon.ico`;
      icon.onerror = () => {
        if (icon.dataset.fallback) icon.hidden = true;
        else {
          icon.dataset.fallback = "true";
          icon.src = `https://www.google.com/s2/favicons?domain=${encodeURIComponent(site.hostname)}&sz=64`;
        }
      };
      const label = document.createElement("span");
      label.className = "quick-link-sr-only";
      label.textContent = saved.name;
      content.append(icon, label);
      const remove = document.createElement("button");
      remove.className = "quick-link-remove";
      remove.type = "button";
      remove.textContent = "×";
      remove.title = `Remove ${saved.name}`;
      remove.setAttribute("aria-label", `Remove ${saved.name} from quick links`);
      remove.addEventListener("click", () => {
        quickLinks[index] = null;
        saveQuickLinks();
        renderQuickLinks();
      });
      slot.replaceChildren(content, remove);
      return;
    } else {
      content.type = "button";
      content.title = "Add a website";
      content.setAttribute("aria-label", "Add a website");
      const plus = document.createElement("span");
      plus.setAttribute("aria-hidden", "true");
      plus.textContent = "+";
      content.append(plus);
      content.addEventListener("click", () => {
        editingQuickLinkSlot = index;
        quickLinkForm.reset();
        quickLinkError.textContent = "";
        quickLinkDialog.showModal();
        quickLinkUrlInput.focus();
      });
    }
    slot.replaceChildren(content);
  });
}

document.querySelector("#quick-link-cancel").addEventListener("click", () => quickLinkDialog.close());
quickLinkDialog.addEventListener("close", () => { editingQuickLinkSlot = null; });
quickLinkForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (editingQuickLinkSlot === null) return;
  try {
    const url = normalizeSavedPageUrl(quickLinkUrlInput.value);
    const hostname = new URL(url).hostname.replace(/^www\./, "");
    quickLinks[editingQuickLinkSlot] = { name: quickLinkNameInput.value.trim().slice(0, 60) || hostname, url };
    saveQuickLinks();
    renderQuickLinks();
    quickLinkDialog.close();
  } catch {
    quickLinkError.textContent = "Enter a valid website address, like example.com.";
    quickLinkUrlInput.focus();
  }
});

renderQuickLinks();

themeCardSlot.addEventListener("dragenter", () => themeCardSlot.classList.add("is-drop-target"));
themeCardSlot.addEventListener("dragover", (event) => event.preventDefault());
themeCardSlot.addEventListener("dragleave", (event) => {
  if (!themeCardSlot.contains(event.relatedTarget)) themeCardSlot.classList.remove("is-drop-target");
});
themeCardSlot.addEventListener("drop", (event) => {
  event.preventDefault();
  themeCardSlot.classList.remove("is-drop-target");
  const card = cards.find(([filename]) => filename === event.dataTransfer.getData("text/plain"));
  if (card) setTheme(card[0], card[2], cardButtons.get(card[0]), card[3]);
});

document.querySelectorAll(".mode-theme").forEach((button) => {
  button.addEventListener("click", () => setPresetTheme(button.dataset.mode));
});

let storedTheme = "";
try {
  storedTheme = localStorage.getItem("toska-page-theme") || "";
} catch { /* Use the default card if storage is unavailable. */ }

if (!storedTheme) {
  storedTheme = `card:${cards[0][0]}`;
  try { localStorage.setItem("toska-page-theme", storedTheme); }
  catch { /* Keep the default card for this page session. */ }
}

if (storedTheme.startsWith("mode:") && ["light-preset", "dark-preset"].includes(storedTheme.slice(5))) {
  setPresetTheme(storedTheme.slice(5));
} else {
  const savedCard = storedTheme.startsWith("card:") ? storedTheme.slice(5) : "";
  const savedCardInfo = cards.find(([filename]) => filename === savedCard);
  if (savedCardInfo) {
    const [filename, character, theme, glow, name] = savedCardInfo;
    document.body.dataset.theme = theme;
    document.body.dataset.tone = darkThemes.has(theme) ? "dark" : "light";
    selectedThemeCardFilename = filename;
    showThemeName(name);
    showCardDetails(character, savedCardInfo[5]);
    cardButtons.get(filename)?.setAttribute("aria-pressed", "true");
    cardButtons.get(filename)?.remove();
    updateOrbitPositions();
    showTitleCard(filename, character, glow);
  }
  else setPresetTheme("light-preset");
}

const engines = {
  google: { mark: "G", url: "https://www.google.com/search?q=" },
  youtube: { mark: "▶", url: "https://www.youtube.com/results?search_query=" },
};

function syncEngineMark() {
  engineMark.textContent = engines[engineSelect.value].mark;
  engineMark.setAttribute("aria-label", `${engineSelect.value} selected`);
  engineLabel.textContent = engineSelect.value === "youtube" ? "YouTube" : "Google";
  engineOptions.forEach((option) => option.setAttribute("aria-checked", String(option.dataset.engine === engineSelect.value)));
}

function setEngineMenuOpen(open, restoreFocus = false) {
  engineMenu.hidden = !open;
  enginePicker.setAttribute("aria-expanded", String(open));
  if (restoreFocus) enginePicker.focus();
}

enginePicker.addEventListener("click", () => setEngineMenuOpen(engineMenu.hidden));
engineOptions.forEach((option) => option.addEventListener("click", () => {
  engineSelect.value = option.dataset.engine;
  syncEngineMark();
  setEngineMenuOpen(false, true);
}));
document.addEventListener("pointerdown", (event) => {
  if (!engineMenu.hidden && !event.target.closest(".engine-control")) setEngineMenuOpen(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !engineMenu.hidden) setEngineMenuOpen(false, true);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const phrase = queryInput.value.trim();
  if (!phrase) {
    queryInput.focus();
    return;
  }

  let engine = engineSelect.value;
  let searchPhrase = phrase;
  const prefix = phrase.match(/^(g|yt)\s+(.+)$/i);
  if (prefix) {
    engine = prefix[1].toLowerCase() === "yt" ? "youtube" : "google";
    searchPhrase = prefix[2].trim();
  }
  if (!searchPhrase) return;

  window.location.assign(engines[engine].url + encodeURIComponent(searchPhrase));
});

syncEngineMark();

const clockTime = document.querySelector("#clock-time");
const clockTimezone = document.querySelector("#clock-timezone");
let clockOffset = 7 * 60;
try {
  const savedOffset = localStorage.getItem("toska-clock-gmt-offset");
  if (savedOffset !== null) {
    const minutes = Number(savedOffset);
    if (Number.isInteger(minutes) && minutes >= -720 && minutes <= 840) clockOffset = minutes;
  } else {
    const savedZone = localStorage.getItem("toska-clock-timezone");
    if (savedZone) {
      const offsetName = new Intl.DateTimeFormat("en", { timeZone: savedZone, timeZoneName: "longOffset" }).formatToParts().find(part => part.type === "timeZoneName").value;
      const offset = offsetName.match(/^GMT([+-])(\d{2}):(\d{2})$/);
      if (offsetName === "GMT") clockOffset = 0;
      else if (offset) clockOffset = (offset[1] === "+" ? 1 : -1) * (Number(offset[2]) * 60 + Number(offset[3]));
    }
  }
} catch { /* Use GMT+7 when storage or a previous timezone is unavailable. */ }
const clockOffsets = Array.from({ length: 27 }, (_, index) => (index - 12) * 60);
if (!clockOffsets.includes(clockOffset)) clockOffsets.push(clockOffset);
clockOffsets.sort((a, b) => a - b);
for (const minutes of clockOffsets) {
  const option = document.createElement("option");
  option.value = String(minutes);
  const hours = Math.floor(Math.abs(minutes) / 60);
  const remainder = Math.abs(minutes) % 60;
  option.textContent = `GMT${minutes < 0 ? "-" : "+"}${hours}${remainder ? `:${String(remainder).padStart(2, "0")}` : ""}`;
  clockTimezone.append(option);
}
clockTimezone.value = String(clockOffset);
const clockFormatter = new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });
function updateClock() {
  const now = new Date();
  clockTime.textContent = clockFormatter.format(new Date(now.getTime() + clockOffset * 60000));
  clockTime.dateTime = now.toISOString();
}
clockTimezone.addEventListener("change", () => {
  clockOffset = Number(clockTimezone.value);
  try { localStorage.setItem("toska-clock-gmt-offset", String(clockOffset)); } catch { /* Keep the choice for this visit. */ }
  updateClock();
});
updateClock();
setInterval(() => { if (!document.hidden) updateClock(); }, 1000);
document.addEventListener("visibilitychange", () => { if (!document.hidden) updateClock(); });

const musicAudio = document.querySelector("#music-audio");
const musicPlay = document.querySelector("#music-play");
const musicSeek = document.querySelector("#music-seek");
const musicVolume = document.querySelector("#music-volume");
const musicPosition = document.querySelector("#music-position");
const musicStatus = document.querySelector("#music-status");
function formatMusicTime(seconds) {
  const value = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(value / 60)}:${String(value % 60).padStart(2, "0")}`;
}
function updateMusicPosition() {
  const duration = musicAudio.duration;
  musicSeek.disabled = !Number.isFinite(duration) || duration <= 0;
  const fraction = musicSeek.disabled ? 0 : musicAudio.currentTime / duration;
  musicSeek.value = String(Math.round(fraction * 1000));
  musicSeek.style.setProperty("--progress", `${fraction * 100}%`);
  musicPosition.textContent = `${formatMusicTime(musicAudio.currentTime)} / ${formatMusicTime(duration)}`;
  musicSeek.setAttribute("aria-valuetext", `${formatMusicTime(musicAudio.currentTime)} of ${formatMusicTime(duration)}`);
}
function updateMusicPlay() {
  const playing = !musicAudio.paused && !musicAudio.ended;
  musicPlay.firstElementChild.textContent = playing ? "Ⅱ" : "▶";
  musicPlay.setAttribute("aria-label", playing ? "Pause Lengya" : "Play Lengya");
  musicPlay.setAttribute("aria-pressed", String(playing));
}
musicPlay.addEventListener("click", async () => {
  if (!musicAudio.paused) { musicAudio.pause(); return; }
  musicStatus.hidden = true;
  try { await musicAudio.play(); }
  catch {
    musicStatus.textContent = "Unable to play Lengya. Please try again.";
    musicStatus.hidden = false;
  }
});
for (const event of ["play", "pause", "ended"]) musicAudio.addEventListener(event, updateMusicPlay);
for (const event of ["loadedmetadata", "durationchange", "timeupdate", "emptied"]) musicAudio.addEventListener(event, updateMusicPosition);
musicAudio.addEventListener("error", () => {
  musicStatus.textContent = "The music file could not be loaded.";
  musicStatus.hidden = false;
  updateMusicPlay();
});
musicSeek.addEventListener("input", () => {
  if (Number.isFinite(musicAudio.duration)) musicAudio.currentTime = Number(musicSeek.value) / 1000 * musicAudio.duration;
  updateMusicPosition();
});
function updateMusicVolume() {
  musicAudio.volume = Number(musicVolume.value) / 100;
  musicVolume.style.setProperty("--progress", `${musicVolume.value}%`);
  musicVolume.setAttribute("aria-valuetext", `${musicVolume.value}%`);
}
musicVolume.addEventListener("input", updateMusicVolume);
updateMusicVolume();
updateMusicPosition();

