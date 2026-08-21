// TYO web analytics beacon — posts page views to the store-monitor ingest
// (first-party, cookieless: the server derives visitor identity from a
// daily-rotating salted hash; nothing persistent is stored on the device).
// Fail-silent: must never throw into page code, never runs on the server.

const ENDPOINT =
  process.env.NEXT_PUBLIC_TRACK_ENDPOINT ||
  "https://store-api.tyo.com.au/api/store-monitor/track";
const SESSION_ID_KEY = "tyo_sm_sid";
const SESSION_FLAG = "tyo_sm_session";

function randomId() {
  try {
    if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  } catch {
    /* fall through */
  }
  return `s-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

let fallbackSessionId = null;

function getSessionId() {
  try {
    let sid = window.sessionStorage.getItem(SESSION_ID_KEY);
    if (!sid) {
      sid = randomId();
      window.sessionStorage.setItem(SESSION_ID_KEY, sid);
    }
    return sid;
  } catch {
    if (!fallbackSessionId) fallbackSessionId = randomId();
    return fallbackSessionId;
  }
}

function isFirstOfSession() {
  try {
    if (window.sessionStorage.getItem(SESSION_FLAG)) return false;
    window.sessionStorage.setItem(SESSION_FLAG, "1");
    return true;
  } catch {
    return false;
  }
}

function send(payload) {
  try {
    const body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    /* never break the page */
  }
}

function buildPayload(event) {
  const payload = { event, sessionId: getSessionId() };
  try {
    payload.hostname = window.location.hostname;
    payload.url = String(window.location.href).slice(0, 1024);
    if (document.referrer) payload.referrer = String(document.referrer).slice(0, 1024);
    if (navigator.language) payload.language = navigator.language;
    if (window.screen && window.screen.width) {
      payload.screen = `${window.screen.width}x${window.screen.height}`;
    }
  } catch {
    /* partial context is fine */
  }
  return payload;
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  try {
    if (isFirstOfSession()) send(buildPayload("session_started"));
    send(buildPayload("page_view"));
  } catch {
    /* never break the page */
  }
}
