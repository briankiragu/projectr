/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { onCLS, onFID, onLCP } from "web-vitals";

// Import global styles.
import "./index.css";

// Import constants...
import { RECEIVER_PAGE } from "./lib/constants";

// Import components...
import App from "@pages/App";
import Controller from "@pages/Controller";
const Receiver = lazy(() => import("@pages/Receiver"));

// Get the root element
const root = document.getElementById("root");

// Register service worker.
navigator.serviceWorker.register("./sw.js");

// Web vitals (Development only).
if (import.meta.env.DEV) {
  onCLS(console.log);
  onFID(console.log);
  onLCP(console.log);
}

// Vercel insights.
inject();
injectSpeedInsights();

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Controller} />
      <Route path={`/${RECEIVER_PAGE}/:id?`} component={Receiver} />
    </Router>
  ),
  root!
);
