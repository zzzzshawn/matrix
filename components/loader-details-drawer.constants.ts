import { HIDE_CODE_SCROLLBARS } from "@/lib/hide-code-scrollbar-class";

export const CLI_MANUAL_DOT_ROW_H = 6;
export const CLI_MANUAL_DOT_GAP_PX = 9;

/** Shiki / install command blocks: scrollbar hiding + min height; collapse / expand and max heights are handled in the install toolbar code shell. */
export const DIALOG_CODE_SCROLL_CLASS = ["min-h-0", HIDE_CODE_SCROLLBARS].join(" ");

/** Flat index (row-major 5x5): chase order along main diag then anti-diag (center once). */
export const CLOSE_CROSS_CHASE_ORDER: Record<number, number> = {
  0: 0,
  6: 1,
  12: 2,
  18: 3,
  24: 4,
  16: 5,
  20: 6,
  8: 7,
  4: 8
};
