import { API_BASE } from "@/src/lib/constants";
import type { Candidate, CandidateFormData, Note } from "@/src/types";

function buildUrl(path: string): string {
  if (!API_BASE) {
    throw new Error("API base URL is not configured. Please set NEXT_PUBLIC_API_URL.");
  }

  return `${API_BASE}${path}`;
}

function getErrorMessage(action: string, res: Response): string {
  return `${action} failed: ${res.status} ${res.statusText}`;
}

export async function getCandidates(): Promise<Candidate[]> {
  const res = await fetch(`${API_BASE}/records`);
  if (!res.ok) {
    throw new Error(`Failed to fetch candidates: ${res.status}`);
  }

  const data = await res.json();
  console.log("GET /records response:", data);

  const items = Array.isArray(data?.data) ? (data.data as Candidate[]) : [];

  if (items.length > 0) {
    console.log("GET /records first item:", items[0]);
  }

  if (items.length === 0) {
    console.warn("Unexpected API response shape:", data);
    return [];
  }

  return items;
}

export async function getCandidateById(id: string): Promise<Candidate> {
  const res = await fetch(buildUrl(`/records/${id}`));

  if (!res.ok) {
    throw new Error(getErrorMessage(`Failed to fetch candidate ${id}`, res));
  }

  return (await res.json()) as Candidate;
}

export async function createCandidate(data: CandidateFormData): Promise<Candidate> {
  const res = await fetch(buildUrl("/records"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(getErrorMessage("Failed to create candidate", res));
  }

  return (await res.json()) as Candidate;
}

export async function updateCandidate(
  id: string,
  data: Partial<CandidateFormData>,
): Promise<Candidate> {
  const res = await fetch(buildUrl(`/records/${id}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(getErrorMessage(`Failed to update candidate ${id}`, res));
  }

  return (await res.json()) as Candidate;
}

export async function patchCandidate(
  id: string,
  data: Partial<Pick<Candidate, "status" | "stage">>,
): Promise<Candidate> {
  const res = await fetch(buildUrl(`/records/${id}`), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error(getErrorMessage(`Failed to patch candidate ${id}`, res));
  }

  return (await res.json()) as Candidate;
}

export async function getNotes(candidateId: string): Promise<Note[]> {
  const res = await fetch(buildUrl(`/records/${candidateId}/notes`));

  if (!res.ok) {
    throw new Error(getErrorMessage(`Failed to fetch notes for candidate ${candidateId}`, res));
  }

  return (await res.json()) as Note[];
}

export async function createNote(candidateId: string, content: string): Promise<Note> {
  const res = await fetch(buildUrl(`/records/${candidateId}/notes`), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });

  if (!res.ok) {
    throw new Error(getErrorMessage(`Failed to create note for candidate ${candidateId}`, res));
  }

  return (await res.json()) as Note;
}

export async function deleteNote(candidateId: string, noteId: string): Promise<void> {
  const res = await fetch(buildUrl(`/records/${candidateId}/notes/${noteId}`), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(
      getErrorMessage(`Failed to delete note ${noteId} for candidate ${candidateId}`, res),
    );
  }
}
