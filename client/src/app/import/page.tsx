"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import { ArrowUpRight, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const importMutation = useMutation(
    trpc.import.mutationOptions({
      onMutate: () => {
        setIsImporting(true);
        setImportResult(null);
      },
      onSuccess: (data) => {
        setIsImporting(false);
        setImportResult({
          success: true,
          message: data.message,
        });
        setUrl("");
        queryClient.invalidateQueries(trpc.getSets.queryOptions());
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error) => {
        setIsImporting(false);
        setImportResult({ success: false, message: error.message });
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;
    importMutation.mutate({ url: url.trim() });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10 md:py-14">
        <main className="mx-auto max-w-3xl">
          {/* Masthead */}
          <section className="rise border-b border-border/60 pb-10">
            <div className="eyebrow mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-foreground/40" />
              <span>New Entry — Volume I</span>
            </div>
            <h1 className="font-display text-5xl md:text-6xl font-light leading-[0.95] tracking-tight">
              Import a{" "}
              <span className="italic text-accent">set</span>.
            </h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground">
              Paste a Beckett URL and we&apos;ll pull the checklist into your
              collection.
            </p>
          </section>

          {/* Form */}
          <section className="py-10 md:py-14">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div>
                <label
                  htmlFor="url"
                  className="eyebrow mb-3 block"
                >
                  Beckett URL
                </label>
                <div className="relative">
                  <input
                    id="url"
                    type="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder="https://www.beckett.com/news/..."
                    disabled={isImporting}
                    required
                    autoFocus
                    className={cn(
                      "w-full border-0 border-b border-border bg-transparent",
                      "py-3 pr-10 text-lg font-display font-light tracking-tight",
                      "placeholder:text-muted-foreground/50 placeholder:font-sans placeholder:text-base",
                      "outline-none transition-colors",
                      "focus:border-foreground",
                      "disabled:opacity-50"
                    )}
                  />
                  <ArrowUpRight className="absolute right-1 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-3 font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
                  Pull checklists from Beckett articles
                </p>
              </div>

              <div className="flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="font-mono-tight text-[10px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  ← Cancel
                </button>

                <button
                  type="submit"
                  disabled={isImporting || !url.trim()}
                  className={cn(
                    "group inline-flex items-center gap-3 border border-foreground bg-foreground px-6 py-3 text-sm text-background transition-all",
                    "hover:bg-transparent hover:text-foreground",
                    "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-foreground disabled:hover:text-background"
                  )}
                >
                  {isImporting ? (
                    <>
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                      <span className="font-medium tracking-tight">Importing…</span>
                    </>
                  ) : (
                    <>
                      <span className="font-medium tracking-tight">Import set</span>
                      <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {/* Result */}
          {importResult && (
            <section className="rise pb-10">
              <div
                className={cn(
                  "border p-6",
                  importResult.success
                    ? "border-accent/40 bg-accent/5"
                    : "border-destructive/40 bg-destructive/5"
                )}
              >
                <div className="flex items-start gap-4">
                  <span
                    className={cn(
                      "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border",
                      importResult.success
                        ? "border-accent bg-accent text-accent-foreground"
                        : "border-destructive bg-destructive text-destructive-foreground"
                    )}
                  >
                    {importResult.success ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <X className="h-3.5 w-3.5" />
                    )}
                  </span>

                  <div className="min-w-0 flex-1">
                    <p
                      className={cn(
                        "font-mono-tight text-[10px] uppercase tracking-[0.22em]",
                        importResult.success ? "text-accent" : "text-destructive"
                      )}
                    >
                      {importResult.success ? "Imported" : "Failed"}
                    </p>
                    <p className="mt-2 font-display text-xl font-light leading-snug">
                      {importResult.message}
                    </p>

                    {importResult.success && (
                      <button
                        onClick={() => router.push("/")}
                        className="group mt-5 inline-flex items-center gap-2 text-sm text-foreground"
                      >
                        <span className="font-medium tracking-tight">
                          View collection
                        </span>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
