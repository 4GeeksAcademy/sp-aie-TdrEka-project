"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

import { PageWrapper } from "@/src/components/layout/PageWrapper";
import { ErrorMessage } from "@/src/components/ui/ErrorMessage";
import { LoadingSpinner } from "@/src/components/ui/LoadingSpinner";
import { StageBadge } from "@/src/components/ui/StageBadge";
import { StatusBadge } from "@/src/components/ui/StatusBadge";
import {
  createNote,
  deleteNote,
  getCandidateById,
  patchCandidate,
} from "@/src/lib/api";
import { STAGE_LABELS, STATUS_LABELS } from "@/src/lib/constants";
import type { Candidate, CandidateStage, CandidateStatus, Note } from "@/src/types";

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

export default function CandidateDetailPage() {
  const params = useParams();
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id;
  const candidateId = rawId ?? "";

  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusValue, setStatusValue] = useState<CandidateStatus | "">("");
  const [stageValue, setStageValue] = useState<CandidateStage | "">("");

  const [statusSaving, setStatusSaving] = useState(false);
  const [stageSaving, setStageSaving] = useState(false);
  const [statusSuccess, setStatusSuccess] = useState(false);
  const [stageSuccess, setStageSuccess] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [stageError, setStageError] = useState<string | null>(null);

  const [noteContent, setNoteContent] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);
  const [noteAddSuccess, setNoteAddSuccess] = useState(false);
  const [addingNote, setAddingNote] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [reloadToken, setReloadToken] = useState(0);

  useEffect(() => {
    console.log("Route param id:", rawId);
  }, [rawId]);

  useEffect(() => {
    let isMounted = true;

    async function fetchCandidateAndNotes() {
      await Promise.resolve();

      if (!isMounted) {
        return;
      }

      if (!candidateId) {
        setCandidate(null);
        setNotes([]);
        setError("Invalid candidate ID.");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const candidateData = await getCandidateById(candidateId);

        if (!isMounted) {
          return;
        }

        setCandidate(candidateData);
        setNotes(Array.isArray(candidateData.notes) ? candidateData.notes : []);
        setStatusValue(candidateData.status);
        setStageValue(candidateData.stage);
      } catch (err) {
        if (!isMounted) {
          return;
        }

        const message = err instanceof Error ? err.message : "Failed to load candidate details.";
        setError(message);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchCandidateAndNotes();

    return () => {
      isMounted = false;
    };
  }, [candidateId, reloadToken]);

  async function handleSaveStatus() {
    if (!candidate || !statusValue) {
      return;
    }

    setStatusSaving(true);
    setStatusError(null);
    setStatusSuccess(false);

    try {
      const updated = await patchCandidate(candidate.id, { status: statusValue });
      setCandidate(updated);
      setStatusValue(updated.status);
      setStatusSuccess(true);
      setTimeout(() => setStatusSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update status.";
      setStatusError(message);
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleSaveStage() {
    if (!candidate || !stageValue) {
      return;
    }

    setStageSaving(true);
    setStageError(null);
    setStageSuccess(false);

    try {
      const updated = await patchCandidate(candidate.id, { stage: stageValue });
      setCandidate(updated);
      setStageValue(updated.stage);
      setStageSuccess(true);
      setTimeout(() => setStageSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to update stage.";
      setStageError(message);
    } finally {
      setStageSaving(false);
    }
  }

  async function handleAddNote() {
    if (!candidate) {
      return;
    }

    const content = noteContent.trim();
    if (!content) {
      setNoteError("Note content cannot be empty.");
      return;
    }

    setAddingNote(true);
    setNoteError(null);
    setNoteAddSuccess(false);

    try {
      const newNote = await createNote(candidate.id, content);
      setNotes((prev) => [...prev, newNote]);
      setNoteContent("");
      setNoteAddSuccess(true);
      setTimeout(() => setNoteAddSuccess(false), 2000);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create note.";
      setNoteError(message);
    } finally {
      setAddingNote(false);
    }
  }

  async function handleDeleteNote(noteId: string) {
    if (!candidate) {
      return;
    }

    setDeletingNoteId(noteId);
    setNoteError(null);

    try {
      await deleteNote(candidate.id, noteId);
      setNotes((prev) => prev.filter((note) => note.id !== noteId));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete note.";
      setNoteError(message);
    } finally {
      setDeletingNoteId(null);
    }
  }

  return (
    <PageWrapper title="Candidate Detail" showBack={true}>
      <div className="mb-5 flex items-center justify-between">
        <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-[#f97316]">
          ← Back to pipeline
        </Link>
        <Link
          href={`/candidates/${candidateId}/edit`}
          className="inline-flex items-center rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition hover:border-[#f97316] hover:text-[#f97316]"
        >
          Edit candidate
        </Link>
      </div>

      {loading ? <LoadingSpinner /> : null}

      {!loading && error ? (
        <ErrorMessage message={error} onRetry={() => setReloadToken((prev) => prev + 1)} />
      ) : null}

      {!loading && !error && candidate ? (
        <div className="space-y-6">
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{candidate.full_name}</h1>

            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
              <p>
                <span className="font-semibold text-slate-900">Email:</span> {candidate.email}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Phone:</span> {candidate.phone}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Position:</span> {candidate.position}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Years of experience:</span>{" "}
                {candidate.experience_years}
              </p>
              <p>
                <span className="font-semibold text-slate-900">LinkedIn URL:</span>{" "}
                {candidate.linkedin_url ? (
                  <a
                    href={candidate.linkedin_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#f97316] hover:underline"
                  >
                    View profile
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p>
                <span className="font-semibold text-slate-900">CV link:</span>{" "}
                {candidate.cv_url ? (
                  <a
                    href={candidate.cv_url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#f97316] hover:underline"
                  >
                    Open CV
                  </a>
                ) : (
                  "Not provided"
                )}
              </p>
              <p>
                <span className="font-semibold text-slate-900">Application date:</span>{" "}
                {formatDate(candidate.applied_at)}
              </p>
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <StatusBadge status={candidate.status} />
              <StageBadge stage={candidate.stage} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-lg border border-slate-200 p-3">
                <label htmlFor="status-select" className="mb-1 block text-xs font-medium uppercase text-slate-500">
                  Status
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="status-select"
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value as CandidateStatus)}
                    className="min-w-44 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveStatus}
                    disabled={statusSaving || !statusValue || statusValue === candidate.status}
                    className="rounded-md bg-[#f97316] px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {statusSaving ? "Saving..." : "Save"}
                  </button>
                  {statusSuccess ? <span className="text-xs font-medium text-green-700">✓ Updated</span> : null}
                </div>
                {statusError ? <p className="mt-2 text-xs text-red-700">{statusError}</p> : null}
              </div>

              <div className="rounded-lg border border-slate-200 p-3">
                <label htmlFor="stage-select" className="mb-1 block text-xs font-medium uppercase text-slate-500">
                  Stage
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  <select
                    id="stage-select"
                    value={stageValue}
                    onChange={(event) => setStageValue(event.target.value as CandidateStage)}
                    className="min-w-44 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
                  >
                    {STAGE_OPTIONS.map((stage) => (
                      <option key={stage} value={stage}>
                        {STAGE_LABELS[stage]}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={handleSaveStage}
                    disabled={stageSaving || !stageValue || stageValue === candidate.stage}
                    className="rounded-md bg-[#f97316] px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {stageSaving ? "Saving..." : "Save"}
                  </button>
                  {stageSuccess ? <span className="text-xs font-medium text-green-700">✓ Updated</span> : null}
                </div>
                {stageError ? <p className="mt-2 text-xs text-red-700">{stageError}</p> : null}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Notes</h2>

            <div className="mt-4">
              <label htmlFor="new-note" className="mb-1 block text-xs font-medium uppercase text-slate-500">
                Add note
              </label>
              <textarea
                id="new-note"
                value={noteContent}
                onChange={(event) => setNoteContent(event.target.value)}
                rows={4}
                placeholder="Write a note about this candidate..."
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-[#f97316] focus:ring-1 focus:ring-[#f97316]"
              />
              <div className="mt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleAddNote}
                  disabled={addingNote}
                  className="rounded-md bg-[#f97316] px-3 py-2 text-sm font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {addingNote ? "Adding..." : "Add note"}
                </button>
                {noteAddSuccess ? <p className="text-xs font-medium text-green-700">✓ Note added</p> : null}
                {noteError ? <p className="text-xs text-red-700">{noteError}</p> : null}
              </div>
            </div>

            <div className="mt-6">
              {notes.length === 0 ? (
                <p className="rounded-lg border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                  No notes yet
                </p>
              ) : (
                <ul className="space-y-3">
                  {(notes ?? []).map((note) => (
                    <li key={note.id} className="rounded-lg border border-slate-200 p-4">
                      <p className="whitespace-pre-wrap text-sm text-slate-800">{note.content}</p>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-xs text-slate-500">{formatDate(note.created_at)}</span>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          disabled={deletingNoteId === note.id}
                          className="text-xs font-medium text-red-600 transition hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingNoteId === note.id ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      ) : null}
    </PageWrapper>
  );
}
