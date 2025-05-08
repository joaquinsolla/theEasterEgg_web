import React from 'react';
import ReactDOM from 'react-dom/client';
import { IntlProvider } from 'react-intl';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { EuiProvider } from '@elastic/eui';

import backend, { NetworkError } from './backend';
import app, { App } from './modules/app/';
import { store, persistor } from './store';
import { initReactIntl } from './i18n';

backend.init(error => store.dispatch(app.actions.error(new NetworkError())));

const { locale, messages } = initReactIntl();

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <React.StrictMode>
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <IntlProvider locale={locale} messages={messages}>
                    <EuiProvider colorMode="dark">
                        <App />
                    </EuiProvider>
                </IntlProvider>
            </PersistGate>
        </Provider>
    </React.StrictMode>
);