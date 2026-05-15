export const between = (val: number, a: number, b: number) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return val > min && val < max;
};
