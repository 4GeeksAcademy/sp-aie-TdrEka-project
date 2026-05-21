"use client";

import { useMemo, useState } from "react";

import { POSITION, STAGE_LABELS, STATUS_LABELS } from "@/src/lib/constants";
import type { CandidateFormData, CandidateStage, CandidateStatus } from "@/src/types";

interface CandidateFormProps {
  initialData?: Partial<CandidateFormData>;
  onSubmit: (data: CandidateFormData) => Promise<void>;
  isLoading: boolean;
  submitLabel: string;
}

type FormErrors = Partial<Record<keyof CandidateFormData, string>>;

const STATUS_OPTIONS: CandidateStatus[] = ["received", "in_progress", "selected", "discarded"];
const STAGE_OPTIONS: CandidateStage[] = [
  "pending",
  "review",
  "personal_interview",
  "technical_interview",
  "offer_presented",
];

export function CandidateForm({
  initialData,
  onSubmit,
  isLoading,
  submitLabel,
}: CandidateFormProps) {
  const defaults = useMemo<CandidateFormData>(
    () => ({
      full_name: initialData?.full_name ?? "",
      email: initialData?.email ?? "",
      phone: initialData?.phone ?? "",
      position: initialData?.position ?? POSITION,
      linkedin_url: initialData?.linkedin_url ?? "",
      cv_url: initialData?.cv_url ?? "",
      experience_years: initialData?.experience_years ?? 0,
      status: initialData?.status ?? "received",
      stage: initialData?.stage ?? "pending",
    }),
    [initialData],
  );

  const [formData, setFormData] = useState<CandidateFormData>(defaults);
  const [errors, setErrors] = useState<FormErrors>({});

  function validate(data: CandidateFormData): FormErrors {
    const nextErrors: FormErrors = {};

    if (!data.full_name.trim()) {
      nextErrors.full_name = "Full name is required.";
    } else if (data.full_name.trim().length < 2) {
      nextErrors.full_name = "Full name must be at least 2 characters.";
    }

    if (!data.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/.+@.+\..+/.test(data.email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    if (!data.phone.trim()) {
      nextErrors.phone = "Phone is required.";
    }

    if (!data.position.trim()) {
      nextErrors.position = "Position is required.";
    }

    if (!Number.isFinite(data.experience_years)) {
      nextErrors.experience_years = "Years of experience is required.";
    } else if (data.experience_years < 0) {
      nextErrors.experience_years = "Years of experience must be 0 or greater.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const cleanedData: CandidateFormData = {
      ...formData,
      full_name: formData.full_name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      position: formData.position.trim(),
      linkedin_url: formData.linkedin_url?.trim() || undefined,
      cv_url: formData.cv_url?.trim() || undefined,
      experience_years: Number(formData.experience_years),
    };

    const validationErrors = validate(cleanedData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    await onSubmit(cleanedData);
  }

  function updateField<K extends keyof CandidateFormData>(key: K, value: CandidateFormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="full_name" className="mb-1 block text-sm font-medium text-slate-700">
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            value={formData.full_name}
            onChange={(event) => updateField("full_name", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
          {errors.full_name ? <p className="mt-1 text-xs text-red-700">{errors.full_name}</p> : null}
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
          {errors.email ? <p className="mt-1 text-xs text-red-700">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="phone" className="mb-1 block text-sm font-medium text-slate-700">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
          {errors.phone ? <p className="mt-1 text-xs text-red-700">{errors.phone}</p> : null}
        </div>

        <div>
          <label htmlFor="position" className="mb-1 block text-sm font-medium text-slate-700">
            Position
          </label>
          <input
            id="position"
            type="text"
            value={formData.position}
            onChange={(event) => updateField("position", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
          {errors.position ? <p className="mt-1 text-xs text-red-700">{errors.position}</p> : null}
        </div>

        <div>
          <label htmlFor="linkedin_url" className="mb-1 block text-sm font-medium text-slate-700">
            LinkedIn URL (optional)
          </label>
          <input
            id="linkedin_url"
            type="url"
            value={formData.linkedin_url ?? ""}
            onChange={(event) => updateField("linkedin_url", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
        </div>

        <div>
          <label htmlFor="cv_url" className="mb-1 block text-sm font-medium text-slate-700">
            CV URL (optional)
          </label>
          <input
            id="cv_url"
            type="url"
            value={formData.cv_url ?? ""}
            onChange={(event) => updateField("cv_url", event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
        </div>

        <div>
          <label
            htmlFor="experience_years"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Years of experience
          </label>
          <input
            id="experience_years"
            type="number"
            min={0}
            value={formData.experience_years}
            onChange={(event) => updateField("experience_years", Number(event.target.value))}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
          {errors.experience_years ? (
            <p className="mt-1 text-xs text-red-700">{errors.experience_years}</p>
          ) : null}
        </div>

        <div>
          <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(event) => updateField("status", event.target.value as CandidateStatus)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="stage" className="mb-1 block text-sm font-medium text-slate-700">
            Stage
          </label>
          <select
            id="stage"
            value={formData.stage}
            onChange={(event) => updateField("stage", event.target.value as CandidateStage)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          >
            {STAGE_OPTIONS.map((stage) => (
              <option key={stage} value={stage}>
                {STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-md bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isLoading ? (
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : null}
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
