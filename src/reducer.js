import { createStore as _createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { call, put, takeLatest } from 'redux-saga/effects';
import { createSelector } from 'reselect';

const CHOOSE_CURRENCY_A = 'taxfix/CHOOSE_CURRENCY_A';
const CHOOSE_CURRENCY_B = 'taxfix/CHOOSE_CURRENCY_B';
const SET_AMOUNT = 'taxfix/SET_AMOUNT';
const LOAD_RATES = 'taxfix/LOAD_RATES';
const LOADED_RATES = 'taxfix/LOADED_RATES';
const LOAD_RATES_FAILED = 'taxfix/LOAD_RATES_FAILED';

const initialState = {
  amount: '0',
  loading: false,
  loaded: false,
  rates: []
};

function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case CHOOSE_CURRENCY_B:
      return {
        ...state,
        currencyB: action.payload
      };
    case CHOOSE_CURRENCY_A:
      return {
        ...state,
        currencyA: action.payload
      };
    case SET_AMOUNT:
      return {
        ...state,
        amount: action.payload
      };
    case LOAD_RATES:
      return {
        ...state,
        loading: true
      };
    case LOADED_RATES:
      return {
        ...state,
        loading: false,
        loaded: true,
        errorLoading: false,
        rates: action.payload.rates
          .map(rate => ({ ...rate, rate: parseFloat(rate.rate) }))
          .reduce((map, { currency, rate }) => ({ ...map, [currency]: rate }), { [action.payload.base]: 1 }),
        base: action.payload.base,
        currencyA: action.payload.base,
        currencyB: action.payload.rates[0].currency
      };
    case LOAD_RATES_FAILED:
      return {
        ...state,
        loading: false,
        errorLoading: true
      };
    default:
      return state;
  }
}

export function* rootSaga() {
  yield takeLatest(LOAD_RATES, function*() {
    try {
      const resp = yield call(window.fetch, 'https://txf-ecb.glitch.me/rates');
      const payload = yield call([resp, resp.json]);
      yield put({
        type: LOADED_RATES,
        payload
      });
    } catch (e) {
      yield put({
        type: LOAD_RATES_FAILED,
        error: true,
        payload: e
      });
    }
  });
}

export const loadRates = () => ({ type: LOAD_RATES });
export const setCurrencyA = currency => ({ type: CHOOSE_CURRENCY_A, payload: currency });
export const setCurrencyB = currency => ({ type: CHOOSE_CURRENCY_B, payload: currency });
export const setAmount = amount => ({ type: SET_AMOUNT, payload: amount });

export const amountSelector = state => state.amount;
export const loadingRatesSelector = state => state.loading;
export const loadedRatesSelector = state => state.loaded;
export const errorLoadingSelector = state => !!state.errorLoading;
export const currencyASelector = state => state.currencyA;
export const currencyBSelector = state => state.currencyB;
export const currenciesSelector = createSelector(
  state => state.rates,
  state => state.base,
  loadedRatesSelector,
  (rates, loaded) => (loaded ? Object.keys(rates) : [])
);
export const convertedAmountSelector = createSelector(
  amountSelector,
  currencyASelector,
  currencyBSelector,
  loadedRatesSelector,
  state => state.rates,
  state => state.base,
  (amount, currencyA, currencyB, loaded, rates, base) => {
    if (!loaded || !amount) {
      return null;
    }
    let numericAmount = parseFloat(amount);
    if (isNaN(numericAmount) || !rates[currencyA] || !rates[currencyB]) {
      return null;
    }
    numericAmount = convert(numericAmount, currencyA === base ? rates[currencyA] : 1 / rates[currencyA]);
    numericAmount = convert(numericAmount, currencyB === base ? 1 / rates[currencyB] : rates[currencyB]);
    return numericAmount;
  }
);

function convert(amount, rate) {
  return amount * rate;
}

export default function createStore() {
  const sagaMiddleware = createSagaMiddleware();
  const middleware = [sagaMiddleware];

  let finalCreateStore;
  if (window.devToolsExtension) {
    finalCreateStore = compose(applyMiddleware(...middleware), window.devToolsExtension())(_createStore);
  } else {
    finalCreateStore = applyMiddleware(...middleware)(_createStore);
  }

  const store = finalCreateStore(reducer);
  sagaMiddleware.run(rootSaga);
  return store;
}
