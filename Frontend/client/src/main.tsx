import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { CategoryProvider } from "./context/CategoryContext.tsx";
import { ProductProvider } from "./context/ProductContext.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ColorProvider } from "./context/ColorContext.tsx";
import { CapacityProvider } from "./context/CapacityContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <CategoryProvider>
        <ProductProvider>
          <AuthProvider>
            <ColorProvider>
              <CapacityProvider>
                <App />
              </CapacityProvider>
            </ColorProvider>
          </AuthProvider>
        </ProductProvider>
      </CategoryProvider>
    </BrowserRouter>
  </React.StrictMode>
);
