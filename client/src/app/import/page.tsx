"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import { Check, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    setId?: number;
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
          setId: data.setId,
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
                  disabled={isImporting}
                  required
                  autoFocus
                  className="h-12 w-full rounded-md border border-input bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-ring disabled:opacity-50"
                />
                <p className="mt-2 text-xs text-muted-foreground">
                  The article must include a downloadable checklist.
                </p>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isImporting || !url.trim()}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors",
                    "hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  )}
                >
                  {isImporting ? (
                    <>
                      <span className="h-2 w-2 animate-pulse rounded-full bg-current" />
                      Importing…
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Import set
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>

          {importResult && (
            <section className="pt-6">
              <div
                className={cn(
                  "rounded-lg border p-4",
                  importResult.success
                    ? "border-border bg-card"
                    : "border-destructive/50"
                )}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={cn(
                      "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md border",
                      importResult.success
                        ? "border-border text-foreground"
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
                    <p className="text-sm font-medium">
                      {importResult.success ? "Imported" : "Failed"}
                    </p>
                    <p className="mt-1 text-sm leading-6 text-muted-foreground">
                      {importResult.message}
                    </p>

                    {importResult.success && importResult.setId != null && (
                      <button
                        type="button"
                        onClick={() =>
                          router.push(`/set/${importResult.setId}`)
                        }
                        className="mt-3 text-sm font-medium text-primary hover:underline"
                      >
                        View set
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
