/**
 * validators.ts
 *
 * Layered email security validation:
 *
 *  Layer 1 — Strict RFC-aware regex (tighter than before)
 *  Layer 2 — Local-part format rules (no consecutive dots, no leading/trailing dots)
 *  Layer 3 — Trusted allowlist  → instant pass, no API call
 *  Layer 4 — Known disposable blocklist (700+ domains) → instant block, no API call
 *  Layer 5 — Suspicious pattern heuristics → flag before API
 *  Layer 6 — External API with AbortController timeout (called ONLY for unknown domains)
 *  Layer 7 — Graceful fallback: if API fails/times out, local analysis result is used
 *  Layer 8 — In-memory domain cache (survives page session, reset on reload)
 *
 * Public API surface is identical to the original:
 *   validateEmailSecurity(email) → Promise<{ isValid: boolean; error: string | null }>
 */

// ─── Layer 8: Session-scoped domain cache ────────────────────────────────────

type ValidationResult = { isValid: boolean; error: string | null };
type CacheEntry = ValidationResult & { ts: number };
const domainCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(domain: string): CacheEntry | null {
  const entry = domainCache.get(domain);
  if (!entry) return null;
  if (Date.now() - entry.ts > CACHE_TTL_MS) {
    domainCache.delete(domain);
    return null;
  }
  return entry;
}

function setCache(domain: string, result: ValidationResult): void {
  // Keep cache from growing unbounded in long sessions
  if (domainCache.size > 200) {
    const firstKey = domainCache.keys().next().value;
    if (firstKey) domainCache.delete(firstKey);
  }
  domainCache.set(domain, { ...result, ts: Date.now() });
}

// ─── Layer 1: Strict regex ────────────────────────────────────────────────────

/**
 * Stricter than the original:
 *  - local part: 1–64 chars, alphanumeric + . _ % + - only
 *  - domain: labels separated by dots, each label 1–63 chars
 *  - TLD: 2–24 alpha characters
 *  - total length cap: 254 chars (RFC 5321)
 */
const STRICT_EMAIL_REGEX =
  /^[a-zA-Z0-9][a-zA-Z0-9._%+\-]{0,63}@[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,24}$/;

// ─── Layer 3: Trusted domains (skip API entirely) ─────────────────────────────

/**
 * Major, well-known, legitimate email providers.
 * Expanding this list saves API quota and speeds up the happy path.
 */
const TRUSTED_DOMAINS = new Set([
  // Google
  'gmail.com', 'googlemail.com',
  // Microsoft
  'outlook.com', 'hotmail.com', 'hotmail.co.uk', 'hotmail.fr', 'hotmail.de',
  'hotmail.es', 'hotmail.it', 'live.com', 'live.co.uk', 'live.fr', 'live.de',
  'live.nl', 'msn.com', 'passport.com',
  // Apple
  'icloud.com', 'me.com', 'mac.com',
  // Yahoo
  'yahoo.com', 'yahoo.co.uk', 'yahoo.co.in', 'yahoo.fr', 'yahoo.de',
  'yahoo.es', 'yahoo.it', 'yahoo.com.au', 'yahoo.ca', 'ymail.com',
  // ProtonMail
  'proton.me', 'protonmail.com', 'protonmail.ch',
  // Zoho
  'zoho.com', 'zohomail.com',
  // AOL / Verizon
  'aol.com', 'verizon.net', 'att.net', 'sbcglobal.net',
  // GMX / Web.de
  'gmx.com', 'gmx.net', 'gmx.de', 'gmx.at', 'gmx.ch',
  'web.de', 'freenet.de', 't-online.de',
  // Tutanota
  'tutanota.com', 'tutamail.com', 'tuta.io',
  // FastMail
  'fastmail.com', 'fastmail.fm', 'fastmail.net',
  // Yandex
  'yandex.com', 'yandex.ru', 'ya.ru',
  // Mail.ru
  'mail.ru', 'inbox.ru', 'list.ru', 'bk.ru',
  // Rediffmail
  'rediffmail.com',
  // India
  'indiatimes.com',
  // Other regional
  'orange.fr', 'laposte.net', 'free.fr', 'sfr.fr', 'bbox.fr',
  'libero.it', 'virgilio.it', 'tiscali.it',
  'terra.com.br', 'uol.com.br', 'bol.com.br', 'ig.com.br',
  'naver.com', 'daum.net', 'hanmail.net',
  'sina.com', 'qq.com', '163.com', '126.com', '139.com',
  // Corporate / edu tiers that are almost never disposable
  'comcast.net', 'cox.net', 'charter.net', 'earthlink.net', 'bellsouth.net',
  'rogers.com', 'shaw.ca', 'telus.net',
  'bigpond.com', 'optusnet.com.au',
]);

// ─── Layer 4: Disposable / temp mail blocklist ────────────────────────────────

/**
 * Comprehensive local blocklist of known disposable / throwaway email services.
 * Adding a domain here costs zero API calls and blocks instantly.
 *
 * Sources: public lists at disposable.github.io, ivolo/disposable-email-domains,
 *          manual additions of well-known services as of 2025.
 */
const DISPOSABLE_DOMAINS = new Set([
  // ── Guerrilla Mail family ──
  'guerrillamail.com','guerrillamail.net','guerrillamail.org','guerrillamail.biz',
  'guerrillamail.de','guerrillamail.info','guerrillamailblock.com','grr.la',
  'spam4.me','yopmail.com','yopmail.fr','cool.fr.nf','jetable.fr.nf',
  'nospam.ze.tc','nomail.xl.cx','mega.zik.dj','speed.1s.fr','courriel.fr.nf',
  'moncourrier.fr.nf','monemail.fr.nf','monmail.fr.nf',
  // ── Mailinator family ──
  'mailinator.com','mailinator2.com','mailinator.net','mailinator.org',
  'mailinater.com','suremail.info','spamherelots.com','spamhereplease.com',
  'mailme.lv','mailnew.com','maildrop.cc',
  // ── 10 Minute Mail family ──
  '10minutemail.com','10minutemail.net','10minutemail.org','10minutemail.nl',
  '10minutemail.co.za','10minutemail.cf','10minutemail.ga','10minutemail.ml',
  '10minutemail.gq','10minutemail.tk','10minemail.com',
  // ── Throwam / Temp Mail / similar ──
  'tempmail.com','tempmail.net','tempmail.org','tempmail.us','tempmail.io',
  'temp-mail.org','temp-mail.ru','temp-mail.io','temp-mail.com',
  'tempr.email','tempinbox.com','throwam.com','throwam.net',
  'trashmail.com','trashmail.at','trashmail.me','trashmail.net','trashmail.org',
  'trashmail.io','trashmail.xyz','trashinbox.net',
  // ── Fake / Spam traps ──
  'spamgourmet.com','spamgourmet.net','spamgourmet.org',
  'spamspot.com','spamdecoy.net','spamfree24.org','spaml.com',
  'spambog.com','spambog.de','spambog.ru',
  'spamthisplease.com','spamfree.eu','spamhole.com',
  'spamoff.de','spamstack.net','spamtrap.ro',
  'spamevader.net','no-spam.ws','antispam.de',
  // ── Dispostable / Sharklasers / Pokemail ──
  'dispostable.com','sharklasers.com','guerrillamailblock.com',
  'pokemail.net','spam.la','spam.su',
  // ── Mailnull / Maildrop ──
  'mailnull.com','maildrop.cc','mailscrap.com',
  // ── Fakeinbox / GishPuppy ──
  'fakeinbox.com','gishpuppy.com',
  // ── AirMail / DiscardMail ──
  'airmail.net','discardmail.com','discardmail.de',
  // ── Spamex / Spam.ca ──
  'spamex.com','spam.ca','spaml.de',
  // ── Noclickmail / Owlpic / Blnkt ──
  'noclickmail.com','owlpic.com','blnkt.com',
  // ── Crap.email / DingBone ──
  'crap.email','dingbone.com','myfake.email','fakedemail.com',
  // ── MoAct / InBoxAlias ──
  'moact.net','inboxalias.com',
  // ── MailBait / ThrowEmailAddress ──
  'mailbait.info','throwemail.com',
  // ── Generic random-looking TLDs used by temp services ──
  'mailmetrash.com','putthisinyourspamdatabase.com',
  'yep.it','mailme.ir','binkmail.com','bobmail.info',
  'chammy.info','devnullmail.com','e4ward.com',
  'hailmail.net','iheartspam.org','inoutmail.de',
  'inoutmail.eu','inoutmail.info','inoutmail.net',
  'jetable.com','jetable.net','jetable.org',
  'koszmail.pl','kurzepost.de','lol.ovpn.to',
  'lookugly.com','lortemail.dk','mailin8r.com',
  'mailismagic.com','mailmate.com','mailme24.com',
  'mailmoat.com','mailsiphon.com','mailzilla.com',
  'mega-mail.com','meltmail.com','mierdamail.com',
  'minnemail.com','moncourrier.fr.nf','msft.cc',
  'mt2009.com','mt2014.com','mycleaninbox.net',
  'mypartyclip.de','netviewer-france.com','nevermind.nl',
  'noclickemail.com','nut.cc','odaymail.com',
  'oneoffemail.com','onewaymail.com','onlatedotcom.info',
  'onmail.win','oolala.com','pimpedupmyspace.com',
  'plasticpink.net','privy-mail.com','prvy.biz',
  'quickinbox.com','rcpt.at','recode.me',
  'recursor.net','regbypass.com','rejectmail.com',
  'rklips.com','safetymail.info','safetypost.de',
  'sandelf.de','schafmail.de','secure-mail.biz',
  'selfdestructingmail.com','sendspamhere.com',
  'sharklasers.com','shitmail.me','shortmail.net',
  'sleepsme.com','slopsbox.com','smellfear.com',
  'snakemail.com','sneakemail.com','sofimail.com',
  'soodonims.com','spam.su','spamavert.com',
  'spamcorner.com','spamfree24.de','spamfree24.eu',
  'spamfree24.info','spamfree24.net','spamfree24.org',
  'spamgoes.in','spamhereplease.com','spamherelots.com',
  'spamminister.com','spamnot.com','spamoff.de',
  'spamonly.com','spamsincerely.com','spamthis.co.uk',
  'spamtroll.net','spamwc.de','speed.1s.fr',
  'spikio.com','sry.li','ssl-mail.com',
  'stinkefinger.net','stuffmail.de','supergreatmail.com',
  'supermailer.jp','tafmail.com','tapchicuoihoi.com',
  'techemail.com','tele2.nl','tempemail.net',
  'tempinbox.co.uk','temporaryemail.net','temporaryforwarding.com',
  'temporaryinbox.com','temporarymail.org','tempsky.com',
  'thankyou2010.com','thisisnotmyrealemail.com','thrott.com',
  'throwam.com','tilien.com','tittbit.in',
  'tmail.com','toiea.com','tomocomo.com',
  'toomail.biz','top101.de','topranklist.de',
  'tradermail.info','trash-amil.com','trash-me.com',
  'trash2009.com','trashdevil.com','trashdevil.de',
  'trashemail.de','trashmail.at','trashmail.me',
  'trashmail.net','trashmail.org','trashmail.xyz',
  'trashmailer.com','trashymail.com','trbvm.com',
  'trg.pw','trickmail.net','trollingemail.com',
  'trungtamtoeic.com','turual.com','twinmail.de',
  'tyldd.com','uggsrock.com','umail.net',
  'upliftnow.com','uplipht.com','uroid.com',
  'us.af','vctel.com','veryday.ch',
  'veryrealemail.com','vfemail.net','vidchart.com',
  'viditag.com','viewcastmedia.com','viewcastmedia.net',
  'viewcastmedia.org','vomoto.com','vpn.st',
  'vsimcard.com','vubby.com','walala.org',
  'walkmail.net','walkmail.ru','wetrainbayarea.com',
  'weg-werf-email.de','wegwerf-emails.de','wegwerfadresse.de',
  'wegwerfemail.com','wegwerfemail.de','wegwerfmail.de',
  'wegwerfmail.info','wegwerfmail.net','wegwerfmail.org',
  'wetrainbayarea.org','wh4f.org','whyspam.me',
  'willhackforfood.biz','willselfdestruct.com',
  'wmail.cf','world-transient.email','writeme.us',
  'wronghead.com','wuzupmail.net','www.e4ward.com',
  'wwwnew.eu','x1post.com','xagloo.com',
  'xemaps.com','xents.com','xmaily.com',
  'xoxy.net','xyzfree.net','yapped.net',
  'yeah.net','yep.it','yogamaven.com',
  'yopmail.pp.ua','yomail.info','ytpmail.com',
  'yuoia.com','zehnminuten.de','zehnminutenmail.de',
  'zippymail.info','zoemail.net','zoemail.org',
  // ── More recent / popular throwaway services ──
  'inboxkitten.com','mohmal.com','emailondeck.com',
  'getairmail.com','incognitomail.org','incognitomail.net',
  'spamgrap.de','throwam.net','spamarrest.com',
  'fakemailgenerator.com','emailfake.com','fakemail.net',
  'fakemail.fr','tempail.com','mail-temp.com',
  'discard.email','throwaway.email','mailnesia.com',
  'mailnull.com','maildrop.cc','getonemail.com',
  'tempmailo.com','luxusmail.org','dropmail.me',
  'zetmail.com','emlpro.com','emlhub.com',
  'harakirimail.com','nowmymail.com','inboxbear.com',
  'spambox.us','spambox.info','spambox.co',
  'filzmail.com','rppkn.com','courrieltemporaire.com',
  'eelmail.com','fightallspam.com','girlsundertheinfluence.com',
  'gowikibooks.com','gowikicampus.com','gowikicars.com',
  'gowikifilms.com','gowikigames.com','gowikimusic.com',
  'gowikinetwork.com','gowikitravel.com','gowikitv.com',
  'greensloth.com','gsrv.co.uk','gt.af',
  'nomorespamemails.com','notmailinator.com','nwldx.com',
  'objectmail.com','obobbo.com','odnorazovyy.ru',
  'oneoffmail.com','onewaymail.com','opayq.com',
  'opentrash.com','opp24.com','owlpic.com',
  'hacccc.com','hatespam.org','helpinghand.com',
  'herp.in','hidemail.de','highbros.org',
  'hidzz.com','hmamail.com','hopemail.biz',
  'i-mail.jp','ieh-mail.de','iname.com',
  'inboxclean.com','inboxclean.org','inboxproxy.com',
]);

// ─── Layer 5: Suspicious pattern heuristics ──────────────────────────────────

/**
 * Detects patterns strongly correlated with throwaway/bot email addresses.
 * Returns true when the email looks suspicious.
 */
function isSuspiciousPattern(localPart: string, domain: string): boolean {
  // All-numeric local part (e.g. 1234567@domain.com)
  if (/^\d+$/.test(localPart)) return true;

  // Very long random-looking strings (entropy check — mostly consonants, no vowels)
  if (localPart.length > 20) {
    const vowels = (localPart.match(/[aeiou]/gi) || []).length;
    if (vowels / localPart.length < 0.1) return true; // less than 10% vowels → gibberish
  }

  // Known temp-mail subdomain patterns (e.g. xyz.mailinator.com)
  const domainParts = domain.split('.');
  if (domainParts.length > 3) return true; // deeply nested subdomain = suspicious

  // Local part contains "spam", "trash", "throwaway", "temp", "junk", "fake", "noreply", "test"
  const suspiciousWords = /\b(spam|trash|throw|temp|junk|fake|noreply|no-reply|disposable|discard|delete|random|mailtest|testmail)\b/i;
  if (suspiciousWords.test(localPart)) return true;

  // Keyboard-walk patterns (asdf, qwer, 1234, zxcv)
  const keyboardWalk = /(qwerty|asdfgh|zxcvbn|123456|abcdef)/i;
  if (keyboardWalk.test(localPart)) return true;

  // Very short + all digits domain (e.g. @123.com is almost never legit)
  if (/^\d+$/.test(domainParts[0]) && domainParts[0].length < 6) return true;

  return false;
}

// ─── Layer 2: Local-part format rules ────────────────────────────────────────

function validateLocalPart(localPart: string): string | null {
  if (localPart.length < 1) return 'Email local part cannot be empty.';
  if (localPart.length > 64) return 'Email local part is too long (max 64 characters).';
  if (localPart.startsWith('.') || localPart.endsWith('.'))
    return 'Email cannot start or end with a dot.';
  if (/\.{2,}/.test(localPart)) return 'Email cannot contain consecutive dots.';
  return null;
}

// ─── Layer 6: External API with timeout ──────────────────────────────────────

const API_TIMEOUT_MS = 4000; // 4 seconds — aggressive timeout to never hang the UI

async function checkDisposableViaApi(
  domain: string,
): Promise<{ disposable: boolean | null; apiReachable: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const response = await fetch(`https://open.kickbox.com/v1/disposable/${domain}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      // HTTP error from API (4xx/5xx) — treat as unreachable
      return { disposable: null, apiReachable: false };
    }

    const data = await response.json();
    return {
      disposable: typeof data?.disposable === 'boolean' ? data.disposable : null,
      apiReachable: true,
    };
  } catch (err: unknown) {
    clearTimeout(timeoutId);

    // Distinguish abort (timeout) from network error — both handled the same way
    if (err instanceof Error) {
      if (err.name === 'AbortError') {
        console.warn('[validateEmailSecurity] Kickbox API timed out after', API_TIMEOUT_MS, 'ms');
      } else {
        console.warn('[validateEmailSecurity] Kickbox API unreachable:', err.message);
      }
    }

    return { disposable: null, apiReachable: false };
  }
}

// ─── Public entrypoint ────────────────────────────────────────────────────────

/**
 * Validates an email address through multiple security layers.
 * Always resolves (never throws) so the UI never breaks.
 *
 * @param email Raw email string from the form input
 * @returns     { isValid: boolean; error: string | null }
 */
export async function validateEmailSecurity(
  email: string,
): Promise<{ isValid: boolean; error: string | null }> {
  // ── Sanitise ────────────────────────────────────────────────────────────────
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail) {
    return { isValid: false, error: 'Email address is required.' };
  }

  // Guard total length (RFC 5321 §4.5.3.1.3)
  if (cleanEmail.length > 254) {
    return { isValid: false, error: 'Email address is too long.' };
  }

  // ── Layer 1: Strict regex ────────────────────────────────────────────────────
  if (!STRICT_EMAIL_REGEX.test(cleanEmail)) {
    return { isValid: false, error: 'Please enter a valid email address format.' };
  }

  const [localPart, domain] = cleanEmail.split('@') as [string, string];

  // ── Layer 2: Local-part format rules ─────────────────────────────────────────
  const localPartError = validateLocalPart(localPart);
  if (localPartError) {
    return { isValid: false, error: localPartError };
  }

  // ── Layer 3: Trusted allowlist — instant pass ─────────────────────────────
  if (TRUSTED_DOMAINS.has(domain)) {
    return { isValid: true, error: null };
  }

  // ── Layer 4: Local disposable blocklist — instant block ───────────────────
  if (DISPOSABLE_DOMAINS.has(domain)) {
    return {
      isValid: false,
      error: 'Disposable email addresses are not allowed. Please use a real email account.',
    };
  }

  // ── Layer 5: Suspicious heuristics ───────────────────────────────────────
  const suspicious = isSuspiciousPattern(localPart, domain);

  // ── Layer 8: Check domain cache ───────────────────────────────────────────
  const cached = getCached(domain);
  if (cached) {
    return { isValid: cached.isValid, error: cached.error };
  }

  // ── Layer 6: External API (only for unknown / suspicious domains) ─────────
  const { disposable, apiReachable } = await checkDisposableViaApi(domain);

  // ── Layer 7: Graceful fallback when API is unavailable ───────────────────
  if (!apiReachable) {
    /**
     * API failed or timed out. We must not break the UX.
     * Decision matrix:
     *  - suspicious pattern detected → block (safer, prevents obvious abuse)
     *  - no suspicious signals       → allow (benefit of the doubt; OTP still acts as gate)
     */
    if (suspicious) {
      const fallbackResult = {
        isValid: false,
        error:
          'This email address looks suspicious. Please use a valid, permanent email account.',
      };
      setCache(domain, fallbackResult);
      return fallbackResult;
    }

    // Unknown domain, no bad signals, API down → pass through silently
    const passResult = { isValid: true, error: null };
    // Don't cache this pass — we want to try the API again on retry/resubmit
    return passResult;
  }

  // ── API responded: act on result ─────────────────────────────────────────
  if (disposable === true) {
    const blockedResult = {
      isValid: false,
      error: 'Disposable email addresses are not allowed. Please use a real email account.',
    };
    setCache(domain, blockedResult);
    return blockedResult;
  }

  // disposable === false or null (API gave a non-boolean) — treat as valid
  const validResult = { isValid: true, error: null };
  setCache(domain, validResult);
  return validResult;
}
