import Money from 'bigint-money';

export const ZeroDecimalCurrencies = Object.freeze(
  new Set([
    'BIF',
    'CLP',
    'DJF',
    'GNF',
    'JPY',
    'KMF',
    'KRW',
    'MGA',
    'PYG',
    'RWF',
    'UGX',
    'VND',
    'VUV',
    'XAF',
    'XOF',
    'XPF',
  ]),
);

export function formatStripeCurrency(amount: Money): number {
  if (ZeroDecimalCurrencies.has(amount.currency)) return +amount.toFixed(0);
  return +amount.multiply('100').toFixed(0);
}

export function parseStripeCurrency(amount: number, currency: string): Money {
  const result = new Money(amount, currency);
  if (!ZeroDecimalCurrencies.has(currency)) {
    result.divide('100');
  }
  return result;
}
