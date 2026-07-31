const SCALE = 4;
const FACTOR = 10_000n;

export type DecimalInput = string | number | bigint;

export function toUnits(input: DecimalInput): bigint {
  if (typeof input === "bigint") return input;
  const raw = String(input).trim();
  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    throw new Error(`Invalid decimal value: ${raw}`);
  }

  const sign = raw.startsWith("-") ? -1n : 1n;
  const unsigned = raw.replace("-", "");
  const [wholePart, fractionalPart = ""] = unsigned.split(".");
  const whole = BigInt(wholePart || "0") * FACTOR;
  const paddedFraction = (fractionalPart + "0".repeat(SCALE)).slice(0, SCALE);
  const fraction = BigInt(paddedFraction);

  return sign * (whole + fraction);
}

export function fromUnits(units: bigint, decimals = 2): string {
  const sign = units < 0n ? "-" : "";
  const absolute = units < 0n ? -units : units;
  const whole = absolute / FACTOR;
  const fraction = (absolute % FACTOR).toString().padStart(SCALE, "0").slice(0, decimals);
  return `${sign}${whole.toString()}.${fraction.padEnd(decimals, "0")}`;
}

export function addMoney(values: DecimalInput[]) {
  return fromUnits(values.reduce<bigint>((sum, value) => sum + toUnits(value), 0n));
}

export function subtractMoney(left: DecimalInput, right: DecimalInput) {
  return fromUnits(toUnits(left) - toUnits(right));
}

export function multiplyMoney(value: DecimalInput, multiplier: DecimalInput) {
  return fromUnits((toUnits(value) * toUnits(multiplier)) / FACTOR);
}

export function divideToPercent(numerator: DecimalInput, denominator: DecimalInput) {
  const denominatorUnits = toUnits(denominator);
  if (denominatorUnits === 0n) return null;
  const basisPoints = (toUnits(numerator) * 10_000n) / denominatorUnits;
  return Number(basisPoints) / 100;
}

export function compareMoney(left: DecimalInput, right: DecimalInput) {
  const leftUnits = toUnits(left);
  const rightUnits = toUnits(right);
  if (leftUnits === rightUnits) return 0;
  return leftUnits > rightUnits ? 1 : -1;
}

export function maxMoney(values: DecimalInput[]) {
  return fromUnits(values.reduce<bigint>((max, value) => (toUnits(value) > max ? toUnits(value) : max), toUnits(values[0] ?? "0")));
}

export function moneyToNumber(value: DecimalInput) {
  return Number(fromUnits(toUnits(value), 2));
}
