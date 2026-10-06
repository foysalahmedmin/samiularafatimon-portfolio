/** Tiny shared state for the cursor follower, so a WebGL scene can ask for the "PLAY" ring too. */
export type CursorKind = "default" | "link" | "play" | "drag" | "view";

type Listener = (kind: CursorKind) => void;

let current: CursorKind = "default";
const listeners = new Set<Listener>();

export const cursorStore = {
  get: () => current,
  set(kind: CursorKind) {
    if (kind === current) return;
    current = kind;
    listeners.forEach((listener) => listener(kind));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};
