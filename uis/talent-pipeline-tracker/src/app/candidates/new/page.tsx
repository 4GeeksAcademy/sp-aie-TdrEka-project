"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CandidateForm } from "@/src/components/CandidateForm";
import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { createCandidate } from "@/src/lib/api";
import type { CandidateFormData } from "@/src/types";

export default function NewCandidatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  async function handleSubmit(data: CandidateFormData) {
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      await createCandidate(data);
      setSubmitSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      router.push("/");
    } catch {
      setSubmitError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageWrapper title="Register candidate" showBack={true}>
      <div className="mx-auto w-full max-w-3xl space-y-4">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Register candidate</h1>
        {submitError ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">
            {submitError}
          </div>
        ) : null}
        {submitSuccess ? (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-800">
            ✓ Candidate registered successfully. Redirecting...
          </div>
        ) : null}
        <CandidateForm onSubmit={handleSubmit} isLoading={isSubmitting} submitLabel="Create candidate" />
      </div>
    </PageWrapper>
  );
}
