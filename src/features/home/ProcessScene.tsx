import { PinnedSteps } from "@/features/shared/PinnedSteps";
import type { ProcessStage } from "@/lib/content";

type ProcessSceneProps = {
  head: { kicker: string; title: string; lede?: string | undefined };
  stages: ProcessStage[];
};

/** The five working stages, as a pinned sequence. */
export function ProcessScene({ head, stages }: ProcessSceneProps) {
  return (
    <PinnedSteps
      tone="light"
      id="process"
      head={head}
      steps={stages.map((stage) => ({ id: stage.id, title: stage.title, body: stage.summary, meta: stage.meta }))}
    />
  );
}
