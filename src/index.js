import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import localeData from 'react-intl/locale-data/de';
import { addLocaleData, IntlProvider } from 'react-intl';

import createStore from './reducer';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

addLocaleData(localeData);
const store = createStore();

ReactDOM.render(
  <Provider store={store}><IntlProvider locale="de" messages={getMessages()}><App /></IntlProvider></Provider>,
  document.getElementById('root')
);
registerServiceWorker();

// All string would be here
function getMessages() {
  return {
    result: '{amount} are {result}'
  };
}
