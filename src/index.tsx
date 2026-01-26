/* @refresh reload */
import { Route, Router } from "@solidjs/router";
import { inject } from "@vercel/analytics";
import { injectSpeedInsights } from "@vercel/speed-insights";
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { onCLS, onFID, onLCP } from "web-vitals";

// Import global styles.
import "./index.css";

// Import components...
import App from "@pages/App";
import Controller from "@pages/Controller";

// Lazy-load components
const Audience = lazy(() => import("@pages/Audience"));
const Prompter = lazy(() => import("@pages/Prompter"));

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
      <Route path={`/audience/:id?`} component={Audience} />
      <Route path={`/prompter/:id?`} component={Prompter} />
    </Router>
  ),
  root!
);
