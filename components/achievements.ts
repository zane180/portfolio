// Achievement engine — localStorage-backed, event-driven.
export interface Achievement {
  id: string;
  emoji: string;
  title: string;
  hint: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "buckets", emoji: "🏀", title: "Clutch Gene", hint: "Win the varsity final" },
  { id: "fur-elise", emoji: "🎹", title: "Beethoven Mode", hint: "Play Für Elise to the end" },
  { id: "champion", emoji: "🏊", title: "Back-to-Back", hint: "Defend the U18 swim title" },
  { id: "deep-diver", emoji: "📖", title: "Deep Diver", hint: "Expand every project" },
  { id: "matched", emoji: "💘", title: "Algorithm Approved", hint: "Run the compatibility engine" },
  { id: "explorer", emoji: "🗺️", title: "Full Tour", hint: "Visit every chapter" },
];

const KEY = "zane-achievements";

export function getUnlocked(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function unlock(id: string): void {
  if (typeof window === "undefined") return;
  const current = getUnlocked();
  if (current.includes(id)) return;
  const ach = ACHIEVEMENTS.find((a) => a.id === id);
  if (!ach) return;
  localStorage.setItem(KEY, JSON.stringify([...current, id]));
  window.dispatchEvent(new CustomEvent("zane-achievement", { detail: ach }));
}
