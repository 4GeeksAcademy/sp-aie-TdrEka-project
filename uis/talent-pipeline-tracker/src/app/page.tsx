"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { ErrorMessage } from "@/src/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { StageBadge } from "@/src/components/ui/StageBadge";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import { STAGE_LABELS, STATUS_LABELS } from "@/src/lib/constants";
import { getCandidates } from "@/src/lib/api";
import type { Candidate, CandidateStage, CandidateStatus } from "@/src/types";

const STATUS_OPTIONS: CandidateStatus[] = ["received", "in_progress", "selected", "discarded"];
const STAGE_OPTIONS: CandidateStage[] = [
  "pending",
  "review",
  "personal_interview",
  "technical_interview",
  "offer_presented",
];

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return "Date unavailable";
  }

  const primaryDate = new Date(value);
  const date = Number.isNaN(primaryDate.getTime()) ? new Date(value.replace(" ", "T")) : primaryDate;

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

export default function HomePage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const selectedStatus = searchParams.get("status") ?? "";
  const selectedStage = searchParams.get("stage") ?? "";

  useEffect(() => {
    async function loadCandidates() {
      setLoading(true);
      setError(null);

      try {
        const data = await getCandidates();
        console.log("Candidates fetched:", data);
        setCandidates(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch candidates.";
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadCandidates();
  }, []);

  function updateQueryParam(key: "status" | "stage", value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const filteredCandidates = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return candidates.filter((candidate) => {
      const matchesStatus = selectedStatus ? candidate.status === selectedStatus : true;
      const matchesStage = selectedStage ? candidate.stage === selectedStage : true;
      const matchesSearch = normalizedSearch
        ? candidate.full_name.toLowerCase().includes(normalizedSearch) ||
          candidate.email.toLowerCase().includes(normalizedSearch)
        : true;

      return matchesStatus && matchesStage && matchesSearch;
    });
  }, [candidates, selectedStatus, selectedStage, search]);

  return (
    <PageWrapper title="Candidate Pipeline">
      <section className="mb-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Candidate Pipeline</h1>
          <p className="mt-1 text-sm text-slate-600">Executive Assistant · Zaragoza headquarters</p>
        </div>
        <Link
          href="/candidates/new"
          className="inline-flex items-center justify-center rounded-md bg-[#f97316] px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-600"
        >
          Add candidate
        </Link>
      </section>

      <section className="mb-5 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-3">
        <div>
          <label htmlFor="status-filter" className="mb-1 block text-xs font-medium uppercase text-slate-500">
            Filter by status
          </label>
          <select
            id="status-filter"
            value={selectedStatus}
            onChange={(event) => updateQueryParam("status", event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          >
            <option value="">All statuses</option>
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {STATUS_LABELS[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="stage-filter" className="mb-1 block text-xs font-medium uppercase text-slate-500">
            Filter by stage
          </label>
          <select
            id="stage-filter"
            value={selectedStage}
            onChange={(event) => updateQueryParam("stage", event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          >
            <option value="">All stages</option>
            {STAGE_OPTIONS.map((stage) => (
              <option key={stage} value={stage}>
                {STAGE_LABELS[stage]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="search-candidates" className="mb-1 block text-xs font-medium uppercase text-slate-500">
            Search
          </label>
          <input
            id="search-candidates"
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm outline-none placeholder:text-slate-400 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
          />
        </div>
      </section>

      <p className="mb-4 text-sm text-slate-600">
        Showing {filteredCandidates.length} of {candidates.length} candidates
      </p>

      {loading ? <LoadingSpinner /> : null}

      {!loading && error ? (
        <ErrorMessage
          message={error}
          onRetry={() => {
            setError(null);
            setLoading(true);
            getCandidates()
              .then((data) => setCandidates(data))
              .catch((err) => {
                const message = err instanceof Error ? err.message : "Failed to fetch candidates.";
                setError(message);
              })
              .finally(() => setLoading(false));
          }}
        />
      ) : null}

      {!loading && !error && filteredCandidates.length === 0 ? (
        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-600 shadow-sm">
          No candidates match your filters.
        </div>
      ) : null}

      {!loading && !error && filteredCandidates.length > 0 ? (
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <article
              key={candidate.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <h2 className="text-lg font-bold text-slate-900">
                <Link href={`/candidates/${candidate.id}`} className="hover:text-[#f97316]">
                  {candidate.full_name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-slate-600">{candidate.position}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <StatusBadge status={candidate.status} />
                <StageBadge stage={candidate.stage} />
              </div>
              <p className="mt-4 text-xs font-medium text-slate-500">
                Applied on {formatDate(candidate.applied_at)}
              </p>
            </article>
          ))}
        </section>
      ) : null}
    </PageWrapper>
  );
}
