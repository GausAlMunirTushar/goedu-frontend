const BDT_REGEX = /\B(?=(\d{2})+(?!\d))/g;

export default function bdtCurrency(value: number | string, showSymbol = true): string {
    const num = +value;
    if (isNaN(num)) return String(value);

    const isNegative = num < 0;
    const [integer, decimal] = Math.abs(num).toFixed(2).split(".");

    const last3 = integer.slice(-3);
    const rest = integer.slice(0, -3);
    const formatted = rest ? `${rest.replace(BDT_REGEX, ",")},${last3}` : last3;

    const sign = isNegative ? "-" : "";
    const amount = `${sign}${formatted}.${decimal}`;

    return showSymbol ? `৳ ${amount}` : amount;
}
