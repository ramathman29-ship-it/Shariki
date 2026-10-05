// Western digits in both languages (common on Syrian sites and in our data).
const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
const num = new Intl.NumberFormat("en-US");

export const formatMoney = (value) => usd.format(Math.round(Number(value) || 0));
export const formatNumber = (value) => num.format(Number(value) || 0);
