import { STATUS_COLORS, STATUS_LABELS } from "@/src/lib/constants";
import type { CandidateStatus } from "@/src/types";

interface StatusBadgeProps {
  status: CandidateStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_COLORS[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
