export type CandidateStatus = "received" | "in_progress" | "selected" | "discarded";

export type CandidateStage =
  | "pending"
  | "review"
  | "personal_interview"
  | "technical_interview"
  | "offer_presented";

export interface Candidate {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url: string | null;
  cv_url: string | null;
  status: CandidateStatus;
  stage: CandidateStage;
  experience_years: number;
  applied_at: string;
  notes?: Note[];
  notes_count?: number;
}

export interface Note {
  id: string;
  record_id: string;
  content: string;
  created_at: string;
}

export interface CandidateFormData {
  full_name: string;
  email: string;
  phone: string;
  position: string;
  linkedin_url?: string;
  cv_url?: string;
  experience_years: number;
  status: CandidateStatus;
  stage: CandidateStage;
}
