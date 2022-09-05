// scroll bar
import 'simplebar/src/simplebar.css';
// highlight
import './utils/highlight';
// lazy image
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-lazy-load-image-component/src/effects/opacity.css';
import 'react-lazy-load-image-component/src/effects/black-and-white.css';

import ReactDOM from 'react-dom';
import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
// contexts
import { SettingsProvider } from './contexts/SettingsContext';
import { CollapseDrawerProvider } from './contexts/CollapseDrawerContext';
//
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './contexts/JWTContext';
import { UIProvider } from './contexts/UiContext';

// ----------------------------------------------------------------------

ReactDOM.render(
  <AuthProvider>
    <StrictMode>
      <HelmetProvider>
        <SettingsProvider>
        <UIProvider>
          <CollapseDrawerProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </CollapseDrawerProvider>
          </UIProvider>
        </SettingsProvider>
      </HelmetProvider>
    </StrictMode>
  </AuthProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
