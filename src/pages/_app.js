import Head from 'next/head';
import Script from 'next/experimental-script'
import { Provider } from 'react-redux';
import Layout from '../layouts';
import { useStore } from '../redux/store';
import { SWRConfig } from 'swr';
import axios from 'axios';
import Router from 'next/router';
import NProgress from 'nprogress';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';
import '../css/tailwind.css';
import '../css/main.css';
import '../css/layouts/layout-1.css';
import '../css/animate.css';
import '../css/components/buttons.css';
import '../css/components/datepicker.css';
import '../css/components/dropdowns.css';
import '../css/components/forms.css';
import '../css/components/left-sidebar-1/styles-lg.css';
import '../css/components/left-sidebar-1/styles-sm.css';
import '../css/components/modals.css';
import '../css/components/navbar.css';
import '../css/components/nprogress.css';
import '../css/components/recharts.css';
import '../css/components/right-sidebar.css';
import '../css/components/sliders.css';
import '../css/components/steps.css';
import '../css/components/tables.css';
import '../css/components/tabs.css';
import '../css/components/user-widgets/widget-2.css';
import '../css/components/user-widgets/widget-4.css';
import { PersistGate } from 'redux-persist/integration/react';
Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

export default function App({ Component, pageProps }) {
  const { store, persistor } = useStore(pageProps.initialReduxState);

  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Script
        src="https://sdk.monnify.com/plugin/monnify.js"
      />
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          {/* <SWRConfig
            value={{ fetcher: (url) => axios(url).then((r) => r.data) }}
          > */}
          <Layout>
            <Component {...pageProps} />
          </Layout>
          {/* </SWRConfig> */}
        </PersistGate>
      </Provider>
    </>
  );
}
