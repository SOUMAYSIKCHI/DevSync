import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Provider } from "react-redux";
import appStore from "./Utils/appStore.jsx";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { SocketProvider } from "./Pages/SocketContext.jsx";
createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={appStore}>
      <SocketProvider>
        <App />
        <Toaster />
      </SocketProvider>
    </Provider>
  </BrowserRouter>
);
