/* eslint-disable */
"use client";
// @ts-nocheck
import { useState, useRef, useCallback, useEffect } from "react";



/* ============================================================
   SatsEarn — Affiliate / Promo Hub
   Modeled on the CryptoTab affiliate structure, rebuilt in the
   SatsEarn brand and copy rules.

   Sections:
     1. Share To Earn modal (promo post + image + social row)
     2. Brand resources (icon / logo / UI screens)
     3. Generate Banners (theme / size / language + style + PNG)
     4. Images for promo posts (Rectangle / Square / Stories)
     5. Texts for promo posts (ready-made, honest copy)
     6. Additional landing pages
     7. Promo videos (placeholder until assets exist)

   Brand tokens (canonical):
     orange #f7931a  bg #04040a  surf #0d0d16  surf2 #141420
     sats green #3dffaa  dim #7778aa  txt #fff
   Copy rules: no projections, no counts, no hype superlatives,
   L1 referral only, creator program separate. No fabricated
   assets (videos / screenshots are marked placeholders).
   ============================================================ */

const C = {
  or: "#f7931a",
  bg: "#060608",
  or2: "#ffb347",
  org: "rgba(247,147,26,0.15)",
  bg2: "#0a0a0f",
  surf: "#0f0f18",
  surf2: "#141420",
  txt: "#f0f0f0",
  txt2: "#c4c4d6",
  dim: "#aeaec6",
  faint: "#7a7a96",
  grn: "#22c55e",
  line: "rgba(247,147,26,0.12)",
  line2: "rgba(247,147,26,0.22)",
};

const REF_BASE = "https://satsearn.app/?ref=";
const DEMO_CODE = "14261EDD";
const TAGLINE = "Stack Sats. No Buying Required.";
const SUBLINE = "Earn real Bitcoin over Lightning.";

// Distinct banner copy — line1 (white), line2 (orange), sub. Each banner uses one.
const TAGLINES = [
  { l1: "Stack Sats.", l2: "No Buying Required.", sub: "Earn real Bitcoin over Lightning" },
  { l1: "Earn Bitcoin", l2: "by Doing Simple Tasks", sub: "Quizzes, streaks and games — paid in sats" },
  { l1: "Stack Sats Daily,", l2: "Bit by Bit", sub: "Small actions, real Bitcoin over Lightning" },
  { l1: "Stack Sats,", l2: "Not Excuses", sub: "Start earning Bitcoin today — no deposit" },
  { l1: "Earn Bitcoin", l2: "Instead of Buying It", sub: "The easiest way in — paid over Lightning" },
  { l1: "From Task", l2: "to Sats", sub: "Complete, earn, withdraw over Lightning" },
];

function copyText(text) {
  const done = () => window.dispatchEvent(new CustomEvent("se-copied"));
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}
function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.focus();
  ta.select();
  try { document.execCommand("copy"); done(); } catch (e) {}
  document.body.removeChild(ta);
}


/* ---- Canonical zap mark (exact path from live site nav/referral) ---- */
function Zap({ size = 28, fill = C.or }) {
  return (
    <svg width={size} height={(size * 72) / 56} viewBox="0 0 56 72" aria-hidden="true" style={{ flexShrink: 0 }}>
      <path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z" fill={fill} />
    </svg>
  );
}

/* ---- SatsEarn app icon: bolt + 3 speed lines (matches logo.png) ---- */
function AppIcon({ size = 56, circle = true, boltFill = C.or }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" aria-hidden="true" style={{ flexShrink: 0 }}>
      {circle && <circle cx="256" cy="256" r="256" fill="#0a0a0a" />}
      <g transform="translate(150 150) scale(2.55)">
        <path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z" fill={boltFill} />
      </g>
      <rect x="300" y="186" width="86" height="20" rx="10" fill={boltFill} />
      <rect x="318" y="246" width="64" height="20" rx="10" fill={boltFill} />
      <rect x="300" y="306" width="50" height="20" rx="10" fill={boltFill} />
    </svg>
  );
}


/* ============================================================
   SOCIAL ICONS — official current marks (Simple Icons, CC0/MIT)
   White glyph on brand-color circle.
   ============================================================ */
const BRAND_ICONS = {
  "X": { hex: "#000000", path: "M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z" },
  "Telegram": { hex: "#26A5E4", path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" },
  "WhatsApp": { hex: "#25D366", path: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" },
  "Reddit": { hex: "#FF4500", path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z" },
  "Facebook": { hex: "#0866FF", path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" },
  "Messenger": { hex: "#0866FF", path: "M12 0C5.24 0 0 4.952 0 11.64c0 3.499 1.434 6.521 3.769 8.61a.96.96 0 0 1 .323.683l.065 2.135a.96.96 0 0 0 1.347.85l2.381-1.053a.96.96 0 0 1 .641-.046A13 13 0 0 0 12 23.28c6.76 0 12-4.952 12-11.64S18.76 0 12 0m6.806 7.44c.522-.03.971.567.63 1.094l-4.178 6.457a.707.707 0 0 1-.977.208l-3.87-2.504a.44.44 0 0 0-.49.007l-4.363 3.01c-.637.438-1.415-.317-.995-.966l4.179-6.457a.706.706 0 0 1 .977-.21l3.87 2.505c.15.097.344.094.491-.007l4.362-3.008a.7.7 0 0 1 .364-.13" },
  "Pinterest": { hex: "#BD081C", path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" },
  "Discord": { hex: "#5865F2", path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" },
  "Threads": { hex: "#000000", path: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" },
  "Mastodon": { hex: "#6364FF", path: "M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C17.51.242 15.792 0 11.813 0h-.03c-3.98 0-4.835.242-5.288.309C3.882.692 1.496 2.518.917 5.127.64 6.412.61 7.837.661 9.143c.074 1.874.088 3.745.26 5.611.118 1.24.325 2.47.62 3.68.55 2.237 2.777 4.098 4.96 4.857 2.336.792 4.849.923 7.256.38.265-.061.527-.132.786-.213.585-.184 1.27-.39 1.774-.753a.057.057 0 0 0 .023-.043v-1.809a.052.052 0 0 0-.02-.041.053.053 0 0 0-.046-.01 20.282 20.282 0 0 1-4.709.545c-2.73 0-3.463-1.284-3.674-1.818a5.593 5.593 0 0 1-.319-1.433.053.053 0 0 1 .066-.054c1.517.363 3.072.546 4.632.546.376 0 .75 0 1.125-.01 1.57-.044 3.224-.124 4.768-.422.038-.008.077-.015.11-.024 2.435-.464 4.753-1.92 4.989-5.604.008-.145.03-1.52.03-1.67.002-.512.167-3.63-.024-5.545zm-3.748 9.195h-2.561V8.29c0-1.309-.55-1.976-1.67-1.976-1.23 0-1.846.79-1.846 2.35v3.403h-2.546V8.663c0-1.56-.617-2.35-1.848-2.35-1.112 0-1.668.668-1.67 1.977v6.218H4.822V8.102c0-1.31.337-2.35 1.011-3.12.696-.77 1.608-1.164 2.74-1.164 1.311 0 2.302.5 2.962 1.498l.638 1.06.638-1.06c.66-.999 1.65-1.498 2.96-1.498 1.13 0 2.043.395 2.74 1.164.675.77 1.012 1.81 1.012 3.12z" },
  "Signal": { hex: "#3B45FD", path: "M12 0q-.934 0-1.83.139l.17 1.111a11 11 0 0 1 3.32 0l.172-1.111A12 12 0 0 0 12 0M9.152.34A12 12 0 0 0 5.77 1.742l.584.961a10.8 10.8 0 0 1 3.066-1.27zm5.696 0-.268 1.094a10.8 10.8 0 0 1 3.066 1.27l.584-.962A12 12 0 0 0 14.848.34M12 2.25a9.75 9.75 0 0 0-8.539 14.459c.074.134.1.292.064.441l-1.013 4.338 4.338-1.013a.62.62 0 0 1 .441.064A9.7 9.7 0 0 0 12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25m-7.092.068a12 12 0 0 0-2.59 2.59l.909.664a11 11 0 0 1 2.345-2.345zm14.184 0-.664.909a11 11 0 0 1 2.345 2.345l.909-.664a12 12 0 0 0-2.59-2.59M1.742 5.77A12 12 0 0 0 .34 9.152l1.094.268a10.8 10.8 0 0 1 1.269-3.066zm20.516 0-.961.584a10.8 10.8 0 0 1 1.27 3.066l1.093-.268a12 12 0 0 0-1.402-3.383M.138 10.168A12 12 0 0 0 0 12q0 .934.139 1.83l1.111-.17A11 11 0 0 1 1.125 12q0-.848.125-1.66zm23.723.002-1.111.17q.125.812.125 1.66c0 .848-.042 1.12-.125 1.66l1.111.172a12.1 12.1 0 0 0 0-3.662M1.434 14.58l-1.094.268a12 12 0 0 0 .96 2.591l-.265 1.14 1.096.255.36-1.539-.188-.365a10.8 10.8 0 0 1-.87-2.35m21.133 0a10.8 10.8 0 0 1-1.27 3.067l.962.584a12 12 0 0 0 1.402-3.383zm-1.793 3.848a11 11 0 0 1-2.345 2.345l.664.909a12 12 0 0 0 2.59-2.59zm-19.959 1.1L.357 21.48a1.8 1.8 0 0 0 2.162 2.161l1.954-.455-.256-1.095-1.953.455a.675.675 0 0 1-.81-.81l.454-1.954zm16.832 1.769a10.8 10.8 0 0 1-3.066 1.27l.268 1.093a12 12 0 0 0 3.382-1.402zm-10.94.213-1.54.36.256 1.095 1.139-.266c.814.415 1.683.74 2.591.961l.268-1.094a10.8 10.8 0 0 1-2.35-.869zm3.634 1.24-.172 1.111a12.1 12.1 0 0 0 3.662 0l-.17-1.111q-.812.125-1.66.125a11 11 0 0 1-1.66-.125" },
  "VK": { hex: "#0077FF", path: "m9.489.004.729-.003h3.564l.73.003.914.01.433.007.418.011.403.014.388.016.374.021.36.025.345.03.333.033c1.74.196 2.933.616 3.833 1.516.9.9 1.32 2.092 1.516 3.833l.034.333.029.346.025.36.02.373.025.588.012.41.013.644.009.915.004.98-.001 3.313-.003.73-.01.914-.007.433-.011.418-.014.403-.016.388-.021.374-.025.36-.03.345-.033.333c-.196 1.74-.616 2.933-1.516 3.833-.9.9-2.092 1.32-3.833 1.516l-.333.034-.346.029-.36.025-.373.02-.588.025-.41.012-.644.013-.915.009-.98.004-3.313-.001-.73-.003-.914-.01-.433-.007-.418-.011-.403-.014-.388-.016-.374-.021-.36-.025-.345-.03-.333-.033c-1.74-.196-2.933-.616-3.833-1.516-.9-.9-1.32-2.092-1.516-3.833l-.034-.333-.029-.346-.025-.36-.02-.373-.025-.588-.012-.41-.013-.644-.009-.915-.004-.98.001-3.313.003-.73.01-.914.007-.433.011-.418.014-.403.016-.388.021-.374.025-.36.03-.345.033-.333c.196-1.74.616-2.933 1.516-3.833.9-.9 2.092-1.32 3.833-1.516l.333-.034.346-.029.36-.025.373-.02.588-.025.41-.012.644-.013.915-.009ZM6.79 7.3H4.05c.13 6.24 3.25 9.99 8.72 9.99h.31v-3.57c2.01.2 3.53 1.67 4.14 3.57h2.84c-.78-2.84-2.83-4.41-4.11-5.01 1.28-.74 3.08-2.54 3.51-4.98h-2.58c-.56 1.98-2.22 3.78-3.8 3.95V7.3H10.5v6.92c-1.6-.4-3.62-2.34-3.71-6.92Z" },
  "Tumblr": { hex: "#36465D", path: "M14.563 24c-5.093 0-7.031-3.756-7.031-6.411V9.747H5.116V6.648c3.63-1.313 4.512-4.596 4.71-6.469C9.84.051 9.941 0 9.999 0h3.517v6.114h4.801v3.633h-4.82v7.47c.016 1.001.375 2.371 2.207 2.371h.09c.631-.02 1.486-.205 1.936-.419l1.156 3.425c-.436.636-2.4 1.374-4.156 1.404h-.178l.011.002z" },
  "Line": { hex: "#00C300", path: "M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" },
  "Viber": { hex: "#7360F2", path: "M11.4 0C9.473.028 5.333.344 3.02 2.467 1.302 4.187.696 6.7.633 9.817.57 12.933.488 18.776 6.12 20.36h.003l-.004 2.416s-.037.977.61 1.177c.777.242 1.234-.5 1.98-1.302.407-.44.972-1.084 1.397-1.58 3.85.326 6.812-.416 7.15-.525.776-.252 5.176-.816 5.892-6.657.74-6.02-.36-9.83-2.34-11.546-.596-.55-3.006-2.3-8.375-2.323 0 0-.395-.025-1.037-.017zm.058 1.693c.545-.004.88.017.88.017 4.542.02 6.717 1.388 7.222 1.846 1.675 1.435 2.53 4.868 1.906 9.897v.002c-.604 4.878-4.174 5.184-4.832 5.395-.28.09-2.882.737-6.153.524 0 0-2.436 2.94-3.197 3.704-.12.12-.26.167-.352.144-.13-.033-.166-.188-.165-.414l.02-4.018c-4.762-1.32-4.485-6.292-4.43-8.895.054-2.604.543-4.738 1.996-6.173 1.96-1.773 5.474-2.018 7.11-2.03zm.38 2.602c-.167 0-.303.135-.304.302 0 .167.133.303.3.305 1.624.01 2.946.537 4.028 1.592 1.073 1.046 1.62 2.468 1.633 4.334.002.167.14.3.307.3.166-.002.3-.138.3-.304-.014-1.984-.618-3.596-1.816-4.764-1.19-1.16-2.692-1.753-4.447-1.765zm-3.96.695c-.19-.032-.4.005-.616.117l-.01.002c-.43.247-.816.562-1.146.932-.002.004-.006.004-.008.008-.267.323-.42.638-.46.948-.008.046-.01.093-.007.14 0 .136.022.27.065.4l.013.01c.135.48.473 1.276 1.205 2.604.42.768.903 1.5 1.446 2.186.27.344.56.673.87.984l.132.132c.31.308.64.6.984.87.686.543 1.418 1.027 2.186 1.447 1.328.733 2.126 1.07 2.604 1.206l.01.014c.13.042.265.064.402.063.046.002.092 0 .138-.008.31-.036.627-.19.948-.46.004 0 .003-.002.008-.005.37-.33.683-.72.93-1.148l.003-.01c.225-.432.15-.842-.18-1.12-.004 0-.698-.58-1.037-.83-.36-.255-.73-.492-1.113-.71-.51-.285-1.032-.106-1.248.174l-.447.564c-.23.283-.657.246-.657.246-3.12-.796-3.955-3.955-3.955-3.955s-.037-.426.248-.656l.563-.448c.277-.215.456-.737.17-1.248-.217-.383-.454-.756-.71-1.115-.25-.34-.826-1.033-.83-1.035-.137-.165-.31-.265-.502-.297zm4.49.88c-.158.002-.29.124-.3.282-.01.167.115.312.282.324 1.16.085 2.017.466 2.645 1.15.63.688.93 1.524.906 2.57-.002.168.13.306.3.31.166.003.305-.13.31-.297.025-1.175-.334-2.193-1.067-2.994-.74-.81-1.777-1.253-3.05-1.346h-.024zm.463 1.63c-.16.002-.29.127-.3.287-.008.167.12.31.288.32.523.028.875.175 1.113.422.24.245.388.62.416 1.164.01.167.15.295.318.287.167-.008.295-.15.287-.317-.03-.644-.215-1.178-.58-1.557-.367-.378-.893-.574-1.52-.607h-.018z" },
  "Snapchat": { hex: "#FFFC00", path: "M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.003.06c-.012.18-.022.345-.03.51.075.045.203.09.401.09.3-.016.659-.12 1.033-.301.165-.088.344-.104.464-.104.182 0 .359.029.509.09.45.149.734.479.734.838.015.449-.39.839-1.213 1.168-.089.029-.209.075-.344.119-.45.135-1.139.36-1.333.81-.09.224-.061.524.12.868l.015.015c.06.136 1.526 3.475 4.791 4.014.255.044.435.27.42.509 0 .075-.015.149-.045.225-.24.569-1.273.988-3.146 1.271-.059.091-.12.375-.164.57-.029.179-.074.36-.134.553-.076.271-.27.405-.555.405h-.03c-.135 0-.313-.031-.538-.074-.36-.075-.765-.135-1.273-.135-.3 0-.599.015-.913.074-.6.104-1.123.464-1.723.884-.853.599-1.826 1.288-3.294 1.288-.06 0-.119-.015-.18-.015h-.149c-1.468 0-2.427-.675-3.279-1.288-.599-.42-1.107-.779-1.707-.884-.314-.045-.629-.074-.928-.074-.54 0-.958.089-1.272.149-.211.043-.391.074-.54.074-.374 0-.523-.224-.583-.42-.061-.192-.09-.389-.135-.567-.046-.181-.105-.494-.166-.57-1.918-.222-2.95-.642-3.189-1.226-.031-.063-.052-.15-.055-.225-.015-.243.165-.465.42-.509 3.264-.54 4.73-3.879 4.791-4.02l.016-.029c.18-.345.224-.645.119-.869-.195-.434-.884-.658-1.332-.809-.121-.029-.24-.074-.346-.119-1.107-.435-1.257-.93-1.197-1.273.09-.479.674-.793 1.168-.793.146 0 .27.029.383.074.42.194.789.3 1.104.3.234 0 .384-.06.465-.105l-.046-.569c-.098-1.626-.225-3.651.307-4.837C7.392 1.077 10.739.807 11.727.807l.419-.015h.06z" }
};
function shareUrl(name, link, title, text) {
  const u = encodeURIComponent(link);
  const t = encodeURIComponent(title);
  const full = encodeURIComponent(`${title}\n\n${text}\n\n${link}`);
  switch (name) {
    case "X": return `https://twitter.com/intent/tweet?text=${full}`;
    case "Telegram": return `https://t.me/share/url?url=${u}&text=${encodeURIComponent(title + "\n" + text)}`;
    case "WhatsApp": return `https://wa.me/?text=${full}`;
    case "Reddit": return `https://www.reddit.com/submit?url=${u}&title=${t}`;
    case "Facebook": return `https://www.facebook.com/sharer/sharer.php?u=${u}&quote=${t}`;
    case "Messenger": return `https://www.facebook.com/dialog/send?link=${u}&app_id=0&redirect_uri=${u}`;
    case "Pinterest": return `https://pinterest.com/pin/create/button/?url=${u}&description=${t}`;
    case "Tumblr": return `https://www.tumblr.com/share/link?url=${u}&name=${t}`;
    case "VK": return `https://vk.com/share.php?url=${u}&title=${t}`;
    case "Line": return `https://social-plugins.line.me/lineit/share?url=${u}`;
    case "Mastodon": return `https://mastodonshare.com/?text=${full}`;
    case "Threads": return `https://www.threads.net/intent/post?text=${full}`;
    case "Viber": return `viber://forward?text=${full}`;
    case "Signal": return `https://signal.me/`;
    case "Snapchat": return `https://www.snapchat.com/`;
    case "Discord": return null; // no web share intent — copy instead
    default: return null;
  }
}

function SocialIcon({ name, link, title, text, onCopyFallback }) {
  const ic = BRAND_ICONS[name];
  if (!ic) return null;
  const url = shareUrl(name, link, title, text);
  const circle = {
    width: 40, height: 40, borderRadius: "50%", background: ic.hex,
    display: "flex", alignItems: "center", justifyContent: "center",
    textDecoration: "none", cursor: "pointer", flexShrink: 0,
    border: ic.hex === "#000000" ? "1px solid #2a2a2a" : "none",
  };
  const glyph = (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={name === "Snapchat" ? "#000" : "#fff"} aria-hidden="true">
      <path d={ic.path} />
    </svg>
  );
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" title={`Share on ${name}`} style={circle}>
        {glyph}
      </a>
    );
  }
  // No web intent: copy the message so the user can paste into that app
  return (
    <button title={`Copy for ${name}`} style={{ ...circle, border: circle.border || "none" }} onClick={() => onCopyFallback && onCopyFallback()}>
      {glyph}
    </button>
  );
}

function SocialRow({ link, title, text }) {
  const order = ["X", "Telegram", "WhatsApp", "Reddit", "Facebook", "Messenger", "Pinterest", "Discord", "Threads", "Mastodon", "Signal", "VK", "Tumblr", "Line", "Viber", "Snapchat"];
  const message = `${title}\n\n${text}\n\n${link}`;

  const copyMsg = () => copyText(message);

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url: link });
      } catch (e) { /* user cancelled */ }
    } else {
      copyMsg();
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        {order.map((name) => (
          <SocialIcon key={name} name={name} link={link} title={title} text={text} onCopyFallback={copyMsg} />
        ))}
        {/* Native share — orange, opens the device share sheet */}
        <button
          onClick={nativeShare}
          title="More — open your device share menu"
          style={{
            width: 40, height: 40, borderRadius: "50%", background: C.or,
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "none", cursor: "pointer", flexShrink: 0,
            boxShadow: "0 0 12px rgba(247,147,26,0.4)",
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
            <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" /><line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   COPY ROW
   ============================================================ */
function CopyRow({ link, small = false }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    copyText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div style={{ display: "flex", gap: 6, width: "100%" }}>
      <div
        style={{
          flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 7,
          padding: small ? "7px 9px" : "10px 12px", color: C.grn, fontFamily: "monospace",
          fontSize: small ? 10 : 13, overflow: "hidden", textOverflow: "ellipsis",
          whiteSpace: "nowrap", display: "flex", alignItems: "center",
        }}
      >
        {link}
      </div>
      <button
        onClick={copy}
        style={{
          background: C.or, color: "#000", border: "none", borderRadius: 7,
          padding: small ? "7px 12px" : "10px 20px", fontWeight: 900,
          fontSize: small ? 11 : 13, cursor: "pointer", whiteSpace: "nowrap",
        }}
      >
        {copied ? "✓ Copied" : "Copy"}
      </button>
    </div>
  );
}


/* ============================================================
   BANNER ENGINE — spec + canvas + preview
   Styles: Bolt (dark, orange), Glow (dark, orange gradient),
           Outline (dark, framed).  Solid removed per feedback.
   ============================================================ */
const SIZES = [
  { id: "leaderboard", label: "Leaderboard", w: 728, h: 90 },
  { id: "billboard", label: "Billboard", w: 970, h: 250 },
  { id: "rectangle", label: "Medium Rectangle", w: 300, h: 250 },
  { id: "square", label: "Square", w: 500, h: 500 },
  { id: "skyscraper", label: "Wide Skyscraper", w: 160, h: 600 },
  { id: "halfpage", label: "Half Page", w: 300, h: 600 },
  { id: "banner120", label: "Square 120", w: 120, h: 600 },
  { id: "mobilebanner", label: "Mobile Banner", w: 320, h: 50 },
  { id: "largemobile", label: "Large Mobile", w: 320, h: 100 },
];
const STYLES = [
  { id: "bolt", label: "Bolt" },
  { id: "glow", label: "Glow" },
  { id: "outline", label: "Outline" },
];
// Background scenes layered behind copy. "none" = clean.
const SCENES = ["coins", "blobs", "mockup", "none"];

function spec(size, styleId) {
  const { w, h } = size;
  const ratio = w / h;
  const mode = h <= 60 ? "strip" : ratio <= 0.5 ? "tower" : (ratio >= 2.4 && h <= 140 && w >= 600) ? "strip" : "block";
  let bg, fg, accent, sub, boltFill, ctaBg, ctaFg, border, glow;
  if (styleId === "outline") {
    bg = C.bg; fg = "#fff"; accent = C.or; sub = "#d4d4e4"; boltFill = C.or;
    ctaBg = "transparent"; ctaFg = C.or; border = C.or; glow = false;
  } else if (styleId === "glow") {
    bg = "#070710"; fg = "#fff"; accent = C.or; sub = "#b9b9d8"; boltFill = C.or;
    ctaBg = C.or; ctaFg = "#000"; border = "rgba(247,147,26,0.4)"; glow = true;
  } else {
    bg = C.bg; fg = "#fff"; accent = C.or; sub = "#d4d4e4"; boltFill = C.or;
    ctaBg = C.or; ctaFg = "#000"; border = "rgba(247,147,26,0.25)"; glow = false;
  }
  return { mode, bg, fg, accent, sub, boltFill, ctaBg, ctaFg, border, glow, styleId };
}

function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  if (r < 0) r = 0;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function boltPath(ctx, cx, cy, r, fill) {
  // Canonical zap path (viewBox 0 0 56 72), centered at (cx,cy), scaled to radius r.
  const p = new Path2D("M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z");
  ctx.save();
  const scale = (r * 2) / 70;
  ctx.translate(cx - 28 * scale, cy - 36 * scale);
  ctx.scale(scale, scale);
  if (fill) ctx.fillStyle = fill;
  ctx.fill(p);
  ctx.restore();
}

// Product app-icon (bolt + 3 speed lines) on canvas, centered at (cx,cy), radius r.
function appIconCanvas(ctx, cx, cy, r, fill) {
  // native icon space is 512; scale to fit ~2r box centered
  const sc = (r * 2) / 360;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(sc, sc);
  ctx.translate(-256, -256);
  boltPath(ctx, 256 - 40, 256, 100, fill);
  ctx.fillStyle = fill;
  roundRect(ctx, 300, 186, 86, 20, 10); ctx.fill();
  roundRect(ctx, 318, 246, 64, 20, 10); ctx.fill();
  roundRect(ctx, 300, 306, 50, 20, 10); ctx.fill();
  ctx.restore();
}

// Logo lockup: icon + "SatsEarn", centered at (cx,cy), scaled to fit maxW.
function logoLockupCanvas(ctx, cx, cy, rWanted, maxW, iconFill, txtFill, accent) {
  // total = icon(2r) + gap(0.5r) + text(~SatsEarn at 1.5r). Solve r so total <= maxW.
  ctx.font = `900 ${Math.round(rWanted * 1.5)}px Arial, sans-serif`;
  const tWunit = ctx.measureText("SatsEarn").width / rWanted; // text width per unit r
  const totalUnit = 2 + 0.5 + tWunit; // total width in units of r
  const r = Math.min(rWanted, maxW / totalUnit);
  const gap = r * 0.5;
  ctx.font = `900 ${Math.round(r * 1.5)}px Arial, sans-serif`;
  const tW = ctx.measureText("SatsEarn").width;
  const total = r * 2 + gap + tW;
  const startX = cx - total / 2;
  appIconCanvas(ctx, startX + r, cy, r, iconFill);
  ctx.textAlign = "left"; ctx.textBaseline = "middle";
  const tx = startX + r * 2 + gap;
  ctx.fillStyle = txtFill; ctx.fillText("Sats", tx, cy);
  const sW = ctx.measureText("Sats").width;
  ctx.fillStyle = accent; ctx.fillText("Earn", tx + sW, cy);
  ctx.textAlign = "center";
}

function drawMark(ctx, w, h, mark, pos, iconFill, txtFill, accent) {
  const base = Math.min(w, h);
  if (mark === "logo") {
    const titleFs = Math.min(base * 0.1, (w * 0.9) / (19 * 0.55));
    const r = titleFs / 1.5;
    logoLockupCanvas(ctx, w / 2, h * 0.17, r, w * 0.9, iconFill, txtFill, accent);
    return;
  }
  const r = base * 0.13;
  if (pos === "left") appIconCanvas(ctx, w * 0.18, h * 0.2, r, iconFill);
  else if (pos === "right") appIconCanvas(ctx, w * 0.82, h * 0.2, r, iconFill);
  else appIconCanvas(ctx, w / 2, h * 0.21, r, iconFill);
}

// Bitcoin coin: orange disc + ₿ glyph. r = radius.
function coinCanvas(ctx, cx, cy, r, alpha = 1) {
  ctx.save();
  ctx.globalAlpha = alpha;
  const g = ctx.createLinearGradient(cx, cy - r, cx, cy + r);
  g.addColorStop(0, "#ffb347");
  g.addColorStop(1, "#f7931a");
  ctx.fillStyle = g;
  ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = "rgba(255,255,255,0.92)";
  ctx.font = `900 ${Math.round(r * 1.3)}px Arial, sans-serif`;
  ctx.textAlign = "center"; ctx.textBaseline = "middle";
  ctx.fillText("\u20bf", cx, cy + r * 0.04);
  ctx.restore();
}
// Deterministic PRNG so a banner always renders identically.
function seeded(seed) {
  let s = seed % 2147483647; if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}
// Background scene behind the copy. Keeps a clear central band for text.
function drawScene(ctx, w, h, scene, accent) {
  if (scene === "none") return;
  const base = Math.min(w, h);
  if (scene === "blobs") {
    const blob = (cx, cy, r, col, a) => {
      ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = col;
      ctx.beginPath(); ctx.ellipse(cx, cy, r, r * 0.78, 0.5, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    };
    blob(w * 0.12, h * 0.85, base * 0.5, accent, 0.1);
    blob(w * 0.9, h * 0.15, base * 0.42, "#3b82f6", 0.08);
    blob(w * 0.85, h * 0.9, base * 0.36, accent, 0.07);
  }
  if (scene === "coins") {
    const rnd = seeded(Math.round(w * 31 + h * 7));
    const n = Math.max(3, Math.round((w * h) / 70000));
    let placed = 0, tries = 0;
    while (placed < n && tries < n * 8) {
      tries++;
      const x = rnd() * w, y = rnd() * h;
      // skip the central text band (28%–88% height, middle 70% width)
      const inTextBand = y > h * 0.28 && y < h * 0.92 && x > w * 0.12 && x < w * 0.88;
      if (inTextBand) continue;
      const r = base * (0.03 + rnd() * 0.035);
      coinCanvas(ctx, x, y, r, 0.1 + rnd() * 0.08);
      placed++;
    }
  }
  if (scene === "mockup") {
    // small dim phone tucked into the right edge; only on banners wide enough
    if (w < base * 1.4) return; // skip on square/tall — would sit behind text
    const mpw = h * 0.34, mph = mpw * 2.0;
    if (mph > h * 0.96) return;
    const px = w - mpw * 0.62, py = h / 2 - mph / 2;
    ctx.save();
    ctx.globalAlpha = 0.35;
    ctx.fillStyle = "#15151f"; roundRect(ctx, px, py, mpw, mph, mpw * 0.12); ctx.fill();
    ctx.strokeStyle = "rgba(247,147,26,0.3)"; ctx.lineWidth = Math.max(1, mpw * 0.012);
    roundRect(ctx, px, py, mpw, mph, mpw * 0.12); ctx.stroke();
    ctx.fillStyle = accent; roundRect(ctx, px + mpw * 0.12, py + mph * 0.12, mpw * 0.5, mph * 0.035, mph * 0.02); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.14)";
    for (let i = 0; i < 4; i++) { roundRect(ctx, px + mpw * 0.12, py + mph * 0.24 + i * mph * 0.12, mpw * 0.76, mph * 0.055, mph * 0.02); ctx.fill(); }
    ctx.restore();
  }
}

// Draw a bolt glyph immediately before centered CTA text, as one centered unit.
function ctaWithBolt(ctx, label, cx, cy, fontPx, color) {
  ctx.font = `900 ${Math.round(fontPx)}px Arial, sans-serif`;
  const textW = ctx.measureText(label).width;
  const boltR = fontPx * 0.42;
  const gap = fontPx * 0.3;
  const totalW = boltR * 2 + gap + textW;
  const startX = cx - totalW / 2;
  // bolt on the left
  boltPath(ctx, startX + boltR, cy, boltR, color);
  // text after the bolt
  const prevAlign = ctx.textAlign;
  ctx.textAlign = "left";
  ctx.fillStyle = color;
  ctx.fillText(label, startX + boltR * 2 + gap, cy);
  ctx.textAlign = prevAlign;
}

function drawBanner(canvas, size, styleId, copy = TAGLINES[0], scene = "none", mark = "icon", markPos = "top") {
  const { w, h } = size;
  const s = spec(size, styleId);
  const ctx = canvas.getContext("2d");
  canvas.width = w;
  canvas.height = h;
  const base = Math.min(w, h);

  ctx.fillStyle = s.bg;
  ctx.fillRect(0, 0, w, h);

  if (s.glow) {
    const g1 = ctx.createRadialGradient(w * 0.15, h * 0.9, 0, w * 0.15, h * 0.9, Math.max(w, h) * 0.85);
    g1.addColorStop(0, "rgba(247,147,26,0.32)");
    g1.addColorStop(1, "transparent");
    ctx.fillStyle = g1;
    ctx.fillRect(0, 0, w, h);
    const g2 = ctx.createRadialGradient(w * 0.9, h * 0.1, 0, w * 0.9, h * 0.1, Math.max(w, h) * 0.6);
    g2.addColorStop(0, "rgba(247,147,26,0.14)");
    g2.addColorStop(1, "transparent");
    ctx.fillStyle = g2;
    ctx.fillRect(0, 0, w, h);
  } else if (styleId !== "outline") {
    const g = ctx.createRadialGradient(w * 0.18, h * 0.92, 0, w * 0.18, h * 0.92, Math.max(w, h) * 0.75);
    g.addColorStop(0, "rgba(247,147,26,0.16)");
    g.addColorStop(1, "transparent");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  }

  const bw = Math.max(1, Math.round(base * (styleId === "outline" ? 0.014 : 0.008)));
  ctx.strokeStyle = s.border;
  ctx.lineWidth = bw;
  ctx.strokeRect(bw / 2, bw / 2, w - bw, h - bw);

  drawScene(ctx, w, h, scene, C.or);

  ctx.textBaseline = "middle";

  if (s.mode === "strip") {
    const pad = h * 0.18;
    const iconR = h * 0.32;
    const iconCx = pad + iconR;
    appIconCanvas(ctx, iconCx, h / 2, iconR, s.boltFill);
    let tx = iconCx + iconR + h * 0.22;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    if (mark === "logo") {
      const lfs = h * 0.32;
      ctx.font = `900 ${lfs}px Arial, sans-serif`;
      ctx.fillStyle = s.fg; ctx.fillText("Sats", tx, h * 0.5);
      const sW = ctx.measureText("Sats").width;
      ctx.fillStyle = s.accent; ctx.fillText("Earn", tx + sW, h * 0.5);
      tx = tx + sW + ctx.measureText("Earn").width + h * 0.3;
    }
    ctx.font = `900 ${Math.round(h * 0.3)}px Arial, sans-serif`;
    ctx.fillStyle = s.fg;
    ctx.fillText(copy.l1, tx, h * 0.34);
    ctx.fillStyle = s.accent;
    ctx.fillText(copy.l2, tx, h * 0.68);
    ctx.textBaseline = "alphabetic";
    {
      // compact CTA fits even narrow strips
      const cw = Math.min(w * 0.28, h * 3.4);
      const ch = h * 0.56;
      const cx = w - cw - pad;
      const cy = (h - ch) / 2;
      if (s.ctaBg === "transparent") {
        ctx.strokeStyle = s.accent; ctx.lineWidth = Math.max(1, h * 0.025);
        roundRect(ctx, cx, cy, cw, ch, ch * 0.5); ctx.stroke();
      } else {
        ctx.fillStyle = s.ctaBg; roundRect(ctx, cx, cy, cw, ch, ch * 0.5); ctx.fill();
      }
      ctaWithBolt(ctx, w >= 480 ? "Start Earning" : "Start", cx + cw / 2, h / 2, h * 0.26, s.ctaFg);
      ctx.textAlign = "center";
    }
  } else if (s.mode === "tower") {
    const cx = w / 2;
    ctx.textAlign = "center";
    const iconR = w * 0.22;
    appIconCanvas(ctx, cx, h * 0.14, iconR, s.boltFill);
    if (mark === "logo") {
      const lfs = Math.round(w * 0.16);
      ctx.font = `900 ${lfs}px Arial, sans-serif`;
      ctx.textBaseline = "middle";
      const sW = ctx.measureText("Sats").width, eW = ctx.measureText("Earn").width;
      const lx = cx - (sW + eW) / 2;
      ctx.fillStyle = s.fg; ctx.textAlign = "left"; ctx.fillText("Sats", lx, h * 0.25);
      ctx.fillStyle = s.accent; ctx.fillText("Earn", lx + sW, h * 0.25);
      ctx.textAlign = "center";
    }
    const longest = Math.max(copy.l1.length, copy.l2.length);
    const t1 = Math.round(Math.min(w * 0.12, (w * 0.9) / (longest * 0.55)));
    ctx.font = `900 ${t1}px Arial, sans-serif`;
    ctx.fillStyle = s.fg;
    ctx.fillText(copy.l1, cx, h * 0.36);
    ctx.fillStyle = s.accent;
    ctx.fillText(copy.l2, cx, h * 0.36 + t1 * 1.15);
    ctx.fillStyle = s.sub;
    ctx.font = `600 ${Math.round(w * 0.062)}px Arial, sans-serif`;
    ctx.fillText("Earn real", cx, h * 0.6);
    ctx.fillText("Bitcoin", cx, h * 0.6 + w * 0.072);
    const cw = w * 0.78, ch = w * 0.2, ccx = (w - cw) / 2, ccy = h * 0.73;
    if (s.ctaBg === "transparent") {
      ctx.strokeStyle = s.accent; ctx.lineWidth = Math.max(1, w * 0.018);
      roundRect(ctx, ccx, ccy, cw, ch, ch * 0.5); ctx.stroke();
    } else {
      ctx.fillStyle = s.ctaBg; roundRect(ctx, ccx, ccy, cw, ch, ch * 0.5); ctx.fill();
    }
    ctaWithBolt(ctx, "Start", cx, ccy + ch / 2, w * 0.085, s.ctaFg);
    ctx.fillStyle = s.sub;
    ctx.font = `600 ${Math.round(w * 0.058)}px Arial, sans-serif`;
    ctx.fillText("satsearn.app", cx, h * 0.91);
  } else {
    const cx = w / 2;
    ctx.textAlign = "center";
    drawMark(ctx, w, h, mark, markPos, s.boltFill, s.fg, s.accent);
    // Title sized so the longest line fits ~90% width.
    const longest = Math.max(copy.l1.length, copy.l2.length);
    const widthCap = (w * 0.9) / (longest * 0.55);
    const t1 = Math.round(Math.min(base * 0.1, widthCap));
    ctx.font = `900 ${t1}px Arial, sans-serif`;
    ctx.fillStyle = s.fg;
    ctx.fillText(copy.l1, cx, h * 0.42);
    ctx.fillStyle = s.accent;
    ctx.fillText(copy.l2, cx, h * 0.42 + t1 * 1.15);
    ctx.fillStyle = s.sub;
    ctx.font = `600 ${Math.round(base * 0.05)}px Arial, sans-serif`;
    ctx.fillText(copy.sub, cx, h * 0.62);
    const cw = w * 0.52, ch = base * 0.13, ccx = (w - cw) / 2, ccy = h * 0.72;
    if (s.ctaBg === "transparent") {
      ctx.strokeStyle = s.accent; ctx.lineWidth = Math.max(1, base * 0.012);
      roundRect(ctx, ccx, ccy, cw, ch, ch * 0.5); ctx.stroke();
    } else {
      ctx.fillStyle = s.ctaBg; roundRect(ctx, ccx, ccy, cw, ch, ch * 0.5); ctx.fill();
    }
    ctaWithBolt(ctx, "Start Earning", cx, ccy + ch / 2, base * 0.06, s.ctaFg);
    ctx.fillStyle = s.sub;
    ctx.font = `600 ${Math.round(base * 0.045)}px Arial, sans-serif`;
    ctx.fillText("satsearn.app", cx, h * 0.88);
  }
}

function BannerPreview({ size, styleId, box = 250, copy = TAGLINES[0], scene = "none", mark = "icon", markPos = "top" }) {
  const s = spec(size, styleId);
  const scale = box / Math.max(size.w, size.h);
  const pw = size.w * scale;
  const ph = size.h * scale;
  const u = Math.min(pw, ph);
  const Bolt = ({ px }) => (
    <svg width={px} height={px} viewBox="0 0 512 512" aria-hidden="true" style={{ flexShrink: 0 }}>
      <g transform="translate(216 256) scale(2.55) translate(-27.6 -35.6)"><path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z" fill={s.boltFill} /></g>
      <rect x="300" y="186" width="86" height="20" rx="10" fill={s.boltFill} />
      <rect x="318" y="246" width="64" height="20" rx="10" fill={s.boltFill} />
      <rect x="300" y="306" width="50" height="20" rx="10" fill={s.boltFill} />
    </svg>
  );
  // Mark = icon or full logo lockup, honoring markPos (left/right/top-center)
  const Mark = ({ px }) => {
    if (mark === "logo") {
      const titleFs = Math.min(u * 0.11, (pw * 0.9) / (Math.max(copy.l1.length, copy.l2.length) * 0.55));
      const r = titleFs / 1.5;
      const maxR = (pw * 0.9) / (1 + 0.28 + 4.0 * 0.72);
      const rr = Math.min(r, maxR);
      return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: rr * 0.28, width: "100%" }}>
          <Bolt px={rr * 1.6} />
          <span style={{ fontWeight: 900, fontSize: rr * 1.5, color: s.fg, whiteSpace: "nowrap", lineHeight: 1 }}>Sats<span style={{ color: s.accent }}>Earn</span></span>
        </div>
      );
    }
    const justify = markPos === "left" ? "flex-start" : markPos === "right" ? "flex-end" : "center";
    return (
      <div style={{ display: "flex", justifyContent: justify, alignItems: "center", width: "100%" }}>
        <Bolt px={px} />
      </div>
    );
  };
  const cta = (label, fs) => (
    <div style={{
      background: s.ctaBg === "transparent" ? "transparent" : `linear-gradient(180deg, ${C.or2}, ${C.or})`,
      border: s.ctaBg === "transparent" ? `1.5px solid ${s.accent}` : "none",
      color: s.ctaFg, fontWeight: 800, fontSize: fs,
      padding: `${ph * 0.035}px ${pw * 0.05}px`, borderRadius: 10, whiteSpace: "nowrap", lineHeight: 1,
      display: "inline-flex", alignItems: "center", gap: fs * 0.35,
      boxShadow: s.ctaBg === "transparent" ? "none" : "0 2px 10px rgba(247,147,26,0.25)",
    }}>
      <svg width={fs} height={fs * 1.1} viewBox="0 0 56 72" aria-hidden="true" style={{ flexShrink: 0 }}>
        <path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z" fill={s.ctaFg} />
      </svg>
      {label}
    </div>
  );
  const frame = {
    width: pw, height: ph, background: s.bg,
    border: `${styleId === "outline" ? 1.5 : 1}px solid ${s.border}`,
    borderRadius: 6, position: "relative", overflow: "hidden", boxSizing: "border-box", display: "flex",
  };
  const glowEl = s.glow ? (
    <>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 15% 90%, rgba(247,147,26,0.32), transparent 60%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 90% 10%, rgba(247,147,26,0.14), transparent 55%)", pointerEvents: "none" }} />
    </>
  ) : styleId !== "outline" ? (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 18% 92%, rgba(247,147,26,0.16), transparent 60%)", pointerEvents: "none" }} />
  ) : null;

  const Coin = ({ x, y, r, a }) => (
    <div style={{ position: "absolute", left: x - r, top: y - r, width: r * 2, height: r * 2, borderRadius: "50%", background: "linear-gradient(180deg,#ffb347,#f7931a)", opacity: a, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.9)", fontWeight: 900, fontSize: r * 1.3, pointerEvents: "none" }}>₿</div>
  );
  let sceneEl = null;
  if (scene === "blobs") {
    sceneEl = (
      <>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 12% 85%, rgba(247,147,26,0.12), transparent 45%), radial-gradient(circle at 88% 15%, rgba(59,130,246,0.1), transparent 42%)", pointerEvents: "none" }} />
      </>
    );
  } else if (scene === "coins") {
    const rnd = seeded(Math.round(pw * 31 + ph * 7));
    const n = Math.max(3, Math.round((pw * ph) / 7000));
    const coins = [];
    let placed = 0, tries = 0;
    while (placed < n && tries < n * 8) {
      tries++;
      const x = rnd() * pw, y = rnd() * ph;
      if (y > ph * 0.28 && y < ph * 0.92 && x > pw * 0.12 && x < pw * 0.88) continue;
      coins.push(<Coin key={placed} x={x} y={y} r={u * (0.035 + rnd() * 0.03)} a={0.1 + rnd() * 0.08} />);
      placed++;
    }
    sceneEl = <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>{coins}</div>;
  } else if (scene === "mockup") {
    const mph = ph * 0.68, mpw = mph * 0.5;
    if (pw >= u * 1.4 && mph < ph * 0.96) {
      sceneEl = (
        <div style={{ position: "absolute", left: pw - mpw * 0.62, top: ph / 2 - mph / 2, width: mpw, height: mph, background: "#15151f", border: `1px solid rgba(247,147,26,0.3)`, borderRadius: mpw * 0.12, opacity: 0.35, padding: mpw * 0.12, boxSizing: "border-box", pointerEvents: "none" }}>
          <div style={{ width: "50%", height: mph * 0.035, background: C.or, borderRadius: 99, marginBottom: mph * 0.05 }} />
          {[0, 1, 2, 3].map((i) => <div key={i} style={{ width: "100%", height: mph * 0.055, background: "rgba(255,255,255,0.14)", borderRadius: 4, marginBottom: mph * 0.05 }} />)}
        </div>
      );
    }
  }

  if (s.mode === "strip") {
    return (
      <div style={{ ...frame, alignItems: "center", justifyContent: "space-between", padding: `0 ${ph * 0.2}px` }}>
        {glowEl}{sceneEl}
        <div style={{ display: "flex", alignItems: "center", gap: ph * 0.18, position: "relative", zIndex: 1 }}>
          <Bolt px={ph * 0.5} />
          {mark === "logo" && <span style={{ fontWeight: 900, fontSize: ph * 0.32, color: s.fg, whiteSpace: "nowrap" }}>Sats<span style={{ color: s.accent }}>Earn</span></span>}
          <div style={{ lineHeight: 1.04 }}>
            <div style={{ color: s.fg, fontWeight: 900, fontSize: Math.max(7, ph * 0.24) }}>{copy.l1}</div>
            <div style={{ color: s.accent, fontWeight: 900, fontSize: Math.max(7, ph * 0.24) }}>{copy.l2}</div>
          </div>
        </div>
        <div style={{ position: "relative", zIndex: 1 }}>{cta(size.w >= 480 ? "Start Earning" : "Start", Math.max(6, ph * 0.24))}</div>
      </div>
    );
  }
  if (s.mode === "tower") {
    return (
      <div style={{ ...frame, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ph * 0.015, padding: pw * 0.06 }}>
        {glowEl}{sceneEl}
        <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
          <Bolt px={pw * 0.3} />
          {mark === "logo" && <div style={{ fontWeight: 900, fontSize: pw * 0.16, color: s.fg, lineHeight: 1.05, marginTop: ph * 0.004 }}>Sats<span style={{ color: s.accent }}>Earn</span></div>}
          <div style={{ color: s.fg, fontWeight: 900, fontSize: u * 0.115, lineHeight: 1.05, marginTop: ph * 0.008 }}>{copy.l1}</div>
          <div style={{ color: s.accent, fontWeight: 900, fontSize: u * 0.095, lineHeight: 1.05 }}>{copy.l2}</div>
          <div style={{ color: s.sub, fontSize: u * 0.068, marginTop: ph * 0.012, lineHeight: 1.2 }}>Earn real Bitcoin</div>
          <div style={{ marginTop: ph * 0.018, display: "flex", justifyContent: "center" }}>{cta("Start", u * 0.082)}</div>
          <div style={{ color: s.sub, fontSize: u * 0.058, marginTop: ph * 0.012 }}>satsearn.app</div>
        </div>
      </div>
    );
  }
  return (
    <div style={{ ...frame, flexDirection: "column", alignItems: "center", justifyContent: "center", gap: ph * 0.02, padding: pw * 0.05 }}>
      {glowEl}{sceneEl}
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", width: "100%" }}>
        <div style={{ marginBottom: ph * 0.01 }}><Mark px={u * 0.28} /></div>
        <div style={{ color: s.fg, fontWeight: 900, fontSize: Math.min(u * 0.11, (pw * 0.9) / (Math.max(copy.l1.length, copy.l2.length) * 0.55)), lineHeight: 1.05 }}>{copy.l1}</div>
        <div style={{ color: s.accent, fontWeight: 900, fontSize: Math.min(u * 0.11, (pw * 0.9) / (Math.max(copy.l1.length, copy.l2.length) * 0.55)), lineHeight: 1.05 }}>{copy.l2}</div>
        <div style={{ color: s.sub, fontSize: u * 0.05, marginTop: ph * 0.015 }}>{copy.sub}</div>
        <div style={{ marginTop: ph * 0.03, display: "flex", justifyContent: "center" }}>{cta("Start Earning", u * 0.06)}</div>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 1 — SHARE TO EARN (promo post composer + modal)
   ============================================================ */
const PROMO_POSTS = [
  {
    title: "Stack Sats. No Buying Required.",
    text: "New to Bitcoin and don't want to risk buying any? SatsEarn lets you earn real satoshis by doing simple tasks, quizzes and mini-games — paid straight to your Lightning wallet. No deposit, no purchase. Just stack sats.",
  },
  {
    title: "Earn real Bitcoin over Lightning",
    text: "I've been using SatsEarn to collect small amounts of Bitcoin without ever buying any. Tasks, daily streaks, quizzes — every reward is real sats sent over the Lightning Network. it&apos;s in early beta and worth a look.",
  },
  {
    title: "A simple way to start with Bitcoin",
    text: "If you've wanted to hold a little Bitcoin but weren't ready to buy, SatsEarn is a Lightning-native way to earn sats by completing tasks. You withdraw real Bitcoin — nothing to deposit first.",
  },
];

function ShareToEarn({ link }) {
  const [idx, setIdx] = useState(0);
  const [open, setOpen] = useState(false);
  const post = PROMO_POSTS[idx];
  const rotate = () => setIdx((i) => (i + 1) % PROMO_POSTS.length);

  return (
    <Section title="Share to earn" sub="Share promo posts and links to invite new users and grow your referral network.">
      <div  className="grid gap-5 md:gap-10 md:grid-cols-2">
        {/* Editable post */}
        <div className="flex flex-col gap-10 ">
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <div style={{ flex: 1, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", color: C.txt, fontWeight: 800, fontSize: 14 }}>
              {post.title}
            </div>
            <button onClick={rotate} title="Show another" style={refreshBtn}>↻</button>
          </div>
          <div style={{ background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: "12px", color: C.dim, fontSize: 13, lineHeight: 1.6, minHeight: 120 }}>
            {post.text}
          </div>
        </div>
        {/* Preview image (a banner stands in for the promo image) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 8, padding: 16 }}>
          <BannerPreview size={{ id: "promo", w: 300, h: 250 }} styleId="glow" box={230} />
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <CopyRow link={link} />
      </div>

      <div style={{ marginTop: 14, display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
        <button onClick={() => setOpen((o) => !o)} style={primaryBtn}>
          {open ? "Hide share options" : "Share post"}
        </button>
        <span style={{ color: C.dim, fontSize: 12 }}>Opens your chosen platform with the post pre-filled.</span>
      </div>

      {open && (
        <div style={{ marginTop: 14, padding: 14, background: C.bg, borderRadius: 10, border: `1px solid ${C.line}` }}>
          <SocialRow link={link} title={post.title} text={post.text} />
        </div>
      )}
    </Section>
  );
}

/* ============================================================
   SECTION 2 — BRAND RESOURCES
   ============================================================ */
function drawSpeedLines(ctx, fill) {
  // proportions from logo.png, in 512 space
  ctx.fillStyle = fill;
  roundRect(ctx, 300, 186, 86, 20, 10); ctx.fill();
  roundRect(ctx, 318, 246, 64, 20, 10); ctx.fill();
  roundRect(ctx, 300, 306, 50, 20, 10); ctx.fill();
}

function downloadAppIcon(filename, px) {
  const canvas = document.createElement("canvas");
  canvas.width = px; canvas.height = px;
  const ctx = canvas.getContext("2d");
  const scale = px / 512;
  ctx.scale(scale, scale);
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath();
  ctx.arc(256, 256, 256, 0, Math.PI * 2);
  ctx.fill();
  boltPath(ctx, 256 - 40, 256, 100, C.or); // bolt left of center
  drawSpeedLines(ctx, C.or);
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function downloadLogoLockup(filename, px) {
  const w = px, h = Math.round(px * 0.32);
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  // transparent bg; icon at left
  const iconSz = h * 0.84;
  const scale = iconSz / 512;
  ctx.save();
  ctx.translate(h * 0.08, h * 0.08);
  ctx.scale(scale, scale);
  ctx.fillStyle = "#0a0a0a";
  ctx.beginPath(); ctx.arc(256, 256, 256, 0, Math.PI * 2); ctx.fill();
  boltPath(ctx, 256 - 40, 256, 100, C.or);
  drawSpeedLines(ctx, C.or);
  ctx.restore();
  // wordmark
  ctx.textBaseline = "middle";
  ctx.textAlign = "left";
  const fs = h * 0.5;
  ctx.font = `900 ${fs}px Arial, sans-serif`;
  const tx = h + 8;
  ctx.fillStyle = "#f0f0f0";
  ctx.fillText("Sats", tx, h / 2);
  const satsW = ctx.measureText("Sats").width;
  ctx.fillStyle = C.or;
  ctx.fillText("Earn", tx + satsW, h / 2);
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function BrandResources() {
  return (
    <Section title="Brand resources" sub="Copy the icon and logo to create your own promotional content.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 14 }}>
        {/* Icon */}
        <div style={resCard}>
          <div style={{ fontWeight: 800, color: C.txt, fontSize: 14, marginBottom: 14 }}>Product icon</div>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <AppIcon size={92} />
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", fontSize: 12, flexWrap: "wrap" }}>
            <a style={resLink} onClick={() => downloadAppIcon("satsearn-icon-512.png", 512)}>512px</a>
            <a style={resLink} onClick={() => downloadAppIcon("satsearn-icon-1024.png", 1024)}>1024px</a>
            <a style={resLink} onClick={() => downloadAppIcon("satsearn-icon-2000.png", 2000)}>2000px</a>
          </div>
        </div>
        {/* Logo lockup */}
        <div style={resCard}>
          <div style={{ fontWeight: 800, color: C.txt, fontSize: 14, marginBottom: 14 }}>Product logo</div>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginBottom: 16, height: 92 }}>
            <AppIcon size={48} />
            <span style={{ fontWeight: 900, fontSize: 24, color: C.txt }}>Sats<span style={{ color: C.or }}>Earn</span></span>
          </div>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", fontSize: 12, flexWrap: "wrap" }}>
            <a style={resLink} onClick={() => downloadLogoLockup("satsearn-logo-1000.png", 1000)}>1000px</a>
            <a style={resLink} onClick={() => downloadLogoLockup("satsearn-logo-2000.png", 2000)}>2000px</a>
          </div>
        </div>
        {/* Color + font reference (real, no placeholder) */}
        <div style={resCard}>
          <div style={{ fontWeight: 800, color: C.txt, fontSize: 14, marginBottom: 14 }}>Brand colours</div>
          <div style={{ display: "flex", gap: 8, justifyContent: "center", marginBottom: 14, flexWrap: "wrap" }}>
            {[["#f7931a", "Orange"], ["#060608", "BG"], ["#0f0f18", "Surface"], ["#22c55e", "Green"]].map(([hex, name]) => (
              <div key={hex} style={{ textAlign: "center" }}>
                <div style={{ width: 40, height: 40, borderRadius: 8, background: hex, border: `1px solid ${C.line2}` }} />
                <div style={{ fontSize: 9, color: C.faint, marginTop: 4, fontFamily: "monospace" }}>{hex}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: "center", fontSize: 11, color: C.txt2, lineHeight: 1.6 }}>
            Display: <b style={{ color: C.txt }}>Satoshi</b> · Mono: <b style={{ color: C.txt }}>Space Mono</b>
          </div>
        </div>
      </div>
    </Section>
  );
}

/* ============================================================
   SECTION 3 — GENERATE BANNERS
   ============================================================ */
function GenerateBanners({ link }) {
  const [styleId, setStyleId] = useState("bolt");
  const [sizeId, setSizeId] = useState("rectangle");
  const [copyIdx, setCopyIdx] = useState(0);
  const [scene, setScene] = useState("coins");
  const [mark, setMark] = useState("icon");
  const [markPos, setMarkPos] = useState("top");
  const size = SIZES.find((s) => s.id === sizeId) || SIZES[0];
  const copy = TAGLINES[copyIdx];
  const canvasRef = useRef(null);

  const download = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBanner(canvas, size, styleId, copy, scene, mark, markPos);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `satsearn-${size.id}-${styleId}-${scene}-${size.w}x${size.h}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [size, styleId, copy, scene, mark, markPos]);

  const downloadAll = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    SIZES.forEach((sz, i) => {
      setTimeout(() => {
        drawBanner(canvas, sz, styleId, copy, scene, mark, markPos);
        const a = document.createElement("a");
        a.href = canvas.toDataURL("image/png");
        a.download = `satsearn-${sz.id}-${styleId}-${scene}-${sz.w}x${sz.h}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }, i * 350); // stagger so the browser allows multiple downloads
    });
  }, [styleId, copy, scene, mark, markPos]);

  return (
    <Section title="Generate banners" sub="Generate banners with your personal link to promote SatsEarn.">
      <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end", background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10, padding: 16, marginBottom: 18 }}>
        <Field label="Message">
          <select value={copyIdx} onChange={(e) => setCopyIdx(+e.target.value)} style={selectStyle}>
            {TAGLINES.map((t, i) => <option key={i} value={i}>{t.l1} {t.l2}</option>)}
          </select>
        </Field>
        <Field label="Style">
          <select value={styleId} onChange={(e) => setStyleId(e.target.value)} style={selectStyle}>
            {STYLES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
          </select>
        </Field>
        <Field label="Background">
          <select value={scene} onChange={(e) => setScene(e.target.value)} style={selectStyle}>
            {SCENES.map((sc) => <option key={sc} value={sc}>{sc === "none" ? "Clean" : sc[0].toUpperCase() + sc.slice(1)}</option>)}
          </select>
        </Field>
        <Field label="Logo">
          <select value={mark} onChange={(e) => setMark(e.target.value)} style={selectStyle}>
            <option value="icon">Product icon</option>
            <option value="logo">Product logo</option>
          </select>
        </Field>
        <Field label="Placement">
          <select value={markPos} onChange={(e) => setMarkPos(e.target.value)} style={selectStyle}>
            <option value="top">Top / centre</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </Field>
        <Field label="Banner size">
          <select value={sizeId} onChange={(e) => setSizeId(e.target.value)} style={selectStyle}>
            {SIZES.map((s) => <option key={s.id} value={s.id}>{s.w}×{s.h} — {s.label}</option>)}
          </select>
        </Field>
        <button onClick={download} style={{ ...primaryBtn, height: 40 }}>Generate & download</button>
        <button onClick={downloadAll} style={{ background: "transparent", border: `1px solid ${C.line2}`, color: C.or, borderRadius: 8, padding: "0 18px", height: 40, fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Download all sizes</button>
      </div>

      <div style={{ display: "flex", justifyContent: "center", padding: 24, background: C.bg, border: `1px solid ${C.line}`, borderRadius: 10 }}>
        <BannerPreview size={size} styleId={styleId} box={Math.min(360, size.w > size.h ? 420 : 300)} copy={copy} scene={scene} mark={mark} markPos={markPos} />
      </div>
      <div style={{ marginTop: 14 }}><CopyRow link={link} /></div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </Section>
  );
}

/* ============================================================
   SECTION 4 — IMAGES FOR PROMO POSTS (Rectangle/Square/Stories)
   ============================================================ */
const PROMO_IMG_SIZES = {
  Rectangle: { id: "pi-rect", w: 1200, h: 630 },
  Square: { id: "pi-sq", w: 1080, h: 1080 },
  Stories: { id: "pi-story", w: 1080, h: 1920 },
};
const PROMO_IMG_STYLES = ["bolt", "glow", "outline", "bolt", "glow", "outline"];

function PromoImages({ link }) {
  const [tab, setTab] = useState("Rectangle");
  const size = { ...PROMO_IMG_SIZES[tab], label: tab };

  return (
    <Section
      title="Images for promo posts"
      sub="These images work great for posts on your social accounts and messengers."
      right={
        <div style={{ display: "flex", gap: 6 }}>
          {Object.keys(PROMO_IMG_SIZES).map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              background: tab === t ? C.or : "transparent", color: tab === t ? "#000" : C.dim,
              border: tab === t ? "none" : `1px solid ${C.line}`, borderRadius: 7,
              padding: "7px 14px", fontWeight: 700, fontSize: 12, cursor: "pointer",
            }}>{t}</button>
          ))}
        </div>
      }
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 14 }}>
        {PROMO_IMG_STYLES.map((st, i) => (
          <PromoImageCard key={i} size={{ ...size, id: `${size.id}-${i}` }} styleId={st} link={link} copy={TAGLINES[i % TAGLINES.length]} scene={SCENES[i % 3]} mark={i % 2 === 0 ? "icon" : "logo"} markPos="top" />
        ))}
      </div>
    </Section>
  );
}

function PromoImageCard({ size, styleId, link, copy, scene, mark, markPos }) {
  const canvasRef = useRef(null);
  const download = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawBanner(canvas, size, styleId, copy, scene, mark, markPos);
    const a = document.createElement("a");
    a.href = canvas.toDataURL("image/png");
    a.download = `satsearn-promo-${size.label.toLowerCase()}-${styleId}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 12, padding: 12, display: "flex", flexDirection: "column", gap: 10, alignItems: "center" }}>
      <div style={{ height: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <BannerPreview size={size} styleId={styleId} box={180} copy={copy} scene={scene} mark={mark} markPos={markPos} />
      </div>
      <button onClick={download} style={{ ...primaryBtn, width: "100%", padding: "8px 0", fontSize: 12 }}>↓ Download</button>
      <CopyRow link={link} small />
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
}

/* ============================================================
   SECTION 5 — TEXTS FOR PROMO POSTS
   ============================================================ */
const PROMO_TEXTS = [
  "I'm earning real Bitcoin — actual sats, no buying — just by completing tasks, quizzes and games on SatsEarn. Paid straight over Lightning. Start free with my link:",
  "Hey — found a way to actually earn Bitcoin without buying any. You do small tasks, quizzes and games and get paid in real sats over Lightning. No experience needed, free to start. Here's my link:",
  "SatsEarn lets anyone stack real Bitcoin sats — earned, not bought — through tasks, learning and games, paid over the Lightning Network. Free to join:",
  "New to Bitcoin and not ready to buy any? SatsEarn pays real satoshis to your Lightning wallet for simple tasks, quizzes and daily streaks. No deposit, no purchase — just stack sats. Try it free:",
  "You don't have to buy Bitcoin to own some. On SatsEarn you earn real sats by doing quick tasks and quizzes, paid over Lightning. Start with my link:",
  "Curious about Bitcoin but exchanges feel like a hassle? SatsEarn skips all that — earn sats by completing simple tasks, withdraw real BTC over Lightning. Free to start:",
  "Stacking sats the easy way: tasks, quizzes, a daily streak, and a couple of mini-games. Every reward is real Bitcoin paid over Lightning. Join free here:",
  "I've been collecting small amounts of Bitcoin without spending a thing — SatsEarn pays in real sats over Lightning for everyday tasks. Worth a look:",
  "No buying. No deposit. Just earn. SatsEarn rewards you in real Bitcoin sats for tasks, learning and games. Free to join with my link:",
  "Want your first sats without putting money in? SatsEarn is a Lightning-native way to earn real Bitcoin by completing tasks. Start free:",
  "Bitcoin doesn't have to start with a big purchase. On SatsEarn you earn real sats by doing simple things online — paid over Lightning. Here's my link:",
  "A daily habit that pays in Bitcoin: open SatsEarn, keep your streak, finish a task or quiz, stack a few more sats. All real, all over Lightning. Join free:",
  "If you like the idea of owning Bitcoin but not the price tag, SatsEarn lets you earn sats instead of buying them. Tasks, quizzes, games — paid over Lightning:",
  "Learn a little about Bitcoin and get paid in it. SatsEarn rewards tasks, quizzes and streaks with real sats over the Lightning Network. Free to start:",
  "Real Bitcoin, earned not bought. SatsEarn pays sats to your Lightning wallet for completing tasks and quizzes. No experience needed. Join with my link:",
  "Stack Sats. No Buying Required. That's the whole idea behind SatsEarn — earn real Bitcoin over Lightning by doing simple tasks. Try it free:",
  "Looking for a no-risk way into Bitcoin? SatsEarn pays you in real sats for tasks and quizzes — nothing to deposit, nothing to buy. Start here:",
  "I earn a little Bitcoin every day on SatsEarn just by keeping a streak and finishing a few tasks. Real sats, paid over Lightning. Join free:",
  "SatsEarn turns small tasks into real Bitcoin. Quizzes, social actions, mini-games — all paid in sats over Lightning. Free to start with my link:",
  "Your Lightning wallet, slowly filling with sats you earned instead of bought. That's SatsEarn. Tasks, quizzes, streaks — all real Bitcoin. Join free:",
  "New to crypto? Start the simple way. SatsEarn pays real Bitcoin sats for easy tasks and quizzes, straight over Lightning. No buying required:",
  "Earn sats on your coffee break. SatsEarn rewards quick tasks, quizzes and games with real Bitcoin over Lightning. Free to join here:",
  "The no-buy way to stack Bitcoin: complete tasks on SatsEarn, earn real sats, withdraw over Lightning. Start free with my link:",
  "Bitcoin without the deposit. SatsEarn pays you in real satoshis for tasks, learning and daily streaks, all over the Lightning Network. Join free:",
  "Small actions, real sats. SatsEarn rewards everyday tasks and quizzes with actual Bitcoin over Lightning — no purchase needed. Try it:",
  "Thinking about Bitcoin but not ready to buy? SatsEarn lets you earn your first sats by doing simple tasks, paid over Lightning. Free to start:",
];

function PromoTexts({ link }) {
  return (
    <Section title="Texts for promo posts" sub="Ready-made messages for quick sharing in chats and on social media.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {PROMO_TEXTS.map((t, i) => (
          <PromoTextCard key={i} text={t} link={link} />
        ))}
      </div>
    </Section>
  );
}
function PromoTextCard({ text, link }) {
  const [copied, setCopied] = useState(false);
  const full = `${text}\n\n${link}`;
  const copy = () => {
    copyText(full);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.6, flex: 1 }}>{text}</div>
      <div style={{ display: "flex", gap: 8 }}>
        <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(full)}`} target="_blank" rel="noopener noreferrer"
          style={{ flex: 1, textAlign: "center", background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 7, padding: "8px 0", color: C.or, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>
          Share
        </a>
        <button onClick={copy} style={{ flex: 1, background: C.or, color: "#000", border: "none", borderRadius: 7, padding: "8px 0", fontWeight: 800, fontSize: 12, cursor: "pointer" }}>
          {copied ? "✓ Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION 6 — ADDITIONAL LANDING PAGES
   ============================================================ */
const LANDINGS = [
  { id: "lp1", label: "Classic", style: "bolt" },
  { id: "lp2", label: "Dark Glow", style: "glow" },
  { id: "lp3", label: "Minimal", style: "outline" },
];
function LandingPages({ link }) {
  return (
    <Section title="Additional landing pages" sub="Use landing pages of different styles to invite people. Pick the one that suits your content.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))", gap: 14 }}>
        {LANDINGS.map((lp) => (
          <div key={lp.id} style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 12, padding: 14, display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ height: 150, display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, borderRadius: 8, overflow: "hidden" }}>
              <BannerPreview size={{ id: lp.id, w: 1200, h: 630 }} styleId={lp.style} box={250} />
            </div>
            <div style={{ color: C.txt, fontWeight: 700, fontSize: 13 }}>{lp.label} landing page</div>
            <CopyRow link={link} small />
            <div style={{ display: "flex", gap: 8 }}>
              <a href={link} target="_blank" rel="noopener noreferrer" style={{ flex: 1, textAlign: "center", background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 7, padding: "8px 0", color: C.or, fontWeight: 700, fontSize: 12, textDecoration: "none" }}>Open</a>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

/* ============================================================
   SECTION 7 — PROMO VIDEOS (honest placeholder)
   ============================================================ */
function PromoVideos() {
  return (
    <Section title="Promo videos" sub="Short videos to draw attention to your promo posts.">
      <div style={{ background: C.bg, border: `1px dashed ${C.line}`, borderRadius: 10, padding: 32, textAlign: "center", color: C.dim, fontSize: 13, lineHeight: 1.6 }}>
        No promo videos yet. This section will fill in once SatsEarn has video assets ready to share.
      </div>
    </Section>
  );
}

/* ============================================================
   CREATOR PROGRAM
   ============================================================ */
function AmbassadorProgram() {
  const [form, setForm] = useState({ name: "", email: "", platform: "YouTube", profile: "", audience: "1k–10k", promo: "" });
  const [sent, setSent] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const valid = form.name.trim() && /\S+@\S+\.\S+/.test(form.email) && form.profile.trim();

  const submit = () => {
    // Backend not wired yet — open a pre-filled email so nothing is silently lost.
    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\nPlatform: ${form.platform}\nProfile: ${form.profile}\nAudience: ${form.audience}\n\nHow I'll promote SatsEarn:\n${form.promo}`
    );
    window.location.href = `mailto:support@satsearn.app?subject=${encodeURIComponent("Ambassador Program Application")}&body=${body}`;
    setSent(true);
  };

  const who = ["Creators", "Influencers", "YouTubers", "Crypto influencers", "Airdrop guides", "Anyone with an audience"];
  const ladder = [
    { tier: "Platinum", rate: "10%", when: "On approval", note: "Every approved ambassador starts here. You get your link, banners and assets, and begin sharing right away." },
    { tier: "Diamond", rate: "15%", when: "After 1–2 months", note: "If the users you bring in are real and staying active, your rate can be raised to Diamond." },
    { tier: "Crown", rate: "20%", when: "As you keep growing", note: "Consistent, genuine growth over the following months can move you to Crown — the top of the ambassador path." },
  ];

  return (
    <Section
      title="Ambassador Program"
      sub="For creators, influencers, YouTubers, crypto influencers, airdrop guides — anyone with an audience. Share SatsEarn and earn referral commission up to 20%, paid in real Bitcoin over Lightning."
    >
      {/* Who it&apos;s for */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>Who it&apos;s for</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {who.map((w) => (
            <span key={w} style={{ background: C.surf2, border: `1px solid ${C.line2}`, borderRadius: 999, padding: "7px 14px", fontSize: 13, color: C.txt2, fontWeight: 600 }}>{w}</span>
          ))}
        </div>
      </div>

      {/* How the rate grows */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 6 }}>How your rate grows</div>
        <p style={{ color: C.dim, fontSize: 13, lineHeight: 1.6, margin: "0 0 14px" }}>
          Ambassadors join the same referral tiers regular users have — you simply start higher. Every approved ambassador begins at <strong style={{ color: C.txt }}>Platinum (10%)</strong>. Based on the verified, active users you bring in over time, your rate can be raised toward <strong style={{ color: C.txt }}>Crown (up to 20%)</strong>. Progression is reviewed on real performance — it isn&apos;t automatic or guaranteed, and there's no fixed timeline.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {ladder.map((l, i) => (
            <div key={l.tier} style={{ background: i === 2 ? "linear-gradient(180deg, rgba(247,147,26,0.14), rgba(247,147,26,0.04))" : C.surf2, border: `1px solid ${i === 2 ? C.line2 : C.line}`, borderRadius: 12, padding: 16 }}>
              <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.txt, fontFamily: "monospace", letterSpacing: 0.5 }}>{l.tier}</span>
                <span style={{ fontSize: 22, fontWeight: 900, color: C.or, fontFamily: "monospace" }}>{l.rate}</span>
              </div>
              <div style={{ fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: C.grn, marginBottom: 8 }}>{l.when}</div>
              <p style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>{l.note}</p>
            </div>
          ))}
        </div>
        <p style={{ color: C.faint, fontSize: 11.5, lineHeight: 1.5, margin: "10px 0 0" }}>
          Note: the ambassador path tops out at Crown (20%). Commission is a share of the platform's base reward on your referrals' activity, paid automatically over Lightning. Keep your promotion honest — no income promises or "get rich" claims, which can forfeit commission.
        </p>
      </div>

      {/* How it works */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>How it works</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {[
            ["1", "Apply", "Tell us who you are and where your audience is. Takes a minute."],
            ["2", "Get approved", "We review your profile and approve a fit. You're added at Platinum (10%)."],
            ["3", "Share", "Use your link, banners and ready-made posts to share SatsEarn with your audience."],
            ["4", "Grow & earn", "As real users join and stay active, your commission is paid in sats over Lightning — and your rate can climb toward Crown."],
          ].map(([n, h, p]) => (
            <div key={n} style={{ background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.org, border: `1px solid ${C.line2}`, color: C.or, fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{n}</div>
              <div style={{ color: C.txt, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{h}</div>
              <div style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.55 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Starter tips */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>Ways to share</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 12 }}>
          {[
            ["Pin your link", "Put your referral link in your bio, pinned post, video description or stream panel so it&apos;s always one tap away."],
            ["Post ready-made banners", "Use the banners and promo images above — sized for X, Instagram, Telegram and more, with your link baked in."],
            ["Use the honest copy", "The ready-made texts are written to convert without hype. Keep your own posts honest too — it protects your commission."],
            ["Explain, don't oversell", "Show how earning sats works. Airdrop and crypto audiences respond to clear how-it-works over income claims."],
          ].map(([h, p]) => (
            <div key={h} style={{ background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
              <div style={{ color: C.txt, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{h}</div>
              <div style={{ color: C.dim, fontSize: 12.5, lineHeight: 1.55 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Application form */}
      <div style={{ background: C.surf2, border: `1px solid ${C.line2}`, borderRadius: 14, padding: 22 }}>
        <h3 style={{ color: C.txt, margin: "0 0 4px", fontSize: 18, fontWeight: 800 }}>Apply to become an ambassador</h3>
        <p style={{ color: C.dim, fontSize: 13, margin: "0 0 18px", lineHeight: 1.6 }}>Fill this in and we'll review your profile. Approved ambassadors start at Platinum (10%).</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }} >
          <FormField label="Name">
            <input value={form.name} onChange={set("name")} placeholder="Your name" style={inputStyle} />
          </FormField>
          <FormField label="Email">
            <input value={form.email} onChange={set("email")} placeholder="you@example.com" style={inputStyle} />
          </FormField>
          <FormField label="Platform">
            <select value={form.platform} onChange={set("platform")} style={inputStyle}>
              {["YouTube", "X / Twitter", "Instagram", "TikTok", "Telegram", "Other"].map((p) => <option key={p}>{p}</option>)}
            </select>
          </FormField>
          <FormField label="Audience size">
            <select value={form.audience} onChange={set("audience")} style={inputStyle}>
              {["Under 1k", "1k–10k", "10k–50k", "50k–250k", "250k+"].map((a) => <option key={a}>{a}</option>)}
            </select>
          </FormField>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="Channel / profile link">
              <input value={form.profile} onChange={set("profile")} placeholder="https://..." style={inputStyle} />
            </FormField>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <FormField label="How will you promote SatsEarn?">
              <textarea value={form.promo} onChange={set("promo")} rows={3} placeholder="A line or two about your audience and how you'd share." style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} />
            </FormField>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 16, flexWrap: "wrap" }}>
          <a href="/login" style={{ ...primaryBtn, textDecoration: "none" }}>Signup / Login Required</a>
        </div>
      </div>
    </Section>
  );
}

function FormField({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ color: C.txt2, fontSize: 12, fontWeight: 600 }}>{label}</span>
      {children}
    </div>
  );
}
const inputStyle = {
  width: "100%", boxSizing: "border-box", background: C.bg, color: C.txt,
  border: `1px solid ${C.line}`, borderRadius: 8, padding: "10px 12px", fontSize: 14,
};

/* ============================================================
   HOW REFERRALS WORK
   ============================================================ */
const REFERRAL_URL = "https://satsearn.app/referral";

const PAID_TIERS = [
  { name: "Platinum", rate: "10%" },
  { name: "Diamond", rate: "15%" },
  { name: "Crown", rate: "20%" },
  { name: "Elite", rate: "25%" },
  { name: "Founders", rate: "30%", highlight: true },
];

function ReferralTerms() {
  return (
    <Section
      title="How referral rewards work"
      sub="Share your link. When the people you invite get active on SatsEarn, you earn a commission on the platform's base reward for their activity — paid in real sats over Lightning."
      right={
        <a href={REFERRAL_URL} target="_blank" rel="noopener noreferrer"
          style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "transparent", border: `1px solid ${C.line2}`, color: C.or, borderRadius: 9, padding: "9px 16px", fontWeight: 800, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap" }}>
          <Zap size={13} /> Full referral programme
        </a>
      }
    >
      {/* The flow */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>How it flows</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 12 }}>
          {[
            ["1", "Share your link", "Send your personal link — satsearn.app/?ref=YOURCODE — to friends and followers. No Bitcoin experience needed on their end."],
            ["2", "They join and get active", "When someone signs up through your link and starts completing tasks, quizzes and other earning actions, they become your direct referral."],
            ["3", "You earn commission sats", "You receive a fixed share of the admin base reward on their commissionable activity — automatically, on top of what you stack yourself."],
            ["4", "Paid over Lightning", "Commission is paid in real Bitcoin sats to your balance, withdrawable over the Lightning Network like everything else on SatsEarn."],
          ].map(([n, h, p]) => (
            <div key={n} style={{ background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16 }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: C.org || "rgba(247,147,26,0.15)", border: `1px solid ${C.line2}`, color: C.or, fontWeight: 900, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>{n}</div>
              <div style={{ color: C.txt, fontWeight: 800, fontSize: 14, marginBottom: 6 }}>{h}</div>
              <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.55 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Commission rates by tier */}
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>Commission rates by tier</div>
        <div style={{ background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <div style={{ color: C.txt, fontWeight: 800, fontSize: 14, marginBottom: 4 }}>Free tiers — Basic, Copper, Bronze, Silver, Gold</div>
          <div style={{ color: C.dim, fontSize: 13, lineHeight: 1.6 }}>
            A flat <strong style={{ color: C.txt }}>5%</strong> commission on your referrals' base-reward activity, with a lifetime referral cap. Upgrading to any paid tier raises your rate and removes the cap.
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(120px,1fr))", gap: 10 }}>
          {PAID_TIERS.map((t) => (
            <div key={t.name} style={{
              background: t.highlight ? "linear-gradient(180deg, rgba(247,147,26,0.14), rgba(247,147,26,0.04))" : C.surf2,
              border: `1px solid ${t.highlight ? C.line2 : C.line}`, borderRadius: 12, padding: "16px 12px", textAlign: "center",
            }}>
              <div style={{ fontSize: 12, letterSpacing: 0.5, textTransform: "uppercase", color: t.highlight ? C.or : C.txt2, fontWeight: 700, marginBottom: 8, fontFamily: "monospace" }}>{t.name}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: C.or, lineHeight: 1, marginBottom: 8, fontFamily: "monospace" }}>{t.rate}</div>
              <div style={{ fontSize: 10, letterSpacing: 0.5, textTransform: "uppercase", color: C.grn, border: `1px solid rgba(34,197,94,0.3)`, borderRadius: 5, padding: "3px 8px", display: "inline-block" }}>Uncapped</div>
            </div>
          ))}
        </div>
        <p style={{ color: C.dim, fontSize: 12, margin: "10px 0 0", lineHeight: 1.5 }}>
          Paid tiers earn a higher commission with no lifetime referral cap — Founders sit at the top at 30%.
        </p>
      </div>

      {/* Key terms */}
      <div>
        <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: C.or, fontWeight: 700, marginBottom: 12 }}>Good to know</div>
        <ul style={{ color: C.dim, fontSize: 13, lineHeight: 1.85, margin: 0, paddingLeft: 18 }}>
          <li><strong style={{ color: C.txt }}>Direct referrals only.</strong> You earn from the people you invite directly — there are no further levels and no multi-level structure.</li>
          <li><strong style={{ color: C.txt }}>Your code is automatic.</strong> Once you log in, your dashboard fills in your real 8-character code (for example 14261EDD). The link format is satsearn.app/?ref=YOURCODE.</li>
          <li><strong style={{ color: C.txt }}>Founders Rotation.</strong> New users who join without a referrer are shared evenly across the founding cohort as crew members, so Founders also earn on people the platform brings in — not only those they invite themselves.</li>
          <li><strong style={{ color: C.txt }}>Commission is a fixed share</strong> of the admin base reward on commissionable activity, paid automatically. You always earn and withdraw real Bitcoin over Lightning.</li>
          <li><strong style={{ color: C.txt }}>Keep it honest.</strong> No income promises or "get rich" claims when you share — those break the fair-play rules and can forfeit your commission.</li>
        </ul>
      </div>
    </Section>
  );
}

/* ============================================================
   SHARED UI PRIMITIVES
   ============================================================ */
const primaryBtn = {
  background: C.or, color: "#000", border: "none", borderRadius: 8,
  padding: "11px 22px", fontWeight: 900, fontSize: 13, letterSpacing: 0.5, cursor: "pointer",
};
const refreshBtn = {
  background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 8, width: 40, height: 40,
  color: C.or, fontSize: 16, cursor: "pointer",
};
const selectStyle = {
  background: C.surf2, color: C.txt, border: `1px solid ${C.line}`, borderRadius: 8,
  padding: "9px 12px", fontSize: 13, minWidth: 150, cursor: "pointer",
};
const resCard = { background: C.surf2, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18 };
const resLink = { color: C.or, fontWeight: 700, cursor: "pointer", textDecoration: "none" };

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ color: C.dim, fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{label}</span>
      {children}
    </div>
  );
}

function Section({ title, sub, right, children }) {
  return (
    <div style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 16, padding: 24, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap", borderBottom: `1px solid ${C.line}`, paddingBottom: 14, marginBottom: 18 }}>
        <div>
          <h2 style={{ color: C.txt, margin: 0, fontSize: 20, fontWeight: 900 }}>{title}</h2>
          {sub ? <p style={{ color: C.dim, margin: "6px 0 0", fontSize: 13 }}>{sub}</p> : null}
        </div>
        {right || null}
      </div>
      {children}
    </div>
  );
}

/* ============================================================
   SHARED SITE CHROME — ported from the static HTML pages
   (nav + master footer + scroll-reveal + heartbeat).
   At Next.js conversion these consolidate into one layout.
   ============================================================ */
const NAV_LINKS = [
  ["How It Works", "/how-it-works"],
  ["Ways to Earn", "/#ways-to-earn"],
  ["Tiers", "/#tiers"],
  ["Pricing", "/#pricing"],
  ["FAQ", "/faq"],
];

function NavBolt({ w = 15 }) {
  return (
    <svg viewBox="0 0 56 72" width={w} height={(w * 72) / 56} fill={C.or} style={{ verticalAlign: "-3px", flexShrink: 0 }} xmlns="http://www.w3.org/2000/svg">
      <path d="M30.6 2.2c1.1-2 4.2-1 3.9 1.3l-3.1 22.3 18.4.2c2.4 0 3.5 3 1.6 4.5L19.2 69.4c-1.4 1.7-4.2.3-3.7-1.9l5.4-23.8-15.5-.2c-2.3 0-3.4-2.8-1.7-4.4z" />
    </svg>
  );
}

function Nav() {
  const [open, setOpen] = useState(false);
  return (
    <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 40px", height: 64, background: "rgba(6,6,8,0.85)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${C.line}` }}>
      <a href="/" style={{ fontFamily: "'Satoshi',sans-serif", fontSize: 20, fontWeight: 900, color: C.or, letterSpacing: 0.5, textDecoration: "none", display: "flex", alignItems: "center", gap: 8 }}>
        <NavBolt /> SatsEarn <span style={{ color: C.txt, opacity: 0.5, fontSize: 12, letterSpacing: 2 }}>BETA</span>
      </a>
      <div style={{ display: "flex", alignItems: "center", gap: 32 }} className="se-navlinks">
        {NAV_LINKS.map(([label, href]) => (
          <a key={label} href={href} style={{ color: C.txt2, fontSize: 14, fontWeight: 600, textDecoration: "none", letterSpacing: 0.3 }}>{label}</a>
        ))}
      </div>
      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <a href="/login" className="se-login" style={{ padding: "8px 18px", border: `1px solid ${C.line2}`, borderRadius: 8, color: C.or, fontSize: 13, fontWeight: 700, textDecoration: "none", letterSpacing: 0.5 }}>Log In</a>
        <a href="/signup" style={{ padding: "8px 20px", borderRadius: 8, background: C.or, color: "#000", fontSize: 13, fontWeight: 800, textDecoration: "none", letterSpacing: 0.5, boxShadow: "0 4px 20px rgba(247,147,26,.25)" }}>Start Earning</a>
      </div>
    </nav>
  );
}

const FOOTER_COLS = [
  ["Earn", [["Social Tasks", "/#ways-to-earn"], ["Bitcoin Quizzes", "/#ways-to-earn"], ["Mini Games", "/#ways-to-earn"], ["Referral Programme", "/referral"], ["Streak Milestones", "/#streaks"]]],
  ["Platform", [["How It Works", "/how-it-works"], ["Withdrawals", "/withdrawals"], ["Tier System", "/#tiers"], ["Paid Tiers", "/#pricing"], ["FAQ", "/faq"]]],
  ["Company", [["About Us", "/about"], ["Contact", "/contact"], ["For Brands", "/brands"], ["Ambassador Program", "/ambassador"], ["Log In", "/login"]]],
  ["Legal", [["Terms of Service", "/terms"], ["Privacy Policy", "/privacy"], ["Cookie Policy", "/cookie-policy"], ["Refund Policy", "/refund-policy"], ["Rewards Policy", "/rewards-policy"], ["MiCA Policy", "/mica-policy"], ["All Policies", "/legal"]]],
];
const FOOTER_SOCIAL = [
  ["X", "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"],
  ["Telegram", "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"],
  ["YouTube", "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"],
  ["Discord", "M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"],
  ["WhatsApp", "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0 0 20.464 3.488"],
  ["Reddit", "M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015a.379.379 0 0 0-.44.245l-1.654 5.207c-2.759.076-5.25.834-7.087 2.034a2.642 2.642 0 0 0-1.83-.738C1.192 9.134 0 10.32 0 11.779c0 .92.475 1.73 1.192 2.205-.032.207-.049.419-.049.633 0 3.298 3.871 5.978 8.633 5.978s8.634-2.68 8.634-5.978c0-.211-.016-.421-.047-.626.718-.475 1.195-1.286 1.195-2.212zM6.776 13.937c0-.834.679-1.512 1.515-1.512.836 0 1.515.678 1.515 1.512s-.679 1.513-1.515 1.513c-.836 0-1.515-.679-1.515-1.513zm8.835 4.04c-1.005 1.005-2.91 1.077-3.47 1.077-.563 0-2.467-.072-3.472-1.077a.376.376 0 0 1 .53-.531c.633.634 1.989.858 2.942.858.953 0 2.309-.224 2.943-.858a.376.376 0 0 1 .53 0 .375.375 0 0 1-.003.531z"],
];

function Footer() {
  return (
    <footer style={{ background: C.bg, borderTop: `1px solid ${C.line}`, padding: "60px 20px 32px", position: "relative", zIndex: 1, marginTop: 40 }}>
      <div className="se-footer-grid" style={{ maxWidth: 1100, margin: "0 auto 48px", display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr 1fr 1fr", gap: 32 }}>
        <div>
          <span style={{ fontFamily: "'Satoshi',sans-serif", fontSize: 20, fontWeight: 800, color: C.or, marginBottom: 12, display: "flex", alignItems: "center", gap: 8 }}>
            <NavBolt /> SatsEarn
          </span>
          <p style={{ fontSize: 13, color: C.faint, lineHeight: 1.7, maxWidth: 260, marginBottom: 20 }}>
            The Bitcoin earn platform. Stack real sats through tasks, quizzes, streaks, and referrals. No buying required.
          </p>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {FOOTER_SOCIAL.map(([name, d]) => (
              <a key={name} href="#" aria-label={name} target="_blank" rel="noopener" style={{ width: 36, height: 36, borderRadius: 8, background: C.surf, border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", color: C.txt2, textDecoration: "none" }}>
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d={d} /></svg>
              </a>
            ))}
          </div>
        </div>
        {FOOTER_COLS.map(([title, links]) => (
          <div key={title}>
            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: 1.5, textTransform: "uppercase", color: C.faint, marginBottom: 16, fontFamily: "'Space Mono',monospace" }}>{title}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {links.map(([label, href]) => (
                <a key={label} href={href} style={{ fontSize: 13, color: C.txt2, textDecoration: "none" }}>{label}</a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="se-footer-bottom" style={{ maxWidth: 1100, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12, paddingTop: 24, borderTop: `1px solid ${C.line}`, fontSize: 12, color: C.txt2, fontWeight: 700 }}>
        <span>© 2026 SatsEarn. All rights reserved.</span>
        <span>Made with <span className="se-heart" style={{ display: "inline-block", verticalAlign: "-2px" }}><svg viewBox="0 0 24 24" width="15" height="15" fill={C.or} xmlns="http://www.w3.org/2000/svg"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg></span> for the Bitcoin community</span>
      </div>
    </footer>
  );
}

// Scroll-reveal: mirrors the site's .reveal + IntersectionObserver
function Reveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { setShown(true); io.unobserve(e.target); }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ opacity: shown ? 1 : 0, transform: shown ? "translateY(0)" : "translateY(20px)", transition: `opacity .6s ${delay}s ease, transform .6s ${delay}s ease` }}>
      {children}
    </div>
  );
}

const CHROME_CSS = `
@keyframes seHeartBeat{0%,100%{transform:scale(1);}10%{transform:scale(1.25);}20%{transform:scale(1.05);}30%{transform:scale(1.2);}45%{transform:scale(1);}}
.se-heart{animation:seHeartBeat 1.6s ease-in-out infinite;filter:drop-shadow(0 0 4px rgba(247,147,26,.85)) drop-shadow(0 0 9px rgba(247,147,26,.5));transform-origin:center;}
.se-navlinks a:hover,.se-footer-grid a:hover,.se-login:hover{color:${C.or};}
.se-login:hover{background:${C.org};border-color:${C.or};}
@media(max-width:768px){.se-navlinks{display:none !important;}.se-login{display:none !important;}}
@media(max-width:900px){.se-footer-grid{grid-template-columns:1fr 1fr 1fr !important;gap:28px !important;}}
@media(max-width:560px){.se-footer-grid{grid-template-columns:1fr 1fr !important;gap:24px !important;}.se-footer-bottom{flex-direction:column;text-align:center;gap:8px;}}
@media(prefers-reduced-motion:reduce){.se-heart{animation:none;}}
`;

/* ============================================================
   ROOT
   ============================================================ */
export default function SatsEarnShare() {
  const [code, setCode] = useState(DEMO_CODE);
  const [tab, setTab] = useState("share");
  const [toast, setToast] = useState(false);
  const link = REF_BASE + (code || DEMO_CODE);

  useEffect(() => {
    const onCopied = () => {
      setToast(true);
      setTimeout(() => setToast(false), 1800);
    };
    window.addEventListener("se-copied", onCopied);
    return () => window.removeEventListener("se-copied", onCopied);
  }, []);

  const tabBtn = (id, label) => (
    <button
      onClick={() => setTab(id)}
      style={{
        background: tab === id ? C.or : "transparent",
        color: tab === id ? "#000" : C.txt2,
        border: tab === id ? "none" : `1px solid ${C.line2}`,
        borderRadius: 999, padding: "11px 26px", fontWeight: 800, fontSize: 14, cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {label}
    </button>
  );

  // Shared promo asset sections — appear under BOTH tabs.
  const assets = (
    <>
      <Reveal><ShareToEarn link={link} /></Reveal>
      <Reveal><BrandResources /></Reveal>
      <Reveal><GenerateBanners link={link} /></Reveal>
      <Reveal><PromoImages link={link} /></Reveal>
      <Reveal><PromoTexts link={link} /></Reveal>
      <Reveal><LandingPages link={link} /></Reveal>
      <Reveal><PromoVideos /></Reveal>
    </>
  );

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.txt, fontFamily: "'Satoshi', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", boxSizing: "border-box" }}>
      <style>{CHROME_CSS}</style>
      <Nav />
      {toast && (
        <div style={{ position: "fixed", bottom: 24, left: "50%", transform: "translateX(-50%)", background: C.or, color: "#000", fontWeight: 800, fontSize: 13, padding: "11px 20px", borderRadius: 10, zIndex: 1000, boxShadow: "0 6px 24px rgba(0,0,0,0.4)" }}>
          ✓ Copied to clipboard
        </div>
      )}
      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "104px 18px 40px" }}>
        {/* Hero */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}><AppIcon size={64} /></div>
          <h1 style={{ fontSize: 32, fontWeight: 900, margin: "0 0 10px", lineHeight: 1.12 }}>
            Ready-made promo materials with <span style={{ color: C.or }}>your personal link</span>
          </h1>
          <p style={{ color: C.txt2, fontSize: 14, margin: "0 auto", maxWidth: 560, lineHeight: 1.6 }}>
            Banners, images and posts — ready to go. Use them to invite friends and followers and grow your network. {TAGLINE} {SUBLINE}
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 26, flexWrap: "wrap" }}>
          {tabBtn("share", "Share & Earn")}
          {tabBtn("creator", "Ambassador Program")}
        </div>

        {/* Personal link bar (shared) */}
        <div style={{ background: C.surf, border: `1px solid ${C.line}`, borderRadius: 14, padding: 20, marginBottom: 20 }}>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap", alignItems: "flex-end" }}>
            <Field label="Your code">
              <input
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^a-zA-Z0-9]/g, "").toUpperCase())}
                placeholder={DEMO_CODE}
                style={{ background: C.surf2, color: C.txt, border: `1px solid ${C.line}`, borderRadius: 8, padding: "9px 12px", fontSize: 14, fontFamily: "monospace", minWidth: 150 }}
              />
            </Field>
            <div style={{ flex: 1, minWidth: 240 }}>
              <Field label="Referral link"><CopyRow link={link} /></Field>
            </div>
          </div>
        </div>

        {tab === "share" ? (
          <>
            {assets}
            <Reveal><ReferralTerms /></Reveal>
          </>
        ) : (
          <>
            <Reveal><AmbassadorProgram /></Reveal>
            {assets}
          </>
        )}

        <div style={{
          background: "radial-gradient(ellipse at center, rgba(255, 153, 0, 0.1) 0%, rgba(0,0,0,0) 60%), #0c0804",
          border: `1px solid ${C.line}`,
          borderRadius: 24,
          padding: "54px 24px",
          textAlign: "center",
          marginTop: 64,
          marginBottom: 40,
        }}>
          <h2 style={{ fontSize: 28, fontWeight: 900, margin: "0 0 12px", color: "#fff" }}>
            Ready to stack your first sats?
          </h2>
          <p style={{ color: C.faint, fontSize: 15, margin: "0 auto 28px", maxWidth: 540, lineHeight: 1.6 }}>
            Create a free account and start earning real Bitcoin over Lightning — no buying required. Already have one? Log in and grab your referral link.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
            <a href="/signup" style={{ ...primaryBtn, padding: "14px 28px", fontSize: 15, textDecoration: "none", display: "inline-block" }}>Start Earning Free</a>
            <a href="/login" style={{ background: "transparent", color: C.or, border: `1px solid ${C.line2}`, borderRadius: 8, padding: "13px 28px", fontWeight: 900, fontSize: 15, textDecoration: "none", display: "inline-block" }}>Log In</a>
          </div>
        </div>

        <div style={{ textAlign: "center", color: C.faint, fontSize: 11, marginTop: 12 }}>
          SatsEarn · Lightning-native, no buying required · support@satsearn.app
        </div>
      </div>
    </div>
  );
}



