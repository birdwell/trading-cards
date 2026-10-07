"use client";

import { useCallback, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC, useTRPCClient } from "@/utils/trpc";
import type { ImportJob } from "./types";

function createJob(url: string): ImportJob {
  return {
    id: crypto.randomUUID(),
    url,
    status: "queued",
  };
}

export function useImportQueue() {
  const trpc = useTRPC();
  const trpcClient = useTRPCClient();
  const queryClient = useQueryClient();

  const [jobs, setJobs] = useState<ImportJob[]>([]);
  const jobsRef = useRef<ImportJob[]>([]);
  const workerRunningRef = useRef(false);

  const syncJobs = useCallback((updater: (prev: ImportJob[]) => ImportJob[]) => {
    jobsRef.current = updater(jobsRef.current);
    setJobs(jobsRef.current);
  }, []);

  const runWorker = useCallback(async () => {
    if (workerRunningRef.current) return;
    workerRunningRef.current = true;

    try {
      while (true) {
        const next = jobsRef.current.find((job) => job.status === "queued");
        if (!next) break;

        syncJobs((prev) =>
          prev.map((job) =>
            job.id === next.id
              ? { ...job, status: "importing", stage: undefined, message: undefined }
              : job
          )
        );

        try {
          const stream = await trpcClient.import.mutate({ url: next.url });
          let completed = false;

          for await (const event of stream) {
            switch (event.type) {
              case "progress":
                syncJobs((prev) =>
                  prev.map((job) =>
                    job.id === next.id
                      ? { ...job, stage: event.stage }
                      : job
                  )
                );
                break;
              case "complete":
                completed = true;
                syncJobs((prev) =>
                  prev.map((job) =>
                    job.id === next.id
                      ? {
                          ...job,
                          status: "done",
                          stage: undefined,
                          message: event.message,
                          setId: event.setId,
                        }
                      : job
                  )
                );
                await Promise.all([
                  queryClient.invalidateQueries(trpc.getSets.queryOptions()),
                  queryClient.invalidateQueries(
                    trpc.getSetsWithStats.queryOptions()
                  ),
                ]);
                break;
              default: {
                const _exhaustive: never = event;
                void _exhaustive;
                break;
              }
            }
          }

          if (!completed) {
            syncJobs((prev) =>
              prev.map((job) =>
                job.id === next.id
                  ? {
                      ...job,
                      status: "failed",
                      stage: undefined,
                      message: "Import ended without a result",
                    }
                  : job
              )
            );
          }
        } catch (error) {
          syncJobs((prev) =>
            prev.map((job) =>
              job.id === next.id
                ? {
                    ...job,
                    status: "failed",
                    stage: undefined,
                    message:
                      error instanceof Error
                        ? error.message
                        : "Failed to import cards",
                  }
                : job
            )
          );
        }
      }
    } finally {
      workerRunningRef.current = false;
    }
  }, [queryClient, syncJobs, trpc, trpcClient]);

  const enqueue = useCallback(
    (url: string) => {
      const trimmed = url.trim();
      if (!trimmed) return false;

      const alreadyQueued = jobsRef.current.some(
        (job) =>
          job.url === trimmed &&
          (job.status === "queued" || job.status === "importing")
      );
      if (alreadyQueued) return false;

      syncJobs((prev) => [...prev, createJob(trimmed)]);
      void runWorker();
      return true;
    },
    [runWorker, syncJobs]
  );

  const removeJob = useCallback(
    (id: string) => {
      syncJobs((prev) =>
        prev.filter((job) => !(job.id === id && job.status === "queued"))
      );
    },
    [syncJobs]
  );

  const clearFinished = useCallback(() => {
    syncJobs((prev) =>
      prev.filter((job) => job.status === "queued" || job.status === "importing")
    );
  }, [syncJobs]);

  const isWorking = jobs.some(
    (job) => job.status === "queued" || job.status === "importing"
  );
  const hasFinished = jobs.some(
    (job) => job.status === "done" || job.status === "failed"
  );

  return {
    jobs,
    enqueue,
    removeJob,
    clearFinished,
    isWorking,
    hasFinished,
  };
}
