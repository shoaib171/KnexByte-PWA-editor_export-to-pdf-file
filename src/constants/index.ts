import { FontOption } from '../types';
export const THEMES = {
  dark: {
    bg: "#0d1117",
    sidebar: "#010409",
    text: "#e6edf3",
    muted: "#8b949e",
    border: "#21262d",
    itemHover: "#161b22",
    kbBlue: "#1a9fd4",
  },
  light: {
    bg: "#ffffff",
    sidebar: "#f6f8fa",
    text: "#24292f",
    muted: "#57606a",
    border: "#d0d7de",
    itemHover: "#f3f4f6",
    kbBlue: "#0969da",
  }
};
export const KB_BLUE = "#1a9fd4";
export const KB_DARK = "#0d1117";
export const DEFAULT_FONT = "Calibri, Candara, sans-serif";


export const FONT_OPTIONS: FontOption[] = [
  { label: "Calibri", value: "Calibri, Candara, Segoe, 'Segoe UI', Optima, Arial, sans-serif" },
  { label: "Arial", value: "Arial, Helvetica, sans-serif" },
  { label: "Arial Black", value: "'Arial Black', Gadget, sans-serif" },
  { label: "Bahnschrift", value: "Bahnschrift, 'Segoe UI', sans-serif" },
  { label: "Book Antiqua", value: "'Book Antiqua', Palatino, serif" },
  { label: "Bookman", value: "Bookman, serif" },
  { label: "Cambria", value: "Cambria, Georgia, serif" },
  { label: "Candara", value: "Candara, Calibri, Segoe, sans-serif" },
  { label: "Century Gothic", value: "'Century Gothic', Futura, sans-serif" },
  { label: "Comic Sans MS", value: "'Comic Sans MS', cursive, sans-serif" },
  { label: "Consolas", value: "Consolas, 'Lucida Console', monospace" },
  { label: "Courier New", value: "'Courier New', Courier, monospace" },
  { label: "Franklin Gothic", value: "'Franklin Gothic Medium', Arial, sans-serif" },
  { label: "Garamond", value: "Garamond, serif" },
  { label: "Georgia", value: "Georgia, serif" },
  { label: "Gill Sans", value: "'Gill Sans', 'Gill Sans MT', Calibri, sans-serif" },
  { label: "Impact", value: "Impact, Charcoal, sans-serif" },
  { label: "Lucida Console", value: "'Lucida Console', Monaco, monospace" },
  { label: "Lucida Sans Unicode", value: "'Lucida Sans Unicode', 'Lucida Grande', sans-serif" },
  { label: "MS Sans Serif", value: "'MS Sans Serif', Geneva, sans-serif" },
  { label: "MS Serif", value: "'MS Serif', New York, serif" },
  { label: "Palatino Linotype", value: "'Palatino Linotype', 'Book Antiqua', Palatino, serif" },
  { label: "Segoe UI", value: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" },
  { label: "Tahoma", value: "Tahoma, Geneva, sans-serif" },
  { label: "Times New Roman", value: "'Times New Roman', Times, serif" },
  { label: "Trebuchet MS", value: "'Trebuchet MS', Helvetica, sans-serif" },
  { label: "Verdana", value: "Verdana, Geneva, sans-serif" },
  { label: "Webdings", value: "Webdings" },
  { label: "Wingdings", value: "Wingdings, 'Zapf Dingbats'" },
];


export const FONT_SIZES = [
  8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30,
  32, 34, 36, 40, 44, 48, 54, 60, 66, 72, 80, 88, 96
];


export const LANGUAGES = [
  "javascript", "python", "typescript", "html", "css", "java", "cpp", "c",
  "rust", "go", "php", "sql", "bash", "json", "xml", "yaml", "plaintext"
];
