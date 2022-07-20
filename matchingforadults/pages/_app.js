import 'react-toastify/dist/ReactToastify.css';
import 'styles/app.scss';
import { Provider } from "react-redux";
import store from "store";
import { ToastContainer } from "react-toastify";
import DynamicLayout from 'layouts/DynamicLayout';
import AppLayout from 'layouts/App';
import AccessCheck from 'components/AccessCheck';
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';

let persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer
          theme="dark"
        />
        <AccessCheck mode={Component.accessMode}>
          <AppLayout isBlank={Component.isBlank}>
            <DynamicLayout layouts={Component.layouts}>
              <Component {...pageProps} />
            </DynamicLayout>
          </AppLayout>
        </AccessCheck>
      </PersistGate>
    </Provider>
  );
}

export default App;
