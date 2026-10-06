/** What this visitor's device and settings allow (Motion & UX spec §4 tiers, §8 matrix). */
export type Tier = "a" | "b" | "c";

export type Capabilities = {
  /** a = full WebGL, b = CSS 3D with the same composition, c = static. */
  tier: Tier;
  reduced: boolean;
  finePointer: boolean;
  saveData: boolean;
};

type NavigatorWithHints = Navigator & {
  deviceMemory?: number;
  connection?: { saveData?: boolean };
};

function hasWebgl2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2"));
  } catch {
    return false;
  }
}

/** Safe defaults used on the server and before the first client effect. */
export const serverCapabilities: Capabilities = { tier: "c", reduced: true, finePointer: false, saveData: false };

export function readCapabilities(search: string = window.location.search): Capabilities {
  const nav = navigator as NavigatorWithHints;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine) and (hover: hover)").matches;
  const saveData = nav.connection?.saveData === true;

  let tier: Tier;
  if (reduced || !hasWebgl2()) tier = "c";
  else if (
    saveData ||
    !finePointer ||
    (nav.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
    (nav.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4)
  )
    tier = "b";
  else tier = "a";

  // QA override: ?tier=a|b|c. A forced "a" still needs WebGL2.
  const forced = new URLSearchParams(search).get("tier");
  if (forced === "a" || forced === "b" || forced === "c") {
    tier = forced === "a" && !hasWebgl2() ? "b" : forced;
  }

  return { tier, reduced, finePointer, saveData };
}
