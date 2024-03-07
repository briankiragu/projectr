/* @refresh reload */
import { lazy } from "solid-js";
import { render } from "solid-js/web";
import { Route, Router } from "@solidjs/router";
import { inject } from "@vercel/analytics"
import { injectSpeedInsights } from "@vercel/speed-insights";

// Import global styles.
import "./index.css";

// Import components.
import App from "@pages/App";
import Dashboard from "@pages/Dashboard"
const Project = lazy(() => import("@pages/Project"));

// Get the root element
const root = document.getElementById("root");

// Register service worker.
if (
  // import.meta.env.PROD &&
  "serviceWorker" in navigator
) {
  navigator.serviceWorker.register("./sw.js");
}

// Vercel insights.
inject();
injectSpeedInsights();

render(
  () => (
    <Router root={App}>
      <Route path="/" component={Dashboard} />
      <Route path="/project" component={Project} />
    </Router>
  ),
  root!
);
