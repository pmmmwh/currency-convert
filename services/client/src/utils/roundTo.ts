function roundTo(float: number, decimalPlaces: number): number {
  const decimalOffset = Math.pow(10, decimalPlaces);

  // Handle floating point precision issues during rounding for decimals:
  // `Number.EPSILON` is the smallest floating point number larger than 1.
  return Math.round(float * decimalOffset + Number.EPSILON) / decimalOffset;
}

export default roundTo;
