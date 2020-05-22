import React, { Component } from 'react';
import { Router } from 'react-router-dom';
import { Chart } from 'react-chartjs-2';
import { ThemeProvider } from '@material-ui/styles';
import validate from 'validate.js';

import { chartjs } from './helpers';
import theme from './theme';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './assets/scss/index.scss';
import validators from './common/validators';
import Routes from './Routes';
import history from './services/history';
import GlobalContextProvider from './contexts/GlobalContext';
import ErrorContextProvider from './contexts/ErrorContext';

Chart.helpers.extend(Chart.elements.Rectangle.prototype, {
  draw: chartjs.draw
});

validate.validators = {
  ...validate.validators,
  ...validators
};

export default class App extends Component {
  render() {
    return (
      <ThemeProvider theme={theme}>
        <GlobalContextProvider>
          <ErrorContextProvider>
            <Router history={history}>
              <Routes />
            </Router>
          </ErrorContextProvider>
        </GlobalContextProvider>
      </ThemeProvider>
    );
  }
}