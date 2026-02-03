export const isFieldFilled = (val: unknown): boolean => {
  if (val === undefined || val === null) return false;

  if (typeof val === "string") {
    return val.trim() !== "";
  }

  return true;
};
