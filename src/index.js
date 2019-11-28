import React from 'react';
import ReactDOM from 'react-dom';
import 'ress'
import App from '~/src/App';
// import registerServiceWorker from './registerServiceWorker';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react'

import store, { persistor } from './store'
import "@kenshooui/react-multi-select/dist/style.css"
import injectTapEventPlugin from 'react-tap-event-plugin';
import {MuiThemeProvider} from '@material-ui/core/styles'
import {theme} from './theme/theme'  // 追加
import 'typeface-roboto';

ReactDOM.render((
    <Provider store={store} >
        <PersistGate loading={null} persistor={persistor}>
        <BrowserRouter>
                <MuiThemeProvider theme={theme}>  {/* 追加 */}

                    <App />
                </MuiThemeProvider>  {/* 追加 */}
            </BrowserRouter>
        </PersistGate>
    </Provider>
), document.getElementById('root'));

// registerServiceWorker();
