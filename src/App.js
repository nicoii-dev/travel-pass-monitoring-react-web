import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

// components
import ScrollToTop from "./components/ScrollToTop";
import store from "./store";
import MainRoute from "./routes/MainRoute";
import ThemeProvider from "./theme";
// css
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <ScrollToTop />
        <ToastContainer />
        <MainRoute />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
