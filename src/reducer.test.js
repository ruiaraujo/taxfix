import React from 'react';
import ReactDOM from 'react-dom';
import { convertedAmountSelector } from './reducer';

describe('state logic', () => {
  it('converts from EUR to USD', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'EUR',
        currencyB: 'USD',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        amount: '1',
        loaded: true
      })
    ).toBeCloseTo(1.1167);
  });
  it('converts from USD to EUR', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'USD',
        currencyB: 'EUR',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        amount: '1',
        loaded: true
      })
    ).toBeCloseTo(0.9);
  });
  it('converts from USD to USD', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'USD',
        currencyB: 'USD',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        amount: '1',
        loaded: true
      })
    ).toBeCloseTo(1);
  });
  it('converts from USD to USD', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'USD',
        currencyB: 'GBP',
        rates: { USD: 1.1167, EUR: 1, GBP: 0.87453 },
        base: 'EUR',
        amount: '1',
        loaded: true
      })
    ).toBeCloseTo(0.78);
  });

  it('return null if there is no  valid currency', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'EUR',
        currencyB: 'LOL',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        loaded: true
      })
    ).toBe(null);
  });
  it('return null if there is no amount', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'EUR',
        currencyB: 'USD',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        loaded: true
      })
    ).toBe(null);
  });

  it('return null if it is not loaded', () => {
    expect(
      convertedAmountSelector({
        currencyA: 'EUR',
        currencyB: 'USD',
        rates: { USD: 1.1167, EUR: 1 },
        base: 'EUR',
        loaded: true
      })
    ).toBe(null);
  });
});
