"use client";

import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { ImportQueueList } from "@/features/import/ImportQueueList";
import { useImportQueue } from "@/features/import/useImportQueue";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const { jobs, enqueue, removeJob, clearFinished, isWorking, hasFinished } =
    useImportQueue();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    const added = enqueue(url);
    if (added) {
      setUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-6xl px-6 md:px-8">
        <main className="max-w-2xl py-4 pb-16">
          <section>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="url"
                  className="mb-2 block text-sm font-medium"
                >
                  Beckett URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://www.beckett.com/news/..."
                  required
                  autoFocus
                  className="h-12 w-full rounded-md border border-input bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  The article must include a downloadable checklist.
                  {isWorking
                    ? " Imports run one at a time — keep adding URLs to the queue."
                    : null}
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!url.trim()}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors",
                    "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  <Upload className="h-4 w-4" />
                  {isWorking ? "Add to queue" : "Import set"}
                </button>
              </div>
            </form>
          </section>

          <ImportQueueList
            jobs={jobs}
            onRemove={removeJob}
            onClearFinished={clearFinished}
            hasFinished={hasFinished}
          />
        </main>
      </div>
    </div>
  );
}
