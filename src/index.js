import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { PostsProvider } from "./contexts/blog-items.context";
import { ReservationProvider } from "./contexts/reservation-view.context";
import { RodoProvider } from "./contexts/rodo-banner.context";
import { DarkModeProvider } from "./contexts/dark-mode.context";
import App from "./App";
import "./global-styles/index.scss";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
    <DarkModeProvider>
      <RodoProvider>
        <ReservationProvider>
          <PostsProvider>
            <App />
          </PostsProvider>
        </ReservationProvider>
      </RodoProvider>
      </DarkModeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
