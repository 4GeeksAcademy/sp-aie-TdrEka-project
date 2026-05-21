import { STAGE_COLORS, STAGE_LABELS } from "@/src/lib/constants";
import type { CandidateStage } from "@/src/types";

interface StageBadgeProps {
  stage: CandidateStage;
}

export function StageBadge({ stage }: StageBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STAGE_COLORS[stage]}`}
    >
      {STAGE_LABELS[stage]}
    </span>
  );
}
