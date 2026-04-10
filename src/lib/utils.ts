import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type Currency = 'MAD' | 'USD' | 'EUR';

export interface ExchangeRates {
  EUR: number;
  USD: number;
}

export const DEFAULT_EXCHANGE_RATES: ExchangeRates = {
  EUR: 0.10,
  USD: 0.11,
};

export function formatMoney(amountMad: number, currency: Currency, rates: ExchangeRates): string {
  const normalizedAmount = Math.max(0, amountMad);

  if (currency === 'MAD') {
    return `${normalizedAmount.toLocaleString('fr-FR')} MAD`;
  }

  const converted = currency === 'EUR'
    ? normalizedAmount * rates.EUR
    : normalizedAmount * rates.USD;

  const options = {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  } as const;

  if (currency === 'EUR') {
    return `${converted.toLocaleString('fr-FR', options)} €`;
  }

  return `$${converted.toLocaleString('en-US', options)}`;
}

export async function fetchExchangeRates(base: string = 'MAD'): Promise<ExchangeRates> {
  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${encodeURIComponent(base)}&symbols=EUR,USD`);
    if (!response.ok) throw new Error(`Exchange rates fetch failed: ${response.status}`);
    const data = await response.json();
    return {
      EUR: Number(data?.rates?.EUR ?? DEFAULT_EXCHANGE_RATES.EUR),
      USD: Number(data?.rates?.USD ?? DEFAULT_EXCHANGE_RATES.USD),
    };
  } catch (error) {
    console.warn('[ExchangeRates] fetch failed, using default rates', error);
    return DEFAULT_EXCHANGE_RATES;
  }
}
