/* @refresh reload */
import { lazy } from 'solid-js';
import { render } from 'solid-js/web';
import { Route, Router } from '@solidjs/router';
import { injectSpeedInsights } from '@vercel/speed-insights';

// Import global styles.
import './index.css';

// Import components.
import App from '@pages/App';
const Project = lazy(() => import('@pages/Project'));
const Dashboard = lazy(() => import('@pages/Dashboard'));

// Get the root element
const root = document.getElementById('root');

// Vercel insights.
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
