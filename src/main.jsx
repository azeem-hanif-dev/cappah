import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { store } from "./Redux/store/store.js";
import { Provider } from "react-redux";
import { CategoriesProvider } from "./Context/CategoriesContext"; // Import your context provider
import Router from "./Routes/Route.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* Wrap the entire app with the CategoriesProvider */}
    <Provider store={store}>
      <CategoriesProvider>
        <Router />
      </CategoriesProvider>
    </Provider>
  </StrictMode>
);
