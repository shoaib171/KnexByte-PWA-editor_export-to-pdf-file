export interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
}

export type SaveStatus = "saved" | "unsaved";

export interface FontOption {
  label: string;
  value: string;
}
