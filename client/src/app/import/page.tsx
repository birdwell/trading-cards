"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import Navigation from "@/components/Navigation";
import { Upload, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ImportPage() {
  const [url, setUrl] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<{
    success: boolean;
    message: string;
    count?: number;
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
          count: data.count,
        });
        setUrl("");
        // Invalidate sets query to refresh the main page using proper tRPC query options
        queryClient.invalidateQueries(trpc.getSets.queryOptions());
        queryClient.invalidateQueries(trpc.getSetsWithStats.queryOptions());
      },
      onError: (error: any) => {
        setIsImporting(false);
        setImportResult({
          success: false,
          message: error.message,
        });
      },
    })
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    importMutation.mutate({ url: url.trim() });
  };

  const handleBackToSets = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <main>
          <div className="max-w-2xl mx-auto">
            <Card className="p-8">
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                  Import New Set
                </h1>
                <p className="text-muted-foreground">
                  Enter a Beckett URL to import a new trading card set
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="url">
                    Beckett URL
                  </Label>
                  <div className="relative">
                    <Input
                      type="url"
                      id="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.beckett.com/news/..."
                      disabled={isImporting}
                      required
                      className="pr-10"
                    />
                    <ExternalLink className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Import trading card checklists from Beckett articles
                  </p>
                </div>

                <Button
                  type="submit"
                  disabled={isImporting || !url.trim()}
                  className="w-full gap-2"
                >
                  {isImporting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div>
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      Import Set
                    </>
                  )}
                </Button>
              </form>

              {importResult && (
                <div
                  className={`mt-6 p-4 rounded-lg ${
                    importResult.success
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  }`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      {importResult.success ? (
                        <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-green-600 dark:text-green-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-6 h-6 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-red-600 dark:text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      )}
                    </div>
                    <div className="ml-3">
                      <h3
                        className={`text-sm font-medium ${
                          importResult.success
                            ? "text-green-800 dark:text-green-200"
                            : "text-red-800 dark:text-red-200"
                        }`}
                      >
                        {importResult.success
                          ? "Import Successful!"
                          : "Import Failed"}
                      </h3>
                      <p
                        className={`mt-1 text-sm ${
                          importResult.success
                            ? "text-green-700 dark:text-green-300"
                            : "text-red-700 dark:text-red-300"
                        }`}
                      >
                        {importResult.message}
                        {importResult.success && importResult.count && (
                          <span className="block mt-1 font-medium">
                            {importResult.count} cards imported successfully
                          </span>
                        )}
                      </p>
                      {importResult.success && (
                        <button
                          onClick={handleBackToSets}
                          className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-300 font-medium"
                        >
                          View your sets →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
