import type { CandidateStage, CandidateStatus } from "@/src/types";

export const STATUS_LABELS: Record<CandidateStatus, string> = {
  received: "Received",
  in_progress: "In progress",
  selected: "Selected",
  discarded: "Discarded",
};

export const STAGE_LABELS: Record<CandidateStage, string> = {
  pending: "Pending review",
  review: "Under review",
  personal_interview: "Personal interview",
  technical_interview: "Technical interview",
  offer_presented: "Offer presented",
};

export const STATUS_COLORS: Record<CandidateStatus, string> = {
  received: "bg-blue-100 text-blue-800",
  in_progress: "bg-yellow-100 text-yellow-800",
  selected: "bg-green-100 text-green-800",
  discarded: "bg-red-100 text-red-800",
};

export const STAGE_COLORS: Record<CandidateStage, string> = {
  pending: "bg-slate-100 text-slate-700",
  review: "bg-purple-100 text-purple-800",
  personal_interview: "bg-orange-100 text-orange-800",
  technical_interview: "bg-pink-100 text-pink-800",
  offer_presented: "bg-emerald-100 text-emerald-800",
};

export const POSITION = "Executive Assistant";
export const API_BASE = process.env.NEXT_PUBLIC_API_URL;
