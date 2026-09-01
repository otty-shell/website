import assert from "node:assert/strict";
import { JSDOM } from "jsdom";

function loadProductLanding(landingHtml, { reducedMotion = false } = {}) {
  let now = 0;
  let nextTimerId = 1;
  let isReducedMotion = reducedMotion;
  const timers = new Map();
  const mediaActions = [];
  const mediaQueryListeners = new Set();

  const dom = new JSDOM(landingHtml, {
    url: "https://otty.run/",
    pretendToBeVisual: true,
    runScripts: "dangerously",
    beforeParse(window) {
      window.matchMedia = () => ({
        get matches() {
          return isReducedMotion;
        },
        media: "(prefers-reduced-motion: reduce)",
        onchange: null,
        addEventListener(type, listener) {
          if (type === "change") mediaQueryListeners.add(listener);
        },
        removeEventListener(type, listener) {
          if (type === "change") mediaQueryListeners.delete(listener);
        },
        addListener() {},
        removeListener() {},
        dispatchEvent() {
          return true;
        },
      });
      window.setTimeout = (callback, delay = 0) => {
        const timerId = nextTimerId++;
        timers.set(timerId, { callback, dueAt: now + Number(delay) });
        return timerId;
      };
      window.clearTimeout = (timerId) => timers.delete(timerId);
      Object.defineProperty(window.HTMLMediaElement.prototype, "paused", {
        configurable: true,
        get() {
          return this.dataset.testPlaying !== "true";
        },
      });
      window.HTMLMediaElement.prototype.play = function play() {
        this.dataset.testPlaying = "true";
        mediaActions.push({ action: "play", media: this });
        this.dispatchEvent(new window.Event("play"));
        return Promise.resolve();
      };
      window.HTMLMediaElement.prototype.pause = function pause() {
        this.dataset.testPlaying = "false";
        mediaActions.push({ action: "pause", media: this });
        this.dispatchEvent(new window.Event("pause"));
      };
    },
  });

  return {
    dom,
    mediaActions,
    setReducedMotion(matches) {
      isReducedMotion = matches;
      for (const listener of mediaQueryListeners) listener({ matches });
    },
    advanceMilliseconds(milliseconds) {
      const target = now + milliseconds;
      while (true) {
        const nextTimer = [...timers.entries()]
          .filter(([, timer]) => timer.dueAt <= target)
          .sort((left, right) => left[1].dueAt - right[1].dueAt)[0];
        if (!nextTimer) break;
        const [timerId, timer] = nextTimer;
        timers.delete(timerId);
        now = timer.dueAt;
        timer.callback();
      }
      now = target;
    },
  };
}

function elementsByRole(document, role) {
  return [...document.querySelectorAll(`[role="${role}"]`)];
}

function hasHiddenAncestor(element) {
  for (let ancestor = element.parentElement; ancestor; ancestor = ancestor.parentElement) {
    if (ancestor.hidden) return true;
  }
  return false;
}

export function assertCapabilitySequenceBehavior(landingHtml) {
  const rendered = loadProductLanding(landingHtml);
  const renderedLanding = rendered.dom.window.document;
  const tablists = elementsByRole(renderedLanding, "tablist");
  assert.equal(tablists.length, 1);
  assert.equal(tablists[0].getAttribute("aria-label"), "Current Capabilities");
  assert.equal(hasHiddenAncestor(tablists[0]), false);

  const tabs = elementsByRole(renderedLanding, "tab");
  const panels = elementsByRole(renderedLanding, "tabpanel");
  assert.deepEqual(
    tabs.map((tab) => tab.getAttribute("aria-label")),
    ["Workspace", "Command blocks", "Explorer", "Quick Launch"],
  );
  assert.equal(tabs[0].getAttribute("aria-selected"), "true");
  assert.equal(tabs[0].tabIndex, 0);
  assert.equal(panels[0].hidden, false);
  for (let index = 1; index < tabs.length; index += 1) {
    assert.equal(tabs[index].getAttribute("aria-selected"), "false");
    assert.equal(tabs[index].tabIndex, -1);
    assert.equal(panels[index].hidden, true);
  }

  tabs[1].click();
  assert.equal(tabs[1].getAttribute("aria-selected"), "true");
  assert.equal(panels[1].hidden, false);
  assert.equal(panels[0].hidden, true);

  tabs[1].focus();
  tabs[1].dispatchEvent(
    new rendered.dom.window.KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }),
  );
  assert.equal(renderedLanding.activeElement, tabs[2]);
  assert.equal(tabs[2].getAttribute("aria-selected"), "true");
  assert.equal(panels[2].hidden, false);

  tabs[2].dispatchEvent(
    new rendered.dom.window.KeyboardEvent("keydown", { key: "End", bubbles: true }),
  );
  assert.equal(renderedLanding.activeElement, tabs[3]);
  assert.equal(tabs[3].getAttribute("aria-selected"), "true");
  tabs[3].dispatchEvent(
    new rendered.dom.window.KeyboardEvent("keydown", { key: "Home", bubbles: true }),
  );
  assert.equal(renderedLanding.activeElement, tabs[0]);
  assert.equal(tabs[0].getAttribute("aria-selected"), "true");

  const timedLanding = loadProductLanding(landingHtml);
  const timedDocument = timedLanding.dom.window.document;
  const timedTabs = elementsByRole(timedDocument, "tab");
  const sequence = elementsByRole(timedDocument, "group").find(
    (group) => group.getAttribute("aria-label") === "Current Capabilities sequence",
  );
  assert.ok(sequence);
  assert.equal(timedDocument.querySelector("[aria-live]"), null);

  const focusBeforeAutomaticChange = timedDocument.activeElement;
  timedLanding.advanceMilliseconds(5_999);
  assert.equal(timedTabs[0].getAttribute("aria-selected"), "true");
  timedLanding.advanceMilliseconds(1);
  assert.equal(timedTabs[1].getAttribute("aria-selected"), "true");
  assert.equal(timedDocument.activeElement, focusBeforeAutomaticChange);

  sequence.dispatchEvent(new timedLanding.dom.window.MouseEvent("mouseenter"));
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[1].getAttribute("aria-selected"), "true");
  sequence.dispatchEvent(new timedLanding.dom.window.MouseEvent("mouseleave"));
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[2].getAttribute("aria-selected"), "true");

  timedTabs[2].focus();
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[2].getAttribute("aria-selected"), "true");
  const documentationLink = [...timedDocument.querySelectorAll("a")].find(
    (link) => link.textContent.trim() === "Documentation",
  );
  assert.ok(documentationLink);
  documentationLink.focus();
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[3].getAttribute("aria-selected"), "true");
  assert.equal(timedDocument.activeElement, documentationLink);

  const sequenceToggle = [...timedDocument.querySelectorAll("button")].find(
    (button) => button.getAttribute("aria-label") === "Pause automatic capability changes",
  );
  assert.ok(sequenceToggle);
  sequenceToggle.click();
  assert.equal(sequenceToggle.getAttribute("aria-label"), "Play automatic capability changes");
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[3].getAttribute("aria-selected"), "true");
  sequenceToggle.click();
  assert.equal(sequenceToggle.getAttribute("aria-label"), "Pause automatic capability changes");
  timedLanding.advanceMilliseconds(6_000);
  assert.equal(timedTabs[0].getAttribute("aria-selected"), "true");

  const motionLanding = loadProductLanding(landingHtml);
  const motionDocument = motionLanding.dom.window.document;
  const videos = [...motionDocument.querySelectorAll("video")];
  const mediaProgress = motionDocument.querySelector("[data-sequence-progress]");
  assert.ok(mediaProgress);
  assert.equal(mediaProgress.style.width, "0%");
  assert.equal(videos[0].hidden, false);
  assert.equal(videos[0].muted, true);
  assert.equal(videos[0].loop, true);
  assert.equal(videos[0].playsInline, true);
  assert.equal(videos[0].paused, false);
  assert.equal(motionLanding.mediaActions[0]?.action, "play");
  for (const video of videos.slice(1)) {
    assert.equal(video.hidden, true);
    assert.equal(video.paused, true);
  }

  Object.defineProperty(videos[0], "duration", { configurable: true, value: 40 });
  videos[0].currentTime = 10;
  videos[0].dispatchEvent(new motionLanding.dom.window.Event("timeupdate"));
  assert.equal(mediaProgress.style.width, "25%");

  const motionTabs = elementsByRole(motionDocument, "tab");
  videos[1].currentTime = 8;
  motionTabs[1].click();
  assert.equal(videos[1].currentTime, 0);
  assert.equal(mediaProgress.style.width, "0%");
  Object.defineProperty(videos[1], "duration", { configurable: true, value: 32 });
  videos[1].currentTime = 16;
  videos[1].dispatchEvent(new motionLanding.dom.window.Event("timeupdate"));
  assert.equal(mediaProgress.style.width, "50%");
  motionTabs[0].click();
  assert.equal(videos[0].currentTime, 0);
  assert.equal(mediaProgress.style.width, "0%");

  const automaticMediaLanding = loadProductLanding(landingHtml);
  const automaticMediaDocument = automaticMediaLanding.dom.window.document;
  const automaticMediaTabs = elementsByRole(automaticMediaDocument, "tab");
  const automaticMediaVideos = [...automaticMediaDocument.querySelectorAll("video")];
  automaticMediaVideos[1].currentTime = 8;
  automaticMediaLanding.advanceMilliseconds(6_000);
  assert.equal(automaticMediaTabs[1].getAttribute("aria-selected"), "true");
  assert.equal(automaticMediaVideos[1].currentTime, 0);

  const workspaceMediaToggle = [...motionDocument.querySelectorAll("button")].find(
    (button) => button.getAttribute("aria-label") === "Pause Workspace recording",
  );
  assert.ok(workspaceMediaToggle);
  assert.equal(workspaceMediaToggle.hidden, false);
  workspaceMediaToggle.click();
  assert.equal(videos[0].paused, true);
  assert.equal(workspaceMediaToggle.getAttribute("aria-label"), "Play Workspace recording");
  workspaceMediaToggle.click();
  assert.equal(videos[0].paused, false);
  assert.equal(workspaceMediaToggle.getAttribute("aria-label"), "Pause Workspace recording");

  videos[0].dispatchEvent(new motionLanding.dom.window.Event("error"));
  assert.equal(videos[0].hidden, true);
  assert.equal(workspaceMediaToggle.hidden, true);
  const failedFigure = videos[0].closest("figure");
  assert.ok(failedFigure);
  assert.match(
    failedFigure.querySelector("img")?.getAttribute("alt") ?? "",
    /OTTY workspace with Claude Code and htop tabs/,
  );
  assert.match(failedFigure.textContent, /A terminal tab is opened/);

  const reducedLanding = loadProductLanding(landingHtml, { reducedMotion: true });
  const reducedDocument = reducedLanding.dom.window.document;
  const reducedTabs = elementsByRole(reducedDocument, "tab");
  const reducedVideos = [...reducedDocument.querySelectorAll("video")];
  const reducedSequenceToggle = [...reducedDocument.querySelectorAll("button")].find(
    (button) => button.getAttribute("aria-label") === "Play automatic capability changes",
  );
  assert.ok(reducedSequenceToggle);
  assert.equal(reducedSequenceToggle.disabled, true);
  assert.equal(reducedLanding.mediaActions.some(({ action }) => action === "play"), false);
  for (const video of reducedVideos) assert.equal(video.hidden, true);
  reducedLanding.advanceMilliseconds(12_000);
  assert.equal(reducedTabs[0].getAttribute("aria-selected"), "true");
  reducedTabs[1].click();
  assert.equal(reducedTabs[1].getAttribute("aria-selected"), "true");

  const reducedMediaToggle = [...reducedDocument.querySelectorAll("button")].find(
    (button) => button.getAttribute("aria-label") === "Play Command blocks recording",
  );
  assert.ok(reducedMediaToggle);
  reducedMediaToggle.click();
  assert.equal(reducedVideos[1].hidden, false);
  assert.equal(reducedVideos[1].paused, false);
  assert.equal(reducedMediaToggle.getAttribute("aria-label"), "Pause Command blocks recording");

  const changingPreference = loadProductLanding(landingHtml);
  const changingDocument = changingPreference.dom.window.document;
  const changingTabs = elementsByRole(changingDocument, "tab");
  const changingVideos = [...changingDocument.querySelectorAll("video")];
  changingPreference.setReducedMotion(true);
  assert.equal(changingVideos[0].hidden, true);
  assert.equal(changingVideos[0].paused, true);
  changingPreference.advanceMilliseconds(6_000);
  assert.equal(changingTabs[0].getAttribute("aria-selected"), "true");
  changingPreference.setReducedMotion(false);
  changingPreference.advanceMilliseconds(6_000);
  assert.equal(changingTabs[1].getAttribute("aria-selected"), "true");
}
