import type { ImportStage } from "../../../../server/core/import-events";

export type ImportJobStatus = "queued" | "importing" | "done" | "failed";

export type ImportJob = {
  id: string;
  url: string;
  status: ImportJobStatus;
  stage?: ImportStage;
  message?: string;
  setId?: number;
};
