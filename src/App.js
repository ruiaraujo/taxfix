import React, { Component } from 'react';
import { string, func, bool, arrayOf, number } from 'prop-types';
import { connect } from 'react-redux';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import {
  amountSelector,
  setAmount,
  loadRates,
  loadedRatesSelector,
  loadingRatesSelector,
  errorLoadingSelector,
  currenciesSelector,
  setCurrencyA,
  setCurrencyB,
  currencyASelector,
  currencyBSelector,
  convertedAmountSelector
} from './reducer';
import './App.css';

class App extends Component {
  componentWillMount() {
    this.props.loadRates();
  }

  handleSelectChange = handler => ev => handler(ev.target.value);
  handleChange = ev => this.props.setAmount(ev.target.value);

  renderBody() {
    if (this.props.loadingRates) {
      return <p>Loading currency rates</p>;
    }

    if (this.props.errorLoading) {
      return (
        <div>
          <p>Error loading the rates.</p>
          <button onClick={this.props.loadRates}>
            Click to retry loading
          </button>
        </div>
      );
    }

    if (!this.props.loadedRates) {
      console.error('FIXME: Inconsistent state!');
      return <p>This should not happen!!</p>;
    }
    return (
      <div className="input">
        <input name="amount" type="number" onChange={this.handleChange} value={this.props.amount} />
        <select onChange={this.handleSelectChange(this.props.setCurrencyA)} value={this.props.currencyA}>
          {this.props.currencies.map(currency => <option value={currency} key={currency}>{currency}</option>)}
        </select>
        <select onChange={this.handleSelectChange(this.props.setCurrencyB)} value={this.props.currencyB}>
          {this.props.currencies.map(currency => <option value={currency} key={currency}>{currency}</option>)}
        </select>
        <p className="result">
          {this.props.amount !== null &&
            this.props.convertedAmount !== null &&
            <FormattedMessage
              id="result"
              values={{
                amount: <FormattedNumber value={this.props.amount} style="currency" currency={this.props.currencyA} />,
                result: (
                  <FormattedNumber
                    value={this.props.convertedAmount}
                    style="currency"
                    currency={this.props.currencyB}
                  />
                )
              }}
            />}
        </p>
      </div>
    );
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>Currency converter</h2>
        </div>
        {this.renderBody()}
      </div>
    );
  }
}

App.propTypes = {
  amount: string.isRequired,
  loadedRates: bool.isRequired,
  loadingRates: bool.isRequired,
  errorLoading: bool.isRequired,
  setAmount: func.isRequired,
  loadRates: func.isRequired,
  currencies: arrayOf(string).isRequired,
  setCurrencyA: func.isRequired,
  setCurrencyB: func.isRequired,
  currencyA: string,
  currencyB: string,
  convertedAmount: number
};

const mapState = state => ({
  amount: amountSelector(state),
  loadedRates: loadedRatesSelector(state),
  loadingRates: loadingRatesSelector(state),
  errorLoading: errorLoadingSelector(state),
  currencies: currenciesSelector(state),
  currencyA: currencyASelector(state),
  currencyB: currencyBSelector(state),
  convertedAmount: convertedAmountSelector(state)
});

const mapActions = {
  setAmount,
  loadRates,
  setCurrencyA,
  setCurrencyB
};

export default connect(mapState, mapActions)(App);
