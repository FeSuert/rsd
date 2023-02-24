import '../styles/globals.css'
import '../styles/sidebar.css'
import '../styles/safes.css'
import '../styles/wallets.css'
import '../styles/mainpage.css'
import { AppContextProvider } from "../context/AppContext";
import { Provider } from "../context/Context";

function MyApp({ Component, pageProps }) {
  return (
    // <AppContextProvider>
    <Provider>
      <Component {...pageProps} />
    </Provider>

    // </AppContextProvider>
  );
}

export default MyApp;
