"use client";

import { useRouter } from "next/navigation";
import { Check, LoaderCircle, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { IMPORT_STAGE_LABELS } from "../../../../server/core/import-events";
import type { ImportJob } from "./types";

function shortenUrl(url: string): string {
  try {
    const parsed = new URL(url);
    const path = parsed.pathname.replace(/\/$/, "");
    const slug = path.split("/").filter(Boolean).pop();
    return slug ? decodeURIComponent(slug) : parsed.hostname;
  } catch {
    return url;
  }
}

function statusLabel(job: ImportJob): string {
  switch (job.status) {
    case "queued":
      return "Queued";
    case "importing":
      return job.stage ? IMPORT_STAGE_LABELS[job.stage] : "Importing…";
    case "done":
      return job.message ?? "Imported";
    case "failed":
      return job.message ?? "Failed";
    default: {
      const _exhaustive: never = job.status;
      return _exhaustive;
    }
  }
}

type ImportQueueListProps = {
  jobs: ImportJob[];
  onRemove: (id: string) => void;
  onClearFinished: () => void;
  hasFinished: boolean;
};

export function ImportQueueList({
  jobs,
  onRemove,
  onClearFinished,
  hasFinished,
}: ImportQueueListProps) {
  const router = useRouter();

  if (jobs.length === 0) return null;

  return (
    <section className="pt-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-sm font-medium">Import queue</h2>
        {hasFinished && (
          <button
            type="button"
            onClick={onClearFinished}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Clear finished
          </button>
        )}
      </div>

      <ul className="space-y-2">
        {jobs.map((job) => (
          <li
            key={job.id}
            className={cn(
              "rounded-md border px-3 py-3",
              job.status === "failed"
                ? "border-destructive/50"
                : "border-border"
            )}
          >
            <div className="flex items-start gap-3">
              <span
                className={cn(
                  "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                  job.status === "failed"
                    ? "border-destructive bg-destructive text-destructive-foreground"
                    : "border-border text-foreground"
                )}
              >
                {job.status === "done" ? (
                  <Check className="h-3.5 w-3.5" />
                ) : job.status === "failed" ? (
                  <X className="h-3.5 w-3.5" />
                ) : job.status === "importing" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground" />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium" title={job.url}>
                  {shortenUrl(job.url)}
                </p>
                <p
                  className={cn(
                    "mt-1 text-sm leading-6",
                    job.status === "failed"
                      ? "text-destructive"
                      : "text-muted-foreground"
                  )}
                >
                  {statusLabel(job)}
                </p>

                {job.status === "done" && job.setId != null && (
                  <button
                    type="button"
                    onClick={() => router.push(`/set/${job.setId}`)}
                    className="mt-2 text-sm font-medium text-primary hover:underline"
                  >
                    View set
                  </button>
                )}
              </div>

              {job.status === "queued" && (
                <button
                  type="button"
                  onClick={() => onRemove(job.id)}
                  aria-label="Remove from queue"
                  className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
