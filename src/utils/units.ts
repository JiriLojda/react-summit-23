const unit = 4;

export const units = {
  S: unit,
  M: unit * 2,
  L: unit * 3,
  XL: unit * 4,
} as const;

export type Unit = 4 | 8 | 12 | 16;
