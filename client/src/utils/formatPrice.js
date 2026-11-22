export const formatPrice = (amount) => {
    const value = Number(amount);
    if (!Number.isFinite(value)) return String(amount ?? "");
    return value.toLocaleString("en-IN", { maximumFractionDigits: 2 });
};
