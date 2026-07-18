export const IMPORT_STAGES = [
  "finding_checklist",
  "downloading",
  "checking_existing",
  "parsing",
  "extracting",
  "saving",
] as const;

export type ImportStage = (typeof IMPORT_STAGES)[number];

export const IMPORT_STAGE_LABELS: Record<ImportStage, string> = {
  finding_checklist: "Finding checklist…",
  downloading: "Downloading spreadsheet…",
  checking_existing: "Checking for existing set…",
  parsing: "Reading spreadsheet…",
  extracting: "Extracting cards…",
  saving: "Saving cards…",
};

export type ImportProgressEvent = {
  type: "progress";
  stage: ImportStage;
};

export type ImportCompleteEvent = {
  type: "complete";
  success: true;
  setId: number;
  setName: string;
  count: number;
  alreadyExisted: boolean;
  message: string;
};

export type ImportEvent = ImportProgressEvent | ImportCompleteEvent;

export function toImportCompleteEvent(result: {
  setId: number;
  setName: string;
  cards: { length: number };
  alreadyExisted: boolean;
}): ImportCompleteEvent {
  return {
    type: "complete",
    success: true,
    setId: result.setId,
    setName: result.setName,
    count: result.cards.length,
    alreadyExisted: result.alreadyExisted,
    message: result.alreadyExisted
      ? `${result.setName} was already imported (${result.cards.length} cards).`
      : `Imported ${result.cards.length} cards into ${result.setName}.`,
  };
}
