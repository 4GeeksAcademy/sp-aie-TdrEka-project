"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { CandidateForm } from "@/src/components/CandidateForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { ErrorMessage } from "@/src/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { getCandidateById, updateCandidate } from "@/src/lib/api";
import type { Candidate, CandidateFormData } from "@/src/types";

export default function EditCandidatePage() {
  const params = useParams();
  const router = useRouter();

  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const candidateId = rawId ?? "";

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pageError, setPageError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    async function loadCandidate() {
      if (!candidateId) {
        setPageError("Something went wrong. Please try again.");
        setIsPageLoading(false);
        return;
      }

      setIsPageLoading(true);
      setPageError(null);

      try {
        const data = await getCandidateById(candidateId);
        setCandidate(data);
      } catch {
        setPageError("Something went wrong. Please try again.");
      } finally {
        setIsPageLoading(false);
      }
    }

    loadCandidate();
  }, [candidateId]);

  async function handleSubmit(data: CandidateFormData) {
    if (!candidate) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await updateCandidate(candidate.id, data);
      setSubmitSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push(`/candidates/${candidate.id}`);
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  const initialData: Partial<CandidateFormData> | undefined = candidate
    ? {
        full_name: candidate.full_name,
        email: candidate.email,
        phone: candidate.phone,
        position: candidate.position,
        linkedin_url: candidate.linkedin_url,
        cv_url: candidate.cv_url,
        experience_years: candidate.experience_years,
        status: candidate.status,
        stage: candidate.stage,
      }
    : undefined;

  return (
    <PageWrapper title="Edit candidate" showBack={true}>
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit candidate</h1>

        {isPageLoading ? <LoadingSpinner /> : null}

        {!isPageLoading && pageError ? <ErrorMessage message={pageError} /> : null}

        {!isPageLoading && !pageError && candidate ? (
          <>
            {submitError ? (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
                {submitError}
              </div>
            ) : null}
            {submitSuccess ? (
              <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
                ✓ Changes saved successfully. Redirecting...
              </div>
            ) : null}
            <CandidateForm
              initialData={initialData}
              onSubmit={handleSubmit}
              isLoading={isSubmitting}
              submitLabel="Save changes"
            />
          </>
        ) : null}
      </div>
    </PageWrapper>
  );
}
