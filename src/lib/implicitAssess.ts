// System de tracking implicite pour personnalisation bien-être
// Envoie des signaux discrets sans questionnaires frontaux

type ImplicitSignal = {
  instrument: string;     // "WHO5" | "STAI6" | "SAM" | "POMS" | "AAQ2" | etc.
  item_id: string;        // ex "item_interest", "calm", "tension"
  proxy: string;          // "choice" | "duration" | "skip" | "repeat" | "preset" | "reaction" | "completion" | "cadence_followed" | "like"
  value: string | number; // valeur brute -> bucketisée par serializeImplicit
  weight?: number;
  context?: Record<string, string>;
  ts?: number;
};

const signalQueue: ImplicitSignal[] = [];
let flushTimer: any = null;
let isEnabled = true; // Bind au switch "Personnalisation bien-être"

// Active/désactive le tracking
export function setImplicitTracking(enabled: boolean) {
  isEnabled = enabled;
  if (!enabled) {
    // Vider la queue si désactivé
    signalQueue.length = 0;
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
  }
}

// Récupérer l'état actuel
export function getImplicitTrackingState(): boolean {
  return isEnabled;
}

// Tracker un signal implicite
export function trackImplicitAssess(signal: ImplicitSignal) {
  if (!isEnabled) return;
  
  signalQueue.push({
    ...signal,
    ts: Date.now(),
    weight: signal.weight ?? 0.5
  });
  
  // Démarrer le timer de flush si pas déjà actif
  if (!flushTimer) {
    flushTimer = setTimeout(flushImplicitAssess, 12000); // 12 secondes
  }
}

// Envoyer le batch de signaux au backend
export async function flushImplicitAssess() {
  if (flushTimer) {
    clearTimeout(flushTimer);
    flushTimer = null;
  }
  
  if (signalQueue.length === 0) return;
  
  const batch = signalQueue.splice(0); // Vider la queue
  const today = new Date().toISOString().slice(0, 10);
  
  const payload = {
    session_id: `implicit:${today}`, // 1 session par jour par user
    answers: batch.map(s => ({
      item_id: `${s.instrument}.${s.item_id}`,
      value: serializeImplicit(s),
      meta: {
        proxy: s.proxy,
        ctx: s.context,
        w: s.weight,
        implicit: true,
        ts: s.ts
      }
    }))
  };
  
  try {
    // TODO: Implémenter submitAssess ou l'équivalent
    // await submitAssess(payload);
    console.log('📊 Implicit signals sent:', payload);
  } catch (e) {
    // Silencieux - pas d'erreur visible pour l'utilisateur
    console.debug('Implicit assess failed:', e);
  }
}

// Mapper les signaux vers des valeurs standardisées
function serializeImplicit(s: ImplicitSignal): string {
  const value = s.value;
  const proxy = s.proxy;
  
  // Durée (en ms) -> niveau d'engagement
  if (proxy === "duration") {
    const ms = Number(value) || 0;
    if (ms >= 300000) return "strongly_agree"; // > 5 min
    if (ms >= 90000) return "agree";           // 1.5-5 min
    if (ms >= 30000) return "neutral";         // 30s-90s
    return "disagree";                         // < 30s
  }
  
  // Skip précoce = inconfort
  if (proxy === "skip") return "disagree";
  
  // Répétition = engagement positif
  if (proxy === "repeat") return "agree";
  
  // Like = engagement positif fort
  if (proxy === "like") return "strongly_agree";
  
  // Choix explicites
  if (proxy === "choice") {
    const v = String(value).toLowerCase();
    // Choix calmes
    if (["calm", "soft", "slow", "private", "2d", "low", "silence", "reduce_particles", "reduce_effects"].includes(v)) {
      return "agree";
    }
    // Choix énergiques
    if (["energize", "energy", "fast", "public", "3d", "high", "voice"].includes(v)) {
      return "neutral";
    }
    // Choix ambigus
    return "neutral";
  }
  
  // Suivi de cadence (0..1)
  if (proxy === "cadence_followed") {
    const ratio = Number(value) || 0;
    if (ratio >= 0.7) return "agree";
    if (ratio >= 0.4) return "neutral";
    return "disagree";
  }
  
  // Completion (0..1)
  if (proxy === "completion") {
    const ratio = Number(value) || 0;
    if (ratio >= 0.8) return "agree";
    if (ratio >= 0.5) return "neutral";
    return "disagree";
  }
  
  // Preset - mapper selon les besoins
  if (proxy === "preset") {
    const v = String(value).toLowerCase();
    if (v.includes("calm") || v.includes("low") || v.includes("sleep")) return "agree";
    if (v.includes("medium")) return "neutral";
    return "neutral";
  }
  
  // Réactions émotionnelles
  if (proxy === "reaction") {
    const v = String(value).toLowerCase();
    if (v.includes("heavy") || v.includes("difficult")) return "disagree";
    if (v.includes("empathy") || v.includes("comfort")) return "agree";
    return "neutral";
  }
  
  // Fallback
  return String(value ?? "neutral");
}

// Force flush (pour cleanup ou changement de page)
export function forceFlushImplicitAssess() {
  if (signalQueue.length > 0) {
    flushImplicitAssess();
  }
}
